import Phaser from "phaser";
import { GAME } from "../utils/constants";
import { EPISODES } from "../levels/episodes";
import { buildEpisode } from "../levels/builder";
import Player, { InputState } from "../entities/Player";
import BugBot from "../entities/BugBot";
import Slime from "../entities/Slime";
import Coin from "../entities/Coin";
import HUD from "../ui/HUD";
import TouchControls from "../ui/TouchControls";

export default class GameScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private movers: Phaser.Physics.Arcade.Image[] = [];
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private wasd!: Record<string, Phaser.Input.Keyboard.Key>;
  private touch!: TouchControls;
  private hud!: HUD;
  private cityFar!: Phaser.GameObjects.TileSprite;
  private cityNear!: Phaser.GameObjects.TileSprite;
  private coins = 0;
  private score = 0;
  private lives = 3;
  private epIndex = 0;
  private won = false;
  private bossAlive = false;
  private bossShielded = true;
  private bossHp = 3;

  constructor() {
    super("Game");
  }

  create(): void {
    this.epIndex = this.registry.get("episode") ?? 0;
    this.coins = this.registry.get("coins") ?? 0;
    this.score = this.registry.get("score") ?? 0;
    this.lives = this.registry.get("lives") ?? 3;
    this.won = false;
    this.movers = [];
    const cfg = EPISODES[this.epIndex];

    this.buildBackground(cfg.accent);
    const lvl = buildEpisode(this, cfg);
    this.platforms = lvl.platforms;
    this.movers = lvl.movers;

    this.player = new Player(this, 80, 200);
    this.physics.add.collider(this.player, this.platforms);
    this.movers.forEach((m) => this.physics.add.collider(this.player, m));
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    if (this.epIndex === 0) this.buildPanels();
    this.spawnFrom(lvl, cfg.boss);
    this.decor();
    this.ambientFX();

    this.hud = new HUD(this);
    this.add.text(GAME.WIDTH / 2, 38, cfg.title, { fontFamily: "monospace", fontSize: "12px", color: "#ffd9a0" })
      .setOrigin(0.5).setScrollFactor(0).setDepth(1000);
    this.touch = new TouchControls(this);
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.wasd = this.input.keyboard!.addKeys("W,A,D") as Record<string, Phaser.Input.Keyboard.Key>;
  }

  private buildBackground(accent: number): void {
    this.add.image(0, 0, "sky").setOrigin(0, 0).setScrollFactor(0).setDisplaySize(GAME.WIDTH, GAME.HEIGHT).setDepth(-20);
    this.cityFar = this.add.tileSprite(0, GAME.HEIGHT - 300, GAME.WIDTH, 300, "cityFar").setOrigin(0, 0).setScrollFactor(0).setDepth(-12);
    this.cityNear = this.add.tileSprite(0, GAME.HEIGHT - 300, GAME.WIDTH, 300, "cityNear").setOrigin(0, 0).setScrollFactor(0).setDepth(-10);
    // per-realm accent tone
    this.add.rectangle(GAME.WIDTH / 2, GAME.HEIGHT / 2, GAME.WIDTH, GAME.HEIGHT, accent, 0.05).setScrollFactor(0).setDepth(-9).setBlendMode(Phaser.BlendModes.ADD);
  }

  private glow(x: number, y: number, scale: number, tint = 0xffffff): Phaser.GameObjects.Image {
    return this.add.image(x, y, "glow").setBlendMode(Phaser.BlendModes.ADD).setScale(scale).setTint(tint).setDepth(-1);
  }

  private buildPanels(): void {
    const panel = (x: number, y: number, w: number, h: number, lines: string[], color: string) => {
      this.add.rectangle(x, y, w, h, 0x0c1424, 0.55).setOrigin(0, 0).setStrokeStyle(1, 0x7fd0ff, 0.5).setDepth(-5);
      this.add.text(x + 8, y + 6, lines.join("\n"), { fontFamily: "monospace", fontSize: "11px", color, lineSpacing: 3 }).setDepth(-5);
    };
    panel(70, 120, 150, 110, ["// CONTRACT RULES", "+ Clarity", "+ Compliance", "+ Performance", "+ Security", "+ Reliability"], "#8cff70");
    panel(640, 110, 170, 110, ["contract.yaml", "version: 1.0", "parties:", " - Builder", " - Client", "terms:", " - deliver_quality"], "#7fd0ff");
  }

  private spawnFrom(lvl: ReturnType<typeof buildEpisode>, boss: boolean): void {
    for (const c of lvl.coins) {
      const g = this.glow(c.x, c.y, 0.6, 0xffcf33);
      const coin = new Coin(this, c.x, c.y);
      this.physics.add.overlap(this.player, coin, () => { coin.destroy(); g.destroy(); this.coins++; this.score += 100; });
    }
    if (lvl.star) {
      const sg = this.glow(lvl.star.x, lvl.star.y, 1.3, 0x3a7bff);
      this.tweens.add({ targets: sg, scale: 1.7, alpha: 0.6, duration: 900, yoyo: true, repeat: -1 });
      const star = this.physics.add.staticSprite(lvl.star.x, lvl.star.y, "rmd");
      this.physics.add.overlap(this.player, star, () => { star.destroy(); sg.destroy(); this.score += 1000; });
    }
    for (const e of lvl.enemies) {
      const enemy = e.type === "slime" ? new Slime(this, e.x, e.y) : new BugBot(this, e.x, e.y);
      this.physics.add.collider(enemy, this.platforms);
      this.movers.forEach((m) => this.physics.add.collider(enemy, m));
      this.physics.add.overlap(this.player, enemy, () => this.onEnemy(enemy));
    }
    for (const pu of lvl.powerups) {
      const tint = pu.type === "shield" ? 0x66ccff : 0xffd400;
      const pg = this.glow(pu.x, pu.y, 0.9, tint);
      const ic = this.add.image(pu.x, pu.y, pu.type === "shield" ? "icon_shield" : "icon_jump").setScale(1.4);
      this.tweens.add({ targets: [ic, pg], y: pu.y - 6, duration: 800, yoyo: true, repeat: -1 });
      const zone = this.physics.add.staticImage(pu.x, pu.y, pu.type === "shield" ? "icon_shield" : "icon_jump").setVisible(false);
      this.physics.add.overlap(this.player, zone, () => {
        zone.destroy(); ic.destroy(); pg.destroy();
        if (pu.type === "shield") { this.player.setShield(true); this.time.delayedCall(8000, () => this.player.setShield(false)); }
        else { this.player.canDouble = true; this.time.delayedCall(12000, () => (this.player.canDouble = false)); }
      });
    }
    // Matrix Gate (animated)
    const g = lvl.gate;
    const gGlow = this.glow(g.x, g.y, 2.4, 0x1f6fff);
    this.tweens.add({ targets: gGlow, scale: 3, alpha: 0.5, duration: 1100, yoyo: true, repeat: -1 });
    const gate = this.physics.add.staticImage(g.x, g.y, "gate");
    const swirl = this.add.image(g.x, g.y - 12, "gateSwirl").setBlendMode(Phaser.BlendModes.ADD).setDepth(-1);
    this.tweens.add({ targets: swirl, angle: 360, duration: 7000, repeat: -1 });
    this.physics.add.overlap(this.player, gate, () => this.onGate());

    if (boss) this.spawnBoss(g.x - 420);
  }

  private spawnBoss(x: number): void {
    this.bossAlive = true; this.bossShielded = true; this.bossHp = 3;
    const boss = this.physics.add.sprite(x, GAME.HEIGHT - 90, "bug").setScale(2.6).setTint(0x9fb6ff);
    (boss.body as Phaser.Physics.Arcade.Body).setVelocityX(-50);
    this.physics.add.collider(boss, this.platforms);
    const aura = this.glow(x, boss.y, 2.0, 0x66ccff).setDepth(1);
    this.add.text(x, boss.y - 60, "ROGUE ARCHITECT", { fontFamily: "monospace", fontSize: "12px", color: "#9fb6ff" }).setOrigin(0.5).setDepth(2);
    // shield drops periodically
    this.time.addEvent({ delay: 2600, loop: true, callback: () => { this.bossShielded = !this.bossShielded; aura.setVisible(this.bossShielded); } });
    // patrol + spawn bugs
    this.time.addEvent({ delay: 100, loop: true, callback: () => {
      const b = boss.body as Phaser.Physics.Arcade.Body;
      if (b.blocked.left) b.setVelocityX(50); else if (b.blocked.right) b.setVelocityX(-50);
      aura.setPosition(boss.x, boss.y);
    }});
    this.time.addEvent({ delay: 3200, loop: true, callback: () => {
      if (!this.bossAlive) return;
      const bug = new BugBot(this, boss.x, boss.y - 20);
      this.physics.add.collider(bug, this.platforms);
      this.physics.add.overlap(this.player, bug, () => this.onEnemy(bug));
    }});
    this.physics.add.overlap(this.player, boss, () => {
      const pb = this.player.body as Phaser.Physics.Arcade.Body;
      const stomp = pb.velocity.y > 60 && this.player.y < boss.y - 20;
      if (stomp && !this.bossShielded) {
        this.bossHp--; this.player.setVelocityY(-320); this.cameras.main.shake(160, 0.006);
        boss.setTint(0xffffff); this.time.delayedCall(120, () => boss.setTint(0x9fb6ff));
        if (this.bossHp <= 0) {
          this.bossAlive = false; boss.destroy(); aura.destroy();
          this.add.text(GAME.WIDTH / 2, 150, "Architecture restored.\nContract validated.", { fontFamily: "monospace", fontSize: "20px", color: "#7fd0ff", align: "center" }).setOrigin(0.5).setScrollFactor(0).setDepth(50);
        }
      } else if (!stomp && !this.player.shielded) {
        this.hurt(boss.x);
      }
    });
  }

  private decor(): void {
    const sx = GAME.WIDTH * 0.66, sy = 205;
    for (let i = 0; i < 6; i++) {
      const ray = this.add.image(sx, sy, "ray").setOrigin(0, 0.5).setBlendMode(Phaser.BlendModes.ADD)
        .setScrollFactor(0).setDepth(-15).setAlpha(0.32).setScale(2.2, 1).setAngle(-90 + i * 30);
      this.tweens.add({ targets: ray, angle: ray.angle + 4, duration: 4000 + i * 300, yoyo: true, repeat: -1, ease: "Sine.inOut" });
    }
    // warm ambient lights (no floating sprites — they read like coins)
    for (const [lx, ly] of [[300, 250], [900, 220], [1500, 230]]) {
      this.glow(lx, ly, 0.8, 0xffb060).setDepth(-13);
    }
    // foliage sits on the ground line
    for (const px of [200, 760, 1300, 2000]) {
      this.add.image(px, GAME.HEIGHT - 60, "plant").setDepth(-3);
    }
  }

  private ambientFX(): void {
    this.add.particles(0, 0, "ember", {
      x: { min: 0, max: GAME.WIDTH }, y: GAME.HEIGHT + 8, lifespan: 4200,
      speedY: { min: -28, max: -10 }, speedX: { min: -10, max: 10 },
      scale: { start: 1, end: 0 }, alpha: { start: 0.6, end: 0 }, frequency: 280, quantity: 1, blendMode: "ADD",
    }).setScrollFactor(0).setDepth(6);
    this.add.image(GAME.WIDTH / 2, GAME.HEIGHT / 2, "vignette").setScrollFactor(0).setDisplaySize(GAME.WIDTH, GAME.HEIGHT).setDepth(8);
  }

  private onEnemy(enemy: Phaser.Physics.Arcade.Sprite): void {
    const body = this.player.body as Phaser.Physics.Arcade.Body;
    if (body.velocity.y > 80 && this.player.y < enemy.y - 4) {
      enemy.destroy(); this.player.setVelocityY(-300); this.score += 200; this.cameras.main.shake(100, 0.004);
    } else if (this.player.shielded) {
      enemy.destroy(); this.score += 200;
    } else if (!this.won) {
      this.hurt(enemy.x);
    }
  }

  private hurt(fromX: number): void {
    this.lives -= 1;
    this.player.setVelocityY(-260).setVelocityX(this.player.x < fromX ? -220 : 220);
    this.cameras.main.shake(160, 0.006);
    if (this.lives <= 0) {
      this.registry.set("coins", 0); this.registry.set("score", 0); this.registry.set("lives", 3);
      this.scene.start("Story", { episode: this.epIndex, retry: true });
    }
  }

  private onGate(): void {
    if (this.won || this.bossAlive) return;
    this.won = true;
    this.cameras.main.flash(300, 120, 200, 255);
    this.registry.set("coins", this.coins); this.registry.set("score", this.score); this.registry.set("lives", this.lives);
    const next = this.epIndex + 1;
    this.add.text(GAME.WIDTH / 2, 150, "EPISODE COMPLETE\nContract validated", { fontFamily: "monospace", fontSize: "20px", color: "#7fd0ff", align: "center", fontStyle: "bold" }).setOrigin(0.5).setScrollFactor(0).setDepth(50);
    this.time.delayedCall(1400, () => {
      if (next >= EPISODES.length) { this.registry.set("episode", 0); this.scene.start("Victory"); }
      else { this.registry.set("episode", next); this.scene.start("Story", { episode: next }); }
    });
  }

  update(): void {
    this.cityFar.tilePositionX = this.cameras.main.scrollX * 0.25;
    this.cityNear.tilePositionX = this.cameras.main.scrollX * 0.5;
    for (const m of this.movers) {
      const b = m.body as Phaser.Physics.Arcade.Body;
      if (m.x <= (m as any)._minX) b.setVelocityX(40);
      else if (m.x >= (m as any)._maxX) b.setVelocityX(-40);
    }
    const input: InputState = {
      left: this.cursors.left.isDown || this.wasd.A.isDown || this.touch.state.left,
      right: this.cursors.right.isDown || this.wasd.D.isDown || this.touch.state.right,
      jump: this.cursors.up.isDown || this.cursors.space.isDown || this.wasd.W.isDown || this.touch.state.jump,
    };
    this.player.control(input);
    this.hud.update(this.coins, this.score, this.lives);
  }
}
