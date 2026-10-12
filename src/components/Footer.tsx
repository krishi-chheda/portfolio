"use client";

import Link from "next/link";
import { Mail, ArrowUp } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/Icons";

const iconLink = "p-1 text-ink-faint hover:text-accent transition-colors duration-150";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-rule">
      <div className="mx-auto max-w-6xl px-6 py-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 text-[11px] text-ink-faint">
        <p className="min-w-0">
          <span className="font-bold uppercase tracking-[0.18em] text-ink">Krishi Chheda</span>
          <span className="mx-2">·</span>
          Melbourne, VIC, Australia • Master of Artificial Intelligence @ Monash
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <div className="flex items-center gap-2">
            <a href="https://github.com/krishi-chheda" target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="GitHub">
              <Github className="w-4 h-4" />
            </a>
            <a href="https://linkedin.com/in/krishi-chheda" target="_blank" rel="noopener noreferrer" className={iconLink} aria-label="LinkedIn">
              <Linkedin className="w-4 h-4" />
            </a>
            <a href="mailto:krishichheda10@gmail.com" className={iconLink} aria-label="Email">
              <Mail className="w-4 h-4" />
            </a>
          </div>
          <Link href="/readme" className="hover:text-accent transition-colors duration-150">
            [README.md]
          </Link>
          <span>© {new Date().getFullYear()} • Built with Next.js & Framer Motion</span>
          <button
            type="button"
            onClick={scrollToTop}
            className="p-1 hover:text-accent transition-colors duration-150 cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUp className="w-4 h-4" />
          </button>
        </div>
      </div>
    </footer>
  );
}
