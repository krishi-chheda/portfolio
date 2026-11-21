"use client";

import { useState } from "react";
import Image from "next/image";
import { useKeys } from "@/components/retro/ui";
import { sfx } from "@/game/audio";
import type { Screenshot } from "@/lib/portfolio";

const SCANLINES = "bg-[repeating-linear-gradient(180deg,rgba(0,0,0,0.14)_0_1px,transparent_1px_3px)]";

/**
 * The HQ's TV wall: real screenshots as channels on a pixel TV. ◀ ▶ (or ←/→) change channel with a burst of
 * static; the thumbnails below jump straight to one. With no screenshots it shows colour bars and NO SIGNAL.
 */
export default function TvViewer({ shots, title }: { shots: Screenshot[]; title: string }) {
  const [ch, setCh] = useState(0);
  const go = (i: number) => {
    if (!shots.length) return;
    const next = (i + shots.length) % shots.length;
    if (next !== ch) sfx("select");
    setCh(next);
  };
  useKeys((e) => {
    if (e.key === "ArrowRight") go(ch + 1);
    else if (e.key === "ArrowLeft") go(ch - 1);
  });
  const s = shots[ch];
  const tall = s ? s.height > s.width : false;

  return (
    <div className="space-y-4">
      {/* the set: bezel, screen, control strip */}
      <div className="mx-auto max-w-3xl border-4 border-[#1f1d24] bg-[#2a2d35] p-3 shadow-[6px_6px_0_#46382b] sm:p-4">
        <div className="relative aspect-[16/10] overflow-hidden border-4 border-[#14161b] bg-[#0b1116]">
          {s ? (
            <Image
              key={s.src}
              src={s.src}
              alt={s.alt}
              fill
              sizes="(min-width: 1024px) 720px, 90vw"
              className={`${tall ? "object-contain" : "object-cover object-top"} motion-safe:animate-[kw-tv-on_0.28s_steps(4)_both]`}
            />
          ) : (
            // colour bars: nothing public to show
            <div className="absolute inset-0 grid grid-cols-7">
              {["#f5e8c8", "#f5c65b", "#7bc9df", "#78b85a", "#b48be8", "#e0564a", "#4791c4"].map((c) => (
                <span key={c} style={{ background: c }} />
              ))}
              <p className="absolute inset-x-0 top-1/2 mx-auto w-fit -translate-y-1/2 border-4 border-[#1f1d24] bg-[#1f1d24] px-4 py-1 text-2xl tracking-[0.3em] text-[#f5e8c8]">NO SIGNAL</p>
            </div>
          )}
          {/* glass: scanlines, glare, the on-screen channel number */}
          <div aria-hidden="true" className={`pointer-events-none absolute inset-0 ${SCANLINES}`} />
          <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.10)_0%,transparent_35%,transparent_70%,rgba(0,0,0,0.18)_100%)]" />
          {s && (
            <span key={`osd-${ch}`} aria-hidden="true" className="absolute top-2 right-3 text-xl tracking-widest text-[#34d399] [text-shadow:2px_2px_0_#0b1116] motion-safe:animate-[kw-osd_1.6s_steps(1)_both]">
              CH {String(ch + 1).padStart(2, "0")}
            </span>
          )}
        </div>
        <div className="mt-2.5 flex items-center justify-between gap-3 text-[#cfd3da]">
          <span className="text-sm tracking-[0.25em]">KRISHI·TV</span>
          <div className="flex items-center gap-2">
            {shots.length > 1 && (
              <>
                <button type="button" onClick={() => go(ch - 1)} aria-label="Previous channel" className="border-2 border-[#1f1d24] bg-[#3a3f4a] px-2.5 text-lg leading-7 hover:bg-[#4a5060] active:translate-y-px">
                  ◀
                </button>
                <span className="min-w-[4.5rem] border-2 border-[#1f1d24] bg-[#0b1116] px-2 text-center text-base leading-7 text-[#34d399]" aria-live="polite">
                  {String(ch + 1).padStart(2, "0")}/{String(shots.length).padStart(2, "0")}
                </span>
                <button type="button" onClick={() => go(ch + 1)} aria-label="Next channel" className="border-2 border-[#1f1d24] bg-[#3a3f4a] px-2.5 text-lg leading-7 hover:bg-[#4a5060] active:translate-y-px">
                  ▶
                </button>
              </>
            )}
            <span aria-hidden="true" className={`ml-1 h-3 w-3 border-2 border-[#1f1d24] ${s ? "bg-[#34d399]" : "bg-[#e0564a]"}`} title="power" />
          </div>
        </div>
      </div>

      {/* what's on, and the channel list */}
      {s ? (
        <div className="mx-auto max-w-3xl space-y-3">
          <div className="flex flex-wrap items-baseline justify-between gap-2">
            <p className="text-lg leading-snug">
              <span className="text-[#285943]">ON AIR · </span>
              {s.alt}
            </p>
            <a href={s.src} target="_blank" rel="noopener noreferrer" className="text-sm text-[#285943] underline underline-offset-2">
              Open full size ↗
            </a>
          </div>
          <p className="text-sm text-[#5a4434]">{s.caption}</p>
          {shots.length > 1 && (
            <ul className="flex flex-wrap gap-2" aria-label="Channels">
              {shots.map((x, i) => (
                <li key={x.src}>
                  <button
                    type="button"
                    onClick={() => go(i)}
                    aria-label={`Channel ${i + 1}: ${x.alt}`}
                    aria-pressed={i === ch}
                    className={`relative block h-14 w-24 overflow-hidden border-4 bg-[#0b1116] transition-[translate] hover:-translate-y-0.5 ${i === ch ? "border-[#f5c65b]" : "border-[#46382b]"}`}
                  >
                    <Image src={x.src} alt="" fill sizes="96px" className={x.height > x.width ? "object-contain" : "object-cover object-top"} />
                    <span className="absolute bottom-0 left-0 bg-[#1f1d24] px-1 text-[10px] text-[#34d399]">{String(i + 1).padStart(2, "0")}</span>
                  </button>
                </li>
              ))}
            </ul>
          )}
          <p className="text-sm text-[#5a4434]">◀ ▶ or ← → to change channel</p>
        </div>
      ) : (
        <p className="mx-auto max-w-3xl text-lg leading-snug">{title} has no public repository or live demo to capture, so there&apos;s nothing on this set yet.</p>
      )}
    </div>
  );
}
