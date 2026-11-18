"use client";

import { useEffect, useRef, useState } from "react";
import { ATTRIBUTES, RARITY_COLORS, type Attribute, type Rarity } from "@/game/content";
import type { Dialogue } from "@/game/bus";
import { useReducedMotion } from "@/hooks/useReducedMotion";

// GBA-style overlays drawn by React over the canvas: crisp text, screen-reader friendly, no Phaser import.

const PIXEL = "font-[family-name:var(--font-pixel)]";
const ADVANCE = new Set(["e", "E", "Enter", " "]);

/** Window key handler for as long as the overlay is mounted (held-key repeats are ignored). */
function useKeys(handler: (e: KeyboardEvent) => void) {
  const ref = useRef(handler);
  useEffect(() => {
    ref.current = handler;
  });
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!e.repeat) ref.current(e);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
}

export function CrystalIcon({ rarity, size = 20, hidden = false }: { rarity: Rarity; size?: number; hidden?: boolean }) {
  const [light, mid, dark] = hidden ? ["#cfc4a8", "#b5a988", "#8f8466"] : RARITY_COLORS[rarity];
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges" className="shrink-0">
      <path d="M8 1 L14 7 L8 15 L2 7 Z" fill={mid} stroke="#1f1d24" strokeWidth="1" />
      <path d="M8 1 L2 7 L8 7 Z" fill={light} />
      <path d="M8 7 L14 7 L8 15 Z" fill={dark} />
    </svg>
  );
}

function RarityBadge({ rarity }: { rarity: Rarity }) {
  const [, mid, dark] = RARITY_COLORS[rarity];
  return (
    <span className="border-2 px-1.5 text-xs uppercase tracking-widest" style={{ borderColor: dark, background: mid, color: "#1f1d24" }}>
      {rarity}
    </span>
  );
}

// ---------- dialogue ----------

/** Rounded white box with a teal double border and typewriter text. E / Enter / Space or a tap continues. */
export function DialogueBox({ dialogue, onClose }: { dialogue: Dialogue; onClose: () => void }) {
  const reduced = useReducedMotion();
  const [page, setPage] = useState(0);
  const [shown, setShown] = useState(0);
  const text = dialogue.pages[page] ?? "";
  const done = reduced || shown >= text.length;

  useEffect(() => {
    if (reduced) return;
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setShown(0);
    const id = setInterval(() => setShown((n) => (n >= text.length ? n : n + 1)), 22);
    return () => clearInterval(id);
  }, [text, reduced]);

  const advance = () => {
    if (!done) return setShown(text.length); // first press finishes the line
    if (page < dialogue.pages.length - 1) setPage(page + 1);
    else onClose();
  };
  useKeys((e) => {
    if (ADVANCE.has(e.key)) {
      e.preventDefault();
      advance();
    } else if (e.key === "Escape") onClose();
  });

  return (
    <div className="pointer-events-auto absolute inset-x-0 bottom-0 flex justify-center p-3 sm:p-5">
      <button
        type="button"
        onClick={advance}
        className={`${PIXEL} relative w-full max-w-3xl cursor-pointer rounded-[12px] border-[3px] border-[#2f7d6d] bg-white px-5 py-4 text-left text-lg leading-snug text-[#3a3a42] shadow-[inset_0_0_0_3px_#ffffff,inset_0_0_0_6px_#8fdccb] [text-shadow:1px_1px_0_#d6d6ce] sm:px-7 sm:py-5 sm:text-2xl`}
        aria-label="Continue"
      >
        {dialogue.speaker && (
          <span className="absolute -top-4 left-5 rounded-md border-[3px] border-[#2f7d6d] bg-[#f5e8c8] px-2 text-sm text-[#46382b] [text-shadow:none] sm:text-base">
            {dialogue.speaker}
          </span>
        )}
        <span aria-hidden="true" className="block min-h-[2.6em]">
          {text.slice(0, reduced ? text.length : shown)}
        </span>
        <span className="sr-only" aria-live="polite">
          {dialogue.speaker ? `${dialogue.speaker}: ` : ""}
          {text}
        </span>
        {done && <span aria-hidden="true" className="absolute right-4 bottom-2 text-base text-[#e0564a] motion-safe:animate-bounce">▼</span>}
      </button>
    </div>
  );
}

// ---------- discovery ----------

function AttributeDetails({ attribute }: { attribute: Attribute }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <RarityBadge rarity={attribute.rarity} />
        <span className="text-sm uppercase tracking-widest text-[#6e5643]">{attribute.category}</span>
      </div>
      <p className="text-lg leading-snug">{attribute.description}</p>
      {attribute.skills.length > 0 && (
        <div>
          <p className="text-sm uppercase tracking-widest text-[#6e5643]">Skills</p>
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {attribute.skills.map((s) => (
              <li key={s} className="border-2 border-[#46382b] bg-white px-1.5 text-sm">
                {s}
              </li>
            ))}
          </ul>
        </div>
      )}
      {attribute.projects.length > 0 && (
        <p className="text-sm">
          <span className="uppercase tracking-widest text-[#6e5643]">Related projects: </span>
          {attribute.projects.join(", ")}
        </p>
      )}
    </div>
  );
}

