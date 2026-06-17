# Contract Quest — Architecture

Static, client-side web game. No backend. **TypeScript + Vite + Phaser 3**, deployed to
GitHub Pages. watsonx is used only to *assist writing code* offline — the running game makes
no AI calls.

## Modules
- `src/main.ts` — Phaser game config (640×360 base, `pixelArt`, Arcade physics, FIT scale).
- `src/scenes/BootScene.ts` — generates placeholder textures (prod: preloads Aseprite atlas + Tiled maps), starts Game.
- `src/scenes/GameScene.ts` — the level: parallax sky, tile platforms, player, enemy, coins, RMD star, Matrix Gate, camera, HUD, touch.
- `src/entities/` — `Player` (variable-jump movement), `BugBot` (patrol AI), `Coin` (collectible).
- `src/ui/` — `HUD` (fixed-to-camera), `TouchControls` (mobile buttons).
- `src/utils/` — `constants` (palette/tuning), `textures` (programmatic placeholder art).

## Data models
- **Tilemap** — Tiled JSON (`width/height/tilewidth/tilesets/layers`), loaded via
  `this.load.tilemapTiledJSON()`. (The scaffold builds platforms programmatically; swap in a
  Tiled map without touching entities.)
- **Entity** — `IEntity { id; spriteKey; x; y; width; height; animations[]; health?; speed? }`.
- **Animation** — Aseprite-exported atlas + frame tags → `this.anims.create(...)`.

## Asset pipeline (production)
Aseprite (sprites/atlas) + Tiled (levels) → `public/assets/`. 16–32 px tiles, ~16-colour
palette, integer scaling, `pixelArt: true`. All assets original / open-licensed.

## Build & deploy
`npm run build` → `dist/`; GitHub Actions publishes `dist/` to Pages. Set `base` in
`vite.config.ts` to `/<repo>/` (default `/contract-quest/`).
