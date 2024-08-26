import Phaser from 'phaser';
import { Bullet } from './Bullet.js';

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
    this.lastDirection = 'up';
    this.isAppearing = true; // Inicialmente está en la animación de aparecer
    this.appearEndTime = 0; // Tiempo cuando la animación de aparecer debe terminar

    // Transformación inicial
    this.transformation = 'tank2';

    // Configuración de balas
    this.bullets = scene.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });
    this.maxBullets = 1;
    this.bulletCooldown = 300; // Tiempo en milisegundos entre disparos
    this.lastShot = 0;

    // Configuración inicial de sonidos
    this.walkSound = scene.sound.add('walk', { volume: 0.1, loop: false });
    this.stopSound = scene.sound.add('stop', { volume: 0.1, loop: true });

    // Iniciar la animación de "aparecer" y configurar el tiempo de finalización
    this.startAppearAnimation();
  }

  update(cursors, spaceBar) {
    if (this.isAppearing) {
      // No permitas que se ejecuten otras animaciones o acciones mientras aparece
      if (this.scene.time.now > this.appearEndTime) {
        this.isAppearing = false;
        this.playAnimation('up'); // Cambia a la animación de movimiento hacia arriba
      }
      return;
    }

    // Inicializa las velocidades en cero
    let velocityX = 0;
    let velocityY = 0;

    // Manejador de movimiento y animaciones
    if (cursors.up.isDown) {
      velocityY = -this.velocidad;
      this.lastDirection = 'up';
      this.playAnimation('up');
    } else if (cursors.down.isDown) {
      velocityY = this.velocidad;
      this.lastDirection = 'down';
      this.playAnimation('down');
    } else if (cursors.left.isDown) {
      velocityX = -this.velocidad;
      this.lastDirection = 'left';
      this.playAnimation('left');
    } else if (cursors.right.isDown) {
      velocityX = this.velocidad;
      this.lastDirection = 'right';
      this.playAnimation('right');
    } else {
      this.stopAnimation();
    }

    // Configura isMoving basado en la velocidad
    this.isMoving = velocityX !== 0 || velocityY !== 0;

    // Aplica las velocidades
    this.setVelocityX(velocityX);
    this.setVelocityY(velocityY);

    // Reproduce sonido de caminar si el jugador se mueve
    if (this.isMoving && !this.walkSound.isPlaying) {
      this.walkSound.play();
    } else if (!this.isMoving && this.walkSound.isPlaying) {
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

  shoot() {
    if (this.bullets.getLength() < this.maxBullets) {
      const bullet = this.bullets.get(this.x, this.y);
      if (bullet) {
        bullet.fire(this.x, this.y, this.lastDirection);
      }
    }
  }

  playAnimation(direction) {
    if (this.isAppearing) return; // No reproducir animaciones de movimiento mientras aparece

    const animationKey = `${this.transformation}_${direction}`;
    if (!this.anims.isPlaying || this.anims.currentAnim.key !== animationKey) {
      this.anims.play(animationKey, true);
    }
  }

  stopAnimation() {
    if (this.anims.isPlaying) {
      this.anims.stop();
      this.stopSound.play();
    }
  }

  // Método para iniciar la animación de "aparecer"
  startAppearAnimation() {
    this.isAppearing = true;
    this.anims.play('aparecer', true);

    // Configura el tiempo de finalización de la animación de "aparecer"
    this.appearEndTime = this.scene.time.now + 1500; // 1500 ms desde ahora

    // Una vez que la animación de "aparecer" termina, permite que el jugador se mueva
    this.on('animationcomplete-aparecer', () => {
      this.isAppearing = false;
      this.playAnimation('up'); // Cambia a la animación de movimiento hacia arriba
    });
  }

  // Método para cambiar la transformación
  setTransformation(newTransformation) {
    this.transformation = newTransformation;
  }
}
