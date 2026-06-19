import Phaser from "phaser";
import { GAME } from "../utils/constants";

/** Shown after Episode VIII — the campaign's resolution, then Credits. */
export default class VictoryScene extends Phaser.Scene {
  constructor() {
    super("Victory");
  }

  create(): void {
    const score = this.registry.get("score") ?? 0;
    this.add.image(0, 0, "sky").setOrigin(0, 0).setDisplaySize(GAME.WIDTH, GAME.HEIGHT);
    this.add.image(GAME.WIDTH / 2, GAME.HEIGHT / 2 + 60, "gate").setScale(1.2);
    this.add.rectangle(GAME.WIDTH / 2, GAME.HEIGHT / 2, GAME.WIDTH, GAME.HEIGHT, 0x05040a, 0.5);

    this.add.text(GAME.WIDTH / 2, 90, "THE MATRIX GATE RECLAIMED", { fontFamily: "monospace", fontSize: "20px", color: "#7fd0ff", fontStyle: "bold" }).setOrigin(0.5);
    this.add.text(GAME.WIDTH / 2, 150,
      ["The Drift recedes. The contracts hold.", "The realm is yours, Builder.", "", `Final score: ${String(score).padStart(6, "0")}`].join("\n"),
      { fontFamily: "monospace", fontSize: "14px", color: "#e8e8ff", align: "center", lineSpacing: 6 }).setOrigin(0.5);

    const go = this.add.text(GAME.WIDTH / 2, GAME.HEIGHT - 50, "Press Enter / Tap for credits", { fontFamily: "monospace", fontSize: "12px", color: "#9affc0" }).setOrigin(0.5);
    this.tweens.add({ targets: go, alpha: 0.3, duration: 700, yoyo: true, repeat: -1 });
    const next = () => this.scene.start("Credits");
    this.input.keyboard!.once("keydown-ENTER", next);
    this.input.once("pointerdown", next);
    this.time.delayedCall(6000, next);
  }
}
