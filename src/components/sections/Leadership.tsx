"use client";

import { motion } from "framer-motion";
import { Award, Users, Megaphone, Calendar, Users2, Shield, Sparkles } from "lucide-react";
import Card from "../ui/Card";

export default function Leadership() {
  const leadershipCards = [
    {
      title: "Event Strategy",
      icon: <Calendar className="w-5 h-5 text-purple-400" />,
      description: "Co-designing marketing campaigns and structural logistics for corporate networking nights, industry panels, and winter hackathons with 100+ attendees."
    },
    {
      title: "Community Building",
      icon: <Users className="w-5 h-5 text-purple-400" />,
      description: "Fostering active student developer networks and society growth. Boosted overall MDAS digital channel metrics and member registration counts by 40%."
    },
    {
      title: "Team Leadership",
      icon: <Users2 className="w-5 h-5 text-purple-400" />,
      description: "Directing cross-functional squads of visual designers, copywriters, and developers to coordinate and deploy branding packages and web landing pages."
    }
  ];

  return (
    <section id="leadership" className="py-24 relative overflow-hidden border-t border-slate-900/60 select-none">
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Section Header CLI Prompt */}
        <div className="font-mono text-xs md:text-sm text-slate-500 mb-8 flex items-center space-x-2 select-none">
          <span className="text-[#10b981]">krishi@stack:~$</span>
          <span className="text-slate-100">cat leadership.md</span>
        </div>

        {/* OS Terminal Shell Window */}
        <div className="w-full border border-slate-900 bg-slate-950/20 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono">
          
          {/* Title Bar */}
          <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-900 flex justify-between items-center select-none text-[10px] text-slate-500">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/40 border border-red-500/20" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/40 border border-yellow-500/20" />
              <span className="w-2 h-2 rounded-full bg-green-500/40 border border-green-500/20" />
            </div>
            <span>leadership.md // system_contributions</span>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span>markdown</span>
            </div>
          </div>

          {/* Window Body */}
          <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: MDAS Primary Role */}
            <div className="lg:col-span-5 space-y-6 select-text">
              <div className="border border-slate-900 bg-slate-950/40 p-5 rounded-lg space-y-4">
                <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest px-2 py-0.5 rounded bg-purple-950/30 border border-purple-900/40">
                  [DIRECTOR_ROLE]
                </span>
                
                <div>
                  <h3 className="text-base md:text-lg font-bold text-white uppercase tracking-tight">
                    Media & Marketing Director
                  </h3>
                  <p className="text-[10px] text-slate-500 mt-1 uppercase">
                    Monash Data Analytics Society (MDAS) • 2024 - Present
                  </p>
                </div>

                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                  Leading visual branding, content publication, and campus-wide campaigns for the largest specialized data society at Monash. I supervise outreach schedules, coordinate designer pipelines, and publish educational technical posts designed to bridge the gap between student builders and leading tech organizations.
                </p>

                <div className="bg-purple-950/10 border border-purple-900/30 p-3 rounded text-[11px] text-purple-400 flex items-start gap-2">
                  <Sparkles className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                  <span>Grew MDAS digital interaction metrics and event sign-ups by 40%.</span>
                </div>

                <div className="flex flex-wrap gap-1.5 pt-1">
                  {["Campaign Strategy", "Outreach", "Visual Branding", "Event Coordination"].map((tag) => (
                    <span
                      key={tag}
                      className="text-[9px] px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Column: Pillars list */}
            <div className="lg:col-span-7 space-y-4 select-text">
              {leadershipCards.map((card, idx) => (
                <motion.div
                  key={card.title}
                  initial={{ opacity: 0, x: 15 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: idx * 0.1 }}
                  className="border border-slate-900 bg-slate-950/40 p-5 rounded-lg flex items-start gap-4"
                >
                  <div className="p-2 rounded bg-slate-900 border border-slate-800 shrink-0 select-none">
                    {card.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="text-xs font-bold text-white uppercase tracking-wider">
                      [PILLAR: {card.title.toUpperCase()}]
                    </h4>
                    <p className="text-[11px] text-slate-400 leading-relaxed font-sans">
                      {card.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}
