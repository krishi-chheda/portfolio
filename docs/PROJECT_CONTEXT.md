# KRISHI.OS — Project Context

Engineering memory for future sessions. Keep it short and current. Last updated: 2026-10-12 (Phases 0–6 and 8–9 done, plus the redesign).

## Purpose
KRISHI.OS is the interactive portfolio of Krishi Chheda (AI Engineer & Product Builder, Master of AI at Monash, graduating July 2027), presented as a personal operating system. Audience: recruiters, engineers, collaborators.
Principle: *featured projects tell the story, everything else supports it.*

## Approved flagship projects (exactly four)
| id (data.ts) | Title | Repo | Demo |
|---|---|---|---|
| `accessible-vision` | AccessVision | github.com/krishi-chheda/AccessVision | access-vision-xi.vercel.app |
| `clinicalbrief` | ClinicalBrief | github.com/krishi-chheda/clinicalbrief | clinicalbrief.vercel.app |
| `studenthub` | StudentHub | github.com/krishi-chheda/student-hub | mystudenthub.vercel.app |
| `traffic-ai` | Traffic AI | none public | none |

**Evidence rule:** every published claim must trace to a repo, README or owner confirmation.
- **AccessVision:** metrics from the repo README benchmark (50 Locust users: p95 8,920→2,406 ms (73%), success 11.2%→100%, detection 1,450→176 ms) and project_showcase.md (~4MB→~150KB).
- **ClinicalBrief:** scoped to the current repo: FHIR R4 ingestion, provenance, rule-based note extraction, a human review queue, a grounded local-LLM copilot, FHIR export, Supabase Postgres + RLS. Research prototype on synthetic data. No Whisper, GPT-4o or audio.
- **StudentHub:** stack from package.json and the tree: Next 14, Supabase, Tailwind, Eventbrite, Foursquare, ABS data.
- **Traffic AI:** only "approximately 42% reduction in waiting time" plus the stack.
- **`impactLog`** in data.ts holds the four verified hero metrics.

**Owner-confirmed dates:**
- MDAS: Media & Marketing Officer Oct 2025 – Jan 2026; Director Jan – May 2026; Vice President Jul 2026 – present.
- Traffic AI: Oct – Dec 2024.
- Mysahayak (IT Intern): Jan – May 2025.
- StudentHub: Jan – May 2025.
- Master of AI @ Monash: started Jul 2025.

**Supporting repos** (Ask Krishi and README only, never flagship cards): AuraLens-AI, f1-telemetry-ai-dashboard, fastapi_backend (BP prediction), video-splitter.

## Stack
- **Core:** Next.js 16.2.9 (App Router, Turbopack), React 19.2.4, TypeScript 5 strict, Tailwind v4.
- **Motion and UI:** framer-motion 12, gsap 3.15.0 (core only), lucide-react, clsx + tailwind-merge.
- **Delivery:** deploys on Vercel; git remote `krishi-chheda/portfolio`.
- **Next.js docs:** per `AGENTS.md`, read `node_modules/next/dist/docs/` before writing Next-specific code.

## Design system (redesign, 2026-10-12)
- **Origin:** the layout is a near-replica of zacplischka.dev's structure (owner request), with KRISHI.OS's own emerald palette, content and features. Never copy text from that site.
- **Tokens** (in `globals.css` `@theme`, used as Tailwind classes):
  - Backgrounds: `bg-bg` #0a0c0b, `bg-bg-2`, `bg-bg-3`
  - Text: `text-ink` (primary), `text-ink-soft` (body), `text-ink-faint` (labels)
  - Lines: `border-rule` (hairlines)
  - Accents: `accent` #34d399 (the only accent), `accent-2` (hover), `gold` (secondary highlights)
  - Every text token passes WCAG AA on every background.
- **Rules:**
  - All-monospace (Geist Mono only).
  - Flat panels with no rounded corners, shadows or gradients (`rounded-full` only for pills and dots).
  - A fixed `.page-frame` with accent corner ticks.
  - No old Tailwind palette classes (slate, cyan, …).
- **`SectionHeader`** (`src/components/ui/SectionHeader.tsx`) renders `§ 0N TITLE · command` as the section's `<h2>`. Section order and numbers: 01 Projects, 02 Career, 03 Leadership, 04 Currently Building, 05 System Map, 06 Contact.

