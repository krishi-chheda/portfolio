"use client";

import { useState, useEffect, useLayoutEffect, useCallback, useRef } from "react";
import gsap from "gsap";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Github } from "@/components/ui/Icons";
import SectionHeader from "@/components/ui/SectionHeader";
import { projectsData } from "@/lib/data";
import { useReducedMotion } from "@/hooks/useReducedMotion";
import { useGitHubTelemetry } from "@/hooks/useGitHubTelemetry";
import { formatUtc, repoKey } from "@/lib/github";
import { useTerminalReveal } from "@/hooks/useTerminalReveal";
import { EASE, MOTION_OK } from "@/lib/motion";

type Tab = "details" | "architecture" | "notes";

const TABS: { id: Tab; file: string }[] = [
  { id: "details", file: "details.md" },
  { id: "architecture", file: "architecture.json" },
  { id: "notes", file: "engineering_notes.txt" },
];

const LABEL = "text-[11px] uppercase tracking-[0.18em] text-ink-faint";
const HEADING = "text-[11px] uppercase tracking-[0.18em] text-accent font-bold mb-1.5";
const BODY = "text-sm leading-relaxed text-ink-soft";

export default function Projects() {
  const sectionRef = useTerminalReveal<HTMLElement>();
  const [selectedId, setSelectedId] = useState("accessible-vision");
  const [blink, setBlink] = useState(true);
  const { data: telemetry, loading: loadingGit } = useGitHubTelemetry();
  const [activeTab, setActiveTab] = useState<Tab>("details");
  const [decisionsOpen, setDecisionsOpen] = useState(false);
  const prefersReducedMotion = useReducedMotion();

  // Switching project always reopens it on the details tab with decisions collapsed
  const selectProject = useCallback((id: string) => {
    setSelectedId(id);
    setDecisionsOpen(false);
    setActiveTab("details");
  }, []);

  // Command Palette event listener
  useEffect(() => {
    const handleSelectProject = (e: Event) => {
      const projId = (e as CustomEvent<{ id?: string }>).detail?.id;
      if (projId && projectsData.some((p) => p.id === projId)) {
        selectProject(projId);
      }
    };
    window.addEventListener("select-project", handleSelectProject);
    return () => window.removeEventListener("select-project", handleSelectProject);
  }, [selectProject]);

  // Cursor blink
  useEffect(() => {
    if (prefersReducedMotion) return;
    const interval = setInterval(() => {
      setBlink((b) => !b);
    }, 550);
    return () => clearInterval(interval);
  }, [prefersReducedMotion]);

  const activeProject = projectsData.find((p) => p.id === selectedId) || projectsData[0];
  const repo = activeProject.githubUrl ? telemetry?.repos[repoKey(activeProject.githubUrl)] : undefined;
  const activeFile = TABS.find((t) => t.id === activeTab)!.file;
  const isActive = activeProject.overview.status.toLowerCase().includes("active");
  const contentKey = `${activeProject.id}-${activeTab}`;
  const contentRef = useRef<HTMLDivElement>(null);
  const decisionsRef = useRef<HTMLDivElement>(null);

  // New file/project content rises in (0.2s, decelerate); skipped under reduced motion
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!el) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => {
      gsap.fromTo(el, { opacity: 0, y: 6 }, { opacity: 1, y: 0, duration: 0.2, ease: EASE, clearProps: "opacity,transform" });
    });
    return () => mm.revert();
  }, [contentKey]);

  // Decisions accordion: height 0 <-> auto. Re-runs when the architecture tab (re)mounts the panel.
  useLayoutEffect(() => {
    const el = decisionsRef.current;
    if (!el) return;
    const tween = gsap.to(el, {
      height: decisionsOpen ? "auto" : 0,
      opacity: decisionsOpen ? 1 : 0,
      duration: prefersReducedMotion ? 0 : 0.2,
      ease: decisionsOpen ? EASE : "power2.in",
    });
    return () => {
      tween.kill();
    };
  }, [decisionsOpen, contentKey, prefersReducedMotion]);

  return (
    <section ref={sectionRef} id="projects" className="py-24 border-t border-rule">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader num="01" title="Projects" command="ls -la projects/" meta="4 featured · sorted by impact" />

        {/* Integrated IDE / Explorer Panel */}
        <div className="w-full min-w-0 border border-rule flex flex-col font-mono terminal-highlight" data-reveal="panel">
          {/* Editor Header Bar */}
          <div className="flex items-center justify-between gap-4 border-b border-rule bg-bg-2 px-4 py-2.5 select-none text-[11px] text-ink-faint">
            <span className="truncate min-w-0">projects/{activeProject.id}/{activeFile}</span>
            <span className="shrink-0">⎇ main</span>
          </div>

          {/* Editor Layout Grid */}
          <div className="grid grid-cols-1 md:grid-cols-12 items-stretch md:min-h-[460px]">
            {/* Sidebar File Explorer Tree */}
            <div className="md:col-span-3 min-w-0 border-b md:border-b-0 md:border-r border-rule p-3 md:p-4 text-xs text-ink-soft">
              <div data-reveal="item" className={`${LABEL} mb-3`}>File System Explorer</div>

              <div data-reveal="item" className="text-ink mb-1">projects/</div>
              <ul>
                {projectsData.map((project, idx) => {
                  const isSelected = selectedId === project.id;
                  const isLast = idx === projectsData.length - 1;

                  return (
                    <li key={project.id}>
                      <button
                        type="button"
                        data-reveal="item"
                        onClick={() => selectProject(project.id)}
                        aria-current={isSelected ? "true" : undefined}
                        className={`flex w-full min-w-0 items-center gap-1.5 py-1 text-left cursor-pointer transition-[color,translate] duration-150 ease-out motion-safe:active:translate-x-px ${
                          isSelected ? "text-accent font-bold" : "hover:text-accent-2"
                        }`}
                      >
                        <span className="text-ink-faint font-normal select-none shrink-0">{isLast ? "└──" : "├──"}</span>
                        <span className={`shrink-0 select-none ${isSelected ? "text-accent" : "text-transparent"}`}>▸</span>
                        <span className="truncate">{project.id}/</span>
                        {isSelected && <span className="text-accent select-none shrink-0">{blink ? "█" : ""}</span>}
                      </button>

                      {/* Files inside the selected folder: clicking one opens its tab */}
                      {isSelected && (
                        <ul className="pl-7 text-[11px]">
                          {TABS.map((t, fIdx) => {
                            const isOpen = activeTab === t.id;
                            return (
                              <li key={t.id}>
                                <button
                                  type="button"
                                  data-reveal="item"
                                  onClick={() => setActiveTab(t.id)}
                                  aria-current={isOpen ? "true" : undefined}
                                  className={`flex w-full min-w-0 items-center gap-1.5 py-0.5 text-left cursor-pointer transition-[color,translate] duration-150 ease-out motion-safe:active:translate-x-px ${
                                    isOpen ? "text-accent" : "text-ink-soft hover:text-accent-2"
                                  }`}
                                >
                                  <span className="text-ink-faint select-none shrink-0">{fIdx === TABS.length - 1 ? "└──" : "├──"}</span>
                                  <span className="truncate">{t.file}</span>
                                </button>
                              </li>
                            );
                          })}
                        </ul>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Code Editor Preview Window */}
            <div className="md:col-span-9 min-w-0 p-5 md:p-8 flex flex-col">
              {/* Underlined text tabs */}
              <div className="flex flex-wrap gap-x-5 gap-y-2 border-b border-rule mb-6 text-[11px] select-none">
                {TABS.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => setActiveTab(t.id)}
                    className={`-mb-px border-b pb-2 cursor-pointer transition-colors duration-150 ${
                      activeTab === t.id
                        ? "border-accent text-ink font-bold"
                        : "border-transparent text-ink-faint hover:text-accent-2"
                    }`}
                  >
                    {t.file}
                  </button>
                ))}
              </div>

              {/* Editor Code Sheet Body */}
              <div
                  key={contentKey}
                  ref={contentRef}
                  className="flex-1 flex flex-col gap-6 text-left min-w-0"
                >
                  {/* File title heading */}
                  <div className="space-y-2">
                    <span className={`${LABEL} block break-all select-none`}>
                      <span className="text-accent">cat</span> projects/{activeProject.id}/{activeFile}
                    </span>
                    <h3 className="text-xl md:text-2xl font-bold tracking-tight text-ink uppercase">
                      {activeProject.title}
                    </h3>
                  </div>

                  <div className="flex-1 space-y-5">
                    {activeTab === "details" && (
                      <>
                        <p className={`${LABEL} select-none`}>[PROJECT_SPECIFICATION]</p>

                        <div>
                          <h4 className={HEADING}>Problem:</h4>
                          <p className={BODY}>{activeProject.overview.problem}</p>
                        </div>

                        <div>
                          <h4 className={HEADING}>Solution:</h4>
                          <p className={BODY}>{activeProject.overview.solution}</p>
                        </div>

                        <div>
                          <h4 className={HEADING}>Tech Stack:</h4>
                          <div className="flex flex-wrap gap-1.5">
                            {activeProject.techStack.map((tech) => (
                              <span key={tech} className="border border-rule px-2 py-0.5 text-[11px] text-ink-soft transition-colors duration-150 hover:border-accent hover:text-ink">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div>
                          <h4 className={HEADING}>Key Outcome:</h4>
                          <p className="text-sm leading-relaxed text-ink font-bold">{activeProject.keyOutcome}</p>
                        </div>

                        <div>
                          <h4 className={HEADING}>Current Status:</h4>
                          <span className={`text-[11px] uppercase tracking-[0.18em] font-bold ${isActive ? "text-accent" : "text-gold"}`}>
                            ● {activeProject.overview.status}
                          </span>
                        </div>

                        {/* GitHub telemetry: real data only; renders nothing when unavailable */}
                        {activeProject.githubUrl && (loadingGit || repo) && (
                          <div className="border border-rule bg-bg-2 p-4 text-[11px] space-y-2">
                            <div className="flex flex-wrap items-center justify-between gap-2 select-none">
                              <span className="text-accent font-bold uppercase tracking-[0.18em]">[GITHUB]</span>
                              {telemetry && (
                                <span className="text-ink-faint">
                                  {telemetry.stale ? "cached snapshot from " : "as of "}
                                  {formatUtc(telemetry.fetchedAt)}
                                </span>
                              )}
                            </div>
                            {loadingGit ? (
                              <div className="text-ink-faint">Fetching repository data…</div>
                            ) : repo && (
                              <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1.5 border-t border-rule pt-2">
                                {repo.language && (
                                  <>
                                    <dt className="text-ink-faint">Language:</dt>
                                    <dd className="text-ink">{repo.language}</dd>
                                  </>
                                )}
                                <dt className="text-ink-faint">Last push:</dt>
                                <dd className="text-ink-soft">{formatUtc(repo.pushedAt)}</dd>
                                {repo.latestCommit && (
                                  <>
                                    <dt className="text-ink-faint">latest_commit:</dt>
                                    <dd className="min-w-0">
                                      <div className="flex min-w-0 items-center gap-1.5">
                                        <a
                                          href={repo.latestCommit.url}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                          className="text-gold shrink-0 underline decoration-dotted hover:text-accent-2"
                                        >
                                          {repo.latestCommit.sha}
                                        </a>
                                        <span className="text-ink-soft truncate" title={repo.latestCommit.message}>
                                          &quot;{repo.latestCommit.message}&quot;
                                        </span>
                                      </div>
                                      <div className="text-ink-faint">{formatUtc(repo.latestCommit.date)}</div>
                                    </dd>
                                  </>
                                )}
                              </dl>
                            )}
                          </div>
                        )}
                      </>
                    )}

                    {activeTab === "architecture" && (
                      <>
                        <p className="text-[11px] text-ink-faint select-none">{`{ "architecture_schema": "v1.0" }`}</p>

                        <div>
                          <h4 className={HEADING}>[Chosen Architecture]</h4>
                          <p className={BODY}>{activeProject.architectureExplain}</p>
                        </div>

                        <div className="border-t border-rule pt-5">
                          <h4 className={HEADING}>[System Flow Pipeline]</h4>
                          <ol className="space-y-3 mt-2">
                            {activeProject.architecture.flow.map((step, sIdx) => (
                              <li key={sIdx} className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-3">
                                <span className="text-accent font-bold text-[11px] shrink-0">
                                  [{sIdx + 1}] {step.label}:
                                </span>
                                <span className={BODY}>{step.description}</span>
                              </li>
                            ))}
                          </ol>
                        </div>

                        {/* Collapsible Accordion for Decisions & Tradeoffs */}
                        <div className="border border-rule">
                          <button
                            type="button"
                            onClick={() => setDecisionsOpen(!decisionsOpen)}
                            aria-expanded={decisionsOpen}
                            className="w-full flex items-center justify-between gap-3 p-3 text-left text-[11px] uppercase tracking-[0.18em] font-bold text-accent hover:text-accent-2 cursor-pointer"
                          >
                            <span>[Engineering Decisions & Trade-offs]</span>
                            {decisionsOpen ? <ChevronDown size={12} className="shrink-0" /> : <ChevronRight size={12} className="shrink-0" />}
                          </button>
                          {/* Always mounted so GSAP can animate height; inert keeps the collapsed content out of focus and the a11y tree */}
                              <div
                                ref={decisionsRef}
                                inert={!decisionsOpen}
                                style={{ height: 0, opacity: 0 }}
                                className="overflow-hidden"
                              >
                                <div className="border-t border-rule p-3 space-y-4">
                                  <div className="space-y-1 pl-3 border-l border-rule">
                                    <span className={`${LABEL} block`}>Trade-offs Made:</span>
                                    <p className={BODY}>{activeProject.tradeOffs}</p>
                                  </div>
                                  <div className="space-y-1 pl-3 border-l border-accent">
                                    <span className={`${LABEL} block`}>Decisions Log:</span>
                                    <ul className={`list-disc pl-4 space-y-1 ${BODY}`}>
                                      {activeProject.architecture.decisions.map((dec, dIdx) => (
                                        <li key={dIdx}>{dec}</li>
                                      ))}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                        </div>
                      </>
                    )}

                    {activeTab === "notes" && (
                      <>
                        <p className="text-[11px] text-ink-faint select-none">{"// engineering_reflection_log"}</p>

                        <div>
                          <h4 className={HEADING}>1. Why It Was Built</h4>
                          <p className={BODY}>{activeProject.whyBuilt}</p>
                        </div>

                        <div>
                          <h4 className={HEADING}>2. Biggest Challenge</h4>
                          <p className={BODY}>{activeProject.challenge}</p>
                        </div>

                        <div>
                          <h4 className={HEADING}>3. Lessons Learned</h4>
                          <p className={BODY}>{(activeProject.impact.lessons || []).join(" ")}</p>
                        </div>

                        <div>
                          <h4 className={HEADING}>4. How I would improve it today</h4>
                          <p className={BODY}>{activeProject.futureImprovement}</p>
                        </div>

                        <div className="border-t border-rule pt-4 text-[11px] text-ink-faint italic select-none">
                          &quot;A system should be designed to solve human bottlenecks first, and run on optimized pipelines second.&quot;
                          <span className="block text-right mt-1 not-italic text-accent">— Krishi Chheda</span>
                        </div>
                      </>
                    )}
                  </div>

                  {/* Action Links */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t border-rule pt-4 text-xs select-none">
                    {activeProject.githubUrl && (
                      <a
                        href={activeProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 text-accent hover:text-accent-2 transition-colors"
                      >
                        <Github className="w-3.5 h-3.5" />
                        <span>./explore-repo →</span>
                      </a>
                    )}
                    {activeProject.liveUrl && (
                      <a
                        href={activeProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-accent hover:text-accent-2 transition-colors"
                      >
                        ./run-instance →
                      </a>
                    )}
                  </div>
                </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
