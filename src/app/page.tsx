"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import KnowledgeGraph from "@/components/sections/KnowledgeGraph";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import CurrentlyBuilding from "@/components/sections/CurrentlyBuilding";
import Leadership from "@/components/sections/Leadership";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";
import ChatBubble from "@/components/ask-krishi/ChatBubble";
import BootScreen from "@/components/boot/BootScreen";

export default function Home() {
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

      {/* Main homepage container reveals smoothly once booted */}
      <div 
        className={`flex flex-col min-h-screen transition-all duration-1000 ${
          hasBooted ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
      >
        {hasBooted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="flex flex-col flex-1"
          >
            <Navbar />
            <main className="flex-1 w-full">
              <Hero />
              <Projects />
              <KnowledgeGraph />
              <Experience />
              <CurrentlyBuilding />
              <Leadership />
              <Contact />
            </main>
            <Footer />
            <ChatBubble />
          </motion.div>
        )}
      </div>
    </>
  );
}
