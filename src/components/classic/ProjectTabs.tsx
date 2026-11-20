"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { sfx } from "@/game/audio";

/**
 * GBA summary-screen pages for a project file: ◀ ▶ (or ←/→ on the tab row) flips pages. Panels are server-rendered
 * children; until hydration every panel shows, so the whole file is readable without JavaScript.
 */
export default function ProjectTabs({ tabs }: { tabs: { id: string; label: string; content: ReactNode }[] }) {
  const [active, setActive] = useState(0);
  const [ready, setReady] = useState(false);
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setReady(true);
    const fromHash = tabs.findIndex((t) => `#${t.id}` === window.location.hash);
    if (fromHash >= 0) setActive(fromHash);
  }, [tabs]);

  const go = (i: number, focus = false) => {
    const next = (i + tabs.length) % tabs.length;
    if (next !== active) sfx("select");
    setActive(next);
    if (focus) refs.current[next]?.focus();
  };

  return (
    <div className="border-4 border-[#46382b] bg-[#f5e8c8] shadow-[6px_6px_0_#46382b]">
      <div className="flex items-stretch border-b-4 border-[#46382b] bg-[#285943]">
        <button type="button" onClick={() => go(active - 1)} aria-label="Previous page" className="shrink-0 px-3 text-[#f5e8c8] hover:text-[#f5c65b]">
          ◀
        </button>
        <div
          role="tablist"
          aria-label="Project file pages"
          className="flex min-w-0 flex-1 gap-1 overflow-x-auto py-2"
          onKeyDown={(e) => {
            if (e.key === "ArrowRight") go(active + 1, true);
            else if (e.key === "ArrowLeft") go(active - 1, true);
            else return;
            e.preventDefault();
          }}
        >
          {tabs.map((t, i) => (
            <button
              key={t.id}
              ref={(el) => {
                refs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`tab-${t.id}`}
              aria-selected={i === active}
              aria-controls={`panel-${t.id}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => go(i)}
              className={`shrink-0 border-2 px-3 py-1 text-sm tracking-widest transition-colors duration-150 sm:text-base ${
                i === active ? "border-[#46382b] bg-[#f5c65b] text-[#2b2420]" : "border-transparent text-[#f5e8c8] hover:border-[#f5e8c8]/50"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
        <button type="button" onClick={() => go(active + 1)} aria-label="Next page" className="shrink-0 px-3 text-[#f5e8c8] hover:text-[#f5c65b]">
          ▶
        </button>
      </div>
      {tabs.map((t, i) => (
        <section
          key={t.id}
          id={`panel-${t.id}`}
          role={ready ? "tabpanel" : undefined}
          aria-labelledby={`tab-${t.id}`}
          hidden={ready && i !== active}
          className={`p-4 sm:p-6 ${ready ? "" : "border-b-4 border-dashed border-[#46382b]/30 last:border-b-0"}`}
        >
          {!ready && <h2 className="mb-4 text-xl tracking-[0.12em] text-[#285943]">{t.label}</h2>}
          {t.content}
        </section>
      ))}
      <p className="border-t-2 border-[#46382b]/30 px-4 py-2 text-right text-sm text-[#5a4434]">
        Page {active + 1}/{tabs.length} · ◀ ▶ or ← → to flip
      </p>
    </div>
  );
}
