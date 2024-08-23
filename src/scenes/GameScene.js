import Phaser from "phaser";
import { createAnimations } from "../animations.js";
import { Bloque } from "../objects/Bloque.js";
import { PlayerManager } from "../managers/PlayerManager.js";
import { EnemyManager } from "../managers/EnemyManager.js";
import { HudManager } from "../managers/HubManager.js";
import { SoundManager } from "../managers/SoundManager.js";
import {
  ENEMY_SPAWN_DELAY,
  TILE_SIZE,
  RIGHT_LIMIT_X,
  RIGHT_LIMIT_Y,
  RIGHT_LIMIT_WIDTH,
  RIGHT_LIMIT_HEIGHT,
} from "../config.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });

    this.escalado = 3;
    this.maxBombas = 3;
    this.totalEnemies = 9;
    this.lives = 3;
  }

  preload() {
    this.load.spritesheet("tiles", "assets/sprites1.png", {
      frameWidth: TILE_SIZE,
      frameHeight: TILE_SIZE,
    });

    this.load.tilemapTiledJSON("mapa", "/assets/mapa.json");
    this.load.image("tileSets", "assets/sprites1.png");

    // Sounds
    this.load.audio("explosion", "assets/sounds/explosion.wav");
    this.load.audio("stop", "assets/sounds/stop.wav");
    this.load.audio("walk", "assets/sounds/walk.wav");
  }

  create() {
    this.soundManager = new SoundManager(this);
    createAnimations(this);

    this.hudManager = new HudManager(this);
    this.createMap();
    this.createBlocks();
    this.enemyManager = new EnemyManager(this);

    this.enemies = this.enemyManager.enemies;

    this.playerManager = new PlayerManager(this);
    this.createRightLimit();
    this.setupControls();

    this.enemyTimer = this.time.addEvent({
      delay: ENEMY_SPAWN_DELAY,
      callback: this.enemyManager.checkNextWave,
      callbackScope: this.enemyManager,
      loop: true,
    });
  }

  createMap() {
    this.mapa = this.make.tilemap({ key: "mapa" });
  }

  createBlocks() {
    this.bloques = new Bloque(this, this.mapa, "tileSets", "solidos", {
      bloques: true,
    });
  }

  createRightLimit() {
    this.rightLimit = this.add.rectangle(
      RIGHT_LIMIT_X,
      RIGHT_LIMIT_Y,
      RIGHT_LIMIT_WIDTH,
      RIGHT_LIMIT_HEIGHT,
      0x000000,
      0,
    );
    this.physics.world.enable(this.rightLimit);
    this.rightLimit.body.setImmovable(true);
    this.rightLimit.body.setAllowGravity(false);

    this.physics.add.collider(this.playerManager.player, this.rightLimit);
    this.enemyManager.enemies.children.iterate((enemy) => {
      this.physics.add.collider(enemy, this.rightLimit);
    });
  }

  setupControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
  }

  update(time, delta) {
    if (this.lives <= 0) {
      this.scene.start("GameOverScene");
    }

    if (this.playerManager.player.alive) {
      this.playerManager.update(this.cursors, this.spaceBar);
    }
    this.enemyManager.update(time, delta);
    this.hudManager.updateLives(this.lives);
    this.hudManager.updateEnemies(
      this.totalEnemies -
        this.enemyManager.enemiesCreated +
        this.enemyManager.enemiesRemaining,
    );
  }

  handleBulletBlockCollision(bullet, tile) {
    bullet.destroy();
    this.bloques.destroyBlock(tile, bullet.direction);
  }

  balaJugadorImpactaEnElEnemigo(enemy, bullet) {
    if (enemy && bullet) {
      enemy.alive = false;
      bullet.destroy();

      enemy.setVelocity(0);
      enemy.anims.play("destruccion", true);
      this.soundManager.playExplosion();

      enemy.once("animationcomplete-destruccion", () => {
        console.log("animation complete mejuuuuuuu");
        enemy.destroy();
        this.enemyManager.enemiesRemaining--;
        if (this.enemyManager.enemiesRemaining === 0) {
          this.enemyManager.checkNextWave();
        }
      });
    }
  }

  balaEnemigoImpactaEnElJugador(player, bullet) {
    console.log("Probando player: ", player);
    // console.log("Probando bullet: ", bullet);
    if (player && bullet) {
      player.alive = false;
      this.lives--;

      bullet.destroy();

      player.setVelocity(0);
      this.soundManager.playExplosion();
      player.anims.play("destruccion", true);

      player.once("animationcomplete-destruccion", () => {
        console.log("animacion completada");
        player.setActive(false);
        player.setVisible(false);
        //player.destroy();
      });
    }
  }
}
