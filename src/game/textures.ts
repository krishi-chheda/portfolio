import type Phaser from "phaser";
import { RARITY_COLORS } from "@/lib/retro";

// All KRISHI.WORLD art is original and drawn in code at boot: no sprite files, nothing copyrighted.
// Style target: GBA-era top-down RPG (dotted grass, bushy 2x2 trees, tiled roofs, dark sprite outlines).
// Tiles are 16x16. Paths, sand and water are auto-tiled: each has 16 variants, one per combination of
// which neighbours (N/E/S/W) are the same terrain, so edges and corners blend instead of looking blocky.

export const TILE = 16;

const C = {
  grass: "#78b85a",
  grassLight: "#97cd74",
  grassDark: "#5e9e48",
  leaf: "#3f8f4a",
  leafDark: "#2b6b39",
  leafLight: "#6fbf5c",
  leafShine: "#a6dc7c",
  trunk: "#6b4a32",
  path: "#e0c48c",
  pathLight: "#ecd6a6",
  pathRim: "#b99a62",
  sand: "#f2e2b4",
  sandDark: "#dcc78f",
  water: "#62b4dc",
  waterDark: "#4791c4",
  waterLight: "#a9def0",
  foam: "#e4f6fb",
  roof: "#d9773f",
  roofDark: "#a8542a",
  roofDeep: "#7a3a1d",
  roofLight: "#f0a060",
  slate: "#5b7fae",
  slateDark: "#3f5f8a",
  slateLight: "#86a6cf",
  wall: "#f5e8c8",
  wallShade: "#d9c69c",
  wood: "#9a6a3c",
  woodDark: "#6e4524",
  woodLight: "#bf8a52",
  glass: "#7bc9df",
  glassLight: "#d4f0f8",
  gold: "#f5c65b",
  red: "#e0564a",
  redDark: "#a83a32",
  white: "#ffffff",
  outline: "#1f1d24",
  skin: "#f2c9a0",
  skinShade: "#d9a37a",
  hair: "#3b2a20",
  hairLight: "#5a4030",
  hoodie: "#2fae7c",
  hoodieDark: "#1f7d58",
  accent: "#34d399",
  pants: "#2c3a5a",
  shoe: "#2a2220",
} as const;

// ---------- pixel buffer ----------

type RGBA = [number, number, number, number];
const cache = new Map<string, RGBA>();
function rgba(color: string, alpha = 255): RGBA {
  const key = color + alpha;
  let v = cache.get(key);
  if (!v) {
    const n = parseInt(color.slice(1), 16);
    v = [(n >> 16) & 255, (n >> 8) & 255, n & 255, alpha];
    cache.set(key, v);
  }
  return v;
}

class Pix {
  readonly data: Uint8ClampedArray<ArrayBuffer>;
  constructor(readonly w: number, readonly h: number) {
    this.data = new Uint8ClampedArray(w * h * 4);
  }
  set(x: number, y: number, color: string, alpha = 255) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return;
    this.data.set(rgba(color, alpha), (Math.floor(y) * this.w + Math.floor(x)) * 4);
  }
  alpha(x: number, y: number) {
    if (x < 0 || y < 0 || x >= this.w || y >= this.h) return 0;
    return this.data[(y * this.w + x) * 4 + 3];
  }
  rect(x: number, y: number, w: number, h: number, color: string, alpha = 255) {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) this.set(x + i, y + j, color, alpha);
  }
  disc(cx: number, cy: number, r: number, color: string) {
    for (let y = Math.floor(cy - r); y <= cy + r; y++)
      for (let x = Math.floor(cx - r); x <= cx + r; x++) if ((x - cx) ** 2 + (y - cy) ** 2 <= r * r) this.set(x, y, color);
  }
  /** GBA-style 1px dark outline around everything opaque inside the box (transparent pixels next to opaque ones). */
  outline(x0: number, y0: number, w: number, h: number, color: string = C.outline) {
    const marks: [number, number][] = [];
    for (let y = y0; y < y0 + h; y++)
      for (let x = x0; x < x0 + w; x++) {
        if (this.alpha(x, y) > 0) continue;
        const near = [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => {
          const nx = x + dx;
          const ny = y + dy;
          return nx >= x0 && ny >= y0 && nx < x0 + w && ny < y0 + h && this.alpha(nx, ny) === 255;
        });
        if (near) marks.push([x, y]);
      }
    for (const [x, y] of marks) this.set(x, y, color);
  }
  toCanvas() {
    const c = document.createElement("canvas");
    c.width = this.w;
    c.height = this.h;
    c.getContext("2d")?.putImageData(new ImageData(this.data, this.w, this.h), 0, 0);
    return c;
  }
  toTexture(scene: Phaser.Scene, key: string) {
    const tex = scene.textures.createCanvas(key, this.w, this.h);
    if (!tex) throw new Error(`Could not create texture ${key}`);
    tex.context.putImageData(new ImageData(this.data, this.w, this.h), 0, 0);
    tex.refresh();
    return tex;
  }
}

// Deterministic hash noise so the art is identical on every load
function noise(x: number, y: number, seed = 0) {
  let h = (x * 374761393 + y * 668265263 + seed * 2246822519) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
}

// ---------- terrain tiles ----------

/** Neighbour bits: set when that neighbour is the same terrain. */
export const N = 1;
export const E = 2;
export const S = 4;
export const W = 8;

// Tile sheet layout
export const T = {
  GRASS: 0,
  GRASS_2: 1,
  FLOWER: 2,
  TALL: 3,
  FENCE: 4,
  PAVE: 5,
  DOCK: 6,
  PATH: 8, // + mask (16 variants)
  SAND: 24, // + mask
  WATER: 40, // + mask, frame A
  WATER_B: 56, // + mask, frame B
} as const;
const SHEET_TILES = 72;

