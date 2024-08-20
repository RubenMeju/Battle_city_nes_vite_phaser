import Phaser from "phaser";

import { Bullet } from "./Bullet.js";

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(this.scene.escalado);
    this.body.setSize(15, 15);
    this.body.setOffset(0, 0); // Ajusta el offset para centrar el cuerpo de colisión

    this.setCollideWorldBounds(true);

    this.velocidad = 100;
    this.alive = true;
    this.direction = "right"; // Dirección inicial
    this.moveTime = 2000; // Tiempo en milisegundos antes de cambiar de dirección
    this.lastMoveTime = 0; // Tiempo del último cambio de dirección

    // Configuración de las balas
    this.bullets = this.scene.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });
    this.maxBullets = 1; // Número máximo de balas simultáneas
    this.bulletCooldown = 300; // Tiempo en milisegundos entre disparos
    this.lastShot = 0; // Tiempo del último disparo

    // Inicializa la dirección aleatoriamente
    this.setRandomDirection();
  }

  setRandomDirection() {
    const directions = ["up", "down", "left", "right"];
    this.direction = directions[Phaser.Math.Between(0, directions.length - 1)];
    this.lastDirection = this.direction;
  }

  update(time) {
    if (this.alive) {
      this.movement(time);
    }
  }

  movement(time) {
    // Cambio de dirección después de un intervalo de tiempo
    if (time - this.lastMoveTime > this.moveTime) {
      this.setRandomDirection();
      // this.shoot();
      this.lastMoveTime = time;
    }

    // Mover al enemigo en la dirección actual
    switch (this.direction) {
      case "up":
        this.setVelocityY(-this.velocidad);
        this.setVelocityX(0);
        this.anims.play("up_enemy", true);
        break;
      case "down":
        this.setVelocityY(this.velocidad);
        this.setVelocityX(0);
        this.anims.play("down_enemy", true);
        break;
      case "left":
        this.setVelocityX(-this.velocidad);
        this.setVelocityY(0);
        this.anims.play("left_enemy", true);
        break;
      case "right":
        this.setVelocityX(this.velocidad);
        this.setVelocityY(0);
        this.anims.play("right_enemy", true);
        break;
    }

    // Detecta colisiones y cambia de dirección si es necesario
    if (
      this.body.blocked.left ||
      this.body.blocked.right ||
      this.body.blocked.up ||
      this.body.blocked.down
    ) {
      this.setRandomDirection();
    }
  }
  shoot() {
    if (this.bullets.getChildren().length < this.maxBullets) {
      const bullet = this.bullets.get(this.x, this.y);
      if (bullet) {
        bullet.fire(this.x, this.y, this.lastDirection);
      }
    }
  }

  destruir() {
    console.log("destruir al enemigo");
  }
}
