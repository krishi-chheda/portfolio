"use client";

import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { experienceData } from "@/lib/data";

export default function Experience() {
  return (
    <section id="career" className="py-24 relative overflow-hidden border-t border-slate-900/60 select-none">
      <div className="max-w-4xl mx-auto px-6">

        {/* Section Header CLI Prompt */}
        <div className="font-mono text-xs md:text-sm text-slate-500 mb-8 flex items-center space-x-2 select-none">
          <span className="text-[#10b981]">krishi@stack:~$</span>
          <span className="text-slate-100">git log --career</span>
        </div>

        {/* Git Log DAG Console Window */}
        <div className="w-full border border-slate-900 bg-slate-950/20 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono">

          {/* Title Bar */}
          <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-900 flex justify-between items-center select-none text-[10px] text-slate-500">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/40 border border-red-500/20" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/40 border border-yellow-500/20" />
              <span className="w-2 h-2 rounded-full bg-green-500/40 border border-green-500/20" />
            </div>
            <span>git_daemon // career_log</span>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span>bash</span>
            </div>
          </div>

          {/* Window Body containing the mock git log DAG */}
          <div className="p-6 md:p-8 select-text">

            <div className="relative border-l border-dashed border-slate-800 ml-3 md:ml-4 pl-6 md:pl-8 space-y-12 py-2">
              {experienceData.map((item, idx) => {
                // Generate a mock hash based on item id
                const mockHash = Math.abs(item.id.split("").reduce((acc, char) => acc + char.charCodeAt(0), 0) * 12345)
                  .toString(16)
                  .substring(0, 8);

                const isFirst = idx === 0;

                return (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    transition={{ duration: 0.4, delay: idx * 0.08 }}
                    className="relative text-xs md:text-sm"
                  >
                    {/* Git Graph Circle node */}
                    <div className="absolute -left-[30px] md:-left-[39px] top-1 select-none">
                      <span className={`w-3.5 h-3.5 rounded-full border border-slate-950 flex items-center justify-center text-[10px] leading-none ${isFirst ? "bg-[#10b981] text-black animate-pulse" : "bg-amber-500 text-black"
                        }`}>
                        *
                      </span>
                    </div>

                    {/* Commit Content */}
                    <div className="space-y-2 min-w-0">
                      <div className="flex flex-wrap items-center gap-2 text-slate-505">
                        <span className="text-amber-500 font-bold">commit {mockHash}</span>
                        {isFirst && (
                          <span className="text-emerald-500 font-bold text-[10px] md:text-xs">
                            (HEAD {"->"} main, origin/main, origin/HEAD)
                          </span>
                        )}
                      </div>

                      <div className="text-slate-400 text-[11px] md:text-xs">
                        <span className="text-slate-500">Author:</span> Krishi Chheda &lt;krishichheda10@gmail.com&gt;
                      </div>

                      <div className="text-slate-400 text-[11px] md:text-xs">
                        <span className="text-slate-500">Date:</span> {item.year} {"->"} <span className="text-white font-bold">{item.role}</span> @ <span className="text-[#10b981] font-semibold">{item.organization}</span>
                      </div>

                      <div className="pt-2 pl-4 border-l border-slate-900/60 space-y-3">
                        <div className="bg-cyan-950/10 border border-cyan-900/20 p-2.5 rounded text-[11px] text-cyan-400 flex items-start gap-2 max-w-xl font-mono leading-relaxed select-text">
                          <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                          <span>{item.highlight}</span>
                        </div>

                        <ul className="space-y-1.5 text-[11px] text-slate-400 list-disc pl-4 leading-relaxed font-sans select-text">
                          {item.description.map((desc, dIdx) => (
                            <li key={dIdx}>{desc}</li>
                          ))}
                        </ul>

                        <div className="flex flex-wrap gap-1.5 pt-1 select-none">
                          {item.skills.map((skill) => (
                            <span
                              key={skill}
                              className="text-[9px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-500 hover:text-[#10b981] hover:border-[#10b981]/30 transition-colors"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* End of Log Marker */}
            <div className="flex items-center text-slate-700 text-xs font-mono select-none pl-4 border-l border-slate-900/30 pt-4 mt-4">
              <span className="mr-2 text-slate-800 font-bold">\</span>
              <span>(END) // career_log parsed successfully</span>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}
