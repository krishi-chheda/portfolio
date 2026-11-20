// Classic Mode's static sections, server-rendered from the shared data (src/lib/data.ts) so every word is in
// the page HTML. Same frame, title bars and type as the game's windows.
import type { CSSProperties, ReactNode } from "react";
import { BUTTON, CARD, CHIP, LABEL, LINK, MUTED, PANEL, TITLE_BAR } from "@/components/retro/styles";
import { PortraitAvatar } from "@/components/retro/WorldView";
import UnlockOnView from "@/components/classic/UnlockOnView";
import {
  contact,
  currentProcesses,
  education,
  experienceData,
  milestones,
  profile,
  questKinds,
  responsibilities,
  roleHistory,
  type Experience,
  type MilestoneKind,
  type QuestKind,
} from "@/lib/data";

export function RetroSection({ id, title, meta, children }: { id: string; title: string; meta?: ReactNode; children: ReactNode }) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`${PANEL} kw-reveal scroll-mt-16 sm:scroll-mt-32 lg:scroll-mt-28`}>
      <div className={TITLE_BAR}>
        <h2 id={`${id}-title`} className="text-xl tracking-[0.15em] sm:text-2xl">
          {title}
        </h2>
        {meta && <span className="text-sm tracking-widest">{meta}</span>}
      </div>
      <div className="p-4 sm:p-6">{children}</div>
    </section>
  );
}

function Chips({ items }: { items: string[] }) {
  return (
    <ul className="flex flex-wrap gap-2">
      {items.map((i) => (
        <li key={i} className={CHIP}>
          {i}
        </li>
      ))}
    </ul>
  );
}

// A static info card: same frame as CARD, without the hover lift (nothing to click).
const INFO_CARD = "border-2 border-[#46382b] bg-white p-4 shadow-[3px_3px_0_#46382b]";

// ---------- A. Trainer profile ----------

const CURRENT_ROLE = `${roleHistory["mdas-vp"][0].role}, ${experienceData.find((e) => e.id === "mdas-vp")?.organization ?? ""}`;

export function ProfileSection() {
  const professional: [string, string][] = [
    ["Studying", "Master of Artificial Intelligence, Monash University"],
    ["Graduating", currentProcesses.graduation],
    ["Current role", CURRENT_ROLE],
    ["Background", education[1]?.title ?? ""],
  ];
  const technical = [...new Set([...profile.technicalInterests, ...profile.otherInterests.filter((i) => i !== "Formula 1")])];
  const personal = [...new Set([...profile.personalInterests, ...profile.otherInterests.filter((i) => i === "Formula 1")])];

  return (
    <RetroSection id="profile" title="TRAINER PROFILE" meta="ID No. KC-2027">
      {/* The essentials, visible at a glance */}
      <div className="grid items-center gap-6 sm:grid-cols-[auto_1fr]">
        <div className="mx-auto flex flex-col items-center gap-3">
          <div className="flex h-40 w-40 items-end justify-center overflow-hidden rounded-full border-4 border-[#285943] bg-[radial-gradient(circle_at_50%_30%,#d4f0f8_0%,#a6d985_55%,#5e9e48_100%)] shadow-[4px_4px_0_#46382b,inset_0_-6px_0_rgba(31,29,36,0.12)] sm:h-44 sm:w-44">
            <PortraitAvatar scale={5} className="translate-y-1.5" label="Krishi's trainer portrait" />
          </div>
          <p className="border-2 border-[#46382b] bg-[#f5c65b] px-3 py-0.5 text-sm tracking-widest shadow-[2px_2px_0_#46382b]">● AVAILABLE</p>
        </div>
        <div className="min-w-0 space-y-3 text-center sm:text-left">
          <div>
            <h3 className="text-3xl leading-tight sm:text-4xl">{profile.name}</h3>
            <p className="text-xl text-[#285943]">{profile.title}</p>
            <p className={`text-base ${MUTED}`}>{profile.location}</p>
          </div>
          <p className="border-l-4 border-[#f5c65b] bg-white/70 px-3 py-2 text-left text-lg leading-snug">
            <span className={`${LABEL} block`}>Open to</span>
            {profile.status.replace(/^Open to /, "")}
          </p>
          <div className="flex flex-wrap justify-center gap-2 sm:justify-start">
            <a href={`mailto:${contact.email}`} className={`${LINK} bg-[#f5c65b]!`}>
              ✉ Email
            </a>
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className={LINK}>
              LinkedIn ↗
            </a>
            <a href={contact.github} target="_blank" rel="noopener noreferrer" className={LINK}>
              GitHub ↗
            </a>
          </div>
        </div>
      </div>

      <p className="mt-8 text-lg leading-relaxed">{profile.summary}</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className={INFO_CARD}>
          <h3 className="mb-3 text-lg tracking-[0.12em] text-[#285943]">▶ PROFESSIONAL</h3>
          <dl className="space-y-3">
            {professional.map(([k, v]) => (
              <div key={k}>
                <dt className={LABEL}>{k}</dt>
                <dd className="text-lg leading-snug">{v}</dd>
              </div>
            ))}
            <div>
              <dt className={`${LABEL} mb-1.5`}>Focus areas</dt>
              <dd>
                <Chips items={technical} />
              </dd>
            </div>
          </dl>
        </div>
        <div className={INFO_CARD}>
          <h3 className="mb-3 text-lg tracking-[0.12em] text-[#285943]">▶ PERSONAL</h3>
          <dl className="space-y-3">
            <div>
              <dt className={LABEL}>Home base</dt>
              <dd className="text-lg leading-snug">{profile.location}</dd>
            </div>
            <div>
              <dt className={`${LABEL} mb-1.5`}>Hobbies & interests</dt>
              <dd>
                <Chips items={personal} />
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </RetroSection>
  );
}

