"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, CheckCircle2 } from "lucide-react";
import { Linkedin } from "@/components/ui/Icons";
import Button from "@/components/ui/Button";
import { useTerminalReveal } from "@/hooks/useTerminalReveal";

const CONTACT_EMAIL = "krishichheda10@gmail.com";

export default function Contact() {
  const sectionRef = useTerminalReveal<HTMLElement>();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "opened">("idle");

  // No backend: hand the message to the visitor's own mail client.
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    const subject = `Portfolio enquiry from ${formData.name}`;
    const body = `${formData.message}\n\n— ${formData.name} (${formData.email})`;
    window.location.assign(
      `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`
    );
    setStatus("opened");
  };

  return (
    <section ref={sectionRef} id="contact" className="py-24 relative overflow-hidden border-t border-slate-900/60">
      <div className="max-w-4xl mx-auto px-6">

        {/* Section Header CLI Prompt */}
        <div className="font-mono text-xs md:text-sm text-slate-500 mb-8 flex items-center space-x-2 select-none justify-center">
          <span className="text-[#10b981]">krishi@stack:~$</span>
          <span data-reveal="command" className="text-slate-100">ssh guest@krishi</span>
        </div>

        {/* OS Terminal Shell Window */}
        <div className="w-full border border-slate-900 bg-slate-950/20 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono terminal-highlight" data-reveal="panel">

          {/* Title Bar */}
          <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-900 flex justify-between items-center select-none text-[10px] text-slate-500">
            <div className="flex items-center space-x-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500/40 border border-red-500/20" />
              <span className="w-2 h-2 rounded-full bg-yellow-500/40 border border-yellow-500/20" />
              <span className="w-2 h-2 rounded-full bg-green-500/40 border border-green-500/20" />
            </div>
            <span>ssh guest@krishi.os</span>
            <div className="flex items-center space-x-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
              <span>tty_ssh_link</span>
            </div>
          </div>

          {/* Window Body */}
          <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-8 items-start select-text">

            {/* Quick info column */}
            <div className="md:col-span-5 space-y-6">
              <div className="space-y-4">
                <h3 className="text-xl font-bold text-white uppercase tracking-tight">
                  Establish Connection
                </h3>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Whether you want to discuss AI systems, ML algorithms, software design, or technology consulting strategies, let&apos;s connect.
                </p>
              </div>

              {/* Recruiter Availability Widget */}
              <div className="p-4 rounded border border-emerald-950/60 bg-emerald-950/5 border-emerald-500/10 space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#10b981] uppercase tracking-wider font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                  Availability Status
                </div>
                <p className="text-[11px] text-slate-350 leading-relaxed font-sans select-text">
                  <strong>Open to Opportunities:</strong> Actively seeking engineering roles in <strong>AI Engineering</strong>, <strong>Machine Learning</strong>, <strong>Software Engineering</strong>, or <strong>Technology Consulting</strong>.
                </p>
              </div>

              <div className="space-y-2 font-mono text-[11px] text-slate-400">
                <a
                  href={`mailto:${CONTACT_EMAIL}`}
                  className="flex items-center gap-3 p-3 rounded border border-slate-900 bg-slate-950/40 hover:border-cyan-500/30 hover:text-cyan-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>{CONTACT_EMAIL}</span>
                </a>
                <a
                  href="https://linkedin.com/in/krishi-chheda"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 rounded border border-slate-900 bg-slate-950/40 hover:border-cyan-500/30 hover:text-cyan-400 transition-colors"
                >
                  <Linkedin className="w-3.5 h-3.5 text-cyan-400" />
                  <span>linkedin.com/in/krishi-chheda</span>
                </a>
              </div>
            </div>

            {/* Form column */}
            <div className="md:col-span-7">
              <form onSubmit={handleSubmit} className="space-y-6">

                {/* Form fields styled as shell arguments */}
                <div className="space-y-4">

                  {/* Name field */}
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                      <span className="text-[#10b981]">guest@krishi.os:~$</span>
                      <span>name --set</span>
                    </div>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full bg-slate-950/60 border border-slate-900 rounded-md px-3 py-2 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-[#10b981]/50 focus:ring-0 transition-colors"
                      placeholder="e.g. John Doe"
                    />
                  </div>

                  {/* Email field */}
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                      <span className="text-[#10b981]">guest@krishi.os:~$</span>
                      <span>email --set</span>
                    </div>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full bg-slate-950/60 border border-slate-900 rounded-md px-3 py-2 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-[#10b981]/50 focus:ring-0 transition-colors"
                      placeholder="e.g. john@example.com"
                    />
                  </div>

                  {/* Message field */}
                  <div className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2 text-[11px] text-slate-500">
                      <span className="text-[#10b981]">guest@krishi.os:~$</span>
                      <span>message --write</span>
                    </div>
                    <textarea
                      required
                      rows={4}
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      className="w-full bg-slate-950/60 border border-slate-900 rounded-md px-3 py-2 text-xs text-white placeholder-slate-700 focus:outline-none focus:border-[#10b981]/50 focus:ring-0 transition-colors resize-none"
                      placeholder="e.g. Hey Krishi, I saw your project ClinicalBrief and..."
                    />
                  </div>

                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  variant="terminal"
                  size="lg"
                  className="w-full flex items-center justify-center space-x-2 border border-slate-900 hover:border-[#10b981]/30 cursor-pointer"
                >
                  <AnimatePresence mode="wait">
                    {status === "idle" && (
                      <motion.span
                        key="idle"
                        className="flex items-center gap-1.5 text-xs text-slate-300 hover:text-[#10b981]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <Send className="w-3.5 h-3.5" />
                        <span>./transmit_transmission</span>
                      </motion.span>
                    )}
                    {status === "opened" && (
                      <motion.span
                        key="opened"
                        className="flex items-center gap-1.5 text-xs text-emerald-450"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>draft opened in your mail client</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
                <p aria-live="polite" className="text-[11px] text-slate-500 font-sans">
                  {status === "opened"
                    ? `Press send in your mail app to deliver it. Nothing opened? Email ${CONTACT_EMAIL} directly.`
                    : "Opens a pre-filled draft in your own mail client."}
                </p>
              </form>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
