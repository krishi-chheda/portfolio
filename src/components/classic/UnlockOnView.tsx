"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Plays the achievement "unlock" pop (globals.css .kw-unlock) the first time the list scrolls into view. Without
 * JavaScript, or under reduced motion, everything is simply visible.
 */
export default function UnlockOnView({ className = "", children }: { className?: string; children: ReactNode }) {
  const ref = useRef<HTMLUListElement>(null);
  const [state, setState] = useState<"idle" | "armed" | "on">("idle");
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const r = el.getBoundingClientRect();
    if (r.top < innerHeight && r.bottom > 0) return; // already on screen: don't hide what's being read
    setState("armed");
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setState("on");
          io.disconnect();
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);
  return (
    <ul ref={ref} data-state={state} className={`kw-unlock ${className}`}>
      {children}
    </ul>
  );
}
