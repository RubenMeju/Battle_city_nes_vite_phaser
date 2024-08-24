import { Player } from '../objects/Player.js';

export class PlayerManager {
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
      'tiles',
      0
    );

    // Obtener la referencia a los bloques sólidos desde MapManager
    const blocks = this.scene.mapManager.getBlocks();

    // Colisión entre el jugador y los bloques sólidos
    if (blocks && blocks.solidos) {
      this.scene.physics.add.collider(this.player, blocks.solidos);

      // Colisión entre las balas del jugador y los bloques sólidos
      this.scene.physics.add.collider(
        this.player.bullets,
        blocks.solidos,
        this.scene.handleBulletBlockCollision.bind(this.scene),
        null,
        this.scene
      );
    }

    // Obtener la referencia al águila
    const eagle = this.scene.mapManager.getEagle();

    // Asegúrate de que eagle no sea null
    if (eagle) {
      // Colisión entre las balas del jugador y el águila
      this.scene.physics.add.collider(
        this.player.bullets,
        eagle,
        this.scene.handleBulletEagleCollision,
        null,
        this.scene
      );
    }

    // Configuración inicial
    this.player.play('aparecer'); // Reproduce la animación de aparición
    this.scene.time.delayedCall(1500, () => {
      if (this.player.active) {
        this.player.isMoving = true;
        this.player.play('up'); // Cambia a la animación normal después de 1.5 segundos
      }
    });
  }

  update(cursors, spaceBar) {
    if (this.player.alive) {
      this.player.update(cursors, spaceBar);
    }
  }

  // Función para reiniciar al jugador
  respawnPlayer() {
    if (this.scene.lives > 0) {
      this.scene.lives--;
      this.player.setActive(true);
      this.player.setVisible(true);
      this.player.setPosition(this.initialPosition.x, this.initialPosition.y);
      this.player.setVelocity(0);
      this.player.alive = true;
      this.player.play('aparecer'); // Reproduce la animación de aparición al reaparecer
      this.scene.time.delayedCall(1500, () => {
        if (this.player.active) {
          this.player.isMoving = true;
          this.player.play('up'); // Cambia a la animación normal después de 1.5 segundos
        }
      });
    }
  }
}
