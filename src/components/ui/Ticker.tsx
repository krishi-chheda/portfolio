"use client";

import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { impactLog, projectsData } from "@/lib/data";
import { MOTION_OK } from "@/lib/motion";

// Everything shown comes from data.ts: flagship projects, their stack, and the verified impact figures.
const ITEMS = [
  ...projectsData.map((p) => p.title),
  ...impactLog.map((m) => `${m.value} ${m.source}`),
  ...[...new Set(projectsData.flatMap((p) => p.techStack))],
];

const PIXELS_PER_SECOND = 40;

/**
 * Infinite terminal ticker. The list is rendered twice and the track slides by exactly one copy, so the loop
 * is seamless. Pauses on hover and while off-screen; static under reduced motion. Decorative (aria-hidden):
 * everything in it is stated elsewhere on the page.
 */
export default function Ticker() {
  const rootRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = rootRef.current;
    const track = trackRef.current;
    if (!root || !track) return;

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const copyWidth = track.scrollWidth / 2;
      const loop = gsap.to(track, {
        x: -copyWidth,
        duration: copyWidth / PIXELS_PER_SECOND,
        ease: "none",
        repeat: -1,
      });

      // Ease to a stop on hover instead of freezing abruptly
      const slow = () => gsap.to(loop, { timeScale: 0, duration: 0.4, ease: "power2.out", overwrite: true });
      const resume = () => gsap.to(loop, { timeScale: 1, duration: 0.4, ease: "power2.in", overwrite: true });
      root.addEventListener("pointerenter", slow);
      root.addEventListener("pointerleave", resume);

      const observer = new IntersectionObserver(([entry]) => (entry.isIntersecting ? loop.play() : loop.pause()));
      observer.observe(root);

      return () => {
        root.removeEventListener("pointerenter", slow);
        root.removeEventListener("pointerleave", resume);
        observer.disconnect();
      };
    });
    return () => mm.revert();
  }, []);

  const copy = (key: string) => (
    <div key={key} className="flex shrink-0 items-center">
      {ITEMS.map((item, i) => (
        <span key={`${key}-${i}`} className="flex items-center whitespace-nowrap">
          <span className="px-5 text-ink-soft">{item}</span>
          <span className="text-accent text-[9px]">◆</span>
        </span>
      ))}
    </div>
  );

  return (
    <div
      ref={rootRef}
      aria-hidden="true"
      className="relative overflow-hidden border-y border-rule bg-bg-2 py-3 text-[11px] uppercase tracking-[0.18em] select-none"
    >
      {/* Edge fades so items slide in and out of view instead of being cut */}
      <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg-2 to-transparent" />
      <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg-2 to-transparent" />
      <div ref={trackRef} className="flex w-max will-change-transform">
        {copy("a")}
        {copy("b")}
      </div>
    </div>
  );
}
