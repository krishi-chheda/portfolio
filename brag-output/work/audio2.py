"""Soundtrack v2: pixel computer boots -> KRISHI.OS desktop -> bit-crushed switch -> KRISHI.WORLD chiptune -> outro.
One piece in A minor at 120 bpm. Times are the video's (25.0s). Game-section events use the same remap as the
composition: T = 13.9 + (old - 11.3) * 0.82."""
import numpy as np
import wave

SR = 44100
DUR = 25.0
N = int(SR * DUR)
rng = np.random.default_rng(11)
BEAT = 0.5
STEP = BEAT / 4

BUS = {k: np.zeros((2, N)) for k in ("cyber", "chip", "sfx", "amb")}


def midi(n):
    return 440.0 * 2 ** ((n - 69) / 12)


def env(n, a=0.005, r=0.1):
    t = np.arange(n) / SR
    return np.minimum(1, t / max(a, 1e-4)) * np.clip((n / SR - t) / max(r, 1e-4), 0, 1)


def lowpass(x, cutoff):
    c = np.broadcast_to(np.asarray(cutoff, dtype=float), x.shape)
    a = 1 - np.exp(-2 * np.pi * c / SR)
    y = np.empty_like(x)
    acc = 0.0
    for i in range(len(x)):
        acc += a[i] * (x[i] - acc)
        y[i] = acc
    return y


def osc(freq, dur, kind="sine", duty=0.5, detune=0.0):
    t = np.arange(int(SR * dur)) / SR
    ph = freq * (1 + detune) * t
    if kind == "sine":
        return np.sin(2 * np.pi * ph)
    if kind == "saw":
        return 2 * (ph % 1) - 1
    if kind == "square":
        return np.where((ph % 1) < duty, 1.0, -1.0)
    return 2 * np.abs(2 * (ph % 1) - 1) - 1  # tri


def noise(dur):
    return rng.uniform(-1, 1, int(SR * dur))


def decay(n, rate):
    return np.exp(-np.arange(n) / SR * rate)


def add(bus, sig, start, gain=1.0, pan=0.0):
    i = int(start * SR)
    if i >= N or i < 0:
        return
    sig = sig[: N - i]
    BUS[bus][0, i : i + len(sig)] += sig * gain * np.sqrt(1 - pan)
    BUS[bus][1, i : i + len(sig)] += sig * gain * np.sqrt(1 + pan)


def g(old):  # game-section remap
    return 13.9 + (old - 11.3) * 0.82


CHORDS = [[45, 48, 52, 57], [41, 45, 48, 53], [48, 52, 55, 60], [43, 47, 50, 55]]
ROOTS = [33, 29, 36, 31]

# ================= 0. the pixel computer (0 - 2.6) =================
add("amb", lowpass(noise(2.7), 400) * env(int(SR * 2.7), a=0.3, r=0.3), 0.0, 0.03)  # room tone
add("amb", osc(50, 2.6) * env(int(SR * 2.6), a=0.3, r=0.2), 0.0, 0.015)  # mains hum
click = (noise(0.02) - lowpass(noise(0.02), 2500)) * decay(int(SR * 0.02), 250)
add("sfx", click, 0.33, 0.25)  # power button
n = int(SR * 0.25)
tt = np.arange(n) / SR
add("sfx", np.sin(2 * np.pi * np.cumsum(60 + 80 * np.exp(-tt * 20)) / SR) * decay(n, 12), 0.38, 0.22)  # CRT thump
whine = osc(7800, 1.6) * env(int(SR * 1.6), a=0.2, r=0.6)
add("amb", whine, 0.45, 0.004)  # faint CRT whine
add("sfx", osc(midi(81), 0.14, "square", duty=0.5) * env(int(SR * 0.14), r=0.03), 0.8, 0.06)  # BIOS beep
for start, chars in ((0.8, 21), (1.0, 19), (1.2, 17)):  # boot text typing at 60 cps
    for k in range(0, chars, 2):
        tick = lowpass(noise(0.012), 3000) * decay(int(SR * 0.012), 300)
        add("sfx", tick, start + k / 60, 0.03, pan=0.1)
for k in range(10):  # disk chatter while the bar fills
    gr = lowpass(noise(0.03), 1800 + 600 * (k % 3)) * decay(int(SR * 0.03), 90)
    add("sfx", gr, 1.35 + k * 0.065 + 0.02 * (k % 2), 0.05, pan=-0.2)
