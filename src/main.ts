import Phaser from "phaser";
import { GAME } from "./utils/constants";
import BootScene from "./scenes/BootScene";
import PreloadScene from "./scenes/PreloadScene";
import TitleScene from "./scenes/TitleScene";
import StoryScene from "./scenes/StoryScene";
import GameScene from "./scenes/GameScene";
import VictoryScene from "./scenes/VictoryScene";
import CreditsScene from "./scenes/CreditsScene";

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
  scene: [BootScene, PreloadScene, TitleScene, StoryScene, GameScene, VictoryScene, CreditsScene],
};

// eslint-disable-next-line no-new
new Phaser.Game(config);
