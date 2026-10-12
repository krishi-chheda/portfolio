import { NextResponse } from "next/server";
import { aiKnowledgeBase, projectsData } from "@/lib/data";

const COMMAND_KEYWORDS: [command: string, keywords: string[]][] = [
  ["cat README.md", ["readme", "what is krishi.os", "navigate", "operating manual", "manual", "about this portfolio"]],
  ["cat projects/accessible-vision/details.md", ["accessible", "vision", "assistive"]],
  ["cat projects/clinicalbrief/details.md", ["clinical", "brief", "belief"]],
  ["cat projects/studenthub/details.md", ["student", "hub", "studenthub"]],
  ["cat projects/traffic-ai/details.md", ["traffic", "congestion", "signal", "rl", "sumo"]],
  ["cd leadership", ["leadership", "mdas", "mosaic"]],
  ["git log --career", ["career", "experience", "background", "journey", "resume", "cv", "history", "work", "intern"]],
  ["tail -f currently-building.log", ["building", "current", "next"]],
  ["open system-map", ["skill", "tech", "stack", "knowledge", "expert", "graph", "system-map"]],
  ["ssh recruiter@krishi.os", ["contact", "email", "reach", "connect", "interview", "linkedin"]],
];

const MAX_MESSAGE_LENGTH = 500;

// Fallback project answers are built from projectsData so they never drift from the Projects section.
function projectReply(id: string, followUps: string[]): string {
  const p = projectsData.find((proj) => proj.id === id);
  if (!p) return "";
  const links = [p.githubUrl && `- Code: ${p.githubUrl}`, p.liveUrl && `- Live demo: ${p.liveUrl}`].filter(Boolean);
  return `${p.title}: ${p.description}

Key details:
- Stack: ${p.techStack.join(", ")}.
- Status: ${p.overview.status}.
- Outcome: ${p.keyOutcome}
${links.join("\n")}

What would you like to ask next?
${followUps.map((q) => `- "${q}"`).join("\n")}`;
}

