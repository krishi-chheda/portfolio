"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bot, X, Send, Terminal as TermIcon } from "lucide-react";
import { useChat } from "@/hooks/useChat";
import { executeNavigationCommand } from "@/lib/navigation";
import Button from "@/components/ui/Button";

export default function ChatBubble() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, loading, sendMessage } = useChat(
    "Hi, I'm Krishi's AI Assistant. Ask me about his Monash University Master's studies, MDAS leadership, or builds like ClinicalBrief and StudentHub."
  );
  const chatEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Listen to custom event to open the chat window from external CTAs (e.g. Hero section)
    const handleOpenChat = () => {
      setIsOpen(true);
    };
    window.addEventListener("open-ai-chat", handleOpenChat);
    return () => window.removeEventListener("open-ai-chat", handleOpenChat);
  }, []);

  useEffect(() => {
    if (isOpen) {
      chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen, loading]);

  const handleSend = (text: string) => {
    sendMessage(text);
    setInput("");
  };

  const quickQuestions = [
    "Tell me about ClinicalBrief",
    "Is Krishi open to jobs?",
    "What is his role at MDAS?",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end font-mono">
      {/* Floating Circle Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="w-14 h-14 rounded-full bg-gradient-to-tr from-cyan-500 to-cyan-600 text-black flex items-center justify-center shadow-lg hover:shadow-[0_0_25px_rgba(6,182,212,0.45)] hover:scale-105 transition-all duration-300 group cursor-pointer"
            aria-label="Ask Krishi AI"
          >
            <Bot className="w-6 h-6 group-hover:rotate-6 transition-transform" />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Expanded Terminal Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 50, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="w-[90vw] sm:w-[380px] h-[500px] rounded-xl overflow-hidden glass-panel border border-cyan-500/20 shadow-2xl flex flex-col mb-2"
          >
            {/* Header bar */}
            <div className="bg-slate-950 px-4 py-3 flex items-center justify-between border-b border-slate-900">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                  <TermIcon className="w-3 h-3 text-cyan-400" />
                  ASK_KRISHI_AGENT.sh
                </span>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-500 hover:text-white transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Message Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-xs bg-slate-950/20">
              {messages.map((msg, index) => {
                const isUser = msg.role === "user";
                return (
                  <div
                    key={index}
                    className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-lg px-3 py-2.5 leading-relaxed ${
                        isUser
                          ? "bg-cyan-950/60 border border-cyan-800/40 text-cyan-200"
                          : "bg-slate-900/60 border border-slate-800/60 text-slate-300"
                      }`}
                    >
                      <span className="block text-[9px] text-slate-500 uppercase tracking-widest mb-1 select-none">
                        {isUser ? "USER >" : "AGENT >"}
                      </span>
                      <p className="whitespace-pre-line">{msg.content}</p>

                      {!isUser && msg.suggestedCommand && (
                        <div className="mt-3 pt-2 border-t border-slate-800/60 font-mono text-[10px]">
                          <span className="text-slate-500 uppercase tracking-wider block mb-1 select-none">
                            Suggested Command:
                          </span>
                          <button
                            type="button"
                            onClick={() => executeNavigationCommand(msg.suggestedCommand!)}
                            className="text-cyan-400 hover:text-cyan-300 transition-colors flex items-center space-x-1 cursor-pointer text-left font-bold"
                          >
                            <span>&gt; {msg.suggestedCommand}</span>
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}

              {loading && (
                <div className="flex justify-start">
                  <div className="bg-slate-900/60 border border-slate-800/60 rounded-lg px-3 py-2.5 max-w-[85%]">
                    <span className="block text-[9px] text-slate-500 uppercase mb-1">AGENT &gt;</span>
                    <span className="flex gap-1 items-center py-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                    </span>
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick Questions tags */}
            {messages.length === 1 && (
              <div className="px-4 py-2 border-t border-slate-900 bg-slate-950/40 space-y-1.5">
                <span className="text-[9px] text-slate-600 uppercase tracking-wide">QUICK INQUIRY:</span>
                <div className="flex flex-wrap gap-1.5">
                  {quickQuestions.map((q) => (
                    <Button
                      key={q}
                      onClick={() => handleSend(q)}
                      variant="outline"
                      size="sm"
                      className="text-[10px] px-2 py-1 text-cyan-400 hover:text-black hover:bg-cyan-500 transition-colors text-left font-mono inline-block w-auto border-cyan-900/50"
                    >
                      {q}
                    </Button>
                  ))}
                </div>
              </div>
            )}

            {/* Form Input area */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(input);
              }}
              className="p-3 bg-slate-950 border-t border-slate-900 flex items-center space-x-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask about studies, skills, projects..."
                className="flex-1 bg-slate-900/60 border border-slate-800 rounded px-3 py-2 text-xs text-white placeholder-slate-600 focus:outline-none focus:border-cyan-500 focus:ring-1 focus:ring-cyan-500/10"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={loading || !input.trim()}
                variant="terminal"
                className="p-2 min-h-[32px] w-[32px] flex items-center justify-center rounded"
                aria-label="Send"
              >
                <Send className="w-3.5 h-3.5" />
              </Button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
