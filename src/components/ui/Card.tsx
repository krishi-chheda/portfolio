import { HTMLAttributes } from "react";
import { cn } from "@/lib/utils";

export default function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn("border border-rule bg-bg-2 p-6", className)} {...props} />;
}
