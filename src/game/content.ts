import {
  CONTACT_EMAIL,
  additionalProjectsData,
  aiKnowledgeBase,
  currentProcesses,
  experienceData,
  krishiOsProject,
  ownerProfile,
  projectsData,
} from "@/lib/data";
import type { Dir, Look, ObjectKind } from "./textures";
import { FEATURED, type ProjectDetail } from "@/lib/portfolio";

export { RARITY_COLORS, type Rarity } from "@/lib/retro";
import type { Rarity } from "@/lib/retro";

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
      "Walk up to a building's doors and press E to step inside: every exhibit in there is part of the project.",
      "Reading the full project file on the desk PC for the first time adds an attribute to your journal.",
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
// Same project details as Classic Mode (src/lib/portfolio.ts); the game only adds which attribute a first
// read awards.

export type TerminalProject = ProjectDetail & { attribute: string };

const TERMINAL_ATTRIBUTE: Record<string, string> = {
  clinicalbrief: "researcher",
  "accessible-vision": "computer-vision",
  "traffic-ai": "problem-solver",
  "krishi-os": "innovator",
};

export const TERMINALS: Record<string, TerminalProject> = Object.fromEntries(
  FEATURED.map((p) => [p.id, { ...p, attribute: TERMINAL_ATTRIBUTE[p.id] }])
);

// Which building's doors open which terminal
export const DOOR_TERMINAL: Partial<Record<ObjectKind, string>> = {
  "bldg-accessvision": "accessible-vision",
  "bldg-clinicalbrief": "clinicalbrief",
  "bldg-traffic": "traffic-ai",
  "bldg-os": "krishi-os",
};

// ---------- Innovation Forest: skills ----------

// Groups of the owner-confirmed skills (ownerProfile.skills). Anything not in that list is dropped, so a typo
// here can't invent a skill.
const SKILL_GROUPS = [
  { id: "python-developer", name: "Python Developer", label: "LANGUAGES", skills: ["Python", "SQL", "FastAPI"], rarity: "Common" },
  { id: "app-builder", name: "App Builder", label: "FRAMEWORKS", skills: ["JavaScript", "TypeScript", "Next.js", "Flutter"], rarity: "Rare" },
  { id: "deep-learning", name: "Deep Learning Practitioner", label: "AI & ML", skills: ["PyTorch", "TensorFlow", "Deep Learning", "Computer Vision"], rarity: "Epic" },
  { id: "agent-builder", name: "Agent Builder", label: "LLMs & AGENTS", skills: ["LLMs", "AI Agents"], rarity: "Epic" },
  { id: "toolsmith", name: "Toolsmith", label: "TOOLS", skills: ["Docker", "Git", "Cloud technologies"], rarity: "Common" },
] as const;

const confirmedSkills = (skills: readonly string[]) => skills.filter((sk) => ownerProfile.skills.includes(sk));
const norm = (t: string) => t.toLowerCase().replace(/s$/, "");
// Projects whose stack mentions one of these skills ("SQL" matches "PostgreSQL (Supabase)", "LLMs" matches "local LLM")
const projectsUsing = (skills: string[]) =>
  [...projectsData, krishiOsProject]
    .filter((pr) => pr.techStack.some((t) => skills.some((sk) => norm(t).includes(norm(sk)))))
    .map((pr) => pr.title);

function skillAttributes(): Attribute[] {
  return SKILL_GROUPS.map((g) => {
    const skills = confirmedSkills(g.skills);
    return {
      id: g.id,
      name: g.name,
      category: "Skill",
      description: `Part of Krishi's toolkit: ${skills.join(", ")}.`,
      skills,
      projects: projectsUsing(skills),
      rarity: g.rarity,
    };
  });
}

// ---------- Leadership Frontier: roles (role, organisation, dates and skills only) ----------

function role(id: string) {
  const e = experienceData.find((x) => x.id === id);
  if (!e) throw new Error(`KRISHI.WORLD: unknown experience ${id}`);
  return e;
}

const ROLE_ATTRIBUTES = [
  { id: "team-leader", name: "Team Leader", role: "mdas-vp", rarity: "Epic" },
  { id: "community-builder", name: "Community Builder", role: "mosaic-coordinator", rarity: "Rare" },
  { id: "professional", name: "Professional", role: "mysahayak-intern", rarity: "Rare" },
  { id: "helping-hand", name: "Helping Hand", role: "sacredheart-volunteer", rarity: "Common" },
] as const;

