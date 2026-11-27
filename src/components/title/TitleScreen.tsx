"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { useRouter } from "next/navigation";
import { BUTTON, Gem, PANEL, PIXEL, TITLE_BAR, Trophy, useKeys } from "@/components/retro/ui";
import { ObjectSprite, PortraitAvatar, WorldView } from "@/components/retro/WorldView";
import { contact, milestones, profile, skillCategories, SYSTEM_VERSION } from "@/lib/data";
import { FEATURED } from "@/lib/portfolio";
import { CATEGORY_GEMS, PROJECT_BUILDING } from "@/lib/retro";
import { sfx } from "@/game/audio";
import { getSettings, setSettings } from "@/game/settings";
import { useBooted } from "@/components/boot/BootWrapper";
import gsap from "gsap";
import { WORLD } from "@/lib/motion";
import { useEntrance } from "@/hooks/useEntrance";

const ENTRY_KEY = "krishi-world:entry"; // last mode chosen ("world" | "classic"); kept from the earlier boot choice

type Mode = "world" | "classic";
const MODES: { id: Mode; title: string; button: string; description: string }[] = [
  {
    id: "world",
    title: "ADVENTURE MODE",
    button: "ENTER THE WORLD",
    description: "Explore my world, discover my skills, meet characters and uncover the projects I've built.",
  },
  {
    id: "classic",
    title: "CLASSIC PORTFOLIO",
    button: "VIEW PORTFOLIO",
    description: "Explore my professional journey through an interactive retro portfolio interface.",
  },
];

// Origin Valley tiles: a loop down the west house path, along the main road, up past the university and back.
const PREVIEW_CROP = { x: 2, y: 2, w: 26, h: 14 };
const PREVIEW_ROUTE = [
  [6, 8],
  [6, 14],
  [27, 14],
  [27, 8],
] as const;
const BG_CROP = { x: 0, y: 0, w: 40, h: 30 };

const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function ControllerIcon() {
  return (
    <svg width="28" height="20" viewBox="0 0 14 10" shapeRendering="crispEdges" aria-hidden="true">
      <path d="M2 2h10v1h1v5h-1v1H9V8H5v1H2V8H1V3h1z" fill="#f5e8c8" />
      <path d="M3 4h1v1h1v1H4v1H3V6H2V5h1z M10 4h1v1h-1z M11 5h1v1h-1z" fill="#285943" />
    </svg>
  );
}

function ProfileIcon() {
  return (
    <svg width="26" height="20" viewBox="0 0 13 10" shapeRendering="crispEdges" aria-hidden="true">
      <path d="M0 0h13v10H0z" fill="#f5e8c8" />
      <path d="M2 2h3v3H2z M1 6h5v2H1z" fill="#285943" />
      <path d="M7 2h5v1H7z M7 4h4v1H7z M7 6h5v1H7z" fill="#78b85a" />
    </svg>
  );
}

/** Gold pixel corner brackets that pulse outward around the selected card: the menu's selection cursor. */
function SelectionBrackets() {
  const corners: { pos: string; d: string; dx: string; dy: string }[] = [
    { pos: "-top-3 -left-3", d: "M0 0h12v4H4v8H0z", dx: "-2px", dy: "-2px" },
    { pos: "-top-3 -right-3", d: "M0 0h12v12H8V4H0z", dx: "2px", dy: "-2px" },
    { pos: "-bottom-3 -left-3", d: "M0 0h4v8h8v4H0z", dx: "-2px", dy: "2px" },
    { pos: "-bottom-3 -right-3", d: "M8 0h4v12H0V8h8z", dx: "2px", dy: "2px" },
  ];
  return (
    <>
      {corners.map((c) => (
        <svg
          key={c.pos}
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="-1 -1 14 14"
          shapeRendering="crispEdges"
          className={`kw-anim pointer-events-none absolute z-10 ${c.pos} animate-[kw-bracket_0.9s_steps(2,jump-none)_infinite]`}
          style={{ "--dx": c.dx, "--dy": c.dy } as CSSProperties}
        >
          <path d={c.d} fill="#f5c65b" stroke="#2b2420" strokeWidth="1" />
        </svg>
      ))}
    </>
  );
}

