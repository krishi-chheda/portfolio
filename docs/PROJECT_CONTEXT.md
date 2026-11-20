# KRISHI.WORLD — Project Context

Engineering memory for future sessions. Keep it short and current. Last updated: 2026-11-20 (KRISHI.WORLD 2.0: title screen, Classic Mode, cybertech site retired).

## Purpose
The interactive portfolio of Krishi Chheda (AI Engineer & Product Builder, Master of AI at Monash, graduating July 2027), presented as a retro GBA-style RPG. Audience: recruiters, engineers, collaborators.
Flow: a KRISHI.OS boot (once per session) → the **KRISHI.WORLD title screen** → **Adventure Mode** (`/world`, an explorable Phaser world) or **Classic Portfolio** (`/classic`, one retro page). Both modes read the same data and look like the same game.
Principle: *featured projects tell the story, everything else supports it.*

## Featured projects
| id (data.ts) | Title | Repo | Demo |
|---|---|---|---|
| `clinicalbrief` | ClinicalBrief | github.com/krishi-chheda/clinicalbrief | clinicalbrief.vercel.app |
| `accessible-vision` | AccessVision | github.com/krishi-chheda/AccessVision | access-vision-xi.vercel.app |
| `traffic-ai` | Traffic AI | none public | none |
| `krishi-os` | KRISHI.OS (this site) | github.com/krishi-chheda/portfolio | / |

`FEATURED` in `src/lib/portfolio.ts` is the single list (owner decision 2026-11-19: exactly these four, in both modes). StudentHub and the supporting repos (AuraLens-AI, f1-telemetry-ai-dashboard, fastapi_backend, video-splitter) appear as `MORE_PROJECTS` in Classic's "More from the archive" and in Ask Krishi.

**Evidence rule:** every published claim must trace to a repo, README or owner confirmation.
- **AccessVision:** metrics from the repo README benchmark (50 Locust users: p95 8,920→2,406 ms (73%), success 11.2%→100%, detection 1,450→176 ms) and project_showcase.md (~4MB→~150KB).
- **ClinicalBrief:** scoped to the current repo: FHIR R4 ingestion, provenance, rule-based note extraction, a human review queue, a grounded local-LLM copilot, FHIR export, Supabase Postgres + RLS. Research prototype on synthetic data. No Whisper, GPT-4o or audio.
- **StudentHub:** Next 14, Supabase, Tailwind, Eventbrite, Foursquare, ABS data.
- **Traffic AI:** only "approximately 42% reduction in waiting time" plus the stack.
- **`impactLog`** in data.ts holds the verified metrics.
- **Never used (unverified, KOS-06):** "300+ students across 5+ events", "40% digital interaction", "largest data society", the Mysahayak 30%/20% figures, Sacred Heart's 50+ interactions per shift. `experienceData` `highlight` and description lines contain these, so both modes show only role, organisation, period, location and skills.

**Owner-confirmed facts:**
- MDAS: Media & Marketing Officer Oct 2025 – Jan 2026; Director Jan – May 2026; Vice President Jul 2026 – present.
- Traffic AI: Oct – Dec 2024. Mysahayak (IT Intern): Jan – May 2025. StudentHub: Jan – May 2025. Master of AI @ Monash: started Jul 2025.
- Electronics & Telecommunication background; skills list (incl. Dart, Linux, MySQL, CUDA, confirmed 2026-11-20); hobbies (`ownerProfile`).
- Resume: no PDF; LinkedIn stands in (`contact.resume = null`). Certifications: none named, so none shown (`certifications = []`; add entries and both modes pick them up).

## Stack
- **Core:** Next.js 16.3.8 (App Router, Turbopack), React 19.2.4, TypeScript 5 strict, Tailwind v4.
- **Motion and game:** gsap 3.15.0 (core only), phaser 3.90.0 (pinned, last Phaser 3; `import * as Phaser from "phaser"`).
- **Delivery:** Vercel; git remote `krishi-chheda/portfolio`.
- **Next.js docs:** per `AGENTS.md`, read `node_modules/next/dist/docs/` before writing Next-specific code.

