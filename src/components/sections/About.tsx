"use client";

import { motion } from "framer-motion";
import { User, ShieldAlert, Award, Compass, Heart } from "lucide-react";
import Card from "../ui/Card";

export default function About() {
  const listVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: { opacity: 1, x: 0 },
  };

  return (
    <section id="about" className="py-24 relative overflow-hidden border-t border-slate-900/60 select-none">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header CLI Prompt */}
        <div className="font-mono text-xs md:text-sm text-slate-500 mb-8 flex items-center space-x-2 select-none">
          <span className="text-[#10b981]">krishi@stack:~$</span>
          <span className="text-slate-100">cat about.md</span>
        </div>

        {/* OS Terminal Shell Window */}
        <div className="w-full border border-slate-900 bg-slate-950/20 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono">
          
          {/* Title Bar */}
          <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-900 flex justify-between items-center select-none text-[10px] text-slate-500">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/40 border border-red-500/20" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/40 border border-yellow-500/20" />
              <span className="w-2 h-2 rounded-full bg-green-500/40 border border-green-500/20" />
            </div>
            <span>about.md // system_profile</span>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span>UTF-8</span>
            </div>
          </div>

          {/* Window Body */}
          <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Left Column: Markdown content printout */}
            <div className="lg:col-span-7 space-y-6 text-slate-350 leading-relaxed text-xs md:text-sm select-text font-mono">
              <div className="text-emerald-400 font-bold border-b border-slate-900 pb-2 mb-4">
                # ABOUT.MD
              </div>
              
              <ul className="space-y-4 pl-1">
                <li className="flex items-start gap-3">
                  <span className="text-[#10b981] font-bold shrink-0">*</span>
                  <span>Master of Artificial Intelligence @ Monash University</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#10b981] font-bold shrink-0">*</span>
                  <span>Media & Marketing Director @ MDAS</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#10b981] font-bold shrink-0">*</span>
                  <span>Builder of AI products</span>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-[#10b981] font-bold shrink-0">*</span>
                  <span>Interested in accessibility, healthcare AI, and community-focused technology</span>
                </li>
              </ul>
            </div>

            {/* Right Column: Console Details & Systems metadata */}
            <div className="lg:col-span-5 space-y-6">
              
              {/* Box 1 */}
              <div className="border border-slate-900 bg-slate-950/40 p-5 rounded-lg space-y-3">
                <h4 className="text-[11px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-900 pb-2">
                  <Award className="w-3.5 h-3.5" />
                  [CURRENT_FOCUS]
                </h4>
                <ul className="space-y-2 text-[10px] text-slate-400">
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500">▶</span>
                    <span>Agentic Workflows (LangChain, Custom Agents)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500">▶</span>
                    <span>Full-Stack Next.js 15 & FastAPI Backends</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-cyan-500">▶</span>
                    <span>Computer Vision & Edge Deep Learning</span>
                  </li>
                </ul>
              </div>

              {/* Box 2 */}
              <div className="border border-slate-900 bg-slate-950/40 p-5 rounded-lg space-y-3">
                <h4 className="text-[11px] font-bold text-emerald-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-900 pb-2">
                  <Compass className="w-3.5 h-3.5" />
                  [SYSTEMS_STACK]
                </h4>
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["Python", "TypeScript", "PyTorch", "FastAPI", "Next.js", "Tailwind CSS", "OpenCV", "Docker", "Git"].map((tech) => (
                    <span
                      key={tech}
                      className="text-[9px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 hover:text-[#10b981] hover:border-[#10b981]/30 transition-colors"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>

              {/* Box 3 */}
              <div className="border border-slate-900 bg-slate-950/40 p-5 rounded-lg space-y-3">
                <h4 className="text-[11px] font-bold text-purple-400 uppercase tracking-widest flex items-center gap-2 border-b border-slate-900 pb-2">
                  <Heart className="w-3.5 h-3.5" />
                  [SUBROUTINES]
                </h4>
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Formula 1 enthusiast (Melbourne GP attendee), tech builder, fitness training, and student community coordinator.
                </p>
              </div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
