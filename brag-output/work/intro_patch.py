p = r'C:\Users\krish\OneDrive\Desktop\Python\krishichheda\brag-output\work\composition2.html'
s = open(p, encoding='utf-8').read()


def rep(a, b):
    global s
    assert s.count(a) == 1, a
    s = s.replace(a, b)


# Intro canvas sits above everything
rep('''  <div id="flash" class="layer" style="background:#fff;opacity:0"></div>''',
    '''  <canvas id="intro" class="layer" width="1920" height="1080"></canvas>
  <div id="flash" class="layer" style="background:#fff;opacity:0"></div>''')

rep('''window.TOTAL = 24.0;''', '''window.TOTAL = 25.0;''')
rep('''function renderAt(t) {''', '''function renderOld(t) {''')

rep('''window.renderAt = renderAt;''', '''// ---------- 0. the pixel computer (new opening) + time remap ----------
// New timeline T: 0-2.6 pixel computer boots; 2.6-13.9 the OS chain (old t = T - 2.6);
// 13.9-21.36 the game, 18% tighter; then the outro at its original pace.
function oldTime(T) {
  if (T < 2.6) return 0;
  if (T < 13.9) return T - 2.6;
  if (T < 21.36) return 11.3 + (T - 13.9) / 0.82;
  return 20.4 + (T - 21.36);
}
window.oldTime = oldTime;

const VW = 240, VH = 135; // virtual pixel resolution of the intro (x8 = 1920x1080)
const lo = document.createElement("canvas");
lo.width = VW; lo.height = VH;
const lctx = lo.getContext("2d");
const ictx = $("intro").getContext("2d");
const SCREEN = { x: 82, y: 30, w: 76, h: 52 }; // monitor glass, in virtual pixels
function R(c, x, y, w, h) { lctx.fillStyle = c; lctx.fillRect(x, y, w, h); }
function drawComputer(T) {
  lctx.imageSmoothingEnabled = false;
  // room + desk
  R("#0b0f0d", 0, 0, VW, VH);
  for (let y = 0; y < 104; y += 6) R("rgba(52,211,153,0.025)", 0, y, VW, 1);
  R("#2b2420", 0, 104, VW, 31);
  R("#46382b", 0, 104, VW, 3);
  // monitor case
  R("#5b6b7e", 70, 20, 102, 80);
  R("#c8ccd4", 72, 22, 98, 76);
  R("#9aa0a8", 72, 94, 98, 4);
  R("#e8eaee", 72, 22, 98, 2);
  R("#3a3f4a", SCREEN.x - 3, SCREEN.y - 3, SCREEN.w + 6, SCREEN.h + 6);
  // stand + keyboard + mug + plant
  R("#9aa0a8", 108, 100, 26, 5);
  R("#5b6b7e", 102, 105, 38, 2);
  R("#5b6b7e", 58, 112, 126, 14);
  R("#c8ccd4", 60, 113, 122, 11);
  for (let r = 0; r < 3; r++) for (let k = 0; k < 15; k++) R("#9aa0a8", 62 + k * 8 - (r % 2) * 2, 114 + r * 3, 6, 2);
  R("#e0564a", 196, 96, 10, 10); R("#a83a32", 196, 104, 10, 2); R("#e0564a", 206, 98, 3, 5);
  R("#46382b", 30, 92, 12, 12); R("#285943", 28, 82, 6, 10); R("#78b85a", 34, 78, 6, 14); R("#285943", 40, 84, 5, 8);
  // power LED + button (pressed at 0.35)
  const on = T >= 0.35;
  R(on ? "#34d399" : "#e0564a", 158, 90, 3, 2);
  R(T >= 0.3 && T < 0.42 ? "#3a3f4a" : "#5b6b7e", 150, 89, 5, 4);
  // the glass: dark, then a CRT warm-up line that opens vertically, then boot text
  R("#050706", SCREEN.x, SCREEN.y, SCREEN.w, SCREEN.h);
  const open = seg(T, 0.45, 0.75);
  if (open > 0) {
    const h = Math.max(1, Math.round(SCREEN.h * eOut(open)));
    const y = SCREEN.y + Math.round((SCREEN.h - h) / 2);
    R(open < 1 ? "#a7f3d0" : "#0a0c0b", SCREEN.x, y, SCREEN.w, h);
    if (open >= 1) {
      lctx.font = "7px Pixelify";
      lctx.textBaseline = "top";
      const lines = [[0.8, "KRISHI.OS BIOS v0.1.0", "#34d399"], [1.0, "MEM CHECK ...... OK", "#a1aaa3"], [1.2, "LOADING KRISHI.OS", "#a1aaa3"]];
      lines.forEach(([at, text, color], i) => {
        if (T < at) return;
        const n = Math.min(text.length, Math.floor((T - at) * 60));
        lctx.fillStyle = color;
        lctx.fillText(text.slice(0, n), SCREEN.x + 4, SCREEN.y + 4 + i * 9);
      });
      if (T >= 1.35) {
        const bar = seg(T, 1.35, 2.0);
        R("#222826", SCREEN.x + 4, SCREEN.y + 34, SCREEN.w - 8, 3);
        R("#34d399", SCREEN.x + 4, SCREEN.y + 34, Math.round((SCREEN.w - 8) * bar), 3);
      }
      if (Math.floor(T * 3) % 2) R("#34d399", SCREEN.x + 4, SCREEN.y + 44, 3, 5); // cursor
      // fade the text out as the camera dives in, so the screen is dark when it fills the frame
      const fadeOut = seg(T, 2.15, 2.45);
      if (fadeOut > 0) { lctx.globalAlpha = fadeOut; R("#0a0c0b", SCREEN.x, SCREEN.y, SCREEN.w, SCREEN.h); lctx.globalAlpha = 1; }
    }
    // scanlines on the glass
    for (let y = SCREEN.y; y < SCREEN.y + SCREEN.h; y += 2) { lctx.globalAlpha = 0.25; R("#000", SCREEN.x, y, SCREEN.w, 1); lctx.globalAlpha = 1; }
  }
  // dark-room fade in
  const fin = seg(T, 0, 0.3);
  if (fin < 1) { lctx.globalAlpha = 1 - fin; R("#000", 0, 0, VW, VH); lctx.globalAlpha = 1; }
}
function renderIntro(T) {
  drawComputer(T);
  // camera: hold the whole computer, then dive into the screen until the glass fills the frame
  const z = eIn(seg(T, 1.75, 2.6));
  const cx0 = VW / 2, cy0 = VH / 2, cx1 = SCREEN.x + SCREEN.w / 2, cy1 = SCREEN.y + SCREEN.h / 2;
  const scale = 8 * Math.pow(1920 / SCREEN.w / 8 * 1.06, z);
  const cx = cx0 + (cx1 - cx0) * Math.min(1, z * 1.6), cy = cy0 + (cy1 - cy0) * Math.min(1, z * 1.6);
  ictx.imageSmoothingEnabled = false;
  ictx.fillStyle = "#000";
  ictx.fillRect(0, 0, 1920, 1080);
  ictx.drawImage(lo, 960 - cx * scale, 540 - cy * scale, VW * scale, VH * scale);
}
// After the dive: the hi-res particle boot comes into focus out of big pixels
const dp = document.createElement("canvas"), dctx = dp.getContext("2d");
function depixel(T) {
  const p = seg(T, 2.6, 3.15), block = Math.max(1, Math.round(24 * (1 - eOut(p))));
  const w = Math.ceil(1920 / block), h = Math.ceil(1080 / block);
  dp.width = w; dp.height = h;
  dctx.fillStyle = "#0a0c0b"; dctx.fillRect(0, 0, w, h);
  dctx.drawImage($("particles"), 0, 0, w, h);
  ictx.imageSmoothingEnabled = false;
  ictx.drawImage(dp, 0, 0, w * block, h * block);
}

function renderAt(T) {
  renderOld(oldTime(T));
  const introOn = T < 3.15 && !window.SNAPSHOT;
  show($("intro"), introOn);
  if (T < 2.6) { renderIntro(T); $("boot").style.visibility = "hidden"; }
  else if (introOn) { depixel(T); $("boot").style.visibility = "visible"; $("intro").style.opacity = String(1 - seg(T, 2.95, 3.15)); }
  else { $("boot").style.visibility = "visible"; $("intro").style.opacity = "1"; }
  if (T < 2.6) $("intro").style.opacity = "1";
}
window.renderAt = renderAt;''')
open(p, 'w', encoding='utf-8').write(s)
print('ok')