n = int(SR * 0.9)
riser = lowpass(noise(0.9), np.linspace(300, 7000, n)) * np.linspace(0, 1, n) ** 2.2
add("sfx", riser, 1.72, 0.09)  # the dive into the screen
add("sfx", osc(midi(57), 0.9, "saw") * np.linspace(0, 1, n) ** 3 * 0.5, 1.72, 0.03)
n = int(SR * 0.6)
tt = np.arange(n) / SR
add("sfx", np.sin(2 * np.pi * np.cumsum(38 + 60 * np.exp(-tt * 10)) / SR) * decay(n, 6), 2.6, 0.3)  # arrival

# ================= 1. KRISHI.OS (2.6 - 12.5): synth bus (later bit-crushed) =================
OS0 = 2.6
for bar in range(5):
    start = OS0 + bar * 2.0
    if start >= 12.5:
        break
    dur = min(2.0, 12.5 - start) + 0.2
    for k, nn in enumerate(CHORDS[bar % 4]):
        s = sum(osc(midi(nn), dur, "saw", detune=d) for d in (-0.004, 0.0, 0.004)) / 3
        add("cyber", lowpass(s, 900) * env(len(s), a=0.5 if bar == 0 else 0.12, r=0.3), start, 0.07 if bar == 0 else 0.05, pan=-0.4 + 0.27 * k)