function grassTile(p: Pix, ox: number, seed: number, dense: boolean) {
  p.rect(ox, 0, TILE, TILE, C.grass);
  // The GBA "dotted" grass: a staggered dot grid plus a little noise
  for (let y = 0; y < TILE; y++)
    for (let x = 0; x < TILE; x++) {
      if ((x + (y % 8 < 4 ? 0 : 2)) % 4 === 1 && y % 4 === 1) p.set(ox + x, y, C.grassLight);
      else if (noise(x, y, seed) < (dense ? 0.06 : 0.025)) p.set(ox + x, y, C.grassDark);
    }
}

/**
 * Edged terrain (path / sand / water): fill inside, `outsideTile` beyond each open side, a wobbly border and
 * rounded corners where two open sides meet.
 */
function edgedTile(
  p: Pix,
  ox: number,
  mask: number,
  outsideTile: (p: Pix, ox: number) => void,
  inside: (x: number, y: number) => string,
  rim: string,
  seed: number
) {
  outsideTile(p, ox);
  const R = 5;
  const isInside = (x: number, y: number) => {
    const depth = (pos: number, side: number) => 2 + (noise(pos, side, seed) < 0.35 ? 1 : 0);
    const dN = mask & N ? 99 : y;
    const dS = mask & S ? 99 : 15 - y;
    const dW = mask & W ? 99 : x;
    const dE = mask & E ? 99 : 15 - x;
    if (dN < depth(x, 1) || dS < depth(x, 2) || dW < depth(y, 3) || dE < depth(y, 4)) return false;
    // Round the corner between two open sides
    for (const [a, b] of [[dN, dW], [dN, dE], [dS, dW], [dS, dE]])
      if (a < R && b < R && (R - a) ** 2 + (R - b) ** 2 > (R - 1) ** 2) return false;
    return true;
  };
  for (let y = 0; y < TILE; y++)
    for (let x = 0; x < TILE; x++) {
      if (!isInside(x, y)) continue;
      // Rim where an outside pixel is adjacent. Off-tile pixels on a connected side count as inside, so the
      // seam between two same-terrain tiles never gets a rim.
      const edge = !isInside(x + 1, y) || !isInside(x - 1, y) || !isInside(x, y + 1) || !isInside(x, y - 1);
      p.set(ox + x, y, edge ? rim : inside(x, y));
    }
}

const pathInside = (x: number, y: number) => (noise(x, y, 5) < 0.08 ? C.pathRim : noise(x, y, 6) < 0.1 ? C.pathLight : C.path);
const sandInside = (x: number, y: number) => (noise(x, y, 8) < 0.07 ? C.sandDark : C.sand);
const sandOutside = (p: Pix, ox: number) => {
  for (let y = 0; y < TILE; y++) for (let x = 0; x < TILE; x++) p.set(ox + x, y, sandInside(x, y));
};
function waterInside(shift: number) {
  return (x: number, y: number) => {
    const row = Math.floor(y / 4);
    const phase = (x + shift + (row % 2) * 4) % 8;
    if (y % 4 === 1 && phase < 3) return C.waterLight;
    if (y % 4 === 2 && phase >= 1 && phase < 4) return C.waterDark;
    return C.water;
  };
}

function flowerTile(p: Pix, ox: number) {
  grassTile(p, ox, 3, false);
  for (const [cx, cy] of [[4, 4], [11, 10]]) {
    p.rect(ox + cx - 1, cy - 2, 3, 5, C.red);
    p.rect(ox + cx - 2, cy - 1, 5, 3, C.red);
    p.set(ox + cx - 1, cy - 1, C.white);
    p.set(ox + cx, cy, C.gold);
    p.set(ox + cx + 1, cy + 1, C.redDark);
    p.set(ox + cx, cy + 3, C.leafDark);
  }
}

function tallTile(p: Pix, ox: number) {
  grassTile(p, ox, 9, false);
  // Leafy shrub clumps (walkable decoration)
  for (const [cx, cy] of [[4, 5], [11, 5], [7, 11], [13, 12], [2, 12]]) {
    p.disc(ox + cx, cy, 2.6, C.leaf);
    p.set(ox + cx - 1, cy - 1, C.leafLight);
    p.set(ox + cx, cy - 2, C.leafShine);
    p.set(ox + cx + 1, cy + 2, C.leafDark);
    p.set(ox + cx + 2, cy + 1, C.leafDark);
  }
}

function fenceTile(p: Pix, ox: number) {
  grassTile(p, ox, 13, false);
  p.rect(ox, 6, TILE, 2, C.woodLight);
  p.rect(ox, 8, TILE, 1, C.woodDark);
  p.rect(ox, 11, TILE, 2, C.woodLight);
  p.rect(ox, 13, TILE, 1, C.woodDark);
  for (const x of [2, 12]) {
    p.rect(ox + x, 3, 3, 12, C.wood);
    p.rect(ox + x, 3, 1, 12, C.woodLight);
    p.rect(ox + x + 2, 3, 1, 12, C.woodDark);
  }
}

function paveTile(p: Pix, ox: number) {
  for (let y = 0; y < TILE; y++)
    for (let x = 0; x < TILE; x++) {
      const joint = y % 8 === 7 || (x + (y < 8 ? 0 : 4)) % 8 === 7;
      p.set(ox + x, y, joint ? "#b9b1a0" : noise(x, y, 31) < 0.08 ? "#e6e0d2" : "#d6cfbf");
    }
}

function dockTile(p: Pix, ox: number) {
  p.rect(ox, 0, TILE, TILE, C.waterDark);
  for (let y = 0; y < TILE; y += 4) {
    p.rect(ox, y, TILE, 3, C.woodLight);
    p.rect(ox, y + 3, TILE, 1, C.woodDark);
    p.set(ox + ((y * 5) % 13) + 1, y + 1, C.wood);
  }
  p.rect(ox + 1, 0, 1, TILE, C.woodDark);
  p.rect(ox + 14, 0, 1, TILE, C.woodDark);
}

