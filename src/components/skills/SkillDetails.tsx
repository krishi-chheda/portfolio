"use client";

import { motion } from "framer-motion";
import { SkillDetail } from "@/lib/data";

interface SkillDetailsProps {
  detail: SkillDetail;
}

export default function SkillDetails({ detail }: SkillDetailsProps) {
  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: "auto" }}
      exit={{ opacity: 0, height: 0 }}
      transition={{ duration: 0.25 }}
      className="pl-4 mt-1 mb-2 font-mono text-[11px] leading-relaxed select-none border-l border-cyan-800/40"
    >
      <div className="text-slate-500">
        <span className="text-purple-400">experience</span> ={" "}
        <span className="text-emerald-400">&ldquo;{detail.experience}&rdquo;</span>
      </div>
      <div>
        <span className="text-purple-400">projects</span> = [
        <div className="pl-4">
          {detail.projects.map((proj, pIdx) => {
            const isLast = pIdx === detail.projects.length - 1;
            return (
              <div key={proj} className="flex items-center">
                <a
                  href="#projects"
                  className="text-cyan-400 hover:underline hover:text-cyan-300 transition-colors"
                >
                  &ldquo;{proj}&rdquo;
                </a>
                {!isLast && <span className="text-slate-500">,</span>}
              </div>
            );
          })}
        </div>
        ]
      </div>
    </motion.div>
  );
}
