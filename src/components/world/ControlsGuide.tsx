"use client";

import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from "react";
import gsap from "gsap";
import { WORLD } from "@/lib/motion";
import { reduceMotion } from "@/game/settings";
import { sfx } from "@/game/audio";
import { useEntrance } from "@/hooks/useEntrance";

// Open or closed, remembered per browser: first-time visitors see it open; anyone who closed it isn't shown it again
// (the ? button and the H key bring it back).
const KEY = "krishi-world:controls-guide";

const KBD = "inline-flex min-w-[1.6rem] items-center justify-center border-2 border-[#46382b] bg-white px-1 text-xs leading-5 text-[#2b2420] shadow-[1px_2px_0_#46382b]";
const Key = ({ children, label }: { children: ReactNode; label?: string }) => (
  <kbd className={KBD} aria-label={label}>
    {children}
  </kbd>
);

/** One row: what you want to do, then the keys that do it. */
function Row({ what, children }: { what: string; children: ReactNode }) {
  return (
    <li className="flex items-center justify-between gap-3 py-1">
      <span className="text-sm leading-tight">{what}</span>
      <span className="flex shrink-0 flex-wrap items-center justify-end gap-1 text-xs text-[#5a4434]">{children}</span>
    </li>
  );
}

/**
 * Adventure Mode's controls card. Only the controls the game really has (WorldScene key bindings, the overlays'
 * key handlers and TouchControls), shown for keyboards or for touch. Dismiss with ✕; the ? button (or H) reopens it.
 * Hidden while a dialogue or panel is open so it never covers them. Its keys never reach the game.
 */
