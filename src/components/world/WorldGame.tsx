"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type Phaser from "phaser";
import gsap from "gsap";
import { CartridgeIntro } from "./Cartridge";
import { emit, on, type Dialogue } from "@/game/bus";
import { record, snapshot } from "@/game/progress";
import { getSettings, reduceMotion, setSettings, type Settings } from "@/game/settings";
import { sfx, stopMusic, syncMusic } from "@/game/audio";
import { ACHIEVEMENTS, ATTRIBUTES, REGIONS, TERMINALS, type ProgressSnapshot } from "@/game/content";
import { PIXEL } from "@/components/retro/styles";
import { contact } from "@/lib/data";
import {
  AchievementList,
  AchievementToast,
  DialogueBox,
  DiscoveryCard,
  Journal,
  PauseMenu,
  ProfileCard,
  ProjectTerminal,
  TextGuide,
  TouchControls,
  WorldMap,
  type MenuChoice,
} from "./Overlays";

type Overlay =
  | { kind: "dialogue"; dialogue: Dialogue }
  | { kind: "discover"; id: string }
  | { kind: "journal" }
  | { kind: "terminal"; id: string }
  | { kind: "profile" }
  | { kind: "menu" }
  | { kind: "map" }
  | { kind: "achievements" }
  | { kind: "guide" }
  | null;

const EMPTY: ProgressSnapshot = { attributes: [], regions: [], terminals: [] };

const HUD_BOX = "border-2 border-[#46382b] bg-[#f5e8c8] px-3 py-1 text-sm text-[#2b2420] shadow-[3px_3px_0_#46382b]";
const HUD_BUTTON = `${HUD_BOX} pointer-events-auto transition-colors hover:bg-[#f5c65b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5c65b]`;

/**
 * Hosts the Phaser game. Phaser (and the game code) load only here, on demand, so the portfolio's bundle is
 * unaffected. React draws the HUD and the overlays (dialogue, discoveries, journal) and only re-renders when
 * one of those changes, never per frame.
 */
