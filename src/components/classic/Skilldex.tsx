"use client";

import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { CHIP, Gem, LABEL, MUTED } from "@/components/retro/ui";
import { skillCategories } from "@/lib/data";
import { skillProfile } from "@/lib/portfolio";
import { CATEGORY_GEMS } from "@/lib/retro";
import gsap from "gsap";
import { WORLD } from "@/lib/motion";
import { useEntrance } from "@/hooks/useEntrance";

const ENTRIES = skillCategories.flatMap((c, ci) => c.skills.map((name) => ({ name, category: c.name, gem: CATEGORY_GEMS[ci % CATEGORY_GEMS.length] })));
const number = (name: string) => String(ENTRIES.findIndex((e) => e.name === name) + 1).padStart(3, "0");

/**
 * Numbered skill entries by category. Picking one (click, or ←/→ between entries) opens its Skilldex page: what the
 * technology is, where Krishi has used it (real project stacks and roles), and what it was used alongside.
 * No proficiency ratings.
 */
export default function Skilldex() {
  const [picked, setPicked] = useState(ENTRIES[0].name);
  const entry = ENTRIES.find((e) => e.name === picked) ?? ENTRIES[0];
  const info = skillProfile(entry.name);
  const buttons = useRef<Record<string, HTMLButtonElement | null>>({});
  // lg+: the entry page is a sticky side panel. Smaller screens: it opens right under the tapped category.
  const [wide, setWide] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const sync = () => setWide(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  const pick = (name: string) => setPicked(name);
  const onKey = (e: KeyboardEvent) => {
    const step = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const i = (ENTRIES.findIndex((x) => x.name === picked) + step + ENTRIES.length) % ENTRIES.length;
    pick(ENTRIES[i].name);
    buttons.current[ENTRIES[i].name]?.focus();
  };

  const detailRef = useEntrance<HTMLElement>(
    (aside) => {
      gsap
        .timeline({ defaults: { clearProps: "transform,opacity,visibility" } })
        .from(aside.querySelector("svg"), { scale: 0.4, rotation: -30, duration: WORLD.dur.standard + 0.05, ease: "back.out(2)" })
        .from(aside.querySelectorAll(":scope > div:last-child > div"), { autoAlpha: 0, y: 8, duration: WORLD.dur.quick + 0.05, ease: WORLD.easeSoft, stagger: WORLD.stagger }, 0.05);
    },
    [picked, wide],
  );
  const detail = (
      <aside
        ref={detailRef}
        id="skilldex-entry"
        aria-live="polite"
        className="h-fit border-4 border-[#46382b] bg-white shadow-[4px_4px_0_#46382b] lg:sticky lg:top-24"
      >
        <div className="flex items-center gap-3 border-b-4 border-[#46382b] bg-[repeating-linear-gradient(180deg,#e9f7e2_0_6px,#dff2d6_6px_12px)] p-4">
          <Gem colors={entry.gem} size={44} />
          <div className="min-w-0">
            <p className={`text-sm tracking-widest ${MUTED}`}>No. {number(entry.name)}</p>
            <p className="text-2xl leading-tight">{entry.name}</p>
            <p className="text-sm text-[#285943]">{entry.category}</p>
          </div>
        </div>
        <div className="space-y-5 p-4">
          <div>
            <p className={LABEL}>Description</p>
            <p className="mt-1 text-base leading-snug">{info.description}</p>
          </div>

          <div>
            <p className={LABEL}>Practical applications</p>
            {info.projects.length || info.experience.length ? (
              <ul className="mt-1.5 space-y-2">
                {info.projects.map((p) => (
                  <li key={p.title} className="text-base leading-snug">
                    {p.href ? (
                      <a
                        href={p.href}
                        {...(p.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="text-[#285943] underline underline-offset-2 hover:text-[#1c4031]"
                      >
                        ▶ {p.title}
                      </a>
                    ) : (
                      <span>▶ {p.title}</span>
                    )}
                    <span className={`block text-sm ${MUTED}`}>{p.summary}</span>
                  </li>
                ))}
                {info.experience.map((x) => (
                  <li key={x.organization} className="text-base leading-snug">
                    ▶ {x.organization}
                    <span className={`block text-sm ${MUTED}`}>{x.role}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`mt-1 text-base leading-snug ${MUTED}`}>Part of Krishi&apos;s toolkit. None of the projects on this site lists it in its stack yet.</p>
            )}
          </div>

          {info.related.length > 0 && (
            <div>
              <p className={LABEL}>Used alongside</p>
              <ul className="mt-1.5 flex flex-wrap gap-1.5">
                {info.related.map((t) => (
                  <li key={t} className={CHIP}>
                    {t}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </aside>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
      <div className="space-y-6" onKeyDown={onKey}>
        <p className={`text-base ${MUTED}`}>Select an entry to read its Skilldex page. Arrow keys move between entries.</p>
        {skillCategories.map((c, ci) => (
          <div key={c.id}>
            <h3 className={`${LABEL} flex items-center gap-2`}>
              <Gem colors={CATEGORY_GEMS[ci % CATEGORY_GEMS.length]} size={18} />
              {c.name}
              <span className="text-[#285943]">· {c.skills.length}</span>
            </h3>
            <ul className="mt-2.5 grid grid-cols-2 gap-2">
              {c.skills.map((s) => {
                const on = s === picked;
                return (
                  <li key={s}>
                    <button
                      ref={(el) => {
                        buttons.current[s] = el;
                      }}
                      type="button"
                      onClick={() => pick(s)}
                      aria-pressed={on}
                      aria-controls="skilldex-entry"
                      className={`flex h-full w-full items-center gap-2 border-2 border-[#46382b] px-2 py-2 text-left text-base sm:px-2.5 shadow-[2px_2px_0_#46382b] transition-[background-color,translate,box-shadow] duration-150 hover:-translate-y-px hover:shadow-[3px_3px_0_#46382b] motion-reduce:transition-none ${
                        on ? "bg-[#f5c65b]" : "bg-white hover:bg-[#fff1c4]"
                      }`}
                    >
                      <Gem colors={CATEGORY_GEMS[ci % CATEGORY_GEMS.length]} size={14} />
                      <span className="min-w-0 flex-1 leading-tight">{s}</span>
                      <span className={`text-sm ${MUTED}`}>{number(s)}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {!wide && c.skills.includes(picked) && <div className="mt-3">{detail}</div>}
          </div>
        ))}
      </div>

      {wide && detail}
    </div>
  );
}
