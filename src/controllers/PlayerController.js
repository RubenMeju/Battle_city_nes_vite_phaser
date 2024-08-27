import { Player } from '../objects/Player.js';

export class PlayerController {
  constructor(scene) {
    this.scene = scene;
    this.initialPosition = { x: 220, y: 650 }; // Posición inicial
    this.createPlayer();
  }

  createPlayer() {
    this.player = new Player(
      this.scene,
      this.initialPosition.x,
      this.initialPosition.y,
      'tiles'
    );

    this.setupCollisions();
    this.initializePlayer();
  }

  setupCollisions() {
    const blocks = this.scene.mapController.getBlocks();
    const eagle = this.scene.mapController.getEagle();

    // Colisión entre el jugador y los bloques sólidos
    if (blocks?.solidos) {
      this.scene.physics.add.collider(this.player, blocks.solidos);
      this.scene.physics.add.collider(
        this.player.bullets,
        blocks.solidos,
        this.scene.handleBulletBlockCollision.bind(this.scene)
      );
    }

    // Colisión entre el jugador y el águila
    if (eagle?.objetivo) {
      this.scene.physics.add.collider(this.player, eagle.objetivo);
      this.scene.physics.add.collider(
        this.player.bullets,
        eagle.objetivo,
        this.scene.handleBulletEagleCollision.bind(this.scene)
      );
    }
  }

  initializePlayer() {
    this.player.play('aparecer'); // Reproduce la animación de aparición
    this.scene.time.delayedCall(1500, () => {
      if (this.player.active) {
        this.player.isMoving = true;
      }
    });
  }

  update(cursors, spaceBar) {
    if (this.player.alive) {
      this.player.update(cursors, spaceBar);
    }
  }

  respawnPlayer() {
    if (this.scene.lives > 0) {
      this.scene.lives--;
      this.player
        .setActive(true)
        .setVisible(true)
        .setPosition(this.initialPosition.x, this.initialPosition.y)
        .setVelocity(0);
      this.player.alive = true;
      this.player.play('aparecer'); // Reproduce la animación de aparición al reaparecer

      this.scene.time.delayedCall(1500, () => {
        if (this.player.active) {
          this.player.isMoving = true;
        }
      });
    }
  }
}
