import { NextResponse } from "next/server";
import { aiKnowledgeBase } from "@/lib/data";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 });
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
                )}. Always structure your response to highlight why I should be hired. After every single response, you must append a set of exactly 3 relevant, contextual follow-up questions that the recruiter or founder might want to ask next. Format these questions as bullet points under a 'What would you like to ask next?' header. If asked about things not in the facts, politely state you don't have that detail and suggest emailing me at krishichheda10@gmail.com.`,
              },
              { role: "user", content: message },
            ],
            temperature: 0.7,
          }),
        });
        const data = await response.json();
        reply = data.choices[0].message.content;
      } catch (err) {
        console.error("OpenAI request failed, falling back to local engine:", err);
      }
    }

    // 2. Local High-Agency Conversational Search Engine (Robust Fallback)
    if (!reply) {
      if (query.includes("clinical") || query.includes("brief") || query.includes("belief")) {
        const proj = aiKnowledgeBase.projects.find((p) => p.id === "clinicalbrief");
        reply = `I built ClinicalBrief to solve a major bottleneck for healthcare providers: the hours lost transcribing and formatting consultation audio into structured records. It's a secure clinical intelligence platform that transcribes multi-speaker dictations and parses them into action-ready summaries.

Key details:
- Stack: Next.js, FastAPI, Python, and LLM Applications (GPT-4o/Whisper).
- Status: Active development (optimizing audio diarization and speaker separation).
- Verified Outcomes: ${proj?.overview.solution} • ${proj?.impact.achievements[0]} • ${proj?.impact.achievements[1]}.

What would you like to ask next?
- "How does ClinicalBrief handle secure patient record sanitization?"
- "Why did you choose FastAPI for the backend?"
- "Is the codebase open source?"`;
      } 
      else if (query.includes("student") || query.includes("hub") || query.includes("studenthub")) {
        const proj = aiKnowledgeBase.projects.find((p) => p.id === "studenthub");
        reply = `I built StudentHub as a community portal consolidated checklist resource for Melbourne international students. It coordinates housing lists, student events, discussions, and marketplaces.

Key details:
- Stack: Next.js, Flutter, and Firebase.
- Status: Completed.
- Verified Outcomes: ${proj?.impact.achievements[0]} • ${proj?.impact.achievements[1]} • Sub-second data sync sync listener updates.

What would you like to ask next?
- "Tell me about your IT intern role at Mysahayak developing StudentHub."
- "What databases does StudentHub leverage for real-time updates?"
- "Is the platform optimized for responsive mobile layout?"`;
      } 
      else if (query.includes("traffic") || query.includes("light") || query.includes("rl") || query.includes("sumo") || query.includes("congestion")) {
        const proj = aiKnowledgeBase.projects.find((p) => p.id === "traffic-ai");
        reply = `I developed Traffic AI to optimize traffic congestion at intersections. It uses live computer vision processing on video streams to track lane queue density and adapt signal timings dynamically.

Key details:
- Stack: YOLO, OpenCV, Python, and NVIDIA Jetson Nano edge hardware.
- Status: Simulation validated; hardware logic tested on Jetson Nano edge nodes.
- Verified Outcomes: Achieved a verified 42% reduction in intersection waiting times in simulated intersection models.

What would you like to ask next?
- "How did you optimize YOLO on the Jetson Nano?"
- "How was the 42% waiting time reduction verified?"
- "Can I view the computer vision pipeline code?"`;
      } 
      else if (query.includes("accessible") || query.includes("vision") || query.includes("assistive") || query.includes("guidance") || query.includes("visually")) {
        const proj = aiKnowledgeBase.projects.find((p) => p.id === "accessible-vision");
        reply = `I created Accessible Vision to assist visually impaired individuals in navigating environments safely. It maps environmental paths and detects hazards in real-time, providing immediate spoken audio feedback.

Key details:
- Stack: FastAPI, Next.js, YOLOv8, BLIP, Docker, and Hugging Face.
- Status: Active development (optimizing spatial hazard orientation models).
- Verified Outcomes: Reduced YOLO inference latency by 92% (from 8.4s to 668ms under concurrent load testing) with grounded reasoning pipelines.

What would you like to ask next?
- "How did you achieve a 92% inference latency reduction?"
- "How did you integrate YOLOv8 and BLIP?"
- "How does the real-time spoken guidance system function?"`;
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
- Monash Data & AI Society (Media & Marketing Director, 2024 - Present): Managing branding and growing technical workshop reach to 300+ students.
- MOSAIC (Social Media Coordinator, 2025 - Present): Managing community social coordination and event promotion for Monash Students for AI with Communities.
- Sacred Heart Mission Op Shop (Volunteer, 2026 - Present): Conducting electrical compliance testing and troubleshooting IT network issues.

What would you like to ask next?
- "What did you accomplish during your internship at Mysahayak?"
- "What is your role at MOSAIC?"
- "What kind of work do you do at the Sacred Heart Mission Op Shop?"`;
      }
      else if (query.includes("mdas") || query.includes("media") || query.includes("director") || query.includes("society") || query.includes("leadership") || query.includes("mosaic") || query.includes("volunteer") || query.includes("sacred")) {
        reply = `I hold key leadership and community roles that balance my technical build experience:
- Media & Marketing Director at Monash Data & AI Society (MDAS): I lead branding strategies, manage engagement metrics, and coordinate events, growing workshop reach to 300+ students across 5+ events.
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
        reply = `My career goal is to work as an AI Engineer, ML Engineer, or Software/Founding Engineer in high-agency environments like startups, scale-ups, and AI research labs. I am passionate about bridging the gap between raw ML research and highly-usable, production-grade software applications.

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
        reply = `I am actively seeking opportunities starting after my graduation in July 2027. I am targeted at AI Engineering, ML Engineering, and Software Engineering roles in Melbourne, Sydney, or remote. I hold standard student visa working rights in Australia and am open to sponsorship/global relocation.

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

I usually respond to email and LinkedIn messages within 24 hours. You can also use the contact form at the bottom of the page!

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
        reply = `Hi! I am Krishi Chheda, an AI Engineer. Ask me anything about my Monash Master of AI studies, my leadership as MDAS Media & Marketing Director, or projects like ClinicalBrief, Accessible Vision, Traffic AI, and StudentHub.

What would you like to ask next?
- "Tell me about ClinicalBrief"
- "Are you open to full-time engineering roles?"
- "What is your role at MDAS?"`;
      }
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