function matchCommand(text: string): string {
  const match = COMMAND_KEYWORDS.find(([, keywords]) => keywords.some((k) => text.includes(k)));
  return match?.[0] ?? "";
}

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const message = typeof body?.message === "string" ? body.message.trim() : "";
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
    }
    if (message.length > MAX_MESSAGE_LENGTH) {
      return NextResponse.json(
        { error: `Message must be ${MAX_MESSAGE_LENGTH} characters or fewer` },
        { status: 400 }
      );
    }

    const query = message.toLowerCase();
    let reply = "";

    // 1. Check for LLM Environment Configuration
    if (process.env.OPENAI_API_KEY) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: `You are Krishi Chheda's digital twin. Speak in the first person ("I", "my") as if you are Krishi himself answering a recruiter, hiring manager, or founder. Be confident, direct, authentic, and engineering-focused. Answer using these facts: ${JSON.stringify(
                  aiKnowledgeBase
                )}. Always structure your response to highlight why I should be hired. After every single response, you must append a set of exactly 3 relevant, contextual follow-up questions that the recruiter or founder might want to ask next. Format these questions as bullet points under a 'What would you like to ask next?' header.

Additionally, you have navigation routing capabilities. If the user asks about a project, leadership role, work history, skills, contact info, what you are currently building, or how to explore/navigate the system, you must recommend a command shortcut at the very end of your response formatted exactly as '[command: <command_string>]'. Choose from these exact command strings only:
- 'cat README.md' (for README, manual, how to explore, how to navigate, or introduction/onboarding to KRISHI.OS)
- 'cat projects/accessible-vision/details.md' (for the AccessVision project)
- 'cat projects/clinicalbrief/details.md' (for ClinicalBrief project)
- 'cat projects/studenthub/details.md' (for StudentHub project)
- 'cat projects/traffic-ai/details.md' (for Traffic AI project)
- 'cd leadership' (for leadership, MDAS, MOSAIC, or extracurricular activities)
- 'git log --career' (for career experience, internships, academic background, resume, or timeline)
- 'tail -f currently-building.log' (for what you are currently building, active builds, current pipeline)
- 'open system-map' (for skills, technologies, knowledge graph, expertise)
- 'ssh recruiter@krishi.os' (for contact, email, links, socials, interview setup)

If asked about things not in the facts, politely state you don't have that detail and suggest emailing me at krishichheda10@gmail.com.`,
              },
              { role: "user", content: message },
            ],
            temperature: 0.7,
          }),
        });
        if (!response.ok) {
          throw new Error(`OpenAI returned status ${response.status}`);
        }
        const data = await response.json();
        reply = data.choices?.[0]?.message?.content ?? "";
      } catch (err) {
        console.error("OpenAI request failed, falling back to local engine:", err);
      }
    }

    // 2. Local High-Agency Conversational Search Engine (Robust Fallback)
    if (!reply) {
      if (
        query.includes("what is krishi.os") ||
        query.includes("what is this portfolio") ||
        query.includes("about this portfolio") ||
        query.includes("how should i navigate") ||
        query.includes("how to navigate") ||
        query.includes("readme") ||
        query.includes("manual")
      ) {
        reply = `KRISHI.OS is an operating system-inspired portfolio designed to showcase my AI engineering projects, experience, and system-thinking philosophy in an interactive workspace.

Rather than a static, linear resume, it runs as a mock desktop console where you can explore detailed modules like Projects, Career, and the interactive Knowledge Network topology.

To get the full operating instructions and onboarding details, you should inspect the README page.

What would you like to ask next?
- "How do I view your career history as a git log?"
- "What technology stack powers this site?"
- "How do I use the command palette?"

[command: cat README.md]`;
      } else if (query.includes("clinical") || query.includes("brief") || query.includes("belief")) {
        reply = projectReply("clinicalbrief", [
          "How does human review of AI findings work in ClinicalBrief?",
          "How does the copilot stay grounded in the patient record?",
          "Why does the copilot only use a local model?",
        ]);
      }
      else if (query.includes("student") || query.includes("hub") || query.includes("studenthub")) {
        reply = projectReply("studenthub", [
          "Which external APIs does StudentHub use?",
          "Why did you choose Supabase?",
          "Can I try the live portal?",
        ]);
      }
      else if (query.includes("traffic") || query.includes("light") || query.includes("rl") || query.includes("sumo") || query.includes("congestion")) {
        reply = projectReply("traffic-ai", [
          "How does lane density decide green time?",
          "Why run detection on a Jetson Nano?",
          "How would you coordinate multiple intersections?",
        ]);
      }
      else if (query.includes("accessible") || query.includes("vision") || query.includes("assistive") || query.includes("guidance") || query.includes("visually")) {
        reply = projectReply("accessible-vision", [
          "How does grounding with YOLOv8 crops reduce hallucinations?",
          "How did you cut p95 latency by 73% under load?",
          "How does the voice-first interface work?",
        ]);
      }
      else if (query.includes("auralens") || query.includes("cull") || query.includes("photo") || query.includes("camera") || query.includes("blurry")) {
        reply = `I built AuraLens AI, a local photography assistant that optimizes workflows for photographers by culling blurry pictures and allowing semantic vibe searches.
        
Key details:
- Stack: Python (Streamlit), OpenCV (for Laplacian blur variance calculations), ChromaDB, and Hugging Face CLIP models.
- Features: Blurry photo detection (keeps vs rejects culling) and offline semantic search ('find a happy dog').
- Outcomes: Runs 100% locally with zero cloud dependencies to ensure photographer data privacy.

What would you like to ask next?
- "How does the OpenCV blurry culling algorithm calculate variance?"
- "Why did you use ChromaDB and CLIP for semantic search?"
- "Is AuraLens AI open source?"

[command: cat projects/auralens/details.md]`;
      }
      else if (query.includes("f1") || query.includes("formula") || query.includes("telemetry") || query.includes("race") || query.includes("lap")) {
        reply = `I designed the F1 Telemetry AI Suite, a telemetry dashboard and analysis package that tracks Formula 1 driver performances and visualizes speed, gear, throttle, and braking profiles.
        
Key details:
- Stack: TypeScript, Next.js, React, Recharts (for the frontend dashboard) and Python, Pandas, Streamlit (for the telemetry parsing engine).
- Features: Projecting throttle/brake parameters onto 2D track maps, lap log tables, and comparative charts.
- Outcomes: Helps trace driving lines and performance gaps across sector maps.

What would you like to ask next?
- "How do you map telemetry variables onto 2D track maps?"
- "Which library parses the F1 telemetry packets in Python?"
- "Where is the F1 Telemetry dashboard hosted?"

[command: cat projects/f1-telemetry/details.md]`;
      }
      else if (query.includes("pressure") || query.includes("bp") || query.includes("systolic") || query.includes("diastolic") || query.includes("fastapi_backend")) {
        reply = `I developed the Blood Pressure Prediction API, which predicts blood pressure metrics from facial video feeds using machine learning and computer vision.
        
Key details:
- Stack: Python, FastAPI, OpenCV, Mediapipe (face tracking), and Scikit-learn.
- Features: Real-time skin region tracking, color variation extraction (photoplethysmography), and linear/lasso/ridge regression models.
- Outcomes: Implements a clean FastAPI inference endpoint to analyze uploads and forecast metrics.

What would you like to ask next?
- "How does Photoplethysmography (PPG) work through a camera?"
- "What ML regression models perform the systolic/diastolic predictions?"
- "How is facial tracking managed?"

[command: cat projects/blood-pressure/details.md]`;
      }
      else if (query.includes("splitter") || query.includes("split") || query.includes("trim") || query.includes("ffmpeg")) {
        reply = `I created Video Splitter Pro, a web application that allows users to split video files at custom timestamps and extract audio tracks.
        
Key details:
- Stack: Python, Streamlit, and FFmpeg.
- Features: Custom timestamp splitting and MP3/WAV audio extraction.
- Outcomes: Provides content creators with an optimized, lightweight media processing UI that runs locally.

What would you like to ask next?
- "Does Video Splitter Pro support splitting without quality loss?"
- "How does it execute FFmpeg commands in Python?"
- "Can it batch process multiple video files?"

[command: cat projects/video-splitter/details.md]`;
      }
      else if (query.includes("skill") || query.includes("tech") || query.includes("stack") || query.includes("language") || query.includes("python") || query.includes("javascript") || query.includes("typescript") || query.includes("react") || query.includes("yolo") || query.includes("opencv")) {
        reply = `My technical skill set spans artificial intelligence engineering and full-stack software development:
- AI & ML: Computer Vision (YOLO, OpenCV), LLM Applications, Real-Time Inference, Prompt Engineering, Python.
- Software Engineering: Next.js, React, TypeScript, FastAPI, REST APIs, Git, Database Systems, Vercel, Jetson Nano.
- Leadership & Marketing: Brand Strategy, Event Management, Public Speaking, Community Building.

I focus on building performant, secure, and production-grade applications that solve real user needs.

What would you like to ask next?
- "What is your primary programming language?"
- "What is your experience with edge AI hardware like Jetson Nano?"
- "How do you approach securing patient data in LLM pipelines?"`;
      }
      else if (query.includes("experience") || query.includes("work") || query.includes("career") || query.includes("history") || query.includes("intern") || query.includes("mysahayak") || query.includes("mosaic") || query.includes("volunteer") || query.includes("sacred")) {
        reply = `I have built technical, leadership, and community experience across several roles:
- Mysahayak (IT Intern, 2025): Built AI-assisted content moderation workflows (reducing manual review by 30%), integrated REST APIs, and optimized backend API layers.
- Monash Data & AI Society (Vice President, Jul 2026 - Present; previously Media & Marketing Director, Jan - May 2026, and Media & Marketing Officer, Oct 2025 - Jan 2026).
- MOSAIC (Social Media Coordinator, 2025 - Present): Managing community social coordination and event promotion for Monash Students for AI with Communities.
- Sacred Heart Mission Op Shop (Volunteer, 2026 - Present): Conducting electrical compliance testing and troubleshooting IT network issues.

What would you like to ask next?
- "What did you accomplish during your internship at Mysahayak?"
- "What is your role at MOSAIC?"
- "What kind of work do you do at the Sacred Heart Mission Op Shop?"`;
      }
      else if (query.includes("mdas") || query.includes("media") || query.includes("director") || query.includes("society") || query.includes("leadership") || query.includes("mosaic") || query.includes("volunteer") || query.includes("sacred")) {
        reply = `I hold key leadership and community roles that balance my technical build experience:
- Monash Data & AI Society (MDAS): Vice President since July 2026, after serving as Media & Marketing Officer (Oct 2025 - Jan 2026) and Media & Marketing Director (Jan - May 2026).
- Social Media Coordinator at MOSAIC (Monash Students for AI with Communities): I manage community social coordination and connect peers to AI volunteer programs and local projects.
- Volunteer at Sacred Heart Mission Op Shop: I conduct electrical safety compliance testing on donations, troubleshoot local IT network issues, and support cashier operations (50+ customer interactions per shift).

What would you like to ask next?
- "How do you balance your technical studies with MDAS leadership?"
- "What kind of AI volunteer programs does MOSAIC run?"
- "How has volunteering at Sacred Heart Mission shaped your soft skills?"`;
      } 
      else if (query.includes("monash") || query.includes("master") || query.includes("uni") || query.includes("education") || query.includes("study") || query.includes("grade")) {
        reply = `I am pursuing my Master of Artificial Intelligence at Monash University in Melbourne, Australia, with graduation set for July 2027. My studies focus on deep learning, reinforcement learning, natural language processing, and agentic workflows.

What would you like to ask next?
- "What coursework projects have you done at Monash?"
- "Why did you choose to focus on Artificial Intelligence?"
- "Are your academic builds open source?"`;
      }
      else if (query.includes("goal") || query.includes("career") || query.includes("future") || query.includes("aspiration")) {
        reply = `My career goal is to work as an AI Engineer, ML Engineer, Software Engineer, or Technology Consultant in high-growth environments like startups, scale-ups, and technology labs. I am passionate about deploying production-grade AI applications and optimizing data pipelines.

What would you like to ask next?
- "Are you open to relocating globally for the right role?"
- "What startups or industries interest you the most?"
- "How do you stay up-to-date with AI research?"`;
      }
      else if (
        query.includes("job") ||
        query.includes("hire") ||
        query.includes("hiring") ||
        query.includes("work") ||
        query.includes("position") ||
        query.includes("resume") ||
        query.includes("cv") ||
        query.includes("offer") ||
        query.includes("availability") ||
        query.includes("visa") ||
        query.includes("rights")
      ) {
        reply = `I am open to opportunities in AI Engineering, Machine Learning Engineering, Software Engineering and Technology Consulting. I graduate from Monash's Master of AI in July 2027. For details on timing or work arrangements, the best route is to email me directly.

What would you like to ask next?
- "Would you consider a part-time role or internship before July 2027?"
- "Do you have working rights in Australia?"
- "What is your primary contact method for job offers?"`;
      } 
      else if (query.includes("contact") || query.includes("email") || query.includes("reach") || query.includes("linkedin") || query.includes("github")) {
        reply = `You can reach me directly through these channels:
- Email: krishichheda10@gmail.com
- LinkedIn: linkedin.com/in/krishi-chheda
- GitHub: github.com/krishi-chheda

You can also use the contact form at the bottom of the page, which opens a pre-filled email.

What would you like to ask next?
- "Can we set up a short intro call?"
- "Can I download your resume?"
- "Where can I see the source code for your portfolio?"`;
      } 
      else if (query.includes("interest") || query.includes("f1") || query.includes("hobby") || query.includes("hobbies") || query.includes("fitness") || query.includes("personal")) {
        reply = `When I am not writing code or deploying models, I am a huge Formula 1 enthusiast (analyzing telemetry and race strategies) and dedicate my time to strength fitness training. These activities reinforce my focus, discipline, and love for telemetry-driven optimization.

What would you like to ask next?
- "How does Formula 1 telemetry intersect with your AI work?"
- "How do you balance engineering workloads and fitness?"
- "What is your favorite F1 team?"`;
      } 
      else {
        reply = `Hi! I am Krishi Chheda, an AI Engineer. Ask me anything about my Monash Master of AI studies, my leadership as Vice President of MDAS, or projects like ClinicalBrief, AccessVision, Traffic AI, and StudentHub.

What would you like to ask next?
- "Tell me about ClinicalBrief"
- "Are you open to full-time engineering roles?"
- "What is your role at MDAS?"`;
      }
    }

    let suggestedCommand = "";

    // 3. Extract command from LLM response if present
    if (reply) {
      const commandMatch = reply.match(/\[command:\s*(.*?)\]/);
      if (commandMatch) {
        suggestedCommand = commandMatch[1].trim();
        // Remove the command tag from the clean response text
        reply = reply.replace(/\[command:\s*.*?\]/g, "").trim();
      }
    }

    // 4. Fallback: match either the query or the reply text against a shared keyword table
    if (!suggestedCommand) {
      suggestedCommand = matchCommand(query);
    }
    if (!suggestedCommand && reply) {
      suggestedCommand = matchCommand(reply.toLowerCase());
    }

    return NextResponse.json({ reply, suggestedCommand });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
