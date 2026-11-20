"use client";

import { useEffect, useState } from "react";

export const CLASSIC_SECTIONS = [
  { id: "profile", label: "Profile" },
  { id: "education", label: "Education" },
  { id: "skilldex", label: "Skilldex" },
  { id: "projects", label: "Projects" },
  { id: "experience", label: "Quest Log" },
  { id: "achievements", label: "Achievements" },
  { id: "contact", label: "Contact" },
] as const;

const SECTION_KEY = "krishi-world:classic-section";
const ENTRY_KEY = "krishi-world:entry";

/**
 * Classic Mode's menu: a sticky ▶ list on desktop and a chip row on phones. Highlights the section in view,
 * remembers it, and returns there on the next visit (switching modes never loses your place).
 */
export default function ClassicMenu() {
  const [active, setActive] = useState<string>("profile");

  useEffect(() => {
    try {
      localStorage.setItem(ENTRY_KEY, "classic");
      const saved = localStorage.getItem(SECTION_KEY);
      if (!location.hash && saved && saved !== "profile") document.getElementById(saved)?.scrollIntoView();
    } catch {
      // storage blocked: start at the top
    }
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries)
          if (e.isIntersecting) {
            setActive(e.target.id);
            try {
              localStorage.setItem(SECTION_KEY, e.target.id);
            } catch {
              // not remembered
            }
          }
      },
      { rootMargin: "-30% 0px -60% 0px" },
    );
    for (const s of CLASSIC_SECTIONS) {
      const el = document.getElementById(s.id);
      if (el) io.observe(el);
    }
    return () => io.disconnect();
  }, []);

  return (
    <nav aria-label="Portfolio sections" className="sticky top-0 z-20 sm:top-12 lg:top-24">
      {/* phones and tablets: a scrolling chip row */}
      <ul className="-mx-4 flex gap-2 overflow-x-auto bg-[#78b85a] px-4 py-2 sm:-mx-6 sm:px-6 lg:hidden">
        {CLASSIC_SECTIONS.map((s) => (
          <li key={s.id} className="shrink-0">
            <a
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
              className={`block border-2 border-[#46382b] px-2.5 py-0.5 text-sm shadow-[2px_2px_0_#46382b] ${active === s.id ? "bg-[#f5c65b]" : "bg-[#f5e8c8]"}`}
            >
              {s.label}
            </a>
          </li>
        ))}
      </ul>
      {/* desktop: the RPG pause-menu list */}
      <ul className="hidden border-4 border-[#46382b] bg-[#f5e8c8] p-2 text-[#2b2420] shadow-[6px_6px_0_#46382b] lg:block">
        {CLASSIC_SECTIONS.map((s) => (
          <li key={s.id}>
            <a
              href={`#${s.id}`}
              aria-current={active === s.id ? "true" : undefined}
              className={`flex items-center gap-2 px-2 py-1.5 text-lg ${active === s.id ? "bg-[#f5c65b]" : "hover:bg-[#fff1c4]"}`}
            >
              <span aria-hidden="true" className="w-3 text-[#285943]">
                {active === s.id ? "▶" : ""}
              </span>
              {s.label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
