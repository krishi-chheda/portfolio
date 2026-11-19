// Minimal Chrome DevTools Protocol driver (Node 24 has a global WebSocket; no dependencies).
import { spawn } from "node:child_process";
import { writeFileSync, mkdirSync } from "node:fs";

const CHROME = "C:/Program Files/Google/Chrome/Application/chrome.exe";

export async function launch(port, profileDir) {
  mkdirSync(profileDir, { recursive: true });
  const proc = spawn(CHROME, [
    "--headless=new",
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${profileDir}`,
    "--window-size=1920,1080",
    "--hide-scrollbars",
    "--mute-audio",
    "--autoplay-policy=no-user-gesture-required",
    "--force-color-profile=srgb",
    "--allow-file-access-from-files", // local render: lets canvases read the composition's own images
    "about:blank",
  ], { stdio: "ignore" });
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(`http://127.0.0.1:${port}/json/version`);
      if (r.ok) break;
    } catch {}
    await sleep(250);
  }
  const target = await (await fetch(`http://127.0.0.1:${port}/json/new?about:blank`, { method: "PUT" })).json();
  const ws = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((res) => (ws.onopen = res));
  let id = 0;
  const pending = new Map();
  ws.onmessage = (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) {
      pending.get(m.id)(m);
      pending.delete(m.id);
    }
  };
  const send = (method, params = {}) =>
    new Promise((resolve, reject) => {
      const i = ++id;
      pending.set(i, (m) => (m.error ? reject(new Error(`${method}: ${m.error.message}`)) : resolve(m.result)));
      ws.send(JSON.stringify({ id: i, method, params }));
    });
  await send("Page.enable");
  await send("Runtime.enable");
  await send("Emulation.setDeviceMetricsOverride", { width: 1920, height: 1080, deviceScaleFactor: 1, mobile: false });

  const api = {
    send,
    async eval(expression) {
      const r = await send("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
      if (r.exceptionDetails) throw new Error(`eval failed: ${r.exceptionDetails.text} ${r.exceptionDetails.exception?.description ?? ""}`);
      return r.result.value;
    },
    async goto(url, waitMs = 0) {
      await send("Page.navigate", { url });
      await api.eval(`new Promise(r => document.readyState === "complete" ? r() : addEventListener("load", () => r(), { once: true }))`);
      if (waitMs) await sleep(waitMs);
    },
    async key(key, code, keyCode, modifiers = 0) {
      for (const type of ["keyDown", "keyUp"]) {
        await send("Input.dispatchKeyEvent", { type, key, code, windowsVirtualKeyCode: keyCode, nativeVirtualKeyCode: keyCode, modifiers });
        await sleep(60);
      }
    },
    async shot(path, clip) {
      const params = { format: "png", captureBeyondViewport: false };
      if (clip) params.clip = { ...clip, scale: 1 };
      const { data } = await send("Page.captureScreenshot", params);
      writeFileSync(path, Buffer.from(data, "base64"));
    },
    async rect(selector) {
      return api.eval(`(() => { const el = document.querySelector(${JSON.stringify(selector)}); if (!el) return null; const r = el.getBoundingClientRect(); return { x: Math.round(r.x), y: Math.round(r.y), width: Math.round(r.width), height: Math.round(r.height) }; })()`);
    },
    close() {
      try { ws.close(); } catch {}
      proc.kill();
    },
  };
  return api;
}

export const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
