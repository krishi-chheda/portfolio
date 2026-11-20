import { RetroSection } from "@/components/classic/Sections";
import RetroShell from "@/components/retro/RetroShell";
import { LABEL } from "@/components/retro/styles";
import { ownerProfile } from "@/lib/data";

const link = "text-[#285943] underline";
// The same "Fitness & lifting" wording as Ask Krishi and KRISHI.WORLD
const FITNESS = ownerProfile.hobbies.find((h) => h.toLowerCase().startsWith("fitness")) ?? "Fitness";

export default function NowPage() {
  return (
    <RetroShell subtitle="NOW">
      <main className="mx-auto max-w-3xl space-y-8 px-4 py-8 text-lg leading-relaxed sm:px-6 lg:py-12">
        <header className="border-4 border-[#46382b] bg-[#285943] p-5 text-[#f5e8c8] shadow-[6px_6px_0_#46382b]">
          <p className="text-sm tracking-widest text-[#f5c65b]">LAST UPDATED: JUNE 2026</p>
          <h1 className="mt-2 text-3xl sm:text-4xl">What I&apos;m Doing Now</h1>
          <p className="mt-2 text-base">This is a &ldquo;now&rdquo; page inspired by Derek Sivers, documenting my current focus areas, hobbies, and goals.</p>
        </header>

        <RetroSection id="academics" title="ACADEMICS & BUILDING">
          <p>
            Currently studying for my <strong>Master of Artificial Intelligence at Monash University</strong>. I am dedicating coding hours to{" "}
            <a href="https://github.com/krishi-chheda/clinicalbrief" target="_blank" rel="noopener noreferrer" className={link}>
              ClinicalBrief
            </a>
            , a clinical intelligence research prototype built around provenance, human review of AI findings and a grounded local-LLM copilot.
          </p>
        </RetroSection>

        <RetroSection id="mdas" title="MDAS LEADERSHIP">
          <p>
            I am <strong>Vice President of the Monash Data &amp; AI Society (MDAS)</strong>, after serving as Media &amp; Marketing Officer and then Media &amp; Marketing Director.
          </p>
        </RetroSection>

        <RetroSection id="interests" title="MELBOURNE LIVING & INTERESTS">
          <div className="space-y-3">
            <p>
              <strong>Formula 1:</strong> Tracking the current championship calendar. Analyzing telemetry and race dynamics (and hoping to catch another live GP paddock session soon).
            </p>
            {/* Owner-confirmed hobby (data.ts ownerProfile.hobbies); no routine details until Krishi supplies them */}
            <p>
              <strong>{FITNESS}:</strong> Lifting and staying fit, alongside yoga and aerial yoga.
            </p>
            <p>
              <strong>Street Photography:</strong> Taking my camera out on weekend mornings. Capturing the raw geometric alleys of Melbourne CBD and the coastal light along the Great Ocean Road.
            </p>
          </div>
        </RetroSection>

        <RetroSection id="inputs" title="CURRENT INPUTS">
          <ul className="space-y-2">
            <li>
              <span className={LABEL}>Book · </span>Designing Machine Learning Systems by Chip Huyen
            </li>
            <li>
              <span className={LABEL}>Audio · </span>The Lex Fridman Podcast (AI developments &amp; deep conversations)
            </li>
          </ul>
        </RetroSection>
      </main>
    </RetroShell>
  );
}
