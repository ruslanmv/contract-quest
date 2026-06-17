import Phaser from "phaser";
import { GAME } from "./utils/constants";
import BootScene from "./scenes/BootScene";
import PreloadScene from "./scenes/PreloadScene";
import GameScene from "./scenes/GameScene";

const config: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: "game",
  backgroundColor: "#14110a",
  width: GAME.WIDTH,
  height: GAME.HEIGHT,
  pixelArt: true,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  physics: {
    default: "arcade",
    arcade: { gravity: { x: 0, y: GAME.GRAVITY }, debug: false },
  },
  scene: [BootScene, PreloadScene, GameScene],
};

// eslint-disable-next-line no-new
new Phaser.Game(config);
