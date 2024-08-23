import Phaser from "phaser";
import { createAnimations } from "../animations.js";
import { PlayerManager } from "../managers/PlayerManager.js";
import { EnemyManager } from "../managers/EnemyManager.js";
import { HudManager } from "../managers/HubManager.js";
import { SoundManager } from "../managers/SoundManager.js";
import { MapManager } from "../managers/MapManager.js";
import { ENEMY_SPAWN_DELAY, TILE_SIZE } from "../config.js";

const INITIAL_LIVES = 3;
const INITIAL_ENEMY_COUNT = 9;

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });
    this.escalado = 3;
    this.maxBombas = 3;
    this.totalEnemies = INITIAL_ENEMY_COUNT;
    this.lives = INITIAL_LIVES;
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
    this.mapManager = new MapManager(this); // Crea una instancia de MapManager

    this.mapManager.createMap();
    this.mapManager.createBlocks();
    this.playerManager = new PlayerManager(this);
    this.enemyManager = new EnemyManager(this);
    this.enemies = this.enemyManager.enemies;

    this.mapManager.createRightLimit();
    this.setupControls();
    this.setupEnemyTimer();
  }

  setupControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE,
    );
  }

  setupEnemyTimer() {
    this.enemyTimer = this.time.addEvent({
      delay: ENEMY_SPAWN_DELAY,
      callback: this.enemyManager.checkNextWave,
      callbackScope: this.enemyManager,
      loop: true,
    });
  }

  update(time, delta) {
    this.handleGameOver();
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

  handleGameOver() {
    if (this.lives <= 0) {
      this.scene.start("GameOverScene");
    }
  }

  handleBulletBlockCollision(bullet, tile) {
    bullet.destroy();
    this.mapManager.getBlocks().destroyBlock(tile, bullet.direction);
  }
}
