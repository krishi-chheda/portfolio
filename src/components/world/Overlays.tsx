"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { ATTRIBUTES, RARITY_COLORS, TERMINALS, type Attribute, type Rarity } from "@/game/content";
import { CONTACT_EMAIL, LINKEDIN_URL, aiKnowledgeBase, currentProcesses, ownerProfile } from "@/lib/data";
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

// ---------- shared window ----------
// Every in-game panel (discovery, journal, terminal, profile) uses this frame so the world has one look:
// cream body, dark-brown border and drop shadow, forest-green title bar, pixel font, white chips.

const LABEL = "text-sm uppercase tracking-widest text-[#6e5643]";
const CHIP = "border-2 border-[#46382b] bg-white px-1.5 text-sm";
const BUTTON = "border-2 border-[#46382b] bg-white px-3 py-1 hover:bg-[#f5c65b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285943]";
const LINK = "border-2 border-[#46382b] bg-white px-3 py-1 text-base hover:bg-[#f5c65b]";

function Window({
  titleId,
  title,
  meta,
  width = "max-w-3xl",
  footerHint,
  onClose,
  closeLabel = "Close",
  children,
}: {
  titleId: string;
  title: ReactNode;
  meta?: ReactNode;
  width?: string;
  footerHint?: string;
  onClose: () => void;
  closeLabel?: string;
  children: ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeRef.current?.focus({ preventScroll: true }), []);
  return (
    <div className="absolute inset-0 flex items-center justify-center bg-black/40 p-3 sm:p-6" role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className={`${PIXEL} pointer-events-auto flex max-h-full w-full ${width} flex-col overflow-hidden border-4 border-[#46382b] bg-[#f5e8c8] text-[#2b2420] shadow-[6px_6px_0_#46382b]`}>
        <div className="flex items-center justify-between gap-3 border-b-4 border-[#46382b] bg-[#285943] px-4 py-2 text-[#f5e8c8]">
          <h2 id={titleId} className="min-w-0 truncate text-xl tracking-[0.15em]">
            {title}
          </h2>
          {meta && <span className="shrink-0 text-sm">{meta}</span>}
        </div>
        <div className="min-h-0 flex-1 overflow-y-auto">{children}</div>
        <div className="flex items-center justify-between gap-3 border-t-4 border-[#46382b] px-4 py-2 text-sm">
          {footerHint && <span className="hidden text-[#6e5643] sm:inline">{footerHint}</span>}
          <button ref={closeRef} type="button" onClick={onClose} className={`ml-auto ${BUTTON}`}>
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

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
  if (!attribute) return null;
  return (
    <Window titleId="discovery-title" title="NEW ATTRIBUTE!" width="max-w-md" footerHint="Saved to your Discovery Journal (I)" onClose={onClose} closeLabel="OK">
      <div className="p-5">
        <div className="flex items-center gap-3" aria-live="polite">
          <CrystalIcon rarity={attribute.rarity} size={36} />
          <p className="text-3xl">{attribute.name}</p>
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

function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-1.5">
      <h3 className="text-sm uppercase tracking-widest text-[#285943]">
        <span aria-hidden="true">▶ </span>
        {title}
      </h3>
      {children}
    </section>
  );
}

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1 text-base leading-snug">
      {items.map((item) => (
        <li key={item} className="flex gap-2">
          <span aria-hidden="true" className="text-[#285943]">
            •
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

/** A project HQ's terminal. Everything shown comes from TERMINALS (built from data.ts); empty sections are omitted. */
export function ProjectTerminal({ id, onClose }: { id: string; onClose: () => void }) {
  const project = TERMINALS[id];
  useKeys((e) => {
    if (e.key === "Escape") onClose();
  });
  if (!project) return null;
  const external = (url: string) => url.startsWith("http");
  const prose = "text-base leading-snug";

  return (
    <Window titleId="terminal-title" title={`${project.title.toUpperCase()} HQ`} meta="TERMINAL" width="max-w-4xl" footerHint="Esc to close" onClose={onClose}>
      <div className="space-y-5 p-5 sm:p-6">
        <header className="space-y-1.5">
          <p className="text-3xl">{project.title}</p>
          <p className="text-base text-[#285943]">
            {project.subtitle}
            {project.status && <span className="text-[#6e5643]"> · {project.status}</span>}
          </p>
          <p className={prose}>{project.description}</p>
        </header>

        {(project.problem || project.solution) && (
          <div className="grid gap-4 sm:grid-cols-2">
            {project.problem && (
              <Section title="Problem">
                <p className={prose}>{project.problem}</p>
              </Section>
            )}
            {project.solution && (
              <Section title="Solution">
                <p className={prose}>{project.solution}</p>
              </Section>
            )}
          </div>
        )}

        <Section title="Tech stack">
          <ul className="flex flex-wrap gap-1.5">
            {project.techStack.map((t) => (
              <li key={t} className={CHIP}>
                {t}
              </li>
            ))}
          </ul>
        </Section>

        {project.flow.length > 0 && (
          <Section title="Architecture">
            <ol className="flex flex-wrap items-stretch gap-2">
              {project.flow.map((step, i) => (
                <li key={step.label} className="flex items-center gap-2">
                  <div className="max-w-[14rem] border-2 border-[#46382b] bg-white p-2 shadow-[3px_3px_0_#46382b]">
                    <p className="text-base">{step.label}</p>
                    <p className="mt-1 text-sm leading-snug text-[#6e5643]">{step.description}</p>
                  </div>
                  {i < project.flow.length - 1 && (
                    <span aria-hidden="true" className="text-[#285943]">
                      ▶
                    </span>
                  )}
                </li>
              ))}
            </ol>
          </Section>
        )}

        {project.features.length > 0 && (
          <Section title={project.flow.length > 0 ? "Key decisions" : "Features"}>
            <Bullets items={project.features} />
          </Section>
        )}
        {project.extras.length > 0 && (
          <Section title="Also inside">
            <Bullets items={project.extras} />
          </Section>
        )}
        {project.achievements.length > 0 && (
          <Section title="Outcomes">
            <Bullets items={project.achievements} />
          </Section>
        )}
        {project.challenge && (
          <Section title="Challenge">
            <p className={prose}>{project.challenge}</p>
          </Section>
        )}
        {project.tradeOffs && (
          <Section title="Trade-offs">
            <p className={prose}>{project.tradeOffs}</p>
          </Section>
        )}

        <Section title="Links">
          <div className="flex flex-wrap gap-3">
            {project.githubUrl && (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={LINK}>
                View source ↗
              </a>
            )}
            {project.liveUrl && (
              <a href={project.liveUrl} {...(external(project.liveUrl) ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={LINK}>
                {external(project.liveUrl) ? "Live demo ↗" : "Open the classic portfolio"}
              </a>
            )}
            {!project.githubUrl && !project.liveUrl && <span className="text-[#6e5643]">No public repository or demo for this project.</span>}
          </div>
        </Section>
      </div>
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
        <dl className="space-y-2">
          {rows.map(([label, value]) => (
            <div key={label} className="flex flex-col border-b-2 border-[#46382b]/25 pb-1 sm:flex-row sm:gap-3">
              <dt className={`w-32 shrink-0 ${LABEL}`}>{label}</dt>
              <dd className="text-lg leading-snug">{value}</dd>
            </div>
          ))}
        </dl>

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
