"""Soundtrack for the KRISHI.OS -> KRISHI.WORLD brag video. One piece: A minor, 120 bpm.
Cybertech (saw pad, filtered arp, pulse bass) -> hinge (CRT power-down, cartridge) -> chiptune (pulse lead,
triangle bass, noise hats) -> both together for the outro. Effects are tuned to the key and mixed under the music."""
import numpy as np
import wave

SR = 44100
DUR = 22.5
N = int(SR * DUR)
L = np.zeros(N)
R = np.zeros(N)
rng = np.random.default_rng(7)
BEAT = 0.5  # 120 bpm


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def env(n, a=0.005, r=0.1, sustain=1.0):
    t = np.arange(n) / SR
    e = np.minimum(1, t / max(a, 1e-4))
    rel = np.clip((n / SR - t) / max(r, 1e-4), 0, 1)
    return e * rel * sustain


def lowpass(x, cutoff):
    """One-pole lowpass; cutoff can be a scalar or a per-sample array."""
    c = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    a = 1 - np.exp(-2 * np.pi * c / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def add(sig, start, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= N:
        return
    sig = sig[: N - i]
    gl = gain * np.sqrt((1 - pan) / 2) * np.sqrt(2)
    gr = gain * np.sqrt((1 + pan) / 2) * np.sqrt(2)
    L[i : i + len(sig)] += sig * gl
    R[i : i + len(sig)] += sig * gr


def osc(freq, dur, kind="sine", duty=0.5, detune=0.0):
    n = int(SR * dur)
    t = np.arange(n) / SR
    ph = (freq * (1 + detune)) * t
    if kind == "sine":
        return np.sin(2 * np.pi * ph)
    if kind == "saw":
        return 2 * (ph % 1) - 1
    if kind == "square":
        return np.where((ph % 1) < duty, 1.0, -1.0)
    if kind == "tri":
        return 2 * np.abs(2 * (ph % 1) - 1) - 1
    raise ValueError(kind)


def noise(dur):
    return rng.uniform(-1, 1, int(SR * dur))


# Chords (bar = 2s): Am, F, C, G
CHORDS = [[45, 48, 52, 57], [41, 45, 48, 53], [48, 52, 55, 60], [43, 47, 50, 55]]
ROOTS = [33, 29, 36, 31]


def chord_at(t):
    return int(t // 2) % 4


# ---------------- A. cybertech (0 - 7.6) ----------------
for bar in range(4):
    start = bar * 2.0
    dur = min(2.0, 7.9 - start) + 0.3
    ch = CHORDS[bar % 4]
    for k, n in enumerate(ch):
        s = sum(osc(midi(n), dur, "saw", detune=d) for d in (-0.004, 0.0, 0.004)) / 3
        s = lowpass(s, 900) * env(len(s), a=0.6 if bar == 0 else 0.15, r=0.5)
        add(s, start, 0.07 if bar == 0 else 0.05, pan=(-0.4 + 0.27 * k))

# Arpeggio: 16ths, filter opens as the particles lock (0.4 -> 1.8s)
t = 0.4
step = BEAT / 4
i = 0
while t < 7.55:
    ch = CHORDS[chord_at(t)]
    n = ch[[0, 1, 2, 3, 2, 1][i % 6]] + 24
    s = osc(midi(n), 0.11, "saw") * 0.6 + osc(midi(n), 0.11, "square", duty=0.3) * 0.4
    cutoff = 600 + 3400 * min(1, max(0, (t - 0.4) / 1.4))
    s = lowpass(s, cutoff) * env(len(s), a=0.003, r=0.09)
    add(s, t, 0.045, pan=0.35 if i % 2 else -0.35)
    t += step
    i += 1

# Shimmer when the wordmark locks
for n in (81, 88, 93):
    s = (osc(midi(n), 1.6) + 0.3 * osc(midi(n) * 2, 1.6)) * np.exp(-np.arange(int(SR * 1.6)) / SR * 2.4)
    add(s, 1.75, 0.035)

# Drums + pulse bass from the reveal (3.05)
t = 3.0
b = 0
while t < 7.55:
    # kick on beats
    n_k = int(SR * 0.25)
    tt = np.arange(n_k) / SR
    kick = np.sin(2 * np.pi * np.cumsum(45 + 90 * np.exp(-tt * 30)) / SR) * np.exp(-tt * 14)
    add(kick, t, 0.17)
    if b % 2 == 1:  # snare on 2 & 4
        sn = lowpass(noise(0.18), 5000) * np.exp(-np.arange(int(SR * 0.18)) / SR * 22)
        add(sn, t, 0.06)
    for h in range(4):  # 16th hats
        hh = noise(0.03) - lowpass(noise(0.03), 6000)
        hh *= np.exp(-np.arange(len(hh)) / SR * 120)
        add(hh, t + h * step, 0.03 if h % 2 else 0.05, pan=0.25)
    for e8 in range(2):  # 8th-note pulse bass
        root = ROOTS[chord_at(t + e8 * BEAT / 2)]
        s = lowpass(osc(midi(root + 12), BEAT / 2 * 0.9, "square", duty=0.4), 380)
        add(s * env(len(s), a=0.004, r=0.05), t + e8 * BEAT / 2, 0.085)
    t += BEAT
    b += 1

# Palette typing ticks (6.65 - 7.25) and Enter
for k in range(12):
    tick = lowpass(noise(0.02), 3500) * np.exp(-np.arange(int(SR * 0.02)) / SR * 260)
    add(tick, 6.65 + k * 0.05, 0.05, pan=0.15)
ent = lowpass(noise(0.05), 1800) * np.exp(-np.arange(int(SR * 0.05)) / SR * 90)
add(ent, 7.36, 0.12)

# ---------------- B. hinge (7.6 - 10.0) ----------------
# CRT power-down: falling sine + crackle
n_c = int(SR * 0.45)
tt = np.arange(n_c) / SR
sweep = np.sin(2 * np.pi * np.cumsum(1400 * np.exp(-tt * 9) + 50) / SR) * np.exp(-tt * 5)
add(sweep, 7.6, 0.07)
add(lowpass(noise(0.3), 2500) * np.exp(-np.arange(int(SR * 0.3)) / SR * 14), 7.6, 0.035)
# console hum
hum = osc(55, 1.6) * env(int(SR * 1.6), a=0.2, r=0.3)
add(hum, 7.95, 0.05)
# riser (filtered noise opening up) into the flash
n_r = int(SR * 1.4)
riser = lowpass(noise(1.4), np.linspace(300, 6000, n_r)) * np.linspace(0, 1, n_r) ** 2
add(riser, 8.05, 0.05)
# drop whoosh
n_w = int(SR * 0.5)
add(lowpass(noise(0.5), np.linspace(4000, 400, n_w)) * np.sin(np.linspace(0, np.pi, n_w)), 8.08, 0.07)
# cartridge thunk + click
n_t = int(SR * 0.18)
tt = np.arange(n_t) / SR
thunk = np.sin(2 * np.pi * np.cumsum(70 + 120 * np.exp(-tt * 40)) / SR) * np.exp(-tt * 28)
add(thunk, 9.12, 0.35)
click = (noise(0.015) - lowpass(noise(0.015), 3000)) * np.exp(-np.arange(int(SR * 0.015)) / SR * 300)
add(click, 9.12, 0.18)
# LED blip and power-on chime at the flash (A minor arpeggio, triangle)
add(osc(midi(84), 0.06, "square", duty=0.25) * env(int(SR * 0.06), r=0.04), 9.14, 0.04)
for k, n in enumerate((69, 72, 76, 81, 84)):
    s = osc(midi(n), 0.35, "tri") * env(int(SR * 0.35), a=0.003, r=0.3)
    add(s, 9.45 + k * 0.045, 0.09)

# ---------------- C. chiptune (10.0 - 19.2) ----------------
MEL = [
    [69, 0, 72, 76, 74, 72, 71, 72],  # Am
    [69, 0, 65, 69, 72, 0, 69, 0],  # F
    [67, 0, 72, 76, 79, 76, 74, 72],  # C
    [71, 0, 74, 79, 77, 76, 74, 71],  # G
]
t0 = 10.0
for bar in range(5):
    bstart = t0 + bar * 2.0
    if bstart >= 19.2:
        break
    for e8 in range(8):
        tn = bstart + e8 * BEAT / 2
        if tn >= 19.2:
            break
        n = MEL[bar % 4][e8]
        if n:
            s = osc(midi(n), BEAT / 2 * 0.85, "square", duty=0.125) * env(int(SR * BEAT / 2 * 0.85), a=0.002, r=0.06)
            add(s, tn, 0.085, pan=-0.1)
        # triangle bass on 8ths
        root = ROOTS[bar % 4] + 12
        s = osc(midi(root + (12 if e8 % 2 else 0)), BEAT / 2 * 0.8, "tri") * env(int(SR * BEAT / 2 * 0.8), r=0.05)
        add(s, tn, 0.14)
        # noise hats + a soft "kick" on beats
        hh = (noise(0.025) - lowpass(noise(0.025), 7000)) * np.exp(-np.arange(int(SR * 0.025)) / SR * 150)
        add(hh, tn, 0.025, pan=0.3)
        if e8 % 2 == 0:
            n_k = int(SR * 0.12)
            tt = np.arange(n_k) / SR
            add(np.sign(np.sin(2 * np.pi * np.cumsum(60 + 160 * np.exp(-tt * 45)) / SR)) * np.exp(-tt * 30) * 0.5, tn, 0.12)

# In-key UI effects, tucked under the music
for k in range(15):  # dialogue blips while the line types (10.5 - 11.8)
    s = osc(midi(81 if k % 2 else 84), 0.03, "square", duty=0.25) * env(int(SR * 0.03), r=0.02)
    add(s, 10.5 + k * 0.088, 0.018, pan=0.2)
for k, n in enumerate((76, 81)):  # terminal opens
    add(osc(midi(n), 0.12, "square", duty=0.25) * env(int(SR * 0.12), r=0.08), 12.75 + k * 0.07, 0.035)
for k, n in enumerate((81, 84, 88, 93)):  # crystal discovered
    add(osc(midi(n), 0.2, "tri") * env(int(SR * 0.2), r=0.15), 15.25 + k * 0.07, 0.08)
for k, n in enumerate((72, 76)):  # map opens
    add(osc(midi(n), 0.12, "square", duty=0.25) * env(int(SR * 0.12), r=0.08), 16.6 + k * 0.07, 0.035)
for k, n in enumerate((76, 81, 84, 88)):  # achievement fanfare
    d = 0.35 if k == 3 else 0.1
    add(osc(midi(n), d, "square", duty=0.25) * env(int(SR * d), r=0.08 if k < 3 else 0.3), 18.0 + k * 0.08, 0.045)

# ---------------- D. outro (19.2 - 22.5): both worlds resolve ----------------
add(lowpass(noise(0.6), np.linspace(6000, 300, int(SR * 0.6))) * np.linspace(1, 0, int(SR * 0.6)) ** 2, 19.15, 0.05)
n_k = int(SR * 0.3)
tt = np.arange(n_k) / SR
add(np.sin(2 * np.pi * np.cumsum(45 + 100 * np.exp(-tt * 25)) / SR) * np.exp(-tt * 9), 19.2, 0.35)
for k, n in enumerate([45, 52, 57, 60, 64]):  # Am (19.2 - 21.0)
    s = sum(osc(midi(n), 1.9, "saw", detune=d) for d in (-0.004, 0.004)) / 2
    add(lowpass(s, 1400) * env(len(s), a=0.05, r=0.4), 19.2, 0.07, pan=-0.4 + 0.2 * k)
for k, n in enumerate([48, 55, 62, 64, 67]):  # C add9 resolution (21.0 - 22.5)
    s = sum(osc(midi(n), 1.5, "saw", detune=d) for d in (-0.004, 0.004)) / 2
    add(lowpass(s, 1600) * env(len(s), a=0.08, r=1.2), 21.0, 0.075, pan=-0.4 + 0.2 * k)
for k, n in enumerate([72, 76, 79, 84, 79, 76, 72, 76, 79, 84, 88]):  # chip arpeggio over both
    s = osc(midi(n), 0.12, "square", duty=0.125) * env(int(SR * 0.12), r=0.08)
    add(s, 19.25 + k * 0.125, 0.06, pan=0.3)
s = osc(midi(84), 1.4, "tri") * np.exp(-np.arange(int(SR * 1.4)) / SR * 2)
add(s, 21.0, 0.06)

# ---------------- mix: short stereo delay for space, soft clip, fade ----------------
for ch, d, g in ((L, 0.19, 0.22), (R, 0.23, 0.22)):
    k = int(SR * d)
    wet = np.zeros_like(ch)
    wet[k:] = ch[:-k]
    ch += lowpass(wet, 3000) * g

fade = np.ones(N)
fn = int(SR * 0.7)
fade[-fn:] = np.linspace(1, 0, fn) ** 1.5
L *= fade
R *= fade
mix = np.stack([L, R], axis=1)
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix *= 0.89 / np.max(np.abs(mix))  # about -1 dBFS peak
rms = np.sqrt(np.mean(mix ** 2))
print(f"peak {20*np.log10(np.max(np.abs(mix))):.1f} dBFS, rms {20*np.log10(rms):.1f} dBFS")
pcm = (mix * 32767).astype(np.int16)
with wave.open("soundtrack.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("soundtrack.wav", DUR, "s")
