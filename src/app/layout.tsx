import type { Metadata } from "next";
import { Inter, Space_Grotesk, Geist_Mono } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Krishi Chheda | AI Engineer & Builder",
  description: "Master of AI student at Monash University, Media & Marketing Director at MDAS, and builder of production-ready AI software.",
  keywords: [
    "Krishi Chheda",
    "AI Engineer",
    "Machine Learning",
    "Monash University",
    "Melbourne AI",
    "MDAS",
    "ClinicalBrief",
    "StudentHub Melbourne",
    "Full Stack Builder"
  ],
  authors: [{ name: "Krishi Chheda" }],
  openGraph: {
    title: "Krishi Chheda | AI Engineer & Builder",
    description: "Master of AI student at Monash University, Media & Marketing Director at MDAS, and builder of production-ready AI software.",
    url: "https://krishi.dev",
    siteName: "Krishi Chheda Portfolio",
    locale: "en_AU",
    type: "website",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} ${geistMono.variable} h-full antialiased scroll-smooth`}
    >
      <body className="min-h-full bg-[#080c14] text-slate-100 flex flex-col font-sans select-none overflow-x-hidden selection:bg-cyan-500/30 selection:text-cyan-200">
        {children}
      </body>
    </html>
  );
}
