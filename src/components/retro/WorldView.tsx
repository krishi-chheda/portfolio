"use client";

import { useEffect, useRef } from "react";
import { OBJECTS, PLAYER_H, PLAYER_W, PORTRAIT, T, TILE, paintedAssets, type ObjectArt, type ObjectKind } from "@/game/textures";
import { buildMap, type MapDef } from "@/game/maps/legend";
import { originValley } from "@/game/maps/originValley";

const reduced = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/**
 * A live crop of a real KRISHI.WORLD map (same tiles and buildings as the game, no Phaser): water shimmers, wind
 * gusts ripple through flowers and tall grass, and the player walks along a row or a looping route of waypoints.
 * Used by the title screen. Static under reduced motion.
 */
export function WorldView({
  map = originValley,
  crop,
  walkRow,
  route,
  className = "",
  label,
}: {
  map?: MapDef;
  crop: { x: number; y: number; w: number; h: number }; // in tiles
  walkRow?: number; // map row the player walks along (left to right, looping)
  route?: readonly (readonly [number, number])[]; // closed loop of tile waypoints (straight segments) to walk instead
  className?: string;
  label: string;
}) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { sheet, objects, player } = paintedAssets();
    const built = buildMap(map);
    const W = crop.w * TILE;
    const H = crop.h * TILE;
    canvas.width = W;
    canvas.height = H;
    ctx.imageSmoothingEnabled = false;
    const visible = map.objects
      .filter((o) => {
        const a: ObjectArt = OBJECTS[o.kind];
        return o.x + a.w > crop.x && o.x < crop.x + crop.w && o.y + a.h > crop.y && o.y - ((a.ph ?? a.h) - a.h) < crop.y + crop.h;
      })
      .sort((a, b) => a.y + OBJECTS[a.kind].h - (b.y + OBJECTS[b.kind].h));

    const routeLength = route ? route.reduce((n, [ax, ay], i) => {
      const [bx, by] = route[(i + 1) % route.length];
      return n + Math.abs(bx - ax) + Math.abs(by - ay);
    }, 0) : 0;

    const draw = (time: number) => {
      const waterFrame = Math.floor(time / 600) % 2;
      for (let y = 0; y < crop.h; y++)
        for (let x = 0; x < crop.w; x++) {
          let idx = built.tiles[crop.y + y]?.[crop.x + x];
          if (idx === undefined) continue;
          if (waterFrame && idx >= T.WATER && idx < T.WATER + 16) idx += T.WATER_B - T.WATER;
          // a gust travels across the map; flowers and tall grass lean 1px as it passes
          if ((idx === T.FLOWER || idx === T.TALL) && Math.sin(time / 650 - (crop.x + x) * 0.45 - (crop.y + y) * 0.2) > 0.82) {
            ctx.drawImage(sheet, T.GRASS * TILE, 0, TILE, TILE, x * TILE, y * TILE, TILE, TILE);
            ctx.drawImage(sheet, idx * TILE, 0, TILE - 1, TILE, x * TILE + 1, y * TILE, TILE - 1, TILE);
          } else ctx.drawImage(sheet, idx * TILE, 0, TILE, TILE, x * TILE, y * TILE, TILE, TILE);
        }
      // player depth: drawn after objects whose bottom is above its feet
      const walking = walkRow !== undefined || !!route;
      let px = 0;
      let feet = 0;
      let dir = 3; // DIRS order: down, up, left, right
      if (route) {
        // distance walked (tiles) along the closed route, one tile per 220ms like the game
        let d = (time / 220) % routeLength;
        for (let i = 0; i < route.length; i++) {
          const [ax, ay] = route[i];
          const [bx, by] = route[(i + 1) % route.length];
          const len = Math.abs(bx - ax) + Math.abs(by - ay);
          if (d > len) {
            d -= len;
            continue;
          }
          const t = len ? d / len : 0;
          px = (ax + (bx - ax) * t - crop.x) * TILE;
          feet = (ay + (by - ay) * t - crop.y + 1) * TILE;
          dir = bx > ax ? 3 : bx < ax ? 2 : by > ay ? 0 : 1;
          break;
        }
      } else if (walkRow !== undefined) {
        px = ((time / 220) * TILE) % (W + TILE * 2) - TILE;
        feet = (walkRow - crop.y + 1) * TILE;
      }
      const step = [1, 0, 2, 0][Math.floor(time / 110) % 4];
      const frame = (dir * 3 + step) * PLAYER_W;
      let playerDrawn = !walking;
      for (const o of visible) {
        const a = OBJECTS[o.kind];
        const bottom = (o.y + a.h - crop.y) * TILE;
        if (!playerDrawn && bottom > Math.round(feet)) {
          ctx.drawImage(player, frame, 0, PLAYER_W, PLAYER_H, Math.round(px), Math.round(feet) - PLAYER_H, PLAYER_W, PLAYER_H);
          playerDrawn = true;
        }
        const img = objects[o.kind as ObjectKind];
        ctx.drawImage(img, (o.x - crop.x) * TILE, bottom - img.height);
      }
      if (!playerDrawn) ctx.drawImage(player, frame, 0, PLAYER_W, PLAYER_H, Math.round(px), Math.round(feet) - PLAYER_H, PLAYER_W, PLAYER_H);
    };

    if (reduced()) {
      draw(2600);
      return;
    }
    let raf = 0;
    const loop = (t: number) => {
      draw(t);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [map, crop.x, crop.y, crop.w, crop.h, walkRow, route]);

  return <canvas ref={ref} role="img" aria-label={label} className={`block [image-rendering:pixelated] ${className}`} />;
}

