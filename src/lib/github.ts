// Shared between /api/github and the UI. Repos are tracked explicitly: only those linked from
// projectsData / additionalProjectsData, never "whatever the account has".

export const GITHUB_USER = "krishi-chheda";

export interface CommitTelemetry {
  sha: string;
  message: string;
  date: string;
  url: string;
}

export interface RepoTelemetry {
  name: string;
  url: string;
  language: string | null;
  pushedAt: string;
  latestCommit: CommitTelemetry | null;
}

export interface TelemetryResponse {
  // When GitHub produced this data (its Date header), not when it was served.
  fetchedAt: string;
  // True when GitHub is unreachable and the last successful snapshot is being served.
  stale: boolean;
  repos: Record<string, RepoTelemetry>;
}

// Lowercased repo name from a GitHub URL, e.g. ".../krishi-chheda/ClinicalBrief" -> "clinicalbrief".
export function repoKey(githubUrl: string): string {
  return githubUrl.replace(/\/+$/, "").split("/").pop()!.toLowerCase();
}

export function formatUtc(iso: string): string {
  return `${new Date(iso).toLocaleString("en-AU", { timeZone: "UTC", dateStyle: "medium", timeStyle: "short" })} UTC`;
}
