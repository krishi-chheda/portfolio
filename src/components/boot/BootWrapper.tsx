"use client";

import { useState, useEffect, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import BootScreen from "./BootScreen";

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
    <>
      <AnimatePresence mode="wait">
        {!hasBooted && (
          <BootScreen key="boot" onComplete={() => setHasBooted(true)} />
        )}
      </AnimatePresence>

      {/* Main content wrapper is always rendered in the HTML layout for SSR SEO indexing, 
          and transitions smoothly into view once the boot simulation is completed. */}
      <div 
        className={`flex flex-col min-h-screen transition-all duration-1000 ${
          hasBooted ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <motion.div
          animate={hasBooted ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.98 }}
          initial={{ opacity: 0, scale: 0.98 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="flex flex-col flex-1"
        >
          {children}
        </motion.div>
      </div>
    </>
  );
}
