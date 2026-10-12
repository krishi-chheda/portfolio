"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type KeyboardEvent, type PointerEvent } from "react";
import gsap from "gsap";
import SectionHeader from "@/components/ui/SectionHeader";
import { useTerminalReveal } from "@/hooks/useTerminalReveal";
import { useBooted } from "@/components/boot/BootWrapper";
import { DUR, EASE, MOTION_OK } from "@/lib/motion";
import { executeNavigationCommand } from "@/lib/navigation";
import { EDGES, GROUP, GROUPS, NEIGHBOURS, NODE, NODES, type Group, type TopoNode } from "@/lib/topology";

// Viewport geometry (SVG user units). Labels are HTML positioned in % of the same box, so they stay 11px and upright.
const W = 600;
const H = 540;
const R = 165;
const DEFAULT_VIEW = { yaw: -0.6, pitch: 0.35 };
const DRAG_THRESHOLD = 4; // px before a press becomes a drag; below it, the press is a click
const DRAG_SPEED = 0.008; // radians per px
const KEY_STEP = 0.15; // radians per arrow key press
const MAX_PITCH = 1.3;

type View = typeof DEFAULT_VIEW;
// Highlight targets as strings ("n:<id>" | "g:<group>") so identical hovers don't re-render.
type Target = string | null;

const clampPitch = (p: number) => Math.max(-MAX_PITCH, Math.min(MAX_PITCH, p));
const round = (v: number) => Math.round(v * 100) / 100; // keeps server and client markup identical

// Rotate the fixed 3D position by the view (yaw, then pitch) and project with mild perspective.
function project([x, y, z]: TopoNode["pos"], { yaw, pitch }: View) {
  const x1 = x * Math.cos(yaw) + z * Math.sin(yaw);
  const z1 = -x * Math.sin(yaw) + z * Math.cos(yaw);
  const y2 = y * Math.cos(pitch) - z1 * Math.sin(pitch);
  const z2 = y * Math.sin(pitch) + z1 * Math.cos(pitch);
  const s = 3 / (3 - z2);
  return { x: round(W / 2 + R * x1 * s), y: round(H / 2 - R * y2 * s), depth: round((z2 + 1) / 2) };
}

function lit(target: Target): { nodes: Set<string>; edges: Set<number> } | null {
  if (!target) return null;
  const key = target.slice(2);
  const nodes = target.startsWith("n:")
    ? new Set([key, ...NEIGHBOURS[key]])
    : new Set(NODES.filter((n) => n.group === key).map((n) => n.id));
  const touches = target.startsWith("n:") ? (id: string) => id === key : (id: string) => nodes.has(id);
  return { nodes, edges: new Set(EDGES.flatMap(([a, b], i) => (touches(a) || touches(b) ? [i] : []))) };
}

const targetName = (t: Target) => (!t ? "all" : t.startsWith("n:") ? NODE[t.slice(2)].label : GROUP[t.slice(2) as Group].plural);

const narrowQuery = "(max-width: 639px)";
const subscribeNarrow = (cb: () => void) => {
  const mq = window.matchMedia(narrowQuery);
  mq.addEventListener("change", cb);
  return () => mq.removeEventListener("change", cb);
};

