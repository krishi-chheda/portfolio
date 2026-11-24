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
- **Music (2026-11-24, owner request):** on by default in Adventure Mode only; off via the HUD ♪ button or the Esc menu. It starts on the first key/tap (browsers block it earlier; the gesture listeners stay on because Escape and a touch's pointerdown don't count), pauses in background tabs, and stops on leaving `/world`. `setSettings` stores only the keys the player changed, so untouched settings follow the defaults. Test with Chrome's autoplay blocking ON (the brag `cdp.mjs` disables it).
- **Controls card (2026-11-22):** `src/components/world/ControlsGuide.tsx` replaced the bottom hint bar that faded after the first step (and the `moved` bus event). It lists only real controls: keyboard (arrows/WASD walk; E or Enter talk; E/Enter/Space next line; Esc closes and opens the menu; M/I/P) or, on coarse pointers, the D-pad, A button and tapping the chat. Open by default; ✕ hides it (exit tween), a 44px `? Controls` button or the H key brings it back; the choice is stored in localStorage `krishi-world:controls-guide`. Hidden while any overlay, the cartridge intro or loading is up. Its own key events are stopped from reaching Phaser's window listener, so Enter on its buttons never talks/interacts. Bottom-left on keyboards; on touch it sits above the A button (narrow on phones) clear of the D-pad. If controls change in WorldScene/Overlays/TouchControls, update this card.
- **HQ interiors (2026-11-21):** pressing E at a Project Metropolis HQ door warps into `hq-<project>` (`src/game/maps/interiors.ts`, 18×12, built in TS rather than worldgen.py; `buildMap` still validates). Furniture is the project file (`content.ts` `EXHIBITS`): whiteboard = architecture, pinboard = overview + role, bookshelf = tech stack, trophy cabinet = features/outcomes, TV wall = real screenshots, desk PC = the full `ProjectTerminal` (first read still awards the attribute). The exhibit window (`ExhibitWindow`) renders the same section components as Classic's project pages (`src/components/retro/ProjectParts.tsx`). Exiting via the door mat lands in front of that HQ's door. The `region` event carries `parent: "metropolis"` for interiors: progress records the parent, the world map marks Metropolis, the banner shows "<Project> HQ". Rooms smaller than the view are centred (`fitZoom`). New tiles: FLOOR, WALL, BEAM, RUG, DOORMAT (legend `_ W B r m`).
- **Game-feel polish (2026-11-20):** a "!" bubble (`fx-prompt`) over whatever the player faces and can use (`refreshPrompt`, bob computed per frame, not tweened); stepping onto tall grass or flowers rustles (`stepEffects`: leaf/petal pixels plus `sfx("rustle")`, filtered noise); walking into something plays `sfx("bump")` (450ms cooldown); two soft cloud shadows drift over every map. Effects are skipped under reduced motion (sounds still play when SFX is on). HUD uses the pixel font, adds an attribute counter (opens the Journal), shows a GBA-style location sign for 2.8s on each region load (after the cartridge intro), and fades the controls hint after the first step (`moved` bus event).
- **Bundle:** Phaser is one ~310 KB gzipped chunk loaded only on `/world`.

## Motion identity (KRISHI.WORLD, 2026-11-21)
- **Personality:** Playful (GBA game). `WORLD` in `src/lib/motion.ts`: signature entrance ease `back.out(1.4)` (~10% overshoot), `power3.out` for things that travel, `power2.in` for exits; durations 0.15 / 0.28 / 0.45s; entrance = "pop" (rise ~12px + scale from ~0.95); staggers 0.025–0.1 and under ~0.4s total. Entrances run longer than exits.
- **Hook:** `useEntrance(play, deps)` (`src/hooks/useEntrance.ts`) runs a GSAP entrance before paint inside `gsap.matchMedia(MOTION_OK)`, skips it when the game's Motion toggle or the OS asks for reduced motion, and reverts on unmount/re-run. Tweens end with `clearProps` so CSS hover transitions keep working.
- **Where:** the shared `Window` (backdrop + panel pop + content cascade), dialogue box (rises), pause menu (slides from the right, items cascade), discovery card (success: gem pop/spin + pixel spark burst), achievement toast (drop-in, trophy wobble, self-exit before removal), title screen (hero-first: logo → tagline → cards → footer, keyed to the boot), Classic project-file tabs (slide from the side you flip toward), Skilldex entry (gem pop + detail cascade), Ask Krishi (panel grows from its launcher; each new message rises). CSS keyframes remain for ambient/continuous loops (title ambience, banner, TV, unlocks, flow arrows).
- **Verifying:** the hidden browser pane freezes rAF, so GSAP never finishes there. Check motion in a real headless Chrome over CDP (mid-state, then settled: opacity 1, visible, no inline transform).

