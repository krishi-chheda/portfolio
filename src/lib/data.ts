export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  story: string;
  role: string;
  techStack: string[];
  metrics: string[];
  githubUrl?: string;
  liveUrl?: string;
  terminalLog: string[];
}

export interface Experience {
  id: string;
  year: string;
  role: string;
  organization: string;
  location: string;
  period: string;
  description: string[];
  skills: string[];
  highlight: string;
}

export interface CurrentProcess {
  running: string[];
  learning: string[];
  role: string;
}

export const currentProcesses: CurrentProcess = {
  running: ["Accessible Vision", "ClinicalBrief", "StudentHub"],
  learning: ["Agentic AI", "Product Design"],
  role: "Media & Marketing Director @ MDAS"
};

export const projectsData: Project[] = [
  {
    id: "accessible-vision",
    title: "Accessible Vision",
    subtitle: "AI Accessibility Platform",
    role: "AI & Computer Vision Developer",
    description: "AI-powered accessibility platform helping visually impaired users understand and navigate environments through computer vision and audio guidance.",
    story: "Accessible Vision was built to help visually impaired individuals interact with their environments independently. By combining real-time computer vision models with natural language audio feedback, the system identifies objects and reads scenes dynamically, helping users avoid obstacles and understand spatial structures.",
    techStack: ["Computer Vision", "YOLO", "Python", "Real-Time AI"],
    metrics: [
      "Performs real-time scene understanding using YOLO object detection models",
      "Provides low-latency spoken guidance through audio feedback APIs",
      "Improves user safety by recognizing critical pathway obstacles"
    ],
    githubUrl: "https://github.com/krishi-chheda/accessible-vision",
    terminalLog: [
      "CORE > Starting scene analyzer inference engine...",
      "AI   > Detected: Crosswalk (Confidence: 94.1%), Light Pole (Confidence: 89.4%)",
      "AUDIO> Spoken cue: 'Crosswalk ahead, clear pathway in 3 meters'"
    ]
  },
  {
    id: "clinicalbrief",
    title: "ClinicalBrief",
    subtitle: "Healthcare AI Platform",
    role: "Full-Stack AI Developer",
    description: "Healthcare AI platform that transforms medical information into structured and actionable insights.",
    story: "Navigating scattered medical files and complex consultations is a challenge. ClinicalBrief provides intelligent summarization and clinical information retrieval, converting raw medical dictation and documents into structured, actionable clinical insights. The system optimizes clinical workflows and supports decision processes safely.",
    techStack: ["Next.js", "FastAPI", "Python", "LLM Applications"],
    metrics: [
      "Converts medical consultation documents into structured clinical briefs",
      "Improves information retrieval using semantic search workflows",
      "Protects patient records with custom metadata sanitization"
    ],
    githubUrl: "https://github.com/krishi-chheda/ClinicalBrief",
    terminalLog: [
      "API  > POST /api/v1/summarize 200 OK",
      "AI   > Extracting clinical concepts and structured medical data...",
      "OUT  > Generated structured patient brief and decision outline"
    ]
  },
  {
    id: "studenthub",
    title: "StudentHub",
    subtitle: "Student Platform",
    role: "Lead Product Developer",
    description: "Student platform helping Melbourne students discover housing, events, opportunities, and resources.",
    story: "Arriving students face a scattered landscape of web pages, transit guides, and social clubs. StudentHub gathers Melbourne housing checklists, transit guides, and student-friendly social club directories into a single destination, reducing search friction and supporting student communities.",
    techStack: ["Next.js", "TypeScript", "APIs", "Product Design"],
    metrics: [
      "Aggregates housing checklists, transit, and social events in Melbourne",
      "Provides interactive maps for discovery of local community resources",
      "Supports dark theme dashboards with unified database queries"
    ],
    githubUrl: "https://github.com/krishi-chheda/studenthub-melbourne",
    terminalLog: [
      "SYS  > Connecting to database pools...",
      "DB   > Synced verified student housing checklists and local events",
      "USER > Search query: 'Melbourne transit guides near campus'"
    ]
  },
  {
    id: "traffic-ai",
    title: "Traffic AI",
    subtitle: "Intelligent Traffic Management System",
    role: "AI Research Lead",
    description: "Intelligent traffic management system using computer vision to optimize traffic flow.",
    story: "Traditional traffic lights operate on fixed timers, leading to congestion. The AI Traffic Light System uses real-time vehicle detection from camera feeds to estimate queue density across lanes, dynamically optimizing green phases to maintain smooth flow.",
    techStack: ["YOLO", "OpenCV", "Python", "Jetson Nano"],
    metrics: [
      "Verified impact: 42% reduction in waiting time.",
      "Achieved low-latency vehicle detection using YOLO on Jetson Nano",
      "Optimized intersection queues dynamically based on lane density"
    ],
    githubUrl: "https://github.com/krishi-chheda/ai-traffic-system",
    terminalLog: [
      "EDGE > Initializing Jetson Nano processing pipeline...",
      "CV   > OpenCV matrix frame captured at 30 FPS",
      "AI   > YOLO tracked 12 vehicles on Lane A, 4 on Lane B",
      "SYS  > Switched intersection state: Lane A Green extended (Wait reduced 42%)"
    ]
  }
];

