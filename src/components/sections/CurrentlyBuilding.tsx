"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Hammer, ArrowRight, PlayCircle, GitCommit } from "lucide-react";

interface ActiveBuild {
  name: string;
  currentFocus: string;
  developmentStatus: string;
  roadmap: string[];
  activeWork: string[];
}

const activeBuilds: ActiveBuild[] = [
  {
    name: "Accessible Vision",
    currentFocus: "Model quantization & edge pipeline latency minimization.",
    developmentStatus: "Active Refinement (Version 1.2-alpha)",
    roadmap: [
      "Integrate multi-camera spatial mapping for outdoor path layout parsing.",
      "Implement client-side offline audio synthesis queues for lightweight screen-free usage."
    ],
    activeWork: [
      "Quantizing YOLOv8 model weights to reduce edge processor memory footprints.",
      "Testing spoken hazard description scheduling queues to prevent frame-dropping under load.",
      "Refining distance estimations on edge camera calibration matrices."
    ]
  },
  {
    name: "ClinicalBrief",
    currentFocus: "Audio diarization accuracy & secure patient metadata compliance layers.",
    developmentStatus: "Active Development (Sprint 4)",
    roadmap: [
      "Integrate live streaming WebSocket audio transcriptions.",
      "Add support for offline parsing using local LLM inference engines (Llama-3-8B) on secure servers."
    ],
    activeWork: [
      "Expanding speech diarization libraries to support multiple overlapping speaker voices.",
      "Hardening client-side metadata sanitization filters before API request dispatches.",
      "Profiling Next.js client-side polling latency to optimize patient brief loading states."
    ]
  }
];

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
  },
  "AuraLens-AI": {
    name: "AuraLens-AI",
    stars: 1,
    forks: 0,
    language: "Python",
    updatedAt: "2026-06-23T11:20:00Z",
    latestCommit: {
      hash: "f4a8b2c",
      message: "feat: integrate ChromaDB with local CLIP vector search embedding index",
      date: "2026-06-23T11:20:00Z"
    }
  },
  "f1-telemetry-ai-dashboard": {
    name: "f1-telemetry-ai-dashboard",
    stars: 1,
    forks: 0,
    language: "TypeScript",
    updatedAt: "2026-06-22T16:45:10Z",
    latestCommit: {
      hash: "b7c2d9e",
      message: "feat: render throttle and brake inputs directly onto 2D track sectors",
      date: "2026-06-22T16:45:10Z"
    }
  },
  fastapi_backend: {
    name: "fastapi_backend",
    stars: 0,
    forks: 0,
    language: "Python",
    updatedAt: "2026-06-20T10:05:00Z",
    latestCommit: {
      hash: "a3d8e2f",
      message: "feat: implement photoplethysmography extraction and Scikit-learn regressors",
      date: "2026-06-20T10:05:00Z"
    }
  },
  "video-splitter": {
    name: "video-splitter",
    stars: 0,
    forks: 0,
    language: "Python",
    updatedAt: "2026-06-18T09:12:00Z",
    latestCommit: {
      hash: "c5e9f1a",
      message: "docs: add installation guides for Streamlit and local FFmpeg binary",
      date: "2026-06-18T09:12:00Z"
    }
  }
};

