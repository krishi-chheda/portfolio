// Player settings (sound, music, motion) and the saved position, both per browser. Like progress.ts, every
// storage access is guarded: blocked storage just means nothing is remembered. No Phaser import.

import type { Dir } from "./textures";

export interface Settings {
  sound: boolean;
  music: boolean;
  reducedMotion: boolean; // on top of the OS "reduce motion" setting, which always wins
}

const SETTINGS_KEY = "krishi-world:settings:v1";
const POSITION_KEY = "krishi-world:position:v1";
const DEFAULTS: Settings = { sound: true, music: true, reducedMotion: false };

function load<T>(key: string): Partial<T> | null {
  try {
    const v = JSON.parse(localStorage.getItem(key) ?? "null");
    return v && typeof v === "object" ? v : null;
  } catch {
    return null;
  }
}

function save(key: string, value: unknown) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // not remembered
  }
}

let current: Settings | null = null;

export function getSettings(): Settings {
  if (!current) {
    const saved = load<Settings>(SETTINGS_KEY) ?? {};
    current = {
      sound: typeof saved.sound === "boolean" ? saved.sound : DEFAULTS.sound,
      music: typeof saved.music === "boolean" ? saved.music : DEFAULTS.music,
      reducedMotion: typeof saved.reducedMotion === "boolean" ? saved.reducedMotion : DEFAULTS.reducedMotion,
    };
  }
  return current;
}

export function setSettings(patch: Partial<Settings>): Settings {
  current = { ...getSettings(), ...patch };
  // Only what the player chose is stored, so untouched settings keep following the defaults
  save(SETTINGS_KEY, { ...load<Settings>(SETTINGS_KEY), ...patch });
  return current;
}

/** OS preference or the in-game toggle. */
export function reduceMotion() {
  return getSettings().reducedMotion || window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export interface Position {
  mapId: string;
  x: number;
  y: number;
  facing: Dir;
}

export function savedPosition(): Position | null {
  const p = load<Position>(POSITION_KEY);
  if (!p || typeof p.mapId !== "string" || typeof p.x !== "number" || typeof p.y !== "number") return null;
  const facing: Dir = p.facing === "up" || p.facing === "left" || p.facing === "right" ? p.facing : "down";
  return { mapId: p.mapId, x: p.x, y: p.y, facing };
}

export function savePosition(p: Position) {
  save(POSITION_KEY, p);
}
