"use client";

import { useRef, useState, useEffect } from "react";
import { motion, useScroll, useMotionValueEvent, useReducedMotion } from "framer-motion";

interface Commit {
  hash: string;
  date: string;
  type: string;
  scope: string;
  title: string;
  isHead?: boolean;
}

const careerCommits: Commit[] = [
  {
    hash: "HEAD",
    isHead: true,
    date: "PRESENT",
    type: "feat",
    scope: "current",
    title: "building next-generation AI products"
  },
  {
    hash: "m2d7a9b",
    date: "2026",
    type: "feat",
    scope: "leadership",
    title: "became Media & Marketing Director @ MDAS"
  },
  {
    hash: "m1y9s8a",
    date: "2025",
    type: "feat",
    scope: "industry",
    title: "joined Mysahayak"
  },
  {
    hash: "s8t9d2h",
    date: "2025",
    type: "feat",
    scope: "product",
    title: "launched StudentHub"
  },
  {
    hash: "t9a2f1c",
    date: "2025",
    type: "feat",
    scope: "ai",
    title: "built Traffic AI"
  },
  {
    hash: "e5d8u2a",
    date: "2025",
    type: "feat",
    scope: "education",
    title: "started Master of AI @ Monash"
  }
];

const GitGraphNode = ({ index, total, isNextRevealed }: { index: number; total: number; isNextRevealed: boolean }) => {
  // Linear vertical timeline rail SVG
  return (
    <svg className="absolute inset-0 w-full h-full" xmlns="http://www.w3.org/2000/svg">
      {/* Draw line */}
      {index < total - 1 && (
        <line
          x1="16"
          y1="24"
          x2="16"
          y2="100%"
          stroke={isNextRevealed ? "#1e293b" : "transparent"}
          strokeWidth="2"
          style={{ transition: "stroke 0.3s ease" }}
        />
      )}
      {index > 0 && (
        <line x1="16" y1="0" x2="16" y2="24" stroke="#1e293b" strokeWidth="2" />
      )}

      {/* Commit dot */}
      <circle
        cx="16"
        cy="24"
        r={index === 0 ? "5.5" : "5"}
        fill={index === 0 ? "#10b981" : "#0ea5e9"}
        className={index === 0 ? "animate-pulse" : ""}
      />
    </svg>
  );
};

