// KRISHI.WORLD visual constants, shared by both modes (no React, no Phaser).

export const PALETTE = {
  forest: "#285943",
  grass: "#78b85a",
  cream: "#f5e8c8",
  brown: "#46382b",
  sky: "#7bc9df",
  gold: "#f5c65b",
  ink: "#2b2420",
  inkSoft: "#6e5643",
} as const;

export type Rarity = "Common" | "Rare" | "Epic" | "Legendary";
// Light / mid / dark shades per rarity: crystal sprites and icons. Presentation only, never a skill level.
export const RARITY_COLORS: Record<Rarity, [string, string, string]> = {
  Common: ["#c9eab0", "#97cd74", "#5e9e48"],
  Rare: ["#d4f0f8", "#7bc9df", "#4791c4"],
  Epic: ["#e2d0fa", "#b48be8", "#7a52b8"],
  Legendary: ["#fff1c4", "#f5c65b", "#c9902e"],
};
