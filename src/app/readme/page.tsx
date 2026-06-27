"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowLeft, Terminal, Shield, Cpu, ExternalLink, Activity } from "lucide-react";
import GridBackground from "@/components/ui/GridBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function ReadmePage() {
  const [typedCommand, setTypedCommand] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const targetCommand = "cat README.md";

  // Typewriter effect for the command prompt
  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      if (index < targetCommand.length) {
        setTypedCommand((prev) => prev + targetCommand.charAt(index));
        index++;
      } else {
        clearInterval(interval);
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);

  // Blinking cursor
  useEffect(() => {
    const cursorInterval = setInterval(() => {
      setShowCursor((prev) => !prev);
    }, 500);
    return () => clearInterval(cursorInterval);
  }, []);

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
      desc: "Chat directly with an AI trained on my experience.",
      action: () => {
        window.location.href = "/";
        setTimeout(() => {
          window.dispatchEvent(new CustomEvent("open-ai-chat"));
        }, 800);
      },
    },
  ];

  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-28 pb-16 flex flex-col justify-between overflow-x-hidden">
        {/* Background Visual Layout */}
        <GridBackground />

        <div className="max-w-4xl mx-auto px-6 w-full relative z-10">
          {/* Back Nav */}
          <Link
            href="/"
            className="inline-flex items-center space-x-1.5 text-xs font-mono text-slate-500 hover:text-[#10b981] transition-colors mb-6 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Console</span>
          </Link>

          {/* Terminal Window Card wrapper */}
          <div className="bg-[#0b101c]/90 border border-slate-900 rounded-xl overflow-hidden shadow-2xl flex flex-col w-full text-slate-300 font-mono text-sm leading-relaxed mb-8">
            {/* Terminal Title Bar Controls */}
            <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-900 select-none">
              <div className="flex items-center space-x-2">
                <span className="w-3 h-3 rounded-full bg-[#ef4444]/80" />
                <span className="w-3 h-3 rounded-full bg-[#f59e0b]/80" />
                <span className="w-3 h-3 rounded-full bg-[#10b981]/80" />
              </div>
              <div className="text-[10px] text-slate-500 tracking-wider flex items-center gap-1.5">
                <Terminal size={10} className="text-slate-650" />
                <span>man_reader tty0 // /usr/man/readme.md</span>
              </div>
              <div className="flex items-center space-x-1.5 text-[9px] text-slate-500">
                <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                <span>SYS_ONLINE</span>
              </div>
            </div>

            {/* Terminal Body */}
            <div className="p-6 md:p-10 space-y-8 bg-gradient-to-b from-transparent to-[#080d16]/30 overflow-x-auto">
              
              {/* Top Prompt Display */}
              <div className="flex items-center space-x-2 text-xs border-b border-slate-900/50 pb-4 text-slate-400">
                <span className="text-[#10b981]">krishi@stack:~$</span>
                <span className="text-white font-bold select-none">{typedCommand}</span>
                <span
                  className="w-1.5 h-4 bg-[#10b981] inline-block align-middle transition-opacity duration-100"
                  style={{ opacity: showCursor ? 1 : 0 }}
                />
              </div>

              {/* Header Info */}
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-slate-900 pb-6 gap-4">
                <div>
                  <h1 className="text-2xl md:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
                    KRISHI.OS
                    <span className="text-xs bg-[#10b981]/10 border border-[#10b981]/30 text-[#10b981] px-2 py-0.5 rounded font-mono font-medium">
                      v0.1.0-stable
                    </span>
                  </h1>
                  <p className="text-slate-400 text-xs mt-1.5">
                    DEVELOPER MANUAL & ONBOARDING SCHEMATIC
                  </p>
                </div>
                <div className="text-left md:text-right text-[11px] text-slate-400 space-y-1">
                  <div><strong>AUTHOR:</strong> KRISHI CHHEDA</div>
                  <div className="flex items-center gap-1 md:justify-end">
                    <strong>STATUS:</strong>
                    <span className="inline-flex items-center gap-1 text-[#10b981] font-bold">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                      ONLINE
                    </span>
                  </div>
                </div>
              </div>

              {/* MISSION */}
              <section className="space-y-3">
                <h2 className="text-[#10b981] font-bold uppercase tracking-wider flex items-center gap-1.5 border-l-2 border-[#10b981] pl-2 text-xs md:text-sm">
                  1. MISSION
                </h2>
                <div className="text-slate-300 text-xs md:text-sm space-y-4 pl-3">
                  <p>
                    KRISHI.OS exists because traditional portfolios fail to represent the reality of building software. A standard PDF resume or a static portfolio site represents a developer as a list of bullet points and static screenshots. But software is alive. It is a system of inputs, outputs, states, and logic.
                  </p>
                  <p>
                    I built this operating-system-inspired portfolio to give visitors a sandbox to interact with, rather than just scroll through. It is a direct reflection of my philosophy: we understand systems by interacting with them, not by reading about them. Every module, CLI command, and custom visualization here is designed to be pushed, probed, and explored.
                  </p>
                </div>
              </section>

              {/* DESIGN PHILOSOPHY */}
              <section className="space-y-3">
                <h2 className="text-[#10b981] font-bold uppercase tracking-wider flex items-center gap-1.5 border-l-2 border-[#10b981] pl-2 text-xs md:text-sm">
                  2. DESIGN PHILOSOPHY
                </h2>
                <div className="text-slate-300 text-xs md:text-sm space-y-4 pl-3">
                  <p>
                    KRISHI.OS is engineered with a clean, low-latency, and high-agency interaction blueprint:
                  </p>
                  <ul className="space-y-3 list-none">
                    <li className="flex items-start gap-2">
                      <span className="text-[#10b981] shrink-0 font-bold">➔</span>
                      <span>
                        <strong className="text-white">Curiosity over Decoration:</strong> Every visual element serves an interactive purpose. If it doesn&apos;t respond to user action, it doesn&apos;t belong in the core interface.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#10b981] shrink-0 font-bold">➔</span>
                      <span>
                        <strong className="text-white">Interaction over Presentation:</strong> Showing how a system behaves under user input is always more valuable than displaying static images of the final state.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#10b981] shrink-0 font-bold">➔</span>
                      <span>
                        <strong className="text-white">Systems Thinking:</strong> Problems are rarely isolated. They are loops and nodes in a wider network. KRISHI.OS reflects this by framing career, projects, and skills as a connected topology.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#10b981] shrink-0 font-bold">➔</span>
                      <span>
                        <strong className="text-white">Solving Real-World Problems:</strong> Code is a tool, not the goal. Whether managing traffic density, clinical notes, or university services, software must address concrete user pain points.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-[#10b981] shrink-0 font-bold">➔</span>
                      <span>
                        <strong className="text-white">Building Products People Use:</strong> Code must run in production. Developing high-utility tools is the primary directive.
                      </span>
                    </li>
                  </ul>
                </div>
              </section>

              {/* NAVIGATION GUIDE */}
              <section className="space-y-3">
                <h2 className="text-[#10b981] font-bold uppercase tracking-wider flex items-center gap-1.5 border-l-2 border-[#10b981] pl-2 text-xs md:text-sm">
                  3. NAVIGATION GUIDE
                </h2>
                <p className="text-slate-400 text-xs pl-3">
                  Click on any link below to instantly execute the navigation command and navigate to the module:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-3 pt-2">
                  {navGuide.map((item) => (
                    <div
                      key={item.name}
                      className="border border-slate-900 hover:border-cyan-500/20 bg-slate-950/40 p-4 rounded-lg flex flex-col justify-between group transition-all duration-300"
                    >
                      <div>
                        <div className="flex items-center justify-between">
                          {item.action ? (
                            <button
                              onClick={item.action}
                              className="font-bold text-white hover:text-cyan-400 text-left transition-colors flex items-center gap-1 text-xs md:text-sm cursor-pointer"
                            >
                              <span>{item.name}</span>
                              <ExternalLink size={10} className="text-slate-500" />
                            </button>
                          ) : (
                            <Link
                              href={item.href || "#"}
                              className="font-bold text-white hover:text-[#10b981] transition-colors flex items-center gap-1 text-xs md:text-sm"
                            >
                              <span>{item.name}</span>
                              <ExternalLink size={10} className="text-slate-500" />
                            </Link>
                          )}
                          <span className="text-[10px] text-slate-500 font-mono select-none hidden group-hover:inline">
                            {item.command}
                          </span>
                        </div>
                        <p className="text-slate-400 text-[11px] md:text-xs mt-2 leading-relaxed">
                          {item.desc}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* ADDITIONAL OPEN SOURCE WORK */}
              <section className="space-y-3">
                <h2 className="text-[#10b981] font-bold uppercase tracking-wider flex items-center gap-1.5 border-l-2 border-[#10b981] pl-2 text-xs md:text-sm">
                  3.5. ADDITIONAL OPEN SOURCE WORK
                </h2>
                <p className="text-slate-400 text-xs pl-3">
                  Explore other developer projects, utilities, and integrations:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pl-3 pt-2">
                  <div className="border border-slate-900 bg-slate-950/40 p-4 rounded-lg flex flex-col justify-between group transition-all duration-300">
                    <div>
                      <div className="flex items-center justify-between">
                        <a
                          href="https://github.com/krishi-chheda/AuraLens-AI"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-white hover:text-[#10b981] transition-colors flex items-center gap-1 text-xs md:text-sm cursor-pointer"
                        >
                          <span>AuraLens AI</span>
                          <ExternalLink size={10} className="text-slate-500" />
                        </a>
                        <span className="text-[10px] text-slate-500 font-mono select-none">
                          CLIP + ChromaDB
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] md:text-xs mt-2 leading-relaxed font-sans select-text">
                        Local Streamlit photography culling assistant using Laplacian variance and CLIP semantic vector search in ChromaDB.
                      </p>
                    </div>
                  </div>

                  <div className="border border-slate-900 bg-slate-950/40 p-4 rounded-lg flex flex-col justify-between group transition-all duration-300">
                    <div>
                      <div className="flex items-center justify-between">
                        <a
                          href="https://github.com/krishi-chheda/f1-telemetry-ai-dashboard"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-white hover:text-[#10b981] transition-colors flex items-center gap-1 text-xs md:text-sm cursor-pointer"
                        >
                          <span>F1 Telemetry AI Suite</span>
                          <ExternalLink size={10} className="text-slate-500" />
                        </a>
                        <span className="text-[10px] text-slate-500 font-mono select-none">
                          Next.js + Pandas
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] md:text-xs mt-2 leading-relaxed font-sans select-text">
                        Formula 1 telemetry dashboard and data parser analyzing lap logs, driver inputs, and speed sectors on 2D track maps.
                      </p>
                    </div>
                  </div>

                  <div className="border border-slate-900 bg-slate-950/40 p-4 rounded-lg flex flex-col justify-between group transition-all duration-300">
                    <div>
                      <div className="flex items-center justify-between">
                        <a
                          href="https://github.com/krishi-chheda/fastapi_backend"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-white hover:text-[#10b981] transition-colors flex items-center gap-1 text-xs md:text-sm cursor-pointer"
                        >
                          <span>BP Prediction API</span>
                          <ExternalLink size={10} className="text-slate-500" />
                        </a>
                        <span className="text-[10px] text-slate-500 font-mono select-none">
                          FastAPI + ML
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] md:text-xs mt-2 leading-relaxed font-sans select-text">
                        Facial video analysis API predicting blood pressure metrics via color Photoplethysmography (PPG) and Scikit-learn regressors.
                      </p>
                    </div>
                  </div>

                  <div className="border border-slate-900 bg-slate-950/40 p-4 rounded-lg flex flex-col justify-between group transition-all duration-350">
                    <div>
                      <div className="flex items-center justify-between">
                        <a
                          href="https://github.com/krishi-chheda/video-splitter"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-bold text-white hover:text-[#10b981] transition-colors flex items-center gap-1 text-xs md:text-sm cursor-pointer"
                        >
                          <span>Video Splitter Pro</span>
                          <ExternalLink size={10} className="text-slate-500" />
                        </a>
                        <span className="text-[10px] text-slate-500 font-mono select-none">
                          Python + FFmpeg
                        </span>
                      </div>
                      <p className="text-slate-400 text-[11px] md:text-xs mt-2 leading-relaxed font-sans select-text">
                        Streamlit media processing utility for fast custom timestamp video splitting and audio track extraction.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* TECH STACK */}
              <section className="space-y-3">
                <h2 className="text-[#10b981] font-bold uppercase tracking-wider flex items-center gap-1.5 border-l-2 border-[#10b981] pl-2 text-xs md:text-sm">
                  4. TECH STACK
                </h2>
                <div className="text-slate-300 text-xs md:text-sm pl-3 space-y-2">
                  <p>
                    KRISHI.OS is built from the ground up as a responsive, server-side rendered application leveraging:
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1 font-mono text-[11px]">
                    <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">Next.js 16 (App Router)</span>
                    <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">React 19</span>
                    <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">TypeScript</span>
                    <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">Tailwind CSS v4</span>
                    <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">Framer Motion 12</span>
                    <span className="bg-slate-900 border border-slate-800 text-slate-300 px-2 py-0.5 rounded">Lucide Icons</span>
                  </div>
                </div>
              </section>

              {/* CURRENT STATUS */}
              <section className="space-y-3">
                <h2 className="text-[#10b981] font-bold uppercase tracking-wider flex items-center gap-1.5 border-l-2 border-[#10b981] pl-2 text-xs md:text-sm">
                  5. CURRENT STATUS
                </h2>
                <div className="border border-slate-900 bg-slate-950/60 p-4 rounded-lg pl-3 space-y-3 text-xs md:text-sm">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase">STATUS</div>
                      <div className="text-[#10b981] font-bold mt-0.5">ONLINE</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase">LOCATION</div>
                      <div className="text-white mt-0.5">Melbourne, VIC</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase">GRADUATION</div>
                      <div className="text-white mt-0.5">July 2027</div>
                    </div>
                    <div>
                      <div className="text-slate-500 text-[10px] uppercase">GRADUATE TARGET</div>
                      <div className="text-[#10b981] font-bold mt-0.5">Open to Ops</div>
                    </div>
                  </div>
                </div>
              </section>

              {/* FUTURE DIRECTION */}
              <section className="space-y-3">
                <h2 className="text-[#10b981] font-bold uppercase tracking-wider flex items-center gap-1.5 border-l-2 border-[#10b981] pl-2 text-xs md:text-sm">
                  6. FUTURE DIRECTION
                </h2>
                <ul className="text-slate-300 text-xs md:text-sm pl-3 space-y-2 list-none">
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-500">•</span>
                    <span><strong className="text-white">Richer AI Digital Twin:</strong> Expanding context window grounding and multi-turn capabilities.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-500">•</span>
                    <span><strong className="text-white">Deeper Project Playgrounds:</strong> Supporting inline interactive runtime environments for core repositories.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-500">•</span>
                    <span><strong className="text-white">Process Monitor Visualisations:</strong> Integrating live system telemetry tracking into the System Topology.</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-cyan-500">•</span>
                    <span><strong className="text-white">Continuous Iteration:</strong> Refactoring libraries and shipping tools alongside my Master&apos;s research.</span>
                  </li>
                </ul>
              </section>

              {/* FOOTER */}
              <div className="border-t border-slate-900 pt-6 mt-8 text-xs text-slate-500 space-y-2 text-center md:text-left">
                <p className="text-slate-400">
                  Thanks for exploring KRISHI.OS.
                </p>
                <p>
                  Every feature on this site exists because I enjoy building systems that people can interact with—not just look at.
                </p>
                <p className="text-[#10b981] font-bold tracking-widest pt-2">
                  // SEE YOU IN THE TERMINAL.
                </p>
              </div>

            </div>
          </div>
        </div>
        <Footer />
      </main>
    </>
  );
}
