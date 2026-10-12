"use client";

import { useEffect, useLayoutEffect, useState, useRef } from "react";
import gsap from "gsap";
import { DUR, EASE, MOTION_OK } from "@/lib/motion";
import { Search, Terminal, ArrowRight, X } from "lucide-react";
import { usePresence } from "@/hooks/usePresence";

// Enter ~0.2s decelerating, exit ~0.12s accelerating (curves come from usePresence).
const OVERLAY_MOTION = { from: { opacity: 0 }, enterDuration: 0.2, exitDuration: 0.12 } as const;
const PANEL_MOTION = {
  from: { scale: 0.97, y: -8 },
  exit: { scale: 0.98, y: -4 },
  enterDuration: 0.2,
  exitDuration: 0.12,
} as const;

interface CommandItem {
  id: string;
  name: string;
  description: string;
  action: () => void;
}

interface CommandPaletteProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CommandPalette({ isOpen, onClose }: CommandPaletteProps) {
  const [search, setSearch] = useState("");
  const [activeIndex, setActiveIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const { mounted: overlayMounted, ref: overlayRef } = usePresence<HTMLDivElement>(isOpen, OVERLAY_MOTION);
  // The panel only mounts with the overlay, so its own `mounted` flag is unused; its ref doubles as the click-outside container.
  const { ref: containerRef } = usePresence<HTMLDivElement>(isOpen, PANEL_MOTION);
  const listRef = useRef<HTMLDivElement>(null);

  const commands: CommandItem[] = [
    {
      id: "readme",
      name: "README.md",
      description: "cat README.md // Open KRISHI.OS operating manual & onboarding guide (alias: man krishi)",
      action: () => {
        window.location.assign("/readme");
      }
    },
    {
      id: "projects",
      name: "projects",
      description: "ls projects/ // View folder directory of builder applications",
      action: () => {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      id: "system-map",
      name: "system-map",
      description: "open system-map // Open interactive knowledge graph mapping tech & projects",
      action: () => {
        document.getElementById("system-map")?.scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      id: "career",
      name: "career",
      description: "git log --career // View academic, leadership, and volunteering history",
      action: () => {
        document.getElementById("career")?.scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      id: "currently-building",
      name: "currently-building",
      description: "./currently-building --status // View active developer pipeline",
      action: () => {
        document.getElementById("currently-building")?.scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      id: "leadership",
      name: "leadership",
      description: "cat leadership.md // Display campus directorship & community strategy details",
      action: () => {
        document.getElementById("leadership")?.scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      id: "resume",
      name: "resume",
      description: "cat resume // Scroll to academic & industry experience logs",
      action: () => {
        document.getElementById("career")?.scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      id: "contact",
      name: "contact",
      description: "ssh contact@krishi.os // Send message or view direct emails",
      action: () => {
        document.getElementById("contact")?.scrollIntoView({ behavior: "smooth" });
      }
    },
    {
      id: "ask-krishi",
      name: "ask-krishi",
      description: "./ask-krishi // Toggle minimize/maximize AI assistant chat bubble",
      action: () => {
        window.dispatchEvent(new CustomEvent("open-ai-chat"));
      }
    },
    ...[
      { id: "accessible-vision", label: "Inspect AI Accessibility platform" },
      { id: "clinicalbrief", label: "Inspect Healthcare AI platform" },
      { id: "studenthub", label: "Inspect Melbourne Student services guide" },
      { id: "traffic-ai", label: "Inspect computer vision queue management system" }
    ].map(({ id, label }) => ({
      id,
      name: id,
      description: `cat projects/${id}/overview.md // ${label}`,
      action: () => {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
        window.dispatchEvent(new CustomEvent("select-project", { detail: { id } }));
      }
    }))
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description.toLowerCase().includes(search.toLowerCase())
  );

  // Lock body scroll while open; return focus to whatever opened the palette on close
  useEffect(() => {
    if (!isOpen) return;
    const previouslyFocused = document.activeElement as HTMLElement | null;
    document.body.classList.add("command-palette-open");
    document.body.style.overflow = "hidden";
    return () => {
      document.body.classList.remove("command-palette-open");
      document.body.style.overflow = "";
      previouslyFocused?.focus({ preventScroll: true });
    };
  }, [isOpen]);

  // Reset search and active index when palette opens
  useEffect(() => {
    if (isOpen) {
      requestAnimationFrame(() => {
        setSearch("");
        setActiveIndex(0);
        setTimeout(() => inputRef.current?.focus(), 100);
      });
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Tab") {
        // Keep focus inside the dialog; the list is driven by arrow keys from the input
        e.preventDefault();
        inputRef.current?.focus();
      } else if (e.key === "ArrowDown") {
        e.preventDefault();
        setActiveIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setActiveIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
      } else if (e.key === "Enter") {
        e.preventDefault();
        if (filteredCommands[activeIndex]) {
          filteredCommands[activeIndex].action();
          onClose();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, activeIndex, filteredCommands, onClose]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, containerRef]);

  // Micro-cascade of the command list on open (~25ms apart, capped well under 500ms in total).
  useLayoutEffect(() => {
    const list = listRef.current;
    if (!isOpen || !list) return;
    const mm = gsap.matchMedia();
    mm.add(
      MOTION_OK,
      () => {
        gsap.from(list.children, {
          x: -6,
          opacity: 0,
          duration: DUR.standard,
          ease: EASE,
          delay: 0.05,
          stagger: Math.min(0.025, 0.3 / Math.max(1, list.children.length)),
        });
      },
      list
    );
    return () => mm.revert();
  }, [isOpen]);

  const kbd = "inline-block border border-rule px-1.5 py-px text-[11px] leading-none text-ink-soft";

  return (
    <>
      {overlayMounted && (
        <div
          ref={overlayRef}
          className="fixed inset-0 z-[100] flex items-start justify-center pt-24 px-4 font-mono bg-bg/80 backdrop-blur-sm"
        >
          {/* Background Decorative Status */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 pointer-events-none select-none text-[11px] text-ink-faint uppercase tracking-[0.18em]">
            [system] interactive command mode active
          </div>

          <div
            ref={containerRef}
            role="dialog"
            aria-modal="true"
            aria-label="Command palette"
            className="w-full max-w-xl bg-bg border border-rule overflow-hidden"
          >
            {/* Input Bar */}
            <div className="flex items-center px-4 py-3 border-b border-rule">
              <Search className="w-4 h-4 text-ink-faint mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                role="combobox"
                aria-label="Search commands"
                aria-expanded="true"
                aria-controls="command-palette-list"
                aria-activedescendant={filteredCommands[activeIndex] ? `cmd-${filteredCommands[activeIndex].id}` : undefined}
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setActiveIndex(0);
                }}
                placeholder="Type a command (e.g. about, traffic-ai)..."
                className="flex-1 bg-transparent text-sm text-ink placeholder:text-ink-faint focus:outline-none"
              />
              <span className={`${kbd} mr-3 select-none`}>ESC</span>
              <button onClick={onClose} className="text-ink-faint hover:text-accent transition-colors duration-150 cursor-pointer p-2 -m-2" aria-label="Close command palette">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div ref={listRef} id="command-palette-list" role="listbox" className="max-h-[300px] overflow-y-auto py-1">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={cmd.id}
                      id={`cmd-${cmd.id}`}
                      role="option"
                      aria-selected={isActive}
                      tabIndex={-1}
                      onClick={() => {
                        cmd.action();
                        onClose();
                      }}
                      className={`w-full text-left flex items-start justify-between px-4 py-3 border-l-2 transition-colors duration-150 cursor-pointer ${
                        isActive ? "border-accent bg-bg-2" : "border-transparent hover:bg-bg-2"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Terminal className={`w-3.5 h-3.5 shrink-0 ${isActive ? "text-accent" : "text-ink-faint"}`} />
                        <div>
                          <div className={`text-xs ${isActive ? "text-accent" : "text-ink"}`}>{cmd.name}</div>
                          <div className="text-[11px] text-ink-faint mt-1">{cmd.description}</div>
                        </div>
                      </div>
                      {isActive && <ArrowRight className="w-3.5 h-3.5 text-accent self-center shrink-0" />}
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-6 text-ink-faint text-[11px] uppercase tracking-[0.18em]">
                  No matching processes found
                </div>
              )}
            </div>

            {/* Footer Status Bar */}
            <div className="px-4 py-2 border-t border-rule flex justify-between items-center text-[11px] text-ink-faint select-none">
              <span className="flex items-center gap-1.5">
                Use <kbd className={kbd}>↑</kbd>
                <kbd className={kbd}>↓</kbd> to navigate, <kbd className={kbd}>Enter</kbd> to run
              </span>
              <span className="uppercase tracking-[0.18em]">tty_commands</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
