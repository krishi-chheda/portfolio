"use client";

import { useEffect } from "react";
import { useBootSequence } from "../../hooks/useBootSequence";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import TerminalOutput from "./TerminalOutput";

interface BootScreenProps {
  onComplete: () => void;
}

// Unmounting and the exit fade are owned by BootWrapper's presence wrapper; this component only signals completion.
export default function BootScreen({ onComplete }: BootScreenProps) {
  const prefersReducedMotion = useReducedMotion();

  // Hook handles indexing and delay coordinates
  const { currentLineIndex, completedLines, accessGranted, handleLineComplete } =
    useBootSequence(onComplete);

  // Safe timer boundary to ensure loading never exceeds 2 seconds
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      onComplete();
    }, 2000);

    return () => clearTimeout(safetyTimeout);
  }, [onComplete]);

  // Escape key bypass listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        onComplete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onComplete]);

  // Accessibility bypass check
  if (prefersReducedMotion) {
    return (
      <div
        onClick={onComplete}
        className="fixed inset-0 z-50 bg-bg flex items-center justify-center font-mono cursor-pointer"
      >
        <div className="text-center text-ink-soft text-xs animate-pulse">
          LOADING SYSTEM PROFILE...
        </div>
      </div>
    );
  }

  return (
    <div
      onClick={onComplete}
      className="fixed inset-0 z-50 bg-bg overflow-hidden flex flex-col items-stretch cursor-pointer select-none"
    >
      {/* Console Core Output */}
      <TerminalOutput
        currentLineIndex={currentLineIndex}
        completedLines={completedLines}
        accessGranted={accessGranted}
        onLineComplete={handleLineComplete}
      />
    </div>
  );
}
