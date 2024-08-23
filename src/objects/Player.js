import Phaser from "phaser";
import { Bullet } from "./Bullet.js";

export class Player extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(scene.escalado);
    this.body.setSize(13, 13);
    this.setCollideWorldBounds(true);

    // Configuración de propiedades del jugador
    this.velocidad = 100;
    this.alive = true;
    this.isMoving = false;
    this.lastDirection = "up";

    // Configuración de balas
    this.bullets = scene.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });
    this.maxBullets = 3;
    this.bulletCooldown = 300; // Tiempo en milisegundos entre disparos
    this.lastShot = 0;

    // Configuración inicial de sonidos
    this.walkSound = scene.sound.add("walk", { volume: 0.1, loop: false });
    this.stopSound = scene.sound.add("stop", { volume: 0.1, loop: true });
  }

  update(cursors, spaceBar) {
    // Inicializa las velocidades en cero
    let velocityX = 0;
    let velocityY = 0;

    // Manejador de movimiento y animaciones
    if (this.isMoving) {
      if (cursors.up.isDown) {
        velocityY = -this.velocidad;
        this.lastDirection = "up";
        this.playAnimation("up");
      } else if (cursors.down.isDown) {
        velocityY = this.velocidad;
        this.lastDirection = "down";
        this.playAnimation("down");
      } else if (cursors.left.isDown) {
        velocityX = -this.velocidad;
        this.lastDirection = "left";
        this.playAnimation("left");
      } else if (cursors.right.isDown) {
        velocityX = this.velocidad;
        this.lastDirection = "right";
        this.playAnimation("right");
      } else {
        this.stopAnimation();
      }

      // Aplica las velocidades
      this.setVelocityX(velocityX);
      this.setVelocityY(velocityY);

      // Reproduce sonido de caminar si el jugador se mueve
      if ((velocityX !== 0 || velocityY !== 0) && !this.walkSound.isPlaying) {
        this.walkSound.play();
      } else if (
        velocityX === 0 &&
        velocityY === 0 &&
        this.walkSound.isPlaying
      ) {
        this.walkSound.stop();
        this.stopSound.play();
      }

      // Manejo de disparos
      if (
        spaceBar.isDown &&
        this.scene.time.now > this.lastShot + this.bulletCooldown
      ) {
        this.shoot();
        this.lastShot = this.scene.time.now;
      }
    }
  }

  shoot() {
    if (this.bullets.getLength() < this.maxBullets) {
      const bullet = this.bullets.get(this.x, this.y);
      if (bullet) {
        bullet.fire(this.x, this.y, this.lastDirection);
      }
    }
  }

  playAnimation(direction) {
    if (!this.anims.isPlaying || this.anims.currentAnim.key !== direction) {
      this.anims.play(direction, true);
    }
  }

  stopAnimation() {
    if (this.anims.isPlaying) {
      this.anims.stop();
      this.stopSound.play();
    }
  }
}
