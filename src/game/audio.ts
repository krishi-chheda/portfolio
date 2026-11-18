// Original chiptune sound for KRISHI.WORLD, synthesised with the Web Audio API: no audio files, nothing
// borrowed. Browsers only allow audio after a user gesture; everything here is triggered by key presses or
// taps, and the AudioContext is created lazily on the first one.

import { getSettings } from "./settings";

type Wave = OscillatorType;
export type Sfx = "blip" | "open" | "select" | "discover" | "achievement" | "warp";

let ctx: AudioContext | null = null;

function audio(): AudioContext | null {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") void ctx.resume();
  return ctx;
}

function tone(c: AudioContext, freq: number, start: number, dur: number, wave: Wave = "square", vol = 0.05, slideTo?: number) {
  const osc = c.createOscillator();
  const gain = c.createGain();
  osc.type = wave;
  osc.frequency.setValueAtTime(freq, start);
  if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, start + dur);
  gain.gain.setValueAtTime(vol, start);
  gain.gain.exponentialRampToValueAtTime(0.0001, start + dur);
  osc.connect(gain).connect(c.destination);
  osc.start(start);
  osc.stop(start + dur + 0.02);
}

const note = (n: number) => 440 * 2 ** ((n - 69) / 12); // MIDI note -> Hz

const SFX: Record<Sfx, (c: AudioContext, t: number) => void> = {
  blip: (c, t) => tone(c, 880, t, 0.035, "square", 0.03),
  select: (c, t) => tone(c, 1320, t, 0.03, "square", 0.025),
  open: (c, t) => {
    tone(c, 660, t, 0.05);
    tone(c, 990, t + 0.05, 0.07);
  },
  discover: (c, t) => [72, 76, 79, 84].forEach((n, i) => tone(c, note(n), t + i * 0.08, 0.14, "triangle", 0.08)),
  achievement: (c, t) => [67, 72, 76, 79, 84].forEach((n, i) => tone(c, note(n), t + i * 0.07, i === 4 ? 0.35 : 0.1, "square", 0.04)),
  warp: (c, t) => tone(c, 520, t, 0.25, "triangle", 0.06, 130),
};

export function sfx(name: Sfx) {
  if (!getSettings().sound) return;
  const c = audio();
  if (c) SFX[name](c, c.currentTime);
}

// ---------- music: a gentle 16-step loop, scheduled slightly ahead so timers can't make it stutter ----------

const STEP = 60 / 104 / 2; // eighth notes at 104 bpm
const LEAD = [76, 0, 79, 0, 81, 0, 79, 76, 74, 0, 76, 0, 72, 0, 0, 0, 76, 0, 79, 0, 84, 0, 83, 79, 81, 0, 79, 0, 76, 0, 0, 0];
const BASS = [48, 48, 55, 55, 57, 57, 53, 53];

let timer: ReturnType<typeof setInterval> | null = null;
let step = 0;
let nextTime = 0;

function startMusic() {
  const c = audio();
  if (!c || timer) return;
  step = 0;
  nextTime = c.currentTime + 0.1;
  timer = setInterval(() => {
    while (nextTime < c.currentTime + 0.25) {
      const lead = LEAD[step % LEAD.length];
      if (lead) tone(c, note(lead), nextTime, STEP * 0.9, "triangle", 0.025);
      if (step % 4 === 0) tone(c, note(BASS[(step / 4) % BASS.length]), nextTime, STEP * 3.5, "square", 0.012);
      nextTime += STEP;
      step++;
    }
  }, 60);
}

export function stopMusic() {
  if (timer) clearInterval(timer);
  timer = null;
}

/** Starts or stops the loop to match the Music setting. Call after a user gesture. */
export function syncMusic() {
  if (getSettings().music) startMusic();
  else stopMusic();
}
