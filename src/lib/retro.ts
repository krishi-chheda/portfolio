// KRISHI.WORLD visual constants, shared by both modes (no React, no Phaser).

export type Rarity = "Common" | "Rare" | "Epic" | "Legendary";
// Light / mid / dark shades per rarity: crystal sprites and icons. Presentation only, never a skill level.
export const RARITY_COLORS: Record<Rarity, [string, string, string]> = {
  Common: ["#c9eab0", "#97cd74", "#5e9e48"],
  Rare: ["#d4f0f8", "#7bc9df", "#4791c4"],
  Epic: ["#e2d0fa", "#b48be8", "#7a52b8"],
  Legendary: ["#fff1c4", "#f5c65b", "#c9902e"],
};

// Gem shades per Skilldex category, in skillCategories order. Colour only tells categories apart.
export const CATEGORY_GEMS: readonly (readonly [string, string, string])[] = [
  RARITY_COLORS.Common,
  RARITY_COLORS.Epic,
  RARITY_COLORS.Rare,
  RARITY_COLORS.Legendary,
];

// Project id → its HQ building in the game.
export const PROJECT_BUILDING = {
  clinicalbrief: "bldg-clinicalbrief",
  "accessible-vision": "bldg-accessvision",
  "traffic-ai": "bldg-traffic",
  "krishi-os": "bldg-os",
} as const;