## Testing notes
- **Hidden browser pane:** rAF and GSAP are frozen, so screenshots can show tweens mid-way (the title screen looks dimmed). Drive the game via `window.__krishiWorld` (dev only) with `game.step(t, 16)` plus a real `await setTimeout(16)`; dispatch `KeyboardEvent`s with `keyCode`. Resize the viewport first (a hidden pane reports innerWidth 0).
- **Windows:** `next start` survives task stops and `pkill`; stop it by port (`Get-NetTCPConnection -LocalPort <p>` → `Stop-Process`). Use a different port from the dev server.
- **Tailwind v4:** `scale-*`/`translate-*` are separate CSS properties; write `transition-[...,translate]`.
- **React compiler lint:** don't call ref-touching functions from curried handlers built during render; don't assign `window.location.href` (use `location.assign`).

## Security and load (tested 2026-11-21, local production build)
- **Headers** (`next.config.ts`): CSP without nonces (keeps pages static; `'unsafe-inline'` scripts for Next hydration, everything else `'self'`, `data:`/`blob:` images, `frame-ancestors 'none'`, `upgrade-insecure-requests` only on Vercel), HSTS, X-Frame-Options DENY, nosniff, Referrer-Policy, Permissions-Policy, COOP; `poweredByHeader: false`. Verified: no CSP violations on any page (incl. game, TV exhibit, chat) in prod and dev.
- **Chat API:** bodies over 8 KB refused with 413 before parsing (declared or streamed); rate limit 10/min per IP from `x-real-ip` (then `x-forwarded-for`), both set by Vercel; the limiter prunes stale IPs instead of clearing everything. Locally the IP headers are spoofable (only the platform makes them trustworthy). Input validation: 405 on GET, 400 on missing/wrong-type/over-500-char messages; replies never echo input. LLM path (OPENAI_API_KEY) untested locally.
- **Dependencies:** Next 16.3.8 → 16.4.6 (critical + several advisories), `npm audit fix` for transitive dev deps: 0 vulnerabilities.
- **Also checked:** image optimizer refuses remote/protocol-relative/traversal URLs and oversized widths; `.env`, `.git`, source files are 404; no secrets in tracked files or history; tampered localStorage (garbage, wrong types, `__proto__`, script strings) never breaks or executes; all `target=_blank` links use `noopener`.
- **Load (autocannon, 10s each, one local Node process):** pages 1.0–2.9k req/s at 100 connections with 0 errors and p99 < 120 ms; JS chunk 3.7k req/s; cached image 2.3k req/s; chat 2.1k req/s; a 100-connection single-IP flood got exactly 10 answers and 21,103 × 429. A 500-connection spike saturates the single process (≈1k connection errors, p97.5 3.6s); on Vercel static pages are served by the CDN.
- **Page load (slow 4G + 4× CPU, cold cache):** FCP ≈ 0.8s everywhere; LCP 0.8–0.9s on Classic, project pages, /now, /world; title 2.0s returning / 3.5s first visit (boot by design); CLS ≤ 0.002. JS: 200–270 KB per page, /world 575 KB (Phaser, lazy). HTML gzip: / 8 KB, /classic 20 KB.
- **Open:** `brag-output/` (incl. a throwaway Chrome profile from the video capture: 3 localhost history entries, no logins or cookies) is tracked and pushed to the public repo; untrack with `git rm -r --cached brag-output` (history purge would need a force push).

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
