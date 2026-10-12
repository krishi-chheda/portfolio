"use client";

import { useLayoutEffect, useState } from "react";
import gsap from "gsap";
import { Send, CheckCircle2 } from "lucide-react";
import SectionHeader from "@/components/ui/SectionHeader";
import { useTerminalReveal } from "@/hooks/useTerminalReveal";
import { DUR, EASE, MOTION_OK } from "@/lib/motion";

const CONTACT_EMAIL = "krishichheda10@gmail.com";

export default function Contact() {
  const sectionRef = useTerminalReveal<HTMLElement>();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [status, setStatus] = useState<"idle" | "opened">("idle");

  // Acknowledge the "draft opened" state with a small rise + fade on the button label.
  useLayoutEffect(() => {
    if (status !== "opened") return;
    const mm = gsap.matchMedia();
    mm.add(
      MOTION_OK,
      () => {
        gsap.from("[data-status-label]", { y: 6, opacity: 0, duration: DUR.standard, ease: EASE });
      },
      sectionRef
    );
    return () => mm.revert();
  }, [status, sectionRef]);

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
    <section ref={sectionRef} id="contact" className="py-24 border-t border-rule">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader num="06" title="Contact" command="ssh guest@krishi.os" meta="open to opportunities" />

        <div className="border border-rule bg-bg-2 terminal-highlight" data-reveal="panel">
          <div className="border-b border-rule px-4 py-2 flex flex-wrap justify-between gap-2 text-[11px] text-ink-faint">
            <span>ssh guest@krishi.os</span>
            <span className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-accent" />
              tty_ssh_link
            </span>
          </div>

          <div className="p-6 md:p-10 grid grid-cols-1 md:grid-cols-12 gap-10 items-start">
            {/* Info column */}
            <div className="md:col-span-5 min-w-0 space-y-8">
              <div data-reveal="item" className="space-y-3">
                <h3 className="text-xl font-bold text-ink uppercase tracking-tight">Establish Connection</h3>
                <p className="text-sm leading-relaxed text-ink-soft">
                  Whether you want to discuss AI systems, ML algorithms, software design, or technology consulting strategies, let&apos;s connect.
                </p>
              </div>

              <div data-reveal="item" className="space-y-2">
                <div className="flex items-center gap-2 text-[11px] uppercase tracking-[0.18em] text-accent">
                  <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                  Availability Status
                </div>
                <p className="text-sm leading-relaxed text-ink-soft">
                  <strong className="text-ink">Open to Opportunities:</strong> Actively seeking engineering roles in <strong className="text-ink">AI Engineering</strong>, <strong className="text-ink">Machine Learning</strong>, <strong className="text-ink">Software Engineering</strong>, or <strong className="text-ink">Technology Consulting</strong>.
                </p>
              </div>

              <dl className="space-y-2 text-sm">
                <div data-reveal="item" className="flex gap-4 min-w-0">
                  <dt className="w-20 shrink-0 text-ink-faint">email:</dt>
                  <dd className="min-w-0 break-all">
                    <a href={`mailto:${CONTACT_EMAIL}`} className="text-accent hover:text-accent-2 transition-colors duration-150">
                      {CONTACT_EMAIL}
                    </a>
                  </dd>
                </div>
                <div data-reveal="item" className="flex gap-4 min-w-0">
                  <dt className="w-20 shrink-0 text-ink-faint">linkedin:</dt>
                  <dd className="min-w-0 break-all">
                    <a
                      href="https://linkedin.com/in/krishi-chheda"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-accent hover:text-accent-2 transition-colors duration-150"
                    >
                      linkedin.com/in/krishi-chheda
                    </a>
                  </dd>
                </div>
              </dl>
            </div>

            {/* Form column */}
            <div className="md:col-span-7 min-w-0">
              <form onSubmit={handleSubmit} className="space-y-5">
                <div data-reveal="item" className="space-y-1.5">
                  <label htmlFor="contact-name" className="flex flex-wrap gap-x-2 text-[11px] text-ink-faint">
                    <span className="text-accent">guest@krishi.os:~$</span>
                    <span>name --set</span>
                  </label>
                  <input
                    id="contact-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-bg border border-rule px-3 py-2 text-sm text-ink placeholder:text-ink-faint/60 outline-none focus:border-accent focus-visible:outline-1 focus-visible:outline-offset-0 focus-visible:outline-accent transition-colors duration-150"
                    placeholder="e.g. John Doe"
                  />
                </div>

                <div data-reveal="item" className="space-y-1.5">
                  <label htmlFor="contact-email" className="flex flex-wrap gap-x-2 text-[11px] text-ink-faint">
                    <span className="text-accent">guest@krishi.os:~$</span>
                    <span>email --set</span>
                  </label>
                  <input
                    id="contact-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-bg border border-rule px-3 py-2 text-sm text-ink placeholder:text-ink-faint/60 outline-none focus:border-accent focus-visible:outline-1 focus-visible:outline-offset-0 focus-visible:outline-accent transition-colors duration-150"
                    placeholder="e.g. john@example.com"
                  />
                </div>

                <div data-reveal="item" className="space-y-1.5">
                  <label htmlFor="contact-message" className="flex flex-wrap gap-x-2 text-[11px] text-ink-faint">
                    <span className="text-accent">guest@krishi.os:~$</span>
                    <span>message --write</span>
                  </label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full bg-bg border border-rule px-3 py-2 text-sm text-ink placeholder:text-ink-faint/60 outline-none focus:border-accent focus-visible:outline-1 focus-visible:outline-offset-0 focus-visible:outline-accent transition-colors duration-150 resize-none"
                    placeholder="e.g. Hey Krishi, I saw your project ClinicalBrief and..."
                  />
                </div>

                <button
                  type="submit"
                  data-reveal="item"
                  className="w-full flex items-center justify-center border border-accent px-6 py-3 text-sm text-accent hover:bg-accent hover:text-bg active:scale-[0.98] focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-accent transition-[color,background-color,scale] duration-150 ease-out cursor-pointer"
                >
                  <span key={status} data-status-label className="flex items-center gap-2">
                    {status === "idle" ? (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>./transmit_transmission</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>draft opened in your mail client</span>
                      </>
                    )}
                  </span>
                </button>
                <p data-reveal="item" aria-live="polite" className="text-[11px] text-ink-faint">
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
