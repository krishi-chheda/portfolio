"use client";

import { useRef, useState, useEffect, useLayoutEffect } from "react";
import gsap from "gsap";
import SectionHeader from "@/components/ui/SectionHeader";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { DUR, EASE, RISE } from "@/lib/motion";

interface Commit {
  hash: string;
  date: string;
  type: string;
  scope: string;
  title: string;
  isHead?: boolean;
}

const careerCommits: Commit[] = [
  { hash: "HEAD", isHead: true, date: "PRESENT", type: "feat", scope: "current", title: "building next-generation AI products" },
  { hash: "v7p3a1c", date: "JUL 2026", type: "feat", scope: "leadership", title: "became Vice President @ MDAS" },
  { hash: "m2d7a9b", date: "JAN 2026", type: "feat", scope: "leadership", title: "promoted to Media & Marketing Director @ MDAS" },
  { hash: "o4k8m2d", date: "OCT 2025", type: "feat", scope: "leadership", title: "joined MDAS as Media & Marketing Officer" },
  { hash: "e5d8u2a", date: "JUL 2025", type: "feat", scope: "education", title: "started Master of AI @ Monash" },
  { hash: "s8t9d2h", date: "JAN–MAY 2025", type: "feat", scope: "product", title: "launched StudentHub" },
  { hash: "m1y9s8a", date: "JAN–MAY 2025", type: "feat", scope: "industry", title: "joined Mysahayak" },
  { hash: "t9a2f1c", date: "OCT–DEC 2024", type: "feat", scope: "ai", title: "built Traffic AI" }
];

// Commits reveal one by one between 25% and 100% scroll progress through the section
function revealedFor(progress: number) {
  const total = careerCommits.length;
  if (progress >= 1) return total;
  if (progress < 0.25) return 0;
  return Math.min(total - 1, Math.floor(((progress - 0.25) / 0.75) * (total - 1)) + 1);
}

export default function Experience() {
  const containerRef = useRef<HTMLElement>(null);
  const [revealedCount, setRevealedCount] = useState(0);
  const [footerVisible, setFooterVisible] = useState(false);

  const ctxRef = useRef<gsap.Context | null>(null);
  const animatedCount = useRef(0);
  const reduceMotion = useReducedMotion();

  // Scroll progress through the section: 0 when its top meets the viewport bottom, 1 when its bottom does.
  useEffect(() => {
    let frame = 0;
    const sync = () => {
      frame = 0;
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const progress = Math.min(1, Math.max(0, (window.innerHeight - rect.top) / rect.height));
      setRevealedCount((prev) => Math.max(prev, revealedFor(progress)));
      if (progress >= 1) setFooterVisible(true);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(sync);
    };
    onScroll(); // initial position check, scheduled via rAF
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  // One context for the section's lifetime, so in-flight tweens aren't reverted between reveals.
  useLayoutEffect(() => {
    ctxRef.current = gsap.context(() => {}, containerRef);
    return () => ctxRef.current?.revert();
  }, []);

  const total = careerCommits.length;
  const done = revealedCount === total;

  useLayoutEffect(() => {
    const from = animatedCount.current;
    animatedCount.current = revealedCount;
    if (reduceMotion || revealedCount <= from) return;
    ctxRef.current?.add(() => {
      const rows = gsap.utils.toArray<HTMLElement>("[data-commit]").slice(from, revealedCount);
      gsap.fromTo(rows, { opacity: 0, y: RISE.item }, { opacity: 1, y: 0, duration: DUR.standard, ease: EASE });
      gsap.fromTo(
        rows.map((row) => row.querySelector("[data-dot]")),
        { scale: 0 },
        { scale: 1, duration: DUR.quick, delay: 0.1, ease: EASE }
      );
      gsap.to("[data-rail]", { scaleY: revealedCount / total, duration: DUR.slow, ease: EASE, overwrite: "auto" });
    });
  }, [revealedCount, reduceMotion, total]);

  return (
    <section id="career" ref={containerRef} className="py-24 border-t border-rule">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader num="02" title="Career" command="git log --oneline career/" meta="melbourne, au" />

        <div className="border border-rule terminal-highlight">
          {/* Status bar */}
          <div className="flex items-center justify-between gap-4 border-b border-rule bg-bg-2 px-4 py-2 text-[11px] uppercase tracking-[0.18em] text-ink-faint select-none">
            <span>career.git</span>
            <span className="flex items-center gap-2" aria-live="polite">
              <span className={`h-1.5 w-1.5 rounded-full ${done ? "bg-accent" : "bg-gold"}`} />
              {done ? (
                <span className="text-accent">Career history synchronized ✓</span>
              ) : (
                <span>Loading commits... {revealedCount}/{total}</span>
              )}
            </span>
          </div>

          {/* Oneline log */}
          <ol className="relative px-4 text-sm">
            {/* Rail draws down as commits reveal */}
            <span
              aria-hidden
              data-rail
              className="absolute left-[19px] top-0 bottom-0 w-px origin-top bg-rule"
              style={reduceMotion ? undefined : { transform: "scaleY(0)" }}
            />
            {careerCommits.map((commit, idx) => {
              const isRevealed = revealedCount > idx;
              return (
                <li
                  key={commit.hash}
                  data-commit
                  // Hidden only while motion is allowed; React drops the opacity once revealed, so rows can't stick invisible.
                  style={isRevealed || reduceMotion ? undefined : { opacity: 0, pointerEvents: "none" }}
                  className="relative grid grid-cols-[5.5rem_1fr] gap-x-4 gap-y-1 border-b border-rule py-3 pl-6 last:border-b-0 transition-colors duration-150 hover:bg-bg-2 sm:grid-cols-[5.5rem_4.5rem_1fr]"
                >
                  <span
                    aria-hidden
                    data-dot
                    className={`absolute left-0 top-[1.1rem] h-[7px] w-[7px] rounded-full ${commit.isHead ? "bg-accent" : "border border-ink-faint bg-bg"}`}
                  />
                  <span className="text-[11px] uppercase tracking-[0.18em] text-ink-faint leading-5">{commit.date}</span>
                  <span className={`hidden sm:block leading-5 ${commit.isHead ? "text-accent font-bold" : "text-ink-faint"}`}>
                    {commit.hash}
                  </span>
                  <span className="col-span-2 col-start-1 min-w-0 leading-5 sm:col-span-1 sm:col-start-auto">
                    <span className="text-accent">{commit.type}</span>
                    <span className="text-ink-faint">({commit.scope}):</span>{" "}
                    <span className={commit.isHead ? "text-accent font-bold" : "text-ink"}>{commit.title}</span>
                    {commit.isHead && (
                      <span className="ml-2 text-[11px] text-ink-faint sm:hidden">HEAD</span>
                    )}
                  </span>
                </li>
              );
            })}
          </ol>

          {/* Synchronized footer */}
          <div
            style={{ opacity: footerVisible ? 1 : 0, transition: "opacity 300ms cubic-bezier(0.215, 0.61, 0.355, 1)" }}
            className="flex items-center gap-2 border-t border-rule px-4 py-3 text-[11px] uppercase tracking-[0.18em] text-accent select-none"
          >
            <span>[ok] career history synchronized</span>
            <span className="h-3 w-1.5 bg-accent" aria-hidden />
          </div>
        </div>
      </div>
    </section>
  );
}
