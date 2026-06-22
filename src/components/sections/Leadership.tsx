"use client";

import { motion } from "framer-motion";
import { Users, Megaphone, Calendar, Users2, Sparkles, Heart } from "lucide-react";

export default function Leadership() {
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
          <div className="p-6 md:p-10 space-y-8">
            
            {/* Leadership Overview Statement */}
            <div className="border border-slate-900 bg-slate-950/40 p-5 rounded-lg select-text">
              <h2 className="text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
                <span className="text-purple-400">Can Krishi lead?</span>
              </h2>
              <p className="mt-2 text-slate-400 text-xs md:text-sm leading-relaxed font-sans">
                Yes. I drive growth in student organizations by leading cross-functional teams, structuring event marketing campaigns, and building developer networks. I coordinate campaign schedules and lead design pipelines to translate community needs into successful events.
              </p>
            </div>

            {/* Side-by-Side Roles layout */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
              
              {/* Left Side: MDAS Column */}
              <motionFramer.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="lg:col-span-6 border border-slate-900 bg-slate-950/40 p-6 rounded-lg flex flex-col justify-between space-y-4 select-text"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-purple-400 uppercase tracking-widest px-2 py-0.5 rounded bg-purple-950/30 border border-purple-900/40">
                      [DIRECTORSHIP]
                    </span>
                    <span className="text-[10px] text-slate-500">2024 - PRESENT</span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white uppercase tracking-tight">
                      Monash Data & AI Society (MDAS)
                    </h3>
                    <p className="text-[11px] text-purple-400 mt-0.5 font-semibold">
                      Media & Marketing Director
                    </p>
                  </div>

                  <div className="space-y-2 font-sans text-[11.5px] text-slate-400 leading-relaxed pt-1">
                    <div className="flex gap-2">
                      <Megaphone className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span><strong>Marketing Leadership:</strong> Leading visual branding, content publication, and digital campaign schedules for the largest specialized data student society at Monash.</span>
                    </div>
                    <div className="flex gap-2">
                      <Calendar className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span><strong>Event Strategy:</strong> Co-designed promotions and logical coordination for developer bootcamps, winter hackathons, and corporate networking nights.</span>
                    </div>
                    <div className="flex gap-2">
                      <Users2 className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
                      <span><strong>Cross-Functional Collaboration:</strong> Managing pipelines of copywriters, designers, and web developers to build and distribute marketing assets.</span>
                    </div>
                  </div>
                </div>

                <div className="bg-purple-950/15 border border-purple-900/30 p-3.5 rounded text-[11px] text-purple-400 flex items-start gap-2.5 font-sans mt-2">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                  <span><strong>Outcome:</strong> Grew AI workshop reach to 300+ students across 5+ events and boosted overall digital interaction metrics by 40%.</span>
                </div>
              </motionFramer.div>

              {/* Right Side: MOSAIC Column */}
              <motionFramer.div
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-6 border border-slate-900 bg-slate-950/40 p-6 rounded-lg flex flex-col justify-between space-y-4 select-text"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-teal-400 uppercase tracking-widest px-2 py-0.5 rounded bg-teal-950/30 border border-teal-900/40">
                      [COMMUNITY_LEAD]
                    </span>
                    <span className="text-[10px] text-slate-500">2025 - PRESENT</span>
                  </div>

                  <div>
                    <h3 className="text-base font-bold text-white uppercase tracking-tight">
                      MOSAIC
                    </h3>
                    <p className="text-[11px] text-teal-400 mt-0.5 font-semibold">
                      Social Media Coordinator
                    </p>
                  </div>

                  <div className="space-y-2 font-sans text-[11.5px] text-slate-400 leading-relaxed pt-1">
                    <div className="flex gap-2">
                      <Users className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span><strong>Community Building:</strong> Fostering active peer support systems and volunteer developer networks around community AI projects.</span>
                    </div>
                    <div className="flex gap-2">
                      <Heart className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span><strong>Student Engagement:</strong> Coordinating cross-campus outreach campaigns connecting peers to AI volunteer programs and local community projects.</span>
                    </div>
                    <div className="flex gap-2">
                      <Users2 className="w-4 h-4 text-teal-400 shrink-0 mt-0.5" />
                      <span><strong>Cross-Functional Collaboration:</strong> Aligning students, university representatives, and non-profits to support monthly social coordination initiatives.</span>
                    </div>
                  </div>
                </div>

                <div className="bg-teal-950/15 border border-teal-900/30 p-3.5 rounded text-[11px] text-teal-400 flex items-start gap-2.5 font-sans mt-2">
                  <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
                  <span><strong>Outcome:</strong> Connected peers to local community volunteer initiatives and increased student participation in volunteering projects.</span>
                </div>
              </motionFramer.div>

            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

// Wrapper alias for Framer Motion to prevent dynamic name conflict in compilation
const motionFramer = motion;
