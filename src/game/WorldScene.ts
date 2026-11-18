import * as Phaser from "phaser";
import { DIRS, OBJECTS, PLAYER_W, T, TILE, generateTextures, type Dir } from "./textures";
import { buildMap, type MapDef, type Warp } from "./maps/legend";
import { originValley } from "./maps/originValley";
import { projectMetropolis } from "./maps/projectMetropolis";
import { innovationForest } from "./maps/innovationForest";
import { leadershipFrontier } from "./maps/leadershipFrontier";
import { adventureCoast } from "./maps/adventureCoast";
import { ALL_NPCS, ATTRIBUTES, DOOR_TERMINAL, DOOR_TEXT, MAP_CONTENT } from "./content";
import { emit, on, type Dialogue } from "./bus";
import { discover, discovered } from "./progress";

const STEP_MS = 220; // time to walk one tile (GBA-like pace)
const VIEW_TILES = { w: 18, h: 12 }; // aim to show about this many tiles, at an integer zoom

const DELTA: Record<Dir, [number, number]> = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] };
const OPPOSITE: Record<Dir, Dir> = { down: "up", up: "down", left: "right", right: "left" };

const MAPS: Record<string, MapDef> = {
  origin: originValley,
  metropolis: projectMetropolis,
  forest: innovationForest,
  frontier: leadershipFrontier,
  coast: adventureCoast,
};
const FADE_MS = 200;

type KeyName = "up" | "down" | "left" | "right" | "w" | "a" | "s" | "d" | "e" | "enter" | "journal" | "profile" | "map" | "achievements" | "menu";

// Keys that open a React overlay, and the bus event each one sends
const MENU_KEYS = [
  ["journal", "open-journal"],
  ["profile", "open-profile"],
  ["map", "open-map"],
  ["achievements", "open-achievements"],
  ["menu", "open-menu"],
] as const;

/** What scene.restart() passes between maps. */
interface Arrival {
  mapId?: string;
  spawn?: { x: number; y: number };
  facing?: Dir;
}

/**
 * Tile-by-tile movement, like the GBA games: the player always stands on a tile, walking is a tween to the
 * next one, and collision is a lookup in the map grid. Interacting means "whatever is on the tile I'm facing".
 * Overlays (dialogue, journal) are React; while one is open the scene is locked and ignores input.
 */
export class WorldScene extends Phaser.Scene {
  private solid: boolean[][] = [];
  private player!: Phaser.GameObjects.Sprite;
  private tile = { x: 0, y: 0 };
  private facing: Dir = "down";
  private moving = false;
  private locked = false;
  private keys!: Record<KeyName, Phaser.Input.Keyboard.Key>;
  private interactions = new Map<string, () => void>(); // "x,y" -> what pressing E on that tile does
  private def: MapDef = originValley;
  private arrival: Arrival = {};
  private reduceMotion = false;

  constructor() {
    super("world");
  }

  // Runs before create() on first boot and on every warp (scene.restart reuses this instance, so reset state)
  init(arrival: Arrival) {
    this.arrival = arrival ?? {};
    this.def = MAPS[this.arrival.mapId ?? "origin"] ?? originValley;
    this.interactions = new Map();
    this.moving = false;
    this.locked = false;
    this.reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }

