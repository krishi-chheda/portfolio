import BootWrapper from "@/components/boot/BootWrapper";
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

export default function Home() {
  return (
    <BootWrapper>
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
    </BootWrapper>
  );
}
