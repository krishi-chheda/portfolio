"use client";

import { useState, useEffect, useLayoutEffect, useRef, ReactNode, createContext, useContext } from "react";
import gsap from "gsap";
import BootScreen from "./BootScreen";
import { usePresence, type PresenceMotion } from "@/hooks/usePresence";

// Lets entrance animations wait until the boot screen has cleared, instead of playing hidden behind it.
// Defaults to true so pages without a boot screen (/readme, /now) never wait.
const BootContext = createContext(true);
export const useBooted = () => useContext(BootContext);

// Boot screen is already fully visible on load. Exit is a CRT power-off: it collapses to a horizontal line, then fades.
const BOOT_PRESENCE: PresenceMotion = {
  from: { opacity: 1 },
  exit: { clipPath: "inset(49.9% 0 49.9% 0)", opacity: 0.4 },
  exitDuration: 0.35,
};

interface BootWrapperProps {
  children: ReactNode;
}

export default function BootWrapper({ children }: BootWrapperProps) {
  const [hasBooted, setHasBooted] = useState(false);
  const { mounted: bootMounted, ref: bootRef } = usePresence<HTMLDivElement>(!hasBooted, BOOT_PRESENCE);
  const contentRef = useRef<HTMLDivElement>(null);

  // Lock scrolling and hide scrollbars during the boot sequence
  useEffect(() => {
    if (!hasBooted) {
      document.body.classList.add("overflow-hidden", "h-full");
      document.documentElement.classList.add("overflow-hidden", "h-full");
    } else {
      document.body.classList.remove("overflow-hidden", "h-full");
      document.documentElement.classList.remove("overflow-hidden", "h-full");
      // Deep links (/#career from another page or a shared URL) can't scroll while boot locks the page, so jump there now
      // Raw hash, no decodeURIComponent: section ids are plain ASCII, and a malformed escape (e.g. #%E0%A4%A) would throw
      const target = window.location.hash && document.getElementById(window.location.hash.slice(1));
      if (target) target.scrollIntoView({ behavior: "instant", block: "start" });
    }
    return () => {
      document.body.classList.remove("overflow-hidden", "h-full");
      document.documentElement.classList.remove("overflow-hidden", "h-full");
    };
  }, [hasBooted]);

  // Fade the content in once boot completes (runs before paint, so the inline opacity:0 never flashes to 1)
  useLayoutEffect(() => {
    const el = contentRef.current;
    if (!hasBooted || !el) return;
    const tween = gsap.fromTo(el, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power2.out", clearProps: "opacity" });
    return () => {
      tween.kill();
    };
  }, [hasBooted]);

  return (
    <BootContext.Provider value={hasBooted}>
      {bootMounted && (
        // Wrapper carries the z-50 layer itself: its fading opacity would otherwise trap BootScreen's z-index.
        <div ref={bootRef} className="fixed inset-0 z-50">
          <BootScreen onComplete={() => setHasBooted(true)} />
        </div>
      )}

      {/* Main content is always rendered for SSR/SEO and fades in once the boot sequence completes.
          Opacity only (no transform) so the fixed navbar is never inside a transformed ancestor. */}
      <div
        ref={contentRef}
        style={hasBooted ? undefined : { opacity: 0 }}
        className={`flex flex-col min-h-screen ${hasBooted ? "" : "pointer-events-none"}`}
      >
        {children}
      </div>
    </BootContext.Provider>
  );
}
