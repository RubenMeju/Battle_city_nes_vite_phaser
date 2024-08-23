import { Player } from "../objects/Player.js";

export class PlayerManager {
  constructor(scene) {
    this.scene = scene;
    this.createPlayer();
  }

  createPlayer() {
    this.player = new Player(this.scene, 220, 650, "tiles", 0);
    this.scene.physics.add.collider(this.player, this.scene.bloques.solidos);

    // Configurar colisiones
    this.scene.physics.add.collider(
      this.player.bullets,
      this.scene.bloques.solidos,
      this.scene.handleBulletBlockCollision,
      null,
      this.scene,
    );
    this.scene.physics.add.collider(
      this.player.bullets,
      this.scene.enemies,
      this.scene.balaJugadorImpactaEnElEnemigo,
      null,
      this.scene,
    );

    this.scene.physics.add.collider(
      this.player,
      this.scene.enemyManager.enemies.children
        .getArray()
        .flatMap((enemy) => enemy.bullets),
      this.scene.balaEnemigoImpactaEnElJugador,
      null,
      this.scene,
    );

    // Configuración inicial
    this.player.play("aparecer"); // Reproduce la animación de aparición
    this.scene.time.delayedCall(1500, () => {
      if (this.player.active) {
        this.player.play("down"); // Cambia a la animación normal después de 3 segundos
      }
    });
  }

  update(cursors, spaceBar) {
    if (this.player.alive) {
      this.player.update(cursors, spaceBar);
    }
  }
}
