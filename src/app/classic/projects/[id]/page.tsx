import type { Metadata } from "next";
import { notFound } from "next/navigation";
import AskKrishi from "@/components/classic/AskKrishi";
import ProjectScreen from "@/components/classic/ProjectScreen";
import RetroShell from "@/components/retro/RetroShell";
import { FEATURED, PROJECT_DETAILS } from "@/lib/portfolio";

// One static page per featured project; anything else is a 404.
export const dynamicParams = false;
export function generateStaticParams() {
  return FEATURED.map((p) => ({ id: p.id }));
}

export async function generateMetadata({ params }: PageProps<"/classic/projects/[id]">): Promise<Metadata> {
  const p = PROJECT_DETAILS[(await params).id];
  if (!p) return {};
  return {
    title: `${p.title}: Project File | KRISHI.WORLD`,
    description: p.description,
    alternates: { canonical: `/classic/projects/${p.id}` },
    openGraph: p.screenshots[0] ? { images: [{ url: p.screenshots[0].src, width: p.screenshots[0].width, height: p.screenshots[0].height }] } : undefined,
  };
}

export default async function ProjectPage({ params }: PageProps<"/classic/projects/[id]">) {
  const p = PROJECT_DETAILS[(await params).id];
  if (!p) notFound();
  return (
    <RetroShell subtitle="PROJECT FILE" contactHref="/classic#contact">
      <ProjectScreen project={p} />
      <AskKrishi />
    </RetroShell>
  );
}
