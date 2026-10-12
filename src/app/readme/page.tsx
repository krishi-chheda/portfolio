"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, Terminal, ExternalLink } from "lucide-react";
import { SYSTEM_VERSION } from "@/lib/data";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useTerminalReveal } from "@/hooks/useTerminalReveal";

const h2 = "text-accent text-[11px] md:text-xs uppercase tracking-[0.18em] font-normal border-l-2 border-accent pl-2";
const body = "text-ink-soft text-sm space-y-4 pl-3";
const tile = "border border-rule bg-bg-2 p-4 flex flex-col justify-between group transition-colors duration-150 hover:border-accent";
const tileLink = "text-ink hover:text-accent transition-colors duration-150 flex items-center gap-1 text-sm text-left cursor-pointer";
const tileMeta = "text-[11px] text-ink-faint select-none";
const tileDesc = "text-ink-soft text-xs mt-2 leading-relaxed";
const label = "text-ink-faint text-[11px] uppercase tracking-[0.18em]";

const openSource = [
  {
    name: "AuraLens AI",
    href: "https://github.com/krishi-chheda/AuraLens-AI",
    meta: "CLIP + ChromaDB",
    desc: "Local Streamlit photography culling assistant using Laplacian variance and CLIP semantic vector search in ChromaDB.",
  },
  {
    name: "F1 Telemetry AI Suite",
    href: "https://github.com/krishi-chheda/f1-telemetry-ai-dashboard",
    meta: "Next.js + Pandas",
    desc: "Formula 1 telemetry dashboard and data parser analyzing lap logs, driver inputs, and speed sectors on 2D track maps.",
  },
  {
    name: "BP Prediction API",
    href: "https://github.com/krishi-chheda/fastapi_backend",
    meta: "FastAPI + ML",
    desc: "Facial video analysis API predicting blood pressure metrics via color Photoplethysmography (PPG) and Scikit-learn regressors.",
  },
  {
    name: "Video Splitter Pro",
    href: "https://github.com/krishi-chheda/video-splitter",
    meta: "Python + FFmpeg",
    desc: "Streamlit media processing utility for fast custom timestamp video splitting and audio track extraction.",
  },
];

const stack = ["Next.js 16 (App Router)", "React 19", "TypeScript", "Tailwind CSS v4", "GSAP 3", "Lucide Icons"];

const principles = [
  ["Curiosity over Decoration:", "Every visual element serves an interactive purpose. If it doesn't respond to user action, it doesn't belong in the core interface."],
  ["Interaction over Presentation:", "Showing how a system behaves under user input is always more valuable than displaying static images of the final state."],
  ["Systems Thinking:", "Problems are rarely isolated. They are loops and nodes in a wider network. KRISHI.OS reflects this by framing career, projects, and skills as a connected topology."],
  ["Solving Real-World Problems:", "Code is a tool, not the goal. Whether managing traffic density, clinical notes, or university services, software must address concrete user pain points."],
  ["Building Products People Use:", "Code must run in production. Developing high-utility tools is the primary directive."],
];

const future = [
  ["Richer AI Digital Twin:", "Expanding context window grounding and multi-turn capabilities."],
  ["Deeper Project Playgrounds:", "Supporting inline interactive runtime environments for core repositories."],
  ["Process Monitor Visualisations:", "Integrating live system telemetry tracking into the System Topology."],
  ["Continuous Iteration:", "Refactoring libraries and shipping tools alongside my Master's research."],
];

