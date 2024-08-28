import Phaser from 'phaser';
import { createAnimations } from '../animations.js';
import { ENEMY_SPAWN_DELAY, INITIAL_ENEMY_COUNT } from '../config.js';
import { MapController } from '../controllers/MapController.js';
import { PlayerController } from '../controllers/PlayerController.js';
import { HudController } from '../controllers/HubController.js';
import { SoundController } from '../controllers/SoundController.js';
import { EnemyController } from '../controllers/EnemyController.js';
import { PowerUpController } from '../controllers/PowerUpController.js';

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameScene' });
    this.escalado = 3;
    this.maxBombas = 3;
    this.totalEnemies = INITIAL_ENEMY_COUNT;
    this.isGameOver = false;
    this.levelCompleted = false;
  }

  init(data) {
    this.lives = data.lives || 3;
    this.currentLevel = data.levelIndex || 0;
  }

  create() {
    if (!this.anims.get('up')) {
      createAnimations(this);
    }
    this.levelCompleted = false;

    this.soundController = new SoundController(this);
    this.hudController = new HudController(this);
    this.mapController = new MapController(this);

    // Cargar y crear el mapa del nivel actual
    this.mapController.createMap();
    this.mapController.createBlocks();
    this.mapController.createEagle();

    this.playerController = new PlayerController(this);
    this.enemyController = new EnemyController(this);
    this.enemies = this.enemyController.enemies;

    this.mapController.createRightLimit();
    this.powerUpController = new PowerUpController(this);

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
    if (this.levelCompleted) {
      return; // Evitar actualizaciones adicionales si el nivel ya está completo
    }

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

    this.playerController.player.bullets.getChildren().forEach((bullet) => {
      if (
        bullet.y < 0 ||
        bullet.y > this.game.config.height ||
        bullet.x < 0 ||
        bullet.x > this.game.config.width
      ) {
        if (bullet.active) {
          this.soundController.playBalaBorde();
          bullet.destroy();
        }
      }
    });

    this.enemyController.enemies.getChildren().forEach((enemy) => {
      enemy.bullets.getChildren().forEach((bullet) => {
        if (
          bullet.y < 0 ||
          bullet.y > this.game.config.height ||
          bullet.x < 0 ||
          bullet.x > this.game.config.width
        ) {
          if (bullet.active) {
            bullet.destroy();
          }
        }
      });
    });

    this.powerUpController.update();

    this.checkLevelCompletion();
  }

  handleGameOver() {
    if (this.lives <= 0 || this.mapController.eagle.eagleDestroyed) {
      console.log('Game Over: Deteniendo todos los sonidos');
      this.isGameOver = true;
      this.soundController.stopAllSounds();
      this.scene.start('GameOverScene');
    }
  }

  checkLevelCompletion() {
    if (this.enemyController.enemies.getLength() === 0) {
      this.levelCompleted = true;
      //  this.soundController.playPowerup(); // Reproducir sonido de nivel completado, si es necesario
      this.playerController.player.anims.stop();

      // Esperar un momento antes de cambiar de nivel para mostrar el mensaje de "nivel completado"
      this.time.delayedCall(1000, () => {
        const nextLevelIndex = this.currentLevel + 1;
        this.scene.start('PreloadLevelScene', { levelIndex: nextLevelIndex });
      });
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
}
