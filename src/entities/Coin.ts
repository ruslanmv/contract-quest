import Phaser from "phaser";

/** A Contract Coin: a round gold coin with a gentle shimmer (never edge-on) + bob. */
export default class Coin extends Phaser.Physics.Arcade.Sprite {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "coin");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    (this.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    this.setScale(1.5);
    // gentle bob (no squash — always a round coin)
    scene.tweens.add({ targets: this, y: y - 6, duration: 720, yoyo: true, repeat: -1, ease: "Sine.inOut" });
  }
}
