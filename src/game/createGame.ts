import * as Phaser from "phaser";
import { WorldScene } from "./WorldScene";

/** Boots KRISHI.WORLD into `parent`. Browser-only: import this module dynamically from a client component. */
export function createGame(parent: HTMLElement) {
  const game = new Phaser.Game({
    type: Phaser.AUTO,
    parent,
    pixelArt: true,
    backgroundColor: "#1c4031",
    banner: false,
    scale: {
      mode: Phaser.Scale.RESIZE,
      width: parent.clientWidth,
      height: parent.clientHeight,
    },
    scene: [WorldScene],
  });
  // Dev-only handle for inspecting state from the console (e.g. window.__krishiWorld.scene.getScene("world"))
  if (process.env.NODE_ENV !== "production") (window as unknown as { __krishiWorld?: Phaser.Game }).__krishiWorld = game;
  return game;
}
