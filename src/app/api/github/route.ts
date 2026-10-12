import { NextResponse } from "next/server";
import { additionalProjectsData, projectsData } from "@/lib/data";
import { GITHUB_USER, repoKey, type CommitTelemetry, type RepoTelemetry, type TelemetryResponse } from "@/lib/github";

// GitHub responses are cached in the Next data cache. Worst case per window: 1 list + 1 commit call per
// tracked repo (~10), well under the 60 req/h unauthenticated limit. GITHUB_TOKEN (optional, server-only) raises it.
const REVALIDATE_SECONDS = 900;

const TRACKED = [...projectsData, ...additionalProjectsData].flatMap((p) => (p.githubUrl ? [repoKey(p.githubUrl)] : []));

// Last successful snapshot in this server instance, served (marked stale) if GitHub fails.
let lastGood: TelemetryResponse | null = null;

interface GhRepo {
  name: string;
  html_url: string;
  language: string | null;
  pushed_at: string;
}

interface GhCommit {
  sha: string;
  html_url: string;
  commit: { message: string; committer: { date: string } | null };
}

function gh(path: string) {
  const headers: Record<string, string> = {
    Accept: "application/vnd.github+json",
    "User-Agent": "krishi-portfolio",
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;
  // Timeout so a hung GitHub call fails into the existing null/503 handling instead of holding the request
  return fetch(`https://api.github.com${path}`, { headers, next: { revalidate: REVALIDATE_SECONDS }, signal: AbortSignal.timeout(10_000) });
}

// Missing, empty (409) or rate-limited repos yield null: the UI omits the commit rather than inventing one.
async function latestCommit(repo: string): Promise<CommitTelemetry | null> {
  try {
    const res = await gh(`/repos/${GITHUB_USER}/${repo}/commits?per_page=1`);
    if (!res.ok) return null;
    const [c] = (await res.json()) as GhCommit[];
    if (!c?.commit.committer?.date) return null;
    return {
      sha: c.sha.slice(0, 7),
      message: c.commit.message.split("\n")[0],
      date: c.commit.committer.date,
      url: c.html_url,
    };
  } catch {
    return null;
  }
}

export async function GET() {
  try {
    const res = await gh(`/users/${GITHUB_USER}/repos?per_page=100`);
    if (!res.ok) throw new Error(`GitHub repos list returned ${res.status}`);
    const list = (await res.json()) as GhRepo[];
    const byKey = new Map(list.map((r) => [r.name.toLowerCase(), r]));

    const entries = await Promise.all(
      TRACKED.map(async (key): Promise<[string, RepoTelemetry] | null> => {
        const r = byKey.get(key);
        if (!r) return null; // private or deleted: omit, never invent
        return [key, { name: r.name, url: r.html_url, language: r.language, pushedAt: r.pushed_at, latestCommit: await latestCommit(r.name) }];
      })
    );

    lastGood = {
      fetchedAt: new Date(res.headers.get("date") ?? Date.now()).toISOString(),
      stale: false,
      repos: Object.fromEntries(entries.filter((e) => e !== null)),
    };
    return NextResponse.json(lastGood);
  } catch (err) {
    console.error("GitHub telemetry unavailable:", err);
    if (lastGood) return NextResponse.json({ ...lastGood, stale: true });
    return NextResponse.json({ error: "GitHub data unavailable" }, { status: 503 });
  }
}
