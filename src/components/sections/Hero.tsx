"use client";

import { useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import Link from "next/link";
import { currentProcesses, impactLog, CONTACT_EMAIL } from "@/lib/data";
import { useBooted } from "@/components/boot/BootWrapper";
import { DUR, EASE, MOTION_OK, RISE, scrambleText } from "@/lib/motion";


const PILLS = [
  { label: "projects", href: "/#projects" },
  { label: "career", href: "/#career" },
  { label: "system-map", href: "/#system-map" },
  { label: "readme", href: "/readme" },
  { label: "contact", href: "/#contact" },
];

export default function Hero() {
  const rootRef = useRef<HTMLElement>(null);
  const booted = useBooted();

  // Post-boot entrance: prompt types, name and title rise, details and impact cells cascade.
  // Start states are applied immediately (hidden behind the boot screen); playback waits for boot to finish.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add(
      MOTION_OK,
      () => {
        const tl = gsap.timeline({ paused: true, defaults: { ease: EASE } });
        tl.from('[data-hero="whoami"]', { clipPath: "inset(0 100% 0 0)", duration: 0.35, ease: "steps(15)" })
          .from('[data-hero="meta"]', { opacity: 0, duration: DUR.standard }, 0.25)
          .from('[data-hero="headline"]', { y: 18, opacity: 0, duration: DUR.slow, stagger: 0.1 }, 0.35)
          .from('[data-hero="body"]', { y: RISE.item, opacity: 0, duration: DUR.standard, stagger: 0.06 }, 0.7)
          .from('[data-hero="tail"]', { clipPath: "inset(0 100% 0 0)", duration: 0.35, ease: "steps(20)" }, 0.9)
          .from('[data-hero="row"]', { y: 8, opacity: 0, duration: DUR.standard, stagger: 0.05 }, 1.0);

        // Name/title lines and impact figures decode from glyphs as they land
        const restores: (() => void)[] = [];
        root.querySelectorAll<HTMLElement>('[data-hero="headline"]').forEach((el, i) => {
          const { tween, restore } = scrambleText(el, 0.7);
          tl.add(tween, 0.35 + i * 0.1);
          restores.push(restore);
        });
        root.querySelectorAll<HTMLElement>('[data-hero="value"]').forEach((el, i) => {
          const { tween, restore } = scrambleText(el, 0.5);
          tl.add(tween, 1.0 + i * 0.05);
          restores.push(restore);
        });

        if (booted) tl.play();
        return () => restores.forEach((fn) => fn());
      },
      root
    );
    return () => mm.revert();
  }, [booted]);

  const openChat = () => window.dispatchEvent(new CustomEvent("open-ai-chat"));

  const details: { key: string; value: ReactNode }[] = [
    {
      key: "status",
      value: (
        <span>
          <span className="text-accent">●</span> {currentProcesses.availability.toLowerCase()}
        </span>
      ),
    },
    { key: "focus", value: currentProcesses.targetRoles.join(" · ").toLowerCase() },
    { key: "study", value: `master of ai · monash university · graduating ${currentProcesses.graduation.toLowerCase()}` },
    { key: "based", value: currentProcesses.location.toLowerCase() },
    {
      key: "email",
      value: (
        <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:text-accent-2 transition-colors duration-150">
          {CONTACT_EMAIL}
        </a>
      ),
    },
    {
      key: "ask",
      value: (
        <button type="button" onClick={openChat} className="text-accent hover:text-accent-2 transition-colors duration-150 cursor-pointer">
          chat with the KRISHI.OS assistant →
        </button>
      ),
    },
  ];

  return (
    <section ref={rootRef} id="hero" className="relative pt-32 pb-20 md:pt-40">
      <div className="mx-auto max-w-6xl px-6">
        {/* Prompt */}
        <div className="text-xs md:text-sm">
          <span className="text-accent">krishi@stack:~$</span>{" "}
          <span data-hero="whoami" className="text-ink">./whoami --long</span>
        </div>
        <div data-hero="meta" className="mt-4 text-[11px] md:text-xs text-ink-faint">
          # profile · applied ai · computer vision · healthcare ai · full-stack product
        </div>

        {/* Display headline */}
        <h1 className="mt-10 font-bold uppercase leading-[0.95] tracking-tight text-[clamp(2rem,8.5vw,7rem)]">
          <span data-hero="headline" className="block text-ink">Krishi Chheda.</span>{" "}
          <span data-hero="headline" className="block text-accent">AI Engineer &amp;</span>{" "}
          <span data-hero="headline" className="block text-accent">Product Builder</span>
        </h1>

        {/* Intro */}
        <p data-hero="body" className="mt-10 max-w-2xl text-sm md:text-[15px] leading-relaxed text-ink-soft">
          I build <span className="text-accent">applied AI systems</span> and the products around them: grounded computer
          vision for accessibility, <span className="text-accent">human-reviewed clinical AI</span>, and edge vision for
          traffic. Currently studying a Master of Artificial Intelligence at Monash University.
        </p>

        {/* key: value details */}
        <dl data-hero="body" className="mt-8 grid grid-cols-1 sm:grid-cols-2 gap-x-10 gap-y-2 text-xs max-w-4xl">
          {details.map((d) => (
            <div key={d.key} className="flex gap-4 min-w-0">
              <dt className="w-14 shrink-0 text-ink-faint">{d.key}</dt>
              <dd className="text-ink-soft min-w-0 break-words">{d.value}</dd>
            </div>
          ))}
        </dl>

        {/* Pills */}
        <div data-hero="body" className="mt-8 flex flex-wrap gap-2 text-xs">
          <button
            type="button"
            onClick={openChat}
            className="rounded-full border border-accent px-4 py-1.5 text-accent hover:bg-accent hover:text-bg transition-colors duration-150 cursor-pointer"
          >
            ./ask-krishi
          </button>
          {PILLS.map((p) => (
            <Link
              key={p.label}
              href={p.href}
              className="rounded-full border border-rule px-4 py-1.5 text-ink-soft hover:border-ink-soft hover:text-ink transition-colors duration-150"
            >
              {p.label}
            </Link>
          ))}
        </div>

        {/* Impact log */}
        <div className="mt-20 border-t border-rule pt-6">
          <div className="text-xs md:text-sm">
            <span className="text-accent">krishi@stack:~$</span>{" "}
            <span data-hero="tail" className="text-ink">tail -f impact.log</span>
          </div>
          <div className="mt-6 grid grid-cols-2 lg:grid-cols-4 border-l border-rule">
            {impactLog.map((m) => (
              <div key={m.label} data-hero="row" className="border-r border-rule px-4 py-2">
                <div data-hero="value" className="text-base min-[375px]:text-xl sm:text-2xl md:text-3xl font-bold text-accent whitespace-nowrap">{m.value}</div>
                <div className="mt-2 text-[11px] leading-relaxed text-ink-faint">
                  {m.label} · <span className="text-ink-soft">{m.source}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