/** One piece of game art (a project HQ, a tree, a crystal-less object) as a crisp canvas. */
export function ObjectSprite({ kind, scale = 2, className = "" }: { kind: ObjectKind; scale?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const img = paintedAssets().objects[kind];
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, 0, 0);
    canvas.style.width = `${img.width * scale}px`;
  }, [kind, scale]);
  return <canvas ref={ref} aria-hidden="true" className={`block [image-rendering:pixelated] ${className}`} />;
}

/**
 * The player from the game, idling: breathes (1px bob) and glances left and right, like an overworld sprite
 * waiting for input. Static and facing forward under reduced motion.
 */
export function PlayerAvatar({ scale = 5, className = "", label = "" }: { scale?: number; className?: string; label?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { player } = paintedAssets();
    canvas.width = PLAYER_W;
    canvas.height = PLAYER_H + 1;
    // facing per beat (DIRS order: down, up, left, right); mostly forward
    const LOOK = [0, 0, 0, 0, 2, 2, 0, 0, 0, 0, 3, 3];
    const draw = (beat: number) => {
      ctx.clearRect(0, 0, PLAYER_W, PLAYER_H + 1);
      const dir = LOOK[beat % LOOK.length];
      const bob = beat % 2;
      ctx.drawImage(player, dir * 3 * PLAYER_W, 0, PLAYER_W, PLAYER_H, 0, 1 - bob, PLAYER_W, PLAYER_H);
    };
    draw(0);
    if (reduced()) return;
    let beat = 0;
    const id = setInterval(() => draw(++beat), 480);
    return () => clearInterval(id);
  }, []);
  return (
    <canvas
      ref={ref}
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      style={{ width: PLAYER_W * scale, height: (PLAYER_H + 1) * scale }}
      className={`block [image-rendering:pixelated] ${className}`}
    />
  );
}

/**
 * The trainer-card portrait: the player as a head-and-shoulders bust. Blinks every few seconds and breathes
 * (a 1px rise of the shoulders line). Still under reduced motion.
 */
export function PortraitAvatar({ scale = 5, className = "", label = "" }: { scale?: number; className?: string; label?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;
    const { portrait } = paintedAssets();
    canvas.width = PORTRAIT;
    canvas.height = PORTRAIT + 1;
    const draw = (blink: boolean, rise: number) => {
      ctx.clearRect(0, 0, PORTRAIT, PORTRAIT + 1);
      ctx.drawImage(portrait, blink ? PORTRAIT : 0, 0, PORTRAIT, PORTRAIT, 0, 1 - rise, PORTRAIT, PORTRAIT);
    };
    draw(false, 0);
    if (reduced()) return;
    let tick = 0;
    const id = setInterval(() => {
      tick++;
      const blink = tick % 22 === 0 || tick % 22 === 2; // a quick double-blink every ~3.3s
      draw(blink, Math.floor(tick / 6) % 2); // breathe: up for ~0.9s, down for ~0.9s
    }, 150);
    return () => clearInterval(id);
  }, []);
  return (
    <canvas
      ref={ref}
      role={label ? "img" : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      style={{ width: PORTRAIT * scale, height: (PORTRAIT + 1) * scale }}
      className={`block [image-rendering:pixelated] ${className}`}
    />
  );
}
