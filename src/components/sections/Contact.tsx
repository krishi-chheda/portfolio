"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Send, CheckCircle2, MessageSquare } from "lucide-react";
import { Github, Linkedin } from "@/components/ui/Icons";
import Card from "../ui/Card";
import Button from "@/components/ui/Button";

export default function Contact() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "sending" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) return;

    setStatus("sending");

    // Simulate sending progress
    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", message: "" });
    }, 1500);
  };

  return (
    <section id="contact" className="py-24 relative overflow-hidden border-t border-slate-900/60 select-none">
      <div className="max-w-4xl mx-auto px-6">

        {/* Section Header CLI Prompt */}
        <div className="font-mono text-xs md:text-sm text-slate-500 mb-8 flex items-center space-x-2 select-none justify-center">
          <span className="text-[#10b981]">krishi@stack:~$</span>
          <span className="text-slate-100">ssh guest@krishi</span>
        </div>

        {/* OS Terminal Shell Window */}
        <div className="w-full border border-slate-900 bg-slate-950/20 backdrop-blur-md rounded-xl overflow-hidden shadow-2xl flex flex-col font-mono terminal-highlight">

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
                  Whether you are looking for a founding engineer, want to discuss LLM agent design, or need to plan MDAS analytics strategies—reach out.
                </p>
              </div>

              {/* Recruiter Availability Widget */}
              <div className="p-4 rounded border border-emerald-950/60 bg-emerald-950/5 border-emerald-500/10 space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-[#10b981] uppercase tracking-wider font-mono">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10b981] animate-pulse" />
                  Availability Status
                </div>
                <p className="text-[11px] text-slate-350 leading-relaxed font-sans select-text">
                  <strong>Open to Opportunities:</strong> Actively seeking full-time or contract roles as an <strong>AI Engineer</strong>, <strong>Full-Stack Developer</strong>, or <strong>Founding Engineer</strong> in Melbourne, Sydney, or remote.
                </p>
              </div>

              <div className="space-y-2 font-mono text-[11px] text-slate-400">
                <a
                  href="mailto:krishichheda10@gmail.com"
                  className="flex items-center gap-3 p-3 rounded border border-slate-900 bg-slate-950/40 hover:border-cyan-500/30 hover:text-cyan-400 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5 text-cyan-400" />
                  <span>krishichheda10@gmail.com</span>
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
                      disabled={status === "sending" || status === "success"}
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
                      disabled={status === "sending" || status === "success"}
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
                      disabled={status === "sending" || status === "success"}
                    />
                  </div>

                </div>

                {/* Submit button */}
                <Button
                  type="submit"
                  disabled={status === "sending" || status === "success"}
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
                    {status === "sending" && (
                      <motion.span
                        key="sending"
                        className="flex items-center gap-1.5 text-xs"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <span className="w-3 h-3 rounded-full border border-cyan-400 border-t-transparent animate-spin" />
                        <span>transmitting packets...</span>
                      </motion.span>
                    )}
                    {status === "success" && (
                      <motion.span
                        key="success"
                        className="flex items-center gap-1.5 text-xs text-emerald-450"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>packet transmission successful!</span>
                      </motion.span>
                    )}
                  </AnimatePresence>
                </Button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
