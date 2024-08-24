export class Eagle {
  constructor(scene, mapa, tilesetKey, layerName, collisionProperty) {
    this.scene = scene;
    this.mapa = mapa;

    // Cargar el tileset y crear la capa
    const tileset = this.mapa.addTilesetImage(tilesetKey);
    this.eagle = this.mapa.createLayer(layerName, tileset, 0, 0);
    this.eagle.setScale(this.scene.escalado);
    this.eagle.setCollisionByProperty(collisionProperty);
  }

  destroyEagle(tile, direction) {
    if (tile && tile.properties.eagle) {
      // Elimina el eagle en la posición actual
      this.mapa.removeTileAt(tile.x, tile.y, true, true, this.eagle);

      // Determinar los límites del eagle de 4x4 en el que se encuentra el tile
      const blockStartX = Math.floor(tile.x / 4) * 4;
      const blockStartY = Math.floor(tile.y / 4) * 4;
      const blockEndX = blockStartX + 3;
      const blockEndY = blockStartY + 3;

      // Función para eliminar eagle  en una columna dentro del eagle 4x4
      const destroyColumn = (x) => {
        for (let y = blockStartY; y <= blockEndY; y++) {
          let tileToRemove = this.mapa.getTileAt(x, y, true, this.eagle);
          if (
            tileToRemove &&
            tileToRemove.index !== -1 &&
            tileToRemove.properties.eagle
          ) {
            this.mapa.removeTileAt(x, y, true, true, this.eagle);
          }
        }
      };

      // Función para eliminar eagle  en una fila dentro del eagle 4x4
      const destroyRow = (y) => {
        for (let x = blockStartX; x <= blockEndX; x++) {
          let tileToRemove = this.mapa.getTileAt(x, y, true, this.eagle);
          if (
            tileToRemove &&
            tileToRemove.index !== -1 &&
            tileToRemove.properties.eagle
          ) {
            this.mapa.removeTileAt(x, y, true, true, this.eagle);
          }
        }
      };

      // Eliminar eagle  en la fila o columna según la dirección de la colisión dentro del eagle 4x4
      switch (direction) {
        case 'up':
        case 'down':
          destroyRow(tile.y); // Eliminar en horizontal (fila) dentro del eagle 4x4
          break;
        case 'left':
        case 'right':
          destroyColumn(tile.x); // Eliminar en vertical (columna) dentro del eagle 4x4
          break;
      }
    }
  }
}
