"use client";

import { useLayoutEffect } from "react";
import gsap from "gsap";
import { GitCommit } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useTerminalReveal } from "@/hooks/useTerminalReveal";
import { useGitHubTelemetry } from "@/hooks/useGitHubTelemetry";
import { projectsData } from "@/lib/data";
import { formatUtc, repoKey } from "@/lib/github";
import { DUR, EASE, MOTION_OK, RISE } from "@/lib/motion";

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
  const repoCount = recentRepos.length;

  // Activity cards arrive after the fetch, so they miss the reveal query; give them their own short entrance.
  // gsap.from ends at the natural (visible) state, so the cards are never left hidden whichever finishes first.
  useLayoutEffect(() => {
    if (loadingGit || repoCount === 0) return;
    const mm = gsap.matchMedia();
    mm.add(
      MOTION_OK,
      () => {
        gsap.from("[data-activity-card]", { y: RISE.item, opacity: 0, duration: DUR.standard, ease: EASE, stagger: 0.04 });
      },
      sectionRef
    );
    return () => mm.revert();
  }, [loadingGit, repoCount, sectionRef]);

  return (
    <section ref={sectionRef} id="currently-building" className="py-24 border-t border-rule">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader num="04" title="Currently Building" command="tail -f currently-building.log" meta="active work · roadmap" />

        <div className="border border-rule terminal-highlight" data-reveal="panel">
          <div className="grid grid-cols-1 md:grid-cols-2">
            {activeBuilds.map((proj, i) => {
              const githubUrl = projectsData.find((p) => p.title === proj.name)?.githubUrl;
              const commit = githubUrl ? telemetry?.repos[repoKey(githubUrl)]?.latestCommit : null;
              return (
                <div
                  key={proj.name}
                  data-reveal="item"
                  className={`min-w-0 p-6 space-y-5 ${i > 0 ? "border-t md:border-t-0 md:border-l border-rule" : ""}`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-rule pb-3">
                    <h3 className="text-base font-bold text-ink uppercase tracking-tight">{proj.name}</h3>
                    <span className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-accent">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                      {proj.developmentStatus}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <span className="block text-[11px] uppercase tracking-[0.18em] text-ink-faint">Current Focus</span>
                    <p className="text-sm leading-relaxed text-ink-soft">{proj.currentFocus}</p>
                  </div>

                  {proj.activeWork.length > 0 && (
                    <div className="space-y-1.5">
                      <span className="block text-[11px] uppercase tracking-[0.18em] text-ink-faint">Active Tasks</span>
                      <ul className="space-y-1.5 text-sm leading-relaxed text-ink-soft">
                        {proj.activeWork.map((task, tIdx) => (
                          <li key={tIdx} className="flex items-start gap-2">
                            <span className="text-accent select-none shrink-0">↳</span>
                            <span>{task}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-1.5">
                    <span className="block text-[11px] uppercase tracking-[0.18em] text-ink-faint">Future Roadmap</span>
                    <ul className="space-y-1.5 text-sm leading-relaxed text-ink-soft">
                      {proj.roadmap.map((step, rIdx) => (
                        <li key={rIdx} data-reveal="item" className="flex items-start gap-2">
                          <span className="text-accent select-none shrink-0">→</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {commit && (
                    <div className="pt-3 border-t border-rule space-y-1 text-[11px]">
                      <div className="flex items-baseline gap-2 min-w-0">
                        <span className="uppercase tracking-[0.18em] text-ink-faint shrink-0">Latest Commit</span>
                        <a
                          href={commit.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-gold font-bold shrink-0 underline decoration-dotted hover:text-accent-2 transition-colors duration-150"
                        >
                          {commit.sha}
                        </a>
                        <span className="text-ink-soft truncate" title={commit.message}>&quot;{commit.message}&quot;</span>
                      </div>
                      <div className="text-ink-faint">{formatUtc(commit.date)}</div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Recent GitHub activity for portfolio repos only; hidden entirely if GitHub is unavailable */}
          {(loadingGit || recentRepos.length > 0) && (
            <div className="border-t border-rule p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2 mb-4">
                <h4 className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-[0.18em] text-accent">
                  <GitCommit size={14} />
                  <span>Recent GitHub Activity</span>
                </h4>
                {telemetry && (
                  <span className="text-[11px] text-ink-faint">
                    {telemetry.stale ? "cached snapshot from " : "as of "}
                    {formatUtc(telemetry.fetchedAt)}
                  </span>
                )}
              </div>

              {loadingGit ? (
                <div className="text-[11px] text-ink-faint">Fetching repository data…</div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 text-[11px]">
                  {recentRepos.map((repo) => (
                    <a
                      key={repo.name}
                      data-activity-card
                      href={repo.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="min-w-0 border border-rule bg-bg-2 p-3 space-y-2 hover:border-accent transition-colors duration-150"
                    >
                      <div className="flex items-start justify-between gap-2">
                        <span className="text-ink font-bold truncate" title={repo.name}>{repo.name}</span>
                        {repo.language && <span className="text-accent shrink-0">{repo.language}</span>}
                      </div>
                      {repo.latestCommit && (
                        <div className="text-ink-soft truncate" title={repo.latestCommit.message}>
                          &quot;{repo.latestCommit.message}&quot;
                        </div>
                      )}
                      <div className="text-ink-faint pt-2 border-t border-rule">
                        Last push: {formatUtc(repo.pushedAt)}
                      </div>
                    </a>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="border-t border-rule px-6 py-2 flex flex-wrap justify-between gap-2 text-[11px] text-ink-faint">
            <span>Tracking {activeBuilds.length} active building modules</span>
            <span>currently-building.md</span>
          </div>
        </div>
      </div>
    </section>
  );
}
