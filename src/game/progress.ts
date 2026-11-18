// Saved progress (this browser only). Storage can be unavailable (private mode, blocked site data), so every
// access is guarded and the game still works, just without remembering.

const KEY = "krishi-world:progress:v1";

interface Progress {
  attributes: string[]; // discovered attribute ids, in discovery order
}

function read(): Progress {
  try {
    const parsed = JSON.parse(localStorage.getItem(KEY) ?? "null");
    if (parsed && Array.isArray(parsed.attributes)) return { attributes: parsed.attributes.filter((a: unknown) => typeof a === "string") };
  } catch {
    // fall through to a fresh save
  }
  return { attributes: [] };
}

export function discovered(): string[] {
  return read().attributes;
}

export function discover(id: string) {
  const progress = read();
  if (progress.attributes.includes(id)) return;
  progress.attributes.push(id);
  try {
    localStorage.setItem(KEY, JSON.stringify(progress));
  } catch {
    // not saved; the discovery still counts for this visit via the in-memory UI state
  }
}
