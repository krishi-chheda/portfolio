// Derived views over src/lib/data.ts, shared by both modes (Classic Mode's sections and Adventure Mode's
// terminals/NPCs). No React or Phaser here, so either side can import it. Never copy project text elsewhere:
// add or fix it in data.ts and both modes update.
import { additionalProjectsData, experienceData, krishiOsProject, ownerProfile, projectsData, type Project } from "./data";

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
  featuresTitle: string; // what the features list is: "Key decisions" or "Key features"
  architectureNote?: string;
  lessons: string[];
  achievements: string[];
  challenge?: string;
  tradeOffs?: string;
  whyBuilt?: string;
  next?: string;
  extras: string[]; // owner-confirmed details beyond the portfolio card
  githubUrl?: string;
  liveUrl?: string;
  screenshots: Screenshot[];
}

/** A real capture of the live deployment (public/projects). Never a mock-up. */
export interface Screenshot {
  src: string;
  alt: string;
  caption: string;
  width: number;
  height: number;
}
const CAPTURED = "Live site, captured Nov 2026";
const SCREENSHOTS: Record<string, Screenshot[]> = {
  clinicalbrief: [
    { src: "/projects/clinicalbrief.png", alt: "ClinicalBrief landing page: 'The reviewed record for clinical notes'", caption: `${CAPTURED} (home)`, width: 1280, height: 800 },
    { src: "/projects/clinicalbrief-security.png", alt: "ClinicalBrief security page: authentication, roles and authorization", caption: `${CAPTURED} (security)`, width: 1280, height: 800 },
    { src: "/projects/clinicalbrief-roadmap.png", alt: "ClinicalBrief roadmap page: phases done, next and planned", caption: `${CAPTURED} (roadmap)`, width: 1280, height: 800 },
    { src: "/projects/clinicalbrief-data.png", alt: "ClinicalBrief data page: synthetic Synthea patients only", caption: `${CAPTURED} (data)`, width: 1280, height: 800 },
  ],
  "accessible-vision": [
    { src: "/projects/accessvision.png", alt: "AccessVision web app with the camera panel, Analyze Scene button and Scene Narration card", caption: `${CAPTURED} (desktop)`, width: 1280, height: 800 },
    { src: "/projects/accessvision-narrow.png", alt: "AccessVision in a narrow, phone-like window: camera panel, Analyze Scene, Scene Narration", caption: `${CAPTURED} (narrow window)`, width: 600, height: 1000 },
  ],
  "krishi-os": [
    { src: "/projects/krishios-title.png", alt: "KRISHI.WORLD title screen with Adventure Mode and Classic Portfolio cards", caption: "Title screen", width: 1280, height: 800 },
    { src: "/projects/krishios-world.png", alt: "Adventure Mode: the player in Origin Valley with two NPCs", caption: "Adventure Mode", width: 1280, height: 800 },
    { src: "/projects/krishios-classic.png", alt: "Classic Portfolio: trainer profile and section menu", caption: "Classic Portfolio", width: 1280, height: 800 },
  ],
};

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
    featuresTitle: "Key decisions",
    architectureNote: p.architectureExplain,
    lessons: p.impact.lessons,
    achievements: [p.keyOutcome, ...p.impact.achievements.filter((a) => a !== p.keyOutcome)],
    challenge: p.challenge,
    tradeOffs: p.tradeOffs,
    whyBuilt: p.whyBuilt,
    next: p.futureImprovement,
    extras: ownerProfile.projectNotes[p.id] ?? [],
    githubUrl: p.githubUrl,
    liveUrl: p.liveUrl,
    screenshots: SCREENSHOTS[p.id] ?? [],
  };
}

