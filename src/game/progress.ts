// Saved progress (this browser only). Storage can be unavailable (private mode, blocked site data), so every
// access is guarded and the game still works, just without remembering.
// Achievements aren't stored: they're derived from this snapshot (see ACHIEVEMENTS in content.ts).

import type { ProgressSnapshot } from "./content";

const KEY = "krishi-world:progress:v1";
type Field = keyof ProgressSnapshot;
const FIELDS: Field[] = ["attributes", "regions", "terminals"];

function read(): ProgressSnapshot {
  const empty: ProgressSnapshot = { attributes: [], regions: [], terminals: [] };
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (!parsed || typeof parsed !== "object") return empty;
    // Older saves only had `attributes`; missing lists start empty
    for (const f of FIELDS) if (Array.isArray(parsed[f])) empty[f] = parsed[f].filter((v: unknown) => typeof v === "string");
  } catch {
    // fall through to a fresh save
  }
  return empty;
}

export function snapshot(): ProgressSnapshot {
  return read();
}

export function discovered(): string[] {
  return read().attributes;
}

/** Adds an id to one list (no duplicates) and saves. */
export function record(field: Field, id: string) {
  const progress = read();
  if (progress[field].includes(id)) return;
  progress[field].push(id);
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // not saved; the UI keeps its own copy for this visit
  }
}

export const discover = (id: string) => record("attributes", id);
