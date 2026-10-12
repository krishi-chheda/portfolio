import type { Metadata } from "next";

// The page itself is a client component, so its metadata lives here. Without this, /now would
// inherit the homepage canonical and be treated as a duplicate of "/".
const url = "https://krishi-portfolio.vercel.app/now";
const title = "Now | Krishi Chheda";
const description = "What Krishi Chheda is focused on right now: studies, current builds and MDAS.";

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

export default function NowLayout({ children }: { children: React.ReactNode }) {
  return children;
}