export default function ReadmePage() {
  const [typedLength, setTypedLength] = useState(0);
  const [showCursor, setShowCursor] = useState(true);
  const targetCommand = "cat README.md";
  const prefersReducedMotion = useReducedMotion();
  const revealRef = useTerminalReveal<HTMLElement>();
  const typedCommand = prefersReducedMotion ? targetCommand : targetCommand.slice(0, typedLength);

  // Typewriter effect for the command prompt
  useEffect(() => {
    if (prefersReducedMotion || typedLength >= targetCommand.length) return;
    const timerId = setTimeout(() => setTypedLength((n) => n + 1), 100);
    return () => clearTimeout(timerId);
  }, [prefersReducedMotion, typedLength]);

  // Blinking cursor
  useEffect(() => {
    if (prefersReducedMotion) return;
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, [prefersReducedMotion]);

  const navGuide = [
    {
      name: "./projects",
      command: "cat projects/overview.md",
      desc: "Explore products and technical work.",
      href: "/#projects",
    },
    {
      name: "./career",
      command: "git log --career",
      desc: "View my journey as a Git history.",
      href: "/#career",
    },
    {
      name: "./leadership",
      command: "cat leadership.md",
      desc: "Community building and student impact.",
      href: "/#leadership",
    },
    {
      name: "./currently-building",
      command: "tail -f currently-building.log",
      desc: "See what I'm actively working on.",
      href: "/#currently-building",
    },
    {
      name: "./system-map",
      command: "open system-map",
      desc: "Understand how my domains connect.",
      href: "/#system-map",
    },
    {
      name: "./ask-krishi",
      command: "./ask-krishi",
      desc: "Chat with an AI assistant grounded in my portfolio data.",
      href: "/?chat=1",
    },
  ];

  return (
    <>
      <Navbar />
      <main ref={revealRef} className="relative flex-1 pt-28 pb-16 overflow-x-hidden font-mono">
        <div className="max-w-4xl mx-auto px-6 w-full relative z-10">
          {/* Back Nav */}
          <Link
            href="/"
            className="inline-flex items-center gap-1.5 text-[11px] uppercase tracking-[0.18em] text-ink-faint hover:text-accent transition-colors duration-150 mb-6 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Console</span>
          </Link>

          {/* Terminal window */}
          <div data-reveal="panel" className="bg-bg border border-rule flex flex-col w-full text-ink-soft text-sm leading-relaxed mb-8">
            {/* Title bar */}
            <div className="bg-bg-2 px-4 py-3 flex items-center justify-between gap-4 border-b border-rule select-none text-[11px] text-ink-faint">
              <div className="tracking-wider flex items-center gap-1.5 min-w-0">
                <Terminal size={11} className="text-accent shrink-0" />
                <span className="truncate">man_reader tty0 // /usr/man/readme.md</span>
              </div>
              <div className="flex items-center gap-1.5 shrink-0">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span>SYS_ONLINE</span>
              </div>
            </div>

            {/* Body */}
            <div className="p-6 md:p-10 space-y-10 overflow-x-auto">
              {/* Prompt */}
              <div className="flex items-center gap-2 text-xs border-b border-rule pb-4 text-ink-soft">
                <span className="text-accent">krishi@stack:~$</span>
                <span className="text-ink select-none">{typedCommand}</span>
                <span
                  className="w-1.5 h-4 bg-accent inline-block align-middle transition-opacity duration-100"
                  style={{ opacity: showCursor ? 1 : 0 }}
                />
              </div>

              {/* Header */}
              <div data-reveal="item" className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-rule pb-6 gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-ink tracking-tight flex items-center gap-3">
                    KRISHI.OS
                    <span className="text-[11px] border border-accent text-accent px-2 py-0.5 font-normal tracking-normal">
                      {SYSTEM_VERSION}
                    </span>
                  </h1>
                  <p className={`${label} mt-2`}>DEVELOPER MANUAL &amp; ONBOARDING SCHEMATIC</p>
                </div>
                <div className="text-left md:text-right text-[11px] uppercase tracking-[0.18em] text-ink-faint space-y-1">
                  <div>
                    AUTHOR: <span className="text-ink">KRISHI CHHEDA</span>
                  </div>
                  <div className="flex items-center gap-1.5 md:justify-end">
                    STATUS:
                    <span className="inline-flex items-center gap-1.5 text-accent">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                      ONLINE
                    </span>
                  </div>
                </div>
              </div>

              {/* MISSION */}
              <section data-reveal="item" className="space-y-3">
                <h2 className={h2}>1. MISSION</h2>
                <div className={body}>
                  <p>
                    KRISHI.OS exists because traditional portfolios fail to represent the reality of building software. A standard PDF resume or a static portfolio site represents a developer as a list of bullet points and static screenshots. But software is alive. It is a system of inputs, outputs, states, and logic.
                  </p>
                  <p>
                    I built this operating-system-inspired portfolio to give visitors a sandbox to interact with, rather than just scroll through. It is a direct reflection of my philosophy: we understand systems by interacting with them, not by reading about them. Every module, CLI command, and custom visualization here is designed to be pushed, probed, and explored.
                  </p>
                </div>
              </section>

              {/* DESIGN PHILOSOPHY */}
              <section data-reveal="item" className="space-y-3">
                <h2 className={h2}>2. DESIGN PHILOSOPHY</h2>
                <div className={body}>
                  <p>KRISHI.OS is engineered with a clean, low-latency, and high-agency interaction blueprint:</p>
                  <ul className="space-y-3 list-none">
                    {principles.map(([title, text]) => (
                      <li key={title} className="flex items-start gap-2">
                        <span className="text-accent shrink-0">➔</span>
                        <span>
                          <strong className="text-ink font-semibold">{title}</strong> {text}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </section>

              {/* NAVIGATION GUIDE */}
              <section data-reveal="item" className="space-y-3">
                <h2 className={h2}>3. NAVIGATION GUIDE</h2>
                <p className="text-ink-soft text-xs pl-3">
                  Click on any link below to instantly execute the navigation command and navigate to the module:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-3 pt-2">
                  {navGuide.map((item) => (
                    <div key={item.name} className={tile}>
                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <Link href={item.href} className={tileLink}>
                            <span>{item.name}</span>
                            <ExternalLink size={11} className="text-ink-faint" />
                          </Link>
                          <span className={`${tileMeta} hidden group-hover:inline`}>{item.command}</span>
                        </div>
                        <p className={tileDesc}>{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ADDITIONAL OPEN SOURCE WORK */}
              <section data-reveal="item" className="space-y-3">
                <h2 className={h2}>3.5. ADDITIONAL OPEN SOURCE WORK</h2>
                <p className="text-ink-soft text-xs pl-3">Explore other developer projects, utilities, and integrations:</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-3 pt-2">
                  {openSource.map((p) => (
                    <div key={p.name} className={tile}>
                      <div>
                        <div className="flex items-center justify-between gap-3">
                          <a href={p.href} target="_blank" rel="noopener noreferrer" className={tileLink}>
                            <span>{p.name}</span>
                            <ExternalLink size={11} className="text-ink-faint" />
                          </a>
                          <span className={tileMeta}>{p.meta}</span>
                        </div>
                        <p className={`${tileDesc} select-text`}>{p.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* TECH STACK */}
              <section data-reveal="item" className="space-y-3">
                <h2 className={h2}>4. TECH STACK</h2>
                <div className="text-ink-soft text-sm pl-3 space-y-2">
                  <p>KRISHI.OS is built from the ground up as a responsive, server-side rendered application leveraging:</p>
                  <div className="flex flex-wrap gap-2 pt-1 text-[11px]">
                    {stack.map((s) => (
                      <span key={s} className="border border-rule text-ink-soft px-2 py-0.5">
                        {s}
                      </span>
                    ))}
                  </div>
                </div>
              </section>

              {/* CURRENT STATUS */}
              <section data-reveal="item" className="space-y-3">
                <h2 className={h2}>5. CURRENT STATUS</h2>
                <div className="border border-rule bg-bg-2 p-4 ml-3 text-sm">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className={label}>STATUS</div>
                      <div className="text-accent mt-0.5">ONLINE</div>
                    </div>
                    <div>
                      <div className={label}>LOCATION</div>
                      <div className="text-ink mt-0.5">Melbourne, VIC</div>
                    </div>
                    <div>
                      <div className={label}>GRADUATION</div>
                      <div className="text-ink mt-0.5">July 2027</div>
                    </div>
                    <div>
                      <div className={label}>GRADUATE TARGET</div>
                      <div className="text-accent mt-0.5">Open to Ops</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* FUTURE DIRECTION */}
              <section data-reveal="item" className="space-y-3">
                <h2 className={h2}>6. FUTURE DIRECTION</h2>
                <ul className="text-ink-soft text-sm pl-3 space-y-2 list-none">
                  {future.map(([title, text]) => (
                    <li key={title} className="flex items-start gap-2">
                      <span className="text-accent">•</span>
                      <span>
                        <strong className="text-ink font-semibold">{title}</strong> {text}
                      </span>
                    </li>
                  ))}
                </ul>
              </section>

              {/* Closing */}
              <div data-reveal="item" className="border-t border-rule pt-6 mt-8 text-xs text-ink-faint space-y-2 text-center md:text-left">
                <p className="text-ink-soft">Thanks for exploring KRISHI.OS.</p>
                <p>
                  Every feature on this site exists because I enjoy building systems that people can interact with—not just look at.
                </p>
                <p className="text-accent tracking-[0.18em] pt-2">{"// SEE YOU IN THE TERMINAL."}</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
}
