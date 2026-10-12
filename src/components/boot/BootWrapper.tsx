"use client";

import { useState, useEffect, ReactNode, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BootScreen from "./BootScreen";

// Lets entrance animations wait until the boot screen has cleared, instead of playing hidden behind it.
// Defaults to true so pages without a boot screen (/readme, /now) never wait.
const BootContext = createContext(true);
export const useBooted = () => useContext(BootContext);

interface BootWrapperProps {
  children: ReactNode;
}

export default function BootWrapper({ children }: BootWrapperProps) {
  const [hasBooted, setHasBooted] = useState(false);

  // Lock scrolling and hide scrollbars during the boot sequence
  useEffect(() => {
    if (!hasBooted) {
      document.body.classList.add("overflow-hidden", "h-full");
      document.documentElement.classList.add("overflow-hidden", "h-full");
    } else {
      document.body.classList.remove("overflow-hidden", "h-full");
      document.documentElement.classList.remove("overflow-hidden", "h-full");
    }
    return () => {
      document.body.classList.remove("overflow-hidden", "h-full");
      document.documentElement.classList.remove("overflow-hidden", "h-full");
    };
  }, [hasBooted]);

  return (
    <BootContext.Provider value={hasBooted}>
      <AnimatePresence mode="wait">
        {!hasBooted && (
          <BootScreen key="boot" onComplete={() => setHasBooted(true)} />
        )}
      </AnimatePresence>

      {/* Main content is always rendered for SSR/SEO and fades in once the boot sequence completes.
          Opacity only (no transform) so the fixed navbar is never inside a transformed ancestor. */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: hasBooted ? 1 : 0 }}
        transition={{ duration: 0.4, ease: "easeOut" }}
        className={`flex flex-col min-h-screen ${hasBooted ? "" : "pointer-events-none"}`}
      >
        {children}
      </motion.div>
    </BootContext.Provider>
  );
}