const krishiOs: ProjectDetail = {
  id: krishiOsProject.id,
  title: krishiOsProject.title,
  subtitle: krishiOsProject.subtitle,
  description: krishiOsProject.description,
  techStack: krishiOsProject.techStack,
  // How this repo is put together (see docs/PROJECT_CONTEXT.md)
  flow: [
    { label: "KRISHI.OS boot", description: "Canvas particle boot, once per browser session" },
    { label: "Title screen", description: "Mode select that remembers the last mode played" },
    { label: "Adventure / Classic", description: "Phaser 3 world loaded on demand, or a server-rendered page" },
    { label: "Shared data", description: "data.ts and portfolio.ts feed both modes" },
    { label: "Ask Krishi", description: "/api/chat: gpt-4o-mini, or local answers from the same data" },
  ],
  features: krishiOsProject.features,
  featuresTitle: "Key features",
  lessons: [],
  achievements: [],
  extras: [],
  githubUrl: krishiOsProject.githubUrl,
  liveUrl: krishiOsProject.liveUrl,
  screenshots: SCREENSHOTS["krishi-os"],
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

// Which real stack entries count as using a skill. Exact names by default; umbrella skills list the specific
// technologies they cover (YOLO is computer vision and deep learning). Never infer beyond what a stack names.
const SKILL_TECH: Record<string, string[]> = {
  SQL: ["PostgreSQL (Supabase)"],
  "Computer Vision": ["YOLOv8", "YOLO", "OpenCV", "Mediapipe", "BLIP", "Hugging Face CLIP"],
  "Deep Learning": ["YOLOv8", "YOLO", "BLIP", "Hugging Face CLIP"],
  LLMs: ["Ollama (local LLM)"],
  "Jetson Nano": ["NVIDIA Jetson Nano"],
  "Cloud technologies": ["Supabase", "PostgreSQL (Supabase)"],
};
const techFor = (skill: string) => (SKILL_TECH[skill] ?? [skill]).map((t) => t.toLowerCase());
const ALL_PROJECTS = [...projectsData, krishiOsProject, ...additionalProjectsData];
const usesSkill = (stack: string[], skill: string) => stack.some((t) => techFor(skill).includes(t.toLowerCase()));

/** Projects whose stack uses this skill. */
export function projectsUsing(skill: string): string[] {
  return ALL_PROJECTS.filter((p) => usesSkill(p.techStack, skill)).map((p) => p.title);
}

// What each technology is: general, factual descriptions (nothing about Krishi's level).
const SKILL_DESCRIPTIONS: Record<string, string> = {
  Python: "General-purpose language; the default for machine learning, data work and backend services.",
  JavaScript: "The language of the web browser, also used on servers through Node.js.",
  TypeScript: "JavaScript with static types, so many mistakes are caught before the code runs.",
  SQL: "The standard language for querying and managing relational databases.",
  Dart: "Google's language behind the Flutter UI toolkit.",
  PyTorch: "Open-source deep learning framework for building and training neural networks.",
  TensorFlow: "Google's open-source machine learning framework for training and deploying models.",
  "Computer Vision": "Getting software to understand images and video: detection, classification, tracking.",
  "Deep Learning": "Machine learning with many-layered neural networks.",
  LLMs: "Large language models: neural networks that read and generate text.",
  "AI Agents": "Systems where a language model plans steps and calls tools to finish a task.",
  "Next.js": "React framework with routing, server rendering and API routes.",
  React: "Library for building user interfaces out of components.",
  Flutter: "Google's toolkit for building iOS, Android and web apps from one Dart codebase.",
  FastAPI: "Python web framework for building typed, fast HTTP APIs.",
  Docker: "Packages an application and its dependencies into a portable container.",
  Git: "Distributed version control for tracking and sharing code changes.",
  Linux: "The open-source operating system family behind most servers and embedded devices.",
  MySQL: "A widely used open-source relational database.",
  CUDA: "NVIDIA's platform for running general computation on GPUs.",
  "Jetson Nano": "NVIDIA's small single-board computer for running AI models at the edge.",
  "Cloud technologies": "Hosted infrastructure and managed services for deploying and scaling applications.",
};

export interface SkillProfile {
  name: string;
  description: string;
  projects: { title: string; summary: string; href?: string }[]; // practical applications
  experience: { organization: string; role: string }[];
  related: string[]; // other technologies used alongside it in those projects
}

/** Everything the Skilldex shows for one skill, derived from real project stacks and experience. */
export function skillProfile(skill: string): SkillProfile {
  const projects = ALL_PROJECTS.filter((p) => usesSkill(p.techStack, skill));
  const lower = skill.toLowerCase();
  const experience = experienceData
    .filter((e) => e.skills.some((s) => s.toLowerCase().split(/\s+/).includes(lower)))
    .map((e) => ({ organization: e.organization, role: e.role }));
  const own = new Set(techFor(skill));
  const counts = new Map<string, number>();
  for (const p of projects) for (const t of p.techStack) if (!own.has(t.toLowerCase())) counts.set(t, (counts.get(t) ?? 0) + 1);
  return {
    name: skill,
    description: SKILL_DESCRIPTIONS[skill] ?? "",
    projects: projects.map((p) => ({
      title: p.title,
      summary: p.subtitle,
      href: PROJECT_DETAILS[p.id] ? `/classic/projects/${p.id}` : (p.githubUrl ?? ("liveUrl" in p ? p.liveUrl : undefined)),
    })),
    experience,
    related: [...counts.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([t]) => t),
  };
}
