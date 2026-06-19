# Contract Quest — versions & branches

A quick map of the branches in this repo: what each contains, which is newest, and which to use.

> **TL;DR — use `claude/compassionate-clarke-44nrg8`** (newest, most complete: the 8-episode
> campaign + the professional README + screenshots). It's the designated development branch and is
> ready to merge to `master`/`main`.

## Comparison

| Feature | `main` = `enhanced-art` | `episodes` | `claude/compassionate-clarke-44nrg8` 🏆 |
|---|---|---|---|
| **Commit · date** | `5188b49` · 2026-06-17 21:13 | `9ec5e33` · 21:44 | `6cb4b70` · 21:55 |
| **Role** | base + enhanced art | campaign code | **newest · designated dev branch** |
| Scenes | **3** (Boot, Preload, Game) | **7** | **7** |
| Original pixel-art set (`scripts/gen_assets.py`) | ✅ | ✅ | ✅ |
| Enhanced visuals (animated Matrix Gate, spinning coins, sun light-rays, lanterns, foliage) | ✅ | ✅ | ✅ |
| 8-episode campaign (`src/levels/episodes.ts` + `builder.ts`) | ❌ | ✅ | ✅ |
| Title / Story / Victory / Credits scenes | ❌ | ✅ | ✅ |
| Boss — the Rogue Architect | ❌ | ✅ | ✅ |
| Power-ups (shield + double-jump) | ❌ | ✅ | ✅ |
| Screenshots in repo (`docs/img/`) | ❌ | ❌ | ✅ (title · story · gameplay · campaign) |
| README | Architecture scaffold | Architecture scaffold | **Professional** — campaign, credits, scalability story, screenshots |

## What each branch is

- **`main` / `enhanced-art`** — identical (both at `5188b49`). The single-level **enhanced-art**
  build: a real Phaser 3 + TypeScript + Vite engine with an original programmatic pixel-art set and
  the full visual pipeline (parallax, glow, particles, animated gate). No campaign yet.
- **`episodes`** (`9ec5e33`) — everything in `enhanced-art` **plus** the **8-episode, data-driven
  campaign**: `episodes.ts` (one config object per episode) read by a fixed `buildEpisode()` engine,
  with Title/Story/Victory/Credits scenes, power-ups, and the Rogue Architect boss. README is still
  the original "Architecture" scaffold.
- **`claude/compassionate-clarke-44nrg8`** (`6cb4b70`) — **newest.** The `episodes` game **plus** a
  professional README (the campaign, end credits, the "episodes are data, not code" scalability
  story) and the four screenshots under `docs/img/`.

## Related

- **`ruslanmv/contract-quest-watsonx`** — a *separate repo*, not a branch here: the single-file
  watsonx prototype (`frontend/index.html`) built in governed batches. Good for the prototype story;
  this repo is the production engine.

*Generated as a branch map; `main`/`enhanced-art` share a commit, so they are byte-for-byte identical.*
