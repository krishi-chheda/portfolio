import { useState } from "react";
import { useTypingAnimation } from "./useTypingAnimation";

export function useTerminalCommand(initialCommand = "skills.toml") {
  const [activeCommand, setActiveCommand] = useState(initialCommand);
  const [targetText, setTargetText] = useState(`cat ${initialCommand}`);

  const { displayText, isComplete } = useTypingAnimation(targetText, 35, 100);

  const selectCommand = (command: string) => {
    if (command === activeCommand) return;
    setActiveCommand(command);
    setTargetText(`cat ${command}`);
  };

  return {
    activeCommand,
    typedText: displayText,
    isTyping: !isComplete,
    selectCommand,
  };
}