export default function CurrentlyBuilding() {
  const [gitStats, setGitStats] = useState<any>(STATIC_TELEMETRY_FALLBACK);
  const [loadingGit, setLoadingGit] = useState(false);

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

  return (
    <section id="currently-building" className="py-24 relative overflow-hidden border-t border-slate-900/60">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Section Header CLI Prompt */}
        <div className="font-mono text-xs md:text-sm text-slate-500 mb-8 flex items-center space-x-2 select-none">
          <span className="text-[#10b981]">krishi@stack:~$</span>
          <span className="text-slate-100">./currently-building --status</span>
        </div>

        {/* Workstation Console Widget */}
        <div className="w-full border border-slate-900 bg-slate-950/20 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono terminal-highlight">
          
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
          <div className="p-6 md:p-8 space-y-8 select-text">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {activeBuilds.map((proj, idx) => {
                return (
                  <motion.div
                    key={proj.name}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="border border-slate-900 bg-slate-950/40 p-6 rounded-lg flex flex-col justify-between space-y-6"
                  >
                    {/* Project Identification */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-900 pb-3">
                        <div className="flex items-center gap-2">
                          <span className="text-slate-500 text-xs font-bold">📂</span>
                          <h3 className="text-base font-bold text-white uppercase tracking-tight">
                            {proj.name}
                          </h3>
                        </div>
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-900/50 text-[#10b981] font-mono text-[9px] font-bold uppercase tracking-wider select-none animate-pulse">
                          <span className="w-1 h-1 rounded-full bg-[#10b981]" />
                          {proj.developmentStatus}
                        </span>
                      </div>

                      {/* Current Focus */}
                      <div className="space-y-1">
                        <span className="text-[9.5px] text-slate-500 block uppercase font-bold tracking-wider select-none">
                          [Current Focus]
                        </span>
                        <p className="text-xs text-slate-200 font-sans select-text">
                          {proj.currentFocus}
                        </p>
                      </div>

                      {/* Active Work Tasks */}
                      <div className="space-y-1.5">
                        <span className="text-[9.5px] text-slate-500 block uppercase font-bold tracking-wider select-none">
                          [Active Tasks]
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-400 font-sans">
                          {proj.activeWork.map((task, tIdx) => (
                            <li key={tIdx} className="flex items-start gap-2 select-text">
                              <span className="text-cyan-400 select-none shrink-0 mt-0.5">↳</span>
                              <span>{task}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Roadmap Milestones */}
                      <div className="space-y-1.5">
                        <span className="text-[9.5px] text-slate-500 block uppercase font-bold tracking-wider select-none">
                          [Future Roadmap]
                        </span>
                        <ul className="space-y-1.5 text-xs text-slate-400 font-sans">
                          {proj.roadmap.map((step, rIdx) => (
                            <li key={rIdx} className="flex items-start gap-2 select-text">
                              <span className="text-[#10b981] select-none shrink-0 mt-0.5">→</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Live Commit Telemetry for flagship builds */}
                      {proj.name === "Accessible Vision" && gitStats?.AccessVision && (
                        <div className="mt-4 pt-3 border-t border-slate-900/60 flex flex-col space-y-1 text-[10px]">
                          <div className="flex items-center space-x-1.5 truncate">
                            <span className="text-slate-500 block uppercase font-bold text-[8.5px] select-none">
                              [Latest Commit]:
                            </span>
                            <span className="text-amber-500 font-mono font-bold shrink-0">
                              [{gitStats.AccessVision.latestCommit.hash}]
                            </span>
                            <span className="text-slate-300 truncate">
                              &quot;{gitStats.AccessVision.latestCommit.message}&quot;
                            </span>
                          </div>
                          <div className="text-[9px] text-slate-500">
                            Pushed: {new Date(gitStats.AccessVision.latestCommit.date).toLocaleString()}
                          </div>
                        </div>
                      )}
                    </div>

                  </motion.div>
                );
              })}
            </div>

            {/* Live GitHub Repository Activity Stream */}
            <div className="border-t border-slate-900 pt-6">
              <h4 className="text-[#10b981] font-mono text-xs font-bold uppercase tracking-wider mb-4 flex items-center gap-2 select-none">
                <GitCommit size={14} className="text-[#10b981] animate-pulse" />
                <span>Live GitHub Repository Activity Stream</span>
              </h4>

              {loadingGit ? (
                <div className="text-xs text-slate-500 animate-pulse">Syncing telemetry data...</div>
              ) : gitStats ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-[10px]">
                  {Object.values(gitStats)
                    .filter((repo: any) => repo.name !== "portfolio" && repo.name !== "ClinicalBrief" && repo.name !== "ai-traffic-system")
                    .sort((a: any, b: any) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
                    .slice(0, 6)
                    .map((repo: any) => (
                      <div key={repo.name} className="border border-slate-900 bg-slate-950/60 p-3 rounded hover:border-slate-800 transition-all flex flex-col justify-between space-y-2">
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-slate-100 font-bold truncate" title={repo.name}>{repo.name}</span>
                          <span className="text-cyan-400 font-semibold px-1 rounded bg-slate-900 border border-slate-850 shrink-0 text-[8.5px]">
                            {repo.language}
                          </span>
                        </div>
                        <div className="text-slate-400 text-[9.5px] truncate font-mono">
                          {repo.latestCommit ? `"${repo.latestCommit.message}"` : 'No recent pushes'}
                        </div>
                        <div className="flex justify-between items-center text-[8.5px] text-slate-500 pt-1 border-t border-slate-900/60">
                          <span>Updated: {new Date(repo.updatedAt).toLocaleDateString()}</span>
                          <span className="flex items-center gap-1">⭐ {repo.stars}</span>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-xs text-slate-500 italic">Telemetry stream offline.</div>
              )}
            </div>

          </div>

          {/* Footer bar */}
          <div className="bg-slate-950/95 px-4 py-2 border-t border-slate-900 flex justify-between items-center text-[9px] text-slate-650 select-none">
            <span>Tracking 2 active building modules</span>
            <span>currently-building.md</span>
          </div>

        </div>

      </div>
    </section>
  );
}
