export interface TopologyNodeData {
  id: string;
  label: string;
  group: 'category' | 'project' | 'leadership' | 'decorative';
  val: number; // Relative visual size index
  description: string;
  details?: string[];
  parentId?: string; // Links to parent category/domain node
  status?: string;
  techStack?: string[];
  openUrl?: string;
  githubUrl?: string;
  baseX: number;
  baseY: number;
}

export interface TopologyLinkData {
  source: string;
  target: string;
}

export const initialNodes: TopologyNodeData[] = [
  // 7 Core Domains (Categories) arranged as a hexagon
  {
    id: "dom_ai",
    label: "AI",
    group: "category",
    val: 18,
    description: "Core artificial intelligence methodologies including deep learning, NLP, and model architectures.",
    details: ["Academic Focus: Monash Master of AI", "Core Frameworks: PyTorch, TensorFlow"],
    status: "SYSTEM",
    techStack: ["PyTorch", "TensorFlow", "Transformers", "LLMs"],
    baseX: 0,
    baseY: -150
  },
  {
    id: "dom_cv",
    label: "Computer Vision",
    group: "category",
    val: 18,
    description: "Extracting structured insights, segmenting scenes, and tracking entities from live camera streams.",
    details: ["Core Models: YOLO, OpenCV", "Applications: Spatial mapping, traffic tracking"],
    status: "SYSTEM",
    techStack: ["YOLO", "OpenCV", "PyTorch", "Edge AI"],
    baseX: -160,
    baseY: -60
  },
  {
    id: "dom_healthcare_ai",
    label: "Healthcare AI",
    group: "category",
    val: 18,
    description: "Secure medical dictation transcriptions and formatted clinical document summaries.",
    details: ["Focus: HIPAA-aligned data pipelines", "Services: Speaker diarization, LLM extraction"],
    status: "SYSTEM",
    techStack: ["FastAPI", "Whisper", "LLMs", "Metadata Sanitization"],
    baseX: 160,
    baseY: -60
  },
  {
    id: "dom_accessibility",
    label: "Accessibility",
    group: "category",
    val: 18,
    description: "Designing models and interfaces optimized for visually impaired users.",
    details: ["Specialization: Low-latency audio cues", "Grounded reasoning models"],
    status: "SYSTEM",
    techStack: ["Low-latency Audio", "Grounded Reasoning", "Tactile UI"],
    baseX: -160,
    baseY: 60
  },
  {
    id: "dom_product_dev",
    label: "Product Development",
    group: "category",
    val: 18,
    description: "Translating community, student, and user problems into production-grade applications.",
    details: ["Aspirations: Founding AI Engineer, Startups", "Design: Mobile-first student directories"],
    status: "SYSTEM",
    techStack: ["Next.js", "TypeScript", "Vercel", "Product Design"],
    baseX: 160,
    baseY: 60
  },
  {
    id: "dom_leadership",
    label: "Leadership",
    group: "category",
    val: 18,
    description: "Managing media branding, event strategies, and student developer communities.",
    details: ["Directorships: MDAS, MOSAIC", "Reach: Event campaigns with 300+ students"],
    status: "SYSTEM",
    techStack: ["Media Operations", "Event Strategy", "Community Building"],
    baseX: -80,
    baseY: 150
  },
  {
    id: "dom_fullstack_eng",
    label: "Full Stack Engineering",
    group: "category",
    val: 18,
    description: "Integrating type-safe web frontends with robust databases and asynchronous API backends.",
    details: ["Languages: TypeScript, Python, SQL", "Frameworks: Next.js, FastAPI"],
    status: "SYSTEM",
    techStack: ["TypeScript", "Python", "SQL", "Next.js", "FastAPI"],
    baseX: 80,
    baseY: 150
  },

  // 5 Key Projects / Entities around parent domains
  {
    id: "proj_accessible_vision",
    label: "Accessible Vision",
    group: "project",
    val: 12,
    description: "AI-powered accessibility platform helping visually impaired users navigate pathways via computer vision.",
    details: ["Stack: Python, YOLO, OpenCV, PyTorch", "Latency: Sub-100ms scene inference"],
    parentId: "dom_accessibility",
    status: "ACTIVE",
    techStack: ["Python", "YOLO", "OpenCV", "PyTorch"],
    githubUrl: "https://github.com/krishi-chheda/accessible-vision",
    openUrl: "https://github.com/krishi-chheda/accessible-vision",
    baseX: -260,
    baseY: 20
  },
  {
    id: "proj_clinicalbrief",
    label: "ClinicalBrief",
    group: "project",
    val: 12,
    description: "Secure clinical intelligence platform transcribing patient consultations and extracting healthcare briefs.",
    details: ["Stack: Next.js, FastAPI, Python, LLMs", "Features: Speaker diarization, client-side metadata sanitization"],
    parentId: "dom_healthcare_ai",
    status: "ACTIVE",
    techStack: ["Next.js", "FastAPI", "Python", "LLMs"],
    githubUrl: "https://github.com/krishi-chheda/ClinicalBrief",
    openUrl: "https://github.com/krishi-chheda/ClinicalBrief",
    baseX: 260,
    baseY: -100
  },
  {
    id: "proj_studenthub",
    label: "StudentHub",
    group: "project",
    val: 12,
    description: "Melbourne student resource portal consolidating housing checklist and public transit guides.",
    details: ["Stack: Next.js, TypeScript, REST APIs", "Database: Real-time sync listener updates"],
    parentId: "dom_product_dev",
    status: "ACTIVE",
    techStack: ["Next.js", "TypeScript", "REST APIs", "Tailwind CSS"],
    githubUrl: "https://github.com/krishi-chheda/studenthub-melbourne",
    openUrl: "https://github.com/krishi-chheda/studenthub-melbourne",
    baseX: 260,
    baseY: 20
  },
  {
    id: "proj_traffic_ai",
    label: "Traffic AI",
    group: "project",
    val: 12,
    description: "Edge computer vision intersection prioritization queue tracking lane vehicle density.",
    details: ["Stack: YOLO, OpenCV, Python, Jetson Nano", "Result: Waiting times reduced by 42%"],
    parentId: "dom_cv",
    status: "ACTIVE",
    techStack: ["YOLO", "OpenCV", "Python", "Jetson Nano"],
    githubUrl: "https://github.com/krishi-chheda/ai-traffic-system",
    openUrl: "https://github.com/krishi-chheda/ai-traffic-system",
    baseX: -260,
    baseY: -100
  },
  {
    id: "lead_mdas",
    label: "MDAS",
    group: "leadership",
    val: 12,
    description: "Largest data analytics society at Monash, managing branding and outreach event strategy campaigns.",
    details: ["Role: Media & Marketing Director", "Outcome: Grew technical workshop reach to 300+ students"],
    parentId: "dom_leadership",
    status: "ACTIVE",
    techStack: ["Media Operations", "Event Strategy", "Public Speaking"],
    githubUrl: "https://github.com/krishi-chheda",
    openUrl: "https://linkedin.com/in/krishi-chheda",
    baseX: -160,
    baseY: 210
  },

  // Decorative Anchor Nodes (Tiny size, placed outer bounds)
  {
    id: "dec_status",
    label: "SYS_STATUS // NOMINAL",
    group: "decorative",
    val: 6,
    description: "Host operating system visual diagnostic check.",
    status: "ONLINE",
    baseX: 0,
    baseY: -210
  },
  {
    id: "dec_latency",
    label: "LATENCY // SUB-100MS",
    group: "decorative",
    val: 6,
    description: "Performance latency budget constraints tracker.",
    status: "ONLINE",
    baseX: -260,
    baseY: -160
  },
  {
    id: "dec_env",
    label: "SEC_ENV // HIPAA",
    group: "decorative",
    val: 6,
    description: "Healthcare privacy compliance architecture pipeline.",
    status: "ONLINE",
    baseX: 260,
    baseY: -160
  },
  {
    id: "dec_fse_port",
    label: "PORT // 8080",
    group: "decorative",
    val: 6,
    description: "Production web backend endpoint host port.",
    status: "ONLINE",
    baseX: 140,
    baseY: 210
  },
  {
    id: "dec_lead_students",
    label: "REACH // 300+",
    group: "decorative",
    val: 6,
    description: "Monash Data & AI Society student community reach.",
    status: "ONLINE",
    baseX: -80,
    baseY: 210
  }
];

