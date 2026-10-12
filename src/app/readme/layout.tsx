import type { Metadata } from "next";

// The page itself is a client component, so its metadata lives here. Without this, /readme would
// inherit the homepage canonical and be treated as a duplicate of "/".
const url = "https://krishi-portfolio.vercel.app/readme";
const title = "README | KRISHI.OS — Krishi Chheda";
const description = "Operating manual for KRISHI.OS: what the portfolio is, how to navigate it, and the stack behind it.";

export const metadata: Metadata = {
  title,
  description,
  alternates: { canonical: url },
  openGraph: {
    title,
    description,
    url,
    siteName: "Krishi Chheda Portfolio",
    type: "website",
    images: [{ url: "https://krishi-portfolio.vercel.app/assets/og-image.png", width: 1200, height: 630 }],
  },
};

export default function ReadmeLayout({ children }: { children: React.ReactNode }) {
  return children;
}
