export class Bloque {
  constructor(scene, mapa, tilesetKey, layerName, collisionProperty) {
    this.scene = scene;
    this.mapa = mapa;
    this.tilesetKey = tilesetKey;

    // Cargar el tileset y crear la capa
    const tileset = this.mapa.addTilesetImage(tilesetKey);
    this.solidos = this.mapa.createLayer(layerName, tileset, 0, 0);
    this.solidos.setScale(this.scene.escalado);
    this.solidos.setCollisionByProperty(collisionProperty);
    this.map = this.scene.make.tilemap({ key: 'mapa' });
  }

  destroyBlock(tile, direction) {
    if (tile && tile.properties.destruible) {
      // Elimina el bloque en la posición actual
      this.mapa.removeTileAt(tile.x, tile.y, true, true, this.solidos);

      // Determinar los límites del bloque de 4x4 en el que se encuentra el tile
      const blockStartX = Math.floor(tile.x / 4) * 4;
      const blockStartY = Math.floor(tile.y / 4) * 4;
      const blockEndX = blockStartX + 3;
      const blockEndY = blockStartY + 3;

      // Función para eliminar bloques en una columna dentro del bloque 4x4
      const destroyColumn = (x) => {
        for (let y = blockStartY; y <= blockEndY; y++) {
          let tileToRemove = this.mapa.getTileAt(x, y, true, this.solidos);
          if (
            tileToRemove &&
            tileToRemove.index !== -1 &&
            tileToRemove.properties.destruible
          ) {
            this.mapa.removeTileAt(x, y, true, true, this.solidos);
          }
        }
      };

      // Función para eliminar bloques en una fila dentro del bloque 4x4
      const destroyRow = (y) => {
        for (let x = blockStartX; x <= blockEndX; x++) {
          let tileToRemove = this.mapa.getTileAt(x, y, true, this.solidos);
          if (
            tileToRemove &&
            tileToRemove.index !== -1 &&
            tileToRemove.properties.destruible
          ) {
            this.mapa.removeTileAt(x, y, true, true, this.solidos);
          }
        }
      };

      // Eliminar bloques en la fila o columna según la dirección de la colisión dentro del bloque 4x4
      switch (direction) {
        case 'up':
        case 'down':
          destroyRow(tile.y); // Eliminar en horizontal (fila) dentro del bloque 4x4
          break;
        case 'left':
        case 'right':
          destroyColumn(tile.x); // Eliminar en vertical (columna) dentro del bloque 4x4
          break;
      }
    }
  }
}
