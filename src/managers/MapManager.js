import {
  RIGHT_LIMIT_HEIGHT,
  RIGHT_LIMIT_WIDTH,
  RIGHT_LIMIT_X,
  RIGHT_LIMIT_Y,
} from "../config";
import { Bloque } from "../objects/Bloque";

export class MapManager {
  constructor(scene) {
    this.scene = scene;
    this.map = null;
    this.blocks = null;
    this.rightLimit = null;
  }

  createMap() {
    this.map = this.scene.make.tilemap({ key: "mapa" });
  }

  createBlocks() {
    this.blocks = new Bloque(this.scene, this.map, "tileSets", "solidos", {
      bloques: true,
    });
  }

  createRightLimit() {
    this.rightLimit = this.scene.add.rectangle(
      RIGHT_LIMIT_X,
      RIGHT_LIMIT_Y,
      RIGHT_LIMIT_WIDTH,
      RIGHT_LIMIT_HEIGHT,
      0x000000,
      0,
    );
    this.scene.physics.world.enable(this.rightLimit);
    this.rightLimit.body.setImmovable(true);
    this.rightLimit.body.setAllowGravity(false);

    this.scene.physics.add.collider(
      this.scene.playerManager.player,
      this.rightLimit,
    );
    this.scene.enemyManager.enemies.children.iterate((enemy) => {
      this.scene.physics.add.collider(enemy, this.rightLimit);
    });
  }

  // Exponer bloques para que puedan ser accedidos desde otros lugares
  getBlocks() {
    return this.blocks;
  }
}
