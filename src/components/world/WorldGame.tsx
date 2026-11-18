"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type Phaser from "phaser";
import { emit, on, type Dialogue } from "@/game/bus";
import { discover, discovered } from "@/game/progress";
import { TERMINALS } from "@/game/content";
import { DialogueBox, DiscoveryCard, Journal, ProfileCard, ProjectTerminal } from "./Overlays";

type Overlay =
  | { kind: "dialogue"; dialogue: Dialogue }
  | { kind: "discover"; id: string }
  | { kind: "journal" }
  | { kind: "terminal"; id: string }
  | { kind: "profile" }
  | null;

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
  const [found, setFound] = useState<Set<string>>(() => new Set());
  const [region, setRegion] = useState("Origin Valley");

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
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setFound(new Set(discovered()));
    const offs = [
      on("dialogue", (dialogue) => setOverlay({ kind: "dialogue", dialogue })),
      on("discover", (id) => {
        setFound((prev) => new Set(prev).add(id)); // also covers a browser that can't save
        setOverlay({ kind: "discover", id });
      }),
      on("open-journal", () => setOverlay({ kind: "journal" })),
      on("open-profile", () => setOverlay({ kind: "profile" })),
      on("terminal", (id) => setOverlay({ kind: "terminal", id })),
      on("region", setRegion),
    ];
    return () => offs.forEach((off) => off());
  }, []);

  const close = () => {
    setOverlay(null);
    emit("ui-closed");
  };

  // Closing a terminal for the first time awards its attribute (the world stays paused through the card)
  const closeTerminal = (id: string) => {
    const attribute = TERMINALS[id]?.attribute;
    if (!attribute || found.has(attribute)) return close();
    discover(attribute);
    setFound((prev) => new Set(prev).add(attribute));
    setOverlay({ kind: "discover", id: attribute });
  };

  const openFromHud = (next: { kind: "journal" } | { kind: "profile" }) => {
    if (overlay) return;
    emit("ui-open");
    setOverlay(next);
  };

  return (
    <main className="fixed inset-0 bg-[#1c4031] font-mono text-[#f5e8c8] select-none">
      <div ref={hostRef} className="absolute inset-0" aria-label="KRISHI.WORLD game" role="application" />

      {/* HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-3 p-4">
        <div className={HUD_BOX}>
          <span className="font-bold tracking-[0.18em]">KRISHI.WORLD</span>
          <span className="hidden sm:inline"> · {region}</span>
        </div>
        <div className="flex gap-2">
          <button type="button" onClick={() => openFromHud({ kind: "profile" })} className={HUD_BUTTON} aria-label="Open profile card">
            Profile <span className="hidden sm:inline">(P)</span>
          </button>
          <button type="button" onClick={() => openFromHud({ kind: "journal" })} className={HUD_BUTTON} aria-label="Open Discovery Journal">
            Journal <span className="hidden sm:inline">(I) · {found.size}</span>
          </button>
          <Link href="/" className={HUD_BUTTON}>
            ← <span className="hidden sm:inline">Back to </span>Portfolio
          </Link>
        </div>
      </div>

      {!overlay && (
        <p className="pointer-events-none absolute inset-x-0 bottom-4 hidden text-center text-[11px] tracking-[0.18em] text-[#f5e8c8]/80 md:block">
          WASD / ARROWS: WALK · E: TALK / INSPECT · I: JOURNAL · P: PROFILE
        </p>
      )}

      {overlay?.kind === "dialogue" && <DialogueBox key={JSON.stringify(overlay.dialogue)} dialogue={overlay.dialogue} onClose={close} />}
      {overlay?.kind === "discover" && <DiscoveryCard id={overlay.id} onClose={close} />}
      {overlay?.kind === "journal" && <Journal found={found} onClose={close} />}
      {overlay?.kind === "terminal" && <ProjectTerminal id={overlay.id} onClose={() => closeTerminal(overlay.id)} />}
      {overlay?.kind === "profile" && <ProfileCard found={found} onClose={close} />}

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
