import Phaser from "phaser";
import { GAME, PALETTE } from "../utils/constants";
import Player, { InputState } from "../entities/Player";
import BugBot from "../entities/BugBot";
import Coin from "../entities/Coin";
import HUD from "../ui/HUD";
import TouchControls from "../ui/TouchControls";

const LEVEL_WIDTH = 2400;

/**
 * GameScene — a complete, runnable level: parallax sunset world, tile platforms,
 * the hero with gravity/collision/variable-jump, a patrolling Bug Bot, coins,
 * the RMD star, a Matrix-Gate goal, camera follow, HUD and touch controls.
 * The architecture (tilemap loader, more entities, levels, boss) plugs in here.
 */
export default class GameScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private touch!: TouchControls;
  private hud!: HUD;
  private coins = 0;
  private score = 0;
  private lives = 3;

  constructor() {
    super("Game");
  }

  create(): void {
    this.physics.world.setBounds(0, 0, LEVEL_WIDTH, GAME.HEIGHT);
    this.cameras.main.setBounds(0, 0, LEVEL_WIDTH, GAME.HEIGHT);

    this.buildBackground();
    this.buildLevel();

    this.player = new Player(this, 80, 220);
    this.physics.add.collider(this.player, this.platforms);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.spawnEntities();

    this.hud = new HUD(this);
    this.touch = new TouchControls(this);
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys("W,A,D") as Record<string, Phaser.Input.Keyboard.Key>;
  }

  /** Layered parallax sunset sky + skyline silhouettes. */
  private buildBackground(): void {
    const sky = this.add.graphics().setScrollFactor(0).setDepth(-10);
    for (let i = 0; i < GAME.HEIGHT; i++) {
      const t = i / GAME.HEIGHT;
      const c = Phaser.Display.Color.Interpolate.ColorWithColor(
        Phaser.Display.Color.ValueToColor(PALETTE.skyTop),
        Phaser.Display.Color.ValueToColor(PALETTE.skyBottom),
        100,
        Math.floor(t * 100)
      );
      sky.fillStyle(Phaser.Display.Color.GetColor(c.r, c.g, c.b), 1).fillRect(0, i, GAME.WIDTH, 1);
    }
    // far skyline silhouettes (parallax)
    const far = this.add.graphics().setScrollFactor(0.3).setDepth(-9);
    far.fillStyle(0x3a2a33, 0.7);
    for (let x = 0; x < LEVEL_WIDTH; x += 130) {
      const h = 80 + ((x * 7) % 120);
      far.fillRect(x, GAME.HEIGHT - h, 70, h);
    }
  }

  /** Ground + floating platforms from the placeholder tile texture. */
  private buildLevel(): void {
    this.platforms = this.physics.add.staticGroup();
    // ground
    for (let x = 0; x < LEVEL_WIDTH; x += GAME.TILE) {
      this.platforms.create(x + GAME.TILE / 2, GAME.HEIGHT - GAME.TILE / 2, "tile");
    }
    // floating ledges
    const ledges: [number, number, number][] = [
      [320, 250, 3], [520, 200, 2], [760, 250, 3], [980, 180, 2], [1240, 230, 4], [1600, 200, 3],
    ];
    for (const [lx, ly, n] of ledges) {
      for (let i = 0; i < n; i++) {
        this.platforms.create(lx + i * GAME.TILE, ly, "tile");
      }
    }
  }

  private spawnEntities(): void {
    // coin arc
    const arc = [[420, 200], [460, 175], [500, 165], [540, 175], [580, 200]];
    for (const [cx, cy] of arc) {
      const coin = new Coin(this, cx, cy);
      this.physics.add.overlap(this.player, coin, () => {
        coin.destroy();
        this.coins += 1;
        this.score += 100;
      });
    }
    // RMD star
    const star = this.physics.add.staticSprite(1000, 150, "rmd");
    this.physics.add.overlap(this.player, star, () => {
      star.destroy();
      this.score += 1000;
    });
    // Bug Bot enemy
    const bug = new BugBot(this, 780, 220);
    this.physics.add.collider(bug, this.platforms);
    this.physics.add.overlap(this.player, bug, () => this.onEnemy(bug));

    // Matrix Gate goal
    const gate = this.physics.add.staticSprite(LEVEL_WIDTH - 60, GAME.HEIGHT - 90, "rmd").setScale(2).setTint(0x1f6fff);
    this.physics.add.overlap(this.player, gate, () => this.onGate());
  }

  private onEnemy(bug: BugBot): void {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    if (body.velocity.y > 80 && this.player.y < bug.y - 6) {
      bug.destroy(); // stomp
      this.player.setVelocityY(-300);
      this.score += 200;
    } else {
      this.lives -= 1;
      this.player.setVelocityY(-260).setVelocityX(this.player.x < bug.x ? -220 : 220);
      if (this.lives <= 0) this.scene.restart();
    }
  }

  private onGate(): void {
    if ((this.player as any)._won) return;
    (this.player as any)._won = true;
    this.add
      .text(this.cameras.main.midPoint.x, 150, "LEVEL COMPLETE\nContract validated", {
        fontFamily: "monospace", fontSize: "22px", color: "#7fd0ff", align: "center",
      })
      .setOrigin(0.5)
      .setScrollFactor(0);
  }

  update(): void {
    const input: InputState = {
      left: this.cursors.left.isDown || this.wasd.A.isDown || this.touch.state.left,
      right: this.cursors.right.isDown || this.wasd.D.isDown || this.touch.state.right,
      jump: this.cursors.up.isDown || this.cursors.space.isDown || this.wasd.W.isDown || this.touch.state.jump,
    };
    this.player.control(input);
    this.hud.update(this.coins, this.score, this.lives);
  }
}
