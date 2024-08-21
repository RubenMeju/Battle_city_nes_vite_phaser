import Phaser from "phaser";
import { createAnimations } from "../animations.js";
import { Bloque } from "../objects/Bloque.js";
import { Player } from "../objects/Player.js";
import { Enemy } from "../objects/Enemy.js";
import { Hub } from "../objects/Hub.js";

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
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.tilemapTiledJSON("mapa", "/assets/mapa.json");
    this.load.image("tileSets", "assets/sprites1.png");

    // Sounds
    this.load.audio("explosion", "assets/sounds/explosion.wav");
    this.load.audio("stop", "assets/sounds/stop.wav");
    this.load.audio("walk", "assets/sounds/walk.wav");
  }

  create() {
    createAnimations(this);
    this.explosionSound = this.sound.add("explosion");
    this.stopSound = this.sound.add("stop");
    this.walkSound = this.sound.add("walk");

    // Crear el HUD
    this.hub = new Hub(this);

    // Crear el mapa
    this.mapa = this.make.tilemap({ key: "mapa" });

    // Instanciar la clase Bloque
    this.bloques = new Bloque(this, this.mapa, "tileSets", "solidos", {
      bloques: true,
    });

    // Crear un grupo de enemigos
    this.enemies = this.add.group({
      classType: Enemy,
      maxSize: this.totalEnemies,
      runChildUpdate: true,
    });
    this.enemies.clear(true, true);

    // Generar los primeros 3 enemigos
    this.generateEnemies(3);

    // Configurar un temporizador para generar nuevos enemigos cada 15 segundos
    this.enemyTimer = this.time.addEvent({
      delay: 15000,
      callback: this.checkNextWave,
      callbackScope: this,
      loop: true,
    });

    // Crear el jugador
    this.jugador = new Player(this, 333, 333, "tiles", 0);
    this.physics.add.collider(this.jugador, this.bloques.solidos);

    // Configurar la colisión entre las balas y los bloques
    this.physics.add.collider(
      this.jugador.bullets,
      this.bloques.solidos,
      this.handleBulletBlockCollision,
      null,
      this
    );

    // Colisión balas jugador con enemigos
    this.physics.add.collider(
      this.jugador.bullets,
      this.enemies,
      this.balaJugadorImpactaEnElEnemigo,
      null,
      this
    );

    // Añadir un área de colisión en el límite derecho
    this.rightLimit = this.add.rectangle(625, 337.5, 10, 675, 0x000000, 0);
    this.physics.world.enable(this.rightLimit);
    this.rightLimit.body.setImmovable(true);
    this.rightLimit.body.setAllowGravity(false);

    // Añadir colisiones entre el jugador, enemigos y el límite derecho
    this.physics.add.collider(this.jugador, this.rightLimit);
    this.enemies.children.iterate((enemy) => {
      this.physics.add.collider(enemy, this.rightLimit);
    });

    // Configurar los controles
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceBar = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );
  }

  update(time, delta) {
    if (this.lives <= 0) {
      this.scene.start("GameOverScene"); // Cambia a la escena de Game Over
    }

    this.jugador.update(this.cursors, this.spaceBar);

    // Actualiza la lógica de todos los enemigos
    this.enemies.children.iterate((enemy) => {
      if (enemy && enemy.active) {
        enemy.update(time, delta);
      }
    });

    // Actualización del HUD
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

      // Configurar la colisión entre las balas (ENEMIGOS) y los bloques
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
      this.generateEnemies(3);
    }
  }

  handleBulletBlockCollision(bullet, tile) {
    bullet.destroy(); // Destruye la bala al colisionar con el bloque
    this.bloques.destroyBlock(tile, bullet.direction); // Pasa la dirección del disparo
  }

  balaJugadorImpactaEnElEnemigo(enemy, bullet) {
    if (enemy) {
      enemy.alive = false;
      enemy.setVelocity(0, 0);
      bullet.setActive(false);
      bullet.setVisible(false);
      bullet.destroy();

      enemy.anims.play("destruccion", true);
      this.explosionSound.play({ volume: 0.5, loop: false });

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
