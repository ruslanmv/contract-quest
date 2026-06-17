import Phaser from "phaser";
import { GAME } from "../utils/constants";
import { InputState } from "../entities/Player";

/** On-screen left/right/jump buttons — shown only on touch / small screens. */
export default class TouchControls {
  readonly state: InputState = { left: false, right: false, jump: false };

  constructor(scene: Phaser.Scene) {
    const isTouch =
      scene.sys.game.device.input.touch || window.matchMedia("(max-width: 820px)").matches;
    if (!isTouch) return;

    const mk = (x: number, y: number, label: string) => {
      const btn = scene.add
        .circle(x, y, 34, 0xffffff, 0.18)
        .setStrokeStyle(2, 0xffffff, 0.5)
        .setScrollFactor(0)
        .setDepth(1001)
        .setInteractive({ useHandCursor: true });
      scene.add
        .text(x, y, label, { fontFamily: "monospace", fontSize: "20px", color: "#fff" })
        .setOrigin(0.5)
        .setScrollFactor(0)
        .setDepth(1002);
      return btn;
    };

    const y = GAME.HEIGHT - 50;
    const left = mk(50, y, "◀");
    const right = mk(130, y, "▶");
    const jump = mk(GAME.WIDTH - 50, y, "▲");

    const bind = (btn: Phaser.GameObjects.Shape, key: keyof InputState) => {
      btn.on("pointerdown", () => (this.state[key] = true));
      btn.on("pointerup", () => (this.state[key] = false));
      btn.on("pointerout", () => (this.state[key] = false));
    };
    bind(left, "left");
    bind(right, "right");
    bind(jump, "jump");
  }
}
