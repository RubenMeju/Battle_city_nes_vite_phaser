import Phaser from "phaser";

import { Bullet } from "./Bullet.js";

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(this.scene.escalado);
    this.body.setSize(13, 13);
    this.setCollideWorldBounds(true);

    this.velocidad = 100;
    this.alive = true;

    // Dirección en la que se encuentra el jugador
    this.lastDirection = "up "; // Dirección por defecto

    // Configuración de las balas
    this.bullets = this.scene.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });
    this.maxBullets = 3; // Número máximo de balas simultáneas
    this.bulletCooldown = 300; // Tiempo en milisegundos entre disparos
    this.lastShot = 0; // Tiempo del último disparo
  }

  update(cursors, spaceBar) {
    // Inicializa las velocidades en cero
    let velocityX = 0;
    let velocityY = 0;

    // Detectar la dirección en la que el jugador se está moviendo
    if (cursors.up.isDown) {
      velocityY = -this.velocidad;
      this.lastDirection = "up";
      this.anims.play("up", true);
    } else if (cursors.down.isDown) {
      velocityY = this.velocidad;
      this.lastDirection = "down";
      this.anims.play("down", true);
    } else if (cursors.left.isDown) {
      velocityX = -this.velocidad;
      this.lastDirection = "left";
      this.anims.play("left", true);
    } else if (cursors.right.isDown) {
      velocityX = this.velocidad;
      this.lastDirection = "right";
      this.anims.play("right", true);
    } else {
      this.anims.stop();
      // Reproducir el sonido
      this.scene.stopSound.play({
        volume: 0.1,
        loop: true,
      });
    }

    // Aplica las velocidades calculadas
    this.setVelocityX(velocityX);
    this.setVelocityY(velocityY);
    // Reproducir el sonido
    this.scene.walkSound.play({
      volume: 0.1,
      loop: false,
    });
    // Manejo de disparos
    if (
      spaceBar.isDown &&
      this.scene.time.now > this.lastShot + this.bulletCooldown
    ) {
      this.shoot();
      this.lastShot = this.scene.time.now;
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
}
