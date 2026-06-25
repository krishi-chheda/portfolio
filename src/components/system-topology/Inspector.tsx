import { motion, AnimatePresence } from "framer-motion";
import { TopologyNodeData } from "./topologyData";

interface InspectorProps {
  activeNode: TopologyNodeData | null;
  nodes: TopologyNodeData[];
  connectedNodeNames: string[];
}

export default function Inspector({
  activeNode,
  nodes,
  connectedNodeNames
}: InspectorProps) {
  return (
    <div className="lg:col-span-1 flex flex-col h-full min-h-[220px]">
      {/* Panel Header */}
      <div className="bg-slate-950/80 px-4 py-2 border border-slate-900 flex justify-between items-center rounded-t-xl select-none font-mono">
        <div className="flex items-center space-x-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500/60" />
          <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/60" />
          <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/60 animate-pulse" />
        </div>
        <span className="text-[9px] text-slate-500 uppercase tracking-widest">
          Node Inspector
        </span>
      </div>

      {/* Panel Body */}
      <div className="flex-1 border border-t-0 border-slate-900 bg-[#0d1321]/20 backdrop-blur-md rounded-b-xl overflow-hidden relative min-h-[200px] flex flex-col justify-stretch">
        <AnimatePresence mode="wait">
          {activeNode && activeNode.group !== "decorative" ? (
            <motion.div
              key={activeNode.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.18 }}
              className="p-5 flex flex-col justify-between h-full relative font-mono text-xs text-slate-300"
            >
              {/* Top Accent Strip */}
              <div
                className="absolute top-0 left-0 right-0 h-0.5 transition-colors duration-300"
                style={{
                  backgroundColor:
                    activeNode.group === "category" ? "#06b6d4" :
                      activeNode.group === "project" ? "#10b981" :
                        activeNode.group === "leadership" ? "#a855f7" : "#64748b"
                }}
              />

              <div className="space-y-4">
                {/* Node Label */}
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-0.5">
                    NODE
                  </span>
                  <h3 className="text-sm font-bold text-white tracking-tight leading-tight uppercase">
                    {activeNode.label}
                  </h3>
                </div>

                {/* Status and Domain */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-0.5">
                      STATUS
                    </span>
                    <span
                      className={`text-[10px] font-bold ${
                        activeNode.status === "SYSTEM" ? "text-cyan-400" : "text-emerald-400"
                      }`}
                    >
                      {activeNode.status || "ACTIVE"}
                    </span>
                  </div>

                  {activeNode.parentId && (
                    <div>
                      <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-0.5">
                        DOMAIN
                      </span>
                      <span className="text-[10px] text-slate-200">
                        {nodes.find((n) => n.id === activeNode.parentId)?.label || "Core"}
                      </span>
                    </div>
                  )}
                </div>

                {/* Dynamic Connected Node Labels */}
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-1">
                    CONNECTED
                  </span>
                  <ul className="space-y-1">
                    {connectedNodeNames.map((name, idx) => (
                      <li key={idx} className="text-[10px] flex items-center gap-1.5 text-slate-300">
                        <span className="w-1 h-1 rounded-full bg-cyan-500/50" />
                        {name}
                      </li>
                    ))}
                    {connectedNodeNames.length === 0 && (
                      <li className="text-[10px] text-slate-600 italic">None</li>
                    )}
                  </ul>
                </div>

                {/* Node Description Metadata */}
                <div>
                  <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-1">
                    METADATA
                  </span>
                  <p className="text-slate-400 text-xs leading-relaxed font-sans select-text">
                    {activeNode.description}
                  </p>
                </div>

                {/* Tech Stack badging */}
                {activeNode.techStack && activeNode.techStack.length > 0 && (
                  <div className="pt-2 border-t border-slate-900/60">
                    <span className="text-[9px] text-slate-500 uppercase tracking-widest block mb-1.5">
                      TECH STACK
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {activeNode.techStack.map((tech, idx) => (
                        <span
                          key={idx}
                          className="px-1.5 py-0.5 rounded bg-slate-950 border border-slate-900 text-[9px] text-slate-400 uppercase tracking-wide"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Action Trigger links */}
              <div className="mt-8 pt-4 border-t border-slate-900/50 space-y-2">
                <span className="text-[9px] text-slate-500 uppercase tracking-widest block">
                  LINKS
                </span>
                <div className="space-y-1.5 text-[10px]">
                  {activeNode.openUrl && (
                    <a
                      href={activeNode.openUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors font-bold"
                    >
                      → Open Project
                    </a>
                  )}
                  {activeNode.githubUrl && (
                    <a
                      href={activeNode.githubUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors font-bold"
                    >
                      → GitHub
                    </a>
                  )}
                  <button
                    onClick={() => window.dispatchEvent(new CustomEvent("open-ai-chat"))}
                    className="flex items-center gap-1 text-cyan-400 hover:text-cyan-300 transition-colors bg-transparent border-none p-0 cursor-pointer font-mono font-bold text-[10px] text-left"
                  >
                    → Ask Krishi
                  </button>
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="p-6 flex-1 flex flex-col justify-center items-center text-center select-none font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-500/70 animate-ping mb-3" />
              <p className="text-slate-500 text-[9px] uppercase tracking-widest max-w-[150px] leading-relaxed">
                Awaiting node focus connection... select a node to inspect variables
              </p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