function drawTerrainSheet(p: Pix) {
  grassTile(p, T.GRASS * TILE, 1, false);
  grassTile(p, T.GRASS_2 * TILE, 2, true);
  flowerTile(p, T.FLOWER * TILE);
  tallTile(p, T.TALL * TILE);
  fenceTile(p, T.FENCE * TILE);
  paveTile(p, T.PAVE * TILE);
  dockTile(p, T.DOCK * TILE);
  const grassOutside = (q: Pix, ox: number) => grassTile(q, ox, 1, false);
  for (let m = 0; m < 16; m++) {
    edgedTile(p, (T.PATH + m) * TILE, m, grassOutside, pathInside, C.pathRim, 21);
    edgedTile(p, (T.SAND + m) * TILE, m, grassOutside, sandInside, C.sandDark, 23);
    edgedTile(p, (T.WATER + m) * TILE, m, sandOutside, waterInside(0), C.foam, 25);
    edgedTile(p, (T.WATER_B + m) * TILE, m, sandOutside, waterInside(4), C.foam, 25);
  }
}

// ---------- objects (multi-tile, drawn as sprites with outlines) ----------

export interface ObjectArt {
  w: number; // footprint in tiles
  h: number;
  door?: [number, number][]; // door tiles, relative to the footprint
  ph?: number; // sprite height in tiles when taller than the footprint (drawn upward from its bottom)
}

export const OBJECTS = {
  tree: { w: 2, h: 2 },
  house: { w: 5, h: 4, door: [[2, 3]] },
  university: { w: 8, h: 5, door: [[3, 4], [4, 4]] },
  sign: { w: 1, h: 1 },
  mailbox: { w: 1, h: 1 },
  lamp: { w: 1, h: 1, ph: 2 },
  fountain: { w: 3, h: 3 },
  "bldg-accessvision": { w: 6, h: 5, door: [[2, 4], [3, 4]] },
  "bldg-clinicalbrief": { w: 6, h: 5, door: [[2, 4], [3, 4]] },
  "bldg-traffic": { w: 6, h: 5, door: [[2, 4], [3, 4]] },
  "bldg-os": { w: 6, h: 5, door: [[2, 4], [3, 4]] },
  lab: { w: 6, h: 4, door: [[2, 3], [3, 3]] },
  computer: { w: 1, h: 1, ph: 2 },
  arena: { w: 8, h: 5, door: [[3, 4], [4, 4]] },
  office: { w: 5, h: 5, door: [[2, 4]] },
  flag: { w: 1, h: 1, ph: 2 },
  palm: { w: 1, h: 1, ph: 3 },
  hut: { w: 4, h: 3, door: [[1, 2]] },
  buoy: { w: 1, h: 1 },
  tripod: { w: 1, h: 1, ph: 2 },
  mat: { w: 1, h: 1 },
} satisfies Record<string, ObjectArt>;
export type ObjectKind = keyof typeof OBJECTS;

function drawTree(p: Pix) {
  // Ground shadow
  for (let x = 4; x < 28; x++) for (let y = 27; y < 31; y++) if (((x - 16) / 12) ** 2 + ((y - 29) / 2.2) ** 2 <= 1) p.set(x, y, C.leafDark, 110);
  p.rect(13, 22, 6, 7, C.trunk);
  p.rect(13, 22, 2, 7, C.woodLight);
  // Canopy: overlapping leaf clusters, drawn top to bottom so lower ones overlap (the scalloped GBA look)
  const clusters = [[16, 6], [10, 9], [22, 9], [6, 14], [16, 13], [26, 14], [10, 19], [22, 19], [16, 20]];
  for (const [cx, cy] of clusters) {
    p.disc(cx, cy, 6, C.leafDark);
    p.disc(cx - 0.5, cy - 0.5, 5, C.leaf);
    p.disc(cx - 1.5, cy - 1.5, 3, C.leafLight);
    p.set(cx - 2, cy - 3, C.leafShine);
    p.set(cx - 3, cy - 2, C.leafShine);
  }
  p.outline(0, 0, 32, 32);
}

function drawHouse(p: Pix) {
  const W_ = 80;
  // Roof (rows 2..39): shingles in offset rows, a ridge, and a raised upper tier
  for (let y = 3; y < 40; y++)
    for (let x = 1; x < W_ - 1; x++) {
      const row = Math.floor((y - 3) / 6);
      const shingle = (x + (row % 2) * 4) % 8 === 0;
      p.set(x, y, (y - 3) % 6 === 5 ? C.roofDark : shingle ? C.roofDark : C.roof);
    }
  p.rect(1, 3, W_ - 2, 2, C.roofDeep);
  p.rect(1, 5, W_ - 2, 1, C.roofLight);
  // Upper tier
  for (let y = 8; y < 22; y++) for (let x = 14; x < 66; x++) p.set(x, y, (y - 8) % 5 === 4 || (x + Math.floor((y - 8) / 5) * 3) % 7 === 0 ? C.roofDark : C.roof);
  p.rect(14, 8, 52, 1, C.roofLight);
  p.rect(14, 22, 52, 2, C.roofDeep);
  // Eave shadow
  p.rect(1, 38, W_ - 2, 2, C.roofDeep);
  // Walls (rows 40..63)
  p.rect(2, 40, W_ - 4, 23, C.wall);
  p.rect(2, 40, W_ - 4, 2, C.wallShade);
  p.rect(2, 61, W_ - 4, 2, C.wallShade);
  for (const x of [2, W_ - 6]) {
    p.rect(x, 40, 4, 23, C.wood);
    p.rect(x, 40, 1, 23, C.woodLight);
  }
  // Windows
  for (const x of [10, 56]) {
    p.rect(x, 45, 14, 10, C.woodDark);
    p.rect(x + 1, 46, 12, 8, C.glass);
    p.rect(x + 2, 47, 4, 2, C.glassLight);
    p.rect(x + 6, 46, 1, 8, C.woodDark);
  }
  // Door (tile column 2)
  p.rect(33, 44, 14, 19, C.woodDark);
  p.rect(34, 45, 12, 18, C.wood);
  p.rect(35, 46, 4, 7, C.woodLight);
  p.rect(41, 46, 4, 7, C.woodLight);
  p.set(43, 55, C.gold);
  p.outline(0, 0, W_, 64);
}

