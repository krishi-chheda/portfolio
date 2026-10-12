import { experienceData, projectsData, type Experience, type Project } from "@/lib/data";

// System Map: a fixed knowledge graph derived from src/lib/data.ts.
// Every node has a constant 3D position; the view only changes when the user rotates it.

export type Group = "domain" | "project" | "role" | "tech";

export interface TopoNode {
  id: string;
  group: Group;
  label: string;
  description: string;
  project?: Project;
  role?: Experience;
  pos: [number, number, number]; // unit-sphere coordinates, constant
}

export const GROUPS: { id: Group; label: string; plural: string; color: string }[] = [
  { id: "domain", label: "domain", plural: "domains", color: "var(--color-accent)" },
  { id: "project", label: "project", plural: "projects", color: "var(--color-accent-2)" },
  { id: "role", label: "role", plural: "roles", color: "var(--color-gold)" },
  { id: "tech", label: "shared tech", plural: "shared tech", color: "var(--color-ink-soft)" },
];
export const GROUP = Object.fromEntries(GROUPS.map((g) => [g.id, g])) as Record<Group, (typeof GROUPS)[number]>;

// Domains are described only through the projects and roles they connect to.
const DOMAINS: { id: string; label: string; description: string }[] = [
  {
    id: "ai",
    label: "AI",
    description:
      "Applied across three projects: grounded multimodal reasoning with YOLOv8 + BLIP in AccessVision, an AI pipeline over clinical notes with a local-LLM copilot in ClinicalBrief, and YOLO vehicle detection that informs signal timing in Traffic AI.",
  },
  {
    id: "computer-vision",
    label: "Computer Vision",
    description:
      "Object detection and grounded visual question answering (YOLOv8 + BLIP) in AccessVision; vehicle detection with YOLO and OpenCV lane regions on an NVIDIA Jetson Nano in Traffic AI.",
  },
  {
    id: "healthcare-ai",
    label: "Healthcare AI",
    description:
      "ClinicalBrief: FHIR R4 records ingested into one canonical model with provenance, AI findings from clinical notes kept under human review, and a copilot grounded in one patient's record. Synthetic (Synthea) data only.",
  },
  {
    id: "accessibility",
    label: "Accessibility",
    description:
      "AccessVision: a voice-first mobile PWA for visually impaired users that describes scenes aloud and answers spoken follow-up questions.",
  },
  {
    id: "product-development",
    label: "Product Development",
    description:
      "Lead Product Developer on StudentHub, a deployed portal for students arriving in Melbourne; AccessVision and ClinicalBrief also run as live deployments.",
  },
  {
    id: "full-stack",
    label: "Full-stack Engineering",
    description:
      "Next.js frontends over Python backends: Next.js + FastAPI in AccessVision and ClinicalBrief, and Next.js + Supabase in StudentHub.",
  },
  {
    id: "leadership",
    label: "Leadership",
    description:
      "Vice President of the Monash Data & AI Society (MDAS), where he grew AI workshop reach to 300+ students across 5+ events; Social Media Coordinator at MOSAIC, connecting students to community-focused AI volunteer programs.",
  },
];

const ROLE_LABELS: Record<string, string> = { "mdas-vp": "MDAS", "mosaic-coordinator": "MOSAIC" };

// Shared tech: links are computed from each project's techStack (case-insensitive).
const TECH: { id: string; label: string; match: (s: string) => boolean }[] = [
  { id: "python", label: "Python", match: (s) => s === "python" },
  { id: "nextjs", label: "Next.js", match: (s) => s === "next.js" },
  { id: "fastapi", label: "FastAPI", match: (s) => s === "fastapi" },
  { id: "yolo", label: "YOLO", match: (s) => s === "yolo" || s === "yolov8" },
  { id: "supabase", label: "Supabase / Postgres", match: (s) => s === "supabase" || s === "postgresql (supabase)" },
];

const techLinks = TECH.map((t) => ({
  ...t,
  projects: projectsData.filter((p) => p.techStack.some((s) => t.match(s.toLowerCase()))),
})).filter((t) => t.projects.length >= 2); // a "shared" tech must link 2+ projects

const listNames = (names: string[]) =>
  names.length > 1 ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}` : names.join("");

type NodeData = Omit<TopoNode, "pos">;
const ordered: NodeData[] = [
  ...DOMAINS.map((d) => ({ ...d, group: "domain" as const })),
  ...projectsData.map((p) => ({ id: p.id, group: "project" as const, label: p.title, description: p.description, project: p })),
  ...experienceData
    .filter((e) => e.id in ROLE_LABELS)
    .map((e) => ({ id: e.id, group: "role" as const, label: ROLE_LABELS[e.id], description: e.highlight, role: e })),
  ...techLinks.map((t) => ({
    id: t.id,
    group: "tech" as const,
    label: t.label,
    description: `Used in ${listNames(t.projects.map((p) => p.title))}.`,
  })),
];

// Fibonacci sphere in group order, so each group forms its own band (domains on top, tech at the bottom).
// Deterministic: same positions on every render and on the server.
const GOLDEN = Math.PI * (3 - Math.sqrt(5));
export const NODES: TopoNode[] = ordered.map((n, i) => {
  const y = 1 - (2 * i + 1) / ordered.length;
  const r = Math.sqrt(1 - y * y);
  return { ...n, pos: [Math.cos(i * GOLDEN) * r, y, Math.sin(i * GOLDEN) * r] };
});

const HAND_EDGES: [string, string][] = [
  ["accessible-vision", "ai"],
  ["accessible-vision", "computer-vision"],
  ["accessible-vision", "accessibility"],
  ["accessible-vision", "full-stack"],
  ["accessible-vision", "product-development"],
  ["clinicalbrief", "ai"],
  ["clinicalbrief", "healthcare-ai"],
  ["clinicalbrief", "full-stack"],
  ["clinicalbrief", "product-development"],
  ["studenthub", "product-development"],
  ["studenthub", "full-stack"],
  ["traffic-ai", "ai"],
  ["traffic-ai", "computer-vision"],
  ["mdas-vp", "leadership"],
  ["mosaic-coordinator", "leadership"],
  ["ai", "computer-vision"],
  ["ai", "healthcare-ai"],
];

const ids = new Set(NODES.map((n) => n.id));
export const EDGES: [string, string][] = [
  ...HAND_EDGES,
  ...techLinks.flatMap((t) => t.projects.map((p) => [t.id, p.id] as [string, string])),
];

// Integrity check. The graph is static and "/" is prerendered, so a bad id fails `npm run build` (and the dev
// overlay) instead of silently dropping a node or an edge.
if (ids.size !== NODES.length) {
  const dupes = NODES.map((n) => n.id).filter((id, i, all) => all.indexOf(id) !== i);
  throw new Error(`System Map: duplicate node ids: ${[...new Set(dupes)].join(", ")}`);
}
const dangling = EDGES.filter(([a, b]) => !ids.has(a) || !ids.has(b));
if (dangling.length) throw new Error(`System Map: edges reference missing nodes: ${dangling.map((e) => e.join(" -> ")).join(", ")}`);

export const NODE = Object.fromEntries(NODES.map((n) => [n.id, n])) as Record<string, TopoNode>;

export const NEIGHBOURS: Record<string, string[]> = Object.fromEntries(
  NODES.map((n) => [n.id, EDGES.flatMap(([a, b]) => (a === n.id ? [b] : b === n.id ? [a] : []))])
);
