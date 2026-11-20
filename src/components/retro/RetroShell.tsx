// The page frame for KRISHI.WORLD's plain pages (/classic, /now, 404): green top bar with the universal
// navigation (Adventure, Resume, Contact, Main Menu) over the dotted grass background. Server component.
import type { ReactNode } from "react";
import Link from "next/link";
import { PIXEL } from "@/components/retro/styles";
import { contact } from "@/lib/data";
import { pixelFont } from "@/lib/pixelFont";

const NAV = "border-2 border-[#46382b] bg-[#f5e8c8] px-2.5 py-0.5 text-sm text-[#2b2420] shadow-[2px_2px_0_#46382b] hover:bg-[#f5c65b] lg:text-base";

export default function RetroShell({ subtitle, contactHref = "/classic#contact", children }: { subtitle: string; contactHref?: string; children: ReactNode }) {
  return (
    <div className={`${pixelFont.variable} ${PIXEL} min-h-screen bg-[#78b85a] bg-[radial-gradient(#5e9e48_1.5px,transparent_1.5px)] bg-[length:16px_16px] text-[#2b2420]`}>
      <header className="relative top-0 z-30 border-b-4 border-[#46382b] bg-[#285943] text-[#f5e8c8] sm:sticky">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-2 sm:px-6">
          <Link href="/" className="text-lg tracking-[0.15em] sm:text-xl">
            KRISHI.WORLD <span className="hidden text-[#f5c65b] lg:inline">· {subtitle}</span>
          </Link>
          <nav aria-label="Modes" className="flex flex-wrap gap-2">
            <Link href="/world" className={`${NAV} bg-[#f5c65b]`}>
              ▶ Adventure
            </Link>
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className={NAV}>
              Resume ↗
            </a>
            <a href={contactHref} className={`${NAV} hidden sm:inline-block`}>
              Contact
            </a>
            <Link href="/" className={NAV}>
              Main Menu
            </Link>
          </nav>
        </div>
      </header>
      {children}
    </div>
  );
}