export const experienceData: Experience[] = [
  {
    id: "mdas-director",
    year: "2026",
    role: "Media & Marketing Director",
    organization: "MDAS",
    location: "Melbourne, VIC, Australia",
    period: "2024 - Present",
    description: [
      "Directing branding and outreach strategies for the largest data student society at Monash.",
      "Grew digital engagement metrics through targeted educational content on AI, web platforms, and data pipelines.",
      "Co-designing marketing and logistical plans for technical workshops, hackathons, and corporate networking nights."
    ],
    skills: ["Community Building", "Event Organization", "Product Marketing"],
    highlight: "Led brand transformation increasing student involvement in tech workshops."
  },
  {
    id: "mysahayak-intern",
    year: "2025",
    role: "Mysahayak IT Intern",
    organization: "Mysahayak",
    location: "Remote / India",
    period: "2025",
    description: [
      "Assisted in full-stack web feature development focusing on StudentHub user dashboard components.",
      "Integrated REST API endpoints and optimized query rendering inside React hooks for the StudentHub platform.",
      "Conducted QA bug tracking and resolved critical interface bugs on StudentHub before deployment."
    ],
    skills: ["Next.js", "TypeScript", "Database Systems", "API Integrations"],
    highlight: "Developed dashboard UI features for the StudentHub platform."
  },
  {
    id: "studenthub-dev",
    year: "2025",
    role: "StudentHub Development",
    organization: "StudentHub",
    location: "Melbourne, VIC, Australia",
    period: "2025",
    description: [
      "Built the core housing discovery portal for Monash & Melbourne university student arrivals.",
      "Engineered APIs and data integrations to fetch rent estimates, local transit stops, and event schedules.",
      "Designed a custom dark mode terminal interface for high accessibility."
    ],
    skills: ["Next.js", "TypeScript", "APIs", "Product Design"],
    highlight: "Delivered unified resource catalog for incoming international students."
  },
  {
    id: "traffic-ai-dev",
    year: "2024",
    role: "Traffic AI Development",
    organization: "Traffic AI",
    location: "Melbourne, VIC, Australia",
    period: "2024",
    description: [
      "Developed edge computer vision models running on NVIDIA Jetson Nano to calculate intersection flow density.",
      "Deployed YOLO models to identify and track multi-lane queue levels.",
      "Achieved a verified 42% reduction in wait times."
    ],
    skills: ["YOLO", "OpenCV", "Python", "Jetson Nano"],
    highlight: "Engineered real-time edge AI feedback loop for dynamic signal switching."
  }
];