export default function WorldGame() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");
  const [overlay, setOverlay] = useState<Overlay>(null);
  const router = useRouter();
  const mainRef = useRef<HTMLElement>(null);
  const [intro, setIntro] = useState(true); // the cartridge insert plays until the game is loaded and seated
  const exiting = useRef(false);
  const [progress, setProgress] = useState<ProgressSnapshot>(EMPTY);
  const progressRef = useRef<ProgressSnapshot>(EMPTY);
  const [region, setRegion] = useState({ id: "origin", name: "Origin Valley" });
  const [toasts, setToasts] = useState<string[]>([]);
  const [settings, setSettingsState] = useState<Settings>({ sound: true, music: false, reducedMotion: false });
  const [banner, setBanner] = useState<{ name: string; blurb: string; at: number } | null>(null); // "you've arrived" sign
  const [walked, setWalked] = useState(false); // fades the controls hint after the first step
  const found = new Set(progress.attributes);

  // Save one fact (visited region, read terminal, found attribute) and announce any achievement it completes.
  // Kept in a ref too so bus listeners registered once always see the latest progress.
  const bump = (field: keyof ProgressSnapshot, id: string) => {
    const prev = progressRef.current;
    if (prev[field].includes(id)) return;
    record(field, id);
    const next = { ...prev, [field]: [...prev[field], id] };
    progressRef.current = next;
    setProgress(next);
    const unlocked = ACHIEVEMENTS.filter((a) => !a.done(prev) && a.done(next)).map((a) => a.name);
    if (unlocked.length) {
      sfx("achievement");
      setToasts((t) => [...t, ...unlocked]);
    }
  };
  const bumpRef = useRef(bump);
  useEffect(() => {
    bumpRef.current = bump;
  });

  // The location sign shows for 2.8s each time a region loads (after the cartridge intro on first load)
  useEffect(() => {
    if (!banner || intro) return;
    const id = setTimeout(() => setBanner(null), 2800);
    return () => clearTimeout(id);
  }, [banner, intro]);

  // One toast at a time, 3.5s each
  useEffect(() => {
    if (!toasts.length) return;
    const id = setTimeout(() => setToasts((t) => t.slice(1)), 3500);
    return () => clearTimeout(id);
  }, [toasts]);

  useEffect(() => {
    try {
      localStorage.setItem("krishi-world:entry", "world"); // the title screen badges the last mode played
    } catch {
      // not remembered
    }
    let game: Phaser.Game | undefined;
    let cancelled = false;
    import("@/game/createGame")
      .then(({ createGame }) => {
        if (cancelled || !hostRef.current) return;
        game = createGame(hostRef.current);
        setStatus("ready");
      })
      .catch((err) => {
        console.error("KRISHI.WORLD failed to load:", err);
        if (!cancelled) setStatus("error");
      });
    return () => {
      cancelled = true;
      game?.destroy(true);
    };
  }, []);

  // Saved discoveries are read after mount (localStorage is browser-only)
  useEffect(() => {
    progressRef.current = snapshot();
    setProgress(progressRef.current);
    setSettingsState(getSettings());
    // Audio may only start after a gesture: the first key press or tap starts music if it's switched on
    const unlockAudio = () => syncMusic();
    window.addEventListener("keydown", unlockAudio, { once: true });
    window.addEventListener("pointerdown", unlockAudio, { once: true });
    const offs = [
      on("dialogue", (dialogue) => {
        sfx("open");
        setOverlay({ kind: "dialogue", dialogue });
      }),
      on("discover", (id) => {
        sfx("discover");
        bumpRef.current("attributes", id); // the scene already saved it; this updates the UI and achievements
        setOverlay({ kind: "discover", id });
      }),
      on("open-journal", () => setOverlay({ kind: "journal" })),
      on("open-profile", () => setOverlay({ kind: "profile" })),
      on("terminal", (id) => setOverlay({ kind: "terminal", id })),
      on("region", (r) => {
        setRegion(r);
        setBanner({ name: r.name, blurb: REGIONS.find((x) => x.id === r.id)?.blurb ?? "", at: Date.now() });
        bumpRef.current("regions", r.id);
      }),
      on("moved", () => setWalked(true)),
      on("open-map", () => setOverlay({ kind: "map" })),
      on("open-achievements", () => setOverlay({ kind: "achievements" })),
      on("open-menu", () => {
        sfx("select");
        setOverlay({ kind: "menu" });
      }),
      on("open-journal", () => sfx("select")),
      on("open-profile", () => sfx("select")),
      on("terminal", () => sfx("open")),
    ];
    return () => {
      offs.forEach((off) => off());
      window.removeEventListener("keydown", unlockAudio);
      window.removeEventListener("pointerdown", unlockAudio);
      stopMusic();
    };
  }, []);

  const close = () => {
    setOverlay(null);
    emit("ui-closed");
  };

  // Closing a terminal for the first time awards its attribute (the world stays paused through the card)
  const closeTerminal = (id: string) => {
    bump("terminals", id);
    const attribute = TERMINALS[id]?.attribute;
    if (!attribute || found.has(attribute)) return close();
    bump("attributes", attribute);
    sfx("discover");
    setOverlay({ kind: "discover", id: attribute });
  };

  const toggle = (key: "sound" | "music" | "reducedMotion") => {
    const next = setSettings({ [key]: !settings[key] });
    setSettingsState(next);
    syncMusic();
    emit("settings-changed");
    sfx("select");
  };

  const openMenu = () => {
    if (overlay) return;
    emit("ui-open");
    setOverlay({ kind: "menu" });
  };

  // Leaving is a console power-off: the screen collapses to a line, then the next screen loads
  const leave = (href: "/" | "/classic") => {
    if (exiting.current) return;
    exiting.current = true;
    if (reduceMotion() || !mainRef.current) return router.push(href);
    gsap.to(mainRef.current, {
      clipPath: "inset(49.8% 0% 49.8% 0%)",
      filter: "brightness(1.8)",
      duration: 0.35,
      ease: "power2.in",
      onComplete: () => router.push(href),
    });
  };
  // A real link (middle / Ctrl-click still open a new tab); a plain click plays the power-off first
  const leaveOnClick = (e: React.MouseEvent, href: "/" | "/classic") => {
    if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
    e.preventDefault();
    leave(href);
  };

  const choose = (c: MenuChoice) => {
    if (c === "classic") return leave("/classic");
    if (c === "mainMenu") return leave("/");
    if (c === "resume") return void window.open(contact.linkedin, "_blank", "noopener,noreferrer");
    if (c === "contact") return window.location.assign(`mailto:${contact.email}`);
    setOverlay({ kind: c });
  };

  // Fast travel: the scene fades out and rebuilds on the target map, which unlocks it
  const travel = (id: string) => {
    setOverlay(null);
    emit("travel", id);
  };

  return (
    <main ref={mainRef} className={`${PIXEL} fixed inset-0 bg-[#1c4031] text-[#f5e8c8] select-none`}>
      <div ref={hostRef} className="absolute inset-0" aria-label="KRISHI.WORLD game" role="application" />

      {/* HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-2 p-3 sm:p-4">
        <div className="flex flex-wrap items-start gap-2">
          <div className={HUD_BOX}>
            <span className="tracking-[0.15em]">KRISHI.WORLD</span>
            <span className="hidden text-[#285943] sm:inline"> · {region.name}</span>
          </div>
          <button
            type="button"
            onClick={() => {
              if (overlay) return;
              emit("ui-open");
              setOverlay({ kind: "journal" });
            }}
            className={`${HUD_BUTTON} flex items-center gap-1.5`}
            aria-label={`Journal: ${found.size} of ${ATTRIBUTES.length} attributes found`}
          >
            <svg width="12" height="12" viewBox="0 0 16 16" aria-hidden="true" shapeRendering="crispEdges">
              <path d="M8 1 L14 7 L8 15 L2 7 Z" fill="#b48be8" stroke="#1f1d24" strokeWidth="1.2" />
            </svg>
            {found.size}/{ATTRIBUTES.length}
          </button>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={openMenu} className={HUD_BUTTON} aria-label="Open menu">
            Menu <span className="hidden sm:inline">(Esc)</span>
          </button>
          <Link href="/classic" className={HUD_BUTTON} onClick={(e) => leaveOnClick(e, "/classic")}>
            Classic<span className="hidden sm:inline"> Portfolio</span>
          </Link>
          <Link href="/" className={HUD_BUTTON} onClick={(e) => leaveOnClick(e, "/")} aria-label="Main Menu">
            ⏻<span className="hidden sm:inline"> Main Menu</span>
          </Link>
        </div>
      </div>

      {/* Location sign: slides in from the top-left when a region loads, like a GBA area name */}
      {banner && !intro && status === "ready" && (
        <div
          key={banner.at}
          role="status"
          className={`pointer-events-none absolute top-[6.75rem] left-3 border-4 border-[#46382b] bg-[repeating-linear-gradient(180deg,#f5e8c8_0_10px,#ecdcb6_10px_12px)] px-4 py-2 text-[#2b2420] shadow-[4px_4px_0_#46382b] sm:top-[4.5rem] sm:left-4 ${settings.reducedMotion ? "" : "motion-safe:animate-[kw-banner_2.8s_ease-in-out_both]"}`}
        >
          <p className="text-xl leading-tight tracking-[0.08em] sm:text-2xl">{banner.name}</p>
          {banner.blurb && <p className="text-sm text-[#285943]">{banner.blurb}</p>}
        </div>
      )}

      {!overlay && (
        <p
          className={`pointer-events-none absolute inset-x-0 bottom-4 hidden justify-center transition-opacity duration-700 md:flex ${walked ? "opacity-0" : "opacity-100"}`}
          aria-hidden={walked}
        >
          <span className="border-2 border-[#46382b] bg-[#f5e8c8]/95 px-3 py-1 text-sm tracking-[0.1em] text-[#2b2420] shadow-[3px_3px_0_#46382b]">
            WASD / ARROWS walk · E talk / inspect · Esc menu · M map
          </span>
        </p>
      )}

      {!overlay && status === "ready" && <TouchControls />}
      {overlay?.kind === "dialogue" && (
        <DialogueBox key={JSON.stringify(overlay.dialogue)} dialogue={overlay.dialogue} reduced={settings.reducedMotion || reduceMotion()} onClose={close} />
      )}
      {overlay?.kind === "discover" && <DiscoveryCard id={overlay.id} onClose={close} />}
      {overlay?.kind === "journal" && <Journal found={found} onClose={close} />}
      {overlay?.kind === "terminal" && <ProjectTerminal id={overlay.id} onClose={() => closeTerminal(overlay.id)} />}
      {overlay?.kind === "profile" && <ProfileCard found={found} onClose={close} />}
      {overlay?.kind === "menu" && <PauseMenu settings={settings} onChoose={choose} onToggle={toggle} onClose={close} />}
      {overlay?.kind === "guide" && <TextGuide found={found} onOpenTerminal={(id) => setOverlay({ kind: "terminal", id })} onClose={close} />}
      {overlay?.kind === "map" && <WorldMap visited={progress.regions} current={region.id} onTravel={travel} onClose={close} />}
      {overlay?.kind === "achievements" && <AchievementList progress={progress} onClose={close} />}
      {toasts[0] && <AchievementToast key={toasts[0] + toasts.length} name={toasts[0]} />}

      {intro && status !== "error" && <CartridgeIntro ready={status === "ready"} onDone={() => setIntro(false)} />}

      {status === "error" && (
        <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-4 bg-[#16201b] text-sm">
          <p>The world couldn&apos;t load in this browser.</p>
          <Link href="/classic" className="underline">
            Go to the classic portfolio
          </Link>
        </div>
      )}
    </main>
  );
}
