"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { BUTTON, PIXEL, TITLE_BAR, useKeys } from "@/components/retro/ui";
import { useChat } from "@/hooks/useChat";
import { navigationRegistry } from "@/lib/navigation";
import gsap from "gsap";
import { WORLD } from "@/lib/motion";
import { useEntrance } from "@/hooks/useEntrance";

// http(s) URLs (trailing punctuation excluded) and email addresses.
const LINK_RE = /https?:\/\/[^\s<>"]*[^\s<>".,;:!?)]|[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;

function linkify(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK_RE)) {
    const isUrl = m[0].startsWith("http");
    parts.push(
      text.slice(last, m.index),
      <a key={m.index} href={isUrl ? m[0] : `mailto:${m[0]}`} target={isUrl ? "_blank" : undefined} rel="noopener noreferrer" className="break-all text-[#285943] underline">
        {m[0]}
      </a>,
    );
    last = m.index + m[0].length;
  }
  parts.push(text.slice(last));
  return parts;
}

// The chat API still answers with the old site's section targets; point them at Classic Mode's sections.
const SECTION: Record<string, { id: string; label: string }> = {
  projects: { id: "projects", label: "Project Archive" },
  "currently-building": { id: "projects", label: "Project Archive" },
  leadership: { id: "experience", label: "Quest Log" },
  career: { id: "experience", label: "Quest Log" },
  contact: { id: "contact", label: "Contact" },
};
const target = (command?: string) => {
  const hit = command && navigationRegistry.find((n) => n.command_aliases.includes(command));
  return hit ? SECTION[hit.scroll_target] : undefined;
};

const SUGGESTIONS = ["What is ClinicalBrief?", "What does Krishi study?", "How do I contact him?"];

/** Ask Krishi in the KRISHI.WORLD frame: same /api/chat, a dialogue-box look. */
export default function AskKrishi() {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, loading, sendMessage } = useChat(
    "Hi! I'm Krishi's assistant. Ask about his projects, his Master of AI at Monash, his leadership roles, or how to reach him.",
  );
  const logRef = useRef<HTMLDivElement>(null);
  // Panel grows from the launcher (bottom-right) with the signature overshoot
  const panelRef = useEntrance<HTMLElement>(
    (el) => {
      if (!open) return;
      gsap.from(el, { autoAlpha: 0, scale: 0.88, y: 14, transformOrigin: "100% 100%", duration: WORLD.dur.standard, ease: WORLD.ease, clearProps: "transform,opacity,visibility" });
    },
    [open],
  );
  // The newest message rises into place (speaker-side origin)
  useEntrance<HTMLDivElement>(() => {
    const last = logRef.current?.lastElementChild;
    if (!open || !last) return;
    gsap.from(last, { autoAlpha: 0, y: 10, duration: WORLD.dur.quick + 0.05, ease: WORLD.easeSoft, clearProps: "transform,opacity,visibility" });
  }, [messages.length, loading, open]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    logRef.current?.scrollTo({ top: logRef.current.scrollHeight });
  }, [messages, loading]);
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  useKeys((e) => {
    if (e.key === "Escape" && open) setOpen(false);
  });

  const send = (text: string) => {
    sendMessage(text);
    setInput("");
  };

  return (
    <div className={`${PIXEL} fixed right-3 bottom-3 z-30 flex flex-col items-end gap-3 sm:right-6 sm:bottom-6`}>
      {open && (
        <section
          ref={panelRef}
          aria-label="Ask Krishi"
          className="flex h-[min(32rem,calc(100dvh-6rem))] w-[min(24rem,calc(100vw-1.5rem))] flex-col border-4 border-[#46382b] bg-[#f5e8c8] text-[#2b2420] shadow-[6px_6px_0_#46382b]"
        >
          <div className={TITLE_BAR}>
            <h2 className="text-lg tracking-[0.15em]">ASK KRISHI</h2>
            <button type="button" onClick={() => setOpen(false)} aria-label="Close chat" className="px-1 text-lg hover:text-[#f5c65b]">
              ✕
            </button>
          </div>
          <div ref={logRef} aria-live="polite" className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3">
            {messages.map((m, i) => {
              const go = m.role === "assistant" ? target(m.suggestedCommand) : undefined;
              return (
                <div key={i} className={`border-2 border-[#46382b] p-2 text-base leading-snug shadow-[2px_2px_0_#46382b] ${m.role === "user" ? "ml-8 bg-[#c9eab0]" : "mr-4 bg-white"}`}>
                  <p className="text-xs tracking-widest text-[#5a4434]">{m.role === "user" ? "YOU" : "KRISHI.BOT"}</p>
                  <p className="whitespace-pre-wrap">{linkify(m.content)}</p>
                  {go && (
                    <a href={`/classic#${go.id}`} className="mt-1 inline-block text-sm text-[#285943] underline">
                      ▶ Go to {go.label}
                    </a>
                  )}
                </div>
              );
            })}
            {loading && <p className="text-sm text-[#5a4434] motion-safe:animate-pulse">KRISHI.BOT is typing…</p>}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map((s) => (
                  <button key={s} type="button" onClick={() => send(s)} className={`${BUTTON} text-sm`}>
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex gap-2 border-t-4 border-[#46382b] p-2"
          >
            <label htmlFor="ask-krishi-input" className="sr-only">
              Your question
            </label>
            <input
              ref={inputRef}
              id="ask-krishi-input"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              maxLength={500}
              placeholder="Ask a question…"
              className="min-w-0 flex-1 border-2 border-[#46382b] bg-white px-2 py-1 text-base outline-none focus-visible:border-[#285943]"
            />
            <button type="submit" disabled={loading || !input.trim()} className={`${BUTTON} disabled:opacity-50`}>
              Send
            </button>
          </form>
        </section>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        className="border-4 border-[#46382b] bg-[#f5c65b] px-3 py-1.5 text-base tracking-widest text-[#2b2420] shadow-[4px_4px_0_#46382b] hover:bg-[#fff1c4]"
      >
        {open ? "✕ CLOSE" : "💬 ASK KRISHI"}
      </button>
    </div>
  );
}
