"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import type Phaser from "phaser";
import { emit, on, type Dialogue } from "@/game/bus";
import { record, snapshot } from "@/game/progress";
import { getSettings, reduceMotion, setSettings, type Settings } from "@/game/settings";
import { sfx, stopMusic, syncMusic } from "@/game/audio";
import { ACHIEVEMENTS, TERMINALS, type ProgressSnapshot } from "@/game/content";
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

const HUD_BOX = "border-2 border-[#46382b] bg-[#f5e8c8] px-3 py-1.5 text-xs text-[#46382b] shadow-[3px_3px_0_#46382b]";
const HUD_BUTTON = `${HUD_BOX} pointer-events-auto font-bold hover:bg-[#f5c65b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5c65b]`;

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
  const [progress, setProgress] = useState<ProgressSnapshot>(EMPTY);
  const progressRef = useRef<ProgressSnapshot>(EMPTY);
  const [region, setRegion] = useState({ id: "origin", name: "Origin Valley" });
  const [toasts, setToasts] = useState<string[]>([]);
  const [settings, setSettingsState] = useState<Settings>({ sound: true, music: false, reducedMotion: false });
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

  // One toast at a time, 3.5s each
  useEffect(() => {
    if (!toasts.length) return;
    const id = setTimeout(() => setToasts((t) => t.slice(1)), 3500);
    return () => clearTimeout(id);
  }, [toasts]);

  useEffect(() => {
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
        bumpRef.current("regions", r.id);
      }),
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

  const choose = (c: MenuChoice) => {
    if (c === "portfolio") return router.push("/");
    setOverlay({ kind: c });
  };

  // Fast travel: the scene fades out and rebuilds on the target map, which unlocks it
  const travel = (id: string) => {
    setOverlay(null);
    emit("travel", id);
  };

  return (
    <main className="fixed inset-0 bg-[#1c4031] font-mono text-[#f5e8c8] select-none">
      <div ref={hostRef} className="absolute inset-0" aria-label="KRISHI.WORLD game" role="application" />

      {/* HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
        <div className={HUD_BOX}>
          <span className="font-bold tracking-[0.18em]">KRISHI.WORLD</span>
          <span className="hidden sm:inline"> · {region.name}</span>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={openMenu} className={HUD_BUTTON} aria-label="Open menu">
            Menu <span className="hidden sm:inline">(Esc)</span>
          </button>
          <Link href="/" className={HUD_BUTTON}>
            ← <span className="hidden sm:inline">Back to </span>Portfolio
          </Link>
        </div>
      </div>

      {!overlay && (
        <p className="pointer-events-none absolute inset-x-0 bottom-4 hidden text-center text-[11px] tracking-[0.18em] text-[#f5e8c8]/80 md:block">
          WASD / ARROWS: WALK · E: TALK / INSPECT · ESC: MENU · M: MAP
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

      {status !== "ready" && (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 text-sm">
          {status === "loading" ? (
            <p className="tracking-[0.18em]">LOADING WORLD…</p>
          ) : (
            <>
              <p>The world couldn&apos;t load in this browser.</p>
              <Link href="/" className="underline">
                Go to the classic portfolio
              </Link>
            </>
          )}
        </div>
      )}
    </main>
  );
}
