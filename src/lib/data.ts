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
  overview: {
    problem: string;
    solution: string;
    status: string;
  };
  architecture: {
    flow: { label: string; description: string }[];
    decisions: string[];
  };
  impact: {
    achievements: string[];
    lessons: string[];
  };
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

export interface ProcessProject {
  name: string;
  description: string;
  stack: string;
  githubUrl?: string;
}

export interface LeadershipInfo {
  role: string;
  org: string;
}

export interface CurrentProcess {
  running: ProcessProject[];
  learning: string[];
  leadership: LeadershipInfo;
  targetRoles: string[];
  availability: string;
  graduation: string;
  location: string;
  uptime: string;
}

export const currentProcesses: CurrentProcess = {
  running: [
    {
      name: "Accessible Vision",
      description: "AI-powered accessibility platform helping visually impaired users navigate environments safely.",
      stack: "Python • YOLO • Computer Vision",
      githubUrl: "https://github.com/krishi-chheda/accessible-vision"
    },
    {
      name: "ClinicalBrief",
      description: "Secure clinical intelligence platform that transcribes clinician consultations and extracts structured insights.",
      stack: "Next.js • FastAPI • Python • LLM Applications",
      githubUrl: "https://github.com/krishi-chheda/ClinicalBrief"
    },
    {
      name: "StudentHub",
      description: "Community resource hub consolidating public transit guides, housing lists, and local student events.",
      stack: "Next.js • TypeScript • REST APIs • Product Design",
      githubUrl: "https://github.com/krishi-chheda/studenthub-melbourne"
    }
  ],
  learning: ["Agentic AI", "RAG Systems", "Product Development", "Production AI"],
  leadership: {
    role: "Media & Marketing Director",
    org: "Monash Data & AI Society"
  },
  targetRoles: ["AI Engineer", "Machine Learning Engineer", "Software Engineer", "Technology Consultant"],
  availability: "AVAILABLE FOR OPPORTUNITIES",
  graduation: "July 2027",
  location: "Melbourne, Australia",
  uptime: "Building Since 2024"
};

