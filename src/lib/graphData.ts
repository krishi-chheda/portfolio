export interface GraphNode {
  id: string;
  label: string;
  group: 'root' | 'category' | 'ai' | 'project' | 'leadership' | 'swe' | 'education' | 'future';
  val: number; // importance weight / node size
  description: string;
  details?: string[];
  parentId?: string; // Links detail nodes to their parent categories
  isDetail?: boolean; // If true, only loaded when parent is expanded/double-clicked
}

export interface GraphLink {
  source: string;
  target: string;
  value?: number; // strength of link
}

export const initialNodes: GraphNode[] = [
  // Central Node
  {
    id: "root",
    label: "KRISHI",
    group: "root",
    val: 18,
    description: "Krishi Chheda: AI Engineer, Builder, and Monash Master of AI Scholar.",
    details: [
      "Academic Focus: Deep Learning, Computer Vision, NLP",
      "Leadership: Media & Marketing Director @ MDAS",
      "Interests: Agentic Systems, AI Products, Startups"
    ]
  },

  // Main Categories
  {
    id: "cat_ai",
    label: "AI & Machine Learning",
    group: "category",
    val: 12,
    description: "Core technical expertise spanning Deep Learning architectures, Computer Vision, and Generative AI applications.",
    details: ["Primary Frameworks: PyTorch, TensorFlow", "Specializations: CNNs, OpenCV, RL Models"]
  },
  {
    id: "cat_projects",
    label: "Projects",
    group: "category",
    val: 12,
    description: "Production-ready software builds combining AI backends with seamless responsive frontend web architectures.",
    details: ["ClinicalBrief (Healthcare AI)", "StudentHub (Melbourne Services)", "AI Traffic Light System (Edge AI & Optimization)"]
  },
  {
    id: "cat_swe",
    label: "Software Engineering",
    group: "category",
    val: 12,
    description: "Solid foundation in developing robust backend servers, API integrations, and low-latency client interfaces.",
    details: ["Primary Languages: Python, TypeScript, SQL", "Architecture: REST APIs, Frontend state optimization"]
  },
  {
    id: "cat_leadership",
    label: "Leadership",
    group: "category",
    val: 12,
    description: "Active director roles, public speaking, developer bootcamps, and technical student society coordination.",
    details: ["Media & Marketing Director @ Monash Data Analytics Society (MDAS)", "Growth: Boosted society branding reach and engagement by 40%"]
  },
  {
    id: "cat_education",
    label: "Education",
    group: "category",
    val: 10,
    description: "Academic foundation in modern computational science, machine learning models, and algorithm design.",
    details: ["University: Monash University (Melbourne, VIC)", "Degree: Master of Artificial Intelligence (2024 - Present)"]
  },
  {
    id: "cat_future",
    label: "Future Vision",
    group: "category",
    val: 10,
    description: "Professional directions, technical research targets, and entrepreneurial milestones.",
    details: ["Aspirations: Founding AI Engineer, Startups, Scale-ups", "Technical Goals: Agentic AI Workflows, Local LLM Fine-Tuning"]
  },

  // AI Cluster (Initial Core Nodes)
  {
    id: "ai_cv",
    label: "Computer Vision",
    group: "ai",
    val: 8,
    description: "Extracting structured insights and tracking real-world entities from live camera feeds.",
    parentId: "cat_ai"
  },
  {
    id: "ai_yolo",
    label: "YOLO",
    group: "ai",
    val: 8,
    description: "Real-time state object detection used for identifying multi-lane traffic counts and navigation obstacles.",
    parentId: "cat_ai"
  },
  {
    id: "ai_llm",
    label: "LLM Applications",
    group: "ai",
    val: 8,
    description: "Deploying generative foundation models securely to process complex conversational audio and medical summaries.",
    parentId: "cat_ai"
  },

  // Projects Cluster (Initial Core Nodes)
  {
    id: "proj_clinicalbrief",
    label: "ClinicalBrief",
    group: "project",
    val: 9,
    description: "AI healthcare platform helping users access, organize, and understand medical summaries.",
    details: ["Tech: Next.js, FastAPI, Python, LLMs, API Integrations", "Category: Healthcare AI Platform"],
    parentId: "cat_projects"
  },
  {
    id: "proj_studenthub",
    label: "StudentHub",
    group: "project",
    val: 9,
    description: "A student platform built to help international student arrivals in Melbourne discover housing and resources.",
    details: ["Tech: Next.js, TypeScript, Database Systems, API Integrations, Vercel", "Category: Student Platform"],
    parentId: "cat_projects"
  },
  {
    id: "proj_traffic",
    label: "AI Traffic Light System",
    group: "project",
    val: 9,
    description: "Reinforcement learning traffic controller optimizing intersection wait times in real-time.",
    details: ["Tech: YOLO, OpenCV, Python, Jetson Nano", "Result: Waiting time reduced by approximately 42%"],
    parentId: "cat_projects"
  },

  // Software Engineering Cluster (Initial Core Nodes)
  {
    id: "swe_python",
    label: "Python",
    group: "swe",
    val: 8,
    description: "Core language used for backend logic, AI research, and simulation scripting.",
    parentId: "cat_swe"
  },
  {
    id: "swe_typescript",
    label: "TypeScript",
    group: "swe",
    val: 8,
    description: "Primary choice for building type-safe, scalable web frontends and microservices.",
    parentId: "cat_swe"
  },
  {
    id: "swe_nextjs",
    label: "Next.js",
    group: "swe",
    val: 8,
    description: "React framework used to build server-rendered, optimized single-page applications.",
    parentId: "cat_swe"
  },

  // Leadership Cluster (Initial Core Nodes)
  {
    id: "lead_mdas",
    label: "MDAS",
    group: "leadership",
    val: 9,
    description: "Largest data analytics society at Monash, connecting industry leaders to student builders.",
    details: ["Role: Media & Marketing Director", "Achievements: Led brand redesign, grew engagement by 40%"],
    parentId: "cat_leadership"
  },
  {
    id: "lead_community",
    label: "Community Building",
    group: "leadership",
    val: 7,
    description: "Fostering inclusive, high-agency environments for student developers and tech enthusiasts.",
    details: ["Initiatives: Organized MDAS hackathons, winter bootcamps, and networking nights"],
    parentId: "cat_leadership"
  },
  {
    id: "lead_team",
    label: "Team Leadership",
    group: "leadership",
    val: 8,
    description: "Guiding design and development groups in sprint cycles to construct user interfaces.",
    details: ["Context: Directed cross-functional project squads of developers and UI designers"],
    parentId: "cat_leadership"
  },

  // Education Cluster (Initial Core Nodes)
  {
    id: "edu_monash",
    label: "Monash University",
    group: "education",
    val: 8,
    description: "Top-tier Australian research university located in Melbourne, VIC.",
    details: ["Academics: High distinctions in Advanced Topics in AI, Machine Learning, and NLP"],
    parentId: "cat_education"
  },

  // Future Vision Cluster (Initial Core Nodes)
  {
    id: "future_agentic",
    label: "Agentic Systems",
    group: "future",
    val: 7,
    description: "Building autonomous software tools capable of multi-step reasoning, tool usage, and context memory.",
    parentId: "cat_future"
  },
  {
    id: "future_products",
    label: "AI Products",
    group: "future",
    val: 7,
    description: "Architecting scale digital applications powered by intelligence backends.",
    parentId: "cat_future"
  }
];

