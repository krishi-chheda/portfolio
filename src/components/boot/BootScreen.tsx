"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SYSTEM_VERSION, bootLinesData } from "@/lib/data";
import { scrambleText } from "@/lib/motion";
import { useReducedMotion } from "../../hooks/useReducedMotion";

interface BootScreenProps {
  onComplete: () => void;
}

const WORD = "KRISHI.OS";
const ASSEMBLE = 1.2; // seconds for the vortex to lock into the wordmark

interface Particle {
  tx: number; // target (a pixel of the wordmark)
  ty: number;
  ox: number; // start offset from the target
  oy: number;
  delay: number; // 0..0.4 of the timeline, so particles land in a left-to-right wave
}

/**
 * Boot: emerald particles spiral in from the screen edges and lock into the KRISHI.OS wordmark while the
 * real module list (bootLinesData) mounts. Exit (a CRT collapse) is owned by BootWrapper's presence wrapper;
 * this component only signals completion. Click, Escape or the 2s safety timeout skip it.
 */
export default function BootScreen({ onComplete }: BootScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const percentRef = useRef<HTMLSpanElement>(null);
  const moduleRef = useRef<HTMLSpanElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const [bootTime, setBootTime] = useState("");
  // BootWrapper passes a fresh arrow each render; a ref keeps the animation from restarting on re-render
  const onCompleteRef = useRef(onComplete);
  useEffect(() => {
    onCompleteRef.current = onComplete;
  });

  // Reduced motion: there's no animation to wait for, so hand over to the site straight away
  useEffect(() => {
    if (prefersReducedMotion) onCompleteRef.current();
  }, [prefersReducedMotion]);

  // Client-only timestamp: set after mount so server and client markup match during hydration
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setBootTime(new Date().toISOString().replace("T", " ").substring(0, 19));
  }, []);

  // Loading never exceeds 2 seconds; Escape skips
  useEffect(() => {
    const safetyTimeout = setTimeout(onComplete, 2000);
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onComplete();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      clearTimeout(safetyTimeout);
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onComplete]);

  useLayoutEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (prefersReducedMotion || !canvas || !ctx) return;

    let cancelled = false;
    let tl: gsap.core.Timeline | undefined;
    let restoreTagline = () => {};

    // Sample the wordmark only once the font is ready, or the particles would trace the fallback font
    document.fonts.ready.then(() => {
      if (cancelled) return;
      const w = window.innerWidth;
      const h = window.innerHeight;
      if (!w || !h) return; // no viewport (e.g. a hidden frame): the safety timeout ends the boot
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      ctx.scale(dpr, dpr);

      // Monospace glyphs are ~0.6em wide: fit the word to 80% of the width, capped by height
      const fontSize = Math.min((w * 0.8) / (WORD.length * 0.6), h * 0.2);
      const cx = w / 2;
      const cy = h * 0.42;
      const family = getComputedStyle(document.body).fontFamily;
      const accent = getComputedStyle(document.documentElement).getPropertyValue("--color-accent").trim() || "#34d399";

      const sampler = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
      if (!sampler) return;
      sampler.canvas.width = w;
      sampler.canvas.height = h;
      sampler.font = `700 ${fontSize}px ${family}`;
      sampler.textAlign = "center";
      sampler.textBaseline = "middle";
      sampler.fillText(WORD, cx, cy);
      const pixels = sampler.getImageData(0, 0, w, h).data;

      const step = Math.max(3, Math.round(fontSize / 22));
      const size = Math.max(1.5, step * 0.6);
      const reach = Math.hypot(w, h) * 0.6;
      const particles: Particle[] = [];
      for (let y = 0; y < h; y += step) {
        for (let x = 0; x < w; x += step) {
          if (pixels[(y * w + x) * 4 + 3] < 128) continue;
          const angle = Math.random() * Math.PI * 2;
          const r = reach * (0.5 + Math.random() * 0.5);
          particles.push({
            tx: x,
            ty: y,
            ox: Math.cos(angle) * r,
            oy: Math.sin(angle) * r,
            delay: (x / w) * 0.25 + Math.random() * 0.15,
          });
        }
      }

      const state = { p: 0 };
      const draw = () => {
        ctx.clearRect(0, 0, w, h);
        ctx.fillStyle = accent;
        for (const pt of particles) {
          const local = Math.min(1, Math.max(0, (state.p - pt.delay) / 0.6));
          const remain = 1 - local * local * (3 - 2 * local); // 1 → 0, smoothstep
          // Spiral in: the start offset shrinks while rotating, so each particle orbits onto its target
          const a = remain * Math.PI * 1.5;
          const cos = Math.cos(a);
          const sin = Math.sin(a);
          const x = pt.tx + (pt.ox * cos - pt.oy * sin) * remain;
          const y = pt.ty + (pt.ox * sin + pt.oy * cos) * remain;
          ctx.globalAlpha = 0.35 + 0.65 * (1 - remain);
          ctx.fillRect(x, y, size, size);
        }
        ctx.globalAlpha = 1;
      };

      const modules = bootLinesData.length;
      tl = gsap.timeline({ onComplete: () => onCompleteRef.current() });
      tl.to(state, {
        p: 1,
        duration: ASSEMBLE,
        ease: "none",
        onUpdate: () => {
          draw();
          const done = Math.min(1, state.p / 0.85); // readout hits 100% just as the last particles land
          if (barRef.current) barRef.current.style.transform = `scaleX(${done})`;
          if (percentRef.current) percentRef.current.textContent = `${String(Math.round(done * 100)).padStart(3, "0")}%`;
          if (moduleRef.current) moduleRef.current.textContent = bootLinesData[Math.min(modules - 1, Math.floor(done * modules))];
        },
      });
      if (taglineRef.current) {
        const { tween, restore } = scrambleText(taglineRef.current, 0.4);
        restoreTagline = restore;
        tl.set(taglineRef.current, { opacity: 1 }, ASSEMBLE - 0.35);
        tl.add(tween, "<");
      }
      tl.to({}, { duration: 0.2 }); // brief hold on the locked wordmark before the exit
    });

    return () => {
      cancelled = true;
      tl?.kill();
      restoreTagline();
    };
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return (
      <div
        onClick={onComplete}
        className="fixed inset-0 z-50 bg-bg flex items-center justify-center font-mono cursor-pointer"
      >
        <div className="text-center text-ink-soft text-xs">LOADING SYSTEM PROFILE...</div>
      </div>
    );
  }

  return (
    <div
      onClick={onComplete}
      className="fixed inset-0 z-50 bg-bg overflow-hidden flex flex-col text-ink-soft font-mono cursor-pointer select-none"
    >
      <canvas ref={canvasRef} aria-hidden="true" className="absolute inset-0 h-full w-full" />

      {/* Header */}
      <div className="relative flex justify-between items-center px-6 md:px-12 py-4 border-b border-rule text-xs uppercase tracking-wider">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="font-bold text-accent">KRISHI.OS {SYSTEM_VERSION.toUpperCase()}</span>
          <span className="hidden md:inline text-ink-faint">| AI ENGINEER PORTFOLIO SYSTEM</span>
        </div>
        <div className="hidden md:block text-ink-faint">{bootTime}</div>
      </div>

      {/* Readout, under the wordmark (which the canvas draws at 42% height) */}
      <div className="relative flex-1">
        <div className="absolute inset-x-0 top-[56%] mx-auto w-full max-w-md px-6 text-xs uppercase tracking-[0.2em]">
          <p ref={taglineRef} className="mb-5 text-center text-accent opacity-0">
            AI Engineer &amp; Product Builder
          </p>
          <div className="flex justify-between text-ink-faint">
            <span>
              mount <span ref={moduleRef} className="normal-case text-ink-soft">{bootLinesData[0]}</span>
            </span>
            <span ref={percentRef} className="text-accent">000%</span>
          </div>
          <div className="mt-2 h-px bg-rule">
            <div ref={barRef} className="h-px origin-left bg-accent shadow-[0_0_8px_var(--color-accent)]" style={{ transform: "scaleX(0)" }} />
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="relative flex justify-between items-center px-6 md:px-12 py-4 border-t border-rule text-xs uppercase tracking-wider">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-gold animate-pulse" />
          <span className="animate-pulse">Connecting to KRISHI.OS</span>
        </div>
        <div className="text-ink-faint text-[11px] md:text-xs">Press ESC or Tap to Skip</div>
      </div>
    </div>
  );
}
