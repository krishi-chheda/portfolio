"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, FileText, GitBranch, FolderOpen, Play, ChevronDown, ChevronRight, FileJson, FileType } from "lucide-react";
import { Github } from "@/components/ui/Icons";
import { projectsData } from "@/lib/data";

const STATIC_TELEMETRY_FALLBACK: Record<string, any> = {
  AccessVision: {
    name: "AccessVision",
    stars: 2,
    forks: 0,
    language: "Python",
    updatedAt: "2026-06-25T14:22:18Z",
    latestCommit: {
      hash: "e2c38f9",
      message: "refactor: optimize YOLOv8 model quantization and frame payload size",
      date: "2026-06-25T14:22:18Z"
    }
  },
  ClinicalBrief: {
    name: "ClinicalBrief",
    stars: 0,
    forks: 0,
    language: "TypeScript",
    updatedAt: "2026-06-26T09:12:45Z",
    latestCommit: {
      hash: "8c7f21a",
      message: "feat: add Whisper audio stream buffers and speaker overlap checks",
      date: "2026-06-26T09:12:45Z"
    }
  },
  "student-hub": {
    name: "student-hub",
    stars: 1,
    forks: 0,
    language: "TypeScript",
    updatedAt: "2026-06-24T18:45:00Z",
    latestCommit: {
      hash: "d8f3b2e",
      message: "docs: update API documentation and clean public transit routing maps",
      date: "2026-06-24T18:45:00Z"
    }
  },
  "ai-traffic-system": {
    name: "ai-traffic-system",
    stars: 0,
    forks: 0,
    language: "Python",
    updatedAt: "2026-06-27T10:30:12Z",
    latestCommit: {
      hash: "4a2b8c9",
      message: "refactor: optimize YOLO weights for Jetson Nano deployment edge pipeline",
      date: "2026-06-27T10:30:12Z"
    }
  }
};

