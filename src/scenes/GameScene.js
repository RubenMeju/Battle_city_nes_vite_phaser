import Phaser from "phaser";
import { createAnimations } from "../animations.js";
import { Bloque } from "../objects/Bloque.js";
import { Player } from "../objects/Player.js";
import { Enemy } from "../objects/Enemy.js";
import { Hub } from "../objects/Hub.js";

import {
  INITIAL_ENEMIES,
  ENEMY_SPAWN_DELAY,
  TILE_SIZE,
  RIGHT_LIMIT_X,
  RIGHT_LIMIT_Y,
  RIGHT_LIMIT_WIDTH,
  RIGHT_LIMIT_HEIGHT,
  EXPLOSION_VOLUME,
} from "../config.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });

    this.escalado = 3;
    this.maxBombas = 3;
    this.totalEnemies = 9;
    this.lives = 1;
    this.enemiesCreated = 0;
    this.enemiesRemaining = 0;
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
    this.initSounds();
    createAnimations(this);

    this.createHud();
    this.createMap();
    this.createBlocks();
    this.createEnemies();
    this.createPlayer();
    this.createRightLimit();
    this.setupControls();

    this.enemyTimer = this.time.addEvent({
      delay: ENEMY_SPAWN_DELAY,
      callback: this.checkNextWave,
      callbackScope: this,
      loop: true,
    });
  }

  initSounds() {
    this.explosionSound = this.sound.add("explosion");
    this.stopSound = this.sound.add("stop");
    this.walkSound = this.sound.add("walk");
  }

  createHud() {
    this.hub = new Hub(this);
  }

  createMap() {
    this.mapa = this.make.tilemap({ key: "mapa" });
  }

  createBlocks() {
    this.bloques = new Bloque(this, this.mapa, "tileSets", "solidos", {
      bloques: true,
    });
  }

  createEnemies() {
    this.enemies = this.add.group({
      classType: Enemy,
      maxSize: this.totalEnemies,
      runChildUpdate: true,
    });
    this.enemies.clear(true, true);
    this.generateEnemies(INITIAL_ENEMIES);
  }

  createPlayer() {
    this.jugador = new Player(this, 333, 333, "tiles", 0);
    this.physics.add.collider(this.jugador, this.bloques.solidos);

    // Configurar colisiones
    this.physics.add.collider(
      this.jugador.bullets,
      this.bloques.solidos,
      this.handleBulletBlockCollision,
      null,
      this
    );
    this.physics.add.collider(
      this.jugador.bullets,
      this.enemies,
      this.balaJugadorImpactaEnElEnemigo,
      null,
      this
    );
  }

  createRightLimit() {
    this.rightLimit = this.add.rectangle(
      RIGHT_LIMIT_X,
      RIGHT_LIMIT_Y,
      RIGHT_LIMIT_WIDTH,
      RIGHT_LIMIT_HEIGHT,
      0x000000,
      0
    );
    this.physics.world.enable(this.rightLimit);
    this.rightLimit.body.setImmovable(true);
    this.rightLimit.body.setAllowGravity(false);

    this.physics.add.collider(this.jugador, this.rightLimit);
    this.enemies.children.iterate((enemy) => {
      this.physics.add.collider(enemy, this.rightLimit);
    });
  }

  setupControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  update(time, delta) {
    if (this.lives <= 0) {
      this.scene.start("GameOverScene");
    }

    this.jugador.update(this.cursors, this.spaceBar);

    this.enemies.children.iterate((enemy) => {
      if (enemy && enemy.active) {
        enemy.update(time, delta);
      }
    });

    this.hub.updateLives(this.lives);
    this.hub.updateEnemies(
      this.totalEnemies - this.enemiesCreated + this.enemiesRemaining
    );
  }

  generateEnemies(num) {
    const enemyPositions = [
      { x: 50, y: 0 },
      { x: this.scale.width / 2, y: 0 },
      { x: this.scale.width - 200, y: 0 },
    ];

    const remainingEnemiesToCreate = this.totalEnemies - this.enemiesCreated;
    const enemiesToCreate = Math.min(num, remainingEnemiesToCreate);

    for (let i = 0; i < enemiesToCreate; i++) {
      const position = enemyPositions[i % enemyPositions.length];
      const enemy = new Enemy(this, position.x, position.y, "enemy");
      this.enemies.add(enemy);
      this.physics.add.collider(enemy, this.bloques.solidos);
      this.physics.add.collider(enemy, this.rightLimit);

      this.physics.add.collider(
        enemy.bullets,
        this.bloques.solidos,
        this.handleBulletBlockCollision,
        null,
        this
      );

      this.enemiesCreated++;
      this.enemiesRemaining++;
    }
  }

  checkNextWave() {
    if (
      this.enemiesRemaining === 0 &&
      this.enemiesCreated < this.totalEnemies
    ) {
      this.generateEnemies(INITIAL_ENEMIES);
    }
  }

  handleBulletBlockCollision(bullet, tile) {
    bullet.destroy();
    this.bloques.destroyBlock(tile, bullet.direction);
  }

  balaJugadorImpactaEnElEnemigo(enemy, bullet) {
    if (enemy) {
      enemy.alive = false;
      enemy.setVelocity(0, 0);
      bullet.setActive(false);
      bullet.setVisible(false);
      bullet.destroy();

      enemy.anims.play("destruccion", true);
      this.explosionSound.play({ volume: EXPLOSION_VOLUME, loop: false });

      enemy.once("animationcomplete-destruccion", () => {
        enemy.destroy();
        this.enemiesRemaining--;
        if (this.enemiesRemaining === 0) {
          this.checkNextWave();
        }
      });
    }
  }
}