function drawUniversity(p: Pix) {
  const W_ = 128;
  // Slate roof
  for (let y = 3; y < 42; y++)
    for (let x = 1; x < W_ - 1; x++) {
      const row = Math.floor((y - 3) / 5);
      p.set(x, y, (y - 3) % 5 === 4 || (x + (row % 2) * 3) % 6 === 0 ? C.slateDark : C.slate);
    }
  p.rect(1, 3, W_ - 2, 2, C.slateDark);
  p.rect(1, 5, W_ - 2, 1, C.slateLight);
  // Central gable with an open-book emblem
  for (let y = 6; y < 30; y++) {
    const half = Math.floor((y - 6) * 1.1);
    for (let x = 64 - half; x < 64 + half; x++) p.set(x, y, C.wall);
    p.set(64 - half - 1, y, C.slateDark);
    p.set(64 + half, y, C.slateDark);
  }
  p.rect(58, 18, 12, 8, C.gold);
  p.rect(63, 18, 2, 8, C.roofDark);
  p.rect(59, 19, 3, 1, C.white);
  p.rect(66, 19, 3, 1, C.white);
  p.rect(1, 40, W_ - 2, 2, C.slateDark);
  // Stone facade with columns
  p.rect(2, 42, W_ - 4, 37, C.wall);
  for (let x = 6; x < W_ - 6; x += 16) {
    p.rect(x, 42, 5, 37, C.wallShade);
    p.rect(x, 42, 1, 37, C.white);
  }
  p.rect(2, 42, W_ - 4, 3, C.wallShade);
  p.rect(2, 76, W_ - 4, 3, C.wallShade);
  // Windows between the columns, skipping the doorway
  for (let x = 13; x < W_ - 10; x += 16) {
    if (x > 44 && x < 80) continue;
    p.rect(x, 50, 7, 12, C.woodDark);
    p.rect(x + 1, 51, 5, 10, C.glass);
    p.rect(x + 1, 51, 2, 3, C.glassLight);
  }
  // Double door on tile columns 3-4
  p.rect(50, 52, 28, 27, C.woodDark);
  p.rect(52, 54, 11, 25, C.wood);
  p.rect(65, 54, 11, 25, C.wood);
  p.rect(53, 55, 4, 9, C.woodLight);
  p.rect(66, 55, 4, 9, C.woodLight);
  p.set(61, 66, C.gold);
  p.set(66, 66, C.gold);
  p.outline(0, 0, W_, 80);
}

function drawSign(p: Pix) {
  p.rect(7, 9, 2, 6, C.woodDark);
  p.rect(2, 3, 12, 7, C.wood);
  p.rect(3, 4, 10, 1, C.woodLight);
  p.rect(4, 6, 8, 1, C.woodDark);
  p.rect(4, 8, 6, 1, C.woodDark);
  p.outline(0, 0, 16, 16);
}

function drawLamp(p: Pix) {
  p.rect(7, 8, 2, 23, "#3a3f4a");
  p.rect(7, 8, 1, 23, "#5a6170");
  p.rect(5, 29, 6, 2, "#3a3f4a");
  p.rect(4, 2, 8, 6, "#3a3f4a");
  p.rect(5, 3, 6, 4, C.gold);
  p.rect(5, 3, 2, 2, "#fff1c4");
  p.outline(0, 0, 16, 32);
}

function drawFountain(p: Pix) {
  p.disc(24, 25, 21, "#9c9486");
  p.disc(24, 25, 19, "#c8c0b0");
  p.disc(24, 25, 16, C.water);
  for (let a = 0; a < 6; a++) {
    const x = 24 + Math.cos(a) * 11;
    const y = 25 + Math.sin(a) * 9;
    p.rect(x, y, 3, 1, C.waterLight);
  }
  p.disc(24, 21, 5, "#c8c0b0");
  p.rect(23, 9, 3, 12, "#c8c0b0");
  p.rect(22, 7, 5, 3, C.waterLight);
  p.rect(23, 5, 3, 2, C.foam);
  p.outline(0, 0, 48, 48);
}

type Emblem = "eye" | "cross" | "light" | "prompt";

