"use client";

import { useState, useEffect, useLayoutEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { useRouter } from "next/navigation";
import { Bot, X, Send, Terminal as TermIcon } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { executeNavigationCommand } from "@/lib/navigation";
import Button from "@/components/ui/Button";
import { usePresence } from "@/hooks/usePresence";
import { useBooted } from "@/components/boot/BootWrapper";
import { DUR, EASE, MOTION_OK, RISE, scrollBehavior } from "@/lib/motion";

const LAUNCHER_MOTION = { from: { scale: 0.8, opacity: 0 }, enterDuration: 0.2 } as const;
const PANEL_MOTION = {
  from: { opacity: 0, y: RISE.panel, scale: 0.98 },
  exit: { opacity: 0, y: RISE.item, scale: 0.98 },
} as const;

// Rise + fade an element into place (skipped under reduced motion); returns the cleanup.
function rise(el: Element) {
  const mm = gsap.matchMedia();
  mm.add(MOTION_OK, () => {
    gsap.from(el, { opacity: 0, y: RISE.item, duration: DUR.standard, ease: EASE, clearProps: "opacity,transform" });
  });
  return () => mm.revert();
}

// http(s) URLs (trailing punctuation excluded) and email addresses.
const LINK_RE = /https?:\/\/[^\s<>"]*[^\s<>".,;:!?)]|[\w.+-]+@[\w-]+(?:\.[\w-]+)+/g;

