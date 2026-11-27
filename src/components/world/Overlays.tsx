"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { WORLD } from "@/lib/motion";
import { useEntrance } from "@/hooks/useEntrance";
import {
  ACHIEVEMENTS,
  ATTRIBUTES,
  EXHIBIT_TITLE,
  MAP_CONTENT,
  RARITY_COLORS,
  REGIONS,
  ROUTES,
  TERMINALS,
  type Attribute,
  type ExhibitSection,
  type ProgressSnapshot,
  type Rarity,
} from "@/game/content";
import { emit } from "@/game/bus";
import { BUTTON, CHIP, Gem, LABEL, LINK, PIXEL, ProjectBody, Trophy, Window, useKeys } from "@/components/retro/ui";
import { sfx } from "@/game/audio";
import { PortraitAvatar } from "@/components/retro/WorldView";
import { ArchitectureSection, FeaturesSection, OverviewSection, RoleSection, TechSection, hasRole } from "@/components/retro/ProjectParts";
import TvViewer from "@/components/retro/TvViewer";
import type { Settings } from "@/game/settings";
import { CONTACT_EMAIL, LINKEDIN_URL, aiKnowledgeBase, currentProcesses, ownerProfile } from "@/lib/data";
import type { Dialogue } from "@/game/bus";

// GBA-style overlays drawn by React over the canvas: crisp text, screen-reader friendly, no Phaser import.

const ADVANCE = new Set(["e", "E", "Enter", " "]);

export function CrystalIcon({ rarity, size = 20, hidden = false }: { rarity: Rarity; size?: number; hidden?: boolean }) {
  return <Gem colors={RARITY_COLORS[rarity]} size={size} hidden={hidden} />;
}

function RarityBadge({ rarity }: { rarity: Rarity }) {
  const [, mid, dark] = RARITY_COLORS[rarity];
  return (
    <span className="border-2 px-1.5 text-sm uppercase tracking-widest" style={{ borderColor: dark, background: mid, color: "#1f1d24" }}>
      {rarity}
    </span>
  );
}

// ---------- dialogue ----------

