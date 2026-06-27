import { NextResponse } from "next/server";

// Simple in-memory cache to prevent rate-limiting (TTL: 5 minutes)
let cache: any = null;
let cacheTime = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

// Curated list of repositories to retrieve stats for
const TARGET_REPOS = [
  "AccessVision",
  "student-hub",
  "AuraLens-AI",
  "f1-telemetry-ai-dashboard",
  "F1-telemetry-analyzer",
  "fastapi_backend",
  "video-splitter",
  "portfolio"
];

export async function GET() {
  const now = Date.now();

  // Return cached data if still valid
  if (cache && now - cacheTime < CACHE_DURATION) {
    return NextResponse.json(cache, {
      headers: {
        "X-Cache": "HIT",
        "Access-Control-Allow-Origin": "*"
      }
    });
  }

  try {
    const headers = {
      "User-Agent": "krishi-portfolio-agent",
      Accept: "application/vnd.github.v3+json"
    };

    // 1. Fetch all user repositories
    const reposRes = await fetch("https://api.github.com/users/krishi-chheda/repos?per_page=100", {
      headers,
      next: { revalidate: 300 } // Next.js fetch cache fallback
    });

    if (!reposRes.ok) {
      throw new Error(`GitHub API returned status ${reposRes.status} for repos list`);
    }

    const reposData = await reposRes.json();
    if (!Array.isArray(reposData)) {
      throw new Error("Invalid response format from GitHub repos API");
    }

    // 2. Fetch public events to extract recent commits
    let eventsData: any[] = [];
    try {
      const eventsRes = await fetch("https://api.github.com/users/krishi-chheda/events/public", {
        headers,
        next: { revalidate: 300 }
      });
      if (eventsRes.ok) {
        eventsData = await eventsRes.json();
      }
    } catch (e) {
      console.error("Failed to fetch GitHub public events feed:", e);
    }

    // Process repositories details
    const repoStats: Record<string, any> = {};

    // Initialize all target repos with default/fallback values
    TARGET_REPOS.forEach((repo) => {
      repoStats[repo] = {
        name: repo,
        stars: 0,
        forks: 0,
        updatedAt: new Date().toISOString(),
        language: "Python",
        latestCommit: {
          hash: "main",
          message: "Updated repository details",
          date: new Date().toISOString()
        }
      };
    });

    // Populate from repos data
    reposData.forEach((repo: any) => {
      const matchedName = TARGET_REPOS.find(
        (target) => target.toLowerCase() === repo.name.toLowerCase()
      );

      if (matchedName) {
        repoStats[matchedName] = {
          name: repo.name,
          stars: repo.stargazers_count,
          forks: repo.forks_count,
          updatedAt: repo.updated_at,
          language: repo.language || "Python",
          latestCommit: {
            hash: "main",
            message: "Updated repository details",
            date: repo.updated_at
          }
        };
      }
    });

    // Extract latest commit info from the events feed for target repos
    if (Array.isArray(eventsData)) {
      eventsData.forEach((event: any) => {
        if (event.type === "PushEvent" && event.payload?.commits?.length > 0) {
          const repoNameOnly = event.repo.name.split("/")[1];
          const matchedName = TARGET_REPOS.find(
            (target) => target.toLowerCase() === repoNameOnly.toLowerCase()
          );

          if (matchedName) {
            const commit = event.payload.commits[0]; // Most recent commit in the push
            const commitHash = commit.sha ? commit.sha.substring(0, 7) : "main";
            // Check if we already found a more recent commit in the events list
            const currentCommitDate = new Date(repoStats[matchedName].latestCommit.date);
            const eventDate = new Date(event.created_at);

            if (eventDate > currentCommitDate || repoStats[matchedName].latestCommit.hash === "main") {
              repoStats[matchedName].latestCommit = {
                hash: commitHash,
                message: commit.message || "Updated code files",
                date: event.created_at
              };
            }
          }
        }
      });
    }

    // Set cache
    cache = {
      lastUpdated: now,
      repos: repoStats
    };
    cacheTime = now;

    return NextResponse.json(cache, {
      headers: {
        "X-Cache": "MISS",
        "Access-Control-Allow-Origin": "*"
      }
    });
  } catch (error: any) {
    console.error("GitHub API routing error:", error);

    // If API fails, return current cache if exists, otherwise a safe fallback
    if (cache) {
      return NextResponse.json(cache, {
        headers: {
          "X-Cache": "FALLBACK",
          "Access-Control-Allow-Origin": "*"
        }
      });
    }

    // Safe bootstrap fallback so site does not crash
    const nowIso = new Date().toISOString();
    const fallbackStats: Record<string, any> = {};
    TARGET_REPOS.forEach((repo) => {
      fallbackStats[repo] = {
        name: repo,
        stars: 0,
        forks: 0,
        updatedAt: nowIso,
        language: repo === "student-hub" || repo === "f1-telemetry-ai-dashboard" || repo === "portfolio" ? "TypeScript" : "Python",
        latestCommit: {
          hash: "main",
          message: "Commit updates fetched dynamically",
          date: nowIso
        }
      };
    });

    return NextResponse.json(
      {
        lastUpdated: now,
        repos: fallbackStats,
        error: error.message || "Fallback active"
      },
      {
        headers: {
          "Access-Control-Allow-Origin": "*"
        }
      }
    );
  }
}
