"use client";

import { useEffect, useState } from "react";
import { bootLinesData } from "@/lib/data";
import BootLine from "./BootLine";

interface TerminalOutputProps {
  currentLineIndex: number;
  completedLines: string[];
  accessGranted: boolean;
  onLineComplete: () => void;
}

export default function TerminalOutput({
  currentLineIndex,
  completedLines,
  accessGranted,
  onLineComplete,
}: TerminalOutputProps) {
  const [bootTime, setBootTime] = useState("");

  useEffect(() => {
    const now = new Date();
    setBootTime(now.toISOString().replace("T", " ").substring(0, 19));
  }, []);

  return (
    <div className="fixed inset-0 overflow-hidden flex flex-col bg-black text-[#cfcfcf] font-mono z-20">

      {/* Header */}
      <div className="flex justify-between items-center px-6 md:px-12 py-4 border-b border-slate-900/60 text-xs uppercase tracking-wider flex-shrink-0">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#7aff7a] animate-pulse" />
          <span className="font-bold text-[#7aff7a]">
            KRISHI.OS V1.0.4
          </span>
          <span className="hidden md:inline text-slate-600">
            | AI ENGINEER PORTFOLIO SYSTEM
          </span>
        </div>

        <div className="hidden md:block text-slate-500">
          {bootTime}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex items-center justify-center px-6 overflow-hidden">
        <div className="w-full max-w-4xl flex flex-col items-center">

          {/* KRISHI.OS Logo */}
          <div className="mb-8 text-center select-none">

            <pre
              className="
          text-[#7aff7a]
          font-bold
          leading-none
          whitespace-pre
          overflow-hidden
          text-[6px]
          min-[380px]:text-[8px]
          min-[480px]:text-[10px]
          sm:text-[14px]
          md:text-[18px]
          lg:text-[22px]
        "
            >
              {String.raw`
  _  _______  _____  _____ _    _ _____    ____   _____ 
 | |/ /  __ \|_   _|/ ____| |  | |_   _|  / __ \ / ____|
 | ' /| |__) | | | | (___ | |__| | | |   | |  | | (___  
 |  < |  _  /  | |  \___ \|  __  | | |   | |  | |\___ \ 
 | . \| | \ \ _| |_ ____) | |  | |_| |_  | |__| |____) |
 |_|\_\_|  \_\_____|_____/|_|  |_|_____|  \____/|_____/ 
                                                        
`}
            </pre>

            <div className="mt-6">
              {/* <h1 className="text-[#7aff7a] text-2xl md:text-4xl font-bold tracking-[0.4em]">
                KRISHI.OS
              </h1> */}

              <p className="mt-4 text-[#7aff7a]/80 uppercase tracking-[0.25em] text-sm md:text-lg">
                System Boot Initialization
              </p>

              <p className="mt-2 text-slate-500 uppercase tracking-[0.2em] text-xs md:text-sm">
                Establishing Virtual Machine Memory Pipelines...
              </p>
            </div>
          </div>

          {/* Boot Sequence */}
          <div className="w-full max-w-2xl space-y-4">

            {bootLinesData.map((line, idx) => {
              const isCompleted = completedLines.includes(line);
              const isActive = currentLineIndex === idx;

              return (
                <BootLine
                  key={line}
                  text={line}
                  isCompleted={isCompleted}
                  isActive={isActive}
                  onComplete={onLineComplete}
                />
              );
            })}

            {accessGranted && (
              <div className="mt-6 border-t border-slate-800/80 pt-4 space-y-1.5 text-left w-full max-w-md mx-auto">
                <div className="text-slate-400 text-xs font-mono">
                  krishi.os login: <span className="text-[#7aff7a]">guest</span> (auto-authenticating)
                </div>
                <div className="text-[#7aff7a] font-bold text-xs font-mono">
                  [ok] Guest session established. Loading system profile...
                </div>
                <div className="text-[#7aff7a] font-bold text-xs font-mono animate-pulse">
                  [ok] portfolio.launch
                </div>
                <div className="mt-4 text-center">
                  <span className="text-[#7aff7a] text-lg md:text-xl font-bold tracking-[0.3em] uppercase">
                    ACCESS GRANTED
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {/* Footer */}
      <div className="flex justify-between items-center px-6 md:px-12 py-4 border-t border-slate-900/60 text-xs uppercase tracking-wider flex-shrink-0">
        <div className="flex items-center gap-2">
          {!accessGranted ? (
            <>
              <span className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
              <span className="animate-pulse">
                Connecting to KRISHI.OS
              </span>
            </>
          ) : (
            <>
              <span className="w-2 h-2 rounded-full bg-[#7aff7a]" />
              <span className="text-[#7aff7a]">
                Connection Established
              </span>
            </>
          )}
        </div>

        <div className="text-slate-500 font-mono text-[10px] md:text-xs">
          Press ESC or Tap to Skip
        </div>
      </div>
    </div>
  );
}