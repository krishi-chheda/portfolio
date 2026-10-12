import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { DUR, EASE, MOTION_OK, RISE } from "@/lib/motion";
import { useBooted } from "@/components/boot/BootWrapper";

/**
 * Plays once when the section scrolls into view:
 * the prompt command types out, the terminal panel rises in, then [data-reveal="item"] children cascade.
 * Mark elements with data-reveal="command" | "panel" | "item". Skipped entirely under reduced motion.
 *
 * Uses opacity rather than autoAlpha so hidden content stays in the accessibility tree.
 */
export function useTerminalReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const booted = useBooted();

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root) return;

    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      const command = root.querySelector<HTMLElement>('[data-reveal="command"]');
      const panel = root.querySelector('[data-reveal="panel"]');
      const items = root.querySelectorAll('[data-reveal="item"]');

      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE } });
      if (command) {
        const chars = command.textContent?.length || 12;
        tl.from(command, { clipPath: "inset(0 100% 0 0)", duration: Math.min(0.5, chars * 0.025), ease: `steps(${chars})` });
      }
      if (panel) tl.from(panel, { y: RISE.panel, opacity: 0, duration: DUR.slow }, command ? "-=0.1" : 0);
      if (items.length) {
        tl.from(items, { y: RISE.item, opacity: 0, duration: DUR.standard, stagger: { amount: 0.25 } }, "-=0.3");
      }

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            tl.play();
            observer.disconnect();
          }
        },
        { threshold: 0.1 }
      );
      // Hidden start states apply immediately; playback waits until boot has cleared and the section is visible.
      if (booted) observer.observe(root);
      return () => observer.disconnect();
    });

    return () => mm.revert();
  }, [booted]);

  return ref;
}
