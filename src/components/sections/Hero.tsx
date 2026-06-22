"use client";

import { motion as motionFramer } from "framer-motion";
import { Bot, ArrowDown, Sparkles, Terminal, Cpu, Search, TerminalSquare } from "lucide-react";
import Button from "@/components/ui/Button";
import { currentProcesses } from "@/lib/data";

export default function Hero() {
  const triggerChat = () => {
    // Dispatch custom event to open global AI chatbot bubble
    window.dispatchEvent(new CustomEvent("open-ai-chat"));
  };

  return (
    <section className="relative min-h-[95vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-[#080c14]">
      {/* Background terminal matrix glow */}
      <div className="absolute inset-0 grid-bg pointer-events-none select-none opacity-[0.12]" />
      <div 
        className="absolute inset-0 pointer-events-none select-none z-10"
        style={{
          background: "radial-gradient(circle at 50% 40%, rgba(16, 185, 129, 0.015) 0%, rgba(8, 12, 20, 0) 70%)"
        }}
      />

      <div className="max-w-6xl w-full mx-auto px-6 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* Left Column: Whoami Identity Terminal */}
          <motionFramer.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut" }}
            className="lg:col-span-7 border border-slate-900 bg-slate-950/30 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl flex flex-col"
          >
            {/* OS Window Header Bar */}
            <div className="bg-slate-950/90 px-4 py-3 border-b border-slate-900 flex justify-between items-center select-none font-mono">
              <div className="flex items-center space-x-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/40 border border-red-500/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/40 border border-yellow-500/20" />
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/40 border border-green-500/20" />
              </div>
              
              <div className="flex items-center space-x-2 text-[10px] text-slate-500">
                <Terminal size={10} className="text-[#10b981]" />
                <span>krishi@stack: ~</span>
              </div>

              <div className="text-[9px] font-mono text-slate-600 tracking-wider">
                ssh: port-22 // system_root
              </div>
            </div>

            {/* OS Window Shell Body */}
            <div className="p-6 md:p-8 font-mono text-left space-y-6 flex-1 flex flex-col justify-between">
              
              {/* Command Prompts */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-xs md:text-sm">
                  <span className="text-[#10b981] font-bold">krishi@stack:~$</span>
                  <span className="text-slate-100 font-semibold select-all">./whoami --long</span>
                </div>
                
                <div className="text-[11px] text-emerald-500/60 pl-2 border-l border-emerald-500/30 py-0.5 flex items-center gap-1.5">
                  <Sparkles size={10} className="animate-pulse" />
                  <span>loading env · melbourne · ai · engineering</span>
                </div>
              </div>

              {/* Main Headline Identity */}
              <div className="border-l-2 border-emerald-500/60 pl-4 md:pl-6 my-2 space-y-1">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-heading font-extrabold uppercase tracking-tight text-white leading-[1.05] select-text">
                  KRISHI
                  <br />
                  <span className="text-slate-500">CHHEDA.</span>
                </h1>
                
                <h2 className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 text-xl md:text-3xl font-bold tracking-wide mt-1">
                  AI ENGINEER &
                  <br />
                  PRODUCT BUILDER
                </h2>
              </div>

              {/* Supporting Description text */}
              <p className="text-slate-300 font-sans text-xs md:text-sm leading-relaxed max-w-2xl font-normal select-text">
                Building AI systems that solve real-world problems.
                <br /><br />
                Currently developing <span className="text-emerald-400 font-semibold">Accessible Vision</span>, <span className="text-cyan-400 font-semibold">ClinicalBrief</span>, <span className="text-slate-200 font-semibold">StudentHub</span>, and intelligent computer vision systems while pursuing a Master of Artificial Intelligence at Monash University.
              </p>

              {/* Action inputs (CTA row) */}
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-4">
                <Button
                  onClick={triggerChat}
                  variant="primary"
                  size="md"
                  className="flex items-center justify-center space-x-2 font-bold cursor-pointer"
                >
                  <Bot className="w-4 h-4" />
                  <span>./ask-krishi</span>
                </Button>
                
                <Button
                  onClick={() => {
                    const event = new KeyboardEvent("keydown", {
                      key: "k",
                      ctrlKey: true,
                      bubbles: true
                    });
                    window.dispatchEvent(event);
                  }}
                  variant="outline"
                  size="md"
                  className="flex items-center justify-center space-x-2 cursor-pointer border-slate-800 text-slate-400"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Command Palette [Ctrl+K]</span>
                </Button>
              </div>

            </div>
          </motionFramer.div>

          {/* Right Column: ps aux | grep krishi terminal widget */}
          <motionFramer.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.15 }}
            className="lg:col-span-5 border border-slate-900 bg-slate-950/20 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono"
          >
            {/* Header bar */}
            <div className="bg-slate-950/90 px-4 py-3 border-b border-slate-900 flex justify-between items-center select-none">
              <div className="flex items-center space-x-1.5">
                <span className="w-2 h-2 bg-slate-800 rounded-full" />
                <span className="w-2 h-2 bg-slate-800 rounded-full" />
                <span className="w-2 h-2 bg-slate-800 rounded-full" />
              </div>
              <span className="text-[10px] text-slate-500 flex items-center gap-1">
                <TerminalSquare className="w-3 h-3 text-amber-500" />
                sys_monitor.sh
              </span>
              <span className="text-[9px] text-[#10b981] animate-pulse">RUNNING</span>
            </div>

            {/* Terminal Body */}
            <div className="p-5 flex-1 flex flex-col justify-start text-xs space-y-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-slate-500">
                  <span className="text-amber-500 font-bold">krishi@stack:~$</span>
                  <span className="text-slate-100 select-all">ps aux | grep krishi</span>
                </div>
                <div className="text-[10px] text-slate-650 tracking-tight leading-none overflow-hidden text-ellipsis whitespace-nowrap">
                  USER      PID  %CPU %MEM      VSZ    RSS   TTY      STAT START   TIME COMMAND
                </div>
              </div>

              {/* Running Processes Output */}
              <div className="space-y-3.5 border-l border-slate-900 pl-3 py-1">
                <div>
                  <div className="text-emerald-400 font-bold tracking-wider text-[10px] uppercase mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
                    RUNNING:
                  </div>
                  <ul className="space-y-1 pl-2 text-slate-300">
                    {currentProcesses.running.map((proc) => (
                      <li key={proc} className="flex items-center gap-2 select-text">
                        <span className="text-emerald-500/60">•</span>
                        <span>{proc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-cyan-400 font-bold tracking-wider text-[10px] uppercase mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-500" />
                    LEARNING:
                  </div>
                  <ul className="space-y-1 pl-2 text-slate-300">
                    {currentProcesses.learning.map((learn) => (
                      <li key={learn} className="flex items-center gap-2 select-text">
                        <span className="text-cyan-500/60">•</span>
                        <span>{learn}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <div className="text-amber-400 font-bold tracking-wider text-[10px] uppercase mb-1.5 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                    ROLE:
                  </div>
                  <ul className="space-y-1 pl-2 text-slate-300">
                    <li className="flex items-start gap-2 select-text">
                      <span className="text-amber-500/60">•</span>
                      <span>{currentProcesses.role}</span>
                    </li>
                  </ul>
                </div>

                {currentProcesses.availability && (
                  <div>
                    <div className="text-[#10b981] font-bold tracking-wider text-[10px] uppercase mb-1.5 flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                      STATUS:
                    </div>
                    <ul className="space-y-1 pl-2 text-slate-300">
                      <li className="flex items-start gap-2 select-text">
                        <span className="text-emerald-500/60">•</span>
                        <span className="text-[#10b981] font-bold">{currentProcesses.availability}</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>

              {/* Shell output trailing decoration */}
              <div className="text-[10px] text-slate-600 border-t border-slate-900/50 pt-3 mt-auto select-none">
                [info] Process buffer synced with live workstation state.
              </div>
            </div>
          </motionFramer.div>

        </div>
      </div>

      {/* Aesthetic bottom shadow fade */}
      <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-[#080c14] to-transparent pointer-events-none" />
    </section>
  );
}
