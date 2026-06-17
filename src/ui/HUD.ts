import Phaser from "phaser";
import { GAME } from "../utils/constants";

/** Fixed-to-camera arcade HUD with icon art: title, coins, score, lives, RMD badge. */
export default class HUD {
  private coinsText: Phaser.GameObjects.Text;
  private scoreText: Phaser.GameObjects.Text;
  private livesText: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene) {
    const style: Phaser.Types.GameObjects.Text.TextStyle = {
      fontFamily: "ui-monospace, monospace",
      fontSize: "13px",
      color: "#ffffff",
    };
    const objs: Phaser.GameObjects.GameObject[] = [];
    objs.push(scene.add.rectangle(GAME.WIDTH / 2, 15, GAME.WIDTH, 30, 0x14110a, 0.9));
    objs.push(scene.add.rectangle(GAME.WIDTH / 2, 30, GAME.WIDTH, 1, 0x7fd0ff, 0.4));

    objs.push(scene.add.image(14, 15, "icon_robot").setScale(1.1));
    const t1 = scene.add.text(26, 7, "CONTRACT", { ...style, fontStyle: "bold" });
    const t2 = scene.add.text(26 + t1.width + 2, 7, "QUEST", { ...style, color: "#ffa500", fontStyle: "bold" });
    objs.push(t1, t2);

    objs.push(scene.add.image(190, 15, "icon_coin"));
    this.coinsText = scene.add.text(202, 7, "000", style);
    objs.push(this.coinsText);

    objs.push(scene.add.text(300, 7, "SCORE", { ...style, color: "#caa37a" }));
    this.scoreText = scene.add.text(352, 7, "000000", { ...style, color: "#ffcf33" });
    objs.push(this.scoreText);

    objs.push(scene.add.image(465, 15, "icon_robot"));
    this.livesText = scene.add.text(477, 7, "x3", style);
    objs.push(this.livesText);

    objs.push(scene.add.text(GAME.WIDTH - 110, 7, "RMD LOCKED", { ...style, color: "#7fb0ff" }));
    objs.push(scene.add.image(GAME.WIDTH - 14, 15, "icon_lock"));

    objs.forEach((o) => {
      (o as any).setScrollFactor(0);
      (o as any).setDepth(1000);
    });
  }

  update(coins: number, score: number, lives: number): void {
    this.coinsText.setText(String(coins).padStart(3, "0"));
    this.scoreText.setText(String(score).padStart(6, "0"));
    this.livesText.setText("x" + Math.max(0, lives));
  }
}