t = OS0 + 0.3
i = 0
while t < 12.5:  # 16th arp; filter opens as the particles lock (old 0.1 -> 1.55)
    nn = CHORDS[int((t - OS0) // 2) % 4][[0, 1, 2, 3, 2, 1][i % 6]] + 24
    s = osc(midi(nn), 0.11, "saw") * 0.6 + osc(midi(nn), 0.11, "square", duty=0.3) * 0.4
    s = lowpass(s, 600 + 3400 * min(1, max(0, (t - OS0) / 1.5))) * env(len(s), a=0.003, r=0.09)
    add("cyber", s, t, 0.045, pan=0.35 if i % 2 else -0.35)
    t += STEP
    i += 1
for nn in (81, 88, 93):  # shimmer as the wordmark locks
    s = (osc(midi(nn), 1.4) + 0.3 * osc(midi(nn) * 2, 1.4)) * decay(int(SR * 1.4), 2.6)
    add("cyber", s, OS0 + 1.55, 0.035)
t = OS0 + 2.45  # desktop: drums + pulse bass
b = 0
while t < 12.5:
    n = int(SR * 0.25)
    tt = np.arange(n) / SR
    add("cyber", np.sin(2 * np.pi * np.cumsum(45 + 90 * np.exp(-tt * 30)) / SR) * decay(n, 14), t, 0.17)
    if b % 2:
        add("cyber", lowpass(noise(0.18), 5000) * decay(int(SR * 0.18), 22), t, 0.05)
    for h in range(4):
        hh = (noise(0.03) - lowpass(noise(0.03), 6000)) * decay(int(SR * 0.03), 120)
        add("cyber", hh, t + h * STEP, 0.03 if h % 2 else 0.045, pan=0.25)
    for e8 in range(2):
        root = ROOTS[int((t + e8 * BEAT / 2 - OS0) // 2) % 4]
        s = lowpass(osc(midi(root + 12), BEAT / 2 * 0.9, "square", duty=0.4), 380)
        add("cyber", s * env(len(s), a=0.004, r=0.05), t + e8 * BEAT / 2, 0.085)
    t += BEAT
    b += 1

# Desktop UI sounds (sfx bus, not crushed): clicks, window whooshes, typing, Enter
for c in (3.3, 5.0, 5.9, 6.55):
    mc = (noise(0.012) - lowpass(noise(0.012), 3500)) * decay(int(SR * 0.012), 350)
    add("sfx", mc, OS0 + c, 0.12)
for w in (3.35, 5.05, 5.95, 7.95):
    n = int(SR * 0.3)
    add("sfx", lowpass(noise(0.3), np.linspace(800, 4000, n)) * np.sin(np.linspace(0, np.pi, n)) ** 2, OS0 + w, 0.035)
for at, chars in ((3.75, 6), (4.3, 12), (6.85, 31)):
    for k in range(chars):
        tick = lowpass(noise(0.015), 3200 + 400 * (k % 3)) * decay(int(SR * 0.015), 260)
        add("sfx", tick, OS0 + at + k / 26, 0.045, pan=-0.15)
add("sfx", lowpass(noise(0.05), 1800) * decay(int(SR * 0.05), 90), OS0 + 6.85 + 31 / 26 + 0.05, 0.1)  # Enter
n = int(SR * 0.45)
add("sfx", lowpass(noise(0.45), np.linspace(4000, 400, n)) * np.sin(np.linspace(0, np.pi, n)), OS0 + 8.05, 0.06)  # cartridge drop
n = int(SR * 0.18)
tt = np.arange(n) / SR
add("sfx", np.sin(2 * np.pi * np.cumsum(70 + 120 * np.exp(-tt * 40)) / SR) * decay(n, 28), OS0 + 8.8, 0.3)  # thunk
add("sfx", (noise(0.015) - lowpass(noise(0.015), 3000)) * decay(int(SR * 0.015), 300), OS0 + 8.8, 0.15)  # click
add("sfx", osc(midi(84), 0.06, "square", duty=0.25) * env(int(SR * 0.06), r=0.04), OS0 + 8.82, 0.04)  # LED blip

# ================= 2. the switch: bit-crush the OS music as the screen pixelates =================
c0, c1, cut = OS0 + 9.05, OS0 + 9.75, OS0 + 9.9
cy = BUS["cyber"]
out = cy.copy()
for i0 in range(int(c0 * SR), int(cut * SR)):
    p = min(1.0, max(0.0, (i0 / SR - c0) / (c1 - c0)))
    hold = int(1 + 60 * p ** 2)  # sample-rate reduction
    j = i0 - (i0 % hold)
    bits = 16 - 12 * p  # bit-depth reduction
    q = 2 ** (bits - 1)
    out[:, i0] = np.round(cy[:, j] * q) / q
fade = np.ones(N)
k0, k1 = int(c1 * SR), int(cut * SR)
fade[k0:k1] = np.linspace(1, 0, k1 - k0)
fade[k1:] = 0
BUS["cyber"] = out * fade
for k, nn in enumerate((84, 79, 76, 72, 69, 64)):  # glitchy descending blips as the palette collapses
    add("sfx", osc(midi(nn), 0.07, "square", duty=0.125) * env(int(SR * 0.07), r=0.04), c0 + 0.1 + k * 0.1, 0.03)

# ================= 3. KRISHI.WORLD splash chime + chiptune (12.5 - 21.36) =================
for k, nn in enumerate((84, 91)):  # original two-note chime as the logo lands (old 10.45)
    s = (osc(midi(nn), 0.6, "tri") + 0.25 * osc(midi(nn) * 2, 0.6)) * decay(int(SR * 0.6), 4)
    add("chip", s, OS0 + 10.45 + k * 0.11, 0.12)
for k in range(6):  # sparkle
    add("chip", osc(midi(96 + (k % 3) * 3), 0.05, "square", duty=0.125) * env(int(SR * 0.05), r=0.03), OS0 + 10.6 + k * 0.05, 0.02)
n = int(SR * 0.6)
add("sfx", lowpass(noise(0.6), np.linspace(500, 8000, n)) * np.linspace(0, 1, n) ** 2, OS0 + 10.9, 0.05)  # into the flash
MEL = [[69, 0, 72, 76, 74, 72, 71, 72], [69, 0, 65, 69, 72, 0, 69, 0], [67, 0, 72, 76, 79, 76, 74, 72], [71, 0, 74, 79, 77, 76, 74, 71]]
G0, G1 = 13.9, 21.36
for bar in range(4):
    for e8 in range(8):
        tn = G0 + bar * 2.0 + e8 * BEAT / 2
        if tn >= G1:
            break
        nn = MEL[bar % 4][e8]
        if nn:
            s = osc(midi(nn), BEAT / 2 * 0.85, "square", duty=0.125) * env(int(SR * BEAT / 2 * 0.85), a=0.002, r=0.06)
            add("chip", s, tn, 0.085, pan=-0.1)
        s = osc(midi(ROOTS[bar % 4] + 12 + (12 if e8 % 2 else 0)), BEAT / 2 * 0.8, "tri") * env(int(SR * BEAT / 2 * 0.8), r=0.05)
        add("chip", s, tn, 0.14)
        add("chip", (noise(0.025) - lowpass(noise(0.025), 7000)) * decay(int(SR * 0.025), 150), tn, 0.025, pan=0.3)
        if e8 % 2 == 0:
            n = int(SR * 0.12)
            tt = np.arange(n) / SR
            add("chip", np.sign(np.sin(2 * np.pi * np.cumsum(60 + 160 * np.exp(-tt * 45)) / SR)) * decay(n, 30) * 0.5, tn, 0.12)
# in-key game sounds
for k in range(13):
    add("sfx", osc(midi(81 if k % 2 else 84), 0.03, "square", duty=0.25) * env(int(SR * 0.03), r=0.02), g(11.75) + k * 0.08, 0.018, pan=0.2)
for k, nn in enumerate((76, 81)):
    add("sfx", osc(midi(nn), 0.12, "square", duty=0.25) * env(int(SR * 0.12), r=0.08), g(13.95) + k * 0.07, 0.035)
for k, nn in enumerate((81, 84, 88, 93)):
    add("sfx", osc(midi(nn), 0.2, "tri") * env(int(SR * 0.2), r=0.15), g(16.35) + k * 0.07, 0.08)
for k, nn in enumerate((72, 76)):
    add("sfx", osc(midi(nn), 0.12, "square", duty=0.25) * env(int(SR * 0.12), r=0.08), g(17.8) + k * 0.07, 0.035)
for k, nn in enumerate((76, 81, 84, 88)):
    d = 0.35 if k == 3 else 0.1
    add("sfx", osc(midi(nn), d, "square", duty=0.25) * env(int(SR * d), r=0.08 if k < 3 else 0.3), g(19.15) + k * 0.08, 0.045)

# ================= 4. outro (21.36 - 25.0): both worlds resolve =================
O0 = 21.36
n = int(SR * 0.6)
add("sfx", lowpass(noise(0.6), np.linspace(6000, 300, n)) * np.linspace(1, 0, n) ** 2, O0 - 0.05, 0.05)
n = int(SR * 0.3)
tt = np.arange(n) / SR
add("chip", np.sin(2 * np.pi * np.cumsum(45 + 100 * np.exp(-tt * 25)) / SR) * decay(n, 9), O0, 0.3)
for k, nn in enumerate([45, 52, 57, 60, 64]):
    s = sum(osc(midi(nn), 1.9, "saw", detune=d) for d in (-0.004, 0.004)) / 2
    add("chip", lowpass(s, 1400) * env(len(s), a=0.05, r=0.4), O0, 0.07, pan=-0.4 + 0.2 * k)
for k, nn in enumerate([48, 55, 62, 64, 67]):
    s = sum(osc(midi(nn), 2.0, "saw", detune=d) for d in (-0.004, 0.004)) / 2
    add("chip", lowpass(s, 1600) * env(len(s), a=0.08, r=1.4), O0 + 1.8, 0.075, pan=-0.4 + 0.2 * k)
for k, nn in enumerate([72, 76, 79, 84, 79, 76, 72, 76, 79, 84, 88]):
    add("chip", osc(midi(nn), 0.12, "square", duty=0.125) * env(int(SR * 0.12), r=0.08), O0 + 0.05 + k * 0.125, 0.06, pan=0.3)
add("chip", osc(midi(84), 1.6, "tri") * decay(int(SR * 1.6), 2), O0 + 1.8, 0.06)

# ================= mix =================
mix = BUS["cyber"] + BUS["chip"] + BUS["sfx"] * 0.95 + BUS["amb"]
for ch, d in ((0, 0.19), (1, 0.23)):  # short stereo delay for space
    k = int(SR * d)
    wet = np.zeros(N)
    wet[k:] = mix[ch, :-k]
    mix[ch] += lowpass(wet, 3000) * 0.2
fn = int(SR * 0.8)
mix[:, -fn:] *= np.linspace(1, 0, fn) ** 1.5
mix = np.tanh(mix * 1.4) / np.tanh(1.4)
mix *= 0.89 / np.max(np.abs(mix))
for name, a0, a1 in (("computer", 0, 2.6), ("os", 2.6, 11.65), ("switch", 11.65, 13.9), ("game", 13.9, 21.36), ("outro", 21.36, 24.2)):
    seg = mix[:, int(a0 * SR) : int(a1 * SR)]
    print(f"{name:9s} rms {20*np.log10(np.sqrt((seg**2).mean())):6.1f} dB")
pcm = (mix.T * 32767).astype(np.int16)
with wave.open("soundtrack2.wav", "wb") as w:
    w.setnchannels(2)
    w.setsampwidth(2)
    w.setframerate(SR)
    w.writeframes(pcm.tobytes())
print("soundtrack2.wav written")
