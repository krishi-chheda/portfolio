"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Zap, Target, BookOpen, Smile } from "lucide-react";
import GridBackground from "@/components/ui/GridBackground";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";

export default function NowPage() {
  return (
    <>
      <Navbar />
      <main className="relative min-h-screen pt-32 pb-16 flex flex-col justify-between overflow-hidden">
        {/* Background visual grid */}
        <GridBackground />

        <div className="max-w-3xl mx-auto px-6 w-full relative z-10">
          {/* Back Nav */}
          <Link
            href="/"
            className="inline-flex items-center space-x-1 text-xs font-mono text-slate-500 hover:text-cyan-400 transition-colors mb-8 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Terminal</span>
          </Link>

          {/* Page Title */}
          <div className="space-y-4 mb-12">
            <div className="inline-flex items-center space-x-2 bg-slate-900/60 border border-slate-800/80 px-3 py-1 rounded-full text-[10px] font-mono text-slate-400">
              <Clock className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>LAST UPDATED: JUNE 2026</span>
            </div>
            <h1 className="text-4xl font-heading font-extrabold text-white">
              What I&apos;m Doing Now
            </h1>
            <p className="text-slate-400 text-sm md:text-base font-mono">
              This is a &ldquo;now&rdquo; page inspired by Derek Sivers, documenting my current focus areas, hobbies, and goals.
            </p>
          </div>

          {/* Now Grid items */}
          <div className="space-y-8">
            {/* Engineering & Academics */}
            <Card className="border-cyan-500/10">
              <h2 className="text-lg font-heading font-extrabold text-white flex items-center gap-2 mb-3">
                <Zap className="w-5 h-5 text-cyan-400" />
                Academics & Builders Mode
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                Currently wrapping up complex units in my **Master of Artificial Intelligence at Monash University**. 
                My current focus is building robust agentic systems. I am dedicating coding hours to refining [ClinicalBrief](file:///C:/Users/krish/OneDrive/Desktop/Python/ClinicalBelief)&mdash;specifically optimizing the speaker diarization pipeline to support simultaneous clinical speakers and adding low-latency transcription stream buffers.
              </p>
            </Card>

            {/* MDAS Activities */}
            <Card>
              <h2 className="text-lg font-heading font-extrabold text-white flex items-center gap-2 mb-3">
                <Target className="w-5 h-5 text-purple-400" />
                MDAS Leadership
              </h2>
              <p className="text-slate-300 text-sm leading-relaxed">
                As the **Media & Marketing Director at MDAS**, we are preparing our winter hackathon cycle and corporate engagement sessions. I am redesigning our media design system to increase interactive web visibility for Monash student projects, aiming for maximum student attendance at our upcoming technical bootcamps.
              </p>
            </Card>

            {/* personal interests */}
            <Card>
              <h2 className="text-lg font-heading font-extrabold text-white flex items-center gap-2 mb-3">
                <Smile className="w-5 h-5 text-emerald-400" />
                Melbourne Living & Interests
              </h2>
              <div className="text-slate-300 text-sm space-y-2">
                <p>
                  <strong>Formula 1:</strong> Tracking the current championship calendar. Analyzing telemetry and race dynamics (and hoping to catch another live GP paddock session soon).
                </p>
                <p>
                  <strong>Fitness & Lifting:</strong> Consistently executing 4 strength sessions a week at the gym to balance the desk hours.
                </p>
                <p>
                  <strong>Street Photography:</strong> Taking my camera out on weekend mornings. Capturing the raw geometric alleys of Melbourne CBD and the coastal light along the Great Ocean Road.
                </p>
              </div>
            </Card>

            {/* Currently Reading */}
            <Card>
              <h2 className="text-lg font-heading font-extrabold text-white flex items-center gap-2 mb-3">
                <BookOpen className="w-5 h-5 text-yellow-400" />
                Current Inputs
              </h2>
              <ul className="text-slate-300 text-sm space-y-2 font-mono text-[13px]">
                <li className="flex items-center gap-2">
                  <span className="text-cyan-500">📖</span>
                  <span>Designing Machine Learning Systems by Chip Huyen</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-cyan-500">🎧</span>
                  <span>The Lex Fridman Podcast (AI developments & deep conversations)</span>
                </li>
              </ul>
            </Card>
          </div>

        </div>

        <Footer />
      </main>
    </>
  );
}
