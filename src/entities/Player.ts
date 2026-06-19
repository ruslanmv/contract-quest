import Phaser from "phaser";
import { PLAYER } from "../utils/constants";

export interface InputState {
  left: boolean;
  right: boolean;
  jump: boolean;
}

/** The engineer-robot hero: animated, variable-jump, with double-jump + shield power-ups. */
export default class Player extends Phaser.Physics.Arcade.Sprite {
  private jumpHeld = false;
  private usedDouble = false;
  canDouble = false;
  shielded = false;
  private shieldFx?: Phaser.GameObjects.Image;

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

  setShield(on: boolean): void {
    this.shielded = on;
    if (on && !this.shieldFx) {
      this.shieldFx = this.scene.add
        .image(this.x, this.y, "glow")
        .setBlendMode(Phaser.BlendModes.ADD)
        .setTint(0x66ccff)
        .setScale(0.9)
        .setDepth(5);
    } else if (!on && this.shieldFx) {
      this.shieldFx.destroy();
      this.shieldFx = undefined;
    }
  }

  control(input: InputState): void {
    const body = this.body as Phaser.Physics.Arcade.Body;
    const onGround = body.blocked.down || body.touching.down;
    if (onGround) this.usedDouble = false;

    if (input.left) {
      this.setAccelerationX(-PLAYER.ACCEL);
      this.setFlipX(true);
    } else if (input.right) {
      this.setAccelerationX(PLAYER.ACCEL);
      this.setFlipX(false);
    } else {
      this.setAccelerationX(0);
    }

    if (input.jump && !this.jumpHeld) {
      if (onGround) {
        this.setVelocityY(-PLAYER.JUMP);
        this.jumpHeld = true;
      } else if (this.canDouble && !this.usedDouble) {
        this.setVelocityY(-PLAYER.JUMP * 0.92);
        this.usedDouble = true;
        this.jumpHeld = true;
      }
    }
    if (!input.jump) this.jumpHeld = false;
    if (!input.jump && body.velocity.y < -150) this.setVelocityY(body.velocity.y * 0.5);

    if (!onGround) this.play("jump", true);
    else if (input.left || input.right) this.play("run", true);
    else this.play("idle", true);

    if (this.shieldFx) this.shieldFx.setPosition(this.x, this.y);
  }
}
