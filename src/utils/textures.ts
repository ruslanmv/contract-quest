import Phaser from "phaser";
import { PALETTE, GAME } from "./constants";

/**
 * Generates all placeholder textures programmatically at boot, so the scaffold
 * runs with ZERO external art files. In production these are replaced by an
 * Aseprite sprite-atlas / Tiled tileset loaded in PreloadScene — the rest of
 * the architecture (entities, scenes, HUD) is unchanged.
 */
export function generatePlaceholderTextures(scene: Phaser.Scene): void {
  const g = scene.make.graphics({ x: 0, y: 0 }, false);

  // ground tile (brick with mossy top)
  g.clear();
  g.fillStyle(PALETTE.ground, 1).fillRect(0, 0, GAME.TILE, GAME.TILE);
  g.fillStyle(0x46362550 & 0xffffff, 1).fillRect(2, 6, GAME.TILE - 4, 2);
  g.fillStyle(PALETTE.groundTop, 1).fillRect(0, 0, GAME.TILE, 6);
  g.generateTexture("tile", GAME.TILE, GAME.TILE);

  // metal platform tile
  g.clear();
  g.fillStyle(PALETTE.metal, 1).fillRect(0, 0, GAME.TILE, GAME.TILE / 2);
  g.fillStyle(PALETTE.metalTop, 1).fillRect(0, 0, GAME.TILE, 3);
  g.generateTexture("metal", GAME.TILE, GAME.TILE / 2);

  // hero (engineer robot)
  g.clear();
  g.fillStyle(PALETTE.hero, 1).fillRoundedRect(2, 8, 24, 26, 6);
  g.fillStyle(0x10243f, 1).fillRoundedRect(4, 12, 20, 12, 4);
  g.fillStyle(PALETTE.visor, 1).fillCircle(11, 18, 3).fillCircle(19, 18, 3);
  g.fillStyle(PALETTE.helmet, 1).fillEllipse(14, 8, 26, 14);
  g.generateTexture("hero", 28, 36);

  // coin (with code glyph hint)
  g.clear();
  g.fillStyle(PALETTE.coin, 1).fillCircle(8, 8, 8);
  g.fillStyle(0xb8860b, 1).fillCircle(8, 8, 5);
  g.generateTexture("coin", 16, 16);

  // bug bot enemy
  g.clear();
  g.fillStyle(PALETTE.bug, 1).fillRoundedRect(0, 4, 28, 16, 6);
  g.fillStyle(0x000000, 1).fillCircle(8, 12, 2).fillCircle(20, 12, 2);
  g.lineStyle(2, PALETTE.bug, 1).beginPath();
  g.moveTo(6, 4); g.lineTo(2, 0); g.moveTo(22, 4); g.lineTo(26, 0); g.strokePath();
  g.generateTexture("bug", 28, 22);

  // RMD star
  g.clear();
  g.fillStyle(PALETTE.rmd, 1);
  const pts: number[] = [];
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? 14 : 6;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    pts.push(16 + Math.cos(a) * r, 16 + Math.sin(a) * r);
  }
  g.fillPoints(
    pts.reduce<Phaser.Geom.Point[]>((acc, _, i, arr) => {
      if (i % 2 === 0) acc.push(new Phaser.Geom.Point(arr[i], arr[i + 1]));
      return acc;
    }, []),
    true
  );
  g.generateTexture("rmd", 32, 32);

  g.destroy();
}
