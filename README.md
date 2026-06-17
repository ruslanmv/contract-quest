<div align="center">

# 🛡️ Contract Quest — Architecture

### A watsonx-built governed arcade platformer · **Phaser 3 + TypeScript + Vite**

A real, buildable game architecture (not a single HTML file): static, client-side, deployable to
GitHub Pages. Governed by **Matrix Builder** contracts and the **Ruslan Magana Definitions (RMD)**.

</div>

---

## ✅ Verified to build & run

This scaffold was verified locally:

```text
npm install        → 144 packages
npm run typecheck  → clean (tsc --noEmit)
npm run build      → dist/ produced (Phaser bundle ~343 KB gzipped)
headless browser   → canvas renders, hero moves/jumps, ZERO runtime errors
```

It runs immediately with **no external art** — all placeholder sprites/tiles are generated
programmatically at boot (`src/utils/textures.ts`). Swap in Aseprite atlases + Tiled maps later
without changing the rest of the architecture.

## Reproduce it locally

```bash
git clone <this repo>
cd contract-quest          # (or your repo folder)
npm install
npm run dev                # → http://localhost:5173/  (hot reload)
# or
npm run build && npm run preview
```

**Controls:** `←/→` or `A/D` move · `Space`/`↑`/`W` jump (variable height) · on touch devices, on-screen buttons appear.

> **GitHub Pages base:** set `base` in `vite.config.ts` (or the `VITE_BASE` env) to `/<your-repo-name>/`
> so asset URLs resolve. Default is `/contract-quest/`. `npm run dev` / local build work with any base.

## Architecture

```
contract-quest/
├── index.html                 # canvas mount + footer credit
├── vite.config.ts             # base path for GitHub Pages
├── tsconfig.json · .eslintrc.json · .prettierrc
├── src/
│   ├── main.ts                # Phaser game config (640×360, pixelArt, Arcade physics, FIT)
│   ├── scenes/
│   │   ├── BootScene.ts        # generate/preload textures → start Game
│   │   └── GameScene.ts        # the level: world, hero, enemy, coins, RMD star, Matrix Gate, HUD, touch
│   ├── entities/               # Player (variable-jump), BugBot (patrol AI), Coin
│   ├── ui/                     # HUD (fixed-to-camera), TouchControls (mobile)
│   └── utils/                  # constants (palette/tuning), textures (placeholder art)
├── public/                    # static assets (Tiled maps, sprite atlases) go here
├── docs/ARCHITECTURE.md       # full design: data models, asset pipeline, modules
├── .github/workflows/deploy.yml   # CI: typecheck + build + deploy to Pages
└── MATRIX_*.{yaml,lock,md}     # the contract identity + RMD governance + batch plan
```

Full design (data models, Tiled/Aseprite pipeline, ER diagram, batch plan) is in
[`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md) and the `MATRIX_*` files.

## Tech stack

**TypeScript** · **Vite 5** · **Phaser 3** · Arcade physics · ESLint/Prettier · GitHub Actions → Pages.
No backend, no runtime AI calls. watsonx is used only to *assist writing code* (provider rule: watsonx only). No API keys are committed.

## RMD governance

- **RMD-101** — AI coders are workers, not architects.
- **RMD-103** — Control files are protected.
- **RMD-111** — Acceptance criteria are law.

---

<div align="center"><sub>coded by GitPilot — under a Matrix Builder contract · Built by <a href="https://ruslanmv.com">Ruslan Magana Vsevolodovna</a> · MIT licensed</sub></div>
