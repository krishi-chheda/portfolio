"use client";

import { useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cpu, Terminal as TermIcon } from "lucide-react";
import { skillsCategories } from "@/lib/data";
import { useTerminalCommand } from "@/hooks/useTerminalCommand";
import CommandBar from "./CommandBar";
import SkillCard from "./SkillCard";

// TOML representations for syntax highlighting
const projectsToml = `[[project]]
id = "clinicalbrief"
title = "ClinicalBrief"
role = "Full-Stack AI Builder"
tech = ["Next.js", "FastAPI", "Python", "Whisper AI", "OpenAI SDK"]
metrics = [
  "Translates clinical terminology to 8th-grade level text",
  "Reduces clinical summary drafting time by ~70%",
  "Secures patient data with local metadata sanitization"
]

[[project]]
id = "studenthub"
title = "StudentHub Melbourne"
role = "Creator & Lead Developer"
tech = ["Next.js 15", "TypeScript", "Tailwind CSS", "Mapbox API"]
metrics = [
  "Built with direct input from 30+ international students",
  "Integrates transit guides & Melbourne housing verification lists"
]

[[project]]
id = "traffic-light"
title = "AI Traffic Light System"
role = "AI Research Lead"
tech = ["YOLO", "OpenCV", "Python", "Jetson Nano"]
metrics = [
  "Reduced average vehicle waiting time by approximately 42%",
  "Achieved low-latency vehicle detection using YOLO on Jetson Nano",
  "Optimized intersection queues dynamically based on lane density"
]

[[project]]
id = "accessible-vision"
title = "Accessible Vision"
role = "AI & Computer Vision Developer"
tech = ["Python", "Computer Vision", "YOLO", "AI Inference", "Real-Time Systems"]
metrics = [
  "Performs real-time scene understanding using YOLO object detection models",
  "Provides low-latency spoken guidance through audio feedback APIs",
  "Improves user safety by recognizing critical pathway obstacles"
]`;

const experienceToml = `[[study]]
degree = "Master of Artificial Intelligence"
institution = "Monash University"
location = "Melbourne, VIC, Australia"
period = "2024 - Present"
highlight = "Academic focus on practical AI deployment and agentic workflows"

[[leadership]]
role = "Media & Marketing Director"
organization = "Monash Data Analytics Society (MDAS)"
period = "2024 - Present"
highlight = "Led brand transformation increasing student involvement by 40%"

[[internship]]
role = "Software Engineering Intern"
organization = "Mysahayak"
period = "2023"
highlight = "Developed high-performance dashboard UI features reducing load shifts"`;

const leadershipToml = `# Monash Data Analytics Society (MDAS)

[mdas_leadership]
role = "Media & Marketing Director"
outreach_metrics = { growth_rate = "40%", engagement_increase = "high" }
campaigns = [
  "Winter Hackathon Marketing",
  "Technical Bootcamps Outreach",
  "Corporate Networking Branding"
]
responsibilities = [
  "Directing brand transformation across digital media",
  "Demystifying analytics concepts for student builders",
  "Co-organizing technical workshop series"
]`;

export default function SkillsSection() {
  const { activeCommand, typedText, isTyping, selectCommand } =
    useTerminalCommand("skills.toml");

  // TOML syntax highlighter helper
  const highlightToml = (toml: string) => {
    return toml.split("\n").map((line, idx) => {
      // 1. Comment
      if (line.trim().startsWith("#")) {
        return (
          <div key={idx} className="text-slate-650 min-h-[16px]">
            {line}
          </div>
        );
      }
      // 2. Sections
      if (line.trim().startsWith("[[")) {
        return (
          <div key={idx} className="text-orange-400 font-bold min-h-[16px]">
            {line}
          </div>
        );
      }
      if (line.trim().startsWith("[")) {
        return (
          <div key={idx} className="text-orange-400 font-bold min-h-[16px]">
            {line}
          </div>
        );
      }
      // 3. Properties
      if (line.includes("=")) {
        const parts = line.split("=");
        const key = parts[0];
        const val = parts.slice(1).join("=");

        // Simple highlight inside array values
        let highlightedVal = <span className="text-emerald-400">{val}</span>;
        if (val.trim().startsWith("[")) {
          highlightedVal = (
            <span className="text-slate-300">
              [
              <span className="text-emerald-400">
                {val.trim().slice(1, -1)}
              </span>
              ]
            </span>
          );
        }

        return (
          <div key={idx} className="min-h-[16px]">
            <span className="text-purple-400">{key}</span>
            <span className="text-slate-500">=</span>
            {highlightedVal}
          </div>
        );
      }
      return (
        <div key={idx} className="text-slate-350 min-h-[16px]">
          {line}
        </div>
      );
    });
  };

  const tomlContent = useMemo(() => {
    if (activeCommand === "projects.toml") return projectsToml;
    if (activeCommand === "experience.toml") return experienceToml;
    if (activeCommand === "leadership.toml") return leadershipToml;
    return "";
  }, [activeCommand]);

  return (
    <section id="skills" className="py-24 relative overflow-hidden border-t border-slate-900/60 select-none">
      <div className="max-w-6xl mx-auto px-6">
        {/* Section Header CLI Prompt */}
        <div className="font-mono text-xs md:text-sm text-slate-500 mb-8 flex items-center space-x-2 select-none">
          <span className="text-[#10b981]">krishi@stack:~$</span>
          <span className="text-slate-100">cat skills.conf</span>
        </div>

        {/* Terminal Container */}
        <div className="w-full glass-panel rounded-xl overflow-hidden border border-slate-800/80 shadow-2xl flex flex-col min-h-[480px]">
          {/* Header Command Bar */}
          <CommandBar
            activeCommand={activeCommand}
            onSelectCommand={selectCommand}
            typedText={typedText}
            isTyping={isTyping}
          />

          {/* Viewport content */}
          <div className="flex-1 p-6 md:p-8 font-mono bg-slate-950/40 min-h-[380px] overflow-x-auto">
            <AnimatePresence mode="wait">
              {isTyping ? (
                // Simulated loader during terminal typing
                <motion.div
                  key="typing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex items-center justify-center text-xs text-slate-500"
                >
                  <div className="flex items-center space-x-2">
                    <span className="w-3.5 h-3.5 border border-cyan-455 border-t-transparent animate-spin rounded-full" />
                    <span>executing file stream read...</span>
                  </div>
                </motion.div>
              ) : (
                // Core layout renders
                <motion.div
                  key={activeCommand}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.25 }}
                  className="h-full"
                >
                  {activeCommand === "skills.toml" ? (
                    /* Skills categories 4-column cards grid */
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                      {skillsCategories.map((category, index) => (
                        <SkillCard
                          key={category.id}
                          category={category}
                          index={index}
                        />
                      ))}
                    </div>
                  ) : (
                    /* General TOML display layouts */
                    <pre className="text-xs leading-relaxed max-w-full overflow-x-auto whitespace-pre-wrap select-text selection:bg-cyan-500/20 selection:text-cyan-200">
                      <code>{highlightToml(tomlContent)}</code>
                    </pre>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