export const detailNodes: GraphNode[] = [
  // AI Cluster Detail Nodes
  {
    id: "ai_opencv",
    label: "OpenCV",
    group: "ai",
    val: 5,
    description: "Image processing pipeline handling shadow suppression, grayscales, and webcam matrix feeds.",
    parentId: "cat_ai",
    isDetail: true
  },
  {
    id: "ai_inference",
    label: "AI Inference",
    group: "ai",
    val: 5,
    description: "Low-latency neural network inference processing on Edge modules.",
    parentId: "cat_ai",
    isDetail: true
  },
  {
    id: "ai_realtime",
    label: "Real-Time Systems",
    group: "ai",
    val: 5,
    description: "Asynchronous processing loops coordinating sensors and camera matrix inputs.",
    parentId: "cat_ai",
    isDetail: true
  },
  {
    id: "ai_jetson",
    label: "Jetson Nano",
    group: "ai",
    val: 5,
    description: "NVIDIA edge computing developer kit used to deploy low-latency deep learning models.",
    parentId: "cat_ai",
    isDetail: true
  },
  {
    id: "ai_dl",
    label: "Deep Learning",
    group: "ai",
    val: 6,
    description: "Analysis of neural layer weights, custom activation functions, and gradient optimizations.",
    parentId: "cat_ai",
    isDetail: true
  },

  // Projects Cluster Detail Nodes
  {
    id: "proj_accessible",
    label: "Accessible Vision",
    group: "project",
    val: 6,
    description: "An AI-powered assistive system designed to help visually impaired users navigate surroundings.",
    parentId: "cat_projects",
    isDetail: true
  },

  // Software Engineering Detail Nodes
  {
    id: "swe_fastapi",
    label: "FastAPI",
    group: "swe",
    val: 5,
    description: "Asynchronous Python web framework used to construct high-performance REST APIs.",
    parentId: "cat_swe",
    isDetail: true
  },
  {
    id: "swe_api",
    label: "API Integrations",
    group: "swe",
    val: 5,
    description: "Interfacing with LLM models, Mapbox map tiles, and local transport networks.",
    parentId: "cat_swe",
    isDetail: true
  },
  {
    id: "swe_sql",
    label: "Database Systems",
    group: "swe",
    val: 5,
    description: "Relational database querying and schemas for verified housing checklists.",
    parentId: "cat_swe",
    isDetail: true
  },
  {
    id: "swe_vercel",
    label: "Vercel",
    group: "swe",
    val: 5,
    description: "Cloud hosting platform optimized for serverless Next.js rendering.",
    parentId: "cat_swe",
    isDetail: true
  },

  // Leadership Cluster Detail Nodes
  {
    id: "lead_director",
    label: "Media & Marketing Director",
    group: "leadership",
    val: 6,
    description: "Managing MDAS marketing workflows, graphic assets, and social channels branding.",
    parentId: "cat_leadership",
    isDetail: true
  },
  {
    id: "lead_event",
    label: "Event Strategy",
    group: "leadership",
    val: 5,
    description: "Organizing corporate networking nights and student hackathons with 100+ attendees.",
    parentId: "cat_leadership",
    isDetail: true
  },
  {
    id: "lead_speaking",
    label: "Public Speaking",
    group: "leadership",
    val: 5,
    description: "Conducting technical society bootcamps and presenting project panels to Monash peers.",
    parentId: "cat_leadership",
    isDetail: true
  },

  // Education Cluster Detail Nodes
  {
    id: "edu_master",
    label: "Master of AI",
    group: "education",
    val: 6,
    description: "Postgraduate course deep-diving into deep learning, computer vision, RL, and optimization algorithms.",
    parentId: "cat_education",
    isDetail: true
  },

  // Future Vision Cluster Detail Nodes
  {
    id: "future_entrepreneurship",
    label: "Entrepreneurship",
    group: "future",
    val: 6,
    description: "Structuring market strategies, exploring startup business frameworks, and driving early MVP discovery.",
    parentId: "cat_future",
    isDetail: true
  },
  {
    id: "future_research",
    label: "Research",
    group: "future",
    val: 5,
    description: "Bridging the gap between ML models in research papers and lightweight production APIs.",
    parentId: "cat_future",
    isDetail: true
  },
  {
    id: "future_startups",
    label: "Startups",
    group: "future",
    val: 6,
    description: "Building vertical SaaS tools and AI-driven products from the ground up.",
    parentId: "cat_future",
    isDetail: true
  },
  {
    id: "future_leadership",
    label: "Technical Leadership",
    group: "future",
    val: 6,
    description: "Mentoring developers, establishing engineering standards, and aligning product roadmap directions.",
    parentId: "cat_future",
    isDetail: true
  }
];