// ---------- B. Education journal ----------

export function EducationSection() {
  return (
    <RetroSection id="education" title="EDUCATION JOURNAL" meta={`${education.length} ENTRIES`}>
      <ol className="relative space-y-8 border-l-4 border-[#285943] pl-7">
        {education.map((e) => (
          <li key={e.title} className="relative">
            <span aria-hidden="true" className="absolute top-1.5 -left-[2.4rem] h-5 w-5 border-4 border-[#46382b] bg-[#f5c65b]" />
            <p className="text-sm tracking-widest text-[#285943]">{[e.period, e.status].filter(Boolean).join(" · ").toUpperCase()}</p>
            <h3 className="mt-1 text-2xl leading-tight">{e.title}</h3>
            {e.org && <p className={`text-lg ${MUTED}`}>{e.org}</p>}
            {e.details.map((d) => (
              <p key={d} className="mt-2 text-lg leading-snug">
                {d}
              </p>
            ))}
          </li>
        ))}
      </ol>
    </RetroSection>
  );
}

// ---------- E. Experience as a quest log ----------

const QUEST_KIND: Record<QuestKind, { label: string; color: string; icon: string }> = {
  employment: { label: "EMPLOYMENT", color: "#e2d0fa", icon: "■" },
  leadership: { label: "LEADERSHIP", color: "#f5c65b", icon: "★" },
  volunteering: { label: "VOLUNTEERING", color: "#c9eab0", icon: "♥" },
  event: { label: "EVENT", color: "#7bc9df", icon: "⚑" },
};
const MONTHS = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
/** Sort key from a period like "Oct 2025 - Present" or "2026 - Present" (year-only counts as January). */
const startKey = (period: string) => {
  const m = period.toLowerCase().match(/^(?:([a-z]{3})[a-z]*\s+)?(\d{4})/);
  return m ? Number(m[2]) * 12 + Math.max(0, MONTHS.indexOf(m[1] ?? "jan")) : 0;
};
const QUESTS = [...experienceData].sort((a, b) => startKey(b.period) - startKey(a.period));
const questTitle = (q: Experience) => roleHistory[q.id]?.[0].role ?? q.role;

