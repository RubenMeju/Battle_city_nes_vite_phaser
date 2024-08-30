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

  fortifyStrongBlocks() {
    const processedTiles = new Set(); // Set para rastrear tiles procesados

    this.solidos.forEachTile((tile) => {
      const tileKey = `${tile.x},${tile.y}`;

      // Si ya hemos procesado este tile, no hacemos nada
      if (processedTiles.has(tileKey)) {
        return;
      }

      if (tile.properties.fuerte) {
        tile.properties.destruible = false;

        const worldX = tile.getCenterX();
        const worldY = tile.getCenterY();

        // Verificar las coordenadas antes de eliminar el tile
        console.log(
          `Fortifying tile at: (${tile.x}, ${tile.y}) with world coordinates (${worldX}, ${worldY})`
        );

        // Eliminar el tile existente
        this.mapa.removeTileAt(tile.x, tile.y, true, true, this.solidos);

        // Crear un gráfico para el cuadrado
        const squareGraphics = this.scene.add.graphics();
        squareGraphics.fillStyle(0xff0000, 1); // Color rojo sólido
        squareGraphics.lineStyle(2, 0x000000, 1); // Contorno negro

        // Dibujar un cuadrado centrado en la posición del tile
        const size = 12; // Tamaño del cuadrado
        squareGraphics.fillRect(
          worldX - size / 2,
          worldY - size / 2,
          size,
          size
        );
        squareGraphics.strokeRect(
          worldX - size / 2,
          worldY - size / 2,
          size,
          size
        ); // Añadir contorno

        // Asegurarse de que el cuadrado esté en la capa correcta
        squareGraphics.setDepth(100); // Aumentar la profundidad si es necesario

        // Marcar el tile como procesado
        processedTiles.add(tileKey);
      }
    });
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
