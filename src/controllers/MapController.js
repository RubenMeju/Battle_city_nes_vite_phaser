import {
  RIGHT_LIMIT_HEIGHT,
  RIGHT_LIMIT_WIDTH,
  RIGHT_LIMIT_X,
  RIGHT_LIMIT_Y,
} from '../config';
import { Bloque } from '../objects/Bloque';
import { Eagle } from '../objects/Eagle';

export class MapController {
  constructor(scene) {
    this.scene = scene;
    this.map = null;
    this.blocks = null;
    this.eagle = null;
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

  // Método para crear los objetivos
  createEagle() {
    this.eagle = new Eagle(this.scene, this.map, 'tileSets', 'objetivo', {
      aguila: true,
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
      this.scene.playerController.player,
      this.rightLimit
    );

    // Colisión de cada enemigo con el límite derecho
    this.scene.enemyController.enemies.children.iterate((enemy) => {
      this.scene.physics.add.collider(enemy, this.rightLimit);
    });
  }

  // Método para activar la fortificación de los bloques fuertes
  fortifyEagle() {
    if (this.eagle) {
      this.eagle.fortifyDefenseEagle(this.blocks.solidos);
    }
  }

  // Método para exponer los bloques a otros componentes
  getBlocks() {
    return this.blocks;
  }

  // Método para exponer el límite derecho a otros componentes
  getRightLimit() {
    return this.rightLimit;
  }

  // Método para obtener el layer de águila
  getEagle() {
    return this.eagle;
  }
}