export const projectsData: Project[] = [
  {
    id: "accessible-vision",
    title: "Accessible Vision",
    subtitle: "AI Accessibility Platform",
    role: "AI & Computer Vision Developer",
    description: "AI-powered accessibility platform helping visually impaired users understand and navigate environments through computer vision and audio guidance.",
    story: "Problem: Visually impaired users face navigation hazards in unfamiliar environments due to a lack of immediate, screen-free hazard detection.\n\nSolution: Built an AI-powered accessibility platform utilizing computer vision and YOLO models to map pathways and obstacles in real-time, coupled with immediate spoken guidance.\n\nTechnologies: Python, PyTorch, YOLO, OpenCV, Real-Time AI.\n\nCurrent Status: Active development (optimizing spatial hazard orientation models).\n\nVerified Outcomes: Achieved sub-100ms inference latency on scene parsing with low-latency spoken feedback APIs.",
    techStack: ["Python", "YOLO", "OpenCV", "PyTorch"],
    metrics: [
      "Sub-100ms inference latency",
      "Real-time spoken hazard feedback",
      "End-to-end computer vision pipeline"
    ],
    githubUrl: "https://github.com/krishi-chheda/accessible-vision",
    terminalLog: [
      "CORE > Starting scene analyzer inference engine...",
      "AI   > Detected: Crosswalk (Confidence: 94.1%), Light Pole (Confidence: 89.4%)",
      "AUDIO> Spoken cue: 'Crosswalk ahead, clear pathway in 3 meters'"
    ],
    overview: {
      problem: "Visually impaired users face navigation challenges in unfamiliar environments.",
      solution: "Built an AI-powered accessibility platform using computer vision and spoken guidance.",
      status: "Active Development"
    },
    architecture: {
      flow: [
        { label: "Camera", description: "Captures real-time environment stream" },
        { label: "YOLO", description: "Processes frames to identify surrounding objects" },
        { label: "Obstacle Detection", description: "Filters and classifies hazards in the path" },
        { label: "Path Mapping", description: "Computes spatial orientation and distance" },
        { label: "Voice Guidance", description: "Generates real-time audio cues for user navigation" }
      ],
      decisions: [
        "Chose YOLO for its real-time performance and high detection accuracy in diverse outdoor conditions.",
        "Implemented lightweight custom threading in Python to handle simultaneous camera capture, model inference, and audio playback without frame dropping."
      ]
    },
    impact: {
      achievements: [
        "Achieved sub-100ms inference latency for real-time responsiveness.",
        "Delivered immediate spoken hazard feedback to enhance user safety.",
        "Designed an end-to-end computer vision pipeline running seamlessly."
      ],
      lessons: [
        "Optimizing real-time computer vision models on resource-constrained threads.",
        "Deploying Edge AI models under latency budgets.",
        "Designing tactile and audio product tradeoffs for accessibility."
      ]
    }
  },
  {
    id: "clinicalbrief",
    title: "ClinicalBrief",
    subtitle: "Healthcare AI Platform",
    role: "Full-Stack AI Developer",
    description: "Healthcare AI platform that transforms medical information into structured and actionable insights.",
    story: "Problem: Healthcare providers lose valuable hours compiling, transcribing, and formatting patient consultation audio into structured records.\n\nSolution: Engineered a secure clinical intelligence platform that transcribes and parses multi-speaker dictations into action-ready summaries.\n\nTechnologies: Next.js, FastAPI, Python, LLM APIs (GPT-4o), Whisper API.\n\nCurrent Status: Active development (expanding audio diarization accuracy).\n\nVerified Outcomes: Optimizes record-keeping workflows using semantic search indexes and patient record metadata sanitization.",
    techStack: ["Next.js", "FastAPI", "Python", "LLMs"],
    metrics: [
      "Faster information extraction",
      "Structured healthcare insights",
      "AI-assisted workflows"
    ],
    githubUrl: "https://github.com/krishi-chheda/ClinicalBrief",
    terminalLog: [
      "API  > POST /api/v1/summarize 200 OK",
      "AI   > Extracting clinical concepts and structured medical data...",
      "OUT  > Generated structured patient brief and decision outline"
    ],
    overview: {
      problem: "Healthcare providers lose valuable hours compiling, transcribing, and formatting patient consultation audio into structured records.",
      solution: "Healthcare AI platform for structuring medical information.",
      status: "Active Development"
    },
    architecture: {
      flow: [
        { label: "Input Data", description: "Captures clinician consultation audio or text documents" },
        { label: "AI Processing", description: "Performs speech-to-text and multi-speaker diarization" },
        { label: "Clinical Structuring", description: "Sanitizes sensitive data and extracts medical concepts" },
        { label: "Brief Generation", description: "Produces structured patient briefs and summaries" }
      ],
      decisions: [
        "Separated AI processing into an asynchronous worker queue in FastAPI to handle long-running transcription tasks without blocking the web client.",
        "Implemented strict client-side and server-side metadata sanitization before sending payloads to LLM APIs to ensure privacy."
      ]
    },
    impact: {
      achievements: [
        "Accelerated clinical information extraction for healthcare professionals.",
        "Generated highly structured, action-ready healthcare insights.",
        "Created seamless AI-assisted workflows integrated with patient record views."
      ],
      lessons: [
        "Handling sensitive patient health information and HIPAA-aligned data patterns.",
        "Implementing semantic search indexes to optimize clinical query latencies.",
        "LLM context window management and reliable clinical information extraction."
      ]
    }
  },
  {
    id: "studenthub",
    title: "StudentHub",
    subtitle: "Student Platform",
    role: "Lead Product Developer",
    description: "Student platform helping Melbourne students discover housing, events, opportunities, and resources.",
    story: "Problem: Incoming international students in Melbourne struggle to discover reliable housing lists, transit guides, and social connections across fragmented websites.\n\nSolution: Built a community-focused resource hub consolidating verified housing checklists, transit routes, and local student events.\n\nTechnologies: Next.js, TypeScript, REST APIs, Tailwind CSS, Mapbox.\n\nCurrent Status: Expanding features (integrating local Melbourne student network API connections).\n\nVerified Outcomes: Deployed a mobile-optimized platform that centralizes discovery directories for incoming Monash student arrivals.",
    techStack: ["Next.js", "TypeScript", "REST APIs", "Tailwind CSS"],
    metrics: [
      "Centralized student resources",
      "Improved discoverability",
      "Community-focused platform"
    ],
    githubUrl: "https://github.com/krishi-chheda/studenthub-melbourne",
    terminalLog: [
      "SYS  > Connecting to database pools...",
      "DB   > Synced verified student housing checklists and local events",
      "USER > Search query: 'Melbourne transit guides near campus'"
    ],
    overview: {
      problem: "Incoming international students in Melbourne struggle to discover reliable housing lists, transit guides, and social connections across fragmented websites.",
      solution: "Platform helping Melbourne students discover housing, events, and opportunities.",
      status: "Completed"
    },
    architecture: {
      flow: [
        { label: "Student", description: "Accesses the responsive platform via browser" },
        { label: "Search System", description: "Handles queries across housing, transit, and events" },
        { label: "Events / Housing / Resources", description: "Queries consolidated databases and external services" },
        { label: "Personalized Discovery", description: "Renders geo-located resources and maps" }
      ],
      decisions: [
        "Chose Next.js for its Server Components to optimize initial page loads for resource search directories.",
        "Integrated Mapbox to provide visual, distance-based housing and transit stop recommendations."
      ]
    },
    impact: {
      achievements: [
        "Centralized essential student resources in a single interface.",
        "Significantly improved the discoverability of local housing and activities.",
        "Created a community-focused hub tailored for incoming student cohorts."
      ],
      lessons: [
        "Aggregating, normalizing, and caching of fragmented public API sources.",
        "Building client-side interactive search directories using React hooks.",
        "Designing responsive layouts optimized for mobile-first student usage patterns."
      ]
    }
  },
  {
    id: "traffic-ai",
    title: "Traffic AI",
    subtitle: "Intelligent Traffic Management System",
    role: "AI Research Lead",
    description: "Intelligent traffic management system using computer vision to optimize traffic flow.",
    story: "Problem: Fixed-interval traffic signals cause severe traffic congestion and unnecessary engine idling by failing to adapt to real-time lane density.\n\nSolution: Developed an intelligent edge intersection queue optimization system tracking lane congestion via live computer vision processing.\n\nTechnologies: YOLO, OpenCV, Python, NVIDIA Jetson Nano.\n\nCurrent Status: Simulation validated; hardware logic tested on NVIDIA Jetson edge nodes.\n\nVerified Outcomes: Reduced average intersection queue waiting time by 42% in simulated test loops.",
    techStack: ["YOLO", "OpenCV", "Python", "Jetson Nano"],
    metrics: [
      "42% reduction in waiting time",
      "Real-time traffic analysis",
      "Edge deployment on Jetson Nano"
    ],
    githubUrl: "https://github.com/krishi-chheda/ai-traffic-system",
    terminalLog: [
      "EDGE > Initializing Jetson Nano processing pipeline...",
      "CV   > OpenCV matrix frame captured at 30 FPS",
      "AI   > YOLO tracked 12 vehicles on Lane A, 4 on Lane B",
      "SYS  > Switched intersection state: Lane A Green extended (Wait reduced 42%)"
    ],
    overview: {
      problem: "Fixed-interval traffic signals cause severe traffic congestion and unnecessary engine idling.",
      solution: "Computer vision traffic optimization system.",
      status: "Completed"
    },
    architecture: {
      flow: [
        { label: "Camera Feed", description: "Streams real-time intersection traffic video" },
        { label: "Vehicle Detection", description: "Uses YOLO to identify and track vehicle coordinates" },
        { label: "Density Analysis", description: "Calculates vehicle counts and queue lengths per lane" },
        { label: "Signal Optimization", description: "Adapts signal durations dynamically based on traffic load" }
      ],
      decisions: [
        "Deployed models to an NVIDIA Jetson Nano edge node to ensure processing occurs directly at the intersection.",
        "Utilized OpenCV for efficient image preprocessing and region-of-interest masking to focus YOLO attention only on critical traffic lanes."
      ]
    },
    impact: {
      achievements: [
        "Achieved a verified 42% reduction in traffic waiting time in simulation loops.",
        "Provided continuous real-time traffic density analysis.",
        "Successfully optimized models to deploy on edge hardware (Jetson Nano)."
      ],
      lessons: [
        "Optimizing neural network frame rates on memory-constrained edge hardware.",
        "Bridging simulation-to-real gaps in visual vehicle tracking.",
        "Developing fail-safe signal logic when cameras are obscured or models fail."
      ]
    }
  }
];

export const experienceData: Experience[] = [
  {
    id: "mdas-director",
    year: "2026",
    role: "Media & Marketing Director",
    organization: "Monash Data & AI Society (MDAS)",
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
    roleSummary: "Krishi is an international student based in Melbourne, studying for a Master of Artificial Intelligence at Monash University. He holds the role of Media & Marketing Director at Monash Data & AI Society (MDAS). He is passionate about bridging the gap between machine learning models and highly-usable, production-grade applications.",
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
