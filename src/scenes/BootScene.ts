import Phaser from "phaser";
import { generatePlaceholderTextures } from "../utils/textures";

/**
 * BootScene — in production this preloads the Aseprite atlas + Tiled tilemaps.
 * In the scaffold it generates placeholder textures so the game runs with no
 * external assets, then hands off to GameScene.
 */
export default class BootScene extends Phaser.Scene {
  constructor() {
    super("Boot");
  }

  create(): void {
    generatePlaceholderTextures(this);
    this.scene.start("Game");
  }
}