export function QuestLog() {
  const kinds = [...new Set(QUESTS.map((q) => questKinds[q.id]).filter(Boolean))];
  return (
    <RetroSection id="experience" title="QUEST LOG" meta={`${QUESTS.length} QUESTS`}>
      <ul className="mb-6 flex flex-wrap gap-2" aria-label="Quest types">
        {kinds.map((k) => (
          <li key={k} className="border-2 border-[#46382b] px-2 py-0.5 text-sm tracking-widest" style={{ background: QUEST_KIND[k].color }}>
            <span aria-hidden="true">{QUEST_KIND[k].icon} </span>
            {QUEST_KIND[k].label}
          </li>
        ))}
      </ul>
      <ol className="relative space-y-5 border-l-4 border-[#285943] pl-6 sm:pl-8">
        {QUESTS.map((q, i) => {
          const active = /present/i.test(q.period);
          const kind = QUEST_KIND[questKinds[q.id] ?? "employment"];
          const duties = responsibilities(q);
          const history = roleHistory[q.id];
          return (
            <li key={q.id} className="relative">
              <span
                aria-hidden="true"
                className="absolute top-5 -left-[2.3rem] h-5 w-5 border-4 border-[#46382b] sm:-left-[2.8rem]"
                style={{ background: kind.color }}
              />
              <details open={i === 0} className={`${CARD} group/q`}>
                <summary className="flex cursor-pointer list-none items-start gap-3 p-4 [&::-webkit-details-marker]:hidden">
                  <span aria-hidden="true" className="mt-1 text-[#285943] transition-transform duration-150 group-open/q:rotate-90 motion-reduce:transition-none">
                    ▶
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="border-2 border-[#46382b] px-1.5 text-xs tracking-widest" style={{ background: kind.color }}>
                        {kind.label}
                      </span>
                      <span className={`border-2 border-[#46382b] px-1.5 text-xs tracking-widest ${active ? "bg-[#f5c65b]" : "bg-[#e9f7e2]"}`}>
                        {active ? "ACTIVE" : "COMPLETE"}
                      </span>
                    </span>
                    <span className="mt-2 block text-xl leading-tight">{q.organization}</span>
                    <span className="block text-lg leading-snug text-[#285943]">{questTitle(q)}</span>
                    <span className={`mt-1 block text-base ${MUTED}`}>
                      {q.period.replace(" - ", " – ")} · {q.location}
                    </span>
                  </span>
                </summary>
                <div className="space-y-4 border-t-2 border-dashed border-[#46382b]/40 px-4 pt-3 pb-4 sm:pl-10">
                  {history && (
                    <div>
                      <p className={`${LABEL} mb-1.5`}>Role progression</p>
                      <ol className="space-y-1">
                        {history.map((h) => (
                          <li key={h.role} className="flex flex-wrap justify-between gap-x-4 text-base">
                            <span>{h.role}</span>
                            <span className={MUTED}>{h.period}</span>
                          </li>
                        ))}
                      </ol>
                    </div>
                  )}
                  {duties.length > 0 && (
                    <div>
                      <p className={`${LABEL} mb-1.5`}>Responsibilities</p>
                      <ul className="space-y-1.5 text-base leading-snug">
                        {duties.map((d) => (
                          <li key={d} className="flex gap-2">
                            <span aria-hidden="true" className="text-[#285943]">
                              •
                            </span>
                            <span>{d}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                  <div>
                    <p className={`${LABEL} mb-1.5`}>Focus areas</p>
                    <Chips items={q.skills} />
                  </div>
                </div>
              </details>
            </li>
          );
        })}
      </ol>
    </RetroSection>
  );
}

// ---------- F. Achievement journal ----------

const KIND: Record<MilestoneKind, { label: string; color: string }> = {
  academic: { label: "ACADEMIC", color: "#7bc9df" },
  professional: { label: "PROFESSIONAL", color: "#e2d0fa" },
  technical: { label: "TECHNICAL", color: "#97cd74" },
  leadership: { label: "LEADERSHIP", color: "#f5c65b" },
};

export function AchievementJournal() {
  const counts = (Object.keys(KIND) as MilestoneKind[]).map((k) => [k, milestones.filter((m) => m.kind === k).length] as const).filter(([, n]) => n);
  return (
    <RetroSection id="achievements" title="ACHIEVEMENT JOURNAL" meta={`${milestones.length}/${milestones.length} UNLOCKED`}>
      <ul className="mb-6 flex flex-wrap gap-2" aria-label="Achievement categories">
        {counts.map(([k, n]) => (
          <li key={k} className="border-2 border-[#46382b] px-2 py-0.5 text-sm tracking-widest" style={{ background: KIND[k].color }}>
            {KIND[k].label} × {n}
          </li>
        ))}
      </ul>
      <UnlockOnView className="grid gap-4 sm:grid-cols-2">
        {milestones.map((m, i) => {
          const external = m.link?.href.startsWith("http");
          return (
            <li key={m.title} className={`kw-unlock-item ${CARD} flex gap-3 border-l-8 p-4`} style={{ "--i": i, borderLeftColor: KIND[m.kind].color } as CSSProperties}>
              <svg width="38" height="38" viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges" className="kw-trophy mt-0.5 shrink-0">
                <path d="M4 2h8v4a4 4 0 0 1-8 0z M7 10h2v2h2v2H5v-2h2z" fill="#f5c65b" stroke="#1f1d24" strokeWidth="1" />
              </svg>
              <div className="min-w-0 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="border-2 border-[#46382b] px-1.5 text-xs tracking-widest" style={{ background: KIND[m.kind].color }}>
                    {KIND[m.kind].label}
                  </span>
                  {m.date && <span className={`text-sm ${MUTED}`}>{m.date}</span>}
                </div>
                <h3 className="mt-1.5 text-xl leading-tight">{m.title}</h3>
                <p className="mt-1 text-base leading-snug">{m.detail}</p>
                {m.link && (
                  <a
                    href={m.link.href}
                    {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    className="mt-2 inline-block text-sm tracking-wide text-[#285943] underline underline-offset-2 hover:text-[#1c4031]"
                  >
                    ▶ {m.link.label}
                    {external ? " ↗" : ""}
                  </a>
                )}
              </div>
            </li>
          );
        })}
      </UnlockOnView>
    </RetroSection>
  );
}

// ---------- G. Resume & contact ----------

export function ContactSection() {
  return (
    <RetroSection id="contact" title="RESUME & CONTACT">
      <p className="text-lg leading-snug">
        Open to AI Engineering, Machine Learning, Software Engineering and Technology Consulting opportunities. The
        quickest way to reach Krishi is email; his full work history lives on LinkedIn.
      </p>
      <div className="mt-5 flex flex-wrap gap-3">
        <a href={`mailto:${contact.email}`} className={`${LINK} bg-[#f5c65b]!`}>
          ✉ {contact.email}
        </a>
        <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className={LINK}>
          Resume & LinkedIn ↗
        </a>
        <a href={contact.github} target="_blank" rel="noopener noreferrer" className={LINK}>
          GitHub ↗
        </a>
      </div>
      <p className={`mt-5 text-base ${MUTED}`}>
        Prefer to explore? <a href="/world" className={`${BUTTON} ml-1 inline-block text-base text-[#2b2420]`}>▶ Play Adventure Mode</a>
      </p>
    </RetroSection>
  );
}
