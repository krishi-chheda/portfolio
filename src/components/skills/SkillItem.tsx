"use client";

import { useState } from "react";
import { AnimatePresence } from "framer-motion";
import { skillsDetails } from "@/lib/data";
import SkillDetails from "./SkillDetails";

interface SkillItemProps {
  name: string;
}

export default function SkillItem({ name }: SkillItemProps) {
  const [isHovered, setIsHovered] = useState(false);

  const detail = skillsDetails[name];

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => setIsHovered(false);
  const handleToggle = () => setIsHovered((prev) => !prev);

  // Format display name (e.g. machine_learning -> machine_learning)
  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onClick={handleToggle}
      className="py-1 cursor-pointer font-mono text-xs select-none group"
      role="button"
      tabIndex={0}
      aria-expanded={isHovered}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          handleToggle();
        }
      }}
    >
      <div className="flex items-center space-x-1.5 text-slate-400 group-hover:text-cyan-400 transition-colors">
        <span className="text-slate-600 group-hover:text-cyan-500/70 transition-colors">-</span>
        <span className="font-medium">{name}</span>
      </div>

      <AnimatePresence initial={false}>
        {isHovered && detail && <SkillDetails detail={detail} />}
      </AnimatePresence>
    </div>
  );
}
