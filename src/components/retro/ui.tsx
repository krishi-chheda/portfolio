"use client";

// The KRISHI.WORLD retro UI kit, shared by Adventure Mode overlays and Classic Mode: one frame, one set of
// labels, chips, buttons and icons, so both modes look like the same game. No Phaser imports.
import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import type { ProjectDetail } from "@/lib/portfolio";
import { WORLD } from "@/lib/motion";
import { useEntrance } from "@/hooks/useEntrance";

import { BUTTON, CHIP, LINK, PANEL, PIXEL, TITLE_BAR } from "./styles";
export { BUTTON, CARD, CHIP, LABEL, LINK, MUTED, PANEL, PIXEL, TITLE_BAR } from "./styles";

/** Window key handler for as long as the component is mounted (held-key repeats are ignored). */
export function useKeys(handler: (e: KeyboardEvent) => void) {
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

/** A faceted gem in three shades: crystals in the game, skill icons in the Skilldex. */
export function Gem({ colors, size = 20, hidden = false }: { colors: readonly [string, string, string]; size?: number; hidden?: boolean }) {
  const [light, mid, dark] = hidden ? ["#cfc4a8", "#b5a988", "#8f8466"] : colors;
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges" className="shrink-0">
      <path d="M8 1 L14 7 L8 15 L2 7 Z" fill={mid} stroke="#1f1d24" strokeWidth="1" />
      <path d="M8 1 L2 7 L8 7 Z" fill={light} />
      <path d="M8 7 L14 7 L8 15 Z" fill={dark} />
    </svg>
  );
}

export function Trophy({ done, size = 24 }: { done: boolean; size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges" className="shrink-0">
      <path d="M4 2h8v4a4 4 0 0 1-8 0z M7 10h2v2h2v2H5v-2h2z" fill={done ? "#f5c65b" : "#cfc4a8"} stroke="#1f1d24" strokeWidth="1" />
    </svg>
  );
}

/** A modal window: backdrop, shared frame, green title bar, scrolling body, footer with a focused close button. */
export function Window({
  titleId,
  title,
  meta,
  width = "max-w-3xl",
  footerHint,
  onClose,
  closeLabel = "Close",
  fixed = false,
  children,
}: {
  titleId: string;
  title: ReactNode;
  meta?: ReactNode;
  width?: string;
  footerHint?: string;
  onClose: () => void;
  closeLabel?: string;
  fixed?: boolean; // true on scrolling pages (Classic Mode); the game overlays sit inside a fixed stage already
  children: ReactNode;
}) {
  const closeRef = useRef<HTMLButtonElement>(null);
  useEffect(() => closeRef.current?.focus({ preventScroll: true }), []);
  // Heavy element: backdrop fades, the panel pops up (signature overshoot), then the first content blocks cascade in
  const rootRef = useEntrance<HTMLDivElement>((root) => {
    const panel = root.firstElementChild;
    const blocks = [...(root.querySelector("[data-window-body] > *")?.children ?? [])].slice(0, 6);
    gsap
      .timeline()
      .from(root, { backgroundColor: "rgba(0,0,0,0)", duration: WORLD.dur.quick, ease: "power1.out", clearProps: "backgroundColor" })
      .from(panel, { autoAlpha: 0, y: WORLD.rise + 6, scale: 0.95, duration: WORLD.dur.standard, ease: WORLD.ease, clearProps: "transform,opacity,visibility" }, 0)
      .from(blocks, { autoAlpha: 0, y: 8, duration: WORLD.dur.quick + 0.05, ease: WORLD.easeSoft, stagger: WORLD.stagger, clearProps: "transform,opacity,visibility" }, 0.1);
  });
  return (
    <div ref={rootRef} className={`${fixed ? "fixed" : "absolute"} inset-0 z-40 flex items-center justify-center bg-black/40 p-3 sm:p-6`} role="dialog" aria-modal="true" aria-labelledby={titleId}>
      <div className={`${PIXEL} ${PANEL} pointer-events-auto flex max-h-full w-full ${width} flex-col overflow-hidden`}>
        <div className={TITLE_BAR}>
          <h2 id={titleId} className="min-w-0 truncate text-xl tracking-[0.15em]">
            {title}
          </h2>
          {meta && <span className="shrink-0 text-sm">{meta}</span>}
        </div>
        <div data-window-body className="min-h-0 flex-1 overflow-y-auto">
          {children}
        </div>
        <div className="flex items-center justify-between gap-3 border-t-4 border-[#46382b] px-4 py-2 text-sm">
          {footerHint && <span className="hidden text-[#5a4434] sm:inline">{footerHint}</span>}
          <button ref={closeRef} type="button" onClick={onClose} className={`ml-auto ${BUTTON}`}>
            {closeLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
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

export function Bullets({ items }: { items: string[] }) {
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

/** Every section of a project, from the shared ProjectDetail. Used by the game terminal and Classic Mode. */
export function ProjectBody({ project, liveLabelInternal = "Open the site" }: { project: ProjectDetail; liveLabelInternal?: string }) {
  const external = (url: string) => url.startsWith("http");
  const prose = "text-base leading-snug";
  return (
    <div className="space-y-5 p-5 sm:p-6">
      <header className="space-y-1.5">
        <p className="text-3xl">{project.title}</p>
        <p className="text-base text-[#285943]">
          {project.subtitle}
          {project.status && <span className="text-[#5a4434]"> · {project.status}</span>}
        </p>
        {project.role && <p className="text-sm text-[#5a4434]">Role: {project.role}</p>}
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
                  <p className="mt-1 text-sm leading-snug text-[#5a4434]">{step.description}</p>
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
        <Section title={project.featuresTitle}>
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
        <Section title="Challenge & solution">
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
              {external(project.liveUrl) ? "Live demo ↗" : liveLabelInternal}
            </a>
          )}
          {!project.githubUrl && !project.liveUrl && <span className="text-[#5a4434]">No public repository or demo for this project.</span>}
        </div>
      </Section>
    </div>
  );
}
