"use client";

import Link from "next/link";
import { ArrowLeft, Clock, Zap, Target, BookOpen, Smile } from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Card from "@/components/ui/Card";
import { useTerminalReveal } from "@/hooks/useTerminalReveal";

const h2 = "text-sm font-normal uppercase tracking-[0.18em] text-ink flex items-center gap-2 mb-3";
const icon = "w-4 h-4 text-accent";
const link = "text-accent hover:text-accent-2 underline decoration-dotted underline-offset-2 transition-colors duration-150";

export default function NowPage() {
  const revealRef = useTerminalReveal<HTMLElement>();
  return (
    <>
      <Navbar />
      <main ref={revealRef} className="relative flex-1 pt-32 pb-16 overflow-hidden font-mono">
        <div className="max-w-3xl mx-auto px-6 w-full relative z-10">
          {/* Back Nav */}
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-[11px] uppercase tracking-[0.18em] text-ink-faint hover:text-accent transition-colors duration-150 mb-8 group"
          >
            <ArrowLeft className="w-3.5 h-3.5 group-hover:-translate-x-1 transition-transform" />
            <span>Return to Terminal</span>
          </Link>

          {/* Page Title */}
          <div data-reveal="panel" className="space-y-4 mb-12 border-b border-rule pb-8">
            <div className="inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-ink-faint">
              <Clock className="w-3 h-3 text-accent" />
              <span>LAST UPDATED: JUNE 2026</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-ink tracking-tight">
              What I&apos;m Doing Now
            </h1>
            <p className="text-ink-soft text-sm">
              This is a &ldquo;now&rdquo; page inspired by Derek Sivers, documenting my current focus areas, hobbies, and goals.
            </p>
          </div>

          {/* Now Grid items */}
          <div className="space-y-6">
            {/* Engineering & Academics */}
            <Card data-reveal="item">
              <h2 className={h2}>
                <Zap className={icon} />
                Academics & Builders Mode
              </h2>
              <p className="text-ink-soft text-sm leading-relaxed">
                Currently studying for my <strong className="font-semibold text-ink">Master of Artificial Intelligence at Monash University</strong>.
                I am dedicating coding hours to{" "}
                <a href="https://github.com/krishi-chheda/clinicalbrief" target="_blank" rel="noopener noreferrer" className={link}>ClinicalBrief</a>,
                a clinical intelligence research prototype built around provenance, human review of AI findings and a grounded local-LLM copilot.
              </p>
            </Card>

            {/* MDAS Activities */}
            <Card data-reveal="item">
              <h2 className={h2}>
                <Target className={icon} />
                MDAS Leadership
              </h2>
              <p className="text-ink-soft text-sm leading-relaxed">
                I am <strong className="font-semibold text-ink">Vice President of the Monash Data &amp; AI Society (MDAS)</strong>, after serving as Media &amp; Marketing Officer and then Media &amp; Marketing Director.
              </p>
            </Card>

            {/* personal interests */}
            <Card data-reveal="item">
              <h2 className={h2}>
                <Smile className={icon} />
                Melbourne Living & Interests
              </h2>
              <div className="text-ink-soft text-sm leading-relaxed space-y-2">
                <p>
                  <strong className="font-semibold text-ink">Formula 1:</strong> Tracking the current championship calendar. Analyzing telemetry and race dynamics (and hoping to catch another live GP paddock session soon).
                </p>
                <p>
                  <strong className="font-semibold text-ink">Fitness & Lifting:</strong> Consistently executing 4 strength sessions a week at the gym to balance the desk hours.
                </p>
                <p>
                  <strong className="font-semibold text-ink">Street Photography:</strong> Taking my camera out on weekend mornings. Capturing the raw geometric alleys of Melbourne CBD and the coastal light along the Great Ocean Road.
                </p>
              </div>
            </Card>

            {/* Currently Reading */}
            <Card data-reveal="item">
              <h2 className={h2}>
                <BookOpen className={icon} />
                Current Inputs
              </h2>
              <ul className="text-ink-soft text-sm space-y-2">
                <li className="flex items-center gap-2">
                  <span className="text-accent">[book]</span>
                  <span>Designing Machine Learning Systems by Chip Huyen</span>
                </li>
                <li className="flex items-center gap-2">
                  <span className="text-accent">[audio]</span>
                  <span>The Lex Fridman Podcast (AI developments & deep conversations)</span>
                </li>
              </ul>
            </Card>
          </div>
        </div>

      </main>
      <Footer />
    </>
  );
}
