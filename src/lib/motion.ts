// KRISHI.OS motion identity: one signature curve, three durations, one entrance pattern (rise + fade).
// Corporate/terminal personality: decisive deceleration, no overshoot.
export const EASE = "power3.out";

export const DUR = {
  quick: 0.15,
  standard: 0.3,
  slow: 0.5,
} as const;

// Entrance pattern: travel distance in px for panels and list items.
export const RISE = { panel: 16, item: 10 } as const;

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";
