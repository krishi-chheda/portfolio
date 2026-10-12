# KRISHI.OS — Project Context

Engineering memory for future sessions. Keep it short and current. Last updated: 2026-10-12 (Phase 0 discovery).

## Purpose
KRISHI.OS is the interactive portfolio of Krishi Chheda (AI Engineer & Product Builder, Master of AI at Monash, graduating July 2027). It's presented as a personal operating system. Audience: recruiters, engineers, collaborators.
Principle: *featured projects tell the story, everything else supports it.*

## Approved flagship projects (exactly four)
| id (data.ts) | Title | Repo | Demo |
|---|---|---|---|
| `accessible-vision` | AccessVision | github.com/krishi-chheda/AccessVision (public, 200) | — |
| `clinicalbrief` | ClinicalBrief | github.com/krishi-chheda/clinicalbrief (**public as of 2026-10**, 200) | clinicalbrief.vercel.app (200) |
| `studenthub` | StudentHub | github.com/krishi-chheda/student-hub (public, 200) | — |
| `traffic-ai` | Traffic AI | **none public** (`ai-traffic-system` → 404) | — |

Supporting repos (Ask Krishi / README only, never flagship cards): AuraLens-AI, f1-telemetry-ai-dashboard, F1-telemetry-analyzer, fastapi_backend (BP prediction), video-splitter.

## Stack (verified from package.json)
Next.js 16.2.9 (App Router, Turbopack), React 19.2.4, TypeScript 5 strict, Tailwind v4, framer-motion 12, lucide-react, clsx + tailwind-merge. No test framework. Deploys on Vercel. Git remote: `krishi-chheda/portfolio`.
`AGENTS.md`: this Next version has breaking changes, so read `node_modules/next/dist/docs/` before writing Next-specific code.

## Architecture
```
src/app/layout.tsx        Server. Metadata, OG/Twitter, canonical, JSON-LD Person, fonts
src/app/page.tsx          Server. <BootWrapper> wraps Navbar + sections + Footer + ChatBubble
src/app/readme/page.tsx   Client. Operating manual (/readme)
src/app/now/page.tsx      Client. /now page (in sitemap, not linked from UI)
src/app/robots.ts, sitemap.ts
src/app/api/chat/route.ts   POST. OpenAI gpt-4o-mini if OPENAI_API_KEY is set, else keyword fallback
src/app/api/github/route.ts GET. GitHub repos + public events, 5-min in-memory cache
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

## Env vars (names only)
`OPENAI_API_KEY` (server-only, optional). No GitHub token is used.

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
3. GitHub telemetry shows invented data. Hard-coded fake commit hashes are the initial state. The API's default commit text is a placeholder. GitHub PushEvent payloads no longer include `commits`, so no real commit message is ever extracted. ClinicalBrief is shown as "PRIVATE/LOCAL … Working tree clean".
4. Traffic AI links to a 404 repo. ClinicalBrief is public now but has no `liveUrl`.
5. Unverified metrics in data.ts and chat fallback (see list in report). The StudentHub stack claim (Prisma/MySQL/Mapbox) doesn't match the repo's package.json.
6. ~~Global `select-none` on body~~ — fixed in Phase 1.
7. Chat API: input validation, a 500-character cap, and the `response.ok` check were added in Phase 1. Still missing: rate limiting (Phase 4). Fallback keyword routing misfires (e.g. "github" → StudentHub because "hub" matches).
8. Lint: 15 errors remain, all `any` in telemetry code (api/github, Projects and CurrentlyBuilding fallbacks). They're deferred to the Phase 3 rewrite.
9. MDAS director start year is inconsistent (2024 in Leadership/data.ts, 2026 in the career timeline).

## Deferred / blocked
- ASCII profile: no source photo in repo (`public/` has only og-image.png). Blocked on an authorised photo.
- Topology rebuild: needs an owner decision (rebuild vs drop the nav item). Old implementation is recoverable from git (`2f3426b`).
- Boot: the `accessGranted` branch is unreachable (no BootLine fires onComplete at index == length), so the 2s safety timeout always ends the boot. Phase 6.

## Verification commands
```
npx tsc --noEmit     # passes
npm run lint         # fails (15 telemetry `any` errors, deferred to Phase 3) — eslint 9 flat config, next core-web-vitals + typescript
npm run build        # passes (lint is not part of build in Next 16)
npm run dev          # .claude/launch.json "dev" on :3000 (the owner often has it running already, so navigate to it)
```
No automated tests exist. Browser checks are manual through the preview tools.
