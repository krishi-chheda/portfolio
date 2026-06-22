import { ButtonHTMLAttributes, forwardRef, ReactNode } from "react";
import { cn } from "@/lib/utils";

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "terminal" | "ghost";
  size?: "sm" | "md" | "lg";
  children: ReactNode;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", children, ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center font-mono rounded transition-all duration-300 active:scale-[0.98] cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none",
          // Variant options
          variant === "primary" && "bg-cyan-500 hover:bg-cyan-400 text-black font-semibold shadow-[0_0_15px_rgba(6,182,212,0.2)] hover:shadow-[0_0_20px_rgba(6,182,212,0.45)]",
          variant === "secondary" && "bg-slate-950/40 border border-slate-800 text-slate-300 hover:bg-slate-900/60 hover:border-slate-700",
          variant === "outline" && "border border-slate-700 bg-slate-900/50 text-slate-300 hover:border-cyan-500 hover:text-cyan-400 hover:bg-cyan-950/20",
          variant === "terminal" && "bg-cyan-950 border border-cyan-800 hover:bg-cyan-500 hover:text-black text-cyan-400",
          variant === "ghost" && "text-slate-500 hover:text-cyan-450",
          // Sizes
          size === "sm" && "text-[11px] px-3.5 py-1.5",
          size === "md" && "text-xs px-4 py-2.5",
          size === "lg" && "text-sm px-6 py-3",
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);
Button.displayName = "Button";

export default Button;
