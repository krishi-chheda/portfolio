import BootWrapper from "@/components/boot/BootWrapper";
import Navbar from "@/components/Navbar";
import Hero from "@/components/sections/Hero";
import Projects from "@/components/sections/Projects";
import Experience from "@/components/sections/Experience";
import Leadership from "@/components/sections/Leadership";
import CurrentlyBuilding from "@/components/sections/CurrentlyBuilding";
import SystemMap from "@/components/sections/SystemMap";
import Contact from "@/components/sections/Contact";
import Footer from "@/components/Footer";
import ChatBubble from "@/components/ask-krishi/ChatBubble";

export default function Home() {
  return (
    <BootWrapper>
      <Navbar />
      <main className="flex-1 w-full">
        <Hero />
        <Projects />
        <Experience />
        <Leadership />
        <CurrentlyBuilding />
        <SystemMap />
        <Contact />
      </main>
      <Footer />
      <ChatBubble />
    </BootWrapper>
  );
}