/** Rounded white box with a teal double border and typewriter text. E / Enter / Space or a tap continues. */
export function DialogueBox({ dialogue, reduced, onClose }: { dialogue: Dialogue; reduced: boolean; onClose: () => void }) {
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
    if (page < dialogue.pages.length - 1) {
      sfx("blip");
      setPage(page + 1);
    }
    else onClose();
  };
  useKeys((e) => {
    if (ADVANCE.has(e.key)) {
      e.preventDefault();
      advance();
    } else if (e.key === "Escape") onClose();
  });

  const boxRef = useEntrance<HTMLDivElement>((el) => {
    gsap.from(el.firstElementChild, { autoAlpha: 0, y: 28, duration: WORLD.dur.standard - 0.04, ease: WORLD.easeSoft, clearProps: "transform,opacity,visibility" });
  });

  return (
    <div ref={boxRef} className="pointer-events-auto absolute inset-x-0 bottom-0 flex justify-center p-3 sm:p-5">
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

// ---------- shared window ----------
// Every in-game panel (discovery, journal, terminal, profile) uses this frame so the world has one look:
// cream body, dark-brown border and drop shadow, forest-green title bar, pixel font, white chips.

// ---------- discovery ----------

function AttributeDetails({ attribute }: { attribute: Attribute }) {
  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center gap-2">
        <RarityBadge rarity={attribute.rarity} />
        <span className={LABEL}>{attribute.category}</span>
      </div>
      <p className="text-lg leading-snug">{attribute.description}</p>
      {attribute.skills.length > 0 && (
        <div>
          <p className={LABEL}>Skills</p>
          <ul className="mt-1 flex flex-wrap gap-1.5">
            {attribute.skills.map((s) => (
              <li key={s} className={CHIP}>
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

export function DiscoveryCard({ id, onClose }: { id: string; onClose: () => void }) {
  const attribute = ATTRIBUTES.find((a) => a.id === id);
  useKeys((e) => {
    if (ADVANCE.has(e.key) || e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  });
  const gemRef = useEntrance<HTMLDivElement>((row) => {
    const gem = row.querySelector("[data-gem]");
    const sparks = row.querySelectorAll("[data-spark]");
    const name = row.querySelector("[data-name]");
    gsap
      .timeline({ delay: 0.12 })
      .from(gem, { scale: 0, rotation: -40, duration: WORLD.dur.slow, ease: "back.out(2.2)", clearProps: "transform" })
      .fromTo(
        sparks,
        { x: 0, y: 0, scale: 1, autoAlpha: 1 },
        {
          x: (i) => Math.cos((i / sparks.length) * Math.PI * 2) * 30,
          y: (i) => Math.sin((i / sparks.length) * Math.PI * 2) * 30,
          scale: 0.4,
          autoAlpha: 0,
          duration: WORLD.dur.slow,
          ease: "power2.out",
        },
        0.12,
      )
      .from(name, { autoAlpha: 0, x: -10, duration: WORLD.dur.standard, ease: WORLD.easeSoft, clearProps: "transform,opacity,visibility" }, 0.1);
  });
  if (!attribute) return null;
  return (
    <Window titleId="discovery-title" title="NEW ATTRIBUTE!" width="max-w-md" footerHint="Saved to your Discovery Journal (I)" onClose={onClose} closeLabel="OK">
      <div className="p-5">
        <div ref={gemRef} className="flex items-center gap-3" aria-live="polite">
          <span className="relative inline-flex">
            <span data-gem className="inline-flex">
              <CrystalIcon rarity={attribute.rarity} size={36} />
            </span>
            {Array.from({ length: 8 }, (_, i) => (
              <span
                key={i}
                data-spark
                aria-hidden="true"
                className="pointer-events-none invisible absolute top-1/2 left-1/2 -mt-[3px] -ml-[3px] h-1.5 w-1.5"
                style={{ background: RARITY_COLORS[attribute.rarity][i % 2 ? 1 : 0] }}
              />
            ))}
          </span>
          <p data-name className="text-3xl">
            {attribute.name}
          </p>
        </div>
        <div className="mt-4">
          <AttributeDetails attribute={attribute} />
        </div>
      </div>
    </Window>
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
    <Window
      titleId="journal-title"
      title="DISCOVERY JOURNAL"
      meta={`${found.size}/${ATTRIBUTES.length} ATTRIBUTES`}
      footerHint="↑↓ browse · I or Esc to close"
      onClose={onClose}
    >
      <div className="grid h-full grid-cols-1 sm:grid-cols-[minmax(0,14rem)_minmax(0,1fr)]">
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
        <div className="p-4">
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
    </Window>
  );
}

// ---------- project terminal ----------

export function ProjectTerminal({ id, onClose }: { id: string; onClose: () => void }) {
  const project = TERMINALS[id];
  useKeys((e) => {
    if (e.key === "Escape") onClose();
  });
  if (!project) return null;
  return (
    <Window titleId="terminal-title" title={`${project.title.toUpperCase()} HQ`} meta="TERMINAL" width="max-w-4xl" footerHint="Esc to close" onClose={onClose}>
      <ProjectBody project={project} liveLabelInternal="Back to the title screen" />
    </Window>
  );
}

// ---------- profile card ----------

/** The "trainer card": who Krishi is, how far you've explored, and how to reach him (LinkedIn + email). */
export function ProfileCard({ found, onClose }: { found: Set<string>; onClose: () => void }) {
  useKeys((e) => {
    if (e.key === "Escape" || e.key === "p" || e.key === "P") onClose();
  });
  const { aboutMe } = aiKnowledgeBase;
  const rows: [string, string][] = [
    ["Name", aboutMe.fullName],
    ["Role", aboutMe.tagline],
    ["Based in", currentProcesses.location],
    ["Background", ownerProfile.background],
    ["Studying", `Master of AI, Monash University (graduating ${currentProcesses.graduation})`],
  ];

  return (
    <Window titleId="profile-title" title="PROFILE CARD" meta="KRISHI.WORLD" width="max-w-2xl" footerHint="P or Esc to close" onClose={onClose}>
      <div className="space-y-5 p-5">
        <div className="grid items-start gap-5 sm:grid-cols-[auto_1fr]">
          {/* Same portrait as Classic Mode's trainer profile */}
          <div className="mx-auto flex h-36 w-36 items-end justify-center overflow-hidden rounded-full border-4 border-[#285943] bg-[radial-gradient(circle_at_50%_30%,#d4f0f8_0%,#a6d985_55%,#5e9e48_100%)] shadow-[4px_4px_0_#46382b,inset_0_-6px_0_rgba(31,29,36,0.12)]">
            <PortraitAvatar scale={4.4} className="translate-y-1" label="Krishi's trainer portrait" />
          </div>
          <dl className="space-y-2">
            {rows.map(([label, value]) => (
              <div key={label} className="flex flex-col border-b-2 border-[#46382b]/25 pb-1 sm:flex-row sm:gap-3">
                <dt className={`w-28 shrink-0 ${LABEL}`}>{label}</dt>
                <dd className="text-lg leading-snug">{value}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div>
          <p className={LABEL}>
            Attributes {found.size}/{ATTRIBUTES.length}
          </p>
          <ul className="mt-2 flex flex-wrap gap-2">
            {ATTRIBUTES.map((a) => (
              <li key={a.id} title={found.has(a.id) ? a.name : "Not discovered yet"} className="flex h-10 w-10 items-center justify-center border-2 border-[#46382b] bg-white">
                <CrystalIcon rarity={a.rarity} size={24} hidden={!found.has(a.id)} />
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-wrap gap-3">
          <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className={LINK}>
            LinkedIn ↗
          </a>
          <a href={`mailto:${CONTACT_EMAIL}`} className={LINK}>
            Email Krishi
          </a>
        </div>
      </div>
    </Window>
  );
}

// ---------- pause menu ----------

export type MenuChoice = "journal" | "map" | "achievements" | "profile" | "guide" | "classic" | "resume" | "contact" | "mainMenu";
type Toggle = "sound" | "music" | "reducedMotion";
type Item = { id: MenuChoice | Toggle | "close"; label: string; key?: string };

/**
 * GBA start menu: a narrow panel docked top-right with a ▶ cursor. Arrows move, Enter picks, Esc closes.
 * The three settings flip in place (the menu stays open).
 */
export function PauseMenu({
  settings,
  onChoose,
  onToggle,
  onClose,
}: {
  settings: Settings;
  onChoose: (c: MenuChoice) => void;
  onToggle: (t: Toggle) => void;
  onClose: () => void;
}) {
  const items: Item[] = [
    { id: "journal", label: "Journal", key: "I" },
    { id: "map", label: "World Map", key: "M" },
    { id: "achievements", label: "Achievements", key: "J" },
    { id: "profile", label: "Profile", key: "P" },
    { id: "guide", label: "Text Guide" },
    { id: "sound", label: `Sound: ${settings.sound ? "On" : "Off"}` },
    { id: "music", label: `Music: ${settings.music ? "On" : "Off"}` },
    { id: "reducedMotion", label: `Motion: ${settings.reducedMotion ? "Reduced" : "Full"}` },
    { id: "classic", label: "Classic Portfolio" },
    { id: "resume", label: "Resume ↗" },
    { id: "contact", label: "Contact" },
    { id: "mainMenu", label: "Main Menu" },
    { id: "close", label: "Close", key: "Esc" },
  ];
  const [index, setIndex] = useState(0);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => refs.current[index]?.focus({ preventScroll: true }), [index]);
  const move = (by: number) => {
    sfx("select");
    setIndex((i) => (i + by + items.length) % items.length);
  };
  useKeys((e) => {
    if (e.key === "Escape") onClose();
    else if (e.key === "ArrowDown" || e.key === "s") move(1);
    else if (e.key === "ArrowUp" || e.key === "w") move(-1);
  });
  const pick = (item: Item) => {
    if (item.id === "close") onClose();
    else if (item.id === "sound" || item.id === "music" || item.id === "reducedMotion") onToggle(item.id);
    else onChoose(item.id);
  };
  // Slides in from the right edge it lives on, items cascade (micro stagger)
  const menuRef = useEntrance<HTMLDivElement>((root) => {
    const list = root.querySelector("ul");
    gsap
      .timeline()
      .from(list, { autoAlpha: 0, x: 28, duration: WORLD.dur.standard - 0.04, ease: WORLD.easeSoft, clearProps: "transform,opacity,visibility" })
      .from(list?.children ?? [], { autoAlpha: 0, x: 10, duration: WORLD.dur.quick, ease: WORLD.easeSoft, stagger: 0.025, clearProps: "transform,opacity,visibility" }, 0.06);
  });
  return (
    <div ref={menuRef} className="absolute inset-0 bg-black/20" role="dialog" aria-modal="true" aria-label="Menu" onClick={onClose}>
      <ul
        onClick={(e) => e.stopPropagation()}
        className={`${PIXEL} pointer-events-auto absolute top-16 right-4 max-h-[calc(100%-5rem)] w-60 overflow-y-auto border-4 border-[#46382b] bg-[#f5e8c8] py-2 text-lg text-[#2b2420] shadow-[6px_6px_0_#46382b]`}
      >
        {items.map((item, i) => (
          <li key={item.id} className={item.id === "sound" ? "mt-1 border-t-2 border-[#46382b]/25 pt-1" : item.id === "classic" ? "mt-1 border-t-2 border-[#46382b]/25 pt-1" : ""}>
            <button
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              onMouseEnter={() => setIndex(i)}
              onClick={() => pick(item)}
              className={`flex w-full items-center gap-2 px-3 py-1 text-left outline-none ${i === index ? "bg-[#f5c65b]" : ""}`}
            >
              <span aria-hidden="true" className="w-3">
                {i === index ? "▶" : ""}
              </span>
              <span className="flex-1">{item.label}</span>
              {item.key && <span className="text-sm text-[#6e5643]">{item.key}</span>}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ---------- text guide (play-free fallback) ----------

/** Everything in the world as plain text, region by region: the accessible way to read it all without walking. */
export function TextGuide({ found, onOpenTerminal, onClose }: { found: Set<string>; onOpenTerminal: (id: string) => void; onClose: () => void }) {
  useKeys((e) => {
    if (e.key === "Escape") onClose();
  });
  const attribute = (id: string) => ATTRIBUTES.find((a) => a.id === id);
  return (
    <Window titleId="guide-title" title="TEXT GUIDE" meta="EVERY REGION" width="max-w-3xl" footerHint="Esc to close" onClose={onClose}>
      <div className="space-y-6 p-5">
        <p className="text-base text-[#6e5643]">Everything the world says, without walking. Opening a project file here works just like reading the desk PC inside its HQ.</p>
        {REGIONS.map((r) => {
          const c = MAP_CONTENT[r.id];
          if (!c) return null;
          const terminals = r.id === "metropolis" ? Object.values(TERMINALS) : [];
          return (
            <section key={r.id} className="space-y-2 border-t-2 border-[#46382b]/25 pt-4" aria-labelledby={`guide-${r.id}`}>
              <h3 id={`guide-${r.id}`} className="text-2xl">
                {r.name} <span className="text-base text-[#6e5643]">· {r.blurb}</span>
              </h3>
              {c.npcs.map((npc) => (
                <div key={npc.id}>
                  <p className={LABEL}>{npc.name}</p>
                  {npc.pages.map((line) => (
                    <p key={line} className="text-base leading-snug">
                      {line}
                    </p>
                  ))}
                </div>
              ))}
              {terminals.length > 0 && (
                <div>
                  <p className={LABEL}>Project terminals</p>
                  <div className="mt-1 flex flex-wrap gap-2">
                    {terminals.map((t) => (
                      <button key={t.id} type="button" onClick={() => onOpenTerminal(t.id)} className={BUTTON}>
                        {t.title}
                      </button>
                    ))}
                  </div>
                </div>
              )}
              {c.crystals.length > 0 && (
                <div>
                  <p className={LABEL}>Attributes hidden here</p>
                  <ul className="mt-1 space-y-0.5">
                    {c.crystals.map((cr) => {
                      const a = attribute(cr.attribute);
                      return a ? (
                        <li key={a.id} className="flex items-center gap-2 text-base">
                          <CrystalIcon rarity={a.rarity} size={16} hidden={!found.has(a.id)} />
                          {found.has(a.id) ? a.name : `${a.name} (not found yet)`}
                        </li>
                      ) : null;
                    })}
                  </ul>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </Window>
  );
}

// ---------- touch controls ----------

const PAD_DIRS = [
  { dir: "up", label: "▲", cls: "col-start-2 row-start-1" },
  { dir: "left", label: "◀", cls: "col-start-1 row-start-2" },
  { dir: "right", label: "▶", cls: "col-start-3 row-start-2" },
  { dir: "down", label: "▼", cls: "col-start-2 row-start-3" },
] as const;

/**
 * On-screen D-pad + A button for touch screens (hidden where a fine pointer, i.e. a mouse, is present).
 * Holding a direction walks; releasing, cancelling or sliding off stops.
 */
export function TouchControls() {
  const release = () => emit("pad", null);
  const btn =
    "flex h-14 w-14 items-center justify-center border-4 border-[#46382b] bg-[#f5e8c8]/90 text-xl text-[#46382b] shadow-[3px_3px_0_#46382b] active:translate-x-px active:translate-y-px active:bg-[#f5c65b] select-none touch-none";
  return (
    <div className="pointer-events-none absolute inset-x-0 bottom-4 hidden items-end justify-between px-4 [@media(pointer:coarse)]:flex">
      <div className="pointer-events-auto grid grid-cols-3 grid-rows-3 gap-1">
        {PAD_DIRS.map((d) => (
          <button
            key={d.dir}
            type="button"
            aria-label={`Walk ${d.dir}`}
            className={`${btn} ${d.cls}`}
            onPointerDown={(e) => {
              try {
                e.currentTarget.setPointerCapture(e.pointerId); // keep receiving "up" even if the finger slides off
              } catch {
                // pointer already gone (e.g. a very quick tap); walking still starts and onPointerUp stops it
              }
              emit("pad", d.dir);
            }}
            onPointerUp={release}
            onPointerCancel={release}
            onLostPointerCapture={release}
            onContextMenu={(e) => e.preventDefault()}
          >
            {d.label}
          </button>
        ))}
      </div>
      <button type="button" aria-label="Talk or inspect" className={`${btn} pointer-events-auto h-16 w-16 rounded-full font-[family-name:var(--font-pixel)] text-2xl`} onClick={() => emit("pad-a")}>
        A
      </button>
    </div>
  );
}

// ---------- world map ----------

/** Islands joined by bridges. Visited regions are named and, unless you're already there, fast-travel targets. */
export function WorldMap({
  visited,
  current,
  onTravel,
  onClose,
}: {
  visited: string[];
  current: string;
  onTravel: (id: string) => void;
  onClose: () => void;
}) {
  useKeys((e) => {
    if (e.key === "Escape" || e.key === "m" || e.key === "M") onClose();
  });
  const at = (id: string) => REGIONS.find((r) => r.id === id);
  const here = at(current);
  return (
    <Window
      titleId="map-title"
      title="WORLD MAP"
      meta={`${visited.length}/${REGIONS.length} REGIONS`}
      width="max-w-3xl"
      footerHint="Pick a visited region to fast travel · M or Esc to close"
      onClose={onClose}
    >
      <div className="p-4">
        <div className="relative aspect-[16/10] w-full overflow-hidden border-4 border-[#46382b] bg-[#4f9fbf] bg-[radial-gradient(#7bc9df_1.5px,transparent_1.5px)] [background-size:14px_14px]">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {ROUTES.map(([a, b]) => {
              const ra = at(a);
              const rb = at(b);
              if (!ra || !rb) return null;
              const known = visited.includes(a) && visited.includes(b);
              return (
                <line
                  key={a + b}
                  x1={ra.x}
                  y1={ra.y}
                  x2={rb.x}
                  y2={rb.y}
                  stroke={known ? "#9a6a3c" : "#2f6f8f"}
                  strokeWidth="6"
                  strokeDasharray={known ? undefined : "6 6"}
                  vectorEffect="non-scaling-stroke"
                />
              );
            })}
          </svg>
          {REGIONS.map((r) => {
            const seen = visited.includes(r.id);
            const isHere = r.id === current;
            return (
              <button
                key={r.id}
                type="button"
                disabled={!seen || isHere}
                onClick={() => onTravel(r.id)}
                style={{ left: `${r.x}%`, top: `${r.y}%`, background: seen ? r.color : "#9aa7ab" }}
                className="absolute flex h-[22%] w-[19%] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[40%] border-4 border-[#46382b] shadow-[3px_3px_0_#46382b] enabled:cursor-pointer enabled:hover:brightness-110 disabled:cursor-default"
                aria-label={seen ? `${r.name}${isHere ? ", you are here" : ", fast travel here"}` : "Undiscovered region"}
              >
                {isHere && (
                  <span aria-hidden="true" className="absolute -top-7 text-xl text-[#e0564a] motion-safe:animate-bounce">
                    ▼
                  </span>
                )}
                <span className={`rounded-sm px-1 text-center text-[11px] leading-tight sm:text-sm ${seen ? "bg-[#f5e8c8]/90 text-[#2b2420]" : "text-[#46382b]"}`}>
                  {seen ? r.name : "???"}
                </span>
              </button>
            );
          })}
        </div>
        {here && (
          <p className="mt-3 text-base text-[#6e5643]">
            You are in {here.name}: {here.blurb.toLowerCase()}.
          </p>
        )}
      </div>
    </Window>
  );
}

// ---------- achievements ----------

export function AchievementList({ progress, onClose }: { progress: ProgressSnapshot; onClose: () => void }) {
  useKeys((e) => {
    if (e.key === "Escape" || e.key === "j" || e.key === "J") onClose();
  });
  const done = ACHIEVEMENTS.filter((a) => a.done(progress)).length;
  return (
    <Window titleId="achievements-title" title="ACHIEVEMENTS" meta={`${done}/${ACHIEVEMENTS.length}`} width="max-w-xl" footerHint="J or Esc to close" onClose={onClose}>
      <ul className="divide-y-2 divide-[#46382b]/20">
        {ACHIEVEMENTS.map((a) => {
          const ok = a.done(progress);
          return (
            <li key={a.id} className={`flex items-center gap-3 px-4 py-3 ${ok ? "" : "opacity-60"}`}>
              <Trophy done={ok} />
              <div>
                <p className="text-lg">{a.name}</p>
                <p className="text-sm text-[#6e5643]">{a.description}</p>
              </div>
              {ok && <span className="ml-auto text-sm text-[#285943]">DONE</span>}
            </li>
          );
        })}
      </ul>
    </Window>
  );
}

/** Small non-blocking banner when an achievement unlocks. */
export function AchievementToast({ name }: { name: string }) {
  const ref = useEntrance<HTMLDivElement>((el) => {
    gsap
      .timeline()
      .from(el, { autoAlpha: 0, y: -28, scale: 0.9, duration: WORLD.dur.standard + 0.05, ease: "back.out(1.7)" })
      .from(el.querySelector("[data-trophy]"), { rotation: -25, scale: 0.5, duration: 0.6, ease: "elastic.out(1, 0.45)" }, 0.12)
      .to(el, { autoAlpha: 0, y: -16, duration: WORLD.dur.quick + 0.05, ease: WORLD.exit }, 3.25);
  });
  return (
    <div
      ref={ref}
      role="status"
      className={`${PIXEL} pointer-events-none absolute top-16 left-1/2 flex -translate-x-1/2 items-center gap-2 border-4 border-[#46382b] bg-[#f5e8c8] px-4 py-2 text-[#2b2420] shadow-[4px_4px_0_#46382b]`}
    >
      <span data-trophy className="inline-flex">
        <Trophy done />
      </span>
      <span>
        <span className="block text-sm uppercase tracking-widest text-[#285943]">Achievement unlocked</span>
        <span className="text-lg">{name}</span>
      </span>
    </div>
  );
}

// ---------- HQ exhibits ----------

/** One part of a project file, opened from a piece of furniture inside its HQ. */
export function ExhibitWindow({ project, section, onClose }: { project: string; section: ExhibitSection; onClose: () => void }) {
  useKeys((e) => {
    if (e.key === "Escape") onClose();
  });
  const p = TERMINALS[project];
  if (!p) return null;
  return (
    <Window titleId="exhibit-title" title={EXHIBIT_TITLE[section]} meta={p.title.toUpperCase()} width="max-w-4xl" footerHint={section === "screens" ? "← → change channel · Esc to close" : "Esc to close · the desk PC has the full project file"} onClose={onClose}>
      <div className="space-y-6 p-5 sm:p-6">
        {section === "overview" && (
          <>
            <OverviewSection p={p} />
            {hasRole(p) && <RoleSection p={p} />}
          </>
        )}
        {section === "architecture" && <ArchitectureSection p={p} wide="never" />}
        {section === "tech" && <TechSection p={p} />}
        {section === "outcomes" && <FeaturesSection p={p} />}
        {section === "screens" && <TvViewer shots={p.screenshots} title={p.title} />}
      </div>
    </Window>
  );
}
