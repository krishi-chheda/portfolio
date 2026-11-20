import type { MetadataRoute } from "next";
import { FEATURED } from "@/lib/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = "https://krishi-portfolio.vercel.app";
  const page = (path: string, priority: number, changeFrequency: "weekly" | "monthly") => ({ url: `${baseUrl}${path}`, lastModified: new Date(), changeFrequency, priority });
  return [page("", 1.0, "monthly"), page("/classic", 0.9, "monthly"), page("/world", 0.8, "monthly"), page("/now", 0.6, "weekly"), ...FEATURED.map((p) => page(`/classic/projects/${p.id}`, 0.8, "monthly"))];
}
