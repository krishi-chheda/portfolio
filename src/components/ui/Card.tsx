import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CardProps {
  children: ReactNode;
  className?: string;
  glow?: boolean;
}

export default function Card({ children, className, glow = false }: CardProps) {
  return (
    <div
      className={cn(
        "glass-panel rounded-xl p-6 transition-all duration-300 relative group overflow-hidden",
        glow
          ? "border-cyan-500/10 hover:border-cyan-500/20 hover:shadow-[0_0_20px_rgba(6,182,212,0.08)]"
          : "border-slate-800/40 hover:border-slate-800/80 hover:shadow-xl",
        className
      )}
    >
      {/* Decorative hover gradient spotlight inside the card */}
      <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/0 via-transparent to-emerald-500/0 group-hover:from-cyan-500/5 group-hover:to-emerald-500/5 pointer-events-none transition-all duration-500" />
      
      <div className="relative z-10">{children}</div>
    </div>
  );
}
