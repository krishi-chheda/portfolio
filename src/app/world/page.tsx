import type { Metadata } from "next";
import WorldGame from "@/components/world/WorldGame";
import { pixelFont } from "@/lib/pixelFont";

export const metadata: Metadata = {
  title: "KRISHI.WORLD | Explore the mind. Discover the builder.",
  description: "An explorable pixel-art world built around Krishi Chheda's projects and journey.",
  alternates: { canonical: "/world" },
};

export default function WorldPage() {
  return (
    <div className={pixelFont.variable}>
      <WorldGame />
    </div>
  );
}
