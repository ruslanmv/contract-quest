import Phaser from "phaser";
import { PLAYER } from "../utils/constants";

export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
}

/** The engineer-robot hero: Arcade-physics sprite with run/jump movement. */
export default class Player extends Phaser.Physics.Arcade.Sprite {
  private jumpHeld = false;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, "hero");
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setCollideWorldBounds(true);
    this.setDragX(PLAYER.DRAG);
    this.setMaxVelocity(PLAYER.SPEED, 1400);
    (this.body as Phaser.Physics.Arcade.Body).setSize(22, 32).setOffset(3, 4);
  }

  /** Drive the hero from a unified input state (keyboard or touch). */
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

    // Variable-height jump: short tap = low hop, hold = full jump.
    if (input.jump && onGround && !this.jumpHeld) {
      this.setVelocityY(-PLAYER.JUMP);
      this.jumpHeld = true;
    }
    if (!input.jump) this.jumpHeld = false;
    if (!input.jump && body.velocity.y < -150) {
      this.setVelocityY(body.velocity.y * 0.5); // cut the jump when released
    }
  }
}
