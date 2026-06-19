import Phaser from "phaser";
import { GAME } from "../utils/constants";

const TIPS = [
  "RMD-101 — AI coders are workers, not architects.",
  "RMD-103 — Control files are protected.",
  "RMD-111 — Acceptance criteria are law.",
];

/** Premium title splash → starts the 8-episode campaign. */
export default class TitleScene extends Phaser.Scene {
  constructor() {
    super("Title");
  }

  create(): void {
    this.add.image(0, 0, "sky").setOrigin(0, 0).setDisplaySize(GAME.WIDTH, GAME.HEIGHT).setDepth(-2);
    this.add.tileSprite(0, GAME.HEIGHT - 300, GAME.WIDTH, 300, "cityNear").setOrigin(0, 0).setDepth(-1).setAlpha(0.8);
    this.add.image(GAME.WIDTH / 2, GAME.HEIGHT / 2, "vignette").setDisplaySize(GAME.WIDTH, GAME.HEIGHT).setDepth(5);

    const t1 = this.add.text(GAME.WIDTH / 2, 120, "CONTRACT", { fontFamily: "monospace", fontSize: "44px", color: "#ffffff", fontStyle: "bold" }).setOrigin(0.5);
    this.add.text(GAME.WIDTH / 2, 120 + 44, "QUEST", { fontFamily: "monospace", fontSize: "44px", color: "#ffa500", fontStyle: "bold" }).setOrigin(0.5);
    this.tweens.add({ targets: t1, y: 116, duration: 1400, yoyo: true, repeat: -1, ease: "Sine.inOut" });

    this.add.text(GAME.WIDTH / 2, 210, "A governed arcade quest — 8 episodes", { fontFamily: "monospace", fontSize: "13px", color: "#cfeaff" }).setOrigin(0.5);

    const tip = this.add.text(GAME.WIDTH / 2, 250, "TIP: " + TIPS[0], { fontFamily: "monospace", fontSize: "11px", color: "#7fb0ff" }).setOrigin(0.5);
    let ti = 0;
    this.time.addEvent({ delay: 3500, loop: true, callback: () => { ti = (ti + 1) % TIPS.length; tip.setText("TIP: " + TIPS[ti]); } });

    const go = this.add.text(GAME.WIDTH / 2, 300, "Press Enter / Tap to Start", { fontFamily: "monospace", fontSize: "14px", color: "#9affc0" }).setOrigin(0.5);
    this.tweens.add({ targets: go, alpha: 0.3, duration: 700, yoyo: true, repeat: -1 });

    this.add.text(GAME.WIDTH / 2, 330, "design by Ruslan Magana Vsevolodovna",
      { fontFamily: "monospace", fontSize: "10px", color: "#caa37a" }).setOrigin(0.5);

    const start = () => {
      this.registry.set("episode", 0); this.registry.set("coins", 0); this.registry.set("score", 0); this.registry.set("lives", 3);
      this.scene.start("Story", { episode: 0 });
    };
    this.input.keyboard!.once("keydown-ENTER", start);
    this.input.keyboard!.once("keydown-SPACE", start);
    this.input.once("pointerdown", start);
  }
}
