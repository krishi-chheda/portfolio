// The sections of a project file, shared by Classic Mode's project pages (server) and Adventure Mode's HQ
// exhibits (client). No hooks, so both can render them. Every word comes from ProjectDetail (src/lib/portfolio.ts).
import type { CSSProperties, ReactNode } from "react";
import Image from "next/image";
import { CARD, MUTED, PROSE } from "@/components/retro/styles";
import { Gem } from "@/components/retro/ui";
import { skillCategories } from "@/lib/data";
import type { ProjectDetail } from "@/lib/portfolio";
import { CATEGORY_GEMS } from "@/lib/retro";

const NEUTRAL_GEM = ["#ffffff", "#cfc4a8", "#8f8466"] as const;
const gemFor = (tech: string) => {
  const i = skillCategories.findIndex((c) => c.skills.some((s) => s.toLowerCase() === tech.toLowerCase()));
  return i >= 0 ? CATEGORY_GEMS[i % CATEGORY_GEMS.length] : NEUTRAL_GEM;
};

export function Bullets({ items }: { items: string[] }) {
  return (
    <ul className={`${PROSE} space-y-2 text-lg`}>
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

export function Block({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="text-base tracking-[0.15em] text-[#285943]">▶ {title.toUpperCase()}</h3>
      {children}
    </div>
  );
}

/** The pipeline as pixel boxes joined by arrows that light up in sequence (left→right when wide, top→down otherwise). */
export function FlowDiagram({ flow, wide = "lg" }: { flow: ProjectDetail["flow"]; wide?: "lg" | "never" }) {
  const row = wide === "lg";
  return (
    <ol className={`flex flex-col items-stretch gap-1 ${row ? "lg:flex-row" : ""}`} aria-label="Architecture, step by step">
      {flow.map((step, i) => (
        <li key={step.label} className={`flex flex-col items-stretch gap-1 ${row ? "lg:min-w-0 lg:flex-1 lg:flex-row" : ""}`}>
          <div className="relative flex-1 border-2 border-[#46382b] bg-white p-3 pt-4 shadow-[3px_3px_0_#46382b]">
            <span className="absolute -top-3 left-2 border-2 border-[#46382b] bg-[#f5c65b] px-1.5 text-sm tracking-widest">{String(i + 1).padStart(2, "0")}</span>
            <p className="text-lg leading-tight">{step.label}</p>
            <p className={`${PROSE} mt-1 text-[0.9375rem] ${MUTED}`}>{step.description}</p>
          </div>
          {i < flow.length - 1 && (
            <span aria-hidden="true" className="kw-flow-arrow self-center px-1 text-xl text-[#285943]" style={{ "--i": i } as CSSProperties}>
              <span className={row ? "lg:hidden" : ""}>▼</span>
              {row && <span className="hidden lg:inline">▶</span>}
            </span>
          )}
        </li>
      ))}
    </ol>
  );
}

export function OverviewSection({ p }: { p: ProjectDetail }) {
  return (
    <div className="space-y-5">
      <Block title="Overview">
        <p className={`${PROSE} text-lg`}>{p.description}</p>
      </Block>
      {(p.problem || p.solution) && (
        <div className="grid gap-4 md:grid-cols-2">
          {p.problem && (
            <div className="relative border-4 border-[#46382b] bg-white p-4 pt-5 shadow-[3px_3px_0_#46382b]">
              <span className="absolute -top-3.5 left-3 border-2 border-[#46382b] bg-[#e9a7a0] px-2 text-sm tracking-widest">PROBLEM</span>
              <p className={`${PROSE} text-lg`}>{p.problem}</p>
            </div>
          )}
          {p.solution && (
            <div className="relative border-4 border-[#46382b] bg-white p-4 pt-5 shadow-[3px_3px_0_#46382b]">
              <span className="absolute -top-3.5 left-3 border-2 border-[#46382b] bg-[#c9eab0] px-2 text-sm tracking-widest">SOLUTION</span>
              <p className={`${PROSE} text-lg`}>{p.solution}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export function ArchitectureSection({ p, wide }: { p: ProjectDetail; wide?: "lg" | "never" }) {
  return (
    <div className="space-y-6">
      {p.flow.length ? <FlowDiagram flow={p.flow} wide={wide} /> : <p className={MUTED}>No architecture diagram for this project.</p>}
      {p.architectureNote && (
        <Block title="How it fits together">
          <p className={`${PROSE} text-lg`}>{p.architectureNote}</p>
        </Block>
      )}
      {p.tradeOffs && (
        <Block title="Trade-offs">
          <p className={`${PROSE} text-lg`}>{p.tradeOffs}</p>
        </Block>
      )}
    </div>
  );
}

export function TechSection({ p }: { p: ProjectDetail }) {
  return (
    <div className="space-y-4">
      <p className={`text-base ${MUTED}`}>{p.techStack.length} technologies. Gem colours match the Skilldex categories.</p>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {p.techStack.map((t) => (
          <li key={t} className={`${CARD} flex items-center gap-2.5 px-3 py-2.5 text-base`}>
            <Gem colors={gemFor(t)} size={20} />
            <span className="min-w-0 leading-tight">{t}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function FeaturesSection({ p }: { p: ProjectDetail }) {
  return (
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
  );
}

export const hasRole = (p: ProjectDetail) => Boolean(p.role || p.whyBuilt || p.challenge || p.lessons.length || p.next);

export function RoleSection({ p }: { p: ProjectDetail }) {
  return (
    <div className="space-y-6">
      {p.role && (
        <Block title="Role">
          <p className="text-xl leading-snug">{p.role}</p>
        </Block>
      )}
      {p.whyBuilt && (
        <Block title="Why I built it">
          <p className={`${PROSE} text-lg`}>{p.whyBuilt}</p>
        </Block>
      )}
      {p.challenge && (
        <Block title="Hardest problem">
          <p className={`${PROSE} text-lg`}>{p.challenge}</p>
        </Block>
      )}
      {p.lessons.length > 0 && (
        <Block title="Lessons">
          <Bullets items={p.lessons} />
        </Block>
      )}
      {p.next && (
        <Block title="What's next">
          <p className={`${PROSE} text-lg`}>{p.next}</p>
        </Block>
      )}
    </div>
  );
}

export function ScreensSection({ p }: { p: ProjectDetail }) {
  if (!p.screenshots.length) return <p className="text-lg leading-snug">No screenshots: {p.title} has no public repository or live demo to capture.</p>;
  return (
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
  );
}
