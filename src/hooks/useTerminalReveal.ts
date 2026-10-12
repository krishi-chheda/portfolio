import { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { DUR, EASE, MOTION_OK, RISE, scrambleText } from "@/lib/motion";
import { useBooted } from "@/components/boot/BootWrapper";

/**
 * Plays once when the section scrolls into view:
 * the section title decodes, the prompt command types out, the panel rises in with a single scan line
 * sweeping across it, then [data-reveal="item"] children cascade.
 * Mark elements with data-reveal="title" | "command" | "panel" | "item". Skipped entirely under reduced motion.
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
      const title = root.querySelector<HTMLElement>('[data-reveal="title"]');
      const command = root.querySelector<HTMLElement>('[data-reveal="command"]');
      const panel = root.querySelector<HTMLElement>('[data-reveal="panel"]');
      const items = root.querySelectorAll('[data-reveal="item"]');
      const cleanups: (() => void)[] = [];

      const tl = gsap.timeline({ paused: true, defaults: { ease: EASE } });
      if (title) {
        // Added in the same tick it's created, so it never plays on its own before the timeline does
        const { tween, restore } = scrambleText(title, 0.55);
        tl.add(tween, 0);
        cleanups.push(restore);
      }
      if (command) {
        const chars = command.textContent?.length || 12;
        tl.from(command, { clipPath: "inset(0 100% 0 0)", duration: Math.min(0.5, chars * 0.025), ease: `steps(${chars})` }, 0);
      }
      if (panel) {
        tl.from(panel, { y: RISE.panel, opacity: 0, duration: DUR.slow }, command ? 0.15 : 0);

        // One scan line sweeps top to bottom as the panel lands, then removes itself
        const line = document.createElement("div");
        line.setAttribute("aria-hidden", "true");
        Object.assign(line.style, {
          position: "absolute",
          left: "0",
          right: "0",
          top: "0",
          height: "1px",
          background: "var(--color-accent)",
          boxShadow: "0 0 10px var(--color-accent)",
          pointerEvents: "none",
          opacity: "0",
          zIndex: "5",
        });
        if (getComputedStyle(panel).position === "static") panel.style.position = "relative";
        panel.appendChild(line);
        tl.fromTo(
          line,
          { y: 0, opacity: 0.9 },
          // immediateRender: false keeps the line invisible until this point in the timeline actually plays
          { y: () => panel.offsetHeight, opacity: 0, duration: 0.9, ease: "power1.inOut", immediateRender: false, onComplete: () => line.remove() },
          "<0.1"
        );
        cleanups.push(() => line.remove());
      }
      if (items.length) {
        tl.from(items, { y: RISE.item, opacity: 0, duration: DUR.standard, stagger: { amount: 0.25 } }, "-=0.6");
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
      return () => {
        observer.disconnect();
        cleanups.forEach((fn) => fn());
      };
    });

    return () => mm.revert();
  }, [booted]);

  return ref;
}
