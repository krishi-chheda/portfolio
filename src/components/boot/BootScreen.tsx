"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useBootSequence } from "../../hooks/useBootSequence";
import { useReducedMotion } from "../../hooks/useReducedMotion";
import TerminalOutput from "./TerminalOutput";

interface BootScreenProps {
  onComplete: () => void;
}

export default function BootScreen({ onComplete }: BootScreenProps) {
  const prefersReducedMotion = useReducedMotion();
  const [mounted, setMounted] = useState(true);

  // Hook handles indexing and delay coordinates
  const { currentLineIndex, completedLines, accessGranted, handleLineComplete } =
    useBootSequence(() => {
      setMounted(false);
      onComplete();
    });

  // Safe timer boundary to ensure loading never exceeds 4.5 seconds
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      setMounted(false);
      onComplete();
    }, 4500);

    return () => clearTimeout(safetyTimeout);
  }, [onComplete]);

  // Escape key bypass listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMounted(false);
        onComplete();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onComplete]);

  // Accessibility bypass check
  if (prefersReducedMotion) {
    return (
      <AnimatePresence>
        {mounted && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="fixed inset-0 z-50 bg-[#000000] flex items-center justify-center font-mono"
          >
            <div className="text-center text-slate-400 text-xs animate-pulse">
              LOADING SYSTEM PROFILE...
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {mounted && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeInOut" }}
          className="fixed inset-0 z-50 bg-[#000000] overflow-hidden flex flex-col items-stretch"
        >
          {/* CRT Screen Glow Backlight */}
          <div
            className="absolute inset-0 pointer-events-none select-none z-10"
            style={{
              background:
                "radial-gradient(circle at 50% 50%, rgba(16, 185, 129, 0.025) 0%, rgba(0, 0, 0, 0) 80%)",
            }}
          />

          {/* CRT Faint Scanline Pattern */}
          <div
            className="absolute inset-0 pointer-events-none select-none z-10 opacity-[0.03]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(rgba(0,0,0,0) 0px, rgba(0,0,0,0) 2px, rgba(16,185,129,1) 2px, rgba(16,185,129,1) 4px)",
            }}
          />

          {/* CRT Screen Flicker overlay */}
          <motion.div
            animate={{
              opacity: [0.99, 1.0, 0.98, 1.0, 0.99, 1.0],
            }}
            transition={{
              repeat: Infinity,
              duration: 0.15,
              ease: "linear",
            }}
            className="absolute inset-0 pointer-events-none select-none z-10 bg-emerald-500/[0.003]"
          />

          {/* Subtle Vignette shadow overlay */}
          <div
            className="absolute inset-0 pointer-events-none select-none z-10"
            style={{
              boxShadow: "inset 0 0 100px rgba(0,0,0,0.9)",
            }}
          />

          {/* Console Core Output */}
          <TerminalOutput
            currentLineIndex={currentLineIndex}
            completedLines={completedLines}
            accessGranted={accessGranted}
            onLineComplete={handleLineComplete}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
