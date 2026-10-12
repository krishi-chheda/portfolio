"use client";

import { Hammer, GitCommit } from "lucide-react";
import { useTerminalReveal } from "@/hooks/useTerminalReveal";
import { useGitHubTelemetry } from "@/hooks/useGitHubTelemetry";
import { projectsData } from "@/lib/data";
import { formatUtc, repoKey } from "@/lib/github";

interface ActiveBuild {
  name: string;
  currentFocus: string;
  developmentStatus: string;
  roadmap: string[];
  activeWork: string[];
}

// Roadmap items come from each project's README; add activeWork only for verified in-progress tasks.
const activeBuilds: ActiveBuild[] = [
  {
    name: "AccessVision",
    currentFocus: "Grounded visual question answering and predictable latency under concurrent load.",
    developmentStatus: "Active Refinement",
    roadmap: [
      "Port YOLO to ONNX and run models in the browser via WebAssembly.",
      "Navigation mode that announces path obstructions and depth changes.",
      "Multi-language speech (Spanish, French, German)."
    ],
    activeWork: []
  },
  {
    name: "ClinicalBrief",
    currentFocus: "Human-reviewed AI findings, a grounded local-LLM copilot and record search over synthetic FHIR data.",
    developmentStatus: "Research Prototype",
    roadmap: [
      "Embedding-based semantic search over clinical records.",
      "Evaluate extraction against labelled data before reporting any accuracy figure."
    ],
    activeWork: []
  }
];

export default function CurrentlyBuilding() {
  const sectionRef = useTerminalReveal<HTMLElement>();
  const { data: telemetry, loading: loadingGit } = useGitHubTelemetry();
  const recentRepos = telemetry
    ? Object.values(telemetry.repos).sort((a, b) => b.pushedAt.localeCompare(a.pushedAt)).slice(0, 6)
    : [];

  return (
    <section ref={sectionRef} id="currently-building" className="py-24 relative overflow-hidden border-t border-slate-900/60">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* Section Header CLI Prompt */}
        <div className="font-mono text-xs md:text-sm text-slate-500 mb-8 flex items-center space-x-2 select-none">
          <span className="text-[#10b981]">krishi@stack:~$</span>
          <span data-reveal="command" className="text-slate-100">./currently-building --status</span>
        </div>

        {/* Workstation Console Widget */}
        <div className="w-full border border-slate-900 bg-slate-950/20 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono terminal-highlight" data-reveal="panel">
          
          {/* Header */}
          <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-900 flex justify-between items-center select-none text-[10px] text-slate-500">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/40 border border-red-500/20" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/40 border border-yellow-500/20" />
              <span className="w-2 h-2 rounded-full bg-green-500/40 border border-green-500/20" />
            </div>
            <span>build_pipeline // currently_building</span>
            <div className="flex items-center space-x-1.5 bg-slate-900 px-2 py-0.5 rounded text-[10px] border border-slate-800">
              <Hammer size={10} className="text-cyan-400" />
              <span>pipeline_active</span>
            </div>
          </div>

          {/* Grid list of active builds */}
          <div className="p-6 md:p-8 space-y-8 select-text">
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
              {activeBuilds.map((proj) => {
                const githubUrl = projectsData.find((p) => p.title === proj.name)?.githubUrl;
                const commit = githubUrl ? telemetry?.repos[repoKey(githubUrl)]?.latestCommit : null;
                return (
                  <div key={proj.name} data-reveal="item" className="border border-slate-900 bg-slate-950/40 p-6 rounded-lg flex flex-col justify-between space-y-6"
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
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded bg-emerald-950/40 border border-emerald-900/50 text-[#10b981] font-mono text-[10px] font-bold uppercase tracking-wider select-none">
                          <span className="w-1 h-1 rounded-full bg-[#10b981]" />
                          {proj.developmentStatus}
                        </span>
                      </div>

                      {/* Current Focus */}
                      <div className="space-y-1">
                        <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider select-none">
                          [Current Focus]
                        </span>
                        <p className="text-xs text-slate-200 font-sans select-text">
                          {proj.currentFocus}
                        </p>
                      </div>

                      {/* Active Work Tasks */}
                      {proj.activeWork.length > 0 && (
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider select-none">
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
                      )}

                      {/* Roadmap Milestones */}
                      <div className="space-y-1.5">
                        <span className="text-[10px] text-slate-500 block uppercase font-bold tracking-wider select-none">
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

                      {/* Latest commit from GitHub, when available */}
                      {commit && (
                        <div className="mt-4 pt-3 border-t border-slate-900/60 flex flex-col space-y-1 text-[10px]">
                          <div className="flex items-center gap-1.5 min-w-0">
                            <span className="text-slate-500 uppercase font-bold select-none shrink-0">[Latest Commit]:</span>
                            <a href={commit.url} target="_blank" rel="noopener noreferrer" className="text-amber-500 font-mono font-bold shrink-0 hover:text-amber-400 underline decoration-dotted">
                              {commit.sha}
                            </a>
                            <span className="text-slate-300 truncate" title={commit.message}>&quot;{commit.message}&quot;</span>
                          </div>
                          <div className="text-slate-500">{formatUtc(commit.date)}</div>
                        </div>
                      )}
                    </div>

                  </div>
                );
              })}
            </div>

            {/* Recent GitHub activity for portfolio repos only; hidden entirely if GitHub is unavailable */}
            {(loadingGit || recentRepos.length > 0) && (
              <div className="border-t border-slate-900 pt-6">
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <h4 className="text-[#10b981] font-mono text-xs font-bold uppercase tracking-wider flex items-center gap-2 select-none">
                    <GitCommit size={14} className="text-[#10b981]" />
                    <span>Recent GitHub Activity</span>
                  </h4>
                  {telemetry && (
                    <span className="text-[10px] text-slate-500 font-mono">
                      {telemetry.stale ? "cached snapshot from " : "as of "}
                      {formatUtc(telemetry.fetchedAt)}
                    </span>
                  )}
                </div>

                {loadingGit ? (
                  <div className="text-xs text-slate-500">Fetching repository data…</div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 text-[10px]">
                    {recentRepos.map((repo) => (
                      <a
                        key={repo.name}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="border border-slate-900 bg-slate-950/60 p-3 rounded hover:border-slate-700 transition-colors duration-150 flex flex-col justify-between space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <span className="text-slate-100 font-bold truncate" title={repo.name}>{repo.name}</span>
                          {repo.language && (
                            <span className="text-cyan-400 font-semibold px-1 rounded bg-slate-900 border border-slate-800 shrink-0">
                              {repo.language}
                            </span>
                          )}
                        </div>
                        {repo.latestCommit && (
                          <div className="text-slate-400 truncate font-mono" title={repo.latestCommit.message}>
                            &quot;{repo.latestCommit.message}&quot;
                          </div>
                        )}
                        <div className="text-slate-500 pt-1 border-t border-slate-900/60">
                          Last push: {formatUtc(repo.pushedAt)}
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>

          {/* Footer bar */}
          <div className="bg-slate-950/95 px-4 py-2 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-650 select-none">
            <span>Tracking {activeBuilds.length} active building modules</span>
            <span>currently-building.md</span>
          </div>

        </div>

      </div>
    </section>
  );
}
