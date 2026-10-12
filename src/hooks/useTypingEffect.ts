import { useState, useEffect } from "react";

export function useTypingEffect(text: string, speed = 30, onComplete?: () => void) {
  const [typed, setTyped] = useState({ text, count: 0 });

  // Restart from zero whenever the target text changes (reset during render, not in an effect)
  if (typed.text !== text) {
    setTyped({ text, count: 0 });
  }
  const count = typed.text === text ? typed.count : 0;

  useEffect(() => {
    if (!text) return;
    if (count >= text.length) {
      onComplete?.();
      return;
    }
    const timerId = setTimeout(() => setTyped((s) => ({ ...s, count: s.count + 1 })), speed);
    return () => clearTimeout(timerId);
  }, [text, count, speed, onComplete]);

  return text.slice(0, count);
}
