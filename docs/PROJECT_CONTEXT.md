# KRISHI.OS — Project Context

Engineering memory for future sessions. Keep it short and current. Last updated: 2026-10-12 (Phase 0 discovery).

## Purpose
KRISHI.OS is the interactive portfolio of Krishi Chheda (AI Engineer & Product Builder, Master of AI at Monash, graduating July 2027). It's presented as a personal operating system. Audience: recruiters, engineers, collaborators.
Principle: *featured projects tell the story, everything else supports it.*

## Approved flagship projects (exactly four)
| id (data.ts) | Title | Repo | Demo |
|---|---|---|---|
| `accessible-vision` | AccessVision | github.com/krishi-chheda/AccessVision | access-vision-xi.vercel.app |
| `clinicalbrief` | ClinicalBrief | github.com/krishi-chheda/clinicalbrief (public) | clinicalbrief.vercel.app |
| `studenthub` | StudentHub | github.com/krishi-chheda/student-hub | mystudenthub.vercel.app |
| `traffic-ai` | Traffic AI | **none public** (`ai-traffic-system` → 404) | none |

Evidence for claims (Phase 2, 2026-10-12):
- AccessVision metrics come from the repo README benchmark table (50 concurrent Locust users: p95 8,920→2,406 ms, success 11.2%→100%, detection 1,450→176 ms) and project_showcase.md (~4MB→~150KB). The old "92% / 8.4s→668ms" claim had no source and was removed.
- ClinicalBrief was **re-scoped to match the current repo**: FHIR R4 ingestion, canonical model with provenance, rule-based note extraction, human review queue, grounded local-LLM copilot (Ollama), FHIR export, Supabase Postgres + RLS. The repo has no Whisper, GPT-4o or audio. It's a research prototype on synthetic Synthea data.
- StudentHub stack comes from package.json and the repo tree: Next 14, Supabase, Tailwind, Eventbrite, Foursquare, ABS data. No Prisma, MySQL or Mapbox.
- Traffic AI: only "approximately 42% reduction in waiting time" plus the stack (from the owner's brief). Every other number was removed.

MDAS (owner-confirmed): Media & Marketing Officer Oct 2025 – Jan 2026; Media & Marketing Director Jan – May 2026; Vice President Jul 2026 – present.

Supporting repos (Ask Krishi / README only, never flagship cards): AuraLens-AI, f1-telemetry-ai-dashboard, F1-telemetry-analyzer, fastapi_backend (BP prediction), video-splitter.

## Stack (verified from package.json)
Next.js 16.2.9 (App Router, Turbopack), React 19.2.4, TypeScript 5 strict, Tailwind v4, framer-motion 12, gsap 3.15.0, lucide-react, clsx + tailwind-merge. No test framework. Deploys on Vercel. Git remote: `krishi-chheda/portfolio`.
`AGENTS.md`: this Next version has breaking changes, so read `node_modules/next/dist/docs/` before writing Next-specific code.

## Architecture
```
src/app/layout.tsx        Server. Metadata, OG/Twitter, canonical, JSON-LD Person, fonts
src/app/page.tsx          Server. <BootWrapper> wraps Navbar + sections + Footer + ChatBubble
src/app/readme/page.tsx   Client. Operating manual (/readme)
src/app/now/page.tsx      Client. /now page (in sitemap, not linked from UI)
src/app/robots.ts, sitemap.ts
src/app/api/chat/route.ts   POST. gpt-4o-mini (temp 0.2, 450 max tokens) when OPENAI_API_KEY is set; falls back to local answers built from data.ts. Third-person assistant, facts-only prompt, command allow-list, per-IP rate limit (10/min, per instance)
src/app/api/github/route.ts GET. Explicit repos (githubUrls in data.ts) + latest commit each; Next data cache 15 min; 503 or stale snapshot on failure
src/components/boot/*       BootWrapper → BootScreen → TerminalOutput → BootLine (useBootSequence, useTypingEffect)
src/components/sections/*   Hero, Projects (IDE explorer), Experience (#career, git-log), Leadership,
                            CurrentlyBuilding, Contact. All are client components.
src/components/Navbar.tsx   Nav links + Ctrl/Cmd+K listener, owns <CommandPalette>
src/components/ui/CommandPalette.tsx
src/components/ask-krishi/ChatBubble.tsx  (useChat hook)
src/lib/data.ts             Single content source: projects, experience, aiKnowledgeBase, boot lines
src/lib/navigation.ts       Command alias registry → scroll/select-project/README (used by Ask Krishi)
```
Cross-component events: `open-ai-chat` (opens chat), `select-project` {id} (Projects listens).
Section ids: `projects`, `career`, `leadership`, `currently-building`, `contact`. **`system-map` does not exist** (removed in commit 201a2d2).

## Motion system (2026-10-12)
- Identity lives in `src/lib/motion.ts`: signature ease `power3.out`, durations 0.15 / 0.3 / 0.5s, entrance = rise 10-16px + fade, no overshoot.
- **GSAP 3.15.0** (core only) handles choreographed entrances. **framer-motion** stays for mount/unmount (AnimatePresence: palette, chat, tabs, mobile menu, boot).
- `useBooted()` (from BootWrapper context, default true outside it): entrances wait for the boot screen to clear.
- Hero: GSAP timeline after boot (windows rise, prompts type via stepped clip-path, headline then body, status rows cascade).
- `useTerminalReveal()` (`src/hooks`): once per section on scroll, the prompt command types, the panel rises, and `[data-reveal="item"]` children cascade. Used in Projects, Leadership, Currently Building, Contact. Career keeps its own scroll-linked reveal.
- All GSAP motion runs under `gsap.matchMedia("(prefers-reduced-motion: no-preference)")`. It uses opacity rather than autoAlpha so hidden content stays in the accessibility tree.
- Continuous pulses are allowed only on small status dots and loading states, never on text or badges.
- Browser-pane caveat: when the pane is hidden, rAF is throttled, so GSAP and framer animations stall until a frame is forced (e.g. a screenshot). This isn't an app bug.

## Env vars (names only)
`OPENAI_API_KEY` (server-only, optional). `GITHUB_TOKEN` (server-only, optional; raises the GitHub rate limit from 60 to 5000/h).

## Decisions already made
- Exactly four featured projects. No new flagship cards.
- README stays out of the primary nav. Entry points: palette, Ask Krishi, hero tip, footer link.
- Topology: if rebuilt, it must be deterministic. Selecting a node never moves, pans, zooms, or re-lays-out the graph. Prefer SVG over force-graph.
- The homepage shell (`page.tsx`, `layout.tsx`) stays a Server Component for SEO.
- Telemetry: never show fabricated commits, stars, or timestamps. Omit data rather than invent it.
- Ask Krishi: no RAG, web search, vector DB, or provider change without approval.
- Never commit or push without an explicit request.

## Known issues (Phase 0, 2026-10-12)
See the Phase 0 report in the session transcript. Headline items:
1. ~~Contact form simulates success~~ — fixed in Phase 1: it now opens a pre-filled `mailto:` draft. Email `krishichheda10@gmail.com` confirmed by owner.
2. `./system-map` nav, palette entry, README entry, and Ask Krishi command all target a deleted section.
3. ~~GitHub telemetry shows invented data~~ fixed in Phase 3. Shared types and repoKey are in `src/lib/github.ts`; the client hook is `useGitHubTelemetry` (one request per page). The UI renders nothing when data is unavailable and labels timestamps "as of" (or "cached snapshot from" when stale). Old notes: Hard-coded fake commit hashes are the initial state. The API's default commit text is a placeholder. GitHub PushEvent payloads no longer include `commits`, so no real commit message is ever extracted. ClinicalBrief is shown as "PRIVATE/LOCAL … Working tree clean".
4. ~~Broken or missing project links~~ fixed in Phase 2.
5. Unverified metrics in data.ts and chat fallback (see list in report). The StudentHub stack claim (Prisma/MySQL/Mapbox) doesn't match the repo's package.json.
6. ~~Global `select-none` on body~~ — fixed in Phase 1.
7. ~~Chat API hardening~~ done in Phases 1 and 4. Routing uses whole-word matching. `npm run check:chat` covers 20 routing, validation and rate-limit cases (needs a running server, fallback mode). Single-turn only: the model doesn't see earlier messages. Fallback keyword routing misfires (e.g. "github" → StudentHub because "hub" matches).
8. ~~Lint errors~~ all resolved in Phase 3.
9. ~~MDAS dates~~ fixed in Phase 2.

## Deferred / blocked
- ASCII profile: no source photo in repo (`public/` has only og-image.png). Blocked on an authorised photo.
- Topology: **owner chose an SVG rebuild** (Phase 5). The old implementation is in git at `2f3426b` for reference. Until then `./system-map` links to nothing.
- Boot: the `accessGranted` branch is unreachable (no BootLine fires onComplete at index == length), so the 2s safety timeout always ends the boot. Phase 6.

## Verification commands
```
npx tsc --noEmit     # passes
npm run lint         # passes (0 problems) as of Phase 3 — eslint 9 flat config, next core-web-vitals + typescript
npm run build        # passes (lint is not part of build in Next 16)
npm run check:chat   # chat routing/validation/rate-limit check against a running server
npm run dev          # .claude/launch.json "dev" on :3000 (the owner often has it running already, so navigate to it)
```
No automated tests exist. Browser checks are manual through the preview tools.