const TABS = ["Profile", "Projects", "Quests", "Skilldex"];

/** The Classic card's visual: a GBA trainer card built from the real data and game art. */
function TrainerPreview({ active }: { active: boolean }) {
  const [tab, setTab] = useState(0);
  useEffect(() => {
    if (!active || reducedMotion()) return;
    const id = setInterval(() => setTab((t) => (t + 1) % TABS.length), 1400);
    return () => clearInterval(id);
  }, [active]);
  const row = "flex items-center gap-1 sm:gap-1.5";
  const label = "w-[3.2rem] shrink-0 text-[10px] uppercase tracking-widest text-[#6e5643]";

  return (
    <div className="flex h-full flex-col bg-[repeating-linear-gradient(180deg,#e9f7e2_0_6px,#dff2d6_6px_12px)] text-[#2b2420]">
      <div className="flex items-center justify-between border-b-2 border-[#46382b] bg-[#78b85a] px-3 py-0.5 text-[10px] tracking-widest text-[#1c4031]">
        <span>TRAINER CARD</span>
        <span>ID No. KC-2027</span>
      </div>
      <div className="grid min-h-0 flex-1 grid-cols-[auto_1fr] items-center gap-3 px-3 py-2">
        <div className="flex h-[5.5rem] w-[5.5rem] items-end justify-center overflow-hidden rounded-full border-4 border-[#285943] bg-[radial-gradient(circle_at_50%_30%,#d4f0f8_0%,#a6d985_55%,#5e9e48_100%)] sm:h-24 sm:w-24">
          <PortraitAvatar scale={2.6} className="translate-y-0.5 sm:scale-110 sm:origin-bottom" />
        </div>
        <div className="min-w-0 space-y-1">
          <p className="truncate text-base leading-tight sm:text-lg">{profile.name}</p>
          <p className="truncate text-[11px] leading-tight text-[#285943]">{profile.title}</p>
          <div className={row}>
            <span className={label}>Skills</span>
            {skillCategories.map((c, i) => (
              <span key={c.id} className="flex items-center gap-0.5 text-[11px]" title={c.name}>
                <Gem colors={CATEGORY_GEMS[i % CATEGORY_GEMS.length]} size={15} />
                {c.skills.length}
              </span>
            ))}
          </div>
          <div className={row}>
            <span className={label}>Projects</span>
            {FEATURED.map((p) => (
              <span key={p.id} className="flex h-8 w-9 items-end justify-center overflow-hidden border-2 border-[#46382b] bg-[#d4f0f8] sm:h-9 sm:w-11" title={p.title}>
                <ObjectSprite kind={PROJECT_BUILDING[p.id as keyof typeof PROJECT_BUILDING]} scale={0.3} />
              </span>
            ))}
          </div>
          <div className={row}>
            <span className={label}>Badges</span>
            <span className="flex gap-px">
              {milestones.map((m) => (
                <Trophy key={m.title} done size={14} />
              ))}
            </span>
          </div>
        </div>
      </div>
      <ul className="grid grid-cols-4 gap-1 px-3 pb-2 text-center text-[10px] uppercase tracking-wider text-[#46382b]">
        {TABS.map((m, i) => (
          <li key={m} className={`border-2 border-[#46382b] py-0.5 transition-colors duration-200 ${i === tab ? "bg-[#f5c65b]" : "bg-white"}`}>
            {m}
          </li>
        ))}
      </ul>
    </div>
  );
}

// A 2-frame pixel bird (wings up / wings level), drawn once as a sprite strip.
const BIRD = `url("data:image/svg+xml,${encodeURIComponent(
  `<svg xmlns='http://www.w3.org/2000/svg' width='24' height='8' shape-rendering='crispEdges' fill='#1f1d24'>${[
    [1, 1], [2, 2], [3, 3], [4, 4], [5, 4], [6, 4], [7, 3], [8, 2], [9, 1],
    [13, 4], [14, 3], [15, 3], [16, 4], [17, 4], [18, 4], [19, 3], [20, 3], [21, 4],
  ]
    .map(([x, y]) => `<rect x='${x}' y='${y}' width='1' height='1'/>`)
    .join("")}</svg>`,
)}")`;
const PETALS = [
  { left: "8%", top: "22%", color: "#fff1c4", dur: 19, delay: -2 },
  { left: "30%", top: "8%", color: "#f7c6d9", dur: 23, delay: -11 },
  { left: "55%", top: "30%", color: "#ffffff", dur: 17, delay: -6 },
  { left: "70%", top: "12%", color: "#f7c6d9", dur: 25, delay: -17 },
  { left: "18%", top: "55%", color: "#fff1c4", dur: 21, delay: -9 },
];