/** A project HQ: flat roof in the project's colour, glass facade, double door, and an emblem sign. */
function drawTower(p: Pix, roof: string, roofDark: string, roofLight: string, emblem: Emblem) {
  const W_ = 96;
  // Roof slab with a parapet
  p.rect(1, 2, W_ - 2, 30, roofDark);
  p.rect(3, 4, W_ - 6, 26, roof);
  for (let x = 6; x < W_ - 6; x += 10) p.rect(x, 8, 6, 4, roofLight); // rooftop units
  p.rect(3, 4, W_ - 6, 1, roofLight);
  // Facade: glass grid
  p.rect(2, 32, W_ - 4, 47, "#e8e4da");
  for (let y = 36; y < 58; y += 11)
    for (let x = 6; x < W_ - 8; x += 12) {
      p.rect(x, y, 9, 8, "#2f4a5c");
      p.rect(x + 1, y + 1, 7, 6, C.glass);
      p.rect(x + 1, y + 1, 3, 2, C.glassLight);
    }
  p.rect(2, 32, W_ - 4, 2, roofDark);
  // Emblem sign over the door
  p.rect(36, 58, 24, 9, "#1f1d24");
  const ink = roofLight;
  if (emblem === "eye") {
    p.rect(42, 62, 12, 1, ink);
    p.rect(44, 60, 8, 5, ink);
    p.rect(47, 61, 2, 3, "#1f1d24");
  } else if (emblem === "cross") {
    p.rect(46, 59, 4, 7, C.white);
    p.rect(44, 61, 8, 3, C.white);
  } else if (emblem === "light") {
    p.rect(45, 59, 6, 7, "#3a3f4a");
    p.set(47, 60, C.red);
    p.set(48, 60, C.red);
    p.set(47, 62, C.gold);
    p.set(48, 62, C.gold);
    p.set(47, 64, "#34d399");
    p.set(48, 64, "#34d399");
  } else {
    // >_
    p.set(42, 60, "#34d399");
    p.set(43, 61, "#34d399");
    p.set(44, 62, "#34d399");
    p.set(43, 63, "#34d399");
    p.set(42, 64, "#34d399");
    p.rect(46, 64, 6, 1, "#34d399");
  }
  // Double door on tile columns 2-3 (x 32..63), bottom row
  p.rect(36, 68, 24, 11, "#2f4a5c");
  p.rect(37, 69, 10, 10, C.glass);
  p.rect(49, 69, 10, 10, C.glass);
  p.rect(38, 70, 3, 4, C.glassLight);
  p.rect(50, 70, 3, 4, C.glassLight);
  p.rect(2, 77, W_ - 4, 2, "#c9c2b2");
  p.outline(0, 0, W_, 80);
}

/** Research lab: white walls, teal roof with a satellite dish, wide glass doors. */
function drawLab(p: Pix) {
  const W_ = 96;
  p.rect(1, 6, W_ - 2, 24, "#257566");
  p.rect(3, 8, W_ - 6, 20, "#3aa38f");
  for (let x = 6; x < W_ - 6; x += 8) p.rect(x, 12, 4, 12, "#2f8f7d");
  // dish
  p.disc(78, 8, 6, "#e8e4da");
  p.disc(78, 8, 4, "#c9c2b2");
  p.rect(77, 8, 2, 7, "#9c9486");
  p.rect(1, 28, W_ - 2, 2, "#257566");
  p.rect(2, 30, W_ - 4, 33, C.white);
  for (let x = 8; x < W_ - 10; x += 14) {
    if (x > 28 && x < 62) continue;
    p.rect(x, 36, 10, 10, "#2f4a5c");
    p.rect(x + 1, 37, 8, 8, C.glass);
    p.rect(x + 1, 37, 3, 3, C.glassLight);
  }
  p.rect(30, 34, 36, 4, "#1f1d24");
  for (let x = 32; x < 64; x += 3) p.set(x, 35, x % 2 ? "#34d399" : "#7bc9df");
  p.rect(36, 44, 24, 19, "#2f4a5c");
  p.rect(37, 45, 10, 18, C.glass);
  p.rect(49, 45, 10, 18, C.glass);
  p.rect(2, 61, W_ - 4, 2, "#c9c2b2");
  p.outline(0, 0, W_, 64);
}

/** A research computer on a desk, screen glowing. */
function drawComputer(p: Pix) {
  p.rect(1, 18, 14, 4, C.woodDark);
  p.rect(2, 22, 2, 9, C.woodDark);
  p.rect(12, 22, 2, 9, C.woodDark);
  p.rect(2, 6, 12, 10, "#3a3f4a");
  p.rect(3, 7, 10, 8, "#0a0c0b");
  p.rect(4, 8, 5, 1, "#34d399");
  p.rect(4, 10, 7, 1, "#34d399");
  p.rect(4, 12, 4, 1, "#7bc9df");
  p.rect(7, 16, 2, 2, "#3a3f4a");
  p.outline(0, 0, 16, 32);
}

/** Event arena: an oval stadium with banners. */
function drawArena(p: Pix) {
  const W_ = 128;
  for (let y = 4; y < 60; y++)
    for (let x = 2; x < W_ - 2; x++) {
      const dx = (x - 64) / 62;
      const dy = (y - 34) / 30;
      if (dx * dx + dy * dy <= 1) p.set(x, y, dy < -0.2 ? "#d9a23f" : "#e8dcc0");
    }
  for (let y = 10; y < 40; y += 5) for (let x = 10; x < W_ - 10; x += 6) if (p.alpha(x, y) && y < 30) p.set(x, y, "#a8742a");
  // banners
  for (const [x, c] of [[24, C.red], [44, "#7bc9df"], [84, "#34d399"], [104, C.gold]] as const) {
    p.rect(x, 18, 2, 22, C.woodDark);
    p.rect(x + 2, 18, 8, 10, c);
  }
  p.rect(2, 60, W_ - 4, 19, "#e8dcc0");
  p.rect(2, 60, W_ - 4, 2, "#a8742a");
  for (let x = 8; x < W_ - 8; x += 12) if (x < 44 || x > 80) p.rect(x, 64, 4, 15, "#c9c2b2");
  p.rect(48, 62, 32, 17, C.woodDark);
  p.rect(50, 64, 13, 15, C.wood);
  p.rect(65, 64, 13, 15, C.wood);
  p.set(61, 72, C.gold);
  p.set(66, 72, C.gold);
  p.outline(0, 0, W_, 80);
}

/** Office tower: stacked glass floors. */
function drawOffice(p: Pix) {
  const W_ = 80;
  p.rect(2, 2, W_ - 4, 77, "#5b6b7e");
  p.rect(4, 4, W_ - 8, 4, "#86a6cf");
  for (let y = 12; y < 60; y += 8)
    for (let x = 6; x < W_ - 8; x += 10) {
      p.rect(x, y, 8, 6, C.glass);
      p.rect(x, y, 3, 2, C.glassLight);
    }
  p.rect(30, 62, 20, 17, "#2f4a5c");
  p.rect(32, 64, 16, 15, C.glass);
  p.rect(39, 64, 2, 15, "#2f4a5c");
  p.outline(0, 0, W_, 80);
}

