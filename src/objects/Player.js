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

    // Transformaciones posibles
    this.transformations = ['tank1', 'tank2', 'tank3', 'tank4'];

    // Iniciar en la primera transformación (tank1)
    this.currentTransformationIndex = 0;
    this.transformation = this.transformations[this.currentTransformationIndex];

    // Configuración de balas
    this.bullets = scene.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });
    this.bulletCooldown = 300; // Tiempo en milisegundos entre disparos
    this.lastShot = 0;

    // Configuración inicial de sonidos
    this.walkSound = scene.sound.add('walk', { volume: 0.1, loop: false });
    this.stopSound = scene.sound.add('stop', { volume: 0.1, loop: true });

    // Definir el comportamiento de las balas para cada transformación
    this.bulletBehaviors = {
      tank1: {
        maxBullets: 1,
        fireInterval: 0, // Sin intervalo adicional, solo una bala a la vez
      },
      tank2: {
        maxBullets: 2,
        fireInterval: 1000, // 1 segundo de intervalo entre disparos
      },
      tank3: {
        maxBullets: 3,
        fireInterval: 500, // 500 ms de intervalo entre disparos
      },
      tank4: {
        maxBullets: 4,
        fireInterval: 250, // 500 ms de intervalo entre disparos
      },
    };

    // Iniciar la animación de "aparecer" y configurar el tiempo de finalización
    this.startAppearAnimation();

    // Agregar propiedades relacionadas con los Power-Ups
    this.invulnerable = false;
    this.freezeDuration = 0; // Para manejar la duración del congelamiento de enemigos
  }

  update(cursors, spaceBar) {
    if (this.isAppearing) {
      // No permite que se ejecuten otras animaciones o acciones mientras aparece
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
    if (spaceBar.isDown) {
      const bulletBehavior = this.bulletBehaviors[this.transformation];
      if (bulletBehavior) {
        // Permitir disparar balas según el comportamiento de la transformación
        if (this.scene.time.now > this.lastShot + bulletBehavior.fireInterval) {
          this.shoot();
          this.lastShot = this.scene.time.now; // Actualiza el último tiempo de disparo
        }
      }
    }
  }

  shoot() {
    const bulletBehavior = this.bulletBehaviors[this.transformation];
    if (bulletBehavior) {
      // Comprobar cuántas balas se pueden disparar
      if (this.bullets.getLength() < bulletBehavior.maxBullets) {
        // Disparar una bala y manejar el intervalo de disparo
        const bullet = this.bullets.get(this.x, this.y);
        if (bullet) {
          bullet.fire(this.x, this.y, this.lastDirection);
        }
      }
    } else {
      console.log(
        `No bullet behavior defined for transformation: ${this.transformation}`
      );
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
    const bulletBehavior = this.bulletBehaviors[newTransformation];
    if (bulletBehavior) {
      this.maxBullets = bulletBehavior.maxBullets;
      this.bulletCooldown = bulletBehavior.fireInterval; // Configura el intervalo de disparo
    } else {
      // Maneja el caso donde no hay comportamiento definido para la transformación
      console.warn(
        `Bullet behavior not defined for transformation: ${newTransformation}`
      );
      this.maxBullets = 1; // Valor predeterminado si no se encuentra el comportamiento
    }
  }

  // POWER UPS
  // Método para incrementar la transformación(EStrella)
  upgradeTransformation() {
    if (this.currentTransformationIndex < this.transformations.length - 1) {
      this.currentTransformationIndex++;
      this.transformation =
        this.transformations[this.currentTransformationIndex];
    }
  }

  // Power-Up: Hacer al jugador invulnerable (Casco)
  activateInvulnerability(duration = 5000) {
    console.log('jugador invulnerable');
    this.invulnerable = true;
    this.setTint(0xffd700); // Cambiar color a dorado para indicar invulnerabilidad
    this.scene.time.delayedCall(duration, () => {
      this.invulnerable = false;
      this.clearTint(); // Restaurar color original
    });
  }

  // Power-Up: Destruir todos los enemigos en pantalla (Granada)
  destroyAllEnemies() {
    console.log('destruir a todos los enemigos');
    this.scene.enemies.getChildren().forEach((enemy) => {
      enemy.destroy();
    });
  }

  // Power-Up: Congelar a todos los enemigos (Reloj)
  freezeEnemies(duration = 5000) {
    console.log('detener a los enemigos durante 5 segundos');
    this.scene.enemies.getChildren().forEach((enemy) => {
      enemy.body.moves = false; // Detener movimiento
    });

    // Después de la duración, descongelar a los enemigos
    this.scene.time.delayedCall(duration, () => {
      this.scene.enemies.getChildren().forEach((enemy) => {
        enemy.body.moves = true;
      });
    });
  }

  // Power-Up: Vidas extra (Vida)
  gainExtraLife() {
    console.log('Has conseguido una vida');
    this.scene.lives++;
  }

  // Power-Up: Mejorar las defensas del Águila (Pala)
  fortifyEagle() {
    console.log('mejorar las defensas del aguila');
  }
}
