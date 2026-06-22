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
        reply = `ClinicalBrief is Krishi's featured AI project. It transcribes clinician-patient consultations using Whisper AI and summarizes them into patient-friendly briefs. \n\nKey details:\n- Built using Next.js and FastAPI.\n- Highlight: ${proj?.metrics[0]} • ${proj?.metrics[1]}. \n- Codebase is available on Github.`;
      } 
      else if (query.includes("student") || query.includes("hub") || query.includes("studenthub")) {
        const proj = aiKnowledgeBase.projects.find((p) => p.id === "studenthub");
        reply = `StudentHub Melbourne is an international student guide platform Krishi built. It helps new arrivals navigate housing listings and transport routes.\n\nKey metrics:\n- ${proj?.metrics[0]}\n- Tech: ${proj?.techStack.join(", ")}.`;
      } 
      else if (query.includes("traffic") || query.includes("light") || query.includes("rl") || query.includes("sumo")) {
        const proj = aiKnowledgeBase.projects.find((p) => p.id === "traffic-light");
        reply = `The AI Traffic Light System is a reinforcement learning project. Krishi used computer vision (OpenCV) to count cars and a Deep Q-Network (PyTorch) to dynamically schedule signal lights.\n\nResult:\n- ${proj?.metrics[0]}\n- Accuracy: ${proj?.metrics[1]}.`;
      } 
      else if (query.includes("emotion") || query.includes("face") || query.includes("expression") || query.includes("cnn")) {
        const proj = aiKnowledgeBase.projects.find((p) => p.id === "emotion-detection");
        reply = `Krishi built a real-time CNN-based emotion classifier optimized for low-latency inference.\n\nPerformance:\n- ${proj?.metrics[0]}\n- Model: PyTorch CNN on FER2013 dataset.`;
      } 
      else if (query.includes("mdas") || query.includes("media") || query.includes("director") || query.includes("society")) {
        reply = `Krishi serves as the Media & Marketing Director at Monash Data Analytics Society (MDAS). He managed a rebrand that grew digital engagement by 40% and coordinates career events and coding bootcamps for student builders.`;
      } 
      else if (query.includes("monash") || query.includes("master") || query.includes("uni") || query.includes("education") || query.includes("study") || query.includes("grade")) {
        reply = `Krishi is pursuing a Master of Artificial Intelligence at Monash University in Melbourne. His academic focus centers on deep learning, reinforcement learning, NLP, and agentic pipelines.`;
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
        reply = `Krishi is actively seeking opportunities in Australia (or remote) starting post-graduation. He is aiming for AI Engineer, Founding Software Engineer, or Full-Stack developer roles.\n\nYou can download his resume directly from the navigation bar or contact him at krishi.chheda@outlook.com to discuss role details.`;
      } 
      else if (query.includes("contact") || query.includes("email") || query.includes("reach") || query.includes("linkedin")) {
        reply = `You can reach Krishi directly:\n- Email: krishi.chheda@outlook.com\n- LinkedIn: linkedin.com/in/krishichheda\n- GitHub: github.com/krishichheda\n\nYou can also drop a message through the contact form on the home page!`;
      } 
      else if (query.includes("photo") || query.includes("camera") || query.includes("interest") || query.includes("f1") || query.includes("hobby")) {
        reply = `When not building AI products, Krishi is an avid street photographer (capturing Melbourne CBD streets and Tasmanian travels), a Formula 1 enthusiast, and dedicated to strength fitness lifting.`;
      } 
      else {
        reply = `Hi! I'm Krishi's AI Assistant. Ask me anything about his Monash Master of AI research, MDAS marketing leadership, or projects like ClinicalBrief and StudentHub Melbourne.\n\nQuick suggestions:\n- "Tell me about ClinicalBrief"\n- "Is Krishi open to full-time engineering roles?"\n- "What is his role at MDAS?"`;
      }
    }

    return NextResponse.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
