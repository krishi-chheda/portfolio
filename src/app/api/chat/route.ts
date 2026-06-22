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
      // In a real environment with keys, we can call OpenAI Chat Completion here
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
                content: `You are Krishi's AI Assistant. Your goal is to represent Krishi Chheda, an AI Engineer based in Melbourne. You must stay professional, answer using these facts: ${JSON.stringify(
                  aiKnowledgeBase
                )}. If asked about things not in the facts, politely say you don't have that detail and suggest contacting Krishi.`,
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
        reply = `ClinicalBrief is Krishi's featured AI platform for healthcare. It processes clinical documents and consultation audio to generate structured medical insights.\n\nKey details:\n- Built using Next.js, FastAPI, Python, and LLM Applications.\n- Highlights: ${proj?.metrics[0]} • ${proj?.metrics[1]}. \n- Codebase is available on GitHub.`;
      }
      else if (query.includes("student") || query.includes("hub") || query.includes("studenthub")) {
        const proj = aiKnowledgeBase.projects.find((p) => p.id === "studenthub");
        reply = `StudentHub Melbourne is an active student resource platform built to support international student arrivals in Victoria.\n\nKey metrics:\n- ${proj?.metrics[0]}\n- Tech: Next.js, TypeScript, APIs, and Product Design.`;
      }
      else if (query.includes("traffic") || query.includes("light") || query.includes("rl") || query.includes("sumo")) {
        const proj = aiKnowledgeBase.projects.find((p) => p.id === "traffic-ai");
        reply = `Traffic AI is an intelligent traffic management system that uses computer vision to dynamically optimize signal counts in real-time.\n\nResult:\n- ${proj?.metrics[0]}\n- Tech: YOLO, OpenCV, Python, and NVIDIA Jetson Nano.`;
      }
      else if (query.includes("accessible") || query.includes("vision") || query.includes("assistive") || query.includes("guidance")) {
        const proj = aiKnowledgeBase.projects.find((p) => p.id === "accessible-vision");
        reply = `Accessible Vision is an AI-powered accessibility platform helping visually impaired users understand and navigate environments through computer vision and audio guidance.\n\nKey details:\n- Tech: Computer Vision, YOLO, Python, and Real-Time AI. \n- Features: Real-time scene understanding, obstacle warnings, and spoken audio cues.`;
      }
      else if (query.includes("mdas") || query.includes("media") || query.includes("director") || query.includes("society")) {
        reply = `Krishi serves as the Media & Marketing Director at Monash Data & AI Society (MDAS). He managed a rebrand that grew digital engagement by 40% and coordinates career events and coding bootcamps for student builders.`;
      }
      else if (query.includes("monash") || query.includes("master") || query.includes("uni") || query.includes("education") || query.includes("study") || query.includes("grade")) {
        reply = `Krishi is pursuing a Master of Artificial Intelligence at Monash University in Melbourne (graduating in July 2027). His academic focus centers on deep learning, reinforcement learning, NLP, and agentic pipelines.`;
      }
      else if (
        query.includes("job") ||
        query.includes("hire") ||
        query.includes("hiring") ||
        query.includes("work") ||
        query.includes("position") ||
        query.includes("resume") ||
        query.includes("cv") ||
        query.includes("offer")
      ) {
        reply = `Krishi is actively seeking opportunities in Australia (or remote) starting post-graduation in July 2027. He is aiming for AI Engineering, Machine Learning Engineering, Software Engineering, AI Product, or Technology Consulting roles.\n\nYou can access his career timeline directly in the ./career section on the website or contact him at krishichheda10@gmail.com to discuss role details.`;
      }
      else if (query.includes("contact") || query.includes("email") || query.includes("reach") || query.includes("linkedin")) {
        reply = `You can reach Krishi directly:\n- Email: krishichheda10@gmail.com\n- LinkedIn: linkedin.com/in/krishi-chheda\n- GitHub: github.com/krishi-chheda\n\nYou can also drop a message through the contact form on the home page!`;
      }
      else if (query.includes("interest") || query.includes("f1") || query.includes("hobby") || query.includes("hobbies") || query.includes("fitness")) {
        reply = `When not building AI systems, Krishi is a Formula 1 enthusiast and is dedicated to strength fitness lifting.`;
      }
      else {
        reply = `Hi! I'm Krishi's AI Assistant. Ask me anything about his Monash Master of AI research, MDAS marketing leadership, or projects like ClinicalBrief, Accessible Vision, Traffic AI, and StudentHub.\n\nQuick suggestions:\n- "Tell me about ClinicalBrief"\n- "Is Krishi open to full-time engineering roles?"\n- "What is his role at MDAS?"`;
      }
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
