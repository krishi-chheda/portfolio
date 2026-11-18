"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import type Phaser from "phaser";

/**
 * Hosts the Phaser game. Phaser (and the game code) load only here, on demand, so the portfolio's bundle is
 * unaffected. React draws the HUD around the canvas and doesn't re-render during play.
 */
export default function WorldGame() {
  const hostRef = useRef<HTMLDivElement>(null);
  const [status, setStatus] = useState<"loading" | "ready" | "error">("loading");

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

  return (
    <main className="fixed inset-0 bg-[#1c4031] font-mono text-[#f5e8c8] select-none">
      <div ref={hostRef} className="absolute inset-0" aria-label="KRISHI.WORLD game" role="application" />

      {/* HUD */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between gap-4 p-4">
        <div className="border-2 border-[#46382b] bg-[#f5e8c8] px-3 py-1.5 text-xs text-[#46382b] shadow-[3px_3px_0_#46382b]">
          <span className="font-bold tracking-[0.18em]">KRISHI.WORLD</span>
          <span className="hidden sm:inline"> · Origin Valley</span>
        </div>
        <Link
          href="/"
          className="pointer-events-auto border-2 border-[#46382b] bg-[#f5e8c8] px-3 py-1.5 text-xs font-bold text-[#46382b] shadow-[3px_3px_0_#46382b] hover:bg-[#f5c65b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#f5c65b]"
        >
          ← Back to portfolio
        </Link>
      </div>

      <p className="pointer-events-none absolute inset-x-0 bottom-4 hidden text-center text-[11px] tracking-[0.18em] text-[#f5e8c8]/80 md:block">
        WASD / ARROW KEYS TO WALK
      </p>

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