// Renders URLs and emails in chat text as links; everything else stays plain text.
function linkify(text: string): ReactNode[] {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const m of text.matchAll(LINK_RE)) {
    const isUrl = m[0].startsWith("http");
    parts.push(
      text.slice(last, m.index),
      <a
        key={m.index}
        href={isUrl ? m[0] : `mailto:${m[0]}`}
        target={isUrl ? "_blank" : undefined}
        rel="noopener noreferrer"
        className="text-accent underline decoration-dotted underline-offset-2 hover:text-accent-2 break-all"
      >
        {m[0]}
      </a>
    );
    last = m.index + m[0].length;
  }
  parts.push(text.slice(last));
  return parts;
}

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, loading, sendMessage } = useChat(
    "Hi, I'm the KRISHI.OS assistant. Ask about Krishi's projects, his Master of AI at Monash, his leadership roles, or how to reach him."
  );
  const booted = useBooted();
  const router = useRouter();
  const chatEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const wasOpen = useRef(false);
  const logRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);
  const prevCount = useRef(messages.length);
  const { mounted: launcherMounted, ref: launcherRef } = usePresence<HTMLButtonElement>(!isOpen, LAUNCHER_MOTION);
  const { mounted: panelMounted, ref: panelRef } = usePresence<HTMLDivElement>(isOpen, PANEL_MOTION);

  // Animate only the newest message when one is added; existing messages never re-animate.
  useLayoutEffect(() => {
    const grew = messages.length > prevCount.current;
    prevCount.current = messages.length;
    const el = logRef.current?.children[messages.length - 1];
    if (grew && el) return rise(el);
  }, [messages.length]);

  useLayoutEffect(() => {
    if (loading && loaderRef.current) return rise(loaderRef.current);
  }, [loading]);

  useEffect(() => {
    // Listen to custom event to open the chat window from external CTAs (e.g. Hero section)
    const handleOpenChat = () => {
      setIsOpen(true);
    };
    window.addEventListener("open-ai-chat", handleOpenChat);
    return () => window.removeEventListener("open-ai-chat", handleOpenChat);
  }, []);

  // Deep link from other pages (e.g. the README tile): /?chat=1 opens the chat once boot clears, then the param is dropped
  useEffect(() => {
    if (!booted) return;
    const url = new URL(window.location.href);
    if (url.searchParams.get("chat") !== "1") return;
    url.searchParams.delete("chat");
    window.history.replaceState(null, "", url.pathname + url.search + url.hash);
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setIsOpen(true);
  }, [booted]);

  // Focus moves into the panel on open and back to the launcher on close; Escape closes
  useEffect(() => {
    if (isOpen) {
      wasOpen.current = true;
      inputRef.current?.focus();
      const onKey = (e: KeyboardEvent) => {
        if (e.key === "Escape") setIsOpen(false);
      };
      window.addEventListener("keydown", onKey);
      return () => window.removeEventListener("keydown", onKey);
    }
    if (wasOpen.current) launcherRef.current?.focus();
  }, [isOpen, launcherRef]);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: scrollBehavior() });
    }
  }, [messages, isOpen, loading]);

  const handleSend = (text: string) => {
    sendMessage(text);
    setInput("");
  };

  const quickQuestions = [
    "Tell me about ClinicalBrief",
    "Is Krishi open to opportunities?",
    "What is his role at MDAS?",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-mono">
      {/* Floating Circle Button */}
      {launcherMounted && (
          <button
            ref={launcherRef}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-accent text-bg flex items-center justify-center hover:bg-accent-2 transition-colors duration-150 group cursor-pointer focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-accent"
            aria-label="Ask Krishi AI"
          >
            <Bot className="w-6 h-6 group-hover:rotate-6 transition-transform" />
          </button>
      )}

      {/* Expanded Terminal Chat Window */}
      {panelMounted && (
          <div
            ref={panelRef}
            style={{ transformOrigin: "bottom right" }}
            className="w-[90vw] sm:w-[380px] h-[min(500px,calc(100dvh-6rem))] overflow-hidden bg-bg border border-rule flex flex-col mb-2"
          >
            {/* Header bar */}
            <div className="bg-bg-2 px-4 py-3 flex items-center justify-between border-b border-rule">
              <div className="flex items-center space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse" />
                <span className="text-[11px] uppercase tracking-[0.18em] text-ink-soft flex items-center gap-1.5">
                  <TermIcon className="w-3 h-3 text-accent" />
                  ASK_KRISHI_AGENT.sh
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-ink-faint hover:text-accent transition-colors duration-150 cursor-pointer p-2 -m-2"
                aria-label="Close chat"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Area */}
            <div ref={logRef} role="log" aria-live="polite" aria-label="Ask Krishi conversation" className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
              {messages.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={index}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] px-3 py-2.5 leading-relaxed ${
                        isUser ? "bg-bg-2 border border-rule text-ink" : "border-l-2 border-accent text-ink-soft"
                      }`}
                    >
                      <span className="block text-[11px] text-ink-faint uppercase tracking-[0.18em] mb-1 select-none">
                        {isUser ? "you >" : "agent >"}
                      </span>
                      <p className="whitespace-pre-line">{linkify(msg.content)}</p>

                      {!isUser && msg.suggestedCommand && (
                        <div className="mt-3 pt-2 border-t border-rule text-[11px]">
                          <span className="text-ink-faint uppercase tracking-[0.18em] block mb-1 select-none">
                            Suggested Command:
                          </span>
                          <button
                            type="button"
                            onClick={() => executeNavigationCommand(msg.suggestedCommand!, router.push)}
                            className="text-accent hover:text-accent-2 hover:translate-x-0.5 active:scale-[0.97] transition-[color,translate,scale] duration-150 ease-out motion-reduce:transition-none flex items-center space-x-1 cursor-pointer text-left"
                          >
                            <span>&gt; {msg.suggestedCommand}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div
                  ref={loaderRef}
                  className="flex justify-start"
                >
                  <div className="border-l-2 border-accent px-3 py-2.5 max-w-[85%]">
                    <span className="block text-[11px] text-ink-faint uppercase tracking-[0.18em] mb-1">agent &gt;</span>
                    <span className="flex gap-1 items-center py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-accent animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Questions tags */}
            {messages.length === 1 && (
              <div className="px-4 py-2.5 border-t border-rule space-y-2">
                <span className="text-[11px] text-ink-faint uppercase tracking-[0.18em]">QUICK INQUIRY:</span>
                <div className="flex flex-wrap gap-1.5">
                  {quickQuestions.map((q) => (
                    <Button
                      key={q}
                      onClick={() => handleSend(q)}
                      variant="outline"
                      size="sm"
                      className="rounded-full text-[11px] px-2.5 py-1 text-left inline-block w-auto hover:-translate-y-px"
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Form Input area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 border-t border-rule flex items-center space-x-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                maxLength={500}
                aria-label="Ask Krishi a question"
                placeholder="Ask about studies, skills, projects..."
                className="flex-1 bg-bg-2 border border-rule px-3 py-2 text-xs text-ink placeholder:text-ink-faint focus:outline-none focus:border-accent disabled:opacity-50"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                variant="terminal"
                className="p-2 min-h-[34px] w-[34px] flex items-center justify-center"
                aria-label="Send"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </div>
      )}
    </div>
  );
}