// Context database injected into the AI chatbot for answering recruiter/founder questions
export const aiKnowledgeBase = {
  aboutMe: {
    fullName: "Krishi Chheda",
    tagline: "AI Engineer, Builder, and Community Leader",
    roleSummary: "Krishi is an international student based in Melbourne, studying for a Master of Artificial Intelligence at Monash University. He holds the role of Media & Marketing Director at Monash Data Analytics Society (MDAS). He is passionate about bridging the gap between machine learning models and highly-usable, production-grade applications.",
    interests: ["Formula 1", "Fitness & Lifting", "High-Agency Startups", "Applied ML Research", "Agentic AI"]
  },
  careerGoals: "Krishi aims to work in high-growth environments where he can deploy AI models to production. He is looking for opportunities as an AI Engineer, Full-Stack Developer, or Founding Engineer in startups, scale-ups, and AI research labs in Australia or globally.",
  projects: projectsData,
  experience: experienceData,
  faq: [
    {
      q: "Is Krishi open to job offers?",
      a: "Yes! Krishi is looking for full-time or contract roles as an AI Engineer or Full-Stack developer in Melbourne, Sydney, or remote. He is graduating from Monash University's Master of AI course soon."
    },
    {
      q: "Where is Krishi located?",
      a: "He is based in Melbourne, Victoria, Australia."
    },
    {
      q: "What is his role at MDAS?",
      a: "He is the Media & Marketing Director, managing branding, student engagement, and promoting major technical and career events."
    },
    {
      q: "What is ClinicalBrief?",
      a: "ClinicalBrief is a healthcare AI platform. It uses Next.js and FastAPI, processing medical dictation and documents to generate structured summarization and support clinical workflows."
    }
  ]
};

export interface SkillDetail {
  experience: string;
  projects: string[];
}

export interface SkillCategory {
  title: string;
  id: string;
  skills: string[];
}

export const skillsCategories: SkillCategory[] = [
  {
    title: "ai_and_ml",
    id: "ai_and_ml",
    skills: ["computer_vision", "yolo", "opencv", "python", "ai_inference", "real_time_systems", "llm_applications"]
  },
  {
    title: "software_engineering",
    id: "software_engineering",
    skills: ["nextjs", "typescript", "database_systems", "api_integrations", "vercel", "jetson_nano", "git"]
  },
  {
    title: "leadership",
    id: "leadership",
    skills: ["mdas", "media_marketing", "event_management", "public_speaking", "community_building"]
  }
];

export const skillsDetails: Record<string, SkillDetail> = {
  computer_vision: { experience: "2 years", projects: ["Traffic AI", "Accessible Vision"] },
  yolo: { experience: "1.5 years", projects: ["Traffic AI", "Accessible Vision"] },
  opencv: { experience: "2 years", projects: ["Traffic AI"] },
  python: { experience: "3 years", projects: ["ClinicalBrief", "Traffic AI", "Accessible Vision"] },
  ai_inference: { experience: "1.5 years", projects: ["Accessible Vision"] },
  real_time_systems: { experience: "1.5 years", projects: ["Accessible Vision", "Traffic AI"] },
  llm_applications: { experience: "1.5 years", projects: ["ClinicalBrief"] },
  nextjs: { experience: "2 years", projects: ["ClinicalBrief", "StudentHub"] },
  typescript: { experience: "2 years", projects: ["StudentHub"] },
  database_systems: { experience: "2 years", projects: ["StudentHub"] },
  api_integrations: { experience: "2 years", projects: ["ClinicalBrief", "StudentHub"] },
  vercel: { experience: "2 years", projects: ["StudentHub"] },
  jetson_nano: { experience: "1 year", projects: ["Traffic AI"] },
  git: { experience: "3 years", projects: ["ClinicalBrief", "StudentHub", "Traffic AI", "Accessible Vision"] },
  mdas: { experience: "1 year", projects: ["MDAS Branding Campaign", "MDAS Event Strategy"] },
  media_marketing: { experience: "1.5 years", projects: ["MDAS Marketing Campaigns", "MDAS Branding Design"] },
  event_management: { experience: "1.5 years", projects: ["MDAS Industry Networking Night", "MDAS Winter Hackathon"] },
  public_speaking: { experience: "2 years", projects: ["MDAS Tech Workshops", "Monash Seminar Panels"] },
  community_building: { experience: "2 years", projects: ["MDAS Slack Engagement", "Melbourne Student Communities"] }
};

export const bootLinesData = [
  "master_of_ai.monash",
  "mdas.marketing_director",
  "studenthub.platform",
  "traffic_ai.yolo",
  "accessible_vision.yolo",
  "clinicalbrief.platform",
  "leadership.framework"
];