function drawFlag(p: Pix) {
  p.rect(7, 3, 2, 28, "#3a3f4a");
  p.rect(9, 4, 6, 6, "#34d399");
  p.rect(9, 6, 6, 1, C.white);
  p.rect(5, 29, 6, 2, "#3a3f4a");
  p.outline(0, 0, 16, 32);
}

function drawPalm(p: Pix) {
  // curved trunk
  for (let y = 14; y < 46; y++) p.rect(7 + Math.round(Math.sin(y / 9) * 2), y, 3, 1, y % 4 === 0 ? C.woodDark : C.wood);
  // fronds
  for (const [dx, dy] of [[-7, 2], [7, 2], [-5, -3], [5, -3], [0, -5]]) {
    for (let i = 0; i < 7; i++) p.rect(8 + Math.round((dx * i) / 6), 14 + Math.round((dy * i) / 6 + (i * i) / 12), 3, 2, i % 2 ? C.leaf : C.leafLight);
  }
  p.disc(8, 14, 2.5, C.leafDark);
  p.set(6, 16, "#8a5a2a");
  p.set(10, 16, "#8a5a2a");
  p.outline(0, 0, 16, 48);
}

/** Dive hut: thatched roof on stilts. */
function drawHut(p: Pix) {
  const W_ = 64;
  for (let y = 2; y < 24; y++) {
    const half = 8 + y * 1.1;
    for (let x = Math.floor(32 - half); x < 32 + half; x++) p.set(x, y, (x + y) % 4 === 0 ? "#b38a4a" : "#d9b46a");
  }
  p.rect(2, 22, W_ - 4, 2, "#8a6a38");
  p.rect(6, 24, W_ - 12, 22, C.woodLight);
  for (let x = 8; x < W_ - 8; x += 6) p.rect(x, 24, 1, 22, C.wood);
  p.rect(16, 30, 6, 6, "#2f4a5c");
  p.rect(17, 31, 4, 4, C.glass);
  p.rect(42, 28, 12, 10, C.white); // dive flag
  p.rect(42, 32, 12, 2, C.red);
  p.rect(18, 36, 10, 10, C.woodDark); // door (tile column 1)
  p.outline(0, 0, W_, 48);
}

function drawBuoy(p: Pix) {
  p.disc(8, 9, 5, C.red);
  p.rect(3, 8, 11, 2, C.white);
  p.rect(7, 2, 2, 4, "#3a3f4a");
  p.rect(2, 14, 12, 1, C.foam);
  p.outline(0, 0, 16, 16);
}

function drawTripod(p: Pix) {
  p.rect(4, 6, 9, 6, "#1f1d24");
  p.rect(5, 7, 4, 4, "#3a3f4a");
  p.disc(7, 9, 1.5, C.glass);
  p.rect(10, 5, 2, 1, C.red);
  for (let i = 0; i < 18; i++) {
    p.set(8 - Math.floor(i / 4), 12 + i, "#3a3f4a");
    p.set(8 + Math.floor(i / 4), 12 + i, "#3a3f4a");
    p.set(8, 12 + i, "#3a3f4a");
  }
  p.outline(0, 0, 16, 32);
}

function drawMat(p: Pix) {
  p.rect(2, 3, 12, 10, "#b48be8");
  p.rect(2, 3, 12, 1, "#e2d0fa");
  p.rect(2, 12, 12, 1, "#7a52b8");
  p.outline(0, 0, 16, 16);
}

function drawMailbox(p: Pix) {
  p.rect(7, 9, 2, 6, C.woodDark);
  p.rect(3, 3, 10, 7, C.red);
  p.rect(3, 3, 10, 2, C.white);
  p.rect(4, 6, 8, 1, C.redDark);
  p.rect(12, 5, 1, 3, C.gold);
  p.outline(0, 0, 16, 16);
}

// ---------- player ----------

export type Dir = "down" | "up" | "left" | "right";
export const DIRS: Dir[] = ["down", "up", "left", "right"];
export const PLAYER_W = 16;
export const PLAYER_H = 24;

export interface Look {
  hair: string;
  hairLight: string;
  top: string;
  topDark: string;
  trim: string; // zip / coat seam
  pants: string;
  band: string | null; // headband colour
}

export const PLAYER_LOOK: Look = { hair: C.hair, hairLight: C.hairLight, top: C.hoodie, topDark: C.hoodieDark, trim: C.wall, pants: C.pants, band: C.accent };