function roleAttributes(): Attribute[] {
  return ROLE_ATTRIBUTES.map((r) => {
    const e = role(r.role);
    return {
      id: r.id,
      name: r.name,
      category: "Experience",
      description: `${e.organization}: ${e.role} (${e.period}).`,
      skills: e.skills,
      projects: [],
      rarity: r.rarity,
    };
  });
}

// ---------- Adventure Coast: life outside tech (owner-confirmed hobbies) ----------

const hobbies = (...names: string[]) => names.filter((h) => ownerProfile.hobbies.includes(h));
const auraLens = additionalProjectsData.find((x) => x.id === "auralens-ai");

function hobbyAttributes(): Attribute[] {
  return [
    {
      id: "photographer",
      name: "Photographer",
      category: "Hobby",
      description: auraLens
        ? `Photography is one of Krishi's hobbies, and he built ${auraLens.title} for it: ${auraLens.description}`
        : "Photography is one of Krishi's hobbies.",
      skills: hobbies("Photography"),
      projects: auraLens ? [auraLens.title] : [],
      rarity: "Rare",
    },
    {
      id: "ocean-explorer",
      name: "Ocean Explorer",
      category: "Hobby",
      description: `Among Krishi's hobbies: ${hobbies("Scuba diving", "Swimming", "Travel").join(", ").toLowerCase()}.`,
      skills: hobbies("Scuba diving", "Swimming", "Travel"),
      projects: [],
      rarity: "Rare",
    },
    {
      id: "mindful-mover",
      name: "Mindful Mover",
      category: "Hobby",
      description: `Among Krishi's hobbies: ${hobbies("Yoga", "Aerial yoga", "Fitness & lifting").join(", ").toLowerCase()}.`,
      skills: hobbies("Yoga", "Aerial yoga", "Fitness & lifting"),
      projects: [],
      rarity: "Common",
    },
  ];
}

// ---------- region characters, signs and crystals ----------

const LAB_COAT: Look = { hair: "#9aa0a8", hairLight: "#c8ccd4", top: "#f4f4f4", topDark: "#c8ccd4", trim: "#7bc9df", pants: "#3a3a48", band: null };
const skillLine = (label: string) => {
  const g = SKILL_GROUPS.find((x) => x.label === label);
  return g ? confirmedSkills(g.skills).join(" · ") : "";
};

export const FOREST: MapContent = {
  npcs: [
    {
      id: "researcher",
      name: "Researcher",
      x: 16,
      y: 11,
      facing: "down",
      look: LAB_COAT,
      pages: [
        "Welcome to Innovation Forest, where Krishi's skills grow.",
        `His toolkit: ${ownerProfile.skills.join(", ")}.`,
        "Five skill crystals are hidden off the trails. Try looking behind the trees!",
      ],
    },
    {
      id: "intern",
      name: "Lab Intern",
      x: 25,
      y: 14,
      facing: "up",
      look: { ...LAB_COAT, hair: "#c06030", hairLight: "#e08850" },
      pages: ["Each computer by the trail describes part of his stack.", `Lately he's been learning ${currentProcesses.learning.join(", ")}.`],
    },
  ],
  signs: {
    "21,26": ["INNOVATION FOREST", "Krishi's skills and tools. Five crystals are hidden off the trails."],
    "8,11": ["LANGUAGES", skillLine("LANGUAGES")],
    "14,11": ["AI & ML", skillLine("AI & ML")],
    "24,11": ["FRAMEWORKS", skillLine("FRAMEWORKS")],
    "32,11": ["LLMs & AGENTS", skillLine("LLMs & AGENTS"), "TOOLS", skillLine("TOOLS")],
  },
  crystals: [
    { attribute: "python-developer", x: 4, y: 19 },
    { attribute: "app-builder", x: 35, y: 20 },
    { attribute: "deep-learning", x: 11, y: 25 },
    { attribute: "agent-builder", x: 28, y: 25 },
    { attribute: "toolsmith", x: 35, y: 7 },
  ],
};

const mdas = role("mdas-vp");
const mosaic = role("mosaic-coordinator");
const mysahayak = role("mysahayak-intern");
const sacredHeart = role("sacredheart-volunteer");
const listSkills = (skills: string[]) => skills.join(", "); // keep casing: Flutter, API, QA

