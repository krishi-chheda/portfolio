export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  keyOutcome: string;
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
      githubUrl: "https://github.com/krishi-chheda/AccessVision"
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
      githubUrl: "https://github.com/krishi-chheda/student-hub"
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
    title: "AccessVision",
    subtitle: "AI Accessibility Platform",
    role: "AI & Computer Vision Developer",
    description: "AI-powered accessibility assistant using grounded multimodal reasoning (YOLOv8 + BLIP) to convert visual feeds into spoken narration.",
    keyOutcome: "Mitigated hallucinations via crop intent routing and achieved 2.4s p95 latency under 50-user Locust load tests.",
    story: "Problem: Visually impaired users face navigation hazards in unfamiliar environments, but standard vision-language models suffer from high latency and background noise hallucinations.\n\nSolution: Engineered a secure Next.js PWA and FastAPI backend. It routes user questions to YOLOv8 boundary boxes to crop target regions, feeding them into BLIP VQA context to prevent hallucinations. Speeds up mobile loads by resizing and compressing canvas uploads by 90% (from 4MB to ~150KB).\n\nTechnologies: Python, Next.js, FastAPI, YOLOv8, BLIP, OpenCV, WebRTC, Web Speech API.\n\nCurrent Status: Active Refinement (optimizing model quantization & edge pipeline latency).\n\nVerified Outcomes: Reduced network payload sizes by 90% and achieved a stable 2.4s p95 query response under 50-user Locust load tests.",
    techStack: ["Python", "Next.js", "FastAPI", "YOLOv8", "BLIP", "OpenCV"],
    metrics: [
      "2.4s p95 response time",
      "90% client-side compression",
      "Locust concurrent load tested"
    ],
    githubUrl: "https://github.com/krishi-chheda/AccessVision",
    terminalLog: [
      "CORE > Initializing grounded VQA intent router...",
      "AI   > YOLO segment: detected backpack on path (crop size 120x150)",
      "VQA  > BLIP context restricted to bounding box region",
      "OUT  > Response: 'Caution: Tripping risk backpack is on the floor.'"
    ],
    overview: {
      problem: "Visually impaired users face navigation hazards, and standard VLMs suffer from high latency and context hallucinations.",
      solution: "Built a grounded visual query router restricting BLIP VQA context to YOLOv8 bounding boxes with canvas compression.",
      status: "Active Refinement"
    },
    architecture: {
      flow: [
        { label: "PWA Canvas", description: "Captures environment frame and applies client-side JPEG compression" },
        { label: "Async Router", description: "FastAPI receives payload (~150KB) and delegates processing to worker thread pool" },
        { label: "YOLOv8 Bbox", description: "Isolates coordinates of target obstacles and crops image region" },
        { label: "BLIP VQA", description: "Performs visual question answering restricted to cropped region coordinates" },
        { label: "Web Speech", description: "Plays spoken guidance queue on browser client" }
      ],
      decisions: [
        "Used client-side HTML5 canvas compression to reduce payloads from 4MB to ~150KB, ensuring fast uploads on cellular subnets.",
        "Implemented request-scoped context middleware to inject correlation IDs, tracing queue latency and memory usage."
      ]
    },
    impact: {
      achievements: [
        "Reduced VQA hallucinations by restricting BLIP attention to isolated YOLOv8 boxes.",
        "Achieved a 73% latency reduction under concurrent load tests using FastAPI async thread pools.",
        "Validated system stability with 50-user Locust testing showing zero timeouts."
      ],
      lessons: [
        "Managing Edge AI latency constraints under mobile networking environments.",
        "Designing high-contrast, screen-free interaction models for accessibility."
      ]
    }
  },
  {
    id: "clinicalbrief",
    title: "ClinicalBrief",
    subtitle: "Healthcare AI Platform",
    role: "Full-Stack AI Developer",
    description: "Secure clinical intelligence platform that transcribes clinician consultations and extracts structured EHR insights.",
    keyOutcome: "Sanitizes sensitive metadata and structures consultation transcripts into action-ready patient briefs.",
    story: "Problem: Clinicians lose hours transcribing and formatting consultation audio into structured records manually.\n\nSolution: Developed a secure clinical intelligence platform consisting of a Next.js client, SQLite database, and FastAPI server. It transcribes clinician dictations using Whisper API, handles multi-speaker diarization, sanitizes PHI metadata, and queries GPT-4o to extract patient logs, diagnostics, and prescriptions.\n\nTechnologies: Next.js, FastAPI, Python, SQLite, Whisper API, GPT-4o.\n\nCurrent Status: Active Development (Sprint 4: expanding audio diarization overlap checks).\n\nVerified Outcomes: Normalizes patient data structures and sanitizes PHI locally before third-party LLM API dispatches.",
    techStack: ["Next.js", "FastAPI", "Python", "SQLite", "GPT-4o", "Whisper"],
    metrics: [
      "Whisper audio diarization",
      "PHI metadata sanitization",
      "Automated summary generation"
    ],
    githubUrl: "https://github.com/krishi-chheda/ClinicalBrief",
    terminalLog: [
      "DB   > Synced tables: users, patients, documents",
      "API  > POST /api/v1/documents/ingest - audio stream upload active",
      "AI   > Speaker diarization: Doctor (0:00-1:15), Patient (1:16-2:30)",
      "OUT  > Generated clinical discharge summary (STEMI diagnosis)"
    ],
    overview: {
      problem: "Healthcare providers lose hours transcribing and formatting consultations into structured patient records.",
      solution: "Secure clinical intelligence system transcribing dictation and parsing transcripts into EHR-ready layouts.",
      status: "Active Development"
    },
    architecture: {
      flow: [
        { label: "Audio Record", description: "Clinician records patient consult on Next.js client" },
        { label: "FastAPI Ingest", description: "Streams audio file to upload directory and indexes metadata in SQLite" },
        { label: "Whisper diarize", description: "Segments speech and assigns tags for overlapping voices" },
        { label: "LLM Sanitizer", description: "Masks patient identifying details before GPT-4o ingestion" },
        { label: "EHR Output", description: "Renders structured clinical summaries and prescription lists" }
      ],
      decisions: [
        "Designed database models for User (admin/clinician roles), Patient, and Document using SQLAlchemy ORM and SQLite.",
        "Delegated heavy transcription jobs to FastAPI's background tasks queue to prevent client request timeouts."
      ]
    },
    impact: {
      achievements: [
        "Accelerated records creation by transcribing and formatting consultation audio automatically.",
        "Hardened clinical privacy using client-side and server-side metadata filters.",
        "Created an installable, mobile-responsive layout for bedside clinical logging."
      ],
      lessons: [
        "Managing context lengths and prompt reliability in clinical concept extraction.",
        "Working with SQLAlchemy schema migrations in HIPAA-aligned development cycles."
      ]
    }
  },
  {
    id: "studenthub",
    title: "StudentHub",
    subtitle: "Student Platform",
    role: "Lead Product Developer",
    description: "Melbourne-focused community portal consolidating transit guides, housing lists, and student events.",
    keyOutcome: "Centralized student resource search directories with sub-second synchronization via Prisma.",
    story: "Problem: International students arriving in Melbourne find it difficult to navigate housing listings and public transit routes across fragmented channels.\n\nSolution: Created a centralized hub using Next.js, Prisma, and Tailwind CSS. It queries consolidated MySQL/Firebase databases and leverages Mapbox API to display interactive location-based recommendations and checklists.\n\nTechnologies: Next.js, TypeScript, Prisma, Mapbox API, Tailwind CSS.\n\nCurrent Status: Completed (available for incoming Monash student arrival networks).\n\nVerified Outcomes: Centralized essential discovery directories with responsive design and sub-second housing search directory synchronization.",
    techStack: ["Next.js", "TypeScript", "Prisma", "MySQL", "Mapbox", "Tailwind CSS"],
    metrics: [
      "Sub-second sync latency",
      "Interactive Mapbox routes",
      "Prisma DB schema mapping"
    ],
    githubUrl: "https://github.com/krishi-chheda/student-hub",
    terminalLog: [
      "DB   > Connection established to MySQL database cluster via Prisma",
      "API  > GET /api/housing?near=monash - synced 24 listings",
      "MAP  > Mapbox loaded viewport coordinates for Clayton campus"
    ],
    overview: {
      problem: "Incoming students struggle to discover verified housing checklists, transit routes, and student events in Melbourne.",
      solution: "Consolidated StudentHub platform with database sync and responsive geo-location maps.",
      status: "Completed"
    },
    architecture: {
      flow: [
        { label: "Browser Client", description: "Accesses Next.js server-rendered directory pages" },
        { label: "Search Endpoint", description: "Accepts filters (e.g. rent range, campus distance)" },
        { label: "Prisma Client", description: "Queries MySQL/Firebase databases using indexing for fast retrieval" },
        { label: "Mapbox Render", description: "Visualizes geo-coordinates and transit stops in real time" }
      ],
      decisions: [
        "Chose Next.js Server Components to improve search engine indexability and initial render times.",
        "Utilized Prisma schema relations to perform clean joins between housing providers and student reviews."
      ]
    },
    impact: {
      achievements: [
        "Successfully consolidated housing, transit, and event lists in a single UI.",
        "Achieved sub-second query speeds for search filters.",
        "Built custom checklists for students arriving at Monash University."
      ],
      lessons: [
        "Integrating Mapbox camera bounding boxes with search result filters.",
        "Aggregating and normalizing diverse public transit and event APIs."
      ]
    }
  },
  {
    id: "traffic-ai",
    title: "Traffic AI",
    subtitle: "Intelligent Traffic Management System",
    role: "AI Research Lead",
    description: "Intelligent traffic scheduling optimizer using real-time lane vehicle queue tracking to adapt traffic signals.",
    keyOutcome: "Reduced average intersection queue waiting times by 42% in simulated test environments.",
    story: "Problem: Standard static traffic timers trigger severe congestion by failing to adapt to dynamic lane queue density.\n\nSolution: Built a density-based queue optimization pipeline. It runs YOLO models on live video streams to track vehicle coordinates, computes lane density, and adapts traffic light timings on Jetson Nano edge nodes.\n\nTechnologies: Python, YOLO, OpenCV, Jetson Nano.\n\nCurrent Status: Simulation validated; hardware logic tested on NVIDIA Jetson edge nodes.\n\nVerified Outcomes: Validated a 42% congestion drop in simulation loops and deployed scheduling logic to NVIDIA Jetson hardware.",
    techStack: ["Python", "YOLO", "OpenCV", "Jetson Nano"],
    metrics: [
      "42% queue time reduction",
      "30 FPS edge processing",
      "Dynamic lane adaptation"
    ],
    githubUrl: "https://github.com/krishi-chheda/ai-traffic-system",
    terminalLog: [
      "EDGE > Ingesting lane camera feed (1080p @ 30 FPS)...",
      "AI   > YOLO detection: 14 vehicles on Lane A, 2 on Lane B",
      "CV   > Bounding box tracking across region of interest",
      "SYS  > Timer override: Lane A Green extended by 18 seconds (reduced wait 42%)"
    ],
    overview: {
      problem: "Fixed traffic signal cycles cause massive vehicle idling and congestion due to ignoring dynamic lane queues.",
      solution: "Computer vision pipeline detecting vehicles on edge cameras to adjust green-light timing dynamically.",
      status: "Completed"
    },
    architecture: {
      flow: [
        { label: "IP Camera", description: "Streams live intersection lane video feeds" },
        { label: "YOLO Detector", description: "Runs on Jetson Nano to calculate bounding boxes of cars/trucks" },
        { label: "OpenCV Masking", description: "Filters out surroundings to isolate critical lane bounding boxes" },
        { label: "Signal Control", description: "Executes adaptive timing scheduler overrides based on queue lengths" }
      ],
      decisions: [
        "Masked camera regions with OpenCV to focus YOLO on critical queue lanes, saving 35% processing overhead.",
        "Deployed code on Jetson Nano edge node to guarantee local processing and fail-safe traffic overrides."
      ]
    },
    impact: {
      achievements: [
        "Cut queue delay times by 42% in simulated intersection grids.",
        "Achieved real-time frame rates on Jetson Nano hardware.",
        "Integrated safety fail-safes that return to standard static cycles in case of camera blockages."
      ],
      lessons: [
        "Quantizing neural models to run on memory-constrained edge processors.",
        "Calibrating visual depth measurements from raw 2D camera grids."
      ]
    }
  }
];