export default function SystemMap() {
  const sectionRef = useTerminalReveal<HTMLElement>();
  const surfaceRef = useRef<HTMLDivElement>(null);
  const booted = useBooted();
  const narrow = useSyncExternalStore(subscribeNarrow, () => window.matchMedia(narrowQuery).matches, () => false);

  const [view, setView] = useState<View>(DEFAULT_VIEW);
  const [hovered, setHovered] = useState<Target>(null);
  const [focused, setFocused] = useState<Target>(null);
  const [selected, setSelected] = useState<Target>(null);
  const drag = useRef<{ x: number; y: number; view: View; node: string | null; moved: boolean } | null>(null);
  const resetTween = useRef<gsap.core.Tween | null>(null);

  // Only drag, arrow keys and reset change `view`. Hover, focus, click and legend only touch highlight state.
  const effective = hovered ?? focused ?? selected;
  const hl = lit(effective);
  const points = Object.fromEntries(NODES.map((n) => [n.id, project(n.pos, view)]));

  // One-time draw-in when the section scrolls into view: edges draw, then node groups fade/scale in band by band.
  useLayoutEffect(() => {
    const root = surfaceRef.current;
    if (!root) return;
    const mm = gsap.matchMedia();
    mm.add(
      MOTION_OK,
      () => {
        const tl = gsap.timeline({ paused: true, defaults: { ease: EASE } });
        tl.fromTo(
          '[data-sm="edge"]',
          { strokeDasharray: 1, strokeDashoffset: 1 },
          { strokeDashoffset: 0, duration: DUR.slow, stagger: { amount: 0.2 }, clearProps: "strokeDasharray,strokeDashoffset" }
        );
        GROUPS.forEach((g, i) => {
          tl.from(
            `[data-sm="node"][data-group="${g.id}"]`,
            { opacity: 0, scale: 0.4, transformOrigin: "50% 50%", duration: DUR.standard, stagger: 0.03, clearProps: "opacity,transform" },
            0.2 + i * 0.08
          );
        });
        tl.from('[data-sm="label"]', { opacity: 0, duration: DUR.standard, clearProps: "opacity" }, 0.45);

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              tl.play();
              observer.disconnect();
            }
          },
          { threshold: 0.2 }
        );
        if (booted) observer.observe(root);
        return () => observer.disconnect();
      },
      root
    );
    return () => mm.revert();
  }, [booted]);

  useEffect(() => () => void resetTween.current?.kill(), []);

  const rotateTo = (next: View) => {
    resetTween.current?.kill();
    setView({ yaw: next.yaw, pitch: clampPitch(next.pitch) });
  };

  const resetView = () => {
    resetTween.current?.kill();
    if (!window.matchMedia(MOTION_OK).matches) return setView(DEFAULT_VIEW); // reduced motion: snap
    const proxy = { ...view };
    resetTween.current = gsap.to(proxy, {
      ...DEFAULT_VIEW,
      duration: DUR.slow,
      ease: EASE,
      onUpdate: () => setView({ yaw: proxy.yaw, pitch: proxy.pitch }),
    });
  };

  const nodeAt = (el: EventTarget) => (el as Element).closest?.("[data-node]")?.getAttribute("data-node") ?? null;

  const onPointerDown = (e: PointerEvent<HTMLDivElement>) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    resetTween.current?.kill();
    drag.current = { x: e.clientX, y: e.clientY, view, node: nodeAt(e.target), moved: false };
    e.currentTarget.setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) {
      const id = nodeAt(e.target);
      setHovered(id ? `n:${id}` : null);
      return;
    }
    const dx = e.clientX - d.x;
    const dy = e.clientY - d.y;
    if (!d.moved && dx * dx + dy * dy < DRAG_THRESHOLD * DRAG_THRESHOLD) return;
    d.moved = true;
    rotateTo({ yaw: d.view.yaw + dx * DRAG_SPEED, pitch: d.view.pitch + dy * DRAG_SPEED });
  };

  const onPointerUp = () => {
    const d = drag.current;
    drag.current = null;
    // A press that never crossed the threshold is a click: select the node under it, or clear on empty space.
    if (d && !d.moved) setSelected(d.node ? `n:${d.node}` : null);
  };

  const onSurfaceKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const step: Record<string, [number, number]> = {
      ArrowLeft: [-KEY_STEP, 0],
      ArrowRight: [KEY_STEP, 0],
      ArrowUp: [0, -KEY_STEP],
      ArrowDown: [0, KEY_STEP],
    };
    if (!step[e.key]) return;
    e.preventDefault();
    rotateTo({ yaw: view.yaw + step[e.key][0], pitch: view.pitch + step[e.key][1] });
  };

  const isDefaultView = view.yaw === DEFAULT_VIEW.yaw && view.pitch === DEFAULT_VIEW.pitch;
  const selectedNode = selected?.startsWith("n:") ? NODE[selected.slice(2)] : null;
  const selectedGroup = selected?.startsWith("g:") ? GROUP[selected.slice(2) as Group] : null;

  const showLabel = (n: TopoNode) => !narrow || (hl ? hl.nodes.has(n.id) : n.group === "project");

  return (
    <section ref={sectionRef} id="system-map" className="py-24 border-t border-rule">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeader num="05" title="System Map" command="open system-map" meta="drag to rotate · hover or tap a node" />

        <div
          data-reveal="panel"
          className="terminal-highlight grid border border-rule bg-bg lg:grid-cols-[minmax(0,1fr)_320px]"
          onKeyDown={(e) => e.key === "Escape" && setSelected(null)}
        >
          <div className="relative min-w-0">
            {/* Legend: hover or click a group to highlight it */}
            <ul className="flex flex-wrap gap-x-4 gap-y-1 border-b border-rule p-3 text-[11px] sm:absolute sm:left-3 sm:top-3 sm:z-10 sm:block sm:border sm:bg-bg sm:space-y-1">
              <li className="hidden sm:block text-ink-faint uppercase tracking-[0.18em] mb-1">legend</li>
              {GROUPS.map((g) => {
                const key = `g:${g.id}`;
                const count = NODES.filter((n) => n.group === g.id).length;
                return (
                  <li key={g.id}>
                    <button
                      type="button"
                      aria-pressed={selected === key}
                      onPointerEnter={() => setHovered(key)}
                      onPointerLeave={() => setHovered(null)}
                      onFocus={() => setFocused(key)}
                      onBlur={() => setFocused(null)}
                      onClick={() => setSelected((s) => (s === key ? null : key))}
                      className={`flex items-center gap-2 cursor-pointer transition-colors duration-150 ${
                        effective === key ? "text-ink" : "text-ink-soft hover:text-ink"
                      }`}
                    >
                      <span aria-hidden style={{ color: g.color }}>●</span>
                      {g.plural} <span className="text-ink-faint">{count}</span>
                    </button>
                  </li>
                );
              })}
            </ul>

            <button
              type="button"
              onClick={resetView}
              disabled={isDefaultView}
              className="absolute right-3 top-3 z-10 max-sm:top-auto max-sm:bottom-12 border border-rule bg-bg px-2 py-1 text-[11px] text-ink-soft transition-colors duration-150 hover:text-accent hover:border-accent disabled:opacity-40 disabled:pointer-events-none cursor-pointer"
            >
              reset view
            </button>

            {/* Graph surface: the only element that captures drags (touch-action: none lives here only) */}
            <div
              ref={surfaceRef}
              tabIndex={0}
              role="group"
              aria-label="System map. Drag or use the arrow keys to rotate; Tab to move between nodes; Escape clears the selection."
              className="relative touch-none select-none cursor-grab active:cursor-grabbing outline-none focus-visible:outline focus-visible:outline-1 focus-visible:outline-accent focus-visible:-outline-offset-1"
              style={{ aspectRatio: `${W} / ${H}` }}
              onPointerDown={onPointerDown}
              onPointerMove={onPointerMove}
              onPointerUp={onPointerUp}
              onPointerCancel={() => {
                drag.current = null;
              }}
              onPointerLeave={() => !drag.current && setHovered(null)}
              onKeyDown={onSurfaceKey}
            >
              <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full">
                <defs>
                  <filter id="sm-glow" x="-200%" y="-200%" width="500%" height="500%">
                    <feGaussianBlur stdDeviation="4" />
                  </filter>
                </defs>

                {EDGES.map(([a, b], i) => {
                  const p = points[a];
                  const q = points[b];
                  const on = hl?.edges.has(i);
                  return (
                    <line
                      key={`${a}-${b}`}
                      data-sm="edge"
                      x1={p.x}
                      y1={p.y}
                      x2={q.x}
                      y2={q.y}
                      pathLength={1}
                      strokeWidth={on ? 1.25 : 0.75}
                      strokeOpacity={round((on ? 0.95 : 0.3) * (0.35 + 0.65 * ((p.depth + q.depth) / 2)))}
                      style={{ stroke: on ? "var(--color-accent)" : "var(--color-accent-2)" }}
                      className={`transition-[opacity,stroke] duration-150 motion-reduce:transition-none ${hl && !on ? "opacity-20" : ""}`}
                    />
                  );
                })}

                {NODES.map((n) => {
                  const p = points[n.id];
                  const color = GROUP[n.group].color;
                  const key = `n:${n.id}`;
                  const isTarget = effective === key;
                  const neighbours = NEIGHBOURS[n.id].map((id) => NODE[id].label);
                  return (
                    <g
                      key={n.id}
                      data-node={n.id}
                      role="button"
                      tabIndex={0}
                      aria-pressed={selected === key}
                      aria-label={`${n.label}, ${GROUP[n.group].label}. Connected to ${neighbours.join(", ")}.`}
                      onFocus={() => setFocused(key)}
                      onBlur={() => setFocused(null)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          setSelected(key);
                        }
                      }}
                      // Pointer clicks are resolved in onPointerUp; this only handles assistive-tech activation (detail 0).
                      onClick={(e) => e.detail === 0 && setSelected(key)}
                      className="group cursor-pointer outline-none"
                    >
                      <g data-sm="node" data-group={n.group}>
                        <g opacity={round(0.35 + 0.65 * p.depth)}>
                          <g className={`transition-opacity duration-150 motion-reduce:transition-none ${hl && !hl.nodes.has(n.id) ? "opacity-20" : ""}`}>
                            <circle cx={p.x} cy={p.y} r={16} fill="transparent" />
                            <circle cx={p.x} cy={p.y} r={isTarget ? 11 : 7} fill={color} opacity={isTarget ? 0.75 : 0.45} filter="url(#sm-glow)" />
                            <circle cx={p.x} cy={p.y} r={round(2.6 + 1.6 * p.depth)} fill={color} />
                            {selected === key && <circle cx={p.x} cy={p.y} r={9} fill="none" stroke={color} strokeWidth={1} />}
                            <circle
                              cx={p.x}
                              cy={p.y}
                              r={13}
                              fill="none"
                              stroke="var(--color-accent)"
                              strokeDasharray="2 2"
                              className="opacity-0 group-focus-visible:opacity-100"
                            />
                          </g>
                        </g>
                      </g>
                    </g>
                  );
                })}
              </svg>

              {/* Labels: small upright mono tags beside each node (decorative; nodes carry the accessible names) */}
              <div aria-hidden className="pointer-events-none absolute inset-0">
                {NODES.map((n) => {
                  if (!showLabel(n)) return null;
                  const p = points[n.id];
                  const on = hl?.nodes.has(n.id);
                  const strong = effective === `n:${n.id}` || selected === `n:${n.id}`;
                  return (
                    <span
                      key={n.id}
                      className="absolute"
                      style={{ left: `${(p.x / W) * 100}%`, top: `${(p.y / H) * 100}%`, transform: "translate(10px, -50%)", opacity: round(0.45 + 0.55 * p.depth) }}
                    >
                      <span
                        data-sm="label"
                        data-node={n.id}
                        className={`pointer-events-auto block whitespace-nowrap border bg-bg px-1.5 py-px text-[11px] leading-4 transition-[opacity,color,border-color] duration-150 motion-reduce:transition-none ${
                          strong ? "border-accent text-ink" : on ? "border-ink-faint text-ink" : "border-rule text-ink-soft"
                        } ${hl && !on ? "opacity-20" : ""}`}
                      >
                        {n.label}
                      </span>
                    </span>
                  );
                })}
              </div>
            </div>

            {/* Status bar */}
            <div className="flex items-center justify-between gap-4 border-t border-rule px-3 py-2 text-[11px]">
              <span className="truncate text-ink-soft">
                <span className="text-accent">live ▣</span> {targetName(effective)} · {NODES.length} nodes
              </span>
              <span className="shrink-0 uppercase tracking-[0.18em] text-ink-faint">drag · hover · click</span>
            </div>
          </div>

          {/* Inspector */}
          <div aria-live="polite" className="border-t border-rule p-5 text-xs leading-relaxed lg:border-t-0 lg:border-l">
            {selectedNode ? (
              <NodeDetails node={selectedNode} onSelect={(id) => setSelected(`n:${id}`)} />
            ) : selectedGroup ? (
              <div>
                <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">
                  <span style={{ color: selectedGroup.color }}>●</span> group
                </p>
                <h3 className="mt-2 text-sm text-ink">{selectedGroup.plural}</h3>
                <ul className="mt-4 space-y-1">
                  {NODES.filter((n) => n.group === selectedGroup.id).map((n) => (
                    <li key={n.id}>
                      <button type="button" onClick={() => setSelected(`n:${n.id}`)} className="text-ink-soft hover:text-accent transition-colors duration-150 cursor-pointer">
                        → {n.label}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <div className="text-ink-soft">
                <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">inspector</p>
                <p className="mt-3">
                  Hover or focus a node to trace its connections; click, Enter or Space pins it here. Drag the map (or use the arrow keys
                  while it has focus) to rotate it. Escape clears the selection.
                </p>
                <p className="mt-3 text-ink-faint">
                  {NODES.length} nodes · {EDGES.length} connections, built from the project and role data on this site.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function NodeDetails({ node, onSelect }: { node: TopoNode; onSelect: (id: string) => void }) {
  const g = GROUP[node.group];
  const p = node.project;
  const link = "text-accent hover:text-accent-2 transition-colors duration-150 cursor-pointer";
  return (
    <div>
      <p className="text-[11px] uppercase tracking-[0.18em] text-ink-faint">
        <span style={{ color: g.color }}>●</span> {g.label}
      </p>
      <h3 className="mt-2 text-sm text-ink">{node.role ? node.role.organization : node.label}</h3>
      <p className="mt-3 text-ink-soft">{node.description}</p>

      {node.role && (
        <dl className="mt-3 space-y-1 text-ink-soft">
          <div><dt className="inline text-ink-faint">role </dt><dd className="inline">{node.role.role}</dd></div>
          <div><dt className="inline text-ink-faint">period </dt><dd className="inline">{node.role.period}</dd></div>
        </dl>
      )}

      {p && (
        <>
          <p className="mt-3 text-ink-soft"><span className="text-ink-faint">status </span>{p.overview.status}</p>
          <ul className="mt-3 flex flex-wrap gap-1.5">
            {p.techStack.map((t) => (
              <li key={t} className="border border-rule px-1.5 py-px text-[11px] text-ink-soft">{t}</li>
            ))}
          </ul>
          <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1">
            <button type="button" onClick={() => executeNavigationCommand(p.id)} className={link}>open in projects →</button>
            {p.githubUrl && <a href={p.githubUrl} target="_blank" rel="noopener noreferrer" className={link}>github ↗</a>}
            {p.liveUrl && <a href={p.liveUrl} target="_blank" rel="noopener noreferrer" className={link}>live ↗</a>}
          </div>
        </>
      )}

      <p className="mt-5 text-[11px] uppercase tracking-[0.18em] text-ink-faint">connections · {NEIGHBOURS[node.id].length}</p>
      <ul className="mt-2 space-y-1">
        {NEIGHBOURS[node.id].map((id) => (
          <li key={id}>
            <button type="button" onClick={() => onSelect(id)} className="text-ink-soft hover:text-accent transition-colors duration-150 cursor-pointer">
              <span style={{ color: GROUP[NODE[id].group].color }}>●</span> {NODE[id].label}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
