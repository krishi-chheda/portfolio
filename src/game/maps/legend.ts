import { E, N, OBJECTS, S, T, W, type Dir, type ObjectKind } from "../textures";

export interface MapObject {
  kind: ObjectKind;
  x: number; // top-left tile of the footprint
  y: number;
}

/** Stepping onto (x, y) moves the player to another map. */
export interface Warp {
  x: number;
  y: number;
  to: string; // target map id
  spawn: { x: number; y: number };
  facing: Dir;
}

export interface MapDef {
  id: string;
  name: string;
  spawn: { x: number; y: number };
  terrain: string[];
  objects: MapObject[];
  warps: Warp[];
}

// Terrain characters. Path, sand and water are auto-tiled from their neighbours.
const PLAIN: Record<string, number> = { ".": T.GRASS, ",": T.GRASS_2, "*": T.FLOWER, "^": T.TALL, F: T.FENCE, p: T.PAVE, d: T.DOCK };
const EDGED: Record<string, number> = { "=": T.PATH, ":": T.SAND, "~": T.WATER };
// Which neighbouring characters count as "same terrain" (sand blends into water; water draws its own shore)
// (a road also runs flush into pavement)
// (docks sit on water and sand without drawing a shore against them)
const JOINS: Record<string, string> = { "=": "=pd", ":": ":~d", "~": "~d" };
const BLOCKING = new Set(["~", "F"]);

/** A ring of 2x2 trees around the map edge, minus any tree placed at a `gaps` position (exits). */
export function borderTrees(width: number, height: number, gaps: { x: number; y: number }[] = []): MapObject[] {
  const trees: MapObject[] = [];
  for (let x = 0; x < width; x += 2) trees.push({ kind: "tree", x, y: 0 }, { kind: "tree", x, y: height - 2 });
  for (let y = 2; y < height - 2; y += 2) trees.push({ kind: "tree", x: 0, y }, { kind: "tree", x: width - 2, y });
  return trees.filter((t) => !gaps.some((g) => g.x === t.x && g.y === t.y));
}

export interface BuiltMap {
  tiles: number[][]; // tile-sheet index per cell
  solid: boolean[][];
  water: { x: number; y: number; mask: number }[]; // for the shimmer animation
  doors: { x: number; y: number; object: MapObject }[];
}

/** Validates the map (throws on typos, ragged rows or overlapping objects) and resolves tiles + collision. */
export function buildMap(map: MapDef): BuiltMap {
  const w = map.terrain[0]?.length ?? 0;
  map.terrain.forEach((row, y) => {
    if (row.length !== w) throw new Error(`${map.name}: row ${y} is ${row.length} wide, expected ${w}`);
  });
  const at = (x: number, y: number) => map.terrain[y]?.[x];

  const water: BuiltMap["water"] = [];
  const tiles = map.terrain.map((row, y) =>
    [...row].map((ch, x) => {
      if (ch in PLAIN) return PLAIN[ch];
      if (!(ch in EDGED)) throw new Error(`${map.name}: unknown terrain "${ch}" at ${x},${y}`);
      // Off-map neighbours count as joined, so nothing draws an edge against the map border
      const joins = (nx: number, ny: number) => {
        const n = at(nx, ny);
        return n === undefined || JOINS[ch].includes(n);
      };
      const mask = (joins(x, y - 1) ? N : 0) | (joins(x + 1, y) ? E : 0) | (joins(x, y + 1) ? S : 0) | (joins(x - 1, y) ? W : 0);
      if (ch === "~") water.push({ x, y, mask });
      return EDGED[ch] + mask;
    })
  );

  const solid = map.terrain.map((row) => [...row].map((ch) => BLOCKING.has(ch)));
  const owner = new Map<string, MapObject>();
  const doors: BuiltMap["doors"] = [];
  for (const obj of map.objects) {
    const art = OBJECTS[obj.kind];
    for (let dy = 0; dy < art.h; dy++)
      for (let dx = 0; dx < art.w; dx++) {
        const x = obj.x + dx;
        const y = obj.y + dy;
        const key = `${x},${y}`;
        const prev = owner.get(key);
        if (prev) throw new Error(`${map.name}: ${obj.kind}@${obj.x},${obj.y} overlaps ${prev.kind}@${prev.x},${prev.y}`);
        if (solid[y]?.[x] === undefined) throw new Error(`${map.name}: ${obj.kind}@${obj.x},${obj.y} is off the map`);
        owner.set(key, obj);
        solid[y][x] = true;
      }
    for (const [dx, dy] of "door" in art ? art.door : []) doors.push({ x: obj.x + dx, y: obj.y + dy, object: obj });
  }
  return { tiles, solid, water, doors };
}
