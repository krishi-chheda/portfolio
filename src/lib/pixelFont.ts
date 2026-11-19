import { Pixelify_Sans } from "next/font/google";

// KRISHI.WORLD's pixel font, defined once (Next "font definitions file") and shared by /world and the cartridge
// shown on the portfolio's first-visit choice. preload: false, so the portfolio pages never fetch it unless
// pixel text is actually on screen.
export const pixelFont = Pixelify_Sans({ subsets: ["latin"], variable: "--font-pixel", preload: false });
