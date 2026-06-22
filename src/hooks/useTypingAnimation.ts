import { useState, useEffect } from "react";

export function useTypingAnimation(text: string, speed = 50, delay = 100) {
  const [displayText, setDisplayText] = useState("");
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    setDisplayText("");
    setIsComplete(false);

    let isMounted = true;
    let timerId: NodeJS.Timeout;

    const startTimeout = setTimeout(() => {
      let index = 0;
      
      const type = () => {
        if (!isMounted) return;
        if (index <= text.length) {
          setDisplayText(text.slice(0, index));
          index++;
          timerId = setTimeout(type, speed);
        } else {
          setIsComplete(true);
        }
      };

      type();
    }, delay);

    return () => {
      isMounted = false;
      clearTimeout(startTimeout);
      clearTimeout(timerId);
    };
  }, [text, speed, delay]);

  return { displayText, isComplete };
}