## Visual system (one universe)
- **Palette** (`src/lib/retro.ts` `PALETTE`): forest #285943, grass #78B85A, cream #F5E8C8, brown #46382B, sky #7BC9DF, gold #F5C65B, ink #2B2420.
- **Font:** Pixelify Sans, defined once in `src/lib/pixelFont.ts` (preloaded; `--font-pixel`, class constant `PIXEL`).
- **Frame:** every panel uses `PANEL` (cream body, 4px brown border, brown drop shadow) with a `TITLE_BAR` (forest green). Chips are white with brown borders; selection is gold with a ▶ cursor. The game's dialogue box (GBA teal frame) is the only other style. Don't add a second panel style.
- **Class strings** live in `src/components/retro/styles.ts` (plain module so server components can import them). `src/components/retro/ui.tsx` (client) re-exports them plus `useKeys`, `Gem`, `Trophy`, `Window` (modal; `fixed` prop on scrolling pages), `Section`, `Bullets`, `ProjectBody`.
- **Shared art:** `src/game/textures.ts` draws all game art procedurally; `paintedAssets()` exposes it as canvases, so React can show real game art (`WorldView`: a live crop of a map with water and a walking player; `ObjectSprite`: one object such as a project HQ). Gem colours per skill category: `CATEGORY_GEMS`; project → HQ building: `PROJECT_BUILDING`.
- **Skilldex:** no proficiency ratings; gem colour only tells categories apart.

## Architecture
```
src/app/layout.tsx       Server. metadataBase, OG/Twitter, JSON-LD Person, Geist Mono base font
src/app/page.tsx         Server. <BootWrapper><TitleScreen/></BootWrapper>
src/app/classic/page.tsx Server. RetroShell + ClassicMenu + sections + Skilldex + ProjectArchive + AskKrishi
src/app/world/page.tsx   Server. Metadata; renders WorldGame (client), which import()s Phaser on demand
src/app/now/page.tsx     Server. Retro /now page (metadata in now/layout.tsx)
src/app/not-found.tsx    Server wrapper (title) around NotFoundView (retro 404 with route buttons)
src/app/api/chat/route.ts  POST. gpt-4o-mini (temp 0.2) if OPENAI_API_KEY, else local answers from data.ts.
                         Third-person, facts-only prompt, command allow-list, per-IP rate limit 10/min
src/app/sitemap.ts       /, /classic, /world, /now
next.config.ts           /readme → /classic (308; the old OS manual was retired)

src/lib/data.ts          Single content source. 2.0 exports: profile, contact, education, certifications,
                         skillCategories, milestones (plus projectsData, experienceData, ownerProfile, ...)
src/lib/portfolio.ts     ProjectDetail, FEATURED, PROJECT_DETAILS, MORE_PROJECTS, projectsUsing(skill). No React/Phaser
src/lib/retro.ts         PALETTE, RARITY_COLORS, CATEGORY_GEMS, PROJECT_BUILDING
src/lib/navigation.ts    Chat command alias registry (AskKrishi maps its targets to Classic sections)

src/components/boot/     BootScreen (particle vortex), BootWrapper (sessionStorage krishi-os:booted skips it)
src/components/title/TitleScreen.tsx   Mode select
src/components/classic/  Sections.tsx (server: Profile, Education, QuestLog, AchievementJournal, Contact,
                         RetroSection), ClassicMenu, Skilldex, ProjectArchive, AskKrishi (client)
src/components/retro/    styles.ts, ui.tsx, WorldView.tsx, RetroShell.tsx (top bar with universal nav)
src/components/world/    WorldGame (host + HUD), Overlays (all game panels), Cartridge (intro + PlayerSprite)
src/game/                Plain Phaser + TS, no React (see KRISHI.WORLD engine below)
```
- **Shared data rule:** both modes consume the same sources and never duplicate descriptions. The game's project terminals are `FEATURED` plus an attribute id (`content.ts` `TERMINALS`); Classic's project windows render the same `ProjectBody`.
- **Universal navigation:**
  - Classic, /now and 404 (`RetroShell`): ▶ Adventure, Resume ↗ (LinkedIn), Contact, Main Menu.
  - Adventure HUD: Menu, Classic Portfolio, ⏻ Main Menu. Esc menu: … Classic Portfolio, Resume ↗, Contact (mailto), Main Menu. Leaving plays the CRT power-off, then `router.push`.
- **Progress never lost by switching:** the game state lives in localStorage (`krishi-world:progress:v1`, `:position:v1`, `:settings:v1`) and Classic never writes it. `krishi-world:entry` = last mode (badged "LAST PLAYED" and pre-selected on the title screen). `krishi-world:classic-section` = last Classic section, restored on the next visit unless the URL has a hash.
- **Boot:** plays once per browser session; returning to `/` in the same session goes straight to the title screen.

