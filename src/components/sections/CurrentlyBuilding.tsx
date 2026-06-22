"use client";

import { motion } from "framer-motion";
import { Hammer, Circle } from "lucide-react";

interface BuildingProject {
  name: string;
  description: string;
  status: string;
  statusType: "active" | "expanding";
}

export default function CurrentlyBuilding() {
  const activeProjects: BuildingProject[] = [
    {
      name: "Accessible Vision",
      description: "AI-powered assistive platform helping visually impaired users navigate unfamiliar environments through real-time computer vision models and low-latency audio guidance.",
      status: "Active Development",
      statusType: "active"
    },
    {
      name: "ClinicalBrief",
      description: "Secure clinical intelligence platform that transcribes clinician-patient consultation audio and extracts structured, actionable clinical insights.",
      status: "Active Development",
      statusType: "active"
    },
    {
      name: "StudentHub",
      description: "Melbourne student community resource hub consolidating verified housing checklists, public transit routes, and student events.",
      status: "Expanding Features",
      statusType: "expanding"
    }
  ];

  return (
    <section id="currently-building" className="py-24 relative overflow-hidden border-t border-slate-900/60 select-none">
      <div className="max-w-4xl mx-auto px-6">
        
        {/* Section Header CLI Prompt */}
        <div className="font-mono text-xs md:text-sm text-slate-500 mb-8 flex items-center space-x-2 select-none">
          <span className="text-[#10b981]">krishi@stack:~$</span>
          <span className="text-slate-100">./currently-building --status</span>
        </div>

        {/* Workstation Console Widget */}
        <div className="w-full border border-slate-900 bg-slate-950/20 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono">
          
          {/* Header */}
          <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-900 flex justify-between items-center select-none text-[10px] text-slate-500">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/40 border border-red-500/20" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/40 border border-yellow-500/20" />
              <span className="w-2 h-2 rounded-full bg-green-500/40 border border-green-500/20" />
            </div>
            <span>build_pipeline // currently_building</span>
            <div className="flex items-center space-x-1.5 bg-slate-900 px-2 py-0.5 rounded text-[9px] border border-slate-800">
              <Hammer size={10} className="text-cyan-400" />
              <span>pipeline_active</span>
            </div>
          </div>

          {/* Grid list of active builds */}
          <div className="p-6 md:p-8 space-y-6 select-text">
            
            <div className="grid grid-cols-1 gap-4">
              {activeProjects.map((proj, idx) => {
                const isActive = proj.statusType === "active";
                return (
                  <motion.div
                    key={proj.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="border border-slate-900 bg-slate-950/40 p-5 rounded-lg flex flex-col md:flex-row md:items-center justify-between gap-4"
                  >
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-xs font-bold">📂</span>
                        <h3 className="text-sm md:text-base font-bold text-white uppercase tracking-tight">
                          {proj.name}
                        </h3>
                      </div>
                      
                      <p className="text-[11.5px] text-slate-400 leading-relaxed font-sans select-text max-w-2xl">
                        {proj.description}
                      </p>
                    </div>

                    <div className="shrink-0 flex items-center">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-wider font-mono border ${
                        isActive
                          ? "bg-emerald-950/30 border-emerald-900/50 text-emerald-400"
                          : "bg-cyan-950/30 border-cyan-900/50 text-cyan-400"
                      }`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${isActive ? "bg-emerald-500 animate-pulse" : "bg-cyan-400"} shrink-0`} />
                        {proj.status}
                      </span>
                    </div>

                  </motion.div>
                );
              })}
            </div>

          </div>

          {/* Footer bar */}
          <div className="bg-slate-950/95 px-4 py-2 border-t border-slate-900 flex justify-between items-center text-[9px] text-slate-650 select-none">
            <span>Tracking 3 active development subroutines</span>
            <span>currently-building.md</span>
          </div>

        </div>

      </div>
    </section>
  );
}
