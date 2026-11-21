// The inside of each Project Metropolis HQ: one room, the same layout for every project, furnished with the
// exhibits in content.ts EXHIBITS. Built here (not by scripts/worldgen.py) because the room is fixed and small;
// buildMap() still validates it.
import type { MapDef } from "./legend";
import { projectMetropolis } from "./projectMetropolis";
import { DOOR_TERMINAL, interiorId } from "../content";
import type { ObjectKind } from "../textures";
import { FEATURED } from "@/lib/portfolio";

// 18 x 12: wall along the top (exhibits hang on it), beams down the sides, a door mat in the bottom wall.
const TERRAIN = [
  "WWWWWWWWWWWWWWWWWW",
  "WWWWWWWWWWWWWWWWWW",
  "B________________B",
  "B________________B",
  "B________________B",
  "B________________B",
  "B________________B",
  "B________________B",
  "B_____rrrrrr_____B",
  "B_____rrrrrr_____B",
  "B________________B",
  "BBBBBBBBmmBBBBBBBB",
];

export const INTERIOR_SPAWN = { x: 8, y: 10 };

export const INTERIORS: MapDef[] = Object.entries(DOOR_TERMINAL).map(([kind, project]) => {
  const hq = projectMetropolis.objects.find((o) => o.kind === (kind as ObjectKind));
  if (!hq || !project) throw new Error(`interiors: no HQ building for ${kind}`);
  // Back outside: the tile in front of the HQ's double door (door tiles are columns 2-3 of its bottom row)
  const outside = { x: hq.x + 2, y: hq.y + 5 };
  const title = FEATURED.find((p) => p.id === project)?.title ?? project;
  return {
    id: interiorId(project),
    name: `${title} HQ`,
    spawn: INTERIOR_SPAWN,
    terrain: TERRAIN,
    objects: [
      { kind: "whiteboard", x: 2, y: 0 },
      { kind: "pinboard", x: 7, y: 0 },
      { kind: "tvwall", x: 12, y: 0 },
      { kind: "desk", x: 7, y: 5 },
      { kind: "bookshelf", x: 1, y: 6 },
      { kind: "cabinet", x: 15, y: 6 },
      { kind: "plant", x: 1, y: 10 },
      { kind: "plant", x: 16, y: 10 },
    ],
    warps: [
      { x: 8, y: 11, to: "metropolis", spawn: outside, facing: "down" },
      { x: 9, y: 11, to: "metropolis", spawn: { x: outside.x + 1, y: outside.y }, facing: "down" },
    ],
  } satisfies MapDef;
});