## Title screen
- Logo "KRISHI.WORLD", tagline "Explore the mind. Discover the builder.", two equal cards (owner's exact copy): ADVENTURE MODE / ENTER THE WORLD (live Origin Valley crop) and CLASSIC PORTFOLIO / VIEW PORTFOLIO (mini trainer profile from real data and art).
- ←/→ or A/D (and ↑/↓) move the selection, Enter starts, hover/focus select; `sfx` on move and start. Keys wait for the boot (`useBooted`).
- Background: the whole Origin Valley map, dimmed.

## Classic Mode (`/classic`)
- Sections, in order: Trainer Profile, Education Journal, Skilldex, Project Archive, Quest Log, Achievement Journal, Resume & Contact. All static content is server-rendered (in the HTML; works with JS off); the game engine is never loaded.
- **Menu:** sticky ▶ list on desktop (lg), sticky chip row on smaller screens (the header scrolls away on phones so the chips stick at the top). Active section via IntersectionObserver.
- **Skilldex:** numbered entries per category; picking one shows "Used in" (projects whose tech stack matches, `projectsUsing`) or "Part of Krishi's toolkit".
- **Project Archive:** four cards with their HQ building; each opens a fixed `Window` with the full `ProjectBody` (Esc closes).
- **Quest Log:** ACTIVE QUEST when the period includes "Present".
- **Ask Krishi:** floating dialogue-style chat, same `/api/chat` and `useChat`; suggested commands become "▶ Go to <section>" links.
- **V2 polish (2026-11-20):**
  - Profile: animated `PlayerAvatar` (game sprite idling), "Open to" and contact links up top, Professional / Personal cards.
  - Skilldex: each entry shows a factual description of the technology (`SKILL_DESCRIPTIONS`), practical applications (projects whose stack uses it, via the explicit `SKILL_TECH` table, plus experience skills), and technologies used alongside. Below lg the entry opens under the tapped category.
  - Project files: `/classic/projects/[id]` (static, `dynamicParams = false`). Overview, problem/solution, stats and links always visible; tabs (`ProjectTabs`, ←/→) for Architecture (flow diagram), Tech, Features, My Role (only when data has role/why/challenge/lessons/next; KRISHI.OS has none), Screens. All panels SSR'd; tabs hide them only after hydration.
  - Screenshots are real captures of the live deployments (`public/projects`, Nov 2026). Traffic AI has none (no public repo or demo). Re-capture with headless Chrome over CDP from a production build (the dev badge shows otherwise).
  - Quest Log: sorted by start date, typed (`questKinds`: employment / leadership / volunteering; "event" exists but has no entries), expandable `<details>`, MDAS `roleHistory`, and `responsibilities()` which drops any line with a figure or "largest" (KOS-06).
  - Achievements: categories academic / professional / technical / leadership, each with a link; `UnlockOnView` plays a stepped pop the first time the list scrolls into view (skipped if already visible, without JS, or under reduced motion).
  - Sections rise in with CSS scroll-driven animation where supported (`.kw-reveal`); muted text darkened to #5a4434; shared `CARD` hover.
- **Layout gotcha:** the page grid uses `grid-cols-[minmax(0,1fr)]` and the menu's `<aside>` is `contents` below lg; otherwise the scrolling chip row widens the page (horizontal overflow) or can't stay sticky.

## KRISHI.WORLD engine (Adventure Mode)
- Five regions (Origin Valley, Innovation Forest, Project Metropolis, Leadership Frontier, Adventure Coast), 17 KRISHI ATTRIBUTES, 8 achievements, journal, world map with fast travel, project terminals, text guide, touch controls, synthesised audio, settings, resume position. Original art only (GBA Emerald-era style; never copy sprites, tiles, names or maps).
- **Maps are generated:** `python scripts/worldgen.py` rewrites `src/game/maps/*.ts` and validates overlaps, doors, warps and reachability. Edit the script, not the maps. Spots in the script must match `content.ts`.
- **Topology:** Forest ↕ Origin (cols 19–20) ↕ Coast; Origin ↔ Metropolis ↔ Frontier (rows 14–15).
- **Region content:** Forest from `ownerProfile.skills` (`SKILL_GROUPS`); Frontier from `experienceData` role/organisation/period/skills only; Coast from `ownerProfile.hobbies` plus AuraLens. Game text must come from data.ts; flavour lines never state facts about Krishi.
- **Code:** `textures.ts` (all art), `maps/legend.ts` `buildMap()` (auto-tiles, collision, validation), `WorldScene.ts` (tile-by-tile movement, 220ms steps, depth by feet), `content.ts` (NPCs, signs, attributes, crystals, terminals), `bus.ts` (typed EventTarget, the only scene↔React link), `progress.ts`, `settings.ts`, `audio.ts`.
- **Interaction:** E/Enter interacts with the faced tile; overlays lock the scene and `ui-closed` unlocks it with `resetKeys()`. The render loop sleeps 300ms after locking.
- **Cartridge intro** on every `/world` load doubles as the loading screen; any key/tap skips; reduced motion skips it.
- **Load failure:** WorldGame shows a link to `/classic`.
- **Game-feel polish (2026-11-20):** a "!" bubble (`fx-prompt`) over whatever the player faces and can use (`refreshPrompt`, bob computed per frame, not tweened); stepping onto tall grass or flowers rustles (`stepEffects`: leaf/petal pixels plus `sfx("rustle")`, filtered noise); walking into something plays `sfx("bump")` (450ms cooldown); two soft cloud shadows drift over every map. Effects are skipped under reduced motion (sounds still play when SFX is on). HUD uses the pixel font, adds an attribute counter (opens the Journal), shows a GBA-style location sign for 2.8s on each region load (after the cartridge intro), and fades the controls hint after the first step (`moved` bus event).
- **Bundle:** Phaser is one ~310 KB gzipped chunk loaded only on `/world`.

## Testing notes
- **Hidden browser pane:** rAF and GSAP are frozen, so screenshots can show tweens mid-way (the title screen looks dimmed). Drive the game via `window.__krishiWorld` (dev only) with `game.step(t, 16)` plus a real `await setTimeout(16)`; dispatch `KeyboardEvent`s with `keyCode`. Resize the viewport first (a hidden pane reports innerWidth 0).
- **Windows:** `next start` survives task stops and `pkill`; stop it by port (`Get-NetTCPConnection -LocalPort <p>` → `Stop-Process`). Use a different port from the dev server.
- **Tailwind v4:** `scale-*`/`translate-*` are separate CSS properties; write `transition-[...,translate]`.
- **React compiler lint:** don't call ref-touching functions from curried handlers built during render; don't assign `window.location.href` (use `location.assign`).

## Env vars (names only)
- `OPENAI_API_KEY`: server-only, optional.

## Decisions already made
- Exactly four featured projects in both modes.
- The cybertech site (Navbar, sections, System Map, command palette, GitHub telemetry, /readme) was retired on 2026-11-20 (owner: "Replace it, keep Ask Krishi").
- Classic stays fully usable without the game (and without JavaScript for reading).
- Ask Krishi: no RAG, web search, vector DB or provider change without approval. Third-person voice.
- Contact: mailto and LinkedIn only, no backend, no resume file.
- Never commit or push without an explicit request.

## Open items
- **`/now`:** still says "Last updated: June 2026"; its Formula 1, photography and reading lines predate owner confirmation.
- **Ask Krishi** is single-turn; the live gpt-4o-mini path is untested locally (no key). The chat's command registry still uses the old site's section names (mapped in AskKrishi).
- **LCP:** the boot holds the title screen for up to ~2s on the first visit each session (product trade-off).
- **ASCII portrait / photo:** none; the trainer profile uses the game's player sprite.
- **Leftovers to review:** `globals.css` still holds the old dark theme tokens and `.page-frame` (the layout's base); unused `public/*.svg`; `apple-design-skill` gitlink without .gitmodules.

## Verification commands
```
npx tsc --noEmit     # passes
npx eslint .         # passes
npx next build       # passes; all pages static except /api/chat
npm run check:chat   # routing cases, empty message, rate limit, every suggested follow-up (needs the dev server)
npm run dev          # .claude/launch.json "dev" on :3000
```
No automated UI tests; browser checks are manual via the preview tools.
- **Verified 2026-11-20 (prod build):** `/`, `/classic`, `/now`, `/world` 200; `/readme` 308 → `/classic`; unknown paths 404 (retro page). Classic HTML contains every section and no unverified claim. No horizontal overflow: `/classic` at 375, 640, 768, 1024 and 1280px; `/`, `/now` and the 404 at 375px. Round trip Adventure → Classic → Adventure keeps progress and position.
