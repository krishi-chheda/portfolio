import { useState, useCallback } from "react";
import { bootLinesData } from "@/lib/data";

export function useBootSequence(onComplete: () => void) {
  const [currentLineIndex, setCurrentLineIndex] = useState(0);
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [accessGranted, setAccessGranted] = useState(false);

  const handleLineComplete = useCallback(() => {
    if (currentLineIndex < bootLinesData.length) {
      // Mark current line as completed
      setCompletedLines((prev) => [...prev, bootLinesData[currentLineIndex]]);
      // Trigger next line
      setCurrentLineIndex((prev) => prev + 1);
    } else if (currentLineIndex === bootLinesData.length) {
      // Completed all personalized lines, now trigger access granted
      setAccessGranted(true);
      setCurrentLineIndex((prev) => prev + 1);
      
      // Delay portfolio entry by 1200ms
      setTimeout(() => {
        onComplete();
      }, 1200);
    }
  }, [currentLineIndex, onComplete]);

  return {
    currentLineIndex,
    completedLines,
    accessGranted,
    handleLineComplete,
  };
}
