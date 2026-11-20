// 404 as a game screen: the path you took doesn't exist in this world.
import Link from "next/link";
import RetroShell from "@/components/retro/RetroShell";
import { BUTTON, PANEL, TITLE_BAR } from "@/components/retro/styles";
import { PlayerSprite } from "@/components/world/Cartridge";

const ROUTES = [
  { label: "Main Menu", href: "/" },
  { label: "Adventure Mode", href: "/world" },
  { label: "Classic Portfolio", href: "/classic" },
  { label: "Projects", href: "/classic#projects" },
  { label: "Contact", href: "/classic#contact" },
];

export default function NotFoundView() {
  return (
    <RetroShell subtitle="404">
      <main className="mx-auto flex max-w-xl flex-col px-4 py-12 sm:py-20">
        <section className={PANEL} aria-labelledby="nf-title">
          <div className={TITLE_BAR}>
            <h1 id="nf-title" className="text-xl tracking-[0.15em]">
              404 · NO PATH HERE
            </h1>
          </div>
          <div className="space-y-5 p-5 sm:p-6">
            <div className="flex items-center gap-4">
              <PlayerSprite className="h-20 w-auto shrink-0" />
              <p className="text-lg leading-snug">There&apos;s nothing at this spot in KRISHI.WORLD. The page may have moved when the site became a game.</p>
            </div>
            <ul className="grid gap-2 sm:grid-cols-2">
              {ROUTES.map((r) => (
                <li key={r.href}>
                  <Link href={r.href} className={`${BUTTON} block text-lg`}>
                    ▶ {r.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>
      </main>
    </RetroShell>
  );
}
