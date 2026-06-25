"use client";

import Link from "next/link";
import { Mail, ArrowUpCircle } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/Icons";

export default function Footer() {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <footer className="border-t border-slate-900 bg-[#06080e] py-12 px-6">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between space-y-6 md:space-y-0">

        {/* Info */}
        <div className="flex flex-col items-center md:items-start space-y-2">
          <div className="flex items-center space-x-2">
            <span className="w-6 h-6 rounded-md bg-cyan-950/80 border border-cyan-800/80 flex items-center justify-center font-mono font-bold text-xs text-cyan-400">
              K
            </span>
            <span className="font-heading font-semibold text-xs tracking-wider text-slate-300">
              KRISHI CHHEDA
            </span>
          </div>
          <p className="text-[12px] font-mono text-slate-500 text-center md:text-left">
            Melbourne, VIC, Australia • Master of Artificial Intelligence @ Monash
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center space-x-6">
          <a
            href="https://github.com/krishi-chheda"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-cyan-400 transition-colors p-1"
            aria-label="GitHub"
          >
            <Github className="w-5 h-5" />
          </a>
          <a
            href="https://linkedin.com/in/krishi-chheda"
            target="_blank"
            rel="noopener noreferrer"
            className="text-slate-500 hover:text-cyan-400 transition-colors p-1"
            aria-label="LinkedIn"
          >
            <Linkedin className="w-5 h-5" />
          </a>
          <a
            href="mailto:krishichheda10@gmail.com"
            className="text-slate-500 hover:text-cyan-400 transition-colors p-1"
            aria-label="Email"
          >
            <Mail className="w-5 h-5" />
          </a>
        </div>

        {/* Copyright and Back to Top */}
        <div className="flex items-center space-x-4">
          <Link
            href="/readme"
            className="text-[11px] font-mono text-slate-600 hover:text-cyan-400 transition-colors mr-2 cursor-pointer select-all"
          >
            [README.md]
          </Link>
          <p className="text-[12px] font-mono text-slate-500">
            © {new Date().getFullYear()} • Built with Next.js & Framer Motion
          </p>
          <button
            onClick={scrollToTop}
            className="text-slate-500 hover:text-cyan-400 transition-colors cursor-pointer"
            aria-label="Scroll to top"
          >
            <ArrowUpCircle className="w-5 h-5" />
          </button>
        </div>

      </div>
    </footer>
  );
}
