import Phaser from "phaser";
import { GAME } from "../utils/constants";
import { EpisodeCfg } from "./episodes";

export interface Spawn { type: "bug" | "slime"; x: number; y: number; }
export interface Vec { x: number; y: number; }
export interface BuiltLevel {
  platforms: Phaser.Physics.Arcade.StaticGroup;
  movers: Phaser.Physics.Arcade.Image[];
  coins: Vec[];
  enemies: Spawn[];
  star: Vec | null;
  powerups: { type: "shield" | "djump"; x: number; y: number }[];
  gate: Vec;
}

/** Deterministic RNG so a given episode always generates the same layout. */
function rng(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a |= 0; a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Builds one episode's world from its config. Engine code never changes per episode. */
export function buildEpisode(scene: Phaser.Scene, cfg: EpisodeCfg): BuiltLevel {
  const r = rng(cfg.seed);
  const W = cfg.width;
  scene.physics.world.setBounds(0, 0, W, GAME.HEIGHT);
  scene.cameras.main.setBounds(0, 0, W, GAME.HEIGHT);

  const platforms = scene.physics.add.staticGroup();
  // ground (two rows)
  for (let x = 0; x < W; x += GAME.TILE) {
    platforms.create(x + GAME.TILE / 2, GAME.HEIGHT - GAME.TILE / 2, "ground");
    platforms.create(x + GAME.TILE / 2, GAME.HEIGHT - GAME.TILE * 1.5, "ground");
  }

  const movers: Phaser.Physics.Arcade.Image[] = [];
  const ledgeXs: { x: number; y: number }[] = [];
  for (let i = 0; i < cfg.platforms; i++) {
    const x = 260 + (i + r()) * ((W - 500) / cfg.platforms);
    const y = 150 + Math.floor(r() * 130);
    const n = 2 + Math.floor(r() * 3);
    const tex = r() < 0.4 ? "metal" : "ground";
    const isMover = cfg.moving && r() < 0.4;
    if (isMover) {
      const m = scene.physics.add.image(x, y, tex).setImmovable(true);
      (m.body as Phaser.Physics.Arcade.Body).setAllowGravity(false).setVelocityX(r() < 0.5 ? -40 : 40);
      (m as any)._minX = x - 70; (m as any)._maxX = x + 70;
      movers.push(m);
    } else {
      for (let k = 0; k < n; k++) platforms.create(x + k * GAME.TILE, y, tex);
    }
    ledgeXs.push({ x, y });
  }

  // coins (arcs)
  const coins: Vec[] = [];
  for (let a = 0; a < cfg.coinArcs; a++) {
    // first arc near the start (immediately visible), rest spread across the level
    const cx = a === 0 ? 300 : 350 + r() * (W - 700);
    const cy = 200 - r() * 40;
    for (let j = 0; j < 5; j++) coins.push({ x: cx + j * 42, y: cy - Math.sin((j / 4) * Math.PI) * 38 });
  }

  // enemies (on ground / ledges)
  const enemies: Spawn[] = [];
  for (let e = 0; e < cfg.enemies; e++) {
    const onLedge = ledgeXs.length > 0 && r() < 0.5;
    const spot = onLedge ? ledgeXs[Math.floor(r() * ledgeXs.length)] : { x: 300 + r() * (W - 600), y: GAME.HEIGHT - 70 };
    enemies.push({ type: r() < cfg.slimeRatio ? "slime" : "bug", x: spot.x, y: spot.y - 16 });
  }

  // star + power-ups
  const star: Vec | null = { x: W * 0.45 + r() * 200, y: 130 + r() * 60 };
  const powerups: { type: "shield" | "djump"; x: number; y: number }[] = [];
  if (cfg.shield) powerups.push({ type: "shield", x: 400 + r() * (W - 800), y: 150 + r() * 100 });
  if (cfg.djump) powerups.push({ type: "djump", x: 400 + r() * (W - 800), y: 150 + r() * 100 });

  return { platforms, movers, coins, enemies, star, powerups, gate: { x: W - 70, y: GAME.HEIGHT - 130 } };
}
