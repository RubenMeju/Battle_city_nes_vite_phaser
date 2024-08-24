import {
  RIGHT_LIMIT_HEIGHT,
  RIGHT_LIMIT_WIDTH,
  RIGHT_LIMIT_X,
  RIGHT_LIMIT_Y,
} from '../config';
import { Bloque } from '../objects/Bloque';

export class MapManager {
  constructor(scene) {
    this.scene = scene;
    this.map = null;
    this.blocks = null;
    this.rightLimit = null;
  }

  // Método para crear el mapa
  createMap() {
    this.map = this.scene.make.tilemap({ key: 'mapa' });
  }

  // Método para crear los bloques sólidos
  createBlocks() {
    this.blocks = new Bloque(this.scene, this.map, 'tileSets', 'solidos', {
      bloques: true,
    });
  }

  // Método para crear el límite derecho
  createRightLimit() {
    this.rightLimit = this.scene.add.rectangle(
      RIGHT_LIMIT_X,
      RIGHT_LIMIT_Y,
      RIGHT_LIMIT_WIDTH,
      RIGHT_LIMIT_HEIGHT,
      0x000000,
      0
    );
    this.scene.physics.world.enable(this.rightLimit);
    this.rightLimit.body.setImmovable(true);
    this.rightLimit.body.setAllowGravity(false);

    this.addCollisions();
  }

  // Método para agregar colisiones específicas
  addCollisions() {
    // Colisión del jugador con el límite derecho
    this.scene.physics.add.collider(
      this.scene.playerManager.player,
      this.rightLimit
    );

    // Colisión de cada enemigo con el límite derecho
    this.scene.enemyManager.enemies.children.iterate((enemy) => {
      this.scene.physics.add.collider(enemy, this.rightLimit);
    });
  }

  // Método para exponer los bloques a otros componentes
  getBlocks() {
    return this.blocks;
  }

  // Método para exponer el límite derecho a otros componentes
  getRightLimit() {
    return this.rightLimit;
  }
}
