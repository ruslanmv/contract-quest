import Phaser from "phaser";
import { GAME } from "../utils/constants";
import Player, { InputState } from "../entities/Player";
import BugBot from "../entities/BugBot";
import Slime from "../entities/Slime";
import Coin from "../entities/Coin";
import HUD from "../ui/HUD";
import TouchControls from "../ui/TouchControls";

const LEVEL_WIDTH = 2600;

export default class GameScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private touch!: TouchControls;
  private hud!: HUD;
  private cityFar!: Phaser.GameObjects.TileSprite;
  private cityNear!: Phaser.GameObjects.TileSprite;
  private coins = 0;
  private score = 0;
  private lives = 3;
  private won = false;

  constructor() {
    super("Game");
  }

  create(): void {
    this.physics.world.setBounds(0, 0, LEVEL_WIDTH, GAME.HEIGHT);
    this.cameras.main.setBounds(0, 0, LEVEL_WIDTH, GAME.HEIGHT);

    this.buildBackground();
    this.buildLevel();
    this.buildPanels();

    this.player = new Player(this, 80, 200);
    this.physics.add.collider(this.player, this.platforms);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.spawnEntities();
    this.ambientFX();

    this.hud = new HUD(this);
    this.touch = new TouchControls(this);
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys("W,A,D") as Record<string, Phaser.Input.Keyboard.Key>;
  }

  private buildBackground(): void {
    this.add.image(0, 0, "sky").setOrigin(0, 0).setScrollFactor(0).setDisplaySize(GAME.WIDTH, GAME.HEIGHT).setDepth(-20);
    this.cityFar = this.add.tileSprite(0, GAME.HEIGHT - 300, GAME.WIDTH, 300, "cityFar").setOrigin(0, 0).setScrollFactor(0).setDepth(-12);
    this.cityNear = this.add.tileSprite(0, GAME.HEIGHT - 300, GAME.WIDTH, 300, "cityNear").setOrigin(0, 0).setScrollFactor(0).setDepth(-10);
  }

  private glow(x: number, y: number, scale: number, tint = 0xffffff): Phaser.GameObjects.Image {
    return this.add.image(x, y, "glow").setBlendMode(Phaser.BlendModes.ADD).setScale(scale).setTint(tint).setDepth(-1);
  }

  private buildLevel(): void {
    this.platforms = this.physics.add.staticGroup();
    for (let x = 0; x < LEVEL_WIDTH; x += GAME.TILE) {
      this.platforms.create(x + GAME.TILE / 2, GAME.HEIGHT - GAME.TILE / 2, "ground");
      this.platforms.create(x + GAME.TILE / 2, GAME.HEIGHT - GAME.TILE * 1.5, "ground");
    }
    const ledges: [number, number, number, string][] = [
      [340, 250, 3, "ground"], [560, 200, 2, "metal"], [800, 250, 3, "ground"],
      [1040, 180, 2, "metal"], [1320, 230, 4, "ground"], [1700, 200, 3, "metal"],
      [2050, 240, 3, "ground"],
    ];
    for (const [lx, ly, n, tex] of ledges) {
      for (let i = 0; i < n; i++) this.platforms.create(lx + i * GAME.TILE, ly, tex);
    }
  }

  private buildPanels(): void {
    const panel = (x: number, y: number, w: number, h: number, lines: string[], color: string) => {
      this.add.rectangle(x, y, w, h, 0x0c1424, 0.55).setOrigin(0, 0).setStrokeStyle(1, 0x7fd0ff, 0.5).setDepth(-5);
      this.add.text(x + 8, y + 6, lines.join("\n"), {
        fontFamily: "monospace", fontSize: "11px", color, lineSpacing: 3,
      }).setDepth(-5);
    };
    panel(70, 120, 150, 110, ["// CONTRACT RULES", "+ Clarity", "+ Compliance", "+ Performance", "+ Security", "+ Reliability"], "#8cff70");
    panel(640, 110, 170, 120, ["contract.yaml", "version: 1.0", "parties:", " - Builder", " - Client", "terms:", " - deliver_quality", " - uphold_integrity"], "#7fd0ff");
    panel(2150, 130, 170, 80, ["ACCESS LOG", "USER: GITPILOT", "CONTRACT: MATRIX BUILDER", "STATUS: ACTIVE"], "#9affc0");
  }

  private spawnEntities(): void {
    // coin arc with glow
    const arc = [[430, 190], [470, 165], [510, 155], [550, 165], [590, 190]];
    for (const [cx, cy] of arc) {
      const g = this.glow(cx, cy, 0.7, 0xffcf33);
      const coin = new Coin(this, cx, cy);
      this.physics.add.overlap(this.player, coin, () => {
        coin.destroy(); g.destroy(); this.coins += 1; this.score += 100;
        this.tweens.add({ targets: this.glow(cx, cy, 1.2, 0xffe08a), scale: 0, alpha: 0, duration: 250, onComplete: (_t, o) => (o[0] as Phaser.GameObjects.Image).destroy() });
      });
    }
    // RMD star
    const starGlow = this.glow(1060, 140, 1.4, 0x3a7bff);
    this.tweens.add({ targets: starGlow, scale: 1.7, alpha: 0.6, duration: 900, yoyo: true, repeat: -1 });
    const star = this.physics.add.staticSprite(1060, 140, "rmd");
    this.physics.add.overlap(this.player, star, () => { star.destroy(); starGlow.destroy(); this.score += 1000; });

    // checkpoint flag
    this.add.image(960, GAME.HEIGHT - 84, "flag").setDepth(-2);

    // enemies
    const bug = new BugBot(this, 820, 220);
    this.physics.add.collider(bug, this.platforms);
    this.physics.add.overlap(this.player, bug, () => this.onEnemy(bug));
    const slime = new Slime(this, 1360, 200);
    this.physics.add.collider(slime, this.platforms);
    this.physics.add.overlap(this.player, slime, () => this.onEnemy(slime));

    // Matrix Gate
    this.glow(LEVEL_WIDTH - 70, GAME.HEIGHT - 130, 2.4, 0x1f6fff);
    const gate = this.physics.add.staticImage(LEVEL_WIDTH - 70, GAME.HEIGHT - 130, "gate");
    this.physics.add.overlap(this.player, gate, () => this.onGate());
  }

  private ambientFX(): void {
    // drifting embers
    this.add.particles(0, 0, "ember", {
      x: { min: 0, max: GAME.WIDTH }, y: GAME.HEIGHT + 8,
      lifespan: 4200, speedY: { min: -28, max: -10 }, speedX: { min: -10, max: 10 },
      scale: { start: 1, end: 0 }, alpha: { start: 0.7, end: 0 }, frequency: 260, quantity: 1,
      blendMode: "ADD",
    }).setScrollFactor(0).setDepth(6);
    // warm color-grade + vignette
    this.add.rectangle(GAME.WIDTH / 2, GAME.HEIGHT / 2, GAME.WIDTH, GAME.HEIGHT, 0xff8a3c, 0.05).setScrollFactor(0).setDepth(7).setBlendMode(Phaser.BlendModes.ADD);
    this.add.image(GAME.WIDTH / 2, GAME.HEIGHT / 2, "vignette").setScrollFactor(0).setDisplaySize(GAME.WIDTH, GAME.HEIGHT).setDepth(8);
  }

  private onEnemy(enemy: Phaser.Physics.Arcade.Sprite): void {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    if (body.velocity.y > 80 && this.player.y < enemy.y - 4) {
      enemy.destroy(); this.player.setVelocityY(-300); this.score += 200;
      this.cameras.main.shake(120, 0.004);
    } else if (!this.won) {
      this.lives -= 1;
      this.player.setVelocityY(-260).setVelocityX(this.player.x < enemy.x ? -220 : 220);
      this.cameras.main.shake(160, 0.006);
      if (this.lives <= 0) this.scene.restart();
    }
  }

  private onGate(): void {
    if (this.won) return;
    this.won = true;
    this.cameras.main.flash(300, 120, 200, 255);
    this.add.text(GAME.WIDTH / 2, 150, "LEVEL COMPLETE\nContract validated", {
      fontFamily: "monospace", fontSize: "22px", color: "#7fd0ff", align: "center", fontStyle: "bold",
    }).setOrigin(0.5).setScrollFactor(0).setDepth(50);
  }

  update(): void {
    this.cityFar.tilePositionX = this.cameras.main.scrollX * 0.25;
    this.cityNear.tilePositionX = this.cameras.main.scrollX * 0.5;
    const input: InputState = {
      left: this.cursors.left.isDown || this.wasd.A.isDown || this.touch.state.left,
      right: this.cursors.right.isDown || this.wasd.D.isDown || this.touch.state.right,
      jump: this.cursors.up.isDown || this.cursors.space.isDown || this.wasd.W.isDown || this.touch.state.jump,
    };
    this.player.control(input);
    this.hud.update(this.coins, this.score, this.lives);
  }
}
