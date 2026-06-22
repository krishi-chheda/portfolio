"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, FileText, Terminal as TermIcon, ExternalLink, GitBranch, FolderOpen, Play } from "lucide-react";
import { Github } from "@/components/ui/Icons";
import { projectsData, Project } from "@/lib/data";

export default function Projects() {
  const [selectedId, setSelectedId] = useState("accessible-vision");
  const [activeTab, setActiveTab] = useState<"overview" | "architecture" | "impact">("overview");
  const [blink, setBlink] = useState(true);

  // Command Palette event listener
  useEffect(() => {
    const handleSelectProject = (e: any) => {
      const projId = e.detail?.id;
      if (projId && projectsData.some((p) => p.id === projId)) {
        setSelectedId(projId);
        setActiveTab("overview");
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
    <section id="projects" className="py-24 relative overflow-hidden border-t border-slate-900/60 select-none">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header CLI Prompt */}
        <div className="font-mono text-xs md:text-sm text-slate-500 mb-8 flex items-center space-x-2 select-none">
          <span className="text-[#10b981]">krishi@stack:~$</span>
          <span className="text-slate-100">ls -la projects/</span>
        </div>

        {/* Integrated IDE / Explorer Panel */}
        <div className="w-full border border-slate-900 bg-slate-950/20 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono">
          
          {/* Editor Header Bar */}
          <div className="bg-slate-950/90 px-4 py-2.5 border-b border-slate-900 flex justify-between items-center select-none text-[10px] text-slate-500">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/40 border border-red-500/20" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/40 border border-yellow-500/20" />
              <span className="w-2 h-2 rounded-full bg-green-500/40 border border-green-500/20" />
            </div>
            
            <div className="flex items-center space-x-2 text-[10px]">
              <FolderOpen size={10} className="text-[#10b981]" />
              <span>projects/{activeProject.id}/{activeTab}.md</span>
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
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTab("overview");
                              }}
                              className={`flex items-center space-x-1.5 py-0.5 px-1.5 w-full text-left rounded transition-colors cursor-pointer ${
                                activeTab === "overview" ? "text-cyan-400 font-bold bg-slate-900/40" : "text-slate-500 hover:text-slate-300"
                              }`}
                            >
                              <span className="text-slate-700">├──</span>
                              <FileText size={10} className={activeTab === "overview" ? "text-cyan-400" : "text-slate-600"} />
                              <span className="truncate">overview.md</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTab("architecture");
                              }}
                              className={`flex items-center space-x-1.5 py-0.5 px-1.5 w-full text-left rounded transition-colors cursor-pointer ${
                                activeTab === "architecture" ? "text-cyan-400 font-bold bg-slate-900/40" : "text-slate-500 hover:text-slate-300"
                              }`}
                            >
                              <span className="text-slate-700">├──</span>
                              <FileText size={10} className={activeTab === "architecture" ? "text-cyan-400" : "text-slate-600"} />
                              <span className="truncate">architecture.md</span>
                            </button>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setActiveTab("impact");
                              }}
                              className={`flex items-center space-x-1.5 py-0.5 px-1.5 w-full text-left rounded transition-colors cursor-pointer ${
                                activeTab === "impact" ? "text-cyan-400 font-bold bg-slate-900/40" : "text-slate-500 hover:text-slate-300"
                              }`}
                            >
                              <span className="text-slate-700">└──</span>
                              <FileText size={10} className={activeTab === "impact" ? "text-cyan-400" : "text-slate-600"} />
                              <span className="truncate">impact.md</span>
                            </button>
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
                  onClick={() => setActiveTab("overview")}
                  className={`px-2.5 py-1 rounded flex items-center gap-1.5 border transition-all cursor-pointer ${
                    activeTab === "overview"
                      ? "bg-slate-900 border-slate-800 text-cyan-400 font-bold"
                      : "border-transparent hover:text-slate-300"
                  }`}
                >
                  <FileText size={9} className={activeTab === "overview" ? "text-cyan-400" : "text-slate-600"} />
                  overview.md
                </button>
                <button
                  onClick={() => setActiveTab("architecture")}
                  className={`px-2.5 py-1 rounded flex items-center gap-1.5 border transition-all cursor-pointer ${
                    activeTab === "architecture"
                      ? "bg-slate-900 border-slate-800 text-cyan-400 font-bold"
                      : "border-transparent hover:text-slate-350"
                  }`}
                >
                  <FileText size={9} className={activeTab === "architecture" ? "text-cyan-400" : "text-slate-600"} />
                  architecture.md
                </button>
                <button
                  onClick={() => setActiveTab("impact")}
                  className={`px-2.5 py-1 rounded flex items-center gap-1.5 border transition-all cursor-pointer ${
                    activeTab === "impact"
                      ? "bg-slate-900 border-slate-800 text-cyan-400 font-bold"
                      : "border-transparent hover:text-slate-350"
                  }`}
                >
                  <FileText size={9} className={activeTab === "impact" ? "text-cyan-400" : "text-slate-600"} />
                  impact.md
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
                      cat projects/{activeProject.id}/{activeTab}.md
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white uppercase select-text">
                      {activeProject.title}
                    </h3>
                  </div>

                  {/* Dynamic Tab Content rendering */}
                  {activeTab === "overview" && (
                    <div className="space-y-6 flex-1 flex flex-col justify-between">
                      {/* Project Overview Sheet */}
                      <div className="bg-slate-900/30 border border-slate-900 p-4 md:p-6 rounded text-slate-300 text-xs leading-relaxed select-text font-sans space-y-4">
                        <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-2 select-none">[PROJECT OVERVIEW]</p>
                        
                        <div>
                          <h4 className="text-[#10b981] font-mono text-[11px] font-bold tracking-wide uppercase mb-1">Problem:</h4>
                          <p className="text-slate-300 font-mono text-xs">{activeProject.overview.problem}</p>
                        </div>

                        <div className="mt-3">
                          <h4 className="text-[#10b981] font-mono text-[11px] font-bold tracking-wide uppercase mb-1">Solution:</h4>
                          <p className="text-slate-300 font-mono text-xs">{activeProject.overview.solution}</p>
                        </div>

                        <div className="mt-3">
                          <h4 className="text-[#10b981] font-mono text-[11px] font-bold tracking-wide uppercase mb-1">Technologies:</h4>
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
                      </div>
                    </div>
                  )}

                  {activeTab === "architecture" && (
                    <div className="space-y-6 flex-1 flex flex-col justify-between">
                      {/* Architecture View */}
                      <div className="bg-slate-900/30 border border-slate-900 p-4 md:p-6 rounded text-slate-300 text-xs leading-relaxed select-text font-sans space-y-4">
                        <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-3 select-none">[SYSTEM_ARCHITECTURE_MAP]</p>
                        
                        {/* Interactive flow pipeline */}
                        <div className="flex flex-col space-y-3 font-mono">
                          {activeProject.architecture.flow.map((node, index) => {
                            const isLast = index === activeProject.architecture.flow.length - 1;
                            return (
                              <div key={index} className="flex flex-col items-center md:items-stretch">
                                <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-3 w-full bg-slate-950/60 p-3 border border-slate-900 rounded-lg group hover:border-[#10b981]/40 transition-colors">
                                  <div className="w-6 h-6 rounded-full bg-slate-900 border border-slate-800 text-[#10b981] flex items-center justify-center text-[10px] font-bold shrink-0">
                                    {index + 1}
                                  </div>
                                  <div className="flex-1 text-center md:text-left">
                                    <div className="text-slate-100 font-bold text-xs uppercase">{node.label}</div>
                                    <div className="text-slate-400 text-[10px] mt-0.5 leading-snug">{node.description}</div>
                                  </div>
                                </div>
                                {!isLast && (
                                  <div className="py-1 flex justify-center md:pl-6 md:justify-start">
                                    <span className="text-[#10b981]/50 text-xs animate-bounce">↓</span>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                        </div>

                        {/* Engineering decisions description */}
                        <div className="border-t border-slate-900 pt-4 mt-4 space-y-2">
                          <h4 className="text-[#10b981] font-mono text-[11px] font-bold tracking-wide uppercase select-none">[TECHNICAL_DECISIONS]</h4>
                          <ul className="space-y-2 text-[11px] text-slate-400 leading-relaxed list-disc pl-4 font-mono">
                            {activeProject.architecture.decisions.map((decision, dIdx) => (
                              <li key={dIdx}>{decision}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

                  {activeTab === "impact" && (
                    <div className="space-y-6 flex-1 flex flex-col justify-between">
                      {/* Project Impact Sheet */}
                      <div className="bg-slate-900/30 border border-slate-900 p-4 md:p-6 rounded text-slate-300 text-xs leading-relaxed select-text font-sans space-y-4">
                        <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-2 select-none">[PROJECT_IMPACT]</p>
                        
                        <div>
                          <h4 className="text-[#10b981] font-mono text-[11px] font-bold tracking-wide uppercase mb-2 select-none">Achievements:</h4>
                          <ul className="space-y-2.5">
                            {activeProject.impact.achievements.map((achievement, aIdx) => (
                              <li key={aIdx} className="flex items-start gap-2.5 font-mono text-[11px] text-slate-350">
                                <span className="text-[#10b981] select-none shrink-0">✓</span>
                                <span>{achievement}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="border-t border-slate-900 pt-4 mt-4">
                          <h4 className="text-[#10b981] font-mono text-[11px] font-bold tracking-wide uppercase mb-2 select-none">Lessons Learned:</h4>
                          <ul className="space-y-2.5">
                            {activeProject.impact.lessons.map((lesson, lIdx) => (
                              <li key={lIdx} className="flex items-start gap-2.5 font-mono text-[11px] text-slate-400 leading-relaxed">
                                <span className="text-cyan-400 select-none shrink-0">•</span>
                                <span>{lesson}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}

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
