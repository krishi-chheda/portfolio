import * as Phaser from "phaser";
import { DIRS, OBJECTS, PLAYER_W, T, TILE, generateTextures, type Dir } from "./textures";
import { buildMap } from "./maps/legend";
import { originValley } from "./maps/originValley";

const STEP_MS = 220; // time to walk one tile (GBA-like pace)
const VIEW_TILES = { w: 18, h: 12 }; // aim to show about this many tiles, at an integer zoom

const DELTA: Record<Dir, [number, number]> = { down: [0, 1], up: [0, -1], left: [-1, 0], right: [1, 0] };

/**
 * Tile-by-tile movement, like the GBA games: the player always stands on a tile, walking is a tween to the
 * next one, and collision is a lookup in the map grid. That also gives later sprints a simple
 * "which tile am I facing?" for interactions.
 */
export class WorldScene extends Phaser.Scene {
  private solid: boolean[][] = [];
  private player!: Phaser.GameObjects.Sprite;
  private tile = { x: 0, y: 0 };
  private facing: Dir = "down";
  private moving = false;
  private keys!: Record<"up" | "down" | "left" | "right" | "w" | "a" | "s" | "d", Phaser.Input.Keyboard.Key>;

  constructor() {
    super("world");
  }

  create() {
    generateTextures(this);

    const built = buildMap(originValley);
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
    for (const obj of originValley.objects) {
      const { h } = OBJECTS[obj.kind];
      const bottom = (obj.y + h) * TILE;
      this.add.image(obj.x * TILE, bottom, obj.kind).setOrigin(0, 1).setDepth(bottom - 1);
    }

    DIRS.forEach((dir, d) => {
      this.anims.create({
        key: `walk-${dir}`,
        frames: [1, 0, 2, 0].map((step) => ({ key: "player", frame: d * 3 + step })),
        frameRate: 9,
        repeat: -1,
      });
    });

    this.tile = { ...originValley.spawn };
    this.player = this.add.sprite(0, 0, "player", 0).setOrigin(0.5, 1);
    this.placePlayer();

    const kb = this.input.keyboard;
    if (!kb) throw new Error("KRISHI.WORLD: keyboard input unavailable");
    this.keys = kb.addKeys({ up: "UP", down: "DOWN", left: "LEFT", right: "RIGHT", w: "W", a: "A", s: "S", d: "D" }) as typeof this.keys;

    const cam = this.cameras.main;
    cam.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
    cam.setRoundPixels(true);
    cam.startFollow(this.player, true);
    this.fitZoom();
    this.scale.on(Phaser.Scale.Events.RESIZE, this.fitZoom, this);
    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.scale.off(Phaser.Scale.Events.RESIZE, this.fitZoom, this));
  }

  update() {
    if (this.moving) return;
    const dir = this.heldDirection();
    if (!dir) {
      this.player.anims.stop();
      this.player.setFrame(DIRS.indexOf(this.facing) * 3);
      return;
    }
    this.facing = dir;
    const [dx, dy] = DELTA[dir];
    const next = { x: this.tile.x + dx, y: this.tile.y + dy };
    if (this.blocked(next.x, next.y)) {
      // Bump: face the obstacle without moving
      this.player.anims.stop();
      this.player.setFrame(DIRS.indexOf(dir) * 3);
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
      },
    });
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
