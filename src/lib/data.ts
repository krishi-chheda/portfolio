export interface Project {
  id: string;
  title: string;
  subtitle: string;
  description: string;
  keyOutcome: string;
  role: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
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
  whyBuilt?: string;
  architectureExplain?: string;
  challenge?: string;
  tradeOffs?: string;
  futureImprovement?: string;
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
      name: "AccessVision",
      description: "AI camera assistant that describes surroundings aloud and answers spoken questions for visually impaired users.",
      stack: "Python • FastAPI • YOLOv8 • BLIP",
      githubUrl: "https://github.com/krishi-chheda/AccessVision"
    },
    {
      name: "ClinicalBrief",
      description: "Clinical intelligence research prototype: FHIR ingestion with provenance, human-reviewed AI findings, and a grounded local-LLM copilot.",
      stack: "Next.js • FastAPI • PostgreSQL • Local LLM",
      githubUrl: "https://github.com/krishi-chheda/clinicalbrief"
    }
  ],
  learning: ["Agentic AI", "RAG Systems", "Product Development", "Production AI"],
  leadership: {
    role: "Vice President",
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
    subtitle: "AI Accessibility Assistant",
    role: "AI & Computer Vision Developer",
    description: "Mobile PWA camera assistant for visually impaired users that describes scenes aloud and answers spoken follow-up questions using grounded multimodal reasoning (YOLOv8 + BLIP).",
    keyOutcome: "Cut grounded-query p95 latency by 73% (8.9s → 2.4s) and raised request success from 11.2% to 100% in 50-user Locust load tests.",
    techStack: ["Python", "FastAPI", "Next.js", "YOLOv8", "BLIP", "Web Speech API"],
    githubUrl: "https://github.com/krishi-chheda/AccessVision",
    liveUrl: "https://access-vision-xi.vercel.app",
    overview: {
      problem: "Visually impaired users need fast, specific answers about their surroundings, but general vision-language models are slow and can describe objects that aren't there.",
      solution: "A voice-first PWA that routes each question by intent, localises the target with YOLOv8, and runs BLIP VQA only on the cropped region before reading the answer aloud.",
      status: "Active Refinement"
    },
    architecture: {
      flow: [
        { label: "Camera Capture", description: "Browser MediaDevices stream; frame resized to 800px on a canvas and exported as a ~150KB JPEG" },
        { label: "API Proxy", description: "Next.js route forwards the frame and question to the FastAPI backend" },
        { label: "Intent Router", description: "Chooses an execution path: object, colour and count questions vs general scene description" },
        { label: "YOLOv8 + Crop", description: "Localises the target object and crops its bounding box" },
        { label: "BLIP VQA", description: "Answers the question on the crop only; general descriptions use BLIP captioning" },
        { label: "Web Speech", description: "Browser reads the answer aloud; voice dictation captures follow-up questions" }
      ],
      decisions: [
        "Client-side canvas resizing cuts upload payloads by about 90% (from ~4MB to ~150KB).",
        "Duplicate frames skip model execution entirely via an MD5-keyed inference cache.",
        "Synchronous model passes run in background thread pools behind concurrency semaphores, keeping the FastAPI event loop free.",
        "Request-scoped correlation IDs in the logs trace queue latency, memory use and cache hits per request."
      ]
    },
    impact: {
      achievements: [
        "Grounded-query p95 latency reduced from 8,920 ms to 2,406 ms (73%) under 50 concurrent Locust users.",
        "Object-detection latency reduced from 1,450 ms to 176 ms (87%) in the same load test.",
        "API success rate raised from 11.2% to 100% under 50 concurrent users.",
        "Scene narration filters out objects BLIP mentions that detection does not support."
      ],
      lessons: [
        "Keeping model latency predictable under concurrent load on CPU-class servers.",
        "Designing high-contrast, voice-first interaction for low-vision users."
      ]
    },
    whyBuilt: "General vision-language models describe whole scenes generically. A visually impaired user usually needs a specific answer (what is this object, what colour is it, what does this label say) quickly and without invented details. I wanted a voice-first assistant that answers those targeted questions reliably.",
    architectureExplain: "A Next.js PWA captures and compresses frames in the browser and sends them through an API proxy to a FastAPI backend. An intent router picks the execution path: object, colour and count questions go to YOLOv8, whose bounding box is cropped and passed to BLIP VQA, while general descriptions use BLIP captioning. Restricting VQA to the crop keeps background clutter out of the answer.",
    challenge: "Under 50 concurrent users the unoptimised backend completed only 11.2% of requests, and p95 latency reached 8.9s. Offloading model passes to thread pools, adding concurrency semaphores and an inference cache, and resizing images in the browser brought the success rate to 100% and p95 latency to 2.4s.",
    tradeOffs: "Grounding answers on a cropped region trades breadth for reliability: questions about the wider scene fall back to general captioning, which is less precise. Benchmarking YOLOv8 Nano against Small showed Small at about 2.3x the CPU latency (81 ms vs 35 ms) in exchange for better localisation.",
    futureImprovement: "Port YOLO to ONNX and run it in the browser via WebAssembly to remove the server round trip, then add a navigation mode that announces path obstructions, and multi-language speech."
  },
  {
    id: "clinicalbrief",
    title: "ClinicalBrief",
    subtitle: "Clinical Intelligence Platform (Research Prototype)",
    role: "Full-Stack AI Developer",
    description: "Research prototype that ingests clinical records into one canonical model with provenance, runs an AI pipeline over clinical notes, and keeps a human reviewer in control of every AI output.",
    keyOutcome: "No AI finding is treated as fact until a person approves or edits it. Runs on synthetic (Synthea) data only; no clinical validation is claimed.",
    techStack: ["Next.js", "FastAPI", "Python", "PostgreSQL (Supabase)", "FHIR R4", "Ollama (local LLM)"],
    githubUrl: "https://github.com/krishi-chheda/clinicalbrief",
    liveUrl: "https://clinicalbrief.vercel.app",
    overview: {
      problem: "Clinical data arrives from many systems in different shapes, and AI extraction from clinical notes can't be trusted without human review and a clear record of where every fact came from.",
      solution: "A FastAPI + Next.js platform that imports FHIR R4 records into a canonical model with provenance, extracts findings from notes into a human review queue, and answers questions with a local-LLM copilot grounded in one patient's record.",
      status: "Active Development (Research Prototype)"
    },
    architecture: {
      flow: [
        { label: "FHIR Ingestion", description: "Synthea FHIR R4 adapter with dry run, per-record validation, rejected-record log and idempotent re-import" },
        { label: "Canonical Model", description: "Patients, encounters, notes, diagnoses, medications and more, each carrying source system, source id and provenance" },
        { label: "Note Pipeline", description: "Rule-based extraction with negation and family-history handling, plus an extractive summary" },
        { label: "Human Review", description: "Review queue to approve, reject or edit AI findings; every decision is audited" },
        { label: "Grounded Copilot", description: "Local LLM answers from cited patient evidence; unsupported sentences are removed and treatment advice is withheld" },
        { label: "FHIR Export", description: "R4 transaction bundle built from the canonical record, structurally validated on every export" }
      ],
      decisions: [
        "Patient data is only ever sent to a model on the same machine: the copilot accepts loopback LLM URLs only.",
        "Authorization is enforced in the API and mirrored in Postgres row-level security (six roles plus a read-only demo role).",
        "The rule-based extractor reports confidence as null rather than an uncalibrated number.",
        "Server access logs are disabled because URLs contain patient ids; the app records route templates only."
      ]
    },
    impact: {
      achievements: [
        "Postgres full-text search across 35,103 synthetic notes and the structured record, scoped to the patients a user may access.",
        "Manual copilot check (not an evaluation): 6 grounded, correct answers and 5 correct refusals across 11 questions; the six defects found are now covered by regression tests.",
        "FHIR R4 export with per-export structural validation reported to the client."
      ],
      lessons: [
        "Designing AI features whose output is 'not yet trusted' until a person reviews it.",
        "Stating limits explicitly: no accuracy figure is shown until it is measured on labelled data."
      ]
    },
    whyBuilt: "AI summaries of clinical records are only useful if every output can be traced to its source and checked by a person. I built ClinicalBrief to explore what a clinical AI platform looks like when provenance and human review are the foundation rather than an afterthought.",
    architectureExplain: "A Next.js frontend reads only through a FastAPI backend, authenticated with Supabase Auth tokens. The backend stores data in Postgres on Supabase (SQLite for local development), with SQL migrations as the schema's source of truth and a test that fails if the ORM drifts from them. Ingestion adapters map source systems into the canonical model; services handle the AI pipeline, search, FHIR export and risk scoring.",
    challenge: "Keeping the copilot honest. A manual live check surfaced six defects, including citation spam, a drug-class miss, an outdated 'most recent' lab value and runaway generation. Each was fixed and covered by a regression test, and a verification step now removes unsupported sentences and withholds any answer that gives treatment or dosing advice.",
    tradeOffs: "Running the copilot only on a local model keeps patient data on the machine, but the hosted demo can't reach a local model, so online it gives labelled rule-based answers instead. The default extractor is rule-based: transparent and testable, but with a small vocabulary (~60 terms) that hasn't been evaluated against labelled data.",
    futureImprovement: "Add embedding-based semantic search over records, evaluate extraction against a labelled dataset before showing any accuracy figure, and validate FHIR exports against Australian (AU Base / AU Core) profiles."
  },
  {
    id: "studenthub",
    title: "StudentHub",
    subtitle: "Melbourne Student Resource Portal",
    role: "Lead Product Developer",
    description: "Resource portal for students arriving in Melbourne: accommodation and roommate listings, a Q&A forum, events, restaurant and suburb guides, an arrival checklist and scam alerts.",
    keyOutcome: "Brought housing, roommates, events, local guides and arrival checklists into one deployed portal.",
    techStack: ["Next.js", "JavaScript", "TypeScript", "Supabase", "Tailwind CSS", "Eventbrite API", "Foursquare API"],
    githubUrl: "https://github.com/krishi-chheda/student-hub",
    liveUrl: "https://mystudenthub.vercel.app",
    overview: {
      problem: "International students arriving in Melbourne find housing, local information and events scattered across many channels.",
      solution: "A Next.js portal combining community-submitted accommodation, roommate and city-tip listings with event and restaurant data from external APIs, plus checklists and scam alerts for new arrivals.",
      status: "Completed"
    },
    architecture: {
      flow: [
        { label: "Next.js Pages", description: "Accommodation, roommates, forum, events, explore, checklist, city tips and scam alerts" },
        { label: "Supabase", description: "Authentication and storage for listings, forum questions and community submissions" },
        { label: "External APIs", description: "Eventbrite for events, Foursquare for restaurants, ABS data for suburb information" },
        { label: "Admin", description: "Admin page for managing community submissions" }
      ],
      decisions: [
        "Used Supabase for authentication and data, so community submissions need no custom backend.",
        "Pulled events and restaurants from Eventbrite and Foursquare instead of maintaining those datasets by hand."
      ]
    },
    impact: {
      achievements: [
        "Deployed at mystudenthub.vercel.app.",
        "Covers accommodation, roommates, forum, events, restaurants, suburbs, checklists, city tips and scam alerts in one place."
      ],
      lessons: [
        "Normalising third-party APIs (Eventbrite, Foursquare, ABS) with different data shapes.",
        "Designing submission flows for community-contributed content."
      ]
    },
    whyBuilt: "Students relocating to Melbourne search across scattered social-media groups and websites for housing, local tips and events. I wanted one place that covers the essentials of arriving and settling in.",
    architectureExplain: "A Next.js App Router frontend, with Supabase handling authentication and storage for community content. API routes and helper modules wrap the external data sources (Eventbrite, Foursquare and ABS data) so pages work with one consistent interface.",
    challenge: "Combining data from several external APIs, each with its own format and limits, into consistent listings and search results.",
    tradeOffs: "Building on a hosted backend (Supabase) and public APIs made the portal fast to build, at the cost of depending on third-party availability and rate limits.",
    futureImprovement: "Serve listing pages statically with incremental static regeneration and refresh them in the background, so pages load instantly while data stays current."
  },
  {
    id: "traffic-ai",
    title: "Traffic AI",
    subtitle: "Density-Based Traffic Signal Scheduling",
    role: "AI Research Lead",
    description: "Traffic light scheduling system that detects vehicles with YOLO, estimates lane density, and uses it to inform signal timing on an NVIDIA Jetson Nano.",
    keyOutcome: "Approximately 42% reduction in waiting time.",
    techStack: ["Python", "YOLO", "OpenCV", "NVIDIA Jetson Nano"],
    overview: {
      problem: "Fixed-timer traffic signals ignore how many vehicles are actually waiting in each lane, which causes unnecessary idling and congestion.",
      solution: "A computer-vision pipeline that counts vehicles per lane from camera video and allocates green time according to lane density.",
      status: "Completed"
    },
    architecture: {
      flow: [
        { label: "Camera Feed", description: "Video of the intersection approaches" },
        { label: "YOLO Detection", description: "Detects vehicles in each frame on the Jetson Nano" },
        { label: "Lane Density", description: "OpenCV lane regions turn detections into per-lane vehicle density" },
        { label: "Signal Scheduler", description: "Allocates green time according to relative lane density" }
      ],
      decisions: [
        "Ran detection on a Jetson Nano at the intersection so timing decisions don't depend on a network connection.",
        "Used lane regions to turn raw detections into per-lane density for scheduling."
      ]
    },
    impact: {
      achievements: [
        "Approximately 42% reduction in waiting time."
      ],
      lessons: [
        "Running object detection within the compute and memory limits of edge hardware.",
        "Turning per-frame detections into stable lane-density estimates for scheduling."
      ]
    },
    whyBuilt: "Conventional traffic lights run on fixed timers, so green time is often given to empty lanes while queues build elsewhere. I wanted a reactive scheduler that allocates green time based on how many vehicles are actually waiting.",
    architectureExplain: "Camera frames are processed locally on an NVIDIA Jetson Nano. YOLO detects vehicles, OpenCV maps the detections to lane regions, and the scheduler converts each lane's density into green-light duration.",
    challenge: "Running detection fast enough on the Jetson Nano's limited GPU and memory to keep lane counts current.",
    tradeOffs: "Allocating green time from local density is simple and runs at the edge, but each intersection optimises in isolation without coordinating with its neighbours.",
    futureImprovement: "Train cooperative reinforcement-learning agents in a traffic simulator such as SUMO, so adjacent intersections share queue data and coordinate timing instead of running in isolation."
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
    id: "mdas-vp",
    year: "2026",
    role: "Vice President (previously Media & Marketing Director, Jan–May 2026; Media & Marketing Officer, Oct 2025–Jan 2026)",
    organization: "Monash Data & AI Society (MDAS)",
    location: "Melbourne, VIC, Australia",
    period: "Oct 2025 - Present (Vice President since Jul 2026)",
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
    roleSummary: "Krishi is an international student based in Melbourne, studying for a Master of Artificial Intelligence at Monash University. He is Vice President of the Monash Data & AI Society (MDAS), having previously served as Media & Marketing Officer (Oct 2025–Jan 2026) and Media & Marketing Director (Jan–May 2026). He is passionate about bridging the gap between machine learning models and highly-usable, production-grade applications.",
    interests: ["Formula 1", "Fitness & Lifting", "High-Agency Startups", "Applied ML Research", "Agentic AI"]
  },
  careerGoals: "Krishi aims to work in high-growth environments where he can deploy AI models to production. He is looking for engineering opportunities in AI Engineering, Machine Learning, Software Engineering, or Technology Consulting in Australia or globally.",
  projects: projectsData,
  additionalProjects: additionalProjectsData,
  experience: experienceData,
  faq: [
    {
      q: "Is Krishi open to job offers?",
      a: "Yes. Krishi is open to opportunities in AI Engineering, Machine Learning Engineering, Software Engineering and Technology Consulting. He graduates from Monash University's Master of AI in July 2027."
    },
    {
      q: "Where is Krishi located?",
      a: "He is based in Melbourne, Victoria, Australia."
    },
    {
      q: "What is his role at MDAS?",
      a: "He has been Vice President since July 2026. Before that he was Media & Marketing Director (Jan–May 2026) and Media & Marketing Officer (Oct 2025–Jan 2026)."
    },
    {
      q: "What is ClinicalBrief?",
      a: "ClinicalBrief is a clinical intelligence research prototype (Next.js, FastAPI, Postgres). It ingests FHIR records into a canonical model with provenance, extracts findings from notes for human review, and offers a local-LLM copilot grounded in one patient's record. It runs on synthetic data only."
    }
  ]
};

export const bootLinesData = [
  "master_of_ai.monash",
  "mdas.vice_president",
  "studenthub.platform",
  "traffic_ai.yolo",
  "accessvision.yolo",
  "clinicalbrief.platform",
  "leadership.framework"
];