/** Chibi walker (big head, GBA proportions) in a 16x24 cell. step 0 = standing, 1/2 = alternate feet. */
function drawWalker(p: Pix, ox: number, dir: Dir, step: number, l: Look) {
  const side = dir === "left" || dir === "right";
  const flip = (x: number) => (dir === "left" ? ox + 15 - x : ox + x);
  const s = (x: number, y: number, c: string) => p.set(flip(x), y, c);
  const r = (x: number, y: number, w: number, h: number, c: string) => {
    for (let j = 0; j < h; j++) for (let i = 0; i < w; i++) s(x + i, y + j, c);
  };

  // Legs / shoes
  const lift = (foot: 1 | 2) => (step === foot ? 1 : 0);
  if (side) {
    const stride = step === 0 ? 0 : step === 1 ? 2 : -2;
    r(6 + stride, 18, 3, 3, l.pants);
    r(7 - stride, 18, 3, 3, l.pants);
    r(6 + stride, 21, 3, 1, C.shoe);
    r(7 - stride, 21, 3, 1, C.shoe);
  } else {
    r(5, 18, 3, 3 - lift(1), l.pants);
    r(9, 18, 3, 3 - lift(2), l.pants);
    r(5, 21 - lift(1), 3, 1, C.shoe);
    r(9, 21 - lift(2), 3, 1, C.shoe);
  }
  // Hoodie
  r(4, 12, 9, 6, l.top);
  r(4, 16, 9, 2, l.topDark);
  if (!side) {
    r(8, 13, 1, 4, l.trim); // zip / coat seam
    const swing = step === 1 ? 1 : step === 2 ? -1 : 0;
    r(3, 12 + swing, 1, 4, l.topDark);
    r(13, 12 - swing, 1, 4, l.topDark);
    s(3, 16 + swing, C.skin);
    s(13, 16 - swing, C.skin);
  } else {
    const swing = step === 1 ? 1 : step === 2 ? -1 : 0;
    r(8 + swing, 13, 2, 4, l.topDark);
    r(8 + swing, 17, 2, 1, C.skin);
  }
  // Head (big, GBA chibi)
  r(3, 3, 11, 9, C.skin);
  r(3, 10, 11, 2, C.skinShade);
  // Hair + emerald headband (the KRISHI.OS accent)
  r(3, 1, 11, 4, l.hair);
  s(4, 0, l.hair);
  s(7, 0, l.hair);
  s(11, 0, l.hair);
  r(5, 1, 3, 1, l.hairLight);
  if (l.band) r(3, 4, 11, 1, l.band);
  if (dir === "up") {
    r(3, 5, 11, 6, l.hair);
    r(5, 6, 2, 2, l.hairLight);
    if (l.band) s(8, 4, l.topDark); // headband knot
  } else if (side) {
    r(3, 5, 4, 4, l.hair); // back of the head
    r(11, 7, 1, 2, C.outline); // eye
    s(13, 8, C.skinShade);
  } else {
    r(3, 5, 1, 3, l.hair);
    r(13, 5, 1, 3, l.hair);
    r(5, 7, 1, 2, C.outline);
    r(11, 7, 1, 2, C.outline);
    s(8, 10, C.skinShade);
  }
  p.outline(ox, 0, PLAYER_W, PLAYER_H);
  // Soft ground shadow, added after the outline so it isn't outlined
  for (let x = 4; x < 13; x++) if (p.alpha(ox + x, 23) === 0) p.set(ox + x, 23, C.outline, 70);
}


/** A faceted crystal: the in-world form of a KRISHI ATTRIBUTE. */
function drawCrystal(p: Pix, [light, mid, dark]: [string, string, string]) {
  for (let y = 0; y < 13; y++) {
    const half = y < 5 ? y + 1 : Math.max(0, 12 - y);
    for (let x = 8 - half; x < 8 + half; x++) p.set(x, y + 1, x < 8 ? (y < 5 ? light : mid) : y < 5 ? mid : dark);
  }
  p.set(6, 3, C.white);
  p.set(5, 4, C.white);
  p.outline(0, 0, 16, 16);
}

const OBJECT_PAINTERS: Record<ObjectKind, (p: Pix) => void> = {
  tree: drawTree,
  house: drawHouse,
  university: drawUniversity,
  sign: drawSign,
  mailbox: drawMailbox,
  lamp: drawLamp,
  fountain: drawFountain,
  "bldg-accessvision": (q) => drawTower(q, C.slate, C.slateDark, C.slateLight, "eye"),
  "bldg-clinicalbrief": (q) => drawTower(q, "#3aa38f", "#257566", "#8fdccb", "cross"),
  "bldg-traffic": (q) => drawTower(q, "#d9a23f", "#a8742a", "#f5d27b", "light"),
  "bldg-os": (q) => drawTower(q, "#1c2a24", "#0a0c0b", "#34d399", "prompt"),
  lab: drawLab,
  computer: drawComputer,
  arena: drawArena,
  office: drawOffice,
  flag: drawFlag,
  palm: drawPalm,
  hut: drawHut,
  buoy: drawBuoy,
  tripod: drawTripod,
  mat: drawMat,
};

/**
 * The same art as plain canvases (no Phaser), for React screens that show the world (the title screen and Classic
 * Mode). Painted once per page.
 */
let painted: { sheet: HTMLCanvasElement; objects: Record<ObjectKind, HTMLCanvasElement>; player: HTMLCanvasElement; portrait: HTMLCanvasElement } | null = null;
// ---------- trainer-card portrait (Classic Mode, title screen) ----------
// The player as a 32x32 head-and-shoulders bust, like a GBA trainer card: same hair, emerald headband and hoodie
// as the walking sprite, drawn bigger so the face reads. Frame 0 eyes open, frame 1 blinking.
export const PORTRAIT = 32;
const MOUTH = "#a8604a";
const BLUSH = "#f0a890";