export const initialLinks: GraphLink[] = [
  // Root Connections
  { source: "root", target: "cat_ai" },
  { source: "root", target: "cat_projects" },
  { source: "root", target: "cat_swe" },
  { source: "root", target: "cat_leadership" },
  { source: "root", target: "cat_education" },
  { source: "root", target: "cat_future" },

  // AI Links
  { source: "cat_ai", target: "ai_cv" },
  { source: "cat_ai", target: "ai_yolo" },
  { source: "cat_ai", target: "ai_llm" },

  // Project Links
  { source: "cat_projects", target: "proj_clinicalbrief" },
  { source: "cat_projects", target: "proj_studenthub" },
  { source: "cat_projects", target: "proj_traffic" },

  // Software Engineering Links
  { source: "cat_swe", target: "swe_python" },
  { source: "cat_swe", target: "swe_typescript" },
  { source: "cat_swe", target: "swe_nextjs" },

  // Cross-Links between projects and initial technologies (AI & SWE)
  { source: "proj_clinicalbrief", target: "ai_llm" },
  { source: "proj_clinicalbrief", target: "swe_nextjs" },
  { source: "proj_clinicalbrief", target: "swe_python" },
  
  { source: "proj_studenthub", target: "swe_nextjs" },
  { source: "proj_studenthub", target: "swe_typescript" },
  
  { source: "proj_traffic", target: "ai_yolo" },
  { source: "proj_traffic", target: "ai_cv" },
  { source: "proj_traffic", target: "swe_python" },

  // Leadership Links
  { source: "cat_leadership", target: "lead_mdas" },
  { source: "cat_leadership", target: "lead_community" },
  { source: "cat_leadership", target: "lead_team" },

  // Education Links
  { source: "cat_education", target: "edu_monash" },
  { source: "edu_monash", target: "cat_ai" }, // connection back to ML learning
  { source: "edu_monash", target: "cat_swe" }, // connection back to Software engineering

  // Future Links
  { source: "cat_future", target: "future_agentic" },
  { source: "cat_future", target: "future_products" }
];