export default function Projects() {
  const [selectedId, setSelectedId] = useState("accessible-vision");
  const [blink, setBlink] = useState(true);
  const [gitStats, setGitStats] = useState<any>(STATIC_TELEMETRY_FALLBACK);
  const [loadingGit, setLoadingGit] = useState(false);
  const [activeTab, setActiveTab] = useState<"details" | "architecture" | "notes">("details");
  const [decisionsOpen, setDecisionsOpen] = useState(false);

  useEffect(() => {
    setDecisionsOpen(false);
    setActiveTab("details");
  }, [selectedId]);

  useEffect(() => {
    setLoadingGit(true);
    fetch("/api/github")
      .then((res) => res.json())
      .then((data) => {
        if (data && data.repos) {
          setGitStats(data.repos);
        }
      })
      .catch((err) => console.error("Failed to load GitHub stats:", err))
      .finally(() => setLoadingGit(false));
  }, []);

  const getRepoKey = (id: string) => {
    if (id === "accessible-vision") return "AccessVision";
    if (id === "clinicalbrief") return "ClinicalBrief";
    if (id === "studenthub") return "student-hub";
    if (id === "traffic-ai") return "ai-traffic-system";
    return id;
  };

  // Command Palette event listener
  useEffect(() => {
    const handleSelectProject = (e: any) => {
      const projId = e.detail?.id;
      if (projId && projectsData.some((p) => p.id === projId)) {
        setSelectedId(projId);
      }
    };
    window.addEventListener("select-project", handleSelectProject);
    return () => window.removeEventListener("select-project", handleSelectProject);
  }, []);

  // Cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((b) => !b);
    }, 550);
    return () => clearInterval(interval);
  }, []);

  const activeProject = projectsData.find((p) => p.id === selectedId) || projectsData[0];

  return (
    <section id="projects" className="py-24 relative overflow-hidden border-t border-slate-900/60">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header CLI Prompt */}
        <div className="font-mono text-xs md:text-sm text-slate-500 mb-8 flex items-center space-x-2 select-none">
          <span className="text-[#10b981]">krishi@stack:~$</span>
          <span className="text-slate-100">ls -la projects/</span>
        </div>

        {/* Integrated IDE / Explorer Panel */}
        <div className="w-full border border-slate-900 bg-slate-950/20 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono terminal-highlight">
          
          {/* Editor Header Bar */}
          <div className="bg-slate-950/90 px-4 py-2.5 border-b border-slate-900 flex justify-between items-center select-none text-[10px] text-slate-500">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/40 border border-red-500/20" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/40 border border-yellow-500/20" />
              <span className="w-2 h-2 rounded-full bg-green-500/40 border border-green-500/20" />
            </div>
            
            <div className="flex items-center space-x-2 text-[10px]">
              <FolderOpen size={10} className="text-[#10b981]" />
              <span>projects/{activeProject.id}/details.md</span>
            </div>

            <div className="text-[9px] text-slate-650 flex items-center gap-1">
              <GitBranch size={9} />
              <span>main</span>
            </div>
          </div>

          {/* Editor Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 items-stretch min-h-[460px]">
            
            {/* Sidebar File Explorer Tree: 4 cols */}
            <div className="md:col-span-4 border-r border-slate-900 p-4 bg-slate-950/40 text-slate-400 text-xs flex flex-col justify-start space-y-4">
              <div className="text-[10px] uppercase font-bold text-slate-500 tracking-wider mb-2">
                File System Explorer
              </div>

              {/* Folder Node: projects/ */}
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-slate-300">
                  <FolderOpen size={14} className="text-[#10b981]" />
                  <span>projects/</span>
                </div>

                {/* Sub-Folders */}
                <div className="pl-4 space-y-2 border-l border-slate-900">
                  {projectsData.map((project, idx) => {
                    const isSelected = selectedId === project.id;
                    const isLast = idx === projectsData.length - 1;

                    return (
                      <div key={project.id} className="space-y-1">
                        {/* Directory line item */}
                        <button
                          onClick={() => setSelectedId(project.id)}
                          className={`flex items-center space-x-2 py-1 px-1.5 rounded transition-all w-full text-left cursor-pointer group ${
                            isSelected 
                              ? "bg-slate-900 text-[#10b981] font-bold" 
                              : "hover:bg-slate-900/45 hover:text-slate-200"
                          }`}
                        >
                          <span className="text-slate-700 select-none">
                            {isLast ? "└──" : "├──"}
                          </span>
                          <Folder size={12} className={isSelected ? "text-[#10b981]" : "text-slate-500 group-hover:text-slate-300"} />
                          <span className="truncate">{project.id}/</span>
                          {isSelected && <span className="text-[9px] text-[#10b981] select-none font-bold animate-pulse">{blink ? "█" : ""}</span>}
                        </button>

                        {/* File items inside selected folder */}
                        {isSelected && (
                          <div className="pl-6 space-y-1 text-[11px] ml-6 border-l border-slate-900 select-none">
                            <div className="flex items-center space-x-1.5 py-0.5 px-1.5 w-full text-left text-cyan-400 font-bold bg-slate-900/40 rounded">
                              <span className="text-slate-700">└──</span>
                              <FileText size={10} className="text-cyan-400" />
                              <span className="truncate">details.md</span>
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Code Editor Preview Window: 8 cols */}
            <div className="md:col-span-8 p-6 md:p-8 flex flex-col justify-between bg-slate-950/15">
              
              {/* Top Row: simulated Editor Tabs */}
              <div className="flex items-center space-x-1.5 pb-4 border-b border-slate-900 text-[10px] text-slate-500 mb-6 select-none overflow-x-auto whitespace-nowrap">
                <button
                  type="button"
                  onClick={() => setActiveTab("details")}
                  className={`px-2.5 py-1 rounded flex items-center gap-1.5 border transition-colors cursor-pointer ${
                    activeTab === "details"
                      ? "bg-slate-900 border-slate-800 text-cyan-400 font-bold"
                      : "bg-transparent border-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <FileText size={9} className={activeTab === "details" ? "text-cyan-400" : "text-slate-500"} />
                  details.md
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("architecture")}
                  className={`px-2.5 py-1 rounded flex items-center gap-1.5 border transition-colors cursor-pointer ${
                    activeTab === "architecture"
                      ? "bg-slate-900 border-slate-800 text-cyan-400 font-bold"
                      : "bg-transparent border-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <FileJson size={9} className={activeTab === "architecture" ? "text-cyan-400" : "text-slate-500"} />
                  architecture.json
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab("notes")}
                  className={`px-2.5 py-1 rounded flex items-center gap-1.5 border transition-colors cursor-pointer ${
                    activeTab === "notes"
                      ? "bg-slate-900 border-slate-800 text-cyan-400 font-bold"
                      : "bg-transparent border-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <FileType size={9} className={activeTab === "notes" ? "text-cyan-400" : "text-slate-500"} />
                  engineering_notes.txt
                </button>
              </div>

              {/* Editor Code Sheet Body */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={`${activeProject.id}-${activeTab}`}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  transition={{ duration: 0.15 }}
                  className="space-y-6 text-left flex-1 flex flex-col justify-between"
                >
                  {/* File title heading print */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#10b981] font-bold tracking-widest uppercase flex items-center gap-1.5 select-none">
                      <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-ping" />
                      cat projects/{activeProject.id}/{activeTab === "details" ? "details.md" : activeTab === "architecture" ? "architecture.json" : "engineering_notes.txt"}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white uppercase select-text">
                      {activeProject.title}
                    </h3>
                  </div>

                  {/* Dynamic Tab Rendering */}
                  <div className="space-y-6 flex-1 flex flex-col justify-between">
                    {activeTab === "details" && (
                      <div className="bg-slate-900/30 border border-slate-900 p-4 md:p-6 rounded text-slate-300 text-xs leading-relaxed select-text font-sans space-y-4">
                        <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-2 select-none">[PROJECT_SPECIFICATION]</p>
                        
                        <div>
                          <h4 className="text-[#10b981] font-mono text-[11px] font-bold tracking-wide uppercase mb-1">Problem:</h4>
                          <p className="text-slate-300 font-mono text-xs">{activeProject.overview.problem}</p>
                        </div>

                        <div className="mt-3">
                          <h4 className="text-[#10b981] font-mono text-[11px] font-bold tracking-wide uppercase mb-1">Solution:</h4>
                          <p className="text-slate-300 font-mono text-xs">{activeProject.overview.solution}</p>
                        </div>

                        <div className="mt-3">
                          <h4 className="text-[#10b981] font-mono text-[11px] font-bold tracking-wide uppercase mb-1">Tech Stack:</h4>
                          <div className="flex flex-wrap gap-1.5 mt-1">
                            {activeProject.techStack.map((tech) => (
                              <span
                                key={tech}
                                className="text-[10px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-cyan-400 font-mono"
                              >
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="mt-3">
                          <h4 className="text-[#10b981] font-mono text-[11px] font-bold tracking-wide uppercase mb-1">Key Outcome:</h4>
                          <p className="text-slate-300 font-mono text-xs font-semibold text-white">{activeProject.keyOutcome}</p>
                        </div>

                        <div className="mt-3">
                          <h4 className="text-[#10b981] font-mono text-[11px] font-bold tracking-wide uppercase mb-1">Current Status:</h4>
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase ${
                            activeProject.overview.status.toLowerCase().includes("active")
                              ? "bg-emerald-950/50 border border-emerald-800 text-emerald-400"
                              : "bg-cyan-950/50 border border-cyan-800 text-cyan-400"
                          }`}>
                            <span className="w-1.5 h-1.5 rounded-full mr-1.5 animate-pulse bg-current" />
                            {activeProject.overview.status}
                          </span>
                        </div>

                        {/* Live GitHub Telemetry */}
                        {activeProject.githubUrl && (
                          <div className="mt-4 pt-4 border-t border-slate-900/60 font-mono text-[11px] text-slate-400 space-y-2 select-none">
                            <div className="text-[9px] text-[#10b981] font-bold uppercase tracking-wider">
                              [GITHUB_LIVE_TELEMETRY]
                            </div>
                            {loadingGit ? (
                              <div className="flex items-center space-x-2 animate-pulse text-slate-500">
                                <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full" />
                                <span>Syncing telemetry packets...</span>
                              </div>
                            ) : gitStats && gitStats[getRepoKey(activeProject.id)] ? (
                              (() => {
                                const stats = gitStats[getRepoKey(activeProject.id)];
                                const isPrivate = activeProject.id === "clinicalbrief" || activeProject.id === "traffic-ai";
                                return (
                                  <div className="bg-slate-950/40 border border-slate-900/80 p-3 rounded space-y-2 select-text">
                                    <div className="flex flex-wrap items-center justify-between gap-3 text-[10px]">
                                      <div>
                                        <span className="text-slate-500">Stars:</span> <span className="text-white font-bold">{stats.stars}</span>
                                      </div>
                                      <div>
                                        <span className="text-slate-500">Forks:</span> <span className="text-white font-bold">{stats.forks}</span>
                                      </div>
                                      <div>
                                        <span className="text-slate-500">Language:</span> <span className="text-cyan-400 font-bold">{stats.language}</span>
                                      </div>
                                      <div>
                                        <span className="text-slate-500">Status:</span>{" "}
                                        <span className={isPrivate ? "text-amber-500 font-bold" : "text-emerald-500 font-bold"}>
                                          {isPrivate ? "PRIVATE/LOCAL" : "PUBLIC/SYNCED"}
                                        </span>
                                      </div>
                                    </div>
                                    {!isPrivate && stats.latestCommit && (
                                      <div className="border-t border-slate-900/60 pt-2 flex flex-col space-y-1 text-[10px]">
                                        <div className="flex items-center space-x-1.5 truncate">
                                          <span className="text-[#10b981] font-bold shrink-0">latest_commit:</span>
                                          <span className="text-amber-500 font-semibold font-mono shrink-0">[{stats.latestCommit.hash}]</span>
                                          <span className="text-slate-300 truncate font-mono" title={stats.latestCommit.message}>
                                            &quot;{stats.latestCommit.message}&quot;
                                          </span>
                                        </div>
                                        <div className="text-[9px] text-slate-500">
                                          Date: {new Date(stats.latestCommit.date).toLocaleString()}
                                        </div>
                                      </div>
                                    )}
                                    {isPrivate && (
                                      <div className="border-t border-slate-900/60 pt-2 text-[9.5px] text-slate-500 italic">
                                        Telemetry loaded via local workspace builds. Working tree clean.
                                      </div>
                                    )}
                                  </div>
                                );
                              })()
                            ) : (
                              <div className="text-slate-500 italic text-[10px]">Telemetry stream offline.</div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {activeTab === "architecture" && (
                      <div className="bg-slate-900/30 border border-slate-900 p-4 md:p-6 rounded text-slate-300 text-xs leading-relaxed select-text font-mono space-y-4">
                        <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-2 select-none">{`{ "architecture_schema": "v1.0" }`}</p>
                        
                        <div>
                          <span className="text-[#10b981] font-bold text-[11.5px] uppercase tracking-wide font-mono">[Chosen Architecture]</span>
                          <p className="text-slate-350 font-sans mt-1.5 text-xs leading-relaxed">{activeProject.architectureExplain}</p>
                        </div>

                        <div className="border-t border-slate-900/60 pt-4">
                          <span className="text-[#10b981] font-bold text-[11.5px] uppercase tracking-wide font-mono">[System Flow Pipeline]</span>
                          <div className="space-y-3 mt-2 pl-2">
                            {activeProject.architecture.flow.map((step, sIdx) => (
                              <div key={sIdx} className="flex items-start gap-3">
                                <span className="text-cyan-400 font-bold text-[10px] shrink-0 font-mono">[{sIdx + 1}] {step.label}:</span>
                                <span className="text-slate-400 font-sans text-xs">{step.description}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Collapsible Accordion for Decisions & Tradeoffs */}
                        <div className="border-t border-slate-900/60 pt-4">
                          <div className="border border-slate-900 bg-slate-950/40 p-3 rounded">
                            <button
                              type="button"
                              onClick={() => setDecisionsOpen(!decisionsOpen)}
                              className="w-full flex items-center justify-between text-[#10b981] font-mono text-[11px] font-bold tracking-wide uppercase focus:outline-none cursor-pointer animate-none"
                            >
                              <span>[Engineering Decisions & Trade-offs]</span>
                              {decisionsOpen ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                            </button>
                            <AnimatePresence initial={false}>
                              {decisionsOpen && (
                                <motion.div
                                  initial={{ height: 0, opacity: 0 }}
                                  animate={{ height: "auto", opacity: 1 }}
                                  exit={{ height: 0, opacity: 0 }}
                                  transition={{ duration: 0.2 }}
                                  className="overflow-hidden mt-3 border-t border-slate-900/60 pt-3 space-y-3 text-xs font-sans text-slate-400"
                                >
                                  <div className="space-y-1 pl-2 border-l border-cyan-500/30">
                                    <span className="text-[10px] text-cyan-400 font-mono block">Trade-offs Made:</span>
                                    <p className="text-slate-350 leading-relaxed text-[11px] font-sans">{activeProject.tradeOffs}</p>
                                  </div>
                                  <div className="space-y-1 pl-2 border-l border-emerald-500/30">
                                    <span className="text-[10px] text-emerald-450 font-mono block">Decisions Log:</span>
                                    <ul className="list-disc pl-4 space-y-1 text-slate-350 text-[11px] font-sans">
                                      {activeProject.architecture.decisions.map((dec, dIdx) => (
                                        <li key={dIdx}>{dec}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </motion.div>
                              )}
                            </AnimatePresence>
                          </div>
                        </div>
                      </div>
                    )}

                    {activeTab === "notes" && (
                      <div className="bg-slate-900/30 border border-slate-900 p-4 md:p-6 rounded text-slate-300 text-xs leading-relaxed select-text font-sans space-y-4">
                        <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-2 select-none">// engineering_reflection_log</p>
                        
                        <div>
                          <h4 className="text-[#10b981] font-mono text-[11px] font-bold tracking-wide uppercase mb-1">1. Why It Was Built</h4>
                          <p className="text-slate-350 font-sans text-xs leading-relaxed">{activeProject.whyBuilt}</p>
                        </div>

                        <div>
                          <h4 className="text-[#10b981] font-mono text-[11px] font-bold tracking-wide uppercase mb-1">2. Biggest Challenge</h4>
                          <p className="text-slate-350 font-sans text-xs leading-relaxed">{activeProject.challenge}</p>
                        </div>

                        <div>
                          <h4 className="text-[#10b981] font-mono text-[11px] font-bold tracking-wide uppercase mb-1">3. Lessons Learned</h4>
                          <p className="text-slate-350 font-sans text-xs leading-relaxed">{(activeProject.impact.lessons || []).join(" ")}</p>
                        </div>

                        <div>
                          <h4 className="text-[#10b981] font-mono text-[11px] font-bold tracking-wide uppercase mb-1">4. How I would improve it today</h4>
                          <p className="text-slate-350 font-sans text-xs leading-relaxed">{activeProject.futureImprovement}</p>
                        </div>

                        {/* Handwritten quote easter-egg */}
                        <div className="border-t border-slate-900/60 pt-4 mt-2 font-mono text-[10px] text-slate-500 italic select-none">
                          &quot;A system should be designed to solve human bottlenecks first, and run on optimized pipelines second.&quot;
                          <span className="block text-right mt-1 text-[#10b981] font-bold">— Krishi Chheda</span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Action Links */}
                  <div className="flex flex-wrap items-center gap-4 pt-4 text-xs border-t border-slate-900 mt-4 select-none">
                    {activeProject.githubUrl && (
                      <a
                        href={activeProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>./explore-repo</span>
                      </a>
                    )}
                    {activeProject.liveUrl && (
                      <a
                        href={activeProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-slate-400 hover:text-cyan-400 transition-colors"
                      >
                        <Play className="w-3 h-3" />
                        <span>./run-instance</span>
                      </a>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>

            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