/** Background life: drifting cloud shadows, a breathing sunlight wash, occasional birds and blown petals. */
function Ambience() {
  return (
    <div aria-hidden="true" className="kw-ambient pointer-events-none absolute inset-0 overflow-hidden">
      <div className="kw-anim absolute top-0 -left-1/4 h-[70vh] w-[70vw] animate-[kw-light_9s_ease-in-out_infinite] bg-[radial-gradient(closest-side,rgba(255,236,170,0.32),transparent)]" />
      <div className="kw-anim absolute top-[8%] left-0 h-[34vh] w-[46vw] animate-[kw-cloud_110s_linear_infinite] bg-[radial-gradient(closest-side,rgba(8,28,18,0.3),transparent)] [animation-delay:-40s]" />
      <div className="kw-anim absolute top-[52%] left-0 h-[28vh] w-[38vw] animate-[kw-cloud_140s_linear_infinite] bg-[radial-gradient(closest-side,rgba(8,28,18,0.26),transparent)] [animation-delay:-95s]" />
      {[
        { top: "14%", dur: "32s", delay: "-4s" },
        { top: "19%", dur: "32s", delay: "-3.4s" },
        { top: "38%", dur: "46s", delay: "-30s" },
      ].map((b) => (
        <div key={b.top + b.delay} className="kw-anim absolute left-0" style={{ top: b.top, animation: `kw-bird ${b.dur} linear ${b.delay} infinite` }}>
          <div
            className="kw-anim h-2 w-3 origin-top-left scale-[2.5] [image-rendering:pixelated]"
            style={{ backgroundImage: BIRD, backgroundSize: "24px 8px", animation: "kw-flap 0.36s steps(2) infinite" }}
          />
        </div>
      ))}
      {PETALS.map((p) => (
        <span
          key={p.left + p.top}
          className="kw-anim absolute h-1.5 w-1.5"
          style={{ left: p.left, top: p.top, background: p.color, animation: `kw-petal ${p.dur}s linear ${p.delay}s infinite` }}
        />
      ))}
    </div>
  );
}

function SoundToggle({ on, onToggle }: { on: boolean; onToggle: () => void }) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-pressed={on}
      className={`${BUTTON} absolute top-3 right-3 z-20 flex items-center gap-1.5 text-sm text-[#2b2420] sm:top-4 sm:right-4`}
    >
      <svg width="14" height="14" viewBox="0 0 7 7" shapeRendering="crispEdges" aria-hidden="true" fill="currentColor">
        <path d="M0 2h2l2-2v7L2 5H0z" />
        {on ? <path d="M5 2h1v3H5z" /> : <path d="M5 2h1v1H5z M6 3h1v1H6z M5 4h1v1H5z" />}
      </svg>
      SFX {on ? "ON" : "OFF"}
    </button>
  );
}

/**
 * KRISHI.WORLD title screen: the mode select after the KRISHI.OS boot. Both modes get equal weight and the same
 * frame; ←/→ (or hover / focus) moves the cursor, Enter or a click anywhere on a card starts. The last mode played
 * is pre-selected and badged. Menu sounds are optional (shared with the game's SFX setting); no music here.
 */
