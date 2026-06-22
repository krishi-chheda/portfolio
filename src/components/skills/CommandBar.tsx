"use client";

import { useMemo } from "react";
import Button from "@/components/ui/Button";

interface CommandBarProps {
  activeCommand: string;
  onSelectCommand: (command: string) => void;
  typedText: string;
  isTyping: boolean;
}

export default function CommandBar({
  activeCommand,
  onSelectCommand,
  typedText,
  isTyping,
}: CommandBarProps) {
  const commands = useMemo(
    () => [
      "skills.toml",
      "projects.toml",
      "experience.toml",
      "leadership.toml",
    ],
    []
  );

  return (
    <div className="w-full bg-slate-950 px-4 py-3 border-b border-slate-900 flex flex-col md:flex-row md:items-center justify-between gap-3 font-mono">
      {/* Live typing command display */}
      <div className="flex items-center space-x-2 text-xs">
        <span className="text-slate-500">krishi@portfolio:~$</span>
        <span className="text-slate-100 font-bold tracking-wide">
          {typedText}
          {isTyping && (
            <span className="inline-block w-1.5 h-3.5 bg-cyan-400 animate-pulse ml-0.5" />
          )}
        </span>
      </div>

      {/* Selectable tabs */}
      <div className="flex flex-wrap gap-2 items-center">
        <span className="text-[10px] text-slate-600 uppercase font-semibold select-none pr-1">
          Explore:
        </span>
        {commands.map((cmd) => {
          const isActive = activeCommand === cmd;
          return (
            <Button
              key={cmd}
              onClick={() => onSelectCommand(cmd)}
              variant={isActive ? "terminal" : "secondary"}
              size="sm"
              className={`text-[10px] px-2.5 py-1 min-h-0 tracking-wide rounded ${
                isActive ? "border-cyan-850" : "text-slate-400"
              }`}
            >
              cat {cmd}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
