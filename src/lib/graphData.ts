export interface GraphNode {
  id: string;
  label: string;
  group: 'root' | 'category' | 'ai' | 'project' | 'leadership' | 'swe' | 'education' | 'future';
  val: number; // Node weight / size
  description: string;
  details?: string[];
  parentId?: string; // Links entities to parent domains
  isDetail?: boolean;
}

export interface GraphLink {
  source: string;
  target: string;
  value?: number;
}

export const initialNodes: GraphNode[] = [
  // 7 Core Domains (Categories)
  {
    id: "dom_ai",
    label: "AI",
    group: "category",
    val: 14,
    description: "Core artificial intelligence methodologies including deep learning, NLP, and model architectures.",
    details: ["Academic Focus: Monash Master of AI", "Core Frameworks: PyTorch, TensorFlow"]
  },
  {
    id: "dom_cv",
    label: "Computer Vision",
    group: "category",
    val: 14,
    description: "Extracting structured insights, segmenting scenes, and tracking entities from live camera streams.",
    details: ["Core Models: YOLO, OpenCV", "Applications: Spatial mapping, traffic tracking"]
  },
  {
    id: "dom_healthcare_ai",
    label: "Healthcare AI",
    group: "category",
    val: 14,
    description: "Secure medical dictation transcriptions and formatted clinical document summaries.",
    details: ["Focus: HIPAA-aligned data pipelines", "Services: Speaker diarization, LLM extraction"]
  },
  {
    id: "dom_product_dev",
    label: "Product Development",
    group: "category",
    val: 14,
    description: "Translating community, student, and user problems into production-grade applications.",
    details: ["Aspirations: Founding AI Engineer, Startups", "Design: Mobile-first student directories"]
  },
  {
    id: "dom_leadership",
    label: "Leadership",
    group: "category",
    val: 14,
    description: "Managing media branding, event strategies, and student developer communities.",
    details: ["Directorships: MDAS, MOSAIC", "Reach: Event campaigns with 300+ students"]
  },
  {
    id: "dom_accessibility",
    label: "Accessibility",
    group: "category",
    val: 14,
    description: "Designing models and interfaces optimized for visually impaired users.",
    details: ["Specialization: Low-latency audio cues", "Grounded reasoning models"]
  },
  {
    id: "dom_fullstack_eng",
    label: "Full Stack Engineering",
    group: "category",
    val: 14,
    description: "Integrating type-safe web frontends with robust databases and asynchronous API backends.",
    details: ["Languages: TypeScript, Python, SQL", "Frameworks: Next.js, FastAPI"]
  },

  // 5 Key Projects / Entities
  {
    id: "proj_accessible_vision",
    label: "Accessible Vision",
    group: "project",
    val: 9,
    description: "AI-powered accessibility platform helping visually impaired users navigate pathways via computer vision.",
    details: ["Stack: Python, YOLO, OpenCV, PyTorch", "Latency: Sub-100ms scene inference"],
    parentId: "dom_accessibility"
  },
  {
    id: "proj_clinicalbrief",
    label: "ClinicalBrief",
    group: "project",
    val: 9,
    description: "Secure clinical intelligence platform transcribing patient consultations and extracting healthcare briefs.",
    details: ["Stack: Next.js, FastAPI, Python, LLMs", "Features: Speaker diarization, client-side metadata sanitization"],
    parentId: "dom_healthcare_ai"
  },
  {
    id: "proj_studenthub",
    label: "StudentHub",
    group: "project",
    val: 9,
    description: "Melbourne student resource portal consolidating housing checklist and public transit guides.",
    details: ["Stack: Next.js, TypeScript, REST APIs", "Database: Real-time sync listener updates"],
    parentId: "dom_product_dev"
  },
  {
    id: "proj_traffic_ai",
    label: "Traffic AI",
    group: "project",
    val: 9,
    description: "Edge computer vision intersection prioritization queue tracking lane vehicle density.",
    details: ["Stack: YOLO, OpenCV, Python, Jetson Nano", "Result: Waiting times reduced by 42%"],
    parentId: "dom_cv"
  },
  {
    id: "lead_mdas",
    label: "MDAS",
    group: "leadership",
    val: 9,
    description: "Largest data analytics society at Monash, managing branding and outreach event strategy campaigns.",
    details: ["Role: Media & Marketing Director", "Outcome: Grew technical workshop reach to 300+ students"],
    parentId: "dom_leadership"
  }
];

export const detailNodes: GraphNode[] = [];

export const initialLinks: GraphLink[] = [
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

export const detailLinks: GraphLink[] = [];
