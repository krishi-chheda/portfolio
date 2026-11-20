import type { Metadata } from "next";
import BootWrapper from "@/components/boot/BootWrapper";
import TitleScreen from "@/components/title/TitleScreen";
import { pixelFont } from "@/lib/pixelFont";

export const metadata: Metadata = {
  title: "KRISHI.WORLD | Krishi Chheda, AI Engineer & Product Builder",
  description:
    "Krishi Chheda's portfolio as a retro RPG: explore an open pixel world in Adventure Mode, or browse projects, skills and experience in the Classic Portfolio.",
  alternates: { canonical: "/" },
};

// KRISHI.OS boots (once per session), then the KRISHI.WORLD title screen offers the two modes.
export default function Home() {
  return (
    <div className={pixelFont.variable}>
      <BootWrapper>
        <TitleScreen />
      </BootWrapper>
    </div>
  );
}
