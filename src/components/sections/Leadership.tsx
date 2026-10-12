"use client";

import { useTerminalReveal } from "@/hooks/useTerminalReveal";
import SectionHeader from "@/components/ui/SectionHeader";

const label = "text-[11px] uppercase tracking-[0.18em]";

const roles = [
  {
    tag: "[EXECUTIVE]",
    period: "OCT 2025 - PRESENT",
    org: "Monash Data & AI Society (MDAS)",
    role: "Vice President",
    roleDate: "Jul 2026 – Present",
    progression: ["Media & Marketing Director · Jan 2026 – May 2026", "Media & Marketing Officer · Oct 2025 – Jan 2026"],
    points: [
      ["Marketing Leadership", "Led visual branding, content publication, and digital campaign schedules for the largest specialized data student society at Monash."],
      ["Event Strategy", "Co-designed promotions and logistical coordination for developer bootcamps, winter hackathons, and corporate networking nights."],
      ["Cross-Functional Collaboration", "Managed pipelines of copywriters, designers, and web developers to build and distribute marketing assets."],
    ],
    outcome: "Grew AI workshop reach to 300+ students across 5+ events and boosted overall digital interaction metrics by 40%.",
  },
  {
    tag: "[COMMUNITY_LEAD]",
    period: "2025 - PRESENT",
    org: "MOSAIC",
    role: "Social Media Coordinator",
    points: [
      ["Community Building", "Fostering active peer support systems and volunteer developer networks around community AI projects."],
      ["Student Engagement", "Coordinating cross-campus outreach campaigns connecting peers to AI volunteer programs and local community projects."],
      ["Cross-Functional Collaboration", "Aligning students, university representatives, and non-profits to support monthly social coordination initiatives."],
    ],
    outcome: "Connected peers to local community volunteer initiatives and increased student participation in volunteering projects.",
  },
];

export default function Leadership() {
  const sectionRef = useTerminalReveal<HTMLElement>();
  return (
    <section ref={sectionRef} id="leadership" className="py-24 border-t border-rule">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader num="03" title="Leadership" command="cat leadership.md" meta="monash · student societies" />

        <div data-reveal="panel" className="border border-rule terminal-highlight">
          {/* Overview statement */}
          <div className="border-b border-rule p-6">
            <h3 className="font-bold text-ink">
              <span className="text-accent">Can Krishi lead?</span>
            </h3>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-ink-soft">
              Yes. I drive growth in student organizations by leading cross-functional teams, structuring event marketing campaigns, and building developer networks. I coordinate campaign schedules and lead design pipelines to translate community needs into successful events.
            </p>
          </div>

          {/* Two flat columns */}
          <div className="grid grid-cols-1 lg:grid-cols-2">
            {roles.map((r, i) => (
              <article
                key={r.org}
                data-reveal="item"
                className={`flex min-w-0 flex-col gap-4 p-6 ${i > 0 ? "border-t border-rule lg:border-t-0 lg:border-l" : ""}`}
              >
                <div className={`flex flex-wrap items-center justify-between gap-2 ${label}`}>
                  <span className="text-accent">{r.tag}</span>
                  <span className="text-ink-faint">{r.period}</span>
                </div>

                <div>
                  <h3 className="font-bold text-ink">{r.org}</h3>
                  <p className="mt-1 text-sm text-accent">
                    {r.role}
                    {r.roleDate && <span className="text-ink-faint"> · {r.roleDate}</span>}
                  </p>
                  {r.progression && (
                    <ul className="mt-1 space-y-0.5 text-[11px] text-ink-faint">
                      {r.progression.map((p) => (
                        <li key={p}>{p}</li>
                      ))}
                    </ul>
                  )}
                </div>

                <ul className="space-y-2 text-sm leading-relaxed text-ink-soft">
                  {r.points.map(([title, body]) => (
                    <li key={title} data-reveal="item" className="flex gap-2">
                      <span className="text-accent" aria-hidden>–</span>
                      <span className="min-w-0">
                        <strong className="font-bold text-ink">{title}:</strong> {body}
                      </span>
                    </li>
                  ))}
                </ul>

                <p className="mt-auto border-t border-rule pt-4 text-sm leading-relaxed text-ink-soft">
                  <span className={`${label} mr-2 text-gold`}>Outcome</span>
                  {r.outcome}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
