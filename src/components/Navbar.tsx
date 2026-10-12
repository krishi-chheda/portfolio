"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import CommandPalette from "@/components/ui/CommandPalette";
import { SYSTEM_VERSION } from "@/lib/data";

const NAV_LINKS = [
  { id: "projects", label: "projects" },
  { id: "career", label: "career" },
  { id: "leadership", label: "leadership" },
  { id: "currently-building", label: "building" },
  { id: "system-map", label: "system-map" },
  { id: "contact", label: "contact" },
];

function utcTime() {
  return new Date().toISOString().slice(11, 19);
}

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);
  const [active, setActive] = useState("");
  const [clock, setClock] = useState("");
  const progressRef = useRef<HTMLDivElement>(null);

  // Ctrl/Cmd+K toggles the command palette
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // UTC clock, client-only so server and client markup match
  useEffect(() => {
    const tick = () => setClock(utcTime());
    const id = setInterval(tick, 1000);
    tick();
    return () => clearInterval(id);
  }, []);

  // Scroll-progress line: a direct readout of position (no tween), throttled to one update per frame
  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      const el = progressRef.current;
      if (!el) return;
      const max = document.documentElement.scrollHeight - window.innerHeight;
      el.style.transform = `scaleX(${max > 0 ? Math.min(1, window.scrollY / max) : 0})`;
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    onScroll();
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  // Track which section is in the middle of the viewport
  useEffect(() => {
    // Hero is observed too, so scrolling back to the top clears the active link (shown as "ready")
    const sections = ["hero", ...NAV_LINKS.map((l) => l.id)]
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => el !== null);
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) setActive(entry.target.id === "hero" ? "" : entry.target.id);
        }
      },
      { rootMargin: "-45% 0px -50% 0px" }
    );
    sections.forEach((s) => observer.observe(s));
    return () => observer.disconnect();
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-bg/85 backdrop-blur-md border-b border-rule">
      <div
        ref={progressRef}
        aria-hidden="true"
        className="absolute -bottom-px left-0 right-0 h-px origin-left bg-accent shadow-[0_0_8px_var(--color-accent)]"
        style={{ transform: "scaleX(0)" }}
      />
      <div className="mx-auto max-w-6xl px-6 h-12 flex items-center justify-between gap-4 text-[11px]">
        {/* Left: identity + current path */}
        <div className="flex items-center gap-4 min-w-0">
          <Link href="/" className="font-bold text-ink hover:text-accent transition-colors duration-150 shrink-0">
            <span className="text-accent">{"//"}</span> krishi.os
          </Link>
          <span className="hidden sm:inline text-ink-faint">{SYSTEM_VERSION}</span>
          <span className="hidden sm:inline text-ink-faint truncate">{active ? `~/${active}` : "ready"}</span>
        </div>

        {/* Center: section links */}
        <nav aria-label="Sections" className="hidden lg:flex items-center gap-5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.id}
              href={`/#${link.id}`}
              aria-current={active === link.id ? "true" : undefined}
              className={`relative py-1 transition-colors duration-150 ${
                active === link.id ? "text-accent" : "text-ink-soft hover:text-ink"
              }`}
            >
              {link.label}
              {active === link.id && <span className="absolute -bottom-0.5 left-0 right-0 h-px bg-accent" />}
            </Link>
          ))}
        </nav>

        {/* Right: palette + clock + mobile menu */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            type="button"
            onClick={() => setIsPaletteOpen(true)}
            className="border border-rule px-2 py-1 text-ink-soft hover:text-accent hover:border-accent transition-colors duration-150 cursor-pointer"
            aria-label="Open command palette"
          >
            ⌘K
          </button>
          <span className="hidden md:inline text-ink-faint tabular-nums">{clock && `${clock} UTC`}</span>
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            className="lg:hidden border border-rule px-2 py-1 text-ink-soft hover:text-accent hover:border-accent transition-colors duration-150 cursor-pointer"
            aria-expanded={menuOpen}
            aria-controls="mobile-nav"
          >
            {menuOpen ? "close" : "menu"}
          </button>
        </div>
      </div>

      {/* Mobile section list */}
      {menuOpen && (
        <nav id="mobile-nav" aria-label="Sections" className="lg:hidden border-t border-rule bg-bg px-6 py-4 text-xs">
          <div className="text-ink-faint mb-3">
            <span className="text-accent">krishi@stack:~$</span> ls -la
          </div>
          <ul className="space-y-1">
            {NAV_LINKS.map((link) => (
              <li key={link.id}>
                <Link
                  href={`/#${link.id}`}
                  onClick={() => setMenuOpen(false)}
                  className="flex gap-4 py-1.5 text-ink-soft hover:text-accent transition-colors duration-150"
                >
                  <span className="text-ink-faint">drwxr-xr-x</span>
                  <span>{link.label}/</span>
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}

      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </header>
  );
}
