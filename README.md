# KRISHI.WORLD

The portfolio of Krishi Chheda, AI Engineer & Product Builder, built as a retro GBA-style RPG.

## How it works
A short KRISHI.OS boot leads to the KRISHI.WORLD title screen, where you pick a mode:

- **Adventure Mode** (`/world`): an explorable pixel world (Phaser 3) with five regions. Meet characters, collect skill crystals, walk into project HQs to read their files, and unlock achievements. Keyboard, touch and reduced-motion support; a Text Guide reads everything without playing.
- **Classic Portfolio** (`/classic`): the same content on one retro page: Trainer Profile, Education Journal, Skilldex, Project Archive, Quest Log, Achievement Journal, and Resume & Contact.

Both modes read the same data (`src/lib/data.ts`, `src/lib/portfolio.ts`), share one visual style, and link to each other without losing game progress.

**Ask Krishi** is a chat assistant on the Classic page (OpenAI gpt-4o-mini when `OPENAI_API_KEY` is set, otherwise local answers built from the site's data).

## Featured projects
- ClinicalBrief: https://github.com/krishi-chheda/clinicalbrief (demo: https://clinicalbrief.vercel.app)
- AccessVision: https://github.com/krishi-chheda/AccessVision (demo: https://access-vision-xi.vercel.app)
- Traffic AI: no public repository
- KRISHI.OS / KRISHI.WORLD: this repository

More: StudentHub (https://mystudenthub.vercel.app), AuraLens AI, F1 Telemetry AI Suite, Blood Pressure Prediction API, Video Splitter Pro.

## Tech stack
Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, GSAP 3, Phaser 3. All game art is drawn procedurally in code; there are no image assets.

## Local development
```
npm install
npm run dev           # http://localhost:3000
npm run lint
npm run build
npm run check:chat    # Ask Krishi routing checks (needs the dev server running)
python scripts/worldgen.py   # regenerate the game maps
```
Optional server-only env var (`.env.local`): `OPENAI_API_KEY` enables the gpt-4o-mini assistant.

## Status
Melbourne, Australia · Master of AI at Monash University, graduating July 2027 · Open to AI Engineering, Machine Learning Engineering, Software Engineering and Technology Consulting opportunities.
