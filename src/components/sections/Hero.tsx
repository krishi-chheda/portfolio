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
                Currently pursuing a <span className="text-[#10b981] font-semibold">Master of Artificial Intelligence at Monash University</span> and serving as the <span className="text-purple-400 font-semibold">Media & Marketing Director at MDAS</span> (Monash Data & AI Society).
                <br /><br />
                Builder of <span className="text-emerald-400 font-semibold">Accessible Vision</span>, <span className="text-cyan-400 font-semibold">ClinicalBrief</span>, <span className="text-slate-200 font-semibold">StudentHub</span>, and <span className="text-amber-400 font-semibold">Traffic AI</span>.
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
                <TerminalSquare className="w-3 h-3 text-[#10b981]" />
                ps_aux_grep_krishi
              </span>
              <span className="text-[9px] text-[#10b981] animate-pulse">MONITORING</span>
            </div>

            {/* Terminal Body */}
            <div className="p-5 flex-1 flex flex-col justify-start text-xs space-y-4">
              {/* CLI Command Prompt */}
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-slate-500">
                  <span className="text-emerald-500 font-bold">krishi@stack:~$</span>
                  <span className="text-slate-100 select-all font-semibold">ps aux | grep krishi</span>
                </div>
              </div>

              {/* Metrics Ribbon (htop/glances inspired) */}
              <div className="grid grid-cols-2 gap-2 bg-slate-950/40 p-2.5 rounded border border-slate-900/60 text-[10px] font-mono select-none">
                <div>
                  <span className="text-slate-500 block text-[8px] font-bold uppercase">PROCESSES RUNNING:</span>
                  <span className="text-emerald-450 font-bold">{currentProcesses.running.length}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[8px] font-bold uppercase">LEARNING THREADS:</span>
                  <span className="text-cyan-400 font-bold">{currentProcesses.learning.length}</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[8px] font-bold uppercase">LEADERSHIP TASKS:</span>
                  <span className="text-purple-400 font-bold">1</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[8px] font-bold uppercase">SYSTEM UPTIME:</span>
                  <span className="text-white font-semibold">{currentProcesses.uptime}</span>
                </div>
              </div>

              {/* Grid content split */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 flex-1">
                
                {/* Left Side: Active, Learning, Leadership */}
                <div className="space-y-4">
                  {/* Active Processes */}
                  <div className="space-y-1.5">
                    <span className="text-slate-500 block uppercase font-bold text-[8.5px] tracking-wider select-none">
                      // ACTIVE PROCESSES
                    </span>
                    <div className="space-y-1">
                      {currentProcesses.running.map((proc) => (
                        <div key={proc.name} className="relative group/item">
                          <div className="flex items-center justify-between py-1 px-1.5 rounded hover:bg-slate-900/40 border border-transparent hover:border-slate-900 transition-all cursor-help">
                            <div className="flex items-center gap-1.5 min-w-0">
                              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                              <span className="text-emerald-400 font-bold text-[10px] shrink-0">[RUNNING]</span>
                              <span className="text-slate-200 font-medium text-[10.5px] truncate">{proc.name}</span>
                            </div>
                            {proc.githubUrl && (
                              <a
                                href={proc.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                onClick={(e) => e.stopPropagation()}
                                className="text-slate-500 hover:text-cyan-400 transition-colors text-[9px] font-bold border border-slate-900 hover:border-cyan-900 bg-slate-950 px-1 py-0.5 rounded select-none shrink-0 ml-1.5"
                              >
                                [repo]
                              </a>
                            )}
                          </div>

                          {/* Hover Tooltip Card */}
                          <div className="absolute left-0 right-0 sm:left-full sm:right-auto sm:w-64 sm:ml-3.5 bottom-full sm:bottom-auto sm:top-0 z-30 hidden group-hover/item:block bg-slate-950 border border-emerald-500/40 p-3.5 rounded-lg shadow-2xl font-mono text-[10.5px] space-y-2 select-text pointer-events-auto">
                            <div className="text-white font-bold uppercase tracking-wider border-b border-slate-900 pb-1 flex justify-between items-center">
                              <span>{proc.name}</span>
                              <span className="text-[8px] px-1.5 py-0.5 rounded bg-emerald-950 text-emerald-400 font-bold">RUNNING</span>
                            </div>
                            <p className="text-slate-400 leading-normal font-sans text-[10px]">{proc.description}</p>
                            <div className="pt-1.5 border-t border-slate-900 text-[9.5px]">
                              <span className="text-emerald-400 font-bold block mb-0.5">STACK:</span>
                              <span className="text-slate-350">{proc.stack}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Learning Threads */}
                  <div className="space-y-1.5">
                    <span className="text-slate-500 block uppercase font-bold text-[8.5px] tracking-wider select-none">
                      // LEARNING THREADS
                    </span>
                    <div className="space-y-1">
                      {currentProcesses.learning.map((skill) => (
                        <div key={skill} className="flex items-center gap-1.5 py-0.5 px-1.5 select-text">
                          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500 shrink-0" />
                          <span className="text-cyan-400 font-bold text-[10px] shrink-0">[ACTIVE]</span>
                          <span className="text-slate-300 text-[10.5px]">{skill}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Leadership Process */}
                  <div className="space-y-1.5">
                    <span className="text-slate-500 block uppercase font-bold text-[8.5px] tracking-wider select-none">
                      // LEADERSHIP PROCESS
                    </span>
                    <div className="border border-slate-900 bg-slate-950/20 p-2 rounded space-y-1 select-text">
                      <div className="flex items-center gap-1.5">
                        <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse shrink-0" />
                        <span className="text-purple-400 font-bold text-[10px] shrink-0">[RUNNING]</span>
                        <span className="text-white font-medium text-[10.5px]">{currentProcesses.leadership.role}</span>
                      </div>
                      <div className="pl-3.5 text-[9.5px] text-slate-500 font-medium">
                        {currentProcesses.leadership.org}
                      </div>
                    </div>
                  </div>

                </div>

                {/* Right Side: Target Roles, System Status */}
                <div className="space-y-4">
                  {/* Target Roles */}
                  <div className="space-y-1.5">
                    <span className="text-slate-500 block uppercase font-bold text-[8.5px] tracking-wider select-none">
                      // TARGET ROLES
                    </span>
                    <div className="space-y-1">
                      {currentProcesses.targetRoles.map((role) => (
                        <div key={role} className="flex items-center gap-1.5 py-0.5 px-1.5 select-text">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                          <span className="text-amber-500 font-bold text-[10px] shrink-0">[QUEUE]</span>
                          <span className="text-slate-300 text-[10.5px]">{role}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* System Status */}
                  <div className="space-y-1.5">
                    <span className="text-slate-500 block uppercase font-bold text-[8.5px] tracking-wider select-none">
                      // SYSTEM STATUS
                    </span>
                    <div className="border border-slate-900 bg-slate-950/25 p-2.5 rounded-lg space-y-2 select-text">
                      <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded bg-emerald-950/40 border border-emerald-900/50 text-[#10b981] font-bold text-[9.5px] tracking-wider uppercase animate-pulse select-none">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#10b981]" />
                        ● AVAILABLE FOR OPPORTUNITIES
                      </div>
                      
                      <div className="space-y-1.5 text-[10.5px]">
                        <div>
                          <span className="text-slate-500 block uppercase text-[8px] font-bold select-none">Graduation:</span>
                          <span className="text-white font-semibold">{currentProcesses.graduation}</span>
                        </div>
                        <div>
                          <span className="text-slate-500 block uppercase text-[8px] font-bold select-none">Location:</span>
                          <span className="text-white font-semibold">{currentProcesses.location}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                </div>

              </div>

              {/* Shell output trailing decoration */}
              <div className="text-[10px] text-slate-650 border-t border-slate-900/50 pt-2 mt-auto select-none flex justify-between">
                <span>[info] Active processes rendered.</span>
                <span>tty1</span>
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
