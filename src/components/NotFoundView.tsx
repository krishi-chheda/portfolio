"use client";

import { useLayoutEffect, useRef } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Footer from "@/components/Footer";

const ROUTES = [
  { cmd: "cd ~", desc: "back to the homepage", href: "/" },
  { cmd: "ls -la projects/", desc: "the four featured projects", href: "/#projects" },
  { cmd: "open system-map", desc: "how the work connects", href: "/#system-map" },
  { cmd: "cat README.md", desc: "how KRISHI.OS works", href: "/readme" },
  { cmd: "ssh guest@krishi.os", desc: "get in touch", href: "/#contact" },
];

export default function NotFoundView() {
  const pathname = usePathname();
  const rootRef = useRef<HTMLElement>(null);

  // GSAP is loaded on demand: the root 404 sits in the layout tree, and a static import here would ship a
  // second copy of the animation code alongside every page.
  useLayoutEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    let mm: gsap.MatchMedia | undefined;
    let cancelled = false;
    Promise.all([import("gsap"), import("@/lib/motion")]).then(([{ default: gsap }, { DUR, EASE, MOTION_OK, RISE, scrambleText }]) => {
      if (cancelled) return;
      mm = gsap.matchMedia();
      mm.add(
      MOTION_OK,
      () => {
        const tl = gsap.timeline({ defaults: { ease: EASE } });
        const code = root.querySelector<HTMLElement>('[data-nf="code"]');
        const restores: (() => void)[] = [];
        if (code) {
          const { tween, restore } = scrambleText(code, 0.8);
          tl.add(tween, 0);
          restores.push(restore);
        }
        tl.from('[data-nf="line"]', { clipPath: "inset(0 100% 0 0)", duration: 0.4, ease: "steps(24)", stagger: 0.25 }, 0.2)
          .from('[data-nf="route"]', { y: RISE.item, opacity: 0, duration: DUR.standard, stagger: 0.05 }, 0.8);
        return () => restores.forEach((fn) => fn());
      },
      root
    );
    });
    return () => {
      cancelled = true;
      mm?.revert();
    };
  }, []);

  return (
    <>
      <main ref={rootRef} className="flex-1 mx-auto w-full max-w-6xl px-6 pt-24 pb-24">
        <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">
          <span className="text-accent">§ 404</span> · not found
        </p>

        <h1 className="mt-8 font-bold leading-none tracking-tight text-[clamp(5rem,22vw,14rem)]">
          <span data-nf="code" className="text-accent">404</span>
        </h1>

        <div className="mt-10 space-y-2 text-xs md:text-sm break-all">
          <div data-nf="line">
            <span className="text-accent">krishi@stack:~$</span> <span className="text-ink">cd {pathname}</span>
          </div>
          <div data-nf="line" className="text-ink-soft">
            zsh: no such file or directory: <span className="text-gold">{pathname}</span>
          </div>
        </div>

        <div className="mt-12 border-t border-rule pt-6">
          <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint mb-4">available commands</p>
          <ul className="border-l border-rule">
            {ROUTES.map((r) => (
              <li key={r.cmd} data-nf="route">
                <Link
                  href={r.href}
                  className="group flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-rule px-4 py-3 text-sm transition-colors duration-150 hover:bg-bg-2"
                >
                  <span className="text-accent group-hover:text-accent-2">&gt; {r.cmd}</span>
                  <span className="text-[11px] text-ink-faint">{r.desc}</span>
                </Link>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-[11px] text-ink-faint">
            or head back to <Link href="/" className="text-accent hover:text-accent-2">krishi.os</Link>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
