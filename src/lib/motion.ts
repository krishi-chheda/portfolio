import gsap from "gsap";

// KRISHI.OS motion identity: one signature curve, three durations, one entrance pattern (rise + fade).
// Corporate/terminal personality: decisive deceleration, no overshoot.
export const EASE = "power3.out";

export const DUR = {
  quick: 0.15,
  standard: 0.3,
  slow: 0.5,
} as const;

// Entrance pattern: travel distance in px for panels and list items.
export const RISE = { panel: 16, item: 10 } as const;

export const MOTION_OK = "(prefers-reduced-motion: no-preference)";

const GLYPHS = "!<>-_/[]{}=+*^?#01";

/**
 * Terminal "decode": characters resolve left to right from random glyphs into the element's real text.
 * Spaces stay spaces, so word shapes hold (and with a monospace font the width never changes).
 * Returns the tween plus a restore() that puts the original text back; call it on cleanup.
 */
export function scrambleText(el: HTMLElement, duration = 0.6) {
  const finalText = el.textContent ?? "";
  const state = { progress: 0 };
  const restore = () => {
    el.textContent = finalText;
  };
  const tween = gsap.to(state, {
    progress: 1,
    duration,
    ease: "none",
    onUpdate: () => {
      const revealed = Math.floor(state.progress * finalText.length);
      let out = finalText.slice(0, revealed);
      for (let i = revealed; i < finalText.length; i++) {
        out += finalText[i] === " " ? " " : GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      el.textContent = out;
    },
    onComplete: restore,
  });
  return { tween, restore };
}
