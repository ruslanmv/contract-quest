import Phaser from "phaser";
import { GAME } from "../utils/constants";

/** Loads the real pixel-art assets from public/assets/ and builds animations. */
export default class PreloadScene extends Phaser.Scene {
  constructor() {
    super("Preload");
  }

  preload(): void {
    const bar = this.add.rectangle(GAME.WIDTH / 2, GAME.HEIGHT / 2, 200, 8, 0x7fd0ff, 0.3);
    const fill = this.add.rectangle(GAME.WIDTH / 2 - 100, GAME.HEIGHT / 2, 0, 8, 0x7fd0ff).setOrigin(0, 0.5);
    this.add.text(GAME.WIDTH / 2, GAME.HEIGHT / 2 - 24, "CONTRACT QUEST", {
      fontFamily: "monospace", fontSize: "18px", color: "#ffa500", fontStyle: "bold",
    }).setOrigin(0.5);
    this.load.on("progress", (p: number) => fill.setSize(200 * p, 8));
    bar.setDepth(1);

    this.load.image("sky", "assets/sky.png");
    this.load.image("cityFar", "assets/city_far.png");
    this.load.image("cityNear", "assets/city_near.png");
    this.load.image("ground", "assets/ground.png");
    this.load.image("metal", "assets/metal.png");
    this.load.image("bug", "assets/bug.png");
    this.load.image("slime", "assets/slime.png");
    this.load.image("coin", "assets/coin.png");
    this.load.image("rmd", "assets/rmd.png");
    this.load.image("gate", "assets/gate.png");
    this.load.image("gateSwirl", "assets/gate_swirl.png");
    this.load.image("flag", "assets/flag.png");
    this.load.image("lantern", "assets/lantern.png");
    this.load.image("plant", "assets/plant.png");
    this.load.image("ray", "assets/ray.png");
    this.load.spritesheet("coinspin", "assets/coin_spin.png", { frameWidth: 16, frameHeight: 16 });
    this.load.image("glow", "assets/glow.png");
    this.load.image("vignette", "assets/vignette.png");
    this.load.image("ember", "assets/ember.png");
    for (const i of ["coin", "robot", "lock", "shield", "jump"]) {
      this.load.image("icon_" + i, `assets/icon_${i}.png`);
    }
    this.load.spritesheet("hero", "assets/hero.png", { frameWidth: 28, frameHeight: 36 });
  }

  create(): void {
    this.anims.create({ key: "idle", frames: [{ key: "hero", frame: 0 }], frameRate: 1, repeat: -1 });
    this.anims.create({
      key: "run",
      frames: this.anims.generateFrameNumbers("hero", { frames: [1, 2] }),
      frameRate: 9,
      repeat: -1,
    });
    this.anims.create({ key: "jump", frames: [{ key: "hero", frame: 3 }], frameRate: 1 });
    this.anims.create({
      key: "coinspin",
      frames: this.anims.generateFrameNumbers("coinspin", { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1,
    });
    this.scene.start("Title");
  }
}