export const FRONTIER: MapContent = {
  npcs: [
    {
      id: "host",
      name: "Event Host",
      x: 19,
      y: 9,
      facing: "down",
      look: { hair: "#2a2a35", hairLight: "#4a4a5a", top: "#d9a23f", topDark: "#a8742a", trim: "#ffffff", pants: "#2c3a5a", band: null },
      pages: [
        "Welcome to the Leadership Frontier!",
        `At ${mdas.organization}, Krishi's role: ${mdas.role}.`,
        `The work: ${listSkills(mdas.skills)}.`,
      ],
    },
    {
      id: "coordinator",
      name: "Coordinator",
      x: 9,
      y: 15,
      facing: "right",
      look: { hair: "#6e4524", hairLight: "#9a6a3c", top: "#7bc9df", topDark: "#4791c4", trim: "#ffffff", pants: "#46382b", band: "#f5c65b" },
      pages: [`Krishi is ${mosaic.role} at ${mosaic.organization} (${mosaic.period}).`, `It's all about ${listSkills(mosaic.skills)}.`],
    },
    {
      id: "mentor",
      name: "Mentor",
      x: 8,
      y: 8,
      facing: "down",
      look: { hair: "#9aa0a8", hairLight: "#c8ccd4", top: "#3a3f4a", topDark: "#23262e", trim: "#e0564a", pants: "#2c3a5a", band: null },
      pages: [`${mysahayak.organization}: ${mysahayak.role}, ${mysahayak.period}.`, `There he worked on ${listSkills(mysahayak.skills)}.`],
    },
    {
      id: "volunteer",
      name: "Volunteer",
      x: 34,
      y: 8,
      facing: "down",
      look: { hair: "#c9902e", hairLight: "#f5c65b", top: "#e0564a", topDark: "#a83a32", trim: "#ffffff", pants: "#46382b", band: null },
      pages: [`At ${sacredHeart.organization}, Krishi's role is ${sacredHeart.role} (${sacredHeart.period}).`],
    },
  ],
  signs: { "2,12": ["LEADERSHIP FRONTIER", "Krishi's leadership and work experience."] },
  crystals: [
    { attribute: "team-leader", x: 35, y: 19 },
    { attribute: "community-builder", x: 4, y: 19 },
    { attribute: "professional", x: 4, y: 9 },
    { attribute: "helping-hand", x: 35, y: 10 },
  ],
};

export const COAST: MapContent = {
  npcs: [
    {
      id: "photographer",
      name: "Photographer",
      x: 7,
      y: 11,
      facing: "left",
      look: { hair: "#1f1d24", hairLight: "#3a3a48", top: "#46382b", topDark: "#2b2420", trim: "#f5c65b", pants: "#2c3a5a", band: null },
      pages: ["Photography is one of Krishi's hobbies.", ...(auraLens ? [`He even built ${auraLens.title}: ${auraLens.description}`] : [])],
    },
    {
      id: "instructor",
      name: "Yoga Instructor",
      x: 20,
      y: 9,
      facing: "down",
      look: { hair: "#2a2a35", hairLight: "#4a4a5a", top: "#b48be8", topDark: "#7a52b8", trim: "#ffffff", pants: "#2b2420", band: "#34d399" },
      pages: ["Welcome to the yoga deck!", `Krishi's hobbies include ${hobbies("Yoga", "Aerial yoga", "Fitness & lifting").join(", ").toLowerCase()}.`],
    },
    {
      id: "diver",
      name: "Diver",
      x: 35,
      y: 11,
      facing: "left",
      look: { hair: "#c06030", hairLight: "#e08850", top: "#1f1d24", topDark: "#0a0c0b", trim: "#7bc9df", pants: "#1f1d24", band: null },
      pages: [`${hobbies("Scuba diving", "Swimming").join(" and ")} are among Krishi's hobbies.`, "See that buoy past the island? It marks a dive spot."],
    },
    {
      id: "traveller",
      name: "Traveller",
      x: 28,
      y: 22,
      facing: "down",
      look: { hair: "#c9902e", hairLight: "#f5c65b", top: "#e0564a", topDark: "#a83a32", trim: "#f5e8c8", pants: "#6e4524", band: null },
      pages: ["Travel is on Krishi's list of hobbies too.", "Me? I just like islands."],
    },
  ],
  signs: {
    "21,6": ["ADVENTURE COAST", "Krishi's life outside tech."],
    "5,11": ["A camera on a tripod, framed on the sunset."],
    "19,11": ["A yoga mat, rolled out facing the sea."],
    "21,11": ["A yoga mat, rolled out facing the sea."],
    "34,22": ["A dive buoy bobs on the water. The dive spot must be right below!"],
  },
  crystals: [
    { attribute: "photographer", x: 11, y: 21 },
    { attribute: "ocean-explorer", x: 31, y: 21 },
    { attribute: "mindful-mover", x: 23, y: 11 },
  ],
};

