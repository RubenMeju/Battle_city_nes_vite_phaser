import Phaser from 'phaser';
import { createAnimations } from '../animations.js';

import {
  ENEMY_SPAWN_DELAY,
  INITIAL_ENEMY_COUNT,
  TILE_SIZE,
} from '../config.js';
import { PowerUp } from '../objects/PowerUp.js';
import { MapController } from '../controllers/MapController.js';
import { PlayerController } from '../controllers/PlayerController.js';
import { HudController } from '../controllers/HubController.js';
import { SoundController } from '../controllers/SoundController.js';
import { EnemyController } from '../controllers/EnemyController.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.escalado = 3;
    this.maxBombas = 3;
    this.totalEnemies = INITIAL_ENEMY_COUNT;
  }
  init(data) {
    this.lives = data.lives || 1;
  }
  preload() {
    this.load.spritesheet('tiles', 'assets/sprites1.png', {
      frameWidth: TILE_SIZE,
      frameHeight: TILE_SIZE,
    });

    this.load.tilemapTiledJSON('mapa', '/assets/mapa.json');
    this.load.image('tileSets', 'assets/sprites1.png');

    // Sounds
    this.load.audio('explosion', 'assets/sounds/explosion.wav');
    this.load.audio('stop', 'assets/sounds/stop.wav');
    this.load.audio('walk', 'assets/sounds/walk.wav');
  }

  create() {
    this.soundController = new SoundController(this);
    if (!this.anims.get('up')) {
      createAnimations(this);
    }
    this.hudController = new HudController(this);
    this.mapController = new MapController(this); // Crea una instancia de mapController

    this.mapController.createMap();
    this.mapController.createBlocks();
    this.mapController.createEagle();

    this.playerController = new PlayerController(this);
    this.enemyController = new EnemyController(this);
    this.enemies = this.enemyController.enemies;

    this.mapController.createRightLimit();

    // PowerUp
    this.powerUp = new PowerUp(this, 220, 300, 'tiles', 194);
    // Configurar la colisión entre el jugador y el power-up
    this.physics.add.collider(
      this.playerController.player,
      this.powerUp,
      this.handlePowerUpCollision,
      null,
      this
    );

    this.setupControls();
    this.setupEnemyTimer();
  }

  setupControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  setupEnemyTimer() {
    this.enemyTimer = this.time.addEvent({
      delay: ENEMY_SPAWN_DELAY,
      callback: this.enemyController.checkNextWave,
      callbackScope: this.enemyController,
      loop: true,
    });
  }

  update(time, delta) {
    this.handleGameOver();

    if (this.playerController.player.alive) {
      this.playerController.update(this.cursors, this.spaceBar);
    }

    this.enemyController.update(time, delta);
    this.hudController.updateLives(this.lives);
    this.hudController.updateEnemies(
      this.totalEnemies -
        this.enemyController.enemiesCreated +
        this.enemyController.enemiesRemaining
    );

    // Manejo de balas
    this.playerController.player.bullets.getChildren().forEach((bullet) => {
      if (
        bullet.y < 0 ||
        bullet.y > this.game.config.height ||
        bullet.x < 0 ||
        bullet.x > 625
      ) {
        // Solo destruye la bala si está activa
        if (bullet.active) {
          bullet.destroy();
        }
      }
    });
  }

  handleGameOver() {
    if (this.lives <= 0 || this.mapController.eagle.eagleDestroyed) {
      this.scene.start('GameOverScene');
    }
  }

  handleBulletBlockCollision(bullet, tile) {
    bullet.destroyBullet();
    this.mapController.getBlocks().destroyBlock(tile, bullet.direction);
  }

  handleBulletEagleCollision(bullet, tile) {
    bullet.destroyBullet();
    this.mapController.getEagle().destroyEagle(tile);
  }

  handlePowerUpCollision(player, item) {
    console.log('has cogido el item', item);
    item.destroy();

    player.transformation = 'tank3';
  }
}
