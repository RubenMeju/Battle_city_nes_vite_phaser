import Phaser from "phaser";
import { createAnimations } from "../animations.js";
import { Bloque } from "../objects/Bloque.js";
import { Player } from "../objects/Player.js";
import { Enemy } from "../objects/Enemy.js";
import { Hub } from "../objects/Hub.js"; // Importa la nueva clase Hub

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });

    this.escalado = 3;
    this.maxBombas = 3;
    this.maxEnemies = 3;
    this.totalEnemies = 20;
    this.lives = 5;
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
      key: "enemy",
      max: this.maxEnemies,
      runChildUpdate: true,
    });
    // Eliminar los enemigos
    this.enemies.clear(true, true);

    const enemyPositions = [
      { x: 50, y: 0 },
      { x: this.scale.width / 2, y: 0 },
      { x: this.scale.width - 200, y: 0 },
    ];

    if (this.maxEnemies > 0) {
      for (let i = 0; i < this.maxEnemies; i++) {
        const position = enemyPositions[i]; // Posición específica
        const enemy = new Enemy(this, position.x, position.y, "enemy");
        this.enemies.add(enemy); // Añadir al grupo
        this.physics.add.collider(enemy, this.bloques.solidos);

        // Configurar la colisión entre las balas (ENEMIGOS) y los bloques
        this.physics.add.collider(
          enemy.bullets,
          this.bloques.solidos,
          this.handleBulletBlockCollision,
          null,
          this
        );
      }
    }

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
    this.jugador.update(this.cursors, this.spaceBar);

    // Actualiza la lógica de todos los enemigos
    this.enemies.children.iterate((enemy) => {
      if (enemy && enemy.active) {
        enemy.update(time, delta);
      }
    });

    // Ejemplo de actualización del HUD (puedes personalizar esto según sea necesario)
    this.hub.updateLives(this.lives);
    this.hub.updateEnemies(this.totalEnemies);
  }

  handleBulletBlockCollision(bullet, tile) {
    bullet.destroy(); // Destruye la bala al colisionar con el bloque
    this.bloques.destroyBlock(tile, bullet.direction); // Pasa la dirección del disparo
  }

  balaJugadorImpactaEnElEnemigo(enemy, bullet) {
    // Reproduce la animación de destrucción del enemigo
    if (enemy) {
      console.log(enemy);
      enemy.alive = false;
      enemy.setVelocity(0, 0);
      // Desactiva y elimina la bala
      bullet.setActive(false);
      bullet.setVisible(false);
      bullet.destroy();

      enemy.anims.play("destruccion", true);
      // Reproducir el sonido
      this.explosionSound.play({
        volume: 0.5,
        loop: false,
      });
      // Elimina el enemigo después de la animación de destrucción
      enemy.once("animationcomplete-destruccion", () => {
        enemy.destroy();
        this.totalEnemies--;
      });
    }
  }
}