function drawPortrait(p: Pix, ox: number, blink: boolean) {
  const r = (x: number, y: number, w: number, h: number, c: string, a = 255) => p.rect(ox + x, y, w, h, c, a);
  const d = (x: number, y: number, c: string, a = 255) => p.set(ox + x, y, c, a);

  // Shoulders: hoodie with darker sides, cream zip and a collar
  r(8, 24, 16, 1, C.hoodie);
  r(6, 25, 20, 1, C.hoodie);
  r(4, 26, 24, 6, C.hoodie);
  r(4, 26, 2, 6, C.hoodieDark);
  r(26, 26, 2, 6, C.hoodieDark);
  r(4, 31, 24, 1, C.hoodieDark);
  r(12, 24, 8, 2, C.hoodieDark); // collar
  r(16, 26, 1, 6, C.wall); // zip
  d(15, 27, C.hoodieDark);
  d(17, 27, C.hoodieDark);

  // Neck
  r(13, 21, 6, 4, C.skinShade);
  r(14, 21, 4, 1, C.skin);

  // Ears
  r(7, 13, 1, 4, C.skin);
  r(24, 13, 1, 4, C.skin);
  d(7, 14, C.skinShade);
  d(24, 14, C.skinShade);

  // Face, rounded at the chin, shaded along the jaw
  r(8, 8, 16, 12, C.skin);
  r(9, 20, 14, 1, C.skin);
  r(11, 21, 10, 1, C.skin);
  r(8, 18, 1, 2, C.skinShade);
  r(23, 18, 1, 2, C.skinShade);
  r(9, 20, 1, 1, C.skinShade);
  r(22, 20, 1, 1, C.skinShade);
  r(11, 21, 2, 1, C.skinShade);
  r(19, 21, 2, 1, C.skinShade);

  // Hair: rounded crown with three tufts, a lighter sweep, sideburns and a fringe
  r(10, 1, 12, 1, C.hair);
  r(8, 2, 16, 6, C.hair);
  d(11, 0, C.hair);
  d(15, 0, C.hair);
  d(16, 0, C.hair);
  d(20, 0, C.hair);
  r(11, 2, 5, 1, C.hairLight);
  r(10, 3, 3, 1, C.hairLight);
  r(8, 8, 1, 5, C.hair); // sideburns
  r(23, 8, 1, 5, C.hair);
  r(9, 9, 4, 1, C.hair); // fringe, parted over the forehead
  r(19, 9, 4, 1, C.hair);
  d(9, 10, C.hair);
  d(22, 10, C.hair);

  // Emerald headband with knot tails on the right
  r(8, 6, 16, 2, C.accent);
  r(8, 7, 16, 1, C.hoodie);
  r(24, 6, 2, 1, C.accent);
  r(25, 7, 1, 2, C.hoodie);

  // Brows
  r(10, 11, 4, 1, C.hair);
  r(18, 11, 4, 1, C.hair);

  // Eyes: dark with a white catch-light; a single line while blinking
  if (blink) {
    r(11, 14, 3, 1, C.outline);
    r(18, 14, 3, 1, C.outline);
  } else {
    r(11, 13, 3, 3, C.outline);
    r(18, 13, 3, 3, C.outline);
    d(12, 13, C.white);
    d(19, 13, C.white);
    d(13, 15, "#3a3446");
    d(20, 15, "#3a3446");
  }

  // Nose, blush, smile
  d(16, 16, C.skinShade);
  d(15, 17, C.skinShade);
  r(10, 17, 2, 1, BLUSH, 200);
  r(20, 17, 2, 1, BLUSH, 200);
  r(14, 19, 4, 1, MOUTH);
  d(13, 18, MOUTH);
  d(18, 18, MOUTH);

  p.outline(ox, 0, PORTRAIT, PORTRAIT);
}

export function paintedAssets() {
  if (painted) return painted;
  const sheet = new Pix(TILE * SHEET_TILES, TILE);
  drawTerrainSheet(sheet);
  const objects = {} as Record<ObjectKind, HTMLCanvasElement>;
  for (const kind of Object.keys(OBJECT_PAINTERS) as ObjectKind[]) {
    const art: ObjectArt = OBJECTS[kind];
    const pix = new Pix(art.w * TILE, (art.ph ?? art.h) * TILE);
    OBJECT_PAINTERS[kind](pix);
    objects[kind] = pix.toCanvas();
  }
  const player = new Pix(PLAYER_W * 12, PLAYER_H);
  DIRS.forEach((dir, d) => [0, 1, 2].forEach((step) => drawWalker(player, (d * 3 + step) * PLAYER_W, dir, step, PLAYER_LOOK)));
  const portrait = new Pix(PORTRAIT * 2, PORTRAIT);
  drawPortrait(portrait, 0, false);
  drawPortrait(portrait, PORTRAIT, true);
  painted = { sheet: sheet.toCanvas(), objects, player: player.toCanvas(), portrait: portrait.toCanvas() };
  return painted;
}

/** Draws every texture once into Phaser's texture manager. */
export function generateTextures(scene: Phaser.Scene, npcs: { id: string; look: Look }[] = []) {
  if (scene.textures.exists("tiles")) return;

  const sheet = new Pix(TILE * SHEET_TILES, TILE);
  drawTerrainSheet(sheet);
  sheet.toTexture(scene, "tiles");

  const objects = OBJECT_PAINTERS;
  for (const kind of Object.keys(objects) as ObjectKind[]) {
    const art: ObjectArt = OBJECTS[kind];
    const p = new Pix(art.w * TILE, (art.ph ?? art.h) * TILE);
    objects[kind](p);
    p.toTexture(scene, kind);
  }

  // 4 directions x 3 frames in one row: down0 down1 down2 up0 ... right2
  const player = new Pix(PLAYER_W * 12, PLAYER_H);
  DIRS.forEach((dir, d) => [0, 1, 2].forEach((step) => drawWalker(player, (d * 3 + step) * PLAYER_W, dir, step, PLAYER_LOOK)));
  const tex = player.toTexture(scene, "player");
  for (let i = 0; i < 12; i++) tex.add(i, 0, i * PLAYER_W, 0, PLAYER_W, PLAYER_H);

  for (const [rarity, colors] of Object.entries(RARITY_COLORS)) {
    const crystal = new Pix(16, 16);
    drawCrystal(crystal, colors);
    crystal.toTexture(scene, `crystal-${rarity}`);
  }

  for (const { id, look } of npcs) {
    const p = new Pix(PLAYER_W * 4, PLAYER_H);
    DIRS.forEach((dir, d) => drawWalker(p, d * PLAYER_W, dir, 0, look));
    const t = p.toTexture(scene, `npc-${id}`);
    for (let i = 0; i < 4; i++) t.add(i, 0, i * PLAYER_W, 0, PLAYER_W, PLAYER_H);
  }
}
