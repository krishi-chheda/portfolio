// The four featured projects as cards (their HQ building from the game). Each opens its own project file page,
// /classic/projects/[id]. Server component; only the building sprites draw on the client.
import Link from "next/link";
import { CARD, CHIP, LABEL, LINK, MUTED, PROSE } from "@/components/retro/styles";
import { ObjectSprite } from "@/components/retro/WorldView";
import { FEATURED, MORE_PROJECTS } from "@/lib/portfolio";
import { PROJECT_BUILDING } from "@/lib/retro";

export default function ProjectArchive() {
  return (
    <>
      <ul className="grid gap-5 sm:grid-cols-2">
        {FEATURED.map((p, i) => (
          <li key={p.id} className="flex flex-col gap-2">
            <Link
              href={`/classic/projects/${p.id}`}
              className={`group flex flex-1 flex-col border-4! text-left shadow-[4px_4px_0_#46382b]! hover:shadow-[6px_6px_0_#46382b]! focus-visible:outline-4 focus-visible:outline-offset-4 focus-visible:outline-[#285943] ${CARD}`}
            >
              <div className="relative flex h-40 items-end justify-center border-b-4 border-[#46382b] bg-[linear-gradient(180deg,#d4f0f8_0%,#c4e8f3_70%,#78b85a_70%,#78b85a_100%)] pb-3">
                <span className="absolute top-2 left-2 border-2 border-[#46382b] bg-white px-1.5 text-sm tracking-widest">No. {String(i + 1).padStart(3, "0")}</span>
                {p.screenshots.length > 0 && (
                  <span className="absolute top-2 right-2 border-2 border-[#46382b] bg-[#f5c65b] px-1.5 text-sm tracking-widest">
                    {p.screenshots.length} SCREEN{p.screenshots.length > 1 ? "S" : ""}
                  </span>
                )}
                <ObjectSprite
                  kind={PROJECT_BUILDING[p.id as keyof typeof PROJECT_BUILDING]}
                  scale={1.1}
                  className="transition-transform duration-200 group-hover:-translate-y-1 motion-reduce:transition-none"
                />
              </div>
              <div className="flex flex-1 flex-col gap-2.5 p-4">
                <h3 className="text-2xl leading-tight">{p.title}</h3>
                <p className="text-base leading-snug text-[#285943]">{p.subtitle}</p>
                <p className={`${PROSE} text-base`}>{p.description}</p>
                {p.status && <p className={`text-sm ${MUTED}`}>STATUS · {p.status}</p>}
                <ul className="flex flex-wrap gap-1.5">
                  {p.techStack.slice(0, 4).map((t) => (
                    <li key={t} className={CHIP}>
                      {t}
                    </li>
                  ))}
                  {p.techStack.length > 4 && <li className={`${CHIP} ${MUTED}`}>+{p.techStack.length - 4}</li>}
                </ul>
                <span className="mt-auto flex items-center gap-2 pt-2 text-base tracking-widest text-[#285943]">
                  <span aria-hidden="true" className="transition-transform duration-150 group-hover:translate-x-1 motion-reduce:transition-none">
                    ▶
                  </span>
                  OPEN PROJECT FILE
                </span>
              </div>
            </Link>
            {/* outside the card link: a link can't hold links */}
            {(p.liveUrl || p.githubUrl) && (
              <div className="flex flex-wrap gap-2">
                {p.liveUrl && (
                  <a href={p.liveUrl} {...(p.liveUrl.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={`${LINK} text-sm`}>
                    {p.liveUrl.startsWith("http") ? "Live demo ↗" : "You're on it"}
                  </a>
                )}
                {p.githubUrl && (
                  <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className={`${LINK} text-sm`}>
                    Source ↗
                  </a>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>

      <h3 className={`${LABEL} mt-10`}>More from the archive</h3>
      <ul className="mt-3 grid gap-4 md:grid-cols-2">
        {MORE_PROJECTS.map((p) => (
          <li key={p.id} className={`${CARD} flex flex-col gap-2 p-4`}>
            <p className="text-xl leading-tight">{p.title}</p>
            <p className={`${PROSE} text-base`}>{p.description}</p>
            <div className="mt-auto flex flex-wrap gap-2 pt-1">
              {p.githubUrl && (
                <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className={`${LINK} text-sm`}>
                  Source ↗
                </a>
              )}
              {p.liveUrl && (
                <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className={`${LINK} text-sm`}>
                  Live ↗
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
    </>
  );
}