## Architecture
```
src/app/layout.tsx          Server. Metadata, OG/Twitter, canonical, JSON-LD Person, Geist Mono, .page-frame
src/app/page.tsx            Server. <BootWrapper> wraps Navbar + Hero + 6 sections + Footer + ChatBubble
src/app/readme|now/layout.tsx  Server. Per-route metadata + canonical (pages themselves are client)
src/app/robots.ts, sitemap.ts  sitemap lists /, /readme, /now
src/app/api/chat/route.ts   POST. gpt-4o-mini (temp 0.2) if OPENAI_API_KEY, else local answers built from data.ts.
                            Third-person assistant, facts-only prompt, command allow-list, per-IP rate limit 10/min (per instance)
src/app/api/github/route.ts GET. Repos from data.ts githubUrls + latest commit; Next data cache 15 min; 503/stale on failure
src/components/sections/*   Hero, Projects, Experience (#career), Leadership, CurrentlyBuilding, SystemMap, Contact
src/components/Navbar.tsx   Top bar: section links (active via IntersectionObserver), ⌘K, UTC clock, mobile menu
src/lib/data.ts             Single content source (projects, impactLog, experience, aiKnowledgeBase, boot lines)
src/lib/topology.ts         System Map nodes/edges (derived from data.ts) + fixed 3D positions
src/lib/navigation.ts       Command alias registry (Ask Krishi / palette) → scroll, select-project, README
src/lib/motion.ts, github.ts  Motion constants; shared GitHub telemetry types/helpers
src/hooks/useTerminalReveal.ts, useGitHubTelemetry.ts, useChat.ts, useReducedMotion.ts, ...
```
- **Events:** `open-ai-chat` opens the chat; `select-project` {id} is handled by Projects.
- **Section ids:** `hero`, `projects`, `career`, `leadership`, `currently-building`, `system-map`, `contact`.

## System Map (Phase 5)
- **Content:** 18 nodes (7 domains, 4 projects, 2 roles, 5 shared tech) and 29 edges. Tech links are computed from `techStack`.
- **Positions:** fixed 3D, no physics, nothing random at runtime.
- **View changes:** dragging past 4px, arrow keys and "reset view" are the ONLY things that change the view.
- **Highlighting:** hover, focus, click and the legend only change highlighting (opacity and colour). Verified in the browser: selecting a node moves zero nodes.
- **Mobile:** below 640px only the highlighted node's neighbours, or just the projects, are labelled. Labels for nodes in the right 40% flip to the node's left side to stay inside the panel.

## Motion system
- **Constants** (`src/lib/motion.ts`): ease `power3.out`, durations 0.15 / 0.3 / 0.5s, rise 10–16px.
- **Library split:** GSAP core for choreographed entrances; framer-motion for mount/unmount (AnimatePresence) and Career's scroll-linked reveal.
- **Boot gating:** `useBooted()` makes entrances wait for the boot screen. The Hero has a post-boot timeline.
- **Section reveal:** `useTerminalReveal()` types the section command, raises the panel, then cascades `[data-reveal="item"]`.
- **Accessibility rules:**
  - All GSAP code runs inside `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`.
  - Use opacity, never autoAlpha.
  - No looping animation except small status dots and the cursor.
- **Tailwind v4 gotcha:** `scale-*`/`translate-*` use the separate `scale`/`translate` CSS properties, so write `transition-[...,scale]` or `transition-[...,translate]`, not `transform`.
- **Browser-pane caveat:** a hidden pane throttles rAF, so animations stall until a frame is forced (e.g. by a screenshot). This is not an app bug.

## Env vars (names only)
- `OPENAI_API_KEY`: server-only, optional.
- `GITHUB_TOKEN`: server-only, optional; raises GitHub's limit from 60 to 5000 requests/h.

## Decisions already made
- Exactly four featured projects.
- README stays out of the primary nav. It's reachable from the palette, Ask Krishi, the hero pill and the footer.
- Selecting a System Map node never moves, pans, zooms or re-lays-out anything. There's no auto-rotation or "tour".
- The homepage shell stays a Server Component for SEO.
- Telemetry: never invent commits, stars or timestamps. Omit data instead.
- Ask Krishi: no RAG, web search, vector DB or provider change without approval. Third-person voice (the owner can revert to first person).
- Contact form: mailto only, no backend.
- Never commit or push without an explicit request.

## Open items
- **ASCII portrait:** blocked until there's an authorised source photo.
- **Bundle size:** the homepage ships ~294 KB gzipped JS. About 156 KB is the React/Next framework; the 83 KB animation chunk carries **both** GSAP and framer-motion. Moving every framer usage to GSAP (or framer to `LazyMotion`) would save roughly 20–35 KB. Not done; needs the owner's call.
- **LCP:** content stays at opacity 0 until the boot screen clears (about 2s, by design from the brief), which delays LCP. That's a product trade-off.
- **Boot:** the `accessGranted` branch is unreachable, so the 2s safety timeout always ends the boot.
- **`/now`:** still says "Last updated: June 2026"; its personal content (hobbies, reading) is unverified.
- **Ask Krishi** is single-turn. The live gpt-4o-mini path is untested locally (no key).
- **Unverified personal claims:** "300+ students across 5+ events", "40% digital interaction", "largest data society", the Mysahayak 30%/20% figures, and Sacred Heart's 50+ interactions per shift.

## Verification commands
```
npx tsc --noEmit     # passes
npm run lint         # passes (0 problems)
npm run build        # passes; all pages static except the two API routes
npm run check:chat   # 20 chat routing/validation/rate-limit checks against a running server (fallback mode)
npm run dev          # .claude/launch.json "dev" on :3000
```
No automated UI tests. Browser checks are manual via the preview tools.
