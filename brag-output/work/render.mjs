// node render.mjs stills 1.2 3.6 ...   -> stills/t_<t>.png
// node render.mjs frames               -> frames/f_00000.jpg ... (30 fps)
import { mkdirSync } from "node:fs";
import { pathToFileURL, fileURLToPath } from "node:url";
import { launch } from "./cdp.mjs";

const here = fileURLToPath(new URL(".", import.meta.url));
const [mode, ...times] = process.argv.slice(2);
const b = await launch(9334, here + "render-profile");
try {
  await b.goto(pathToFileURL(here + (process.env.COMP ?? "composition.html")).href);
  const n = await b.eval("window.ready");
  const total = await b.eval("window.TOTAL");
  console.log(`particles: ${n}, total: ${total}s`);
  if (mode === "snapshot") {
    // the finished desktop, saved for the pixelation to break apart
    await b.eval(`window.SNAPSHOT = true; renderAt(${Number(times[0])}); new Promise(r => requestAnimationFrame(() => r()))`);
    await b.shot(here + "captures/desktop_snapshot.png");
    console.log("snapshot saved");
  } else if (mode === "stills") {
    mkdirSync(here + "stills", { recursive: true });
    for (const t of times) {
      await b.eval(`renderAt(${Number(t)}); new Promise(r => requestAnimationFrame(() => r()))`);
      await b.shot(here + `stills/t_${t}.png`);
    }
  } else {
    mkdirSync(here + "frames", { recursive: true });
    const frames = Math.round(total * 30);
    for (let i = 0; i < frames; i++) {
      await b.eval(`renderAt(${(i / 30).toFixed(5)}); new Promise(r => requestAnimationFrame(() => r()))`);
      const { data } = await b.send("Page.captureScreenshot", { format: "jpeg", quality: 95 });
      (await import("node:fs")).writeFileSync(here + `frames/f_${String(i).padStart(5, "0")}.jpg`, Buffer.from(data, "base64"));
      if (i % 60 === 0) console.log(`frame ${i}/${frames}`);
    }
  }
} finally {
  b.close();
}