export const detailLinks: GraphLink[] = [
  // AI Detail Links
  { source: "cat_ai", target: "ai_opencv" },
  { source: "cat_ai", target: "ai_inference" },
  { source: "cat_ai", target: "ai_realtime" },
  { source: "cat_ai", target: "ai_jetson" },
  { source: "cat_ai", target: "ai_dl" },

  // Project Detail Links
  { source: "cat_projects", target: "proj_accessible" },

  // SWE Detail Links
  { source: "cat_swe", target: "swe_fastapi" },
  { source: "cat_swe", target: "swe_api" },
  { source: "cat_swe", target: "swe_sql" },
  { source: "cat_swe", target: "swe_vercel" },

  // Cross-links between projects and technologies (including details)
  { source: "proj_clinicalbrief", target: "swe_fastapi" },
  { source: "proj_clinicalbrief", target: "swe_api" },

  { source: "proj_studenthub", target: "swe_api" },
  { source: "proj_studenthub", target: "swe_sql" },
  { source: "proj_studenthub", target: "swe_vercel" },

  { source: "proj_traffic", target: "ai_opencv" },
  { source: "proj_traffic", target: "ai_jetson" },
  { source: "proj_traffic", target: "ai_realtime" },

  { source: "proj_accessible", target: "ai_yolo" },
  { source: "proj_accessible", target: "ai_cv" },
  { source: "proj_accessible", target: "proj_clinicalbrief" }, // make sure everything links up or we can add it
  { source: "proj_accessible", target: "ai_dl" },
  { source: "proj_accessible", target: "ai_inference" },
  { source: "proj_accessible", target: "ai_realtime" },
  { source: "proj_accessible", target: "swe_python" },

  // Leadership Detail Links
  { source: "cat_leadership", target: "lead_director" },
  { source: "cat_leadership", target: "lead_event" },
  { source: "cat_leadership", target: "lead_speaking" },
  { source: "lead_mdas", target: "lead_director" },

  // Education Detail Links
  { source: "cat_education", target: "edu_master" },
  { source: "edu_master", target: "edu_monash" },
  { source: "edu_master", target: "ai_dl" }, // master connects to deep learning

  // Future Detail Links
  { source: "cat_future", target: "future_entrepreneurship" },
  { source: "cat_future", target: "future_research" },
  { source: "cat_future", target: "future_startups" },
  { source: "cat_future", target: "future_leadership" },

  // Future cross-links
  { source: "future_startups", target: "future_products" },
  { source: "future_startups", target: "future_entrepreneurship" },
  { source: "future_research", target: "ai_dl" },
  { source: "future_leadership", target: "lead_team" },
  { source: "future_leadership", target: "future_products" }
];