export default function TitleScreen() {
  const router = useRouter();
  const booted = useBooted();
  // Hero first, once the boot hands over: the logo drops in with the signature overshoot, then the tagline, the
  // two cards (staggered, from the same direction), and the footer last. Under 0.9s in total.
  const mainRef = useEntrance<HTMLElement>(
    (main) => {
      if (!booted) return;
      const t = (q: string) => main.querySelectorAll(q);
      gsap
        .timeline({ defaults: { clearProps: "transform,opacity,visibility" } })
        .from(t("header > p:first-child"), { autoAlpha: 0, y: -8, duration: WORLD.dur.standard, ease: WORLD.easeSoft })
        .from(t("header h1"), { autoAlpha: 0, y: -36, scale: 0.92, duration: WORLD.dur.slow, ease: "back.out(1.6)" }, 0.05)
        .from(t("header > p:last-child"), { autoAlpha: 0, y: 10, duration: WORLD.dur.standard, ease: WORLD.easeSoft }, 0.28)
        .from(t('[aria-label="Choose a mode"] > div'), { autoAlpha: 0, y: 28, scale: 0.96, duration: WORLD.dur.slow, ease: WORLD.ease, stagger: 0.1 }, 0.32)
        .from(t("footer"), { autoAlpha: 0, y: 8, duration: WORLD.dur.standard, ease: WORLD.easeSoft }, 0.62);
    },
    [booted],
  );
  const [selected, setSelected] = useState<Mode>("world");
  const [last, setLast] = useState<Mode | null>(null);
  const [sound, setSound] = useState(true);
  const interacted = useRef(false); // browsers block audio before a gesture; stay silent until one happens
  const buttons = useRef<Record<Mode, HTMLButtonElement | null>>({ world: null, classic: null });

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSound(getSettings().sound);
    try {
      const saved = localStorage.getItem(ENTRY_KEY);
      if (saved === "world" || saved === "classic") {
        setLast(saved);
        setSelected(saved);
      }
    } catch {
      // nothing remembered
    }
    const mark = () => (interacted.current = true);
    window.addEventListener("pointerdown", mark, { once: true });
    window.addEventListener("keydown", mark, { once: true });
    return () => {
      window.removeEventListener("pointerdown", mark);
      window.removeEventListener("keydown", mark);
    };
  }, []);

  const start = (mode: Mode) => {
    try {
      localStorage.setItem(ENTRY_KEY, mode);
    } catch {
      // not remembered; still go
    }
    sfx("open");
    router.push(mode === "world" ? "/world" : "/classic");
  };
  const move = (mode: Mode, focus = false) => {
    if (mode !== selected && interacted.current) sfx("select");
    setSelected(mode);
    if (focus) buttons.current[mode]?.focus();
  };
  const toggleSound = () => {
    const next = setSettings({ sound: !sound }).sound;
    setSound(next);
    if (next) sfx("select");
  };

  useKeys((e) => {
    if (!booted) return;
    if (["ArrowLeft", "ArrowUp", "a", "w"].includes(e.key)) move("world", true);
    else if (["ArrowRight", "ArrowDown", "d", "s"].includes(e.key)) move("classic", true);
    else if (e.key === "Enter" && !(e.target instanceof HTMLButtonElement || e.target instanceof HTMLAnchorElement)) start(selected);
  });

  return (
    <main ref={mainRef} className={`${PIXEL} relative min-h-screen overflow-hidden bg-[#1c4031] text-[#f5e8c8]`}>
      {/* The whole world as the backdrop: clearer than before, darkened toward the edges so the cards stay on top */}
      <div aria-hidden="true" className="absolute inset-0">
        <WorldView crop={BG_CROP} walkRow={14} label="" className="h-full w-full object-cover opacity-90 saturate-[1.1]" />
        <Ambience />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_55%,rgba(28,64,49,0.25)_0%,rgba(28,64,49,0.5)_55%,rgba(14,34,25,0.9)_100%)]" />
        <div className="absolute inset-x-0 top-0 h-64 bg-gradient-to-b from-[#12291f]/85 to-transparent" />
      </div>

      <SoundToggle on={sound} onToggle={toggleSound} />

      <div className="relative mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 pt-14 pb-8 sm:px-6 sm:py-12">
        <header className="text-center">
          <p className="text-sm tracking-[0.3em] text-[#f5e8c8]">KRISHI.OS {SYSTEM_VERSION.toUpperCase()} PRESENTS</p>
          <h1 className="mt-3 text-[2.6rem] leading-none text-[#f5e8c8] [text-shadow:4px_4px_0_#285943,7px_7px_0_#46382b] min-[400px]:text-5xl sm:text-7xl sm:[text-shadow:5px_5px_0_#285943,8px_8px_0_#46382b] md:text-8xl">
            KRISHI.WORLD
          </h1>
          <p className="mt-4 text-lg text-[#f5c65b] [text-shadow:2px_2px_0_#12291f] sm:text-2xl">Explore the mind. Discover the builder.</p>
        </header>

        <div className="mt-8 grid flex-1 grid-cols-1 gap-8 sm:mt-10 md:grid-cols-2" role="group" aria-label="Choose a mode">
          {MODES.map((m) => {
            const isSel = selected === m.id;
            return (
              <div
                key={m.id}
                onClick={() => start(m.id)}
                onMouseEnter={() => move(m.id)}
                className={`${PANEL} group relative flex cursor-pointer flex-col transition-[translate,box-shadow] duration-200 ease-out motion-reduce:transition-none ${
                  isSel
                    ? "-translate-y-1.5 shadow-[6px_6px_0_#46382b,0_0_0_4px_#f5c65b,0_22px_44px_rgba(0,0,0,0.5)]"
                    : "shadow-[6px_6px_0_#46382b,0_14px_30px_rgba(0,0,0,0.4)]"
                }`}
              >
                {isSel && <SelectionBrackets />}
                <div className={TITLE_BAR}>
                  <span className="flex items-center gap-3 whitespace-nowrap text-lg tracking-[0.12em] sm:text-xl md:gap-2 md:text-base md:tracking-[0.06em] lg:gap-3 lg:text-xl lg:tracking-[0.12em]">
                    {m.id === "world" ? <ControllerIcon /> : <ProfileIcon />}
                    {m.title}
                  </span>
                </div>
                <div className="relative h-52 overflow-hidden border-b-4 border-[#46382b] sm:h-56">
                  {last === m.id && (
                    <span className={`absolute right-2 z-[1] border-2 ${m.id === "world" ? "bottom-2" : "top-[1.9rem]"} border-[#46382b] bg-[#f5c65b] px-1.5 text-[10px] tracking-widest text-[#2b2420] shadow-[2px_2px_0_#46382b]`}>
                      LAST PLAYED
                    </span>
                  )}
                  {m.id === "world" ? (
                    <WorldView
                      crop={PREVIEW_CROP}
                      route={PREVIEW_ROUTE}
                      label="Origin Valley in KRISHI.WORLD: houses, a university, roads and the player walking around town"
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <TrainerPreview active={isSel} />
                  )}
                </div>
                <div className="flex flex-1 flex-col gap-4 p-4 sm:p-5">
                  <p id={`${m.id}-desc`} className="flex-1 text-base leading-snug text-[#2b2420] sm:text-lg">
                    {m.description}
                  </p>
                  <button
                    ref={(el) => {
                      buttons.current[m.id] = el;
                    }}
                    type="button"
                    aria-describedby={`${m.id}-desc`}
                    onFocus={() => move(m.id)}
                    className={`${BUTTON} flex items-center justify-center gap-2 py-2 text-lg tracking-[0.12em] text-[#2b2420] transition-colors focus-visible:outline-4 focus-visible:outline-offset-4 ${
                      isSel ? "bg-[#f5c65b]!" : ""
                    }`}
                  >
                    <span aria-hidden="true" className="kw-anim w-4 animate-[kw-blink_1s_steps(1)_infinite]">
                      {isSel ? "▶" : ""}
                    </span>
                    {m.button}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <footer className="mt-8 flex flex-col items-center gap-3 text-center text-sm">
          <p className="hidden text-[#f5e8c8]/80 md:block">← → choose · Enter start</p>
          <nav aria-label="Contact" className="flex flex-wrap justify-center gap-2">
            <a href={contact.linkedin} target="_blank" rel="noopener noreferrer" className={`${BUTTON} text-[#2b2420]`}>
              LinkedIn ↗
            </a>
            <a href={contact.github} target="_blank" rel="noopener noreferrer" className={`${BUTTON} text-[#2b2420]`}>
              GitHub ↗
            </a>
            <a href={`mailto:${contact.email}`} className={`${BUTTON} text-[#2b2420]`}>
              Email
            </a>
          </nav>
        </footer>
      </div>
    </main>
  );
}
