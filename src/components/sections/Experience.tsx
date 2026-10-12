"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";
import SectionHeader from "@/components/ui/SectionHeader";
import { DUR, RISE } from "@/lib/motion";

// Framer equivalent of the shared GSAP EASE ("power3.out").
const EASE_OUT = [0.215, 0.61, 0.355, 1] as const;

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

  const shouldReduceMotion = useReducedMotion();
  const yVal = shouldReduceMotion ? 0 : RISE.item;
  const dur = (d: number) => (shouldReduceMotion ? 0 : d);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  const sync = (progress: number) => {
    setRevealedCount((prev) => Math.max(prev, revealedFor(progress)));
    if (progress >= 1) setFooterVisible(true);
  };

  useMotionValueEvent(scrollYProgress, "change", sync);

  // Check initial position on mount to prevent stuck animations
  useEffect(() => {
    requestAnimationFrame(() => sync(scrollYProgress.get()));
  }, [scrollYProgress]);

  const total = careerCommits.length;
  const done = revealedCount === total;

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
            <motion.span
              aria-hidden
              className="absolute left-[19px] top-0 bottom-0 w-px origin-top bg-rule"
              initial={{ scaleY: 0 }}
              animate={{ scaleY: revealedCount / total }}
              transition={{ duration: dur(DUR.slow), ease: EASE_OUT }}
            />
            {careerCommits.map((commit, idx) => {
              const isRevealed = revealedCount > idx;
              return (
                <motion.li
                  key={commit.hash}
                  initial={{ opacity: 0, y: yVal }}
                  animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: yVal }}
                  transition={{ duration: dur(DUR.standard), ease: EASE_OUT }}
                  style={{ pointerEvents: isRevealed ? "auto" : "none" }}
                  className="relative grid grid-cols-[5.5rem_1fr] gap-x-4 gap-y-1 border-b border-rule py-3 pl-6 last:border-b-0 transition-colors duration-150 hover:bg-bg-2 sm:grid-cols-[5.5rem_4.5rem_1fr]"
                >
                  <motion.span
                    aria-hidden
                    className={`absolute left-0 top-[1.1rem] h-[7px] w-[7px] rounded-full ${commit.isHead ? "bg-accent" : "border border-ink-faint bg-bg"}`}
                    initial={{ scale: 0 }}
                    animate={{ scale: isRevealed ? 1 : 0 }}
                    transition={{ duration: dur(DUR.quick), delay: dur(0.1), ease: EASE_OUT }}
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
                </motion.li>
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
