"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Terminal, Shield, ArrowUpRight, Cpu, Search } from "lucide-react";
import { useScrollPosition } from "@/hooks/useScrollPosition";
import CommandPalette from "@/components/ui/CommandPalette";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const scrolled = useScrollPosition(20);
  const [activeHash, setActiveHash] = useState("");
  const [blink, setBlink] = useState(true);
  const [isPaletteOpen, setIsPaletteOpen] = useState(false);

  // Track CMD+K or CTRL+K
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setIsPaletteOpen((prev) => !prev);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Track cursor blink
  useEffect(() => {
    const interval = setInterval(() => {
      setBlink((prev) => !prev);
    }, 500);
    return () => clearInterval(interval);
  }, []);

  // Sync scroll hash anchor
  useEffect(() => {
    const handleHashChange = () => {
      setActiveHash(window.location.hash || "");
    };
    handleHashChange();
    window.addEventListener("hashchange", handleHashChange);
    return () => window.removeEventListener("hashchange", handleHashChange);
  }, []);

  const navLinks = [
    { name: "./projects", href: "/#projects", hash: "#projects" },
    { name: "./system-map", href: "/#system-map", hash: "#system-map" },
    { name: "./career", href: "/#career", hash: "#career" },
    { name: "./currently-building", href: "/#currently-building", hash: "#currently-building" },
    { name: "./leadership", href: "/#leadership", hash: "#leadership" },
    { name: "./contact", href: "/#contact", hash: "#contact" }
  ];

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled || isOpen
        ? "py-3 bg-[#080c14]/90 backdrop-blur-md border-b border-slate-900"
        : "py-5 bg-transparent border-b border-transparent"
        }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
        {/* Left Side: OS Badge and Status Indicator */}
        <div className="flex items-center space-x-4">
          <Link href="/" className="flex items-center space-x-2 group">
            <span className="w-7 h-7 rounded bg-[#10b981]/10 border border-[#10b981]/30 flex items-center justify-center font-mono font-bold text-xs text-[#10b981] group-hover:bg-[#10b981] group-hover:text-black transition-all duration-300">
              K
            </span>
            <span className="font-mono text-xs font-bold tracking-wider text-slate-200 group-hover:text-[#10b981] transition-colors uppercase">
              KRISHI.OS
            </span>
          </Link>

          <div className="hidden md:flex items-center space-x-1.5 bg-slate-950/60 border border-slate-900 rounded px-2.5 py-0.5 font-mono text-[9px] text-slate-500">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
            <span className="uppercase text-slate-400">SYS: ONLINE</span>
            <span className="text-slate-700">|</span>
            <span className="uppercase text-slate-500">tty1</span>
          </div>
        </div>

        {/* Center: Workstation Console links */}
        <nav className="hidden md:flex items-center space-x-6">
          {navLinks.map((link) => {
            const isActive = activeHash === link.hash;

            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setActiveHash(link.hash)}
                className={`font-mono text-[12px] transition-colors relative py-1 hover:text-[#10b981] ${isActive ? "text-[#10b981] font-bold" : "text-slate-400"
                  }`}
              >
                <span>{link.name}</span>
                {isActive && (
                  <span className="text-[#10b981] text-[10px] ml-0.5 select-none font-bold">
                    {blink ? "_" : " "}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Side: Resume Command Action */}
        <div className="hidden md:flex items-center">
          <button
            onClick={() => setIsPaletteOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded bg-slate-950 border border-slate-900 hover:border-[#10b981]/40 font-mono text-[11px] text-slate-400 hover:text-[#10b981] transition-all duration-300 cursor-pointer"
          >
            <span>./command-palette</span>
            <Search size={10} className="text-[#10b981]" />
          </button>
        </div>

        {/* Mobile menu prompt toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden flex items-center justify-center px-2.5 py-1.5 rounded border border-slate-900 bg-slate-950 font-mono text-[11px] text-slate-400 hover:text-[#10b981] hover:border-[#10b981]/30 transition-all cursor-pointer"
          aria-label="Toggle command shell"
        >
          {isOpen ? "[ CLOSE ]" : "[ ls -la ]"}
        </button>
      </div>

      {/* Mobile Workstation Command Shell Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: "easeInOut" }}
            className="md:hidden bg-[#080c14] border-b border-slate-900 absolute top-full left-0 right-0 overflow-hidden shadow-2xl"
          >
            <div className="px-6 py-6 font-mono text-left space-y-4">

              {/* Shell CLI Prompt Execution */}
              <div className="flex items-center space-x-1.5 text-xs">
                <span className="text-[#10b981]">krishi@stack:~$</span>
                <span className="text-slate-100">ls -la</span>
              </div>

              {/* Directory File listing outputs */}
              <div className="text-[11px] text-slate-500 space-y-1.5 pt-1 pl-1 select-none border-l border-slate-900">
                <div className="text-[10px] text-slate-600 uppercase tracking-wider mb-2">
                  total 42 // folders mapped to sections
                </div>

                {navLinks.map((link) => (
                  <div key={link.name} className="flex items-center hover:bg-slate-900/60 py-1 rounded transition-colors px-1">
                    <span className="text-slate-600 w-28 shrink-0">drwxr-xr-x 1 krishi</span>
                    <Link
                      href={link.href}
                      onClick={() => {
                        setActiveHash(link.hash);
                        setIsOpen(false);
                      }}
                      className="text-slate-200 hover:text-[#10b981] hover:font-bold transition-all block flex-1"
                    >
                      {link.name}
                    </Link>
                  </div>
                ))}

                {/* Resume pdf reference link */}
                <div className="flex items-center hover:bg-slate-900/60 py-1 rounded transition-colors px-1">
                  <span className="text-slate-600 w-28 shrink-0">-rwxr-xr-x 1 krishi</span>
                  <button
                    onClick={() => {
                      setIsOpen(false);
                      setIsPaletteOpen(true);
                    }}
                    className="text-slate-200 hover:text-amber-500 transition-all flex items-center gap-1 flex-1 text-left cursor-pointer"
                  >
                    <span>./command-palette</span>
                    <span className="text-slate-600 text-[10px]">{"->"} cmd_palette</span>
                    <Search size={10} className="text-slate-650" />
                  </button>
                </div>
              </div>

              {/* Console diagnostic footer */}
              <div className="pt-4 border-t border-slate-900/50 flex items-center justify-between text-[9px] text-slate-600">
                <div className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                  <span>SECURE_SHELL: ACTIVE</span>
                </div>
                <span>tty_mobile</span>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <CommandPalette isOpen={isPaletteOpen} onClose={() => setIsPaletteOpen(false)} />
    </header>
  );
}
