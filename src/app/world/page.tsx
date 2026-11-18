import type { Metadata } from "next";
import { Pixelify_Sans } from "next/font/google";
import WorldGame from "@/components/world/WorldGame";

// GBA-style dialogue font, loaded only on this route
const pixel = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixel" });

export const metadata: Metadata = {
  title: "KRISHI.WORLD | Explore the mind. Discover the builder.",
  description: "An explorable pixel-art world built around Krishi Chheda's projects and journey.",
  alternates: { canonical: "/world" },
};

export default function WorldPage() {
  return (
    <div className={pixel.variable}>
      <WorldGame />
    </div>
  );
}
