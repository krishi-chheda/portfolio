// Class strings for the KRISHI.WORLD retro UI. Plain module (no "use client"), so server components can use them.
export const PIXEL = "font-[family-name:var(--font-pixel)]";
/** Long descriptions: the readable body face, relaxed line height, never wider than a comfortable measure. */
export const PROSE = "font-[family-name:var(--font-body)] leading-relaxed max-w-[70ch]";
export const LABEL = "text-sm uppercase tracking-widest text-[#5a4434]";
export const CHIP = "border-2 border-[#46382b] bg-white px-2 py-0.5 text-sm leading-tight";
export const BUTTON =
  "border-2 border-[#46382b] bg-white px-3 py-1 hover:bg-[#f5c65b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285943]";
export const LINK =
  "border-2 border-[#46382b] bg-white px-3 py-1 text-base hover:bg-[#f5c65b] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#285943]";
/** A static panel in the shared frame (cream body, brown border + drop shadow). */
export const PANEL = "border-4 border-[#46382b] bg-[#f5e8c8] text-[#2b2420] shadow-[6px_6px_0_#46382b]";
/** The forest-green title bar used by every window. */
export const TITLE_BAR = "flex flex-wrap items-center justify-between gap-x-3 border-b-4 border-[#46382b] bg-[#285943] px-4 py-2 text-[#f5e8c8]";
/** Muted body text that still passes WCAG AA on cream and white. */
export const MUTED = "text-[#5a4434]";
/** A white card inside a panel, with the shared hover: lifts a pixel, shadow grows, border turns forest green. */
export const CARD =
  "border-2 border-[#46382b] bg-white shadow-[3px_3px_0_#46382b] transition-[translate,box-shadow,border-color] duration-150 ease-out hover:-translate-x-px hover:-translate-y-px hover:border-[#285943] hover:shadow-[5px_5px_0_#46382b] motion-reduce:transition-none";
