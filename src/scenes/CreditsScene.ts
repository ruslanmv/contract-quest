import Phaser from "phaser";
import { GAME } from "../utils/constants";

const CREDITS: [string, string][] = [
  ["CONTRACT QUEST", ""],
  ["", ""],
  ["Game design & direction", "Ruslan Magana Vsevolodovna"],
  ["Story & world", "Ruslan Magana Vsevolodovna"],
  ["", ""],
  ["Built under contract by", "GitPilot"],
  ["Governed by", "Matrix Builder"],
  ["Standards", "Ruslan Magana Definitions (RMD)"],
  ["", ""],
  ["Engine", "Phaser 3 · TypeScript · Vite"],
  ["Art & code", "generated under governance"],
  ["", ""],
  ["RMD-101", "AI coders are workers, not architects"],
  ["RMD-103", "Control files are protected"],
  ["RMD-111", "Acceptance criteria are law"],
  ["", ""],
  ["Thank you for playing.", ""],
  ["coded by GitPilot — under a Matrix Builder contract", ""],
];

/** Scrolling end credits → back to the title. */
export default class CreditsScene extends Phaser.Scene {
  constructor() {
    super("Credits");
  }

  create(): void {
    this.add.image(0, 0, "sky").setOrigin(0, 0).setDisplaySize(GAME.WIDTH, GAME.HEIGHT).setTint(0x223044);
    this.add.image(GAME.WIDTH / 2, GAME.HEIGHT / 2, "vignette").setDisplaySize(GAME.WIDTH, GAME.HEIGHT).setDepth(5);

    const container = this.add.container(0, GAME.HEIGHT + 20);
    let y = 0;
    for (const [label, value] of CREDITS) {
      if (label) {
        const big = !value && label.length < 24;
        container.add(this.add.text(GAME.WIDTH / 2, y, label, {
          fontFamily: "monospace", fontSize: big ? "18px" : "12px",
          color: value ? "#8fb7c8" : "#ffd9a0", fontStyle: big ? "bold" : "normal",
        }).setOrigin(0.5));
        if (value) container.add(this.add.text(GAME.WIDTH / 2, y + 16, value, { fontFamily: "monospace", fontSize: "14px", color: "#ffffff" }).setOrigin(0.5));
      }
      y += value ? 44 : 30;
    }

    this.tweens.add({
      targets: container, y: -y - 40, duration: 16000, ease: "Linear",
      onComplete: () => this.scene.start("Title"),
    });
    const skip = this.add.text(GAME.WIDTH / 2, GAME.HEIGHT - 14, "Press Enter / Tap to skip", { fontFamily: "monospace", fontSize: "10px", color: "#7fb0ff" }).setOrigin(0.5).setDepth(10);
    void skip;
    const back = () => this.scene.start("Title");
    this.input.keyboard!.once("keydown-ENTER", back);
    this.input.once("pointerdown", back);
  }
}
