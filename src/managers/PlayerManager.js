import { Player } from "../objects/Player.js";

export class PlayerManager {
  constructor(scene) {
    this.scene = scene;
    this.createPlayer();
  }

  createPlayer() {
    this.player = new Player(this.scene, 333, 333, "tiles", 0);
    this.scene.physics.add.collider(this.player, this.scene.bloques.solidos);

    // Configurar colisiones
    this.scene.physics.add.collider(
      this.player.bullets,
      this.scene.bloques.solidos,
      this.scene.handleBulletBlockCollision,
      null,
      this.scene
    );
    this.scene.physics.add.collider(
      this.player.bullets,
      this.scene.enemies,
      this.scene.balaJugadorImpactaEnElEnemigo,
      null,
      this.scene
    );
  }

  update(cursors, spaceBar) {
    this.player.update(cursors, spaceBar);
  }
}
