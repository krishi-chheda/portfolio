"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, Server, Rocket, Briefcase, Sparkles } from "lucide-react";

interface VisionItem {
  key: string;
  title: string;
  icon: React.ReactNode;
  tag: string;
  focusArea: string;
  status: string;
  details: string;
}

export default function FutureVision() {
  const [activeTab, setActiveTab] = useState<string>("all");

  const visionItems: VisionItem[] = [
    {
      key: "agentic_systems",
      title: "Agentic Systems",
      icon: <Bot className="w-4 h-4 text-amber-400" />,
      tag: "CORE_TECH",
      focusArea: "Reasoning loops & tool invocation",
      status: "ACTIVE_RESEARCH",
      details: "Designing autonomous agentic loops capable of multi-step logical reasoning, semantic tool invocation, and task replanning to support medical document workflows inside ClinicalBrief."
    },
    {
      key: "ai_products",
      title: "AI Products",
      icon: <Server className="w-4 h-4 text-amber-400" />,
      tag: "PROD_BUILD",
      focusArea: "Low-latency edge model deployment",
      status: "ACTIVE_BUILDS",
      details: "Deploying low-latency computer vision edge inference models (like the YOLO pipeline in Accessible Vision and the AI Traffic Light System) into highly usable production applications."
    },
    {
      key: "scale_ventures",
      title: "Startups & Scale Ventures",
      icon: <Rocket className="w-4 h-4 text-amber-400" />,
      tag: "SCALE_VENTURE",
      focusArea: "MVP validation & full-stack scaling",
      status: "ACTIVE_PRODUCTS",
      details: "Validating MVPs and scaling user-facing student services platforms (like StudentHub) through modular Next.js architectures, unified database schemas, and clean API integrations."
    },
    {
      key: "technical_leadership",
      title: "Technical Leadership",
      icon: <Briefcase className="w-4 h-4 text-amber-400" />,
      tag: "ENG_OPS",
      focusArea: "Engineering operations & team alignment",
      status: "ACTIVE_OUTREACH",
      details: "Establishing clean software engineering standards, supervising designer pipelines, and aligning development sprints to build accessibility, healthcare, and urban planning AI products."
    }
  ];

  // Helper to render colored JSON syntax lines
  const renderHighlightedJson = (item: VisionItem) => {
    return (
      <div className="space-y-1 pl-4 text-xs md:text-sm select-text selection:bg-amber-500/20 selection:text-amber-200">
        <div>
          <span className="text-purple-400">&quot;{item.key}&quot;</span>
          <span className="text-slate-500">:</span>
          <span className="text-slate-350"> {'{'}</span>
        </div>
        <div className="pl-4">
          <span className="text-cyan-400">&quot;title&quot;</span>
          <span className="text-slate-500">:</span>
          <span className="text-emerald-400"> &quot;{item.title}&quot;</span>
          <span className="text-slate-500">,</span>
        </div>
        <div className="pl-4">
          <span className="text-cyan-400">&quot;focus_area&quot;</span>
          <span className="text-slate-500">:</span>
          <span className="text-emerald-400"> &quot;{item.focusArea}&quot;</span>
          <span className="text-slate-500">,</span>
        </div>
        <div className="pl-4">
          <span className="text-cyan-400">&quot;status&quot;</span>
          <span className="text-slate-500">:</span>
          <span className="text-amber-500"> &quot;{item.status}&quot;</span>
          <span className="text-slate-500">,</span>
        </div>
        <div className="pl-4">
          <span className="text-cyan-400">&quot;tag&quot;</span>
          <span className="text-slate-500">:</span>
          <span className="text-emerald-400"> &quot;{item.tag}&quot;</span>
          <span className="text-slate-500">,</span>
        </div>
        <div className="pl-4 leading-relaxed">
          <span className="text-cyan-400">&quot;details&quot;</span>
          <span className="text-slate-500">:</span>
          <span className="text-slate-200"> &quot;{item.details}&quot;</span>
        </div>
        <div>
          <span className="text-slate-350">{'}'}</span>
        </div>
      </div>
    );
  };

  return (
    <section id="future-vision" className="py-24 relative overflow-hidden border-t border-slate-900/60 bg-[#080c14] select-none">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header CLI Prompt */}
        <div className="font-mono text-xs md:text-sm text-slate-500 mb-8 flex items-center space-x-2 select-none">
          <span className="text-[#10b981]">krishi@stack:~$</span>
          <span className="text-slate-100">cat future_vision.json</span>
        </div>

        {/* OS Terminal Code Editor Window */}
        <div className="w-full border border-slate-900 bg-slate-950/20 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono">
          
          {/* Title Bar */}
          <div className="bg-slate-950/90 px-4 py-2.5 border-b border-slate-900 flex justify-between items-center select-none text-[10px] text-slate-500">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/40 border border-red-500/20" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/40 border border-yellow-500/20" />
              <span className="w-2 h-2 rounded-full bg-green-500/40 border border-green-500/20" />
            </div>
            <span>future_vision.json // runtime_config</span>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
              <span>json-editor</span>
            </div>
          </div>

          {/* Tab Selector Toolbar */}
          <div className="bg-slate-950/65 px-4 py-3 border-b border-slate-900 flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-slate-600 uppercase font-semibold pr-2 select-none">
              Filter JSON Keys:
            </span>
            <button
              onClick={() => setActiveTab("all")}
              className={`text-[10px] px-2.5 py-1 rounded border transition-all cursor-pointer ${
                activeTab === "all"
                  ? "bg-amber-500/10 border-amber-500/30 text-amber-500 font-bold"
                  : "bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200"
              }`}
            >
              .select_all()
            </button>
            {visionItems.map((item) => (
              <button
                key={item.key}
                onClick={() => setActiveTab(item.key)}
                className={`text-[10px] px-2.5 py-1 rounded border transition-all cursor-pointer flex items-center gap-1.5 ${
                  activeTab === item.key
                    ? "bg-amber-500/10 border-amber-500/30 text-amber-500 font-bold"
                    : "bg-slate-950 border-slate-900 text-slate-400 hover:text-slate-200"
                }`}
              >
                {item.icon}
                <span>.{item.key}</span>
              </button>
            ))}
          </div>

          {/* Window Body with highlighted JSON tree */}
          <div className="p-6 md:p-8 space-y-4 min-h-[360px] max-h-[600px] overflow-y-auto bg-slate-950/40 select-text">
            
            {/* Opening JSON bracket */}
            <div className="text-slate-350 text-xs md:text-sm font-bold select-none">
              {'{'}
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                transition={{ duration: 0.2 }}
                className="space-y-4"
              >
                {visionItems.map((item, idx) => {
                  const isVisible = activeTab === "all" || activeTab === item.key;
                  if (!isVisible) return null;

                  return (
                    <div key={item.key}>
                      {renderHighlightedJson(item)}
                      {activeTab === "all" && idx < visionItems.length - 1 && (
                        <div className="text-slate-500 text-xs md:text-sm select-none pl-4">,</div >
                      )}
                    </div>
                  );
                })}
              </motion.div>
            </AnimatePresence>

            {/* Closing JSON bracket */}
            <div className="text-slate-350 text-xs md:text-sm font-bold select-none pt-2">
              {'}'}
            </div>

          </div>

          {/* Console Diagnostic Footer */}
          <div className="bg-slate-950/90 px-4 py-2 border-t border-slate-900 flex justify-between items-center text-[9px] text-slate-600 select-none">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-2.5 h-2.5 text-amber-500 animate-pulse" />
              <span>SYSTEM: ONLINE_CONFIG</span>
            </div>
            <span>lines: 38</span>
          </div>

        </div>

      </div>
    </section>
  );
}
