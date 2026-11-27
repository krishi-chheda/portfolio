import type { Metadata } from "next";
import ClassicMenu from "@/components/classic/ClassicMenu";
import AskKrishi from "@/components/classic/AskKrishi";
import ProjectArchive from "@/components/classic/ProjectArchive";
import Skilldex from "@/components/classic/Skilldex";
import { AchievementJournal, ContactSection, EducationSection, ProfileSection, QuestLog, RetroSection } from "@/components/classic/Sections";
import RetroShell from "@/components/retro/RetroShell";
import { ownerProfile } from "@/lib/data";
import { FEATURED } from "@/lib/portfolio";

export const metadata: Metadata = {
  title: "Classic Portfolio | KRISHI.WORLD",
  description:
    "Krishi Chheda's portfolio in one retro page: profile, projects (ClinicalBrief, AccessVision, Traffic AI, KRISHI.OS), experience, skills, achievements, education and contact.",
  alternates: { canonical: "/classic" },
};

// Classic Mode: every section is server-rendered from the shared data; only the Skilldex, the project windows
// and the menu are interactive. Works with JavaScript off and never loads the game engine.
export default function ClassicPage() {
  return (
    <RetroShell subtitle="CLASSIC PORTFOLIO" contactHref="#contact">
      <div className="mx-auto grid max-w-6xl grid-cols-[minmax(0,1fr)] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[12rem_minmax(0,1fr)] lg:py-10">
        <aside className="contents lg:block lg:min-w-0">
          <ClassicMenu />
        </aside>
        <main className="min-w-0 space-y-8">
          <h1 className="sr-only">Krishi Chheda, Classic Portfolio</h1>
          <ProfileSection />
          <RetroSection id="projects" title="PROJECT ARCHIVE" meta={`${FEATURED.length} FEATURED`}>
            <ProjectArchive />
          </RetroSection>
          <QuestLog />
          <RetroSection id="skilldex" title="SKILLDEX" meta={`${ownerProfile.skills.length} REGISTERED`}>
            <Skilldex />
          </RetroSection>
          <AchievementJournal />
          <EducationSection />
          <ContactSection />
        </main>
      </div>
      <AskKrishi />
    </RetroShell>
  );
}
