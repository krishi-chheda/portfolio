import { Pixelify_Sans } from "next/font/google";

// KRISHI.WORLD's pixel font, defined once (Next "font definitions file") and shared by the title screen,
// Classic Mode and Adventure Mode. Preloaded: it is the main typeface of every KRISHI.WORLD screen.
export const pixelFont = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixel" });
