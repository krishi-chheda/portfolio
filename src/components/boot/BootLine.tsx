"use client";

import { useTypingEffect } from "@/hooks/useTypingEffect";

interface BootLineProps {
  text: string;
  isCompleted: boolean;
  isActive: boolean;
  onComplete: () => void;
}

export default function BootLine({
  text,
  isCompleted,
  isActive,
  onComplete,
}: BootLineProps) {
  const typedText = useTypingEffect(isActive ? text : "", 15, isActive ? onComplete : undefined);

  if (!isCompleted && !isActive) return null;

  return (
    <div className="flex items-center space-x-2 font-mono text-sm md:text-base select-none">
      <span className="text-accent font-bold">[ok]</span>
      <span className="text-ink">
        {isCompleted ? text : typedText}
      </span>
      {isActive && (
        <span className="inline-block w-2 h-4 bg-accent animate-pulse ml-0.5" />
      )}
    </div>
  );
}
