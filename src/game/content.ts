import { CONTACT_EMAIL, aiKnowledgeBase, currentProcesses, krishiOsProject, ownerProfile, projectsData } from "@/lib/data";
import type { Dir, Look, ObjectKind } from "./textures";

export type Rarity = "Common" | "Rare" | "Epic" | "Legendary";
// Light / mid / dark shades per rarity: crystal sprites and journal icons. Presentation only.
export const RARITY_COLORS: Record<Rarity, [string, string, string]> = {
  Common: ["#c9eab0", "#97cd74", "#5e9e48"],
  Rare: ["#d4f0f8", "#7bc9df", "#4791c4"],
  Epic: ["#e2d0fa", "#b48be8", "#7a52b8"],
  Legendary: ["#fff1c4", "#f5c65b", "#c9902e"],
};

// Everything the world says about Krishi is built from src/lib/data.ts, so the game can't drift from the
// portfolio or claim anything new. Flavour lines (greetings, jokes) never state facts about him.

export interface Attribute {
  id: string;
  name: string;
  category: string;
  description: string;
  skills: string[];
  projects: string[];
  rarity: Rarity; // presentation only (colour, journal sorting), never a claim about skill level
}

export const ATTRIBUTES: Attribute[] = [
  {
    id: "ai-explorer",
    name: "AI Explorer",
    category: "Education",
    description: `Studying a Master of Artificial Intelligence at Monash University in ${currentProcesses.location}, graduating ${currentProcesses.graduation}.`,
    skills: currentProcesses.learning,
    projects: currentProcesses.running.map((p) => p.name),
    rarity: "Rare",
  },
  {
    id: "computer-vision",
    name: "Computer Vision Specialist",
    category: "Skill",
    description: "Built two computer-vision systems: AccessVision (YOLOv8 + BLIP visual question answering) and Traffic AI (YOLO vehicle detection on an NVIDIA Jetson Nano).",
    skills: ["Computer Vision", "YOLOv8", "BLIP", "OpenCV"],
    projects: ["AccessVision", "Traffic AI"],
    rarity: "Epic",
  },
  {
    id: "researcher",
    name: "Researcher",
    category: "Research",
    description: "Built ClinicalBrief, a clinical intelligence research prototype where every AI finding is traced to its source and approved by a person before it counts.",
    skills: project("clinicalbrief").techStack,
    projects: ["ClinicalBrief"],
    rarity: "Epic",
  },
  {
    id: "problem-solver",
    name: "Problem Solver",
    category: "Engineering",
    description: `Traffic AI gives green time to the lanes that actually have queues instead of running fixed timers. ${project("traffic-ai").keyOutcome}`,
    skills: project("traffic-ai").techStack,
    projects: ["Traffic AI"],
    rarity: "Rare",
  },
  {
    id: "innovator",
    name: "Innovator",
    category: "Product",
    description: "Built KRISHI.OS: this portfolio presented as an operating system, with a chat assistant, a knowledge graph, and this world inside it.",
    skills: krishiOsProject.techStack,
    projects: ["KRISHI.OS"],
    rarity: "Legendary",
  },
];

function project(id: string) {
  const p = projectsData.find((x) => x.id === id);
  if (!p) throw new Error(`KRISHI.WORLD: unknown project ${id}`);
  return p;
}

export interface Npc {
  id: string;
  name: string;
  x: number;
  y: number;
  facing: Dir;
  look: Look;
  pages: string[];
}

const { aboutMe } = aiKnowledgeBase;
// roleSummary's first and last sentences (the middle is MDAS, which belongs to Leadership Frontier)
const sentences = aboutMe.roleSummary.match(/[^.]+\./g) ?? [aboutMe.roleSummary];

export const ORIGIN_NPCS: Npc[] = [
  {
    id: "guide",
    name: "Guide",
    x: 23,
    y: 16,
    facing: "left",
    look: { hair: "#c06030", hairLight: "#e08850", top: "#e0564a", topDark: "#a83a32", trim: "#f5e8c8", pants: "#2c3a5a", band: null },
    pages: [
      "Welcome to KRISHI.WORLD! This valley is where Krishi's story starts.",
      "Walk with WASD or the arrow keys. Press E to talk to people or inspect things.",
      "Anything you discover goes in your Discovery Journal. Press I to open it.",
    ],
  },
  {
    id: "neighbour",
    name: "Neighbour",
    x: 10,
    y: 8,
    facing: "down",
    look: { hair: "#2a2a35", hairLight: "#4a4a5a", top: "#f5c65b", topDark: "#c9902e", trim: "#ffffff", pants: "#6e4524", band: null },
    pages: [`Looking for Krishi? Folks around here call him an ${aboutMe.tagline}.`, sentences[0].trim(), sentences[sentences.length - 1].trim()],
  },
  {
    id: "professor",
    name: "Professor",
    x: 26,
    y: 9,
    facing: "down",
    look: { hair: "#9aa0a8", hairLight: "#c8ccd4", top: "#f4f4f4", topDark: "#c8ccd4", trim: "#7bc9df", pants: "#3a3a48", band: null },
    pages: [
      "Ah, a visitor! This is the university.",
      `Krishi is studying a Master of Artificial Intelligence at Monash University, graduating ${currentProcesses.graduation}.`,
      `He came to AI from ${ownerProfile.background}.`,
      `These days he's learning ${currentProcesses.learning.join(", ")}.`,
      "I dropped something shiny by the flowerbed on the east side. Would you fetch it?",
    ],
  },
  {
    id: "gardener",
    name: "Gardener",
    x: 27,
    y: 22,
    facing: "down",
    look: { hair: "#6e4524", hairLight: "#9a6a3c", top: "#5e9e48", topDark: "#3f7a32", trim: "#f5c65b", pants: "#46382b", band: "#e0564a" },
    pages: [
      "Lovely day for the garden.",
      `When Krishi isn't building, you'll find him into ${ownerProfile.hobbies.join(", ").toLowerCase()}.`,
      "I hear there's a whole coast for that further out. Maybe one day!",
    ],
  },
];

