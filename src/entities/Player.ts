import Phaser from "phaser";
import { PLAYER } from "../utils/constants";

export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
}

/** The engineer-robot hero: animated Arcade sprite with variable-jump movement. */
export default class Player extends Phaser.Physics.Arcade.Sprite {
  private jumpHeld = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "hero", 0);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setDragX(PLAYER.DRAG);
    this.setMaxVelocity(PLAYER.SPEED, 1400);
    (this.body as Phaser.Physics.Arcade.Body).setSize(18, 32).setOffset(5, 4);
    this.play("idle");
  }

  control(input: InputState): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const onGround = body.blocked.down || body.touching.down;

    if (input.left) {
      this.setAccelerationX(-PLAYER.ACCEL);
      this.setFlipX(true);
    } else if (input.right) {
      this.setAccelerationX(PLAYER.ACCEL);
      this.setFlipX(false);
    } else {
      this.setAccelerationX(0);
    }

    if (input.jump && onGround && !this.jumpHeld) {
      this.setVelocityY(-PLAYER.JUMP);
      this.jumpHeld = true;
    }
    if (!input.jump) this.jumpHeld = false;
    if (!input.jump && body.velocity.y < -150) this.setVelocityY(body.velocity.y * 0.5);

    // animation state
    if (!onGround) this.play("jump", true);
    else if (input.left || input.right) this.play("run", true);
    else this.play("idle", true);
  }
}
