// Derived views over src/lib/data.ts, shared by both modes (Classic Mode's sections and Adventure Mode's
// terminals/NPCs). No React or Phaser here, so either side can import it. Never copy project text elsewhere:
// add or fix it in data.ts and both modes update.
import { additionalProjectsData, krishiOsProject, ownerProfile, projectsData, type Project } from "./data";

export interface ProjectDetail {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  role?: string;
  problem?: string;
  solution?: string;
  status?: string;
  techStack: string[];
  flow: { label: string; description: string }[];
  features: string[]; // key decisions / features
  achievements: string[];
  challenge?: string;
  tradeOffs?: string;
  whyBuilt?: string;
  next?: string;
  extras: string[]; // owner-confirmed details beyond the portfolio card
  githubUrl?: string;
  liveUrl?: string;
}

function fromProject(p: Project): ProjectDetail {
  return {
    id: p.id,
    title: p.title,
    subtitle: p.subtitle,
    description: p.description,
    role: p.role,
    problem: p.overview.problem,
    solution: p.overview.solution,
    status: p.overview.status,
    techStack: p.techStack,
    flow: p.architecture.flow,
    features: p.architecture.decisions,
    achievements: [p.keyOutcome, ...p.impact.achievements.filter((a) => a !== p.keyOutcome)],
    challenge: p.challenge,
    tradeOffs: p.tradeOffs,
    whyBuilt: p.whyBuilt,
    next: p.futureImprovement,
    extras: ownerProfile.projectNotes[p.id] ?? [],
    githubUrl: p.githubUrl,
    liveUrl: p.liveUrl,
  };
}

const krishiOs: ProjectDetail = {
  id: krishiOsProject.id,
  title: krishiOsProject.title,
  subtitle: krishiOsProject.subtitle,
  description: krishiOsProject.description,
  techStack: krishiOsProject.techStack,
  flow: [],
  features: krishiOsProject.features,
  achievements: [],
  extras: [],
  githubUrl: krishiOsProject.githubUrl,
  liveUrl: krishiOsProject.liveUrl,
};

const byId = (id: string) => {
  const p = projectsData.find((x) => x.id === id);
  if (!p) throw new Error(`portfolio: unknown project ${id}`);
  return fromProject(p);
};

/** The four featured projects, in the owner's order. Both modes use exactly these. */
export const FEATURED: ProjectDetail[] = [byId("clinicalbrief"), byId("accessible-vision"), byId("traffic-ai"), krishiOs];
export const PROJECT_DETAILS: Record<string, ProjectDetail> = Object.fromEntries(FEATURED.map((p) => [p.id, p]));

/** Everything else that's real and public: StudentHub plus the supporting repos. */
export const MORE_PROJECTS = [
  ...projectsData
    .filter((p) => !PROJECT_DETAILS[p.id])
    .map((p) => ({ id: p.id, title: p.title, description: p.description, techStack: p.techStack, githubUrl: p.githubUrl, liveUrl: p.liveUrl })),
  ...additionalProjectsData.map((p) => ({ id: p.id, title: p.title, description: p.description, techStack: p.techStack, githubUrl: p.githubUrl, liveUrl: undefined as string | undefined })),
];

const norm = (t: string) => t.toLowerCase().replace(/s$/, "");
/** Projects whose stack mentions this skill ("SQL" matches "PostgreSQL (Supabase)"). */
export function projectsUsing(skill: string): string[] {
  return [...projectsData, krishiOsProject, ...additionalProjectsData]
    .filter((p) => p.techStack.some((t) => norm(t).includes(norm(skill)) || norm(skill).includes(norm(t))))
    .map((p) => p.title);
}
