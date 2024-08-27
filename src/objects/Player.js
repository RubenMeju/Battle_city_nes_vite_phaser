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

    // Transformaciones posibles
    this.transformations = ['tank1', 'tank2', 'tank3', 'tank4'];
    this.currentTransformationIndex = 0;
    this.transformation = this.transformations[this.currentTransformationIndex];

    // Configuración de balas
    this.bullets = scene.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });
    this.bulletCooldown = 300; // Tiempo en milisegundos entre disparos
    this.lastShot = 0;

    // Definir el comportamiento de las balas para cada transformación
    this.bulletBehaviors = {
      tank1: { maxBullets: 1, fireInterval: 0 },
      tank2: { maxBullets: 2, fireInterval: 1000 },
      tank3: { maxBullets: 3, fireInterval: 500 },
      tank4: { maxBullets: 4, fireInterval: 250 },
    };

    // Iniciar la animación de "aparecer"
    this.startAppearAnimation();

    // Agregar propiedades relacionadas con los Power-Ups
    this.invulnerable = false;
    this.freezeDuration = 0; // Para manejar la duración del congelamiento de enemigos
  }

  update(cursors, spaceBar) {
    if (this.isAppearing) {
      if (this.scene.time.now > this.appearEndTime) {
        this.isAppearing = false;
        this.playAnimation('up'); // Cambia a la animación de movimiento hacia arriba
      }
      return;
    }

    let velocityX = 0;
    let velocityY = 0;

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

    this.isMoving = velocityX !== 0 || velocityY !== 0;

    this.setVelocityX(velocityX);
    this.setVelocityY(velocityY);

    if (this.isMoving) {
      this.scene.soundController.playWalk();
    } else {
      this.scene.soundController.stopWalk();
    }

    if (spaceBar.isDown) {
      const bulletBehavior = this.bulletBehaviors[this.transformation];
      if (
        bulletBehavior &&
        this.scene.time.now > this.lastShot + bulletBehavior.fireInterval
      ) {
        this.shoot();
        this.lastShot = this.scene.time.now;
      }
    }
  }

  shoot() {
    const bulletBehavior = this.bulletBehaviors[this.transformation];
    if (
      bulletBehavior &&
      this.bullets.getLength() < bulletBehavior.maxBullets
    ) {
      const bullet = this.bullets.get(this.x, this.y);
      if (bullet) {
        bullet.fire(this.x, this.y, this.lastDirection);
      }
    }
  }

  playAnimation(direction) {
    if (this.isAppearing) return;

    const animationKey = `${this.transformation}_${direction}`;
    if (!this.anims.isPlaying || this.anims.currentAnim.key !== animationKey) {
      this.anims.play(animationKey, true);
    }
  }

  stopAnimation() {
    if (this.anims.isPlaying) {
      this.anims.stop();
      this.scene.soundController.stopWalk();
    }
  }

  startAppearAnimation() {
    this.isAppearing = true;
    this.anims.play('aparecer', true);

    this.appearEndTime = this.scene.time.now + 1500;

    this.on('animationcomplete-aparecer', () => {
      this.isAppearing = false;
      this.playAnimation('up');
    });
  }

  setTransformation(newTransformation) {
    if (this.transformations.includes(newTransformation)) {
      this.transformation = newTransformation;
      const bulletBehavior = this.bulletBehaviors[newTransformation];
      if (bulletBehavior) {
        this.maxBullets = bulletBehavior.maxBullets;
        this.bulletCooldown = bulletBehavior.fireInterval;
      }
    } else {
      console.warn(
        `Bullet behavior not defined for transformation: ${newTransformation}`
      );
      this.maxBullets = 1;
    }
  }

  upgradeTransformation() {
    if (this.currentTransformationIndex < this.transformations.length - 1) {
      this.currentTransformationIndex++;
      this.transformation =
        this.transformations[this.currentTransformationIndex];
    }
  }

  activateInvulnerability(duration = 5000) {
    this.invulnerable = true;
    this.setTint(0xffd700); // Cambiar color a dorado para indicar invulnerabilidad
    this.scene.time.delayedCall(duration, () => {
      this.invulnerable = false;
      this.clearTint();
    });
  }

  destroyAllEnemies() {
    this.scene.enemies.getChildren().forEach((enemy) => enemy.destroy());
  }

  freezeEnemies(duration = 5000) {
    this.scene.enemies
      .getChildren()
      .forEach((enemy) => (enemy.body.moves = false));

    this.scene.time.delayedCall(duration, () => {
      this.scene.enemies
        .getChildren()
        .forEach((enemy) => (enemy.body.moves = true));
    });
  }

  gainExtraLife() {
    this.scene.lives++;
  }

  fortifyEagle() {
    console.log('Mejorar las defensas del águila');
    // Implementa la lógica para mejorar las defensas del águila
  }
}
