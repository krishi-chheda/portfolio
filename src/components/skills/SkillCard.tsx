"use client";

import { motion } from "framer-motion";
import { SkillCategory } from "@/lib/data";
import SkillItem from "./SkillItem";
import Card from "../ui/Card";

interface SkillCardProps {
  category: SkillCategory;
  index: number;
}

export default function SkillCard({ category, index }: SkillCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.1 }}
      className="w-full"
    >
      <Card className="h-full border-slate-800/60 bg-slate-950/20 hover:border-cyan-500/10 hover:shadow-[0_0_20px_rgba(6,182,212,0.04)] p-5">
        {/* TOML Category Header */}
        <h3 className="font-mono text-xs text-orange-400 font-bold mb-3 select-none">
          [{category.title}]
        </h3>

        {/* Skill Elements List */}
        <div className="space-y-1">
          {category.skills.map((skill) => (
            <SkillItem key={skill} name={skill} />
          ))}
        </div>
      </Card>
    </motion.div>
  );
}
