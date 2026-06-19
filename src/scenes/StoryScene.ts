import Phaser from "phaser";
import { GAME } from "../utils/constants";
import { EPISODES } from "../levels/episodes";

/** Narrative card shown before each episode (Super Mario Bros-style world intro). */
export default class StoryScene extends Phaser.Scene {
  constructor() {
    super("Story");
  }

  create(data: { episode: number; retry?: boolean }): void {
    const ep = EPISODES[data.episode];
    this.registry.set("episode", data.episode);
    this.add.image(0, 0, "sky").setOrigin(0, 0).setDisplaySize(GAME.WIDTH, GAME.HEIGHT).setTint(0x99aacc);
    this.add.rectangle(GAME.WIDTH / 2, GAME.HEIGHT / 2, GAME.WIDTH, GAME.HEIGHT, 0x05040a, 0.55);

    this.add.text(GAME.WIDTH / 2, 70, `EPISODE ${ep.id}`, { fontFamily: "monospace", fontSize: "14px", color: "#ffa500" }).setOrigin(0.5);
    this.add.text(GAME.WIDTH / 2, 96, ep.title.replace(/^[IVX]+ — /, ""), { fontFamily: "monospace", fontSize: "22px", color: "#ffffff", fontStyle: "bold" }).setOrigin(0.5);
    this.add.text(GAME.WIDTH / 2, 122, ep.subtitle, { fontFamily: "monospace", fontSize: "12px", color: "#7fd0ff" }).setOrigin(0.5);
    this.add.text(GAME.WIDTH / 2, 175, (data.retry ? ["The contract held. Try again, Builder.", ""] : []).concat(ep.story).join("\n"),
      { fontFamily: "monospace", fontSize: "13px", color: "#e8e8ff", align: "center", lineSpacing: 6 }).setOrigin(0.5);

    const go = this.add.text(GAME.WIDTH / 2, GAME.HEIGHT - 60, "Press Enter / Tap to begin", { fontFamily: "monospace", fontSize: "13px", color: "#9affc0" }).setOrigin(0.5);
    this.tweens.add({ targets: go, alpha: 0.3, duration: 700, yoyo: true, repeat: -1 });

    const start = () => this.scene.start("Game");
    this.input.keyboard!.once("keydown-ENTER", start);
    this.input.keyboard!.once("keydown-SPACE", start);
    this.input.once("pointerdown", start);
  }
}
