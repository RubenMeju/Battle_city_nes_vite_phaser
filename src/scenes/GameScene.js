import Phaser from "phaser";

import { createAnimations } from "../animations.js";
import { Bloque } from "../objects/Bloque.js";
import { Player } from "../objects/Player.js";
import { Enemy } from "../objects/Enemy.js";

export class GameScene extends Phaser.Scene {
  constructor() {
    super({ key: "GameScene" });

    this.escalado = 3;
    this.maxBombas = 3;
    this.maxEnemies = 2;
  }
  preload() {
    this.load.spritesheet("tiles", "assets/sprites1.png", {
      frameWidth: 16,
      frameHeight: 16,
    });

    this.load.tilemapTiledJSON("mapa", "/assets/mapa.json");
    this.load.image("tileSets", "assets/sprites1.png");
  }

  create() {
    createAnimations(this);

    // Crear el mapa
    this.mapa = this.make.tilemap({ key: "mapa" });

    // Instanciar la clase Bloque
    this.bloques = new Bloque(this, this.mapa, "tileSets", "solidos", {
      bloques: true,
    });

    // const tileset = this.mapa.addTilesetImage("tileSets");

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

    // Crear un grupo de enemigos
    this.enemies = this.add.group({
      classType: Enemy,
      key: "enemy",
      max: this.maxEnemies,
      runChildUpdate: true,
    });

    // Rellenar el grupo con enemigos
    for (let i = 0; i < this.maxEnemies; i++) {
      // Calcula posiciones aleatorias o utiliza una posición predefinida
      const x = Phaser.Math.Between(100, 700);
      const y = Phaser.Math.Between(100, 500);
      const enemy = this.enemies.get(x, y, "enemy");

      if (enemy) {
        //  enemy.setScale(1); // Ajusta el tamaño si es necesario
        this.physics.add.collider(enemy, this.bloques.solidos);
      }
    }

    // Configuración de las colisiones entre enemigos y otros objetos
    this.physics.add.collider(this.enemies, this.bloques.solidos);

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
  }

  handleBulletBlockCollision(bullet, tile) {
    bullet.destroy(); // Destruye la bala al colisionar con el bloque
    this.bloques.destroyBlock(tile, bullet.direction); // Pasa la dirección del disparo
  }
}