  create() {
    generateTextures(this, ALL_NPCS); // no-op after the first map

    const built = buildMap(this.def);
    this.solid = built.solid;
    const map = this.make.tilemap({ data: built.tiles, tileWidth: TILE, tileHeight: TILE });
    const tileset = map.addTilesetImage("tiles", "tiles", TILE, TILE, 0, 0);
    const layer = tileset && map.createLayer(0, tileset, 0, 0);
    if (!layer) throw new Error("KRISHI.WORLD: could not build the tile layer");

    // Water shimmers by swapping each tile between its two frames (same edge mask, so shores stay put)
    let frame = false;
    this.time.addEvent({
      delay: 600,
      loop: true,
      callback: () => {
        frame = !frame;
        for (const { x, y, mask } of built.water) layer.putTileAt((frame ? T.WATER_B : T.WATER) + mask, x, y);
      },
    });

    // Trees and buildings are sprites anchored at the bottom of their footprint and depth-sorted by that edge,
    // so the player walks in front of things below them and behind things above.
    for (const obj of this.def.objects) {
      const { h } = OBJECTS[obj.kind];
      const bottom = (obj.y + h) * TILE;
      this.add.image(obj.x * TILE, bottom, obj.kind).setOrigin(0, 1).setDepth(bottom - 1);
    }

    this.addInteractables(built.doors);

    DIRS.forEach((dir, d) => {
      if (this.anims.exists(`walk-${dir}`)) return;
      this.anims.create({
        key: `walk-${dir}`,
        frames: [1, 0, 2, 0].map((step) => ({ key: "player", frame: d * 3 + step })),
        frameRate: 9,
        repeat: -1,
      });
    });

    this.tile = { ...(this.arrival.spawn ?? this.def.spawn) };
    this.facing = this.arrival.facing ?? "down";
    this.player = this.add.sprite(0, 0, "player", 0).setOrigin(0.5, 1);
    this.placePlayer();
    this.idle();

    const kb = this.input.keyboard;
    if (!kb) throw new Error("KRISHI.WORLD: keyboard input unavailable");
    this.keys = kb.addKeys({
      up: "UP",
      down: "DOWN",
      left: "LEFT",
      right: "RIGHT",
      w: "W",
      a: "A",
      s: "S",
      d: "D",
      e: "E",
      enter: "ENTER",
      journal: "I",
      profile: "P",
      map: "M",
      achievements: "J",
      menu: "ESC",
    }) as typeof this.keys;
    kb.enableGlobalCapture(); // an overlay may have released it before a warp

    // React overlays pause and resume the world
    const offs = [
      on("ui-open", () => this.lock()),
      on("travel", (to) => {
        const target = MAPS[to];
        if (target && to !== this.def.id) this.warp({ x: 0, y: 0, to, spawn: target.spawn, facing: "down" });
      }),
      on("ui-closed", () => {
        this.locked = false;
        kb.resetKeys(); // the key that closed the overlay must not also trigger something here
        kb.enableGlobalCapture();
      }),
    ];

    const cam = this.cameras.main;
    cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    cam.setRoundPixels(true);
    cam.startFollow(this.player, true);
    if (!this.reduceMotion) cam.fadeIn(FADE_MS);
    this.fitZoom();
    emit("region", { id: this.def.id, name: this.def.name });
    this.scale.on(Phaser.Scale.Events.RESIZE, this.fitZoom, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.fitZoom, this);
      offs.forEach((off) => off());
    });
  }

  update() {
    if (this.locked || this.moving) return;
    const { JustDown } = Phaser.Input.Keyboard;
    if (JustDown(this.keys.e) || JustDown(this.keys.enter)) {
      const [dx, dy] = DELTA[this.facing];
      this.interactions.get(`${this.tile.x + dx},${this.tile.y + dy}`)?.();
      return;
    }
    for (const [key, event] of MENU_KEYS) {
      if (JustDown(this.keys[key])) {
        this.lock();
        emit(event);
        return;
      }
    }

    const dir = this.heldDirection();
    if (!dir) {
      this.idle();
      return;
    }
    this.facing = dir;
    const [dx, dy] = DELTA[dir];
    const next = { x: this.tile.x + dx, y: this.tile.y + dy };
    if (this.blocked(next.x, next.y)) {
      this.idle(); // bump: face the obstacle without moving
      return;
    }
    this.moving = true;
    this.tile = next;
    this.player.anims.play(`walk-${dir}`, true);
    this.tweens.add({
      targets: this.player,
      x: this.pixelX(),
      y: this.pixelY(),
      duration: STEP_MS,
      onUpdate: () => this.player.setDepth(this.player.y),
      onComplete: () => {
        this.moving = false;
        const warp = this.def.warps.find((w) => w.x === this.tile.x && w.y === this.tile.y);
        if (warp) this.warp(warp);
      },
    });
  }

  // Fade out, then rebuild the scene on the target map
  private warp(w: Warp) {
    this.locked = true;
    const go = () => this.scene.restart({ mapId: w.to, spawn: w.spawn, facing: w.facing } satisfies Arrival);
    if (this.reduceMotion) return go();
    this.cameras.main.fadeOut(FADE_MS);
    this.cameras.main.once(Phaser.Cameras.Scene2D.Events.FADE_OUT_COMPLETE, go);
  }

  private addInteractables(doors: { x: number; y: number; object: { kind: string } }[]) {
    const content = MAP_CONTENT[this.def.id] ?? { npcs: [], signs: {}, crystals: [] };
    const say = (dialogue: Dialogue) => {
      this.lock();
      emit("dialogue", dialogue);
    };

    for (const [key, pages] of Object.entries(content.signs)) this.interactions.set(key, () => say({ pages }));
    for (const door of doors) {
      const kind = door.object.kind as keyof typeof DOOR_TEXT;
      const terminal = DOOR_TERMINAL[kind];
      const pages = DOOR_TEXT[kind];
      if (terminal)
        this.interactions.set(`${door.x},${door.y}`, () => {
          this.lock();
          emit("terminal", terminal);
        });
      else if (pages) this.interactions.set(`${door.x},${door.y}`, () => say({ pages }));
    }

    // Characters: solid, glance around now and then, and turn to face you when you talk to them
    const reduceMotion = this.reduceMotion;
    for (const npc of content.npcs) {
      const sprite = this.add
        .sprite(npc.x * TILE + PLAYER_W / 2, npc.y * TILE + TILE - 1, `npc-${npc.id}`, DIRS.indexOf(npc.facing))
        .setOrigin(0.5, 1)
        .setDepth(npc.y * TILE + TILE - 1);
      this.solid[npc.y][npc.x] = true;
      this.interactions.set(`${npc.x},${npc.y}`, () => {
        sprite.setFrame(DIRS.indexOf(OPPOSITE[this.facing]));
        say({ speaker: npc.name, pages: npc.pages });
      });
      if (!reduceMotion) {
        this.time.addEvent({
          delay: Phaser.Math.Between(2200, 4200),
          loop: true,
          callback: () => {
            if (!this.locked) sprite.setFrame(Phaser.Math.Between(0, 3));
          },
        });
      }
    }

    // Attribute crystals: bob in place; pressing E collects one (saved, then shown by the UI)
    const have = new Set(discovered());
    for (const c of content.crystals) {
      const attribute = ATTRIBUTES.find((a) => a.id === c.attribute);
      if (!attribute || have.has(attribute.id)) continue;
      const y = c.y * TILE + TILE;
      const crystal = this.add.image(c.x * TILE, y, `crystal-${attribute.rarity}`).setOrigin(0, 1).setDepth(y - 1);
      const bob = reduceMotion ? null : this.tweens.add({ targets: crystal, y: y - 2, duration: 700, yoyo: true, repeat: -1, ease: "Sine.easeInOut" });
      const key = `${c.x},${c.y}`;
      this.solid[c.y][c.x] = true;
      this.interactions.set(key, () => {
        discover(attribute.id);
        this.solid[c.y][c.x] = false;
        this.interactions.delete(key);
        bob?.remove();
        this.tweens.add({ targets: crystal, y: y - 10, alpha: 0, duration: 250, onComplete: () => crystal.destroy() });
        this.lock();
        emit("discover", attribute.id);
      });
    }
  }

  private lock() {
    this.locked = true;
    this.input.keyboard?.resetKeys();
    // Let arrow keys / Space reach the overlay (e.g. to scroll a terminal) while the world is paused
    this.input.keyboard?.disableGlobalCapture();
    if (!this.moving) this.idle();
  }

  private idle() {
    this.player.anims.stop();
    this.player.setFrame(DIRS.indexOf(this.facing) * 3);
  }

  private heldDirection(): Dir | null {
    const k = this.keys;
    if (k.left.isDown || k.a.isDown) return "left";
    if (k.right.isDown || k.d.isDown) return "right";
    if (k.up.isDown || k.w.isDown) return "up";
    if (k.down.isDown || k.s.isDown) return "down";
    return null;
  }

  private blocked(x: number, y: number) {
    return this.solid[y]?.[x] ?? true;
  }

  // Sprite origin is its feet, so it sits on the bottom of its tile and its head overlaps the tile above
  private pixelX() {
    return this.tile.x * TILE + PLAYER_W / 2;
  }

  private pixelY() {
    return this.tile.y * TILE + TILE - 1;
  }

  private placePlayer() {
    this.player.setPosition(this.pixelX(), this.pixelY()).setDepth(this.pixelY());
  }

  // Largest whole-number zoom that still shows about VIEW_TILES (whole numbers keep pixels crisp)
  private fitZoom() {
    const { width, height } = this.scale.gameSize;
    const zoom = Math.max(2, Math.floor(Math.min(width / (VIEW_TILES.w * TILE), height / (VIEW_TILES.h * TILE))));
    this.cameras.main.setZoom(zoom);
  }
}