// Things you can inspect by facing them and pressing E, keyed by tile "x,y"
export const ORIGIN_SIGNS: Record<string, string[]> = {
  "18,13": ["ORIGIN VALLEY", "Where Krishi's story begins.", "North: the university. West: the homes. East: Project Metropolis."],
  "9,6": ["A letter addressed to Krishi sits in the mailbox.", `The return address says you can reach him at ${CONTACT_EMAIL}.`],
  "16,6": ["The mailbox is empty."],
};

export const DOOR_TEXT: Partial<Record<ObjectKind, string[]>> = {
  house: ["The door is locked. Nobody seems to be home."],
  university: ["The doors are shut for the term break. Try again later!"],
};

// Attribute crystals placed in Origin Valley
export const ORIGIN_CRYSTALS: { attribute: string; x: number; y: number }[] = [{ attribute: "ai-explorer", x: 32, y: 8 }];

// ---------- Project Metropolis ----------

export const METRO_NPCS: Npc[] = [
  {
    id: "engineer",
    name: "Engineer",
    x: 17,
    y: 17,
    facing: "down",
    look: { hair: "#1f1d24", hairLight: "#3a3a48", top: "#3a3f4a", topDark: "#23262e", trim: "#f5c65b", pants: "#2c3a5a", band: "#7bc9df" },
    pages: [
      "Welcome to Project Metropolis! Every HQ in this plaza is one of Krishi's projects.",
      "Walk up to a building's doors and press E to open its terminal.",
      "Reading a terminal for the first time adds an attribute to your journal.",
    ],
  },
  {
    id: "commuter",
    name: "Commuter",
    x: 5,
    y: 12,
    facing: "right",
    look: { hair: "#c9902e", hairLight: "#f5c65b", top: "#7a52b8", topDark: "#553a85", trim: "#ffffff", pants: "#46382b", band: null },
    pages: ["The road west goes back to Origin Valley.", "I'm told more regions are being built past the city limits."],
  },
];

export const METRO_SIGNS: Record<string, string[]> = {
  "8,9": [`ACCESSVISION HQ`, project("accessible-vision").subtitle],
  "28,9": [`CLINICALBRIEF HQ`, project("clinicalbrief").subtitle],
  "8,24": [`TRAFFIC AI HQ`, project("traffic-ai").subtitle],
  "28,24": [`KRISHI.OS HQ`, krishiOsProject.subtitle],
};

// ---------- per-map registry ----------

export interface MapContent {
  npcs: Npc[];
  signs: Record<string, string[]>;
  crystals: { attribute: string; x: number; y: number }[];
}

export const MAP_CONTENT: Record<string, MapContent> = {
  origin: { npcs: ORIGIN_NPCS, signs: ORIGIN_SIGNS, crystals: ORIGIN_CRYSTALS },
  metropolis: { npcs: METRO_NPCS, signs: METRO_SIGNS, crystals: [] },
};

export const ALL_NPCS = Object.values(MAP_CONTENT).flatMap((c) => c.npcs);

// ---------- project terminals ----------

export interface TerminalProject {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  problem?: string;
  solution?: string;
  status?: string;
  techStack: string[];
  flow: { label: string; description: string }[];
  features: string[]; // decisions / features
  achievements: string[];
  challenge?: string;
  tradeOffs?: string;
  extras: string[]; // owner-confirmed details beyond the portfolio card
  githubUrl?: string;
  liveUrl?: string;
  attribute: string; // granted the first time this terminal is read
}

function fromPortfolio(id: string, attribute: string): TerminalProject {
  const p = project(id);
  return {
    id,
    title: p.title,
    subtitle: p.subtitle,
    description: p.description,
    problem: p.overview.problem,
    solution: p.overview.solution,
    status: p.overview.status,
    techStack: p.techStack,
    flow: p.architecture.flow,
    features: p.architecture.decisions,
    achievements: [p.keyOutcome, ...p.impact.achievements.filter((a) => a !== p.keyOutcome)],
    challenge: p.challenge,
    tradeOffs: p.tradeOffs,
    extras: ownerProfile.projectNotes[id] ?? [],
    githubUrl: p.githubUrl,
    liveUrl: p.liveUrl,
    attribute,
  };
}

export const TERMINALS: Record<string, TerminalProject> = {
  "accessible-vision": fromPortfolio("accessible-vision", "computer-vision"),
  clinicalbrief: fromPortfolio("clinicalbrief", "researcher"),
  "traffic-ai": fromPortfolio("traffic-ai", "problem-solver"),
  "krishi-os": {
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
    attribute: "innovator",
  },
};

// Which building's doors open which terminal
export const DOOR_TERMINAL: Partial<Record<ObjectKind, string>> = {
  "bldg-accessvision": "accessible-vision",
  "bldg-clinicalbrief": "clinicalbrief",
  "bldg-traffic": "traffic-ai",
  "bldg-os": "krishi-os",
};
