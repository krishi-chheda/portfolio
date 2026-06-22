"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Folder, FileText, Terminal as TermIcon, ExternalLink, GitBranch, FolderOpen, Play } from "lucide-react";
import { Github } from "@/components/ui/Icons";
import { projectsData, Project } from "@/lib/data";

export default function Projects() {
  const [selectedId, setSelectedId] = useState("accessible-vision");
  const [blink, setBlink] = useState(true);

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
              <span>projects/{activeProject.id}/project.md</span>
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

                        {/* File Item (project.md) inside folder */}
                        {isSelected && (
                          <div className="pl-6 flex items-center space-x-2 text-[11px] text-slate-300 font-bold select-none bg-slate-900/20 py-0.5 border-l-2 border-[#10b981]/50 ml-6">
                            <span className="text-slate-800">└──</span>
                            <FileText size={10} className="text-cyan-400" />
                            <span className="text-cyan-400">project.md</span>
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
                <span className="bg-slate-900 border border-slate-800 text-cyan-400 px-2.5 py-1 rounded flex items-center gap-1.5">
                  <FileText size={9} />
                  project.md
                  <span className="text-slate-600 hover:text-white cursor-pointer">×</span>
                </span>
                <span className="px-2 py-1 flex items-center gap-1 hover:text-slate-350 cursor-pointer">
                  package.json
                </span>
                <span className="px-2 py-1 flex items-center gap-1 hover:text-slate-350 cursor-pointer">
                  route.ts
                </span>
              </div>

              {/* Editor Code Sheet Body */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeProject.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.1 }}
                  className="space-y-6 text-left flex-1"
                >
                  {/* File title heading print */}
                  <div className="space-y-1">
                    <span className="text-[10px] text-[#10b981] font-bold tracking-widest uppercase flex items-center gap-1.5 select-none">
                      <span className="w-1.5 h-1.5 bg-[#10b981] rounded-full animate-ping" />
                      cat projects/{activeProject.id}/project.md
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-white uppercase select-text">
                      {activeProject.title}
                    </h3>
                  </div>

                  {/* Project description story text */}
                  <div className="bg-slate-900/30 border border-slate-900 p-4 rounded text-slate-350 text-xs leading-relaxed select-text font-sans">
                    <p className="font-mono text-[9px] text-slate-500 uppercase tracking-widest mb-1.5 select-none">[SYSTEMS_OVERVIEW]</p>
                    {activeProject.story}
                  </div>

                  {/* Execution Metrics logs */}
                  <div className="border-l-2 border-[#10b981]/40 pl-4 py-0.5 space-y-1.5">
                    <span className="text-[9px] text-[#10b981] font-bold block uppercase tracking-wider select-none">
                      [EXECUTION_METRICS]
                    </span>
                    <ul className="space-y-1 text-[11px] text-slate-450 select-text">
                      {activeProject.metrics.map((metric, mIdx) => (
                        <li key={mIdx} className="flex items-start gap-2">
                          <span className="text-[#10b981] select-none">-</span>
                          <span>{metric}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Technologies tags list */}
                  <div className="space-y-1.5 pt-1">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest select-none">
                      Technologies Stack
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {activeProject.techStack.map((tech) => (
                        <span
                          key={tech}
                          className="text-[9px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 select-none"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
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