const PANEL = `${PIXEL} pointer-events-auto border-4 border-[#46382b] bg-[#f5e8c8] text-[#2b2420] shadow-[6px_6px_0_#46382b]`;

export function DiscoveryCard({ id, onClose }: { id: string; onClose: () => void }) {
  const attribute = ATTRIBUTES.find((a) => a.id === id);
  useKeys((e) => {
    if (ADVANCE.has(e.key) || e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  });
  if (!attribute) return null;
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-4" role="dialog" aria-modal="true" aria-labelledby="discovery-title">
      <div className={`${PANEL} w-full max-w-md p-5`}>
        <p className="text-sm uppercase tracking-[0.2em] text-[#2f7d6d]" aria-live="polite">
          New attribute discovered!
        </p>
        <div className="mt-2 flex items-center gap-3">
          <CrystalIcon rarity={attribute.rarity} size={36} />
          <h2 id="discovery-title" className="text-3xl">
            {attribute.name}
          </h2>
        </div>
        <div className="mt-4">
          <AttributeDetails attribute={attribute} />
        </div>
        <div className="mt-5 flex items-center justify-between gap-3 border-t-2 border-[#46382b]/30 pt-3 text-sm">
          <span className="text-[#6e5643]">Saved to your Discovery Journal (I)</span>
          <button type="button" onClick={onClose} className="border-2 border-[#46382b] bg-white px-3 py-1 hover:bg-[#f5c65b]">
            OK
          </button>
        </div>
      </div>
    </div>
  );
}

// ---------- journal ----------

export function Journal({ found, onClose }: { found: Set<string>; onClose: () => void }) {
  const [index, setIndex] = useState(0);
  const selected = ATTRIBUTES[index];
  useKeys((e) => {
    if (e.key === "Escape" || e.key === "i" || e.key === "I") onClose();
    else if (e.key === "ArrowDown" || e.key === "s") setIndex((i) => (i + 1) % ATTRIBUTES.length);
    else if (e.key === "ArrowUp" || e.key === "w") setIndex((i) => (i - 1 + ATTRIBUTES.length) % ATTRIBUTES.length);
  });

  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-3 sm:p-6" role="dialog" aria-modal="true" aria-labelledby="journal-title">
      <div className={`${PANEL} flex max-h-full w-full max-w-3xl flex-col overflow-hidden`}>
        <div className="flex items-center justify-between gap-3 border-b-4 border-[#46382b] bg-[#285943] px-4 py-2 text-[#f5e8c8]">
          <h2 id="journal-title" className="text-xl tracking-[0.15em]">
            DISCOVERY JOURNAL
          </h2>
          <span className="text-sm">
            {found.size}/{ATTRIBUTES.length} ATTRIBUTES
          </span>
        </div>
        <div className="grid min-h-0 flex-1 grid-cols-1 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
          <ul className="max-h-48 overflow-y-auto border-b-4 border-[#46382b] sm:max-h-none sm:border-r-4 sm:border-b-0" role="listbox" aria-label="Attributes">
            {ATTRIBUTES.map((a, i) => {
              const known = found.has(a.id);
              return (
                <li key={a.id}>
                  <button
                    type="button"
                    role="option"
                    aria-selected={i === index}
                    onClick={() => setIndex(i)}
                    className={`flex w-full items-center gap-2 px-3 py-2 text-left text-lg ${i === index ? "bg-[#f5c65b]" : "hover:bg-white/60"}`}
                  >
                    <span aria-hidden="true" className="w-3">
                      {i === index ? "▶" : ""}
                    </span>
                    <CrystalIcon rarity={a.rarity} hidden={!known} />
                    <span>{known ? a.name : "???"}</span>
                  </button>
                </li>
              );
            })}
          </ul>
          <div className="min-h-0 overflow-y-auto p-4">
            {selected && found.has(selected.id) ? (
              <>
                <h3 className="mb-3 text-2xl">{selected.name}</h3>
                <AttributeDetails attribute={selected} />
              </>
            ) : (
              <p className="text-lg text-[#6e5643]">Not discovered yet. Keep exploring and talk to the people you meet!</p>
            )}
          </div>
        </div>
        <div className="flex items-center justify-between gap-3 border-t-4 border-[#46382b] px-4 py-2 text-sm">
          <span className="hidden text-[#6e5643] sm:inline">↑↓ browse · I or Esc to close</span>
          <button type="button" onClick={onClose} className="ml-auto border-2 border-[#46382b] bg-white px-3 py-1 hover:bg-[#f5c65b]">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
