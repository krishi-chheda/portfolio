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

  // Safe timer boundary to ensure loading never exceeds 2 seconds
  useEffect(() => {
    const safetyTimeout = setTimeout(() => {
      setMounted(false);
      onComplete();
    }, 2000);

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
            onClick={() => {
              setMounted(false);
              onComplete();
            }}
            className="fixed inset-0 z-50 bg-bg flex items-center justify-center font-mono cursor-pointer"
          >
            <div className="text-center text-ink-soft text-xs animate-pulse">
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
          onClick={() => {
            setMounted(false);
            onComplete();
          }}
          className="fixed inset-0 z-50 bg-bg overflow-hidden flex flex-col items-stretch cursor-pointer select-none"
        >
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
