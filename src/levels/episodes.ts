// =============================================================================
// Contract Quest — Episode campaign (data-driven).
//
// Each episode is a small CONFIG object, not code. Adding a new episode = adding
// one entry here; the engine (src/levels/builder.ts + GameScene) renders it.
// This is the "additive episode" pattern — the same batches build every level,
// only the data changes — which is exactly how the build scales safely.
//
// Story & design: Ruslan Magana Vsevolodovna.
// =============================================================================

export interface EpisodeCfg {
  /** 1-based episode number. */
  id: number;
  /** Roman-numeral title shown on the story card and HUD. */
  title: string;
  subtitle: string;
  /** Narrative lines shown on the episode story card. */
  story: string[];
  /** World width in pixels. */
  width: number;
  /** Number of floating ledges (difficulty grows with id). */
  platforms: number;
  /** Number of enemies. */
  enemies: number;
  /** Share of enemies that are Prompt Slimes (0..1); rest are Bug Bots. */
  slimeRatio: number;
  /** Some ledges slide horizontally. */
  moving: boolean;
  /** Number of coin arcs. */
  coinArcs: number;
  /** Drop a Shield power-up. */
  shield: boolean;
  /** Drop a Double-Jump power-up. */
  djump: boolean;
  /** Final episode — spawns the Rogue Architect boss before the gate. */
  boss: boolean;
  /** Accent colour that tints the world (theme per realm). */
  accent: number;
  /** Deterministic layout seed. */
  seed: number;
}

export const EPISODES: EpisodeCfg[] = [
  {
    id: 1, title: "I — The Build Fields", subtitle: "Awakening",
    story: [
      "The Realm of the Matrix runs on Contracts.",
      "But the Drift has corrupted the realms.",
      "You are the Builder — sworn to the Definitions.",
      "Restore the first contract. Run, leap, reclaim the Gate.",
    ],
    width: 2200, platforms: 5, enemies: 1, slimeRatio: 0, moving: false,
    coinArcs: 2, shield: false, djump: false, boss: false, accent: 0xffb060, seed: 11,
  },
  {
    id: 2, title: "II — The Dependency Cavern", subtitle: "Tangled paths",
    story: [
      "Dependencies twist through the dark.",
      "Prompt Slimes ooze across the ledges.",
      "Mind the gaps — and keep your footing.",
    ],
    width: 2600, platforms: 7, enemies: 3, slimeRatio: 0.6, moving: true,
    coinArcs: 3, shield: false, djump: true, boss: false, accent: 0x8a63d2, seed: 22,
  },
  {
    id: 3, title: "III — The Validation Gate", subtitle: "The verdict",
    story: [
      "Here the validators once stood watch.",
      "Now they sleep, and the Bug Bots swarm.",
      "Take up the Shield. Pass the verdict.",
    ],
    width: 2800, platforms: 8, enemies: 4, slimeRatio: 0.4, moving: true,
    coinArcs: 3, shield: true, djump: false, boss: false, accent: 0x21e600, seed: 33,
  },
  {
    id: 4, title: "IV — The Parallax Heights", subtitle: "Ascend",
    story: [
      "The spires of the old build pierce the dusk.",
      "Climb. The higher contracts await above.",
    ],
    width: 3000, platforms: 10, enemies: 5, slimeRatio: 0.5, moving: true,
    coinArcs: 4, shield: false, djump: true, boss: false, accent: 0x00f0ff, seed: 44,
  },
  {
    id: 5, title: "V — The Cache Marshes", subtitle: "Stale ground",
    story: [
      "Stale caches haunt the marshes.",
      "Nothing here is quite what it returns.",
      "Trust the platforms; doubt the rest.",
    ],
    width: 3200, platforms: 11, enemies: 6, slimeRatio: 0.7, moving: true,
    coinArcs: 4, shield: true, djump: false, boss: false, accent: 0x5fa84a, seed: 55,
  },
  {
    id: 6, title: "VI — The Pipeline Foundry", subtitle: "Build · Test · Deploy",
    story: [
      "The Foundry forges every build.",
      "Its lifts move; its bridges break.",
      "Time your leaps to the pipeline.",
    ],
    width: 3400, platforms: 12, enemies: 7, slimeRatio: 0.4, moving: true,
    coinArcs: 5, shield: true, djump: true, boss: false, accent: 0xffd400, seed: 66,
  },
  {
    id: 7, title: "VII — The Drift Expanse", subtitle: "Into the Drift",
    story: [
      "Beyond the Foundry lies the Drift itself.",
      "Order frays. The swarm is everywhere.",
      "Hold the line of the contract.",
    ],
    width: 3600, platforms: 13, enemies: 9, slimeRatio: 0.55, moving: true,
    coinArcs: 5, shield: true, djump: true, boss: false, accent: 0xff2d55, seed: 77,
  },
  {
    id: 8, title: "VIII — The Architect's Sanctum", subtitle: "The Rogue Architect",
    story: [
      "At the heart of the Drift, the Rogue Architect waits —",
      "who would rewrite the realm without a contract.",
      "Three times you must break its shield.",
      "Restore the architecture. Reclaim the Matrix Gate.",
    ],
    width: 2600, platforms: 6, enemies: 2, slimeRatio: 0.5, moving: false,
    coinArcs: 2, shield: true, djump: true, boss: true, accent: 0x1f6fff, seed: 88,
  },
];
