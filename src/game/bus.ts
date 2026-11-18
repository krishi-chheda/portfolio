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
