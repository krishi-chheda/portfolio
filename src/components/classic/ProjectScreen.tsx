// A project file as a GBA-style summary screen: an overview that's always visible (HQ building, stats, links,
// problem and solution), then flippable pages for architecture, tech, features, role and real screenshots.
// Server component; every word comes from the shared ProjectDetail (src/lib/portfolio.ts).
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import ProjectTabs from "@/components/classic/ProjectTabs";
import { CARD, CHIP, LABEL, LINK, MUTED, PANEL, TITLE_BAR } from "@/components/retro/styles";
import { Gem } from "@/components/retro/ui";
import { ObjectSprite, PlayerAvatar } from "@/components/retro/WorldView";
import { skillCategories } from "@/lib/data";
import { FEATURED, type ProjectDetail } from "@/lib/portfolio";
import { CATEGORY_GEMS, PROJECT_BUILDING } from "@/lib/retro";

const NEUTRAL_GEM = ["#ffffff", "#cfc4a8", "#8f8466"] as const;
const gemFor = (tech: string) => {
  const i = skillCategories.findIndex((c) => c.skills.some((s) => s.toLowerCase() === tech.toLowerCase()));
  return i >= 0 ? CATEGORY_GEMS[i % CATEGORY_GEMS.length] : NEUTRAL_GEM;
};

function Bullets({ items }: { items: string[] }) {
  return (
    <ul className="space-y-2 text-lg leading-snug">
      {items.map((item) => (
        <li key={item} className="flex gap-2.5">
          <span aria-hidden="true" className="mt-1 text-sm text-[#285943]">
            ◆
          </span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-base tracking-[0.15em] text-[#285943]">▶ {title.toUpperCase()}</h3>
      {children}
    </div>
  );
}

/** The pipeline as pixel boxes joined by arrows that light up in sequence (left→right on desktop, top→down on phones). */
function FlowDiagram({ flow }: { flow: ProjectDetail["flow"] }) {
  return (
    <ol className="flex flex-col items-stretch gap-1 lg:flex-row" aria-label="Architecture, step by step">
      {flow.map((step, i) => (
        <li key={step.label} className="flex flex-col items-stretch gap-1 lg:min-w-0 lg:flex-1 lg:flex-row">
          <div className="relative flex-1 border-2 border-[#46382b] bg-white p-3 pt-4 shadow-[3px_3px_0_#46382b]">
            <span className="absolute -top-3 left-2 border-2 border-[#46382b] bg-[#f5c65b] px-1.5 text-xs tracking-widest">{String(i + 1).padStart(2, "0")}</span>
            <p className="text-lg leading-tight">{step.label}</p>
            <p className={`mt-1 text-sm leading-snug ${MUTED}`}>{step.description}</p>
          </div>
          {i < flow.length - 1 && (
            <span aria-hidden="true" className="kw-flow-arrow self-center px-1 text-xl text-[#285943]" style={{ "--i": i } as CSSProperties}>
              <span className="lg:hidden">▼</span>
              <span className="hidden lg:inline">▶</span>
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

export default function ProjectScreen({ project: p }: { project: ProjectDetail }) {
  const index = FEATURED.findIndex((f) => f.id === p.id);
  const prev = FEATURED[(index - 1 + FEATURED.length) % FEATURED.length];
  const next = FEATURED[(index + 1) % FEATURED.length];
  const no = String(index + 1).padStart(3, "0");
  const liveExternal = p.liveUrl?.startsWith("http");

  const tabs: { id: string; label: string; content: ReactNode }[] = [];
  tabs.push({
    id: "architecture",
    label: "ARCHITECTURE",
    content: (
      <div className="space-y-6">
        {p.flow.length ? <FlowDiagram flow={p.flow} /> : <p className={MUTED}>No architecture diagram for this project.</p>}
        {p.architectureNote && (
          <Block title="How it fits together">
            <p className="text-lg leading-relaxed">{p.architectureNote}</p>
          </Block>
        )}
        {p.tradeOffs && (
          <Block title="Trade-offs">
            <p className="text-lg leading-relaxed">{p.tradeOffs}</p>
          </Block>
        )}
      </div>
    ),
  });
  tabs.push({
    id: "tech",
    label: "TECH",
    content: (
      <div className="space-y-4">
        <p className={`text-base ${MUTED}`}>
          {p.techStack.length} technologies. Gem colours match the Skilldex categories.
        </p>
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {p.techStack.map((t) => (
            <li key={t} className={`${CARD} flex items-center gap-2.5 px-3 py-2.5 text-base`}>
              <Gem colors={gemFor(t)} size={20} />
              <span className="min-w-0 leading-tight">{t}</span>
            </li>
          ))}
        </ul>
      </div>
    ),
  });
  tabs.push({
    id: "features",
    label: "FEATURES",
    content: (
      <div className="space-y-6">
        {p.features.length > 0 && (
          <Block title={p.featuresTitle}>
            <Bullets items={p.features} />
          </Block>
        )}
        {p.extras.length > 0 && (
          <Block title="Also inside">
            <Bullets items={p.extras} />
          </Block>
        )}
        {p.achievements.length > 0 && (
          <Block title="Outcomes">
            <Bullets items={p.achievements} />
          </Block>
        )}
      </div>
    ),
  });
  if (p.role || p.whyBuilt || p.challenge || p.lessons.length || p.next) {
    tabs.push({
      id: "role",
      label: "MY ROLE",
      content: (
        <div className="space-y-6">
          {p.role && (
            <Block title="Role">
              <p className="text-xl leading-snug">{p.role}</p>
            </Block>
          )}
          {p.whyBuilt && (
            <Block title="Why I built it">
              <p className="text-lg leading-relaxed">{p.whyBuilt}</p>
            </Block>
          )}
          {p.challenge && (
            <Block title="Hardest problem">
              <p className="text-lg leading-relaxed">{p.challenge}</p>
            </Block>
          )}
          {p.lessons.length > 0 && (
            <Block title="Lessons">
              <Bullets items={p.lessons} />
            </Block>
          )}
          {p.next && (
            <Block title="What's next">
              <p className="text-lg leading-relaxed">{p.next}</p>
            </Block>
          )}
        </div>
      ),
    });
  }
  tabs.push({
    id: "screens",
    label: "SCREENS",
    content: p.screenshots.length ? (
      <ul className="grid gap-6 md:grid-cols-2">
        {p.screenshots.map((s) => {
          const tall = s.height > s.width;
          return (
            <li key={s.src} className={tall ? "md:row-span-2" : ""}>
              <figure className={`border-4 border-[#46382b] bg-[#2b2420] p-2 shadow-[4px_4px_0_#46382b] ${tall ? "mx-auto max-w-[300px]" : ""}`}>
                <a href={s.src} target="_blank" rel="noopener noreferrer" className="block" aria-label={`Open full-size screenshot: ${s.alt}`}>
                  <Image
                    src={s.src}
                    alt={s.alt}
                    width={s.width}
                    height={s.height}
                    sizes={tall ? "(min-width: 768px) 280px, 70vw" : "(min-width: 1024px) 540px, (min-width: 768px) 45vw, 90vw"}
                    className="h-auto w-full"
                  />
                </a>
                <figcaption className="mt-2 text-sm tracking-wide text-[#f5e8c8]">{s.caption}</figcaption>
              </figure>
            </li>
          );
        })}
      </ul>
    ) : (
      <p className="text-lg leading-snug">
        No screenshots: {p.title} has no public repository or live demo to capture.
      </p>
    ),
  });

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
