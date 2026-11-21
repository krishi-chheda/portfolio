// The only link between the Phaser scene and the React HUD. No Phaser import here, so React can use it
// without pulling the engine into its bundle.

export interface Dialogue {
  speaker?: string;
  pages: string[];
}

interface Events {
  dialogue: Dialogue; // scene -> UI: show a conversation or inspection text
  discover: string; // scene -> UI: an attribute id was just collected
  "open-journal": void; // scene -> UI: the I key was pressed
  "open-profile": void; // scene -> UI: the P key was pressed
  "open-map": void; // scene -> UI: the M key was pressed
  "open-achievements": void; // scene -> UI: the J key was pressed
  "open-menu": void; // scene -> UI: Escape was pressed in the world
  terminal: string; // scene -> UI: a project HQ's doors were used (project id)
  region: { id: string; name: string; parent?: string }; // scene -> UI: the map the player is now in (parent: the region an interior belongs to)
  exhibit: { project: string; section: import("./content").ExhibitSection }; // scene -> UI: an HQ exhibit was inspected
  moved: void; // scene -> UI: the player took a step (the HUD fades its controls hint)
  travel: string; // UI -> scene: fast travel to a visited region (map id)
  pad: "down" | "up" | "left" | "right" | null; // UI -> scene: on-screen D-pad held direction (null = released)
  "pad-a": void; // UI -> scene: on-screen A button (interact)
  "settings-changed": void; // UI -> scene: sound / music / motion toggled
  "ui-open": void; // UI -> scene: an overlay opened (pause movement)
  "ui-closed": void; // UI -> scene: all overlays closed (resume)
}

const target = new EventTarget();

export function emit<K extends keyof Events>(type: K, ...[detail]: Events[K] extends void ? [] : [Events[K]]) {
  target.dispatchEvent(new CustomEvent(type, { detail }));
}

export function on<K extends keyof Events>(type: K, fn: (detail: Events[K]) => void) {
  const handler = (e: Event) => fn((e as CustomEvent<Events[K]>).detail);
  target.addEventListener(type, handler);
  return () => target.removeEventListener(type, handler);
}
