import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});
// Readable body face for long descriptions; the pixel font stays on headings, labels, menus and game dialogue
const geist = Geist({ variable: "--font-body", subsets: ["latin"] });

export const metadata: Metadata = {
  metadataBase: new URL("https://krishi-portfolio.vercel.app"), // resolves the pages' relative canonicals
  title: "Krishi Chheda | AI Engineer & Product Builder",
  description: "AI Engineer and Product Builder at Monash University. Creator of ClinicalBrief, AccessVision, Traffic AI, and KRISHI.OS. Explore my portfolio as a retro RPG, or browse the classic portfolio and chat with my AI assistant.",
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
    title: "Krishi Chheda | AI Engineer & Product Builder",
    description: "AI Engineer and Product Builder at Monash University. Creator of ClinicalBrief, AccessVision, Traffic AI, and KRISHI.OS. Explore my portfolio as a retro RPG, or browse the classic portfolio and chat with my AI assistant.",
    url: "https://krishi-portfolio.vercel.app",
    siteName: "Krishi Chheda Portfolio",
    locale: "en_AU",
    type: "website",
    images: [
      {
        url: "https://krishi-portfolio.vercel.app/assets/og-krishiworld.png",
        width: 1200,
        height: 630,
        alt: "Krishi Chheda | AI Engineer & Product Builder Portfolio",
      }
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Krishi Chheda | AI Engineer & Product Builder",
    description: "AI Engineer and Product Builder at Monash University. Creator of ClinicalBrief, AccessVision, Traffic AI, and KRISHI.OS. Explore my portfolio as a retro RPG, or browse the classic portfolio and chat with my AI assistant.",
    images: ["https://krishi-portfolio.vercel.app/assets/og-krishiworld.png"],
  },
  robots: {
    index: true,
    follow: true,
  },
  alternates: {
    canonical: "https://krishi-portfolio.vercel.app",
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
      className={`${geistMono.variable} ${geist.variable} h-full antialiased motion-safe:scroll-smooth`}
    >
      <body className="min-h-full bg-bg text-ink flex flex-col font-mono overflow-x-hidden">
        <div className="page-frame" aria-hidden="true" />
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Krishi Chheda",
              "jobTitle": "AI Engineer & Product Builder",
              "url": "https://krishi-portfolio.vercel.app",
              "image": "https://krishi-portfolio.vercel.app/assets/og-krishiworld.png",
              "sameAs": [
                "https://github.com/krishi-chheda",
                "https://linkedin.com/in/krishi-chheda"
              ],
              "affiliation": {
                "@type": "EducationalOrganization",
                "name": "Monash University",
                "location": {
                  "@type": "Place",
                  "name": "Melbourne, Victoria, Australia"
                }
              },
              "knowsAbout": [
                "Artificial Intelligence",
                "Computer Vision",
                "Deep Learning",
                "Software Engineering",
                "Natural Language Processing",
                "Next.js",
                "Python",
                "TypeScript",
                "YOLO",
                "OpenCV"
              ]
            })
          }}
        />
      </body>
    </html>
  );
}