// Appended here (not in the ATTRIBUTES literal) because they read constants declared above
ATTRIBUTES.push(...skillAttributes(), ...roleAttributes(), ...hobbyAttributes());
MAP_CONTENT.forest = FOREST;
MAP_CONTENT.frontier = FRONTIER;
MAP_CONTENT.coast = COAST;
ALL_NPCS.push(...FOREST.npcs, ...FRONTIER.npcs, ...COAST.npcs);
Object.assign(DOOR_TEXT, {
  lab: ["The lab is mid-experiment. Please don't disturb!"],
  arena: ["The arena is between events right now."],
  office: ["You need a visitor badge to go upstairs."],
  hut: ["The dive shop is closed. Gone diving!"],
});

// ---------- regions, world map and achievements ----------

export interface Region {
  id: string;
  name: string;
  blurb: string;
  x: number; // world-map position (percent of the map panel)
  y: number;
  color: string;
}

export const REGIONS: Region[] = [
  { id: "forest", name: "Innovation Forest", blurb: "Skills and tools", x: 38, y: 22, color: "#285943" },
  { id: "origin", name: "Origin Valley", blurb: "About and education", x: 38, y: 52, color: "#78b85a" },
  { id: "metropolis", name: "Project Metropolis", blurb: "Projects", x: 64, y: 52, color: "#9c9486" },
  { id: "frontier", name: "Leadership Frontier", blurb: "Leadership and experience", x: 88, y: 52, color: "#d9a23f" },
  { id: "coast", name: "Adventure Coast", blurb: "Life outside tech", x: 38, y: 82, color: "#f2e2b4" },
];

// Bridges on the world map (matches the warps between maps)
export const ROUTES: [string, string][] = [
  ["origin", "forest"],
  ["origin", "metropolis"],
  ["metropolis", "frontier"],
  ["origin", "coast"],
];

export interface ProgressSnapshot {
  regions: string[];
  attributes: string[];
  terminals: string[];
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  done: (p: ProgressSnapshot) => boolean;
}

export const ACHIEVEMENTS: Achievement[] = [
  { id: "first-steps", name: "First Steps", description: "Explore Origin Valley.", done: (p) => p.regions.includes("origin") },
  { id: "curious-mind", name: "Curious Mind", description: "Discover five attributes.", done: (p) => p.attributes.length >= 5 },
  { id: "into-the-forest", name: "Into the Forest", description: "Visit Innovation Forest.", done: (p) => p.regions.includes("forest") },
  { id: "builder", name: "Builder", description: "Read your first project terminal.", done: (p) => p.terminals.length >= 1 },
  { id: "team-player", name: "Team Player", description: "Visit Leadership Frontier.", done: (p) => p.regions.includes("frontier") },
  { id: "adventurer", name: "Adventurer", description: "Reach Adventure Coast.", done: (p) => p.regions.includes("coast") },
  { id: "world-explorer", name: "World Explorer", description: "Visit all five regions.", done: (p) => REGIONS.every((r) => p.regions.includes(r.id)) },
  { id: "completionist", name: "Completionist", description: "Discover every attribute.", done: (p) => ATTRIBUTES.every((a) => p.attributes.includes(a.id)) },
];

// ---------- HQ interiors ----------
// Inside each project HQ, every piece of furniture is one part of the same project file (src/lib/portfolio.ts).
export type ExhibitSection = "overview" | "architecture" | "tech" | "outcomes" | "screens";
export const EXHIBITS: Partial<Record<ObjectKind, ExhibitSection | "terminal">> = {
  pinboard: "overview",
  whiteboard: "architecture",
  bookshelf: "tech",
  cabinet: "outcomes",
  tvwall: "screens",
  desk: "terminal", // the full project file (and the attribute, on a first read)
};
export const EXHIBIT_TITLE: Record<ExhibitSection, string> = {
  overview: "PINBOARD · OVERVIEW & ROLE",
  architecture: "WHITEBOARD · ARCHITECTURE",
  tech: "BOOKSHELF · TECH STACK",
  outcomes: "TROPHY CABINET · FEATURES & OUTCOMES",
  screens: "TV WALL · SCREENS",
};
export const interiorId = (project: string) => `hq-${project}`;
