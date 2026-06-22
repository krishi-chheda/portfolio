"use client";

import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Terminal, ArrowRight, X } from "lucide-react";

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
  const containerRef = useRef<HTMLDivElement>(null);

  const commands: CommandItem[] = [
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
      description: "git log --career // View academic and technical work history log",
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
    {
      id: "accessible-vision",
      name: "accessible-vision",
      description: "cat projects/accessible-vision/project.md // Inspect AI Accessibility platform",
      action: () => {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
        window.dispatchEvent(new CustomEvent("select-project", { detail: { id: "accessible-vision" } }));
      }
    },
    {
      id: "clinicalbrief",
      name: "clinicalbrief",
      description: "cat projects/clinicalbrief/project.md // Inspect Healthcare AI platform",
      action: () => {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
        window.dispatchEvent(new CustomEvent("select-project", { detail: { id: "clinicalbrief" } }));
      }
    },
    {
      id: "studenthub",
      name: "studenthub",
      description: "cat projects/studenthub/project.md // Inspect Melbourne Student services guide",
      action: () => {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
        window.dispatchEvent(new CustomEvent("select-project", { detail: { id: "studenthub" } }));
      }
    },
    {
      id: "traffic-ai",
      name: "traffic-ai",
      description: "cat projects/traffic-ai/project.md // Inspect computer vision queue management system",
      action: () => {
        document.getElementById("projects")?.scrollIntoView({ behavior: "smooth" });
        window.dispatchEvent(new CustomEvent("select-project", { detail: { id: "traffic-ai" } }));
      }
    }
  ];

  const filteredCommands = commands.filter((cmd) =>
    cmd.name.toLowerCase().includes(search.toLowerCase()) ||
    cmd.description.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (isOpen) {
      setSearch("");
      setActiveIndex(0);
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;

      if (e.key === "Escape") {
        e.preventDefault();
        onClose();
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
  }, [isOpen, onClose]);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-md flex items-start justify-center pt-24 px-4 font-mono"
        >
          <motion.div
            initial={{ scale: 0.97, y: -8 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.97, y: -8 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            ref={containerRef}
            className="w-full max-w-xl bg-slate-950/90 border border-slate-800 rounded-lg shadow-2xl overflow-hidden"
          >
            {/* Input Bar */}
            <div className="flex items-center px-4 py-3 bg-slate-950 border-b border-slate-900">
              <Search className="w-4 h-4 text-slate-500 mr-3 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setActiveIndex(0);
                }}
                placeholder="Type a command (e.g. about, traffic-ai)..."
                className="flex-1 bg-transparent text-sm text-white placeholder-slate-600 focus:outline-none"
              />
              <span className="text-[10px] text-slate-650 px-2 py-0.5 rounded border border-slate-900 bg-slate-950 mr-2 select-none">
                ESC
              </span>
              <button onClick={onClose} className="text-slate-500 hover:text-white transition-colors cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* List */}
            <div className="max-h-[300px] overflow-y-auto p-2 bg-slate-950/20">
              {filteredCommands.length > 0 ? (
                filteredCommands.map((cmd, idx) => {
                  const isActive = idx === activeIndex;
                  return (
                    <button
                      key={cmd.id}
                      onClick={() => {
                        cmd.action();
                        onClose();
                      }}
                      className={`w-full text-left flex items-start justify-between p-3.5 rounded transition-all cursor-pointer ${
                        isActive
                          ? "bg-cyan-950/80 border border-cyan-800/40 text-cyan-200"
                          : "border border-transparent hover:bg-slate-900/40 text-slate-400"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <Terminal className={`w-3.5 h-3.5 ${isActive ? "text-cyan-400" : "text-slate-600"}`} />
                        <div>
                          <div className={`text-xs font-bold ${isActive ? "text-cyan-300" : "text-slate-200"}`}>
                            {cmd.name}
                          </div>
                          <div className="text-[10px] text-slate-500 mt-1">
                            {cmd.description}
                          </div>
                        </div>
                      </div>
                      {isActive && <ArrowRight className="w-3.5 h-3.5 text-cyan-400 self-center shrink-0" />}
                    </button>
                  );
                })
              ) : (
                <div className="text-center py-6 text-slate-600 text-xs font-mono uppercase tracking-wider">
                  No matching processes found
                </div>
              )}
            </div>

            {/* Footer Status Bar */}
            <div className="bg-slate-950/95 px-4 py-2 border-t border-slate-900 flex justify-between items-center text-[9px] text-slate-600 select-none">
              <span>Use ↑↓ to navigate, Enter to run</span>
              <span>tty_commands</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
