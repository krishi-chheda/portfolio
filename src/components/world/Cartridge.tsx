"use client";

import { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { pixelFont } from "@/lib/pixelFont";
import { reduceMotion } from "@/game/settings";

/** The player sprite, as SVG pixels (matches the in-game walker facing down). */
export function PlayerSprite({ className = "" }: { className?: string }) {
  const px: [number, number, number, number, string][] = [
    [3, 1, 11, 4, "#3b2a20"],
    [4, 0, 1, 1, "#3b2a20"],
    [7, 0, 1, 1, "#3b2a20"],
    [11, 0, 1, 1, "#3b2a20"],
    [3, 4, 11, 1, "#34d399"],
    [3, 5, 11, 7, "#f2c9a0"],
    [3, 10, 11, 2, "#d9a37a"],
    [3, 5, 1, 3, "#3b2a20"],
    [13, 5, 1, 3, "#3b2a20"],
    [4, 5, 2, 1, "#3b2a20"],
    [11, 5, 2, 1, "#3b2a20"],
    [5, 6, 1, 2, "#1f1d24"],
    [11, 6, 1, 2, "#1f1d24"],
    [4, 8, 1, 1, "#f0ad94"],
    [12, 8, 1, 1, "#f0ad94"],
    [7, 9, 3, 1, "#a8604a"],
    [14, 4, 1, 2, "#34d399"],
    [14, 6, 1, 1, "#1f7d58"],
    [4, 12, 9, 6, "#2fae7c"],
    [4, 16, 9, 2, "#1f7d58"],
    [6, 12, 5, 1, "#1f7d58"],
    [8, 13, 1, 4, "#f5e8c8"],
    [3, 12, 1, 4, "#1f7d58"],
    [13, 12, 1, 4, "#1f7d58"],
    [5, 18, 3, 3, "#2c3a5a"],
    [9, 18, 3, 3, "#2c3a5a"],
    [5, 21, 3, 1, "#2a2220"],
    [9, 21, 3, 1, "#2a2220"],
  ];
  return (
    <svg viewBox="0 0 16 22" shapeRendering="crispEdges" aria-hidden="true" className={className}>
      {px.map(([x, y, w, h, c], i) => (
        <rect key={i} x={x} y={y} width={w} height={h} fill={c} />
      ))}
    </svg>
  );
}

/**
 * A grey GBA-style cartridge with a KRISHI.WORLD label. Sized in em, so the parent's font-size scales the
 * whole thing (small on the boot choice, large for the insert animation).
 */
export function Cartridge({ className = "" }: { className?: string }) {
  return (
    <div aria-hidden="true" className={`relative w-[10em] select-none ${className}`}>
      <div className="relative rounded-t-[0.9em] rounded-b-[0.25em] border-[0.25em] border-[#3a3f4a] bg-[#a8adb5] px-[0.75em] pt-[1.1em] pb-[0.6em] shadow-[0.3em_0.3em_0_#3a3f4a]">
        {/* grip ridges */}
        <div className="absolute inset-x-[2.2em] top-[0.35em] space-y-[0.15em]">
          <div className="h-[0.12em] bg-[#8a9099]" />
          <div className="h-[0.12em] bg-[#8a9099]" />
        </div>
        {/* label */}
        <div className="overflow-hidden border-[0.15em] border-[#3a3f4a] bg-[#f5e8c8]">
          <div className={`${pixelFont.className} bg-[#285943] px-[0.4em] py-[0.15em] text-center text-[0.95em] leading-tight tracking-[0.08em] text-[#f5e8c8]`}>KRISHI.WORLD</div>
          <div className="flex items-center gap-[0.4em] px-[0.5em] py-[0.4em]">
            <PlayerSprite className="h-[3.2em] w-auto shrink-0" />
            <p className={`${pixelFont.className} text-[0.62em] leading-snug text-[#46382b]`}>
              Explore the mind.
              <br />
              Discover the builder.
            </p>
          </div>
        </div>
        {/* contacts */}
        <div className="mt-[0.5em] flex justify-center gap-[0.18em]">
          {Array.from({ length: 12 }, (_, i) => (
            <span key={i} className="h-[0.7em] w-[0.42em] bg-[#c9902e]" />
          ))}
        </div>
      </div>
    </div>
  );
}

const SEAT_EM = 6.2; // how far the cartridge sinks into the slot

/**
 * /world's arrival: the cartridge drops in, is pushed into the slot, clicks home (the LED turns green), and the
 * screen flashes into the game once Phaser has loaded. Doubles as the loading screen. Any key or tap skips the
 * animation; reduced motion skips it entirely.
 */
export function CartridgeIntro({ ready, onDone }: { ready: boolean; onDone: () => void }) {
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cartRef = useRef<HTMLDivElement>(null);
  const ledRef = useRef<HTMLSpanElement>(null);
  const flashRef = useRef<HTMLDivElement>(null);
  const [seated, setSeated] = useState(false);
  const onDoneRef = useRef(onDone);
  useEffect(() => {
    onDoneRef.current = onDone;
  });

  useLayoutEffect(() => {
    if (reduceMotion()) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setSeated(true);
      return;
    }
    const cart = cartRef.current;
    const em = parseFloat(getComputedStyle(stageRef.current ?? document.body).fontSize);
    const tl = gsap.timeline({ onComplete: () => setSeated(true) });
    tl.fromTo(cart, { y: -window.innerHeight * 0.8 }, { y: 0, duration: 0.6, ease: "power2.out" })
      .to(cart, { y: SEAT_EM * em, duration: 0.32, ease: "power1.in" }, "+=0.2") // pushed down into the slot
      .to(stageRef.current, { x: 3, duration: 0.04, yoyo: true, repeat: 3, ease: "none" }) // click
      .set(ledRef.current, { backgroundColor: "#34d399", boxShadow: "0 0 10px #34d399" }, "<");
    const skip = () => tl.progress(1);
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      tl.kill();
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  // Seated and loaded: flash to white, then reveal the world
  useEffect(() => {
    if (!seated || !ready) return;
    if (reduceMotion()) return onDoneRef.current();
    const tl = gsap
      .timeline({ onComplete: () => onDoneRef.current() })
      .to(flashRef.current, { opacity: 1, duration: 0.12, ease: "power1.in" })
      .set([stageRef.current, rootRef.current], { backgroundColor: "transparent" })
      .set(stageRef.current, { opacity: 0 })
      .to(flashRef.current, { opacity: 0, duration: 0.45, ease: "power2.out" });
    return () => {
      tl.kill();
    };
  }, [seated, ready]);

  return (
    <div ref={rootRef} className="absolute inset-0 z-10 flex items-center justify-center bg-[#16201b]" role="status" aria-live="polite">
      <div ref={stageRef} className="relative flex flex-col items-center text-[13px] sm:text-[16px]">
        {/* Everything above the slot line; the cartridge disappears below it */}
        <div className="relative h-[14em] w-[16em] overflow-hidden">
          <div ref={cartRef} className="absolute bottom-0 left-1/2 -translate-x-1/2" style={seated ? { transform: `translateY(${SEAT_EM}em)` } : undefined}>
            <Cartridge />
          </div>
        </div>
        {/* Console top: slot + power LED */}
        <div className="w-[16em] rounded-b-[0.6em] border-[0.25em] border-t-0 border-[#3a3f4a] bg-[#5b6b7e] px-[1em] pt-[0.5em] pb-[0.8em] shadow-[0.3em_0.3em_0_#0a0c0b]">
          <div className="mx-auto h-[0.8em] w-[12em] rounded-[0.2em] bg-[#0a0c0b]" />
          <div className="mt-[0.6em] flex items-center justify-between font-mono text-[0.7em] tracking-[0.2em] text-[#c8ccd4]">
            <span>KRISHI.OS</span>
            <span className="flex items-center gap-[0.5em]">
              POWER
              <span ref={ledRef} className="inline-block h-[0.7em] w-[0.7em] rounded-full bg-[#e0564a]" style={seated ? { background: "#34d399", boxShadow: "0 0 10px #34d399" } : undefined} />
            </span>
          </div>
        </div>
        <p className={`${pixelFont.className} mt-[1.5em] text-[0.9em] tracking-[0.2em] text-[#f5e8c8]/80`}>{seated ? (ready ? "" : "LOADING WORLD…") : "INSERTING CARTRIDGE…"}</p>
        {!seated && <p className="mt-[0.5em] font-mono text-[0.7em] text-[#f5e8c8]/50">press any key to skip</p>}
      </div>
      <div ref={flashRef} className="pointer-events-none absolute inset-0 bg-white opacity-0" />
    </div>
  );
}
