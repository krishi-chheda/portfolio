"use client";

import { motion } from "framer-motion";
import { Terminal as TerminalIcon, ShieldAlert } from "lucide-react";

interface InteractiveTerminalProps {
  title?: string;
  logs: string[];
  statusColor?: "cyan" | "emerald";
}

export default function InteractiveTerminal({
  title = "krishi@monash-ai:~$",
  logs,
  statusColor = "cyan",
}: InteractiveTerminalProps) {
  const accentColorClass =
    statusColor === "emerald"
      ? "text-emerald-400 border-emerald-900/50"
      : "text-cyan-400 border-cyan-900/50";

  return (
    <div className="w-full glass-panel rounded-lg overflow-hidden border border-slate-800/80 shadow-2xl">
      {/* Terminal Title Bar */}
      <div className="bg-slate-950/80 px-4 py-2.5 flex items-center justify-between border-b border-slate-900">
        <div className="flex items-center space-x-2">
          {/* Mock Mac Window Controls */}
          <div className="flex space-x-1.5">
            <span className="w-3 h-3 rounded-full bg-red-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-yellow-500/80 inline-block" />
            <span className="w-3 h-3 rounded-full bg-green-500/80 inline-block" />
          </div>
          <span className="text-xs font-mono text-slate-500 pl-2 select-none flex items-center gap-1.5">
            <TerminalIcon className="w-3 h-3" />
            {title}
          </span>
        </div>
        <div className="flex items-center space-x-1 bg-slate-900 px-2 py-0.5 rounded text-[10px] font-mono text-slate-400 border border-slate-800">
          <span className={`w-1.5 h-1.5 rounded-full ${statusColor === "emerald" ? "bg-emerald-500" : "bg-cyan-500"} animate-pulse`} />
          <span>LIVE_INFERENCE</span>
        </div>
      </div>

      {/* Terminal Content */}
      <div className="p-5 font-mono text-xs text-slate-300 space-y-2.5 bg-slate-950/40 min-h-[180px] overflow-y-auto">
        {logs.map((log, index) => {
          let colorClass = "text-slate-400";
          if (log.startsWith("API >") || log.startsWith("SYS  >")) {
            colorClass = "text-slate-400";
          } else if (log.startsWith("AI   >") || log.startsWith("MODEL>")) {
            colorClass = statusColor === "emerald" ? "text-emerald-400" : "text-cyan-400";
          } else if (log.startsWith("OUT  >") || log.startsWith("USER >")) {
            colorClass = "text-slate-200 font-semibold";
          } else if (log.startsWith("DB   >")) {
            colorClass = "text-purple-400";
          }

          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.15, duration: 0.3 }}
              className="flex items-start"
            >
              <span className="text-slate-600 mr-2 select-none">{(index + 1).toString().padStart(2, "0")}</span>
              <span className={colorClass}>{log}</span>
            </motion.div>
          );
        })}

        {/* Typing Line */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: [0, 1, 0] }}
          transition={{ repeat: Infinity, duration: 1 }}
          className={`inline-block w-2 h-3.5 ml-1 ${statusColor === "emerald" ? "bg-emerald-500" : "bg-cyan-500"}`}
        />
      </div>
    </div>
  );
}
