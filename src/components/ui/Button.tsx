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
          "inline-flex items-center justify-center font-mono transition-[color,background-color,border-color,translate,scale] duration-150 ease-out motion-reduce:transition-none active:scale-[0.97] cursor-pointer disabled:opacity-50 disabled:pointer-events-none select-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-accent",
          // Variant options
          variant === "primary" && "bg-accent text-bg hover:bg-accent-2 font-semibold",
          variant === "secondary" && "border border-rule bg-bg-2 text-ink-soft hover:border-accent hover:text-accent",
          variant === "outline" && "border border-rule text-ink-soft hover:border-accent hover:text-accent",
          variant === "terminal" && "border border-rule text-accent hover:border-accent hover:bg-accent hover:text-bg",
          variant === "ghost" && "text-ink-faint hover:text-accent",
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