export interface AdditionalProject {
  id: string;
  title: string;
  subtitle: string;
  role: string;
  description: string;
  keyOutcome: string;
  techStack: string[];
  githubUrl: string;
  story: string;
}

export const additionalProjectsData: AdditionalProject[] = [
  {
    id: "auralens-ai",
    title: "AuraLens AI",
    subtitle: "Local Photography Assistant",
    role: "AI & Computer Vision Developer",
    description: "Photography workflow tool that culls blurry images automatically (OpenCV Laplacian variance) and enables semantic vector search (CLIP + ChromaDB) running 100% locally.",
    keyOutcome: "Eliminated manual image tagging and culled blurry files with local CLIP Vibe Search.",
    techStack: ["Python", "Streamlit", "OpenCV", "ChromaDB", "Hugging Face CLIP"],
    githubUrl: "https://github.com/krishi-chheda/AuraLens-AI",
    story: "Built a Streamlit desktop application that analyzes imported photography folders. It culled blurry pictures by calculating OpenCV Laplacian variance. It built a local vector database (ChromaDB) of OpenAI CLIP image embeddings, allowing users to query their photos semantically (e.g. 'find a happy dog on a rainy night') without any cloud dependencies."
  },
  {
    id: "f1-telemetry",
    title: "F1 Telemetry AI Suite",
    subtitle: "AI-powered Telemetry Visualizer",
    role: "Full-Stack AI Developer",
    description: "AI platform visualising Formula 1 telemetry data, driver inputs, lap records, and track sector breakdowns.",
    keyOutcome: "Visualizes driver logs and throttle/braking performance profiles.",
    techStack: ["TypeScript", "Next.js", "React", "Streamlit", "Python", "Pandas", "Recharts"],
    githubUrl: "https://github.com/krishi-chheda/f1-telemetry-ai-dashboard",
    story: "Designed a multi-service telemetry dashboard containing a Next.js web application and a Python Streamlit analyzer. It parses raw F1 session datasets using Pandas, projects telemetry metrics (speed, throttle, brake, gears) onto dynamic 2D track segment coordinate maps, and compares driver performance curves."
  },
  {
    id: "bp-prediction-api",
    title: "Blood Pressure Prediction API",
    subtitle: "Healthcare AI API",
    role: "Backend ML Engineer",
    description: "FastAPI server providing machine learning inference endpoints for blood pressure prediction from facial videos.",
    keyOutcome: "Ingests video streams to calculate PPG facial color fluctuations and estimate blood pressure.",
    techStack: ["Python", "FastAPI", "OpenCV", "Mediapipe", "Scikit-learn"],
    githubUrl: "https://github.com/krishi-chheda/fastapi_backend",
    story: "Developed a Python backend that extracts cardiovascular metrics from video files. It runs Mediapipe face tracking to isolate skin regions of interest, calculates color value fluctuations (photoplethysmography), and trains Scikit-learn regressors (Lasso, Ridge) to predict systolic and diastolic blood pressure."
  },
  {
    id: "video-splitter",
    title: "Video Splitter Pro",
    subtitle: "Media Utility Tool",
    role: "Python Developer",
    description: "Web application enabling content creators to split videos at custom timestamps and extract audio tracks.",
    keyOutcome: "Optimized FFmpeg process operations via clean Streamlit interface.",
    techStack: ["Python", "Streamlit", "FFmpeg"],
    githubUrl: "https://github.com/krishi-chheda/video-splitter",
    story: "Created an open-source Streamlit utility that wraps FFmpeg commands to split large video assets at user-defined timestamps and extract audio tracks without visual quality loss."
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
      "Directed media branding and digital campaign strategies for the largest data student society at Monash.",
      "Grew workshop reach to 300+ students across 5+ events by designing and executing targeted promotions and cross-team outreach campaigns.",
      "Co-designed marketing and logistical plans for technical developer bootcamps, campus hackathons, and corporate networking nights."
    ],
    skills: ["Media Operations", "Event Strategy", "Cross-Team Collaboration", "Branding Campaigns"],
    highlight: "Grew AI workshop reach to 300+ students across 5+ events."
  },
  {
    id: "mosaic-coordinator",
    year: "2025",
    role: "Social Media Coordinator",
    organization: "MOSAIC: Monash Students for AI with Communities",
    location: "Melbourne, VIC, Australia",
    period: "2025 - Present",
    description: [
      "Managed community social coordination and event promotion for MOSAIC's local AI projects, supporting student engagement across monthly initiatives.",
      "Coordinated cross-campus outreach campaigns connecting peers to AI volunteer programs and local community projects."
    ],
    skills: ["Community Outreach", "Social Coordination", "Student Engagement", "AI volunteering"],
    highlight: "Connected students to community-focused AI volunteer programs."
  },
  {
    id: "mysahayak-intern",
    year: "2025",
    role: "IT Intern",
    organization: "Mysahayak",
    location: "Remote / India",
    period: "2025",
    description: [
      "Developed cross-platform mobile features (Flutter) integrated with Python backend services in 2-week Agile sprint cycles.",
      "Built AI-assisted content moderation workflows using machine learning filters, reducing manual review overhead by 30%.",
      "Optimized application efficiency by 20% by profiling backend API layers and resolving 4 performance bottlenecks.",
      "Reduced QA-reported defect rates by 20% by debugging endpoint and mobile pipeline build integration failures."
    ],
    skills: ["Flutter", "Python Backend", "Agile Delivery", "API Optimization", "QA Defect Resolution"],
    highlight: "Reduced manual content moderation review overhead by 30%."
  },
  {
    id: "sacredheart-volunteer",
    year: "2026",
    role: "Volunteer - Electronics Testing & Store Support",
    organization: "Sacred Heart Mission Op Shop",
    location: "Melbourne, VIC, Australia",
    period: "2026 - Present",
    description: [
      "Conducted electrical safety compliance testing on incoming electronics donations.",
      "Provided local IT network troubleshooting, cashier operations, and client support in a fast-paced retail environment.",
      "Managed checkout and customer inquiries, handling 50+ customer interactions per shift."
    ],
    skills: ["Electrical Compliance", "IT Troubleshooting", "POS Cashier", "Customer Service", "Retail Operations"],
    highlight: "Handled 50+ customer interactions per shift."
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
  additionalProjects: additionalProjectsData,
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
