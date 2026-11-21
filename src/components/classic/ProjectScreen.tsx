// A project file as a GBA-style summary screen: an overview that's always visible (HQ building, stats, links,
// problem and solution), then flippable pages for architecture, tech, features, role and real screenshots.
// Server component; every word comes from the shared ProjectDetail (src/lib/portfolio.ts).
import type { ReactNode } from "react";
import Link from "next/link";
import ProjectTabs from "@/components/classic/ProjectTabs";
import { CHIP, LABEL, LINK, MUTED, PANEL, TITLE_BAR } from "@/components/retro/styles";
import { ArchitectureSection, Block, FeaturesSection, RoleSection, ScreensSection, TechSection, hasRole } from "@/components/retro/ProjectParts";
import { ObjectSprite, PlayerAvatar } from "@/components/retro/WorldView";
import { FEATURED, type ProjectDetail } from "@/lib/portfolio";
import { PROJECT_BUILDING } from "@/lib/retro";

export default function ProjectScreen({ project: p }: { project: ProjectDetail }) {
  const index = FEATURED.findIndex((f) => f.id === p.id);
  const prev = FEATURED[(index - 1 + FEATURED.length) % FEATURED.length];
  const next = FEATURED[(index + 1) % FEATURED.length];
  const no = String(index + 1).padStart(3, "0");
  const liveExternal = p.liveUrl?.startsWith("http");

  const tabs: { id: string; label: string; content: ReactNode }[] = [
    { id: "architecture", label: "ARCHITECTURE", content: <ArchitectureSection p={p} /> },
    { id: "tech", label: "TECH", content: <TechSection p={p} /> },
    { id: "features", label: "FEATURES", content: <FeaturesSection p={p} /> },
    ...(hasRole(p) ? [{ id: "role", label: "MY ROLE", content: <RoleSection p={p} /> }] : []),
    { id: "screens", label: "SCREENS", content: <ScreensSection p={p} /> },
  ];

  return (
    <main className="mx-auto max-w-6xl space-y-6 px-4 py-6 sm:px-6 lg:py-10">
      <nav aria-label="Project files" className="flex flex-wrap items-center justify-between gap-3 text-base">
        <Link href="/classic#projects" className={LINK}>
          ◀ Project Archive
        </Link>
        <div className="flex items-center gap-2">
          <Link href={`/classic/projects/${prev.id}`} className={LINK} aria-label={`Previous project: ${prev.title}`}>
            ◀ <span className="hidden sm:inline">{prev.title}</span>
          </Link>
          <span className="border-2 border-[#46382b] bg-[#f5e8c8] px-2 py-1 text-sm tracking-widest">
            {index + 1}/{FEATURED.length}
          </span>
          <Link href={`/classic/projects/${next.id}`} className={LINK} aria-label={`Next project: ${next.title}`}>
            <span className="hidden sm:inline">{next.title}</span> ▶
          </Link>
        </div>
      </nav>

      <article aria-labelledby="project-title" className={`${PANEL} kw-reveal`}>
        <div className={TITLE_BAR}>
          <h1 id="project-title" className="min-w-0 text-xl tracking-[0.12em] sm:text-2xl">
            <span className="text-[#f5c65b]">No. {no}</span> {p.title.toUpperCase()}
          </h1>
          {p.status && <span className="hidden border-2 border-[#f5e8c8] px-2 text-xs tracking-widest sm:inline">{p.status.toUpperCase()}</span>}
        </div>

        <div className="grid gap-6 p-4 sm:p-6 lg:grid-cols-[20rem_minmax(0,1fr)]">
          {/* Summary card: the HQ from the game, stats and links */}
          <div className="space-y-4">
            <div className="relative flex h-40 items-end sm:h-48 justify-center gap-2 overflow-hidden border-4 border-[#46382b] bg-[linear-gradient(180deg,#d4f0f8_0%,#bfe6f2_68%,#78b85a_68%,#6aa94f_100%)] pb-3">
              <ObjectSprite kind={PROJECT_BUILDING[p.id as keyof typeof PROJECT_BUILDING]} scale={1.6} />
              <PlayerAvatar scale={2.5} className="-ml-3 mb-0.5" />
            </div>
            <dl className="divide-y-2 divide-[#46382b]/15 border-2 border-[#46382b] bg-white px-3 shadow-[3px_3px_0_#46382b]">
              {[
                ["Type", p.subtitle],
                ["Status", p.status],
                ["Role", p.role],
                ["Stack", `${p.techStack.length} technologies`],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="flex gap-3 py-2">
                    <dt className={`${LABEL} w-16 shrink-0 pt-0.5`}>{k}</dt>
                    <dd className="text-base leading-snug">{v}</dd>
                  </div>
                ))}
            </dl>
            <div className="flex flex-col gap-2">
              {p.githubUrl ? (
                <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className={`${LINK} text-center`}>
                  GitHub repository ↗
                </a>
              ) : (
                <p className={`border-2 border-dashed border-[#46382b]/50 px-3 py-1 text-center text-base ${MUTED}`}>No public repository</p>
              )}
              {p.liveUrl ? (
                <a
                  href={p.liveUrl}
                  {...(liveExternal ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`${LINK} bg-[#f5c65b]! text-center`}
                >
                  {liveExternal ? "Live deployment ↗" : "You're on it: back to the title screen"}
                </a>
              ) : (
                <p className={`border-2 border-dashed border-[#46382b]/50 px-3 py-1 text-center text-base ${MUTED}`}>No live deployment</p>
              )}
            </div>
          </div>

          {/* Overview (first on phones, so the what-and-why is read before the stats) */}
          <div className="order-first min-w-0 space-y-5 lg:order-none">
            <Block title="Overview">
              <p className="text-lg leading-relaxed">{p.description}</p>
            </Block>
            {(p.problem || p.solution) && (
              <div className="grid gap-4 md:grid-cols-2">
                {p.problem && (
                  <div className="relative border-4 border-[#46382b] bg-white p-4 pt-5 shadow-[3px_3px_0_#46382b]">
                    <span className="absolute -top-3.5 left-3 border-2 border-[#46382b] bg-[#e9a7a0] px-2 text-sm tracking-widest">PROBLEM</span>
                    <p className="text-lg leading-snug">{p.problem}</p>
                  </div>
                )}
                {p.solution && (
                  <div className="relative border-4 border-[#46382b] bg-white p-4 pt-5 shadow-[3px_3px_0_#46382b]">
                    <span className="absolute -top-3.5 left-3 border-2 border-[#46382b] bg-[#c9eab0] px-2 text-sm tracking-widest">SOLUTION</span>
                    <p className="text-lg leading-snug">{p.solution}</p>
                  </div>
                )}
              </div>
            )}
            <ul className="flex flex-wrap gap-1.5" aria-label="Tech stack">
              {p.techStack.map((t) => (
                <li key={t} className={CHIP}>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </article>

      <ProjectTabs tabs={tabs} />
    </main>
  );
}
