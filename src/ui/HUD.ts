import Phaser from "phaser";
import { GAME } from "../utils/constants";

/** Fixed-to-camera arcade HUD: title, coins, score, lives, RMD badge. */
export default class HUD {
  private coinsText: Phaser.GameObjects.Text;
  private scoreText: Phaser.GameObjects.Text;
  private livesText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: "ui-monospace, monospace",
      fontSize: "14px",
      color: "#ffffff",
    };
    const bar = scene.add.rectangle(GAME.WIDTH / 2, 16, GAME.WIDTH, 32, 0x14110a, 0.85);
    const title = scene.add.text(10, 8, "CONTRACT", { ...style, color: "#ffffff", fontStyle: "bold" });
    const title2 = scene.add.text(10 + title.width + 2, 8, "QUEST", { ...style, color: "#ffa500", fontStyle: "bold" });
    this.coinsText = scene.add.text(175, 8, "COINS 000", style);
    this.scoreText = scene.add.text(300, 8, "SCORE 000000", style);
    this.livesText = scene.add.text(445, 8, "LIVES 3", style);
    const rmd = scene.add.text(GAME.WIDTH - 95, 8, "RMD", { ...style, color: "#7fb0ff" });

    [bar, title, title2, this.coinsText, this.scoreText, this.livesText, rmd].forEach((o) =>
      o.setScrollFactor(0).setDepth(1000)
    );
  }

  update(coins: number, score: number, lives: number): void {
    this.coinsText.setText("COINS " + String(coins).padStart(3, "0"));
    this.scoreText.setText("SCORE " + String(score).padStart(6, "0"));
    this.livesText.setText("LIVES " + lives);
  }
}
