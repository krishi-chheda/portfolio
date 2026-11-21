import { useLayoutEffect, useRef, type DependencyList } from "react";
import gsap from "gsap";
import { MOTION_OK } from "@/lib/motion";
import { reduceMotion } from "@/game/settings";

/**
 * Plays a GSAP entrance when the element mounts (and again whenever `deps` change), before paint so the start
 * state never flashes. Skipped entirely under reduced motion: the OS setting (via gsap.matchMedia) or the game's
 * own Motion toggle. Every tween is reverted on unmount or before the next run.
 */
export function useEntrance<T extends HTMLElement>(play: (el: T) => void, deps: DependencyList = []) {
  const ref = useRef<T>(null);
  const playRef = useRef(play);
  useLayoutEffect(() => {
    playRef.current = play;
  });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || reduceMotion()) return;
    const mm = gsap.matchMedia();
    mm.add(MOTION_OK, () => playRef.current(el), el);
    return () => mm.revert();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
  return ref;
}
