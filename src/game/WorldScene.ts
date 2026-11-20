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
import { reduceMotion, savePosition, savedPosition } from "./settings";
import { sfx } from "./audio";
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
  private padDir: Dir | null = null; // on-screen D-pad (touch)
  private bobs: Phaser.Tweens.Tween[] = []; // crystal bob tweens, paused when motion is reduced
  private tiles: number[][] = []; // terrain tile ids, to know what the player is stepping on
  private prompt!: Phaser.GameObjects.Image; // "!" bubble over whatever the player faces and can use
  private lastBump = 0;

  constructor() {
    super("world");
  }

  // Runs before create() on first boot and on every warp (scene.restart reuses this instance, so reset state)
  init(arrival: Arrival) {
    // First boot with no target: resume where this browser left off (validated against the map in create())
    const saved = arrival?.mapId ? null : savedPosition();
    this.arrival = saved && MAPS[saved.mapId] ? { mapId: saved.mapId, spawn: { x: saved.x, y: saved.y }, facing: saved.facing } : (arrival ?? {});
    this.def = MAPS[this.arrival.mapId ?? "origin"] ?? originValley;
    this.interactions = new Map();
    this.moving = false;
    this.locked = false;
    this.reduceMotion = reduceMotion();
    this.padDir = null;
    this.bobs = [];
    this.lastBump = 0;
  }

  create() {
    generateTextures(this, ALL_NPCS); // no-op after the first map

    const built = buildMap(this.def);
    this.solid = built.solid;
    this.tiles = built.tiles;
    this.makeFxTextures();
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
    if (this.blocked(this.tile.x, this.tile.y)) this.tile = { ...this.def.spawn }; // stale save (map changed)
    this.facing = this.arrival.facing ?? "down";
    this.player = this.add.sprite(0, 0, "player", 0).setOrigin(0.5, 1);
    this.placePlayer();
    this.idle();

    // Interaction prompt: a small "!" bubble above anything the player faces and can talk to or inspect
    this.prompt = this.add.image(0, 0, "fx-prompt").setOrigin(0.5, 1).setDepth(1e6).setVisible(false);

    this.addCloudShadows(map.widthInPixels, map.heightInPixels);

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
      on("pad", (dir) => {
        this.padDir = dir;
      }),
      on("pad-a", () => {
        if (!this.locked && !this.moving) this.interact();
      }),
      on("settings-changed", () => {
        this.reduceMotion = reduceMotion();
        for (const bob of this.bobs) {
          if (this.reduceMotion) bob.pause();
          else bob.resume();
        }
      }),
      on("travel", (to) => {
        const target = MAPS[to];
        this.game.loop.wake(); // the fade needs the loop running
        if (target && to !== this.def.id) this.warp({ x: 0, y: 0, to, spawn: target.spawn, facing: "down" });
      }),
      on("ui-closed", () => {
        this.game.loop.wake();
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
    this.savePosition();
    this.scale.on(Phaser.Scale.Events.RESIZE, this.fitZoom, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => {
      this.scale.off(Phaser.Scale.Events.RESIZE, this.fitZoom, this);
      offs.forEach((off) => off());
    });
  }

  update() {
    this.refreshPrompt();
    if (this.locked || this.moving) return;
    const { JustDown } = Phaser.Input.Keyboard;
    if (JustDown(this.keys.e) || JustDown(this.keys.enter)) {
      this.interact();
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
      if (this.time.now - this.lastBump > 450) {
        this.lastBump = this.time.now;
        sfx("bump");
      }
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
        this.savePosition();
        emit("moved");
        this.stepEffects();
        const warp = this.def.warps.find((w) => w.x === this.tile.x && w.y === this.tile.y);
        if (warp) this.warp(warp);
      },
    });
  }

  private interact() {
    const [dx, dy] = DELTA[this.facing];
    this.interactions.get(`${this.tile.x + dx},${this.tile.y + dy}`)?.();
  }

  private savePosition() {
    savePosition({ mapId: this.def.id, x: this.tile.x, y: this.tile.y, facing: this.facing });
  }

  // Fade out, then rebuild the scene on the target map
  private warp(w: Warp) {
    this.locked = true;
    sfx("warp");
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
      this.time.addEvent({
        delay: Phaser.Math.Between(2200, 4200),
        loop: true,
        callback: () => {
          if (!this.locked && !this.reduceMotion) sprite.setFrame(Phaser.Math.Between(0, 3));
        },
      });
    }

    // Attribute crystals: bob in place; pressing E collects one (saved, then shown by the UI)
    const have = new Set(discovered());
    for (const c of content.crystals) {
      const attribute = ATTRIBUTES.find((a) => a.id === c.attribute);
      if (!attribute || have.has(attribute.id)) continue;
      const y = c.y * TILE + TILE;
      const crystal = this.add.image(c.x * TILE, y, `crystal-${attribute.rarity}`).setOrigin(0, 1).setDepth(y - 1);
      const bob = this.tweens.add({ targets: crystal, y: y - 2, duration: 700, yoyo: true, repeat: -1, ease: "Sine.easeInOut", paused: this.reduceMotion });
      this.bobs.push(bob);
      const key = `${c.x},${c.y}`;
      this.solid[c.y][c.x] = true;
      this.interactions.set(key, () => {
        discover(attribute.id);
        this.solid[c.y][c.x] = false;
        this.interactions.delete(key);
        bob.remove();
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
    // Stop redrawing the world behind an open panel (battery / CPU), once any last animation (a crystal's
    // fade-out) has played. ui-closed wakes it.
    this.time.delayedCall(300, () => {
      if (this.locked) this.game.loop.sleep();
    });
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
    return this.padDir;
  }

  /** Shows the "!" bubble over the faced tile when pressing E there would do something. */
  private refreshPrompt() {
    if (!this.prompt) return;
    const [dx, dy] = DELTA[this.facing];
    const tx = this.tile.x + dx;
    const ty = this.tile.y + dy;
    const show = !this.locked && !this.moving && this.interactions.has(`${tx},${ty}`);
    if (show) {
      // over the target's head (characters and crystals stand on their tile; doors and signs are flat), bobbing 1px
      const bob = !this.reduceMotion && Math.sin(this.time.now / 220) > 0 ? 1 : 0;
      this.prompt.setPosition(tx * TILE + TILE / 2, ty * TILE - 9 - bob);
    }
    this.prompt.setVisible(show);
  }

  /** Stepping through tall grass or flowers rustles: a few leaves pop up and a soft sound plays. */
  private stepEffects() {
    const tile = this.tiles[this.tile.y]?.[this.tile.x];
    if (tile !== T.TALL && tile !== T.FLOWER) return;
    sfx("rustle");
    if (this.reduceMotion) return;
    const x0 = this.tile.x * TILE + TILE / 2;
    const y0 = this.tile.y * TILE + TILE - 3;
    for (let i = 0; i < 4; i++) {
      const leaf = this.add.image(x0 + Phaser.Math.Between(-5, 5), y0, tile === T.FLOWER && i % 2 ? "fx-petal" : "fx-leaf").setDepth(this.player.depth + 1);
      this.tweens.add({
        targets: leaf,
        x: leaf.x + Phaser.Math.Between(-7, 7),
        y: y0 - Phaser.Math.Between(6, 12),
        alpha: 0,
        duration: Phaser.Math.Between(320, 480),
        ease: "Quad.easeOut",
        onComplete: () => leaf.destroy(),
      });
    }
  }

  /** Two soft cloud shadows drift across the map: ambient life, drawn above everything at low alpha. */
  private addCloudShadows(w: number, h: number) {
    if (this.reduceMotion) return;
    for (let i = 0; i < 2; i++) {
      const cloud = this.add.image(0, 0, "fx-cloud").setDepth(5e5).setAlpha(0.16).setScale(i ? 1.3 : 1);
      const y = h * (i ? 0.7 : 0.25);
      const cross = () => {
        cloud.setPosition(-cloud.displayWidth, y + Phaser.Math.Between(-40, 40));
        this.tweens.add({ targets: cloud, x: w + cloud.displayWidth, duration: (w + cloud.displayWidth * 2) * 90, onComplete: cross });
      };
      cross();
      cloud.x = Phaser.Math.Between(0, w); // start mid-way so the first one is already on screen
    }
  }

  /** Tiny textures for the effects above, drawn once. */
  private makeFxTextures() {
    if (this.textures.exists("fx-prompt")) return;
    const g = this.make.graphics({}, false);
    // "!" speech bubble, 9x11, GBA-style white with a dark outline and a tail
    g.fillStyle(0x1f1d24).fillRect(0, 0, 9, 9).fillRect(3, 9, 3, 1).fillRect(4, 10, 1, 1);
    g.fillStyle(0xffffff).fillRect(1, 1, 7, 7).fillRect(4, 9, 1, 1);
    g.fillStyle(0xe0564a).fillRect(4, 2, 1, 3).fillRect(4, 6, 1, 1);
    g.generateTexture("fx-prompt", 9, 11);
    g.clear();
    g.fillStyle(0x5e9e48).fillRect(0, 0, 2, 2).fillStyle(0x97cd74).fillRect(0, 0, 1, 1);
    g.generateTexture("fx-leaf", 2, 2);
    g.clear();
    g.fillStyle(0xf7c6d9).fillRect(0, 0, 2, 2).fillStyle(0xffffff).fillRect(0, 0, 1, 1);
    g.generateTexture("fx-petal", 2, 2);
    g.destroy();
    // soft-edged cloud shadow
    const c = this.textures.createCanvas("fx-cloud", 160, 90);
    if (c) {
      const ctx = c.getContext();
      const grad = ctx.createRadialGradient(80, 45, 8, 80, 45, 78);
      grad.addColorStop(0, "rgba(8,28,18,1)");
      grad.addColorStop(1, "rgba(8,28,18,0)");
      ctx.fillStyle = grad;
      ctx.scale(1, 0.56);
      ctx.beginPath();
      ctx.arc(80, 80, 78, 0, Math.PI * 2);
      ctx.fill();
      c.refresh();
    }
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
