import Phaser from "phaser";

/** A Bug Bot enemy: patrols a platform and turns around at edges/walls. */
export default class BugBot extends Phaser.Physics.Arcade.Sprite {
  private dir = 1;
  private readonly speed = 50;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "bug");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setVelocityX(this.speed);
    this.setBounceX(1);
  }

  preUpdate(time: number, delta: number): void {
    super.preUpdate(time, delta);
    const body = this.body as Phaser.Physics.Arcade.Body;
    // flip when bouncing off a wall
    if (body.blocked.left) this.dir = 1;
    else if (body.blocked.right) this.dir = -1;
    this.setVelocityX(this.speed * this.dir);
    this.setFlipX(this.dir < 0);
  }
}