export const initialLinks: TopologyLinkData[] = [
  // Links connecting domains (categories) to establish the core domain network
  { source: "dom_ai", target: "dom_cv" },
  { source: "dom_ai", target: "dom_healthcare_ai" },
  { source: "dom_ai", target: "dom_accessibility" },
  { source: "dom_ai", target: "dom_fullstack_eng" },
  { source: "dom_ai", target: "dom_product_dev" },
  { source: "dom_fullstack_eng", target: "dom_product_dev" },
  { source: "dom_product_dev", target: "dom_leadership" },

  // Links connecting projects/entities to their corresponding primary domains
  { source: "proj_accessible_vision", target: "dom_accessibility" },
  { source: "proj_accessible_vision", target: "dom_cv" },
  { source: "proj_accessible_vision", target: "dom_ai" },

  { source: "proj_clinicalbrief", target: "dom_healthcare_ai" },
  { source: "proj_clinicalbrief", target: "dom_fullstack_eng" },
  { source: "proj_clinicalbrief", target: "dom_ai" },

  { source: "proj_studenthub", target: "dom_product_dev" },
  { source: "proj_studenthub", target: "dom_fullstack_eng" },

  { source: "proj_traffic_ai", target: "dom_cv" },
  { source: "proj_traffic_ai", target: "dom_ai" },

  { source: "lead_mdas", target: "dom_leadership" },
  { source: "lead_mdas", target: "dom_product_dev" }
];
