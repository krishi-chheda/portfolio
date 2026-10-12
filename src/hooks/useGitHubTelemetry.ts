import { useEffect, useState } from "react";
import type { TelemetryResponse } from "@/lib/github";

// One request per page load, shared by every component that shows GitHub data.
let request: Promise<TelemetryResponse | null> | null = null;

function load() {
  request ??= fetch("/api/github")
    .then((res) => (res.ok ? (res.json() as Promise<TelemetryResponse>) : null))
    .catch(() => null);
  return request;
}

// data is null while loading or when GitHub is unavailable; callers render nothing in that case.
export function useGitHubTelemetry() {
  const [state, setState] = useState<{ data: TelemetryResponse | null; loading: boolean }>({ data: null, loading: true });

  useEffect(() => {
    let live = true;
    load().then((data) => {
      if (live) setState({ data, loading: false });
    });
    return () => {
      live = false;
    };
  }, []);

  return state;
}
