import { useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { DUR, EASE } from "@/lib/motion";
import { useReducedMotion } from "@/hooks/useReducedMotion";

export interface PresenceMotion {
  // Hidden state the element enters from (and exits to, unless `exit` is given).
  from: gsap.TweenVars;
  exit?: gsap.TweenVars;
  enterDuration?: number;
  exitDuration?: number;
}

/**
 * GSAP replacement for framer's AnimatePresence: keeps the element mounted until its exit tween finishes.
 * Usage: const { mounted, ref } = usePresence<HTMLDivElement>(open, MOTION); {mounted && <div ref={ref} />}
 * Pass a module-level MOTION constant so its identity is stable. Under reduced motion it mounts/unmounts instantly.
 */
export function usePresence<T extends Element>(open: boolean, motion: PresenceMotion) {
  const ref = useRef<T>(null);
  const [mounted, setMounted] = useState(open);
  const reduced = useReducedMotion();

  // Mount immediately when opening (state adjustment during render, not in an effect)
  if (open && !mounted) setMounted(true);

  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || !mounted) return;

    if (open) {
      if (reduced) return;
      // Entrance: decelerate in, then hand styling back to CSS
      const tween = gsap.fromTo(el, motion.from, {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        duration: motion.enterDuration ?? DUR.standard,
        ease: EASE,
        clearProps: "opacity,transform",
      });
      return () => {
        tween.kill();
      };
    }

    // Exit: accelerate out (shorter than the entrance), then unmount
    const tween = gsap.to(el, {
      ...(motion.exit ?? motion.from),
      duration: reduced ? 0 : motion.exitDuration ?? 0.12,
      ease: "power2.in",
      onComplete: () => setMounted(false),
    });
    return () => {
      tween.kill();
    };
  }, [open, mounted, reduced, motion]);

  return { mounted, ref };
}
