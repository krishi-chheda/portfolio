// Captures real UI from the running dev server (localhost:3000) for the brag video.
import { mkdirSync } from "node:fs";
import { launch, sleep } from "./cdp.mjs";

const BASE = "http://localhost:3000";
const OUT = new URL("./captures/", import.meta.url).pathname.replace(/^\/(\w:)/, "$1");
mkdirSync(OUT, { recursive: true });
const b = await launch(9333, new URL("./chrome-profile/", import.meta.url).pathname.replace(/^\/(\w:)/, "$1"));
const hideDev = `document.querySelectorAll("nextjs-portal").forEach(n => n.remove()); true`;

const ALL_ATTRS = ["ai-explorer", "computer-vision", "researcher", "problem-solver", "innovator", "python-developer", "app-builder", "agent-builder", "toolsmith", "team-leader", "community-builder", "professional", "helping-hand", "photographer", "ocean-explorer", "mindful-mover"]; // everything except deep-learning (its crystal must still be on the map)
const seed = (position) => `
  localStorage.setItem("krishi-world:entry", "classic");
  localStorage.setItem("krishi-world:settings:v1", JSON.stringify({ sound: false, music: false, reducedMotion: false }));
  localStorage.setItem("krishi-world:progress:v1", JSON.stringify({ attributes: ${JSON.stringify(ALL_ATTRS)}, regions: ["origin","metropolis","forest","frontier"], terminals: ["accessible-vision","clinicalbrief","traffic-ai","krishi-os"] }));
  ${position ? `localStorage.setItem("krishi-world:position:v1", JSON.stringify(${JSON.stringify(position)}));` : ""}
  true`;

try {
  // ---------- KRISHI.OS (classic) ----------
  await b.goto(`${BASE}/robots.txt`);
  await b.eval(seed());
  await b.goto(`${BASE}/`, 6500);
  await b.eval(hideDev);
  await b.shot(OUT + "os_hero.png");
  console.log("os_hero");

  for (const [id, name, wait] of [["projects", "os_projects", 2500], ["system-map", "os_map", 3500]]) {
    await b.eval(`document.getElementById("${id}").scrollIntoView({ behavior: "instant", block: "start" }); window.scrollBy(0, -56); true`);
    await sleep(wait);
    await b.eval(hideDev);
    await b.shot(OUT + `${name}.png`);
    console.log(name);
  }

  // Palette with "krishi.world" typed
  await b.eval(`window.scrollTo(0, 0); true`);
  await sleep(800);
  await b.key("k", "KeyK", 75, 2); // Ctrl+K
  await sleep(700);
  await b.send("Input.insertText", { text: "krishi.world" });
  await sleep(900);
  await b.eval(hideDev);
  const pal = await b.rect('[role="dialog"][aria-label="Command palette"]');
  await b.shot(OUT + "os_palette.png", pal);
  console.log("os_palette", pal);
  await b.key("Escape", "Escape", 27);

  // ---------- KRISHI.WORLD ----------
  const enterWorld = async (position, wait = 3500) => {
    await b.eval(seed(position));
    await b.goto(`${BASE}/world`, 1800);
    await b.key("x", "KeyX", 88); // skip the cartridge insert
    await sleep(wait);
    await b.eval(hideDev);
  };

  // Origin Valley: next to the guide, then the dialogue
  await enterWorld({ mapId: "origin", x: 22, y: 16, facing: "right" });
  await b.shot(OUT + "w_origin.png");
  await b.key("e", "KeyE", 69);
  await sleep(4000);
  const dlg = await b.rect('[aria-label="Continue"]');
  await b.shot(OUT + "w_dialogue.png", { x: dlg.x - 6, y: dlg.y - 22, width: dlg.width + 12, height: dlg.height + 28 });
  console.log("w_origin + dialogue", dlg);
  await b.key("Escape", "Escape", 27);

  // Project Metropolis: ClinicalBrief HQ terminal
  await enterWorld({ mapId: "metropolis", x: 29, y: 9, facing: "up" });
  await b.shot(OUT + "w_metro.png");
  await b.key("e", "KeyE", 69);
  await sleep(1500);
  const term = await b.rect('[aria-labelledby="terminal-title"] > div');
  await b.shot(OUT + "w_terminal.png", term);
  console.log("w_terminal", term);
  await b.key("Escape", "Escape", 27);
  await sleep(600);
  await b.key("Enter", "Enter", 13); // dismiss any first-read card
  await sleep(400);

  // Innovation Forest: the deep-learning crystal, then its discovery card
  await enterWorld({ mapId: "forest", x: 11, y: 24, facing: "down" });
  await b.shot(OUT + "w_forest.png");
  await b.key("e", "KeyE", 69);
  await sleep(1200);
  const card = await b.rect('[aria-labelledby="discovery-title"] > div');
  await b.shot(OUT + "w_card.png", card);
  console.log("w_card", card);
  await b.key("Enter", "Enter", 13);
  await sleep(500);

  // World map (Adventure Coast still fogged)
  await b.key("m", "KeyM", 77);
  await sleep(1000);
  const map = await b.rect('[aria-labelledby="map-title"] > div');
  await b.shot(OUT + "w_map.png", map);
  console.log("w_map", map);
  await b.key("Escape", "Escape", 27);
  await sleep(500);

  // Adventure Coast: arriving unlocks "World Explorer" (the fifth region)
  await b.eval(`window.__krishiWorld.scene.getScene("world").scene.restart({ mapId: "coast", spawn: { x: 21, y: 13 }, facing: "down" }); true`);
  await sleep(900);
  await b.eval(hideDev);
  const toasts = [];
  for (let i = 0; i < 2; i++) {
    const t = await b.rect('[role="status"]');
    const name = await b.eval(`document.querySelector('[role="status"]')?.innerText.replace(/\\n/g, " ") ?? ""`);
    if (t) {
      await b.shot(OUT + `w_toast${i}.png`, { x: t.x - 2, y: t.y - 2, width: t.width + 10, height: t.height + 10 });
      toasts.push(name);
    }
    await sleep(3700);
  }
  console.log("toasts", toasts);
  await b.eval(`document.querySelectorAll('[role="status"]').forEach(n => n.remove()); true`);
  await sleep(300);
  await b.shot(OUT + "w_coast.png");
  console.log("w_coast");
} finally {
  b.close();
}