export default function Experience() {
  const containerRef = useRef<HTMLDivElement>(null);
  
  // States for terminal streaming
  const [headerVisible, setHeaderVisible] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const [footerVisible, setFooterVisible] = useState(false);
  
  const shouldReduceMotion = useReducedMotion();
  const yVal = shouldReduceMotion ? 0 : 10;
  
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end end"]
  });

  useMotionValueEvent(scrollYProgress, "change", (latest) => {
    if (latest >= 0.10) {
      setHeaderVisible(true);
    }
    
    let currentCount = 0;
    if (latest >= 1.00) {
      currentCount = 6;
    } else if (latest >= 0.85) {
      currentCount = 5;
    } else if (latest >= 0.70) {
      currentCount = 4;
    } else if (latest >= 0.55) {
      currentCount = 3;
    } else if (latest >= 0.40) {
      currentCount = 2;
    } else if (latest >= 0.25) {
      currentCount = 1;
    }
    
    setRevealedCount((prev) => Math.max(prev, currentCount));
    
    if (latest >= 1.00) {
      setFooterVisible(true);
    }
  });

  // Check initial position on mount to prevent stuck animations
  useEffect(() => {
    requestAnimationFrame(() => {
      const initialProgress = scrollYProgress.get();
      if (initialProgress >= 0.10) {
        setHeaderVisible(true);
      }
      
      let currentCount = 0;
      if (initialProgress >= 1.00) {
        currentCount = 6;
        setFooterVisible(true);
      } else if (initialProgress >= 0.85) {
        currentCount = 5;
      } else if (initialProgress >= 0.70) {
        currentCount = 4;
      } else if (initialProgress >= 0.55) {
        currentCount = 3;
      } else if (initialProgress >= 0.40) {
        currentCount = 2;
      } else if (initialProgress >= 0.25) {
        currentCount = 1;
      }
      
      setRevealedCount((prev) => Math.max(prev, currentCount));
    });
  }, [scrollYProgress]);

  return (
    <section id="career" ref={containerRef} className="py-24 relative overflow-hidden border-t border-slate-900/60 select-none">
      <div className="max-w-4xl mx-auto px-6">

        {/* Section Header CLI Prompt */}
        <div className="font-mono text-xs md:text-sm text-slate-500 mb-8 flex items-center space-x-2 select-none">
          <span className="text-[#10b981]">krishi@stack:~$</span>
          <span className="text-slate-100">git log --career</span>
        </div>

        {/* Git Log Console Window */}
        <div className="w-full border border-slate-900 bg-slate-950/20 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono terminal-highlight">

          {/* Title Bar */}
          <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-900 flex justify-between items-center select-none text-[10px] text-slate-500">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/40 border border-red-500/20" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/40 border border-yellow-500/20" />
              <span className="w-2 h-2 rounded-full bg-green-500/40 border border-green-500/20" />
            </div>
            <span className="font-mono text-slate-400">
              {revealedCount === 6 ? (
                <span className="text-emerald-500">Career history synchronized ✓</span>
              ) : (
                <span>Loading commits... {revealedCount}/6</span>
              )}
            </span>
            <div className="flex items-center space-x-2">
              <span className={`w-1.5 h-1.5 rounded-full ${revealedCount === 6 ? "bg-emerald-500" : "bg-amber-500"} animate-pulse`} />
              <span>bash</span>
            </div>
          </div>

          {/* Window Body */}
          <div className="p-6 md:p-8 select-text text-xs md:text-sm">
            
            {/* Git Metadata Header */}
            <div 
              style={{
                opacity: headerVisible ? 1 : 0,
                transition: "opacity 0.4s ease-in-out",
                pointerEvents: headerVisible ? "auto" : "none"
              }}
              className="mb-8 font-mono text-slate-400 space-y-1 text-xs select-none"
            >
              <div><span className="text-emerald-500 font-bold">HEAD {"->"} main</span></div>
              <div className="text-slate-500">origin/main</div>
              <div className="text-slate-500">origin/HEAD</div>
              <div className="pt-2 text-slate-350">Current branch: <span className="text-emerald-400">main</span></div>
              <div className="text-slate-350">Repository: <span className="text-slate-400">career.git</span></div>
            </div>

            {/* The Git Graph Log List */}
            <div className="space-y-10 relative">
              {careerCommits.map((commit, idx) => {
                const isRevealed = revealedCount > idx;
                return (
                  <motion.div
                    key={commit.hash}
                    initial={{ opacity: 0, y: yVal }}
                    animate={isRevealed ? { opacity: 1, y: 0 } : { opacity: 0, y: yVal }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    style={{
                      pointerEvents: isRevealed ? "auto" : "none"
                    }}
                    className="flex gap-4 md:gap-6 relative"
                  >
                    {/* Left Git Graph Rail */}
                    <div className="w-10 shrink-0 relative flex justify-center">
                      <GitGraphNode 
                        index={idx} 
                        total={careerCommits.length} 
                        isNextRevealed={revealedCount > idx + 1}
                      />
                    </div>

                    {/* Right Commit Card */}
                    <div className="flex-1 min-w-0 pb-4 space-y-1">
                      {/* Commit Identification Header */}
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-amber-500 font-bold font-mono">commit {commit.hash}</span>
                        {commit.isHead && (
                          <span className="text-emerald-500 font-bold text-[10px] md:text-xs font-mono">
                            (HEAD {"->"} main, origin/main, origin/HEAD)
                          </span>
                        )}
                      </div>

                      {/* Commit Metadata details */}
                      <div className="text-slate-500 text-[11px] font-mono leading-none">
                        Author: Krishi Chheda &lt;krishichheda10@gmail.com&gt;
                      </div>
                      <div className="text-slate-500 text-[11px] font-mono leading-none">
                        Date: {commit.date}
                      </div>

                      {/* Commit Title Message */}
                      <div className="pt-2 text-slate-100 font-mono font-bold text-xs md:text-sm">
                        {commit.type}({commit.scope}): {commit.title}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Synchronized Message */}
            <div
              style={{
                opacity: footerVisible ? 1 : 0,
                transition: "opacity 0.4s ease-in-out",
                pointerEvents: footerVisible ? "auto" : "none"
              }}
              className="mt-6 flex items-center space-x-1.5 text-emerald-500 font-mono select-none"
            >
              <span>[ok] career history synchronized</span>
              <span className="w-1.5 h-3.5 bg-emerald-500 animate-blink" />
            </div>

            {/* Command: git status */}
            <div 
              style={{
                opacity: footerVisible ? 1 : 0,
                transition: "opacity 0.4s ease-in-out",
                pointerEvents: footerVisible ? "auto" : "none"
              }}
              className="mt-12 pt-6 border-t border-slate-900 space-y-4"
            >
              <div className="flex items-center space-x-2 text-slate-500 select-none">
                <span className="text-[#10b981]">krishi@stack:~$</span>
                <span className="text-slate-300">git status</span>
              </div>
              
              <div className="font-mono text-xs md:text-sm text-slate-400 pl-4 border-l border-slate-900/60 py-1 space-y-1.5 select-text">
                <div>On branch <span className="text-emerald-400 font-bold">main</span></div>
                <div>Your branch is up to date with &apos;origin/main&apos;.</div>
                <div className="text-slate-500 pt-1">nothing to commit, working tree clean</div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
