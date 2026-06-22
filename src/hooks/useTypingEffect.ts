import { useState, useEffect } from "react";

export function useTypingEffect(text: string, speed = 30, onComplete?: () => void) {
  const [displayText, setDisplayText] = useState("");

  useEffect(() => {
    if (!text) {
      setDisplayText("");
      return;
    }

    setDisplayText("");
    let index = 0;
    let timerId: NodeJS.Timeout;

    const type = () => {
      if (index <= text.length) {
        setDisplayText(text.slice(0, index));
        index++;
        timerId = setTimeout(type, speed);
      } else {
        if (onComplete) onComplete();
      }
    };

    type();

    return () => clearTimeout(timerId);
  }, [text, speed, onComplete]);

  return displayText;
}
