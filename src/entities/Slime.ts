import Phaser from "phaser";

/** A Prompt Slime: hops slowly along its platform, turning at edges/walls. */
export default class Slime extends Phaser.Physics.Arcade.Sprite {
  private dir = -1;
  private readonly hopTimer: Phaser.Time.TimerEvent;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "slime");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    (this.body as Phaser.Physics.Arcade.Body).setSize(24, 16).setOffset(2, 6);
    this.hopTimer = scene.time.addEvent({ delay: 1100, loop: true, callback: () => this.hop() });
    this.once(Phaser.GameObjects.Events.DESTROY, () => this.hopTimer.remove(false));
  }

  private hop(): void {
    if (!this.active || !this.body) return;
    const body = this.body as Phaser.Physics.Arcade.Body;
    if (body.blocked.left) this.dir = 1;
    else if (body.blocked.right) this.dir = -1;
    if (body.blocked.down) this.setVelocity(60 * this.dir, -180);
    this.setFlipX(this.dir > 0);
  }
}