export default function ControlsGuide({ hidden }: { hidden: boolean }) {
  const [open, setOpen] = useState(true);
  const [touch, setTouch] = useState(false);
  const closeRef = useRef<HTMLButtonElement | null>(null);

  // Entrances: the card pops up from its corner; the ? button pops in after a dismiss
  const panelRef = useEntrance<HTMLDivElement>(
    (el) => {
      if (!open) return;
      gsap.from(el, { autoAlpha: 0, scale: 0.9, y: 10, duration: WORLD.dur.standard, ease: WORLD.ease, clearProps: "transform,opacity,visibility" });
    },
    [open, hidden],
  );
  const helpRef = useEntrance<HTMLButtonElement>(
    (el) => {
      if (open) return;
      gsap.from(el, { autoAlpha: 0, scale: 0.6, duration: WORLD.dur.standard, ease: "back.out(2)", clearProps: "transform,opacity,visibility" });
    },
    [open, hidden],
  );


  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setTouch(window.matchMedia("(pointer: coarse)").matches);
    try {
      if (localStorage.getItem(KEY) === "closed") setOpen(false);
    } catch {
      // storage blocked: just start open
    }
  }, []);

  const remember = (v: "open" | "closed") => {
    try {
      localStorage.setItem(KEY, v);
    } catch {
      // not remembered
    }
  };
  const show = (focusClose = false) => {
    sfx("open");
    remember("open");
    setOpen(true);
    if (focusClose) requestAnimationFrame(() => closeRef.current?.focus({ preventScroll: true }));
  };
  const hide = (focusHelp = false) => {
    remember("closed");
    const done = () => {
      setOpen(false);
      if (focusHelp) requestAnimationFrame(() => helpRef.current?.focus({ preventScroll: true }));
    };
    const el = panelRef.current;
    if (!el || reduceMotion() || !window.matchMedia("(prefers-reduced-motion: no-preference)").matches) return done();
    // exit: quicker than the entrance, accelerating out toward its corner
    gsap.to(el, { autoAlpha: 0, scale: 0.92, y: 8, duration: WORLD.dur.quick, ease: WORLD.exit, onComplete: done });
  };

  // H toggles the card from anywhere in the game (not while a dialogue or panel is open)
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (hidden || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (e.key !== "h" && e.key !== "H") return;
      if (open) hide();
      else show();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  if (hidden) return null;

  // Enter/Space/E on these buttons must not also reach Phaser's window listener (it would talk or interact)
  const keep = (e: KeyboardEvent) => e.stopPropagation();
  // Phones: above the A button, clear of the D-pad. Keyboards: bottom-left, away from the centred player.
  const corner = touch ? "right-3 bottom-[6.75rem]" : "left-3 bottom-3 sm:left-4 sm:bottom-4";

  if (!open) {
    return (
      <button
        ref={helpRef}
        type="button"
        onClick={() => show(true)}
        onKeyDown={keep}
        aria-label="Show controls"
        aria-expanded={false}
        aria-controls="controls-guide"
        className={`absolute ${corner} z-10 flex h-11 min-w-11 items-center justify-center gap-1.5 border-2 border-[#46382b] bg-[#f5e8c8] px-2.5 text-[#2b2420] shadow-[3px_3px_0_#46382b] transition-colors hover:bg-[#f5c65b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5c65b] active:translate-x-px active:translate-y-px`}
      >
        <span aria-hidden="true" className="text-lg leading-none">
          ?
        </span>
        <span className="hidden text-sm sm:inline">Controls</span>
      </button>
    );
  }

  return (
    <div
      ref={panelRef}
      id="controls-guide"
      role="region"
      aria-label="Controls"
      onKeyDown={keep}
      className={`absolute ${corner} z-10 ${touch ? "w-44 sm:w-[17.5rem]" : "w-[min(17.5rem,calc(100vw-1.5rem))]"} border-[3px] border-[#46382b] bg-[#f5e8c8] text-[#2b2420] shadow-[4px_4px_0_#46382b] ${touch ? "origin-bottom-right" : "origin-bottom-left"}`}
    >
      <div className="flex items-center justify-between gap-2 border-b-[3px] border-[#46382b] bg-[#285943] py-1 pr-1 pl-3 text-[#f5e8c8]">
        <h2 className="text-sm tracking-[0.15em]">CONTROLS</h2>
        <button
          ref={closeRef}
          type="button"
          onClick={() => hide(true)}
          aria-label="Hide controls"
          aria-expanded
          aria-controls="controls-guide"
          className="flex h-9 w-9 items-center justify-center text-base hover:bg-[#1c4031] hover:text-[#f5c65b] focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[#f5c65b] active:translate-y-px"
        >
          ✕
        </button>
      </div>
      <ul className="divide-y divide-[#46382b]/15 px-3 py-1">
        {touch ? (
          <>
            <Row what="Walk">D-pad</Row>
            <Row what="Talk / look">
              <Key label="A button">A</Key>
            </Row>
            <Row what="Next line">Tap the chat</Row>
            <Row what="Map & more">Menu (top)</Row>
          </>
        ) : (
          <>
            <Row what="Walk">
              <Key label="Arrow keys">← ↑ ↓ →</Key>
              or
              <Key label="W A S D">WASD</Key>
            </Row>
            <Row what="Talk / look at something">
              <Key>E</Key>
              or
              <Key>Enter</Key>
            </Row>
            <Row what="Next line in a chat">
              <Key>E</Key>
              <Key>Enter</Key>
              <Key>Space</Key>
            </Row>
            <Row what="Close a chat or window">
              <Key>Esc</Key>
            </Row>
            <Row what="Menu">
              <Key>Esc</Key>
            </Row>
            <Row what="Map · Journal · Profile">
              <Key>M</Key>
              <Key>I</Key>
              <Key>P</Key>
            </Row>
          </>
        )}
      </ul>
      <p className="border-t-2 border-dashed border-[#46382b]/30 px-3 py-1.5 text-xs leading-snug text-[#5a4434]">
        A <span className="font-bold text-[#e0564a]">!</span> appears when you face someone or something you can use. {touch ? "✕ hides this · ? brings it back." : <>Hide with ✕ · bring it back with the ? button or <Key>H</Key></>}
      </p>
    </div>
  );
}
