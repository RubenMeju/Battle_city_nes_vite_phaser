export class Eagle {
  constructor(scene, mapa, tilesetKey, layerName, collisionProperty) {
    this.scene = scene;
    this.mapa = mapa;
    this.eagleDestroyed = false;

    // Cargar el tileset y crear la capa
    const tileset = this.mapa.addTilesetImage(tilesetKey);
    this.objetivo = this.mapa.createLayer(layerName, tileset, 0, 0);
    this.objetivo.setScale(this.scene.escalado);
    this.objetivo.setCollisionByProperty(collisionProperty);

    // Filtra los tiles para que solo se dibujen los que tengan la propiedad `aguila: true`
    this.objetivo.forEachTile((tile) => {
      if (!tile.properties.aguila) {
        this.objetivo.removeTileAt(tile.x, tile.y, true, true, this.objetivo);
      }
    });
  }

  fortifyDefenseEagle(solidos) {
    const processedTiles = new Set(); // Set para rastrear tiles procesados

    solidos.forEachTile((tile) => {
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
        this.mapa.removeTileAt(tile.x, tile.y, true, true, solidos);

        // Crear un gráfico para el cuadrado
        const squareGraphics = this.scene.add.graphics();
        squareGraphics.fillStyle(0xffffff, 1); // Color blanco sólido
        squareGraphics.lineStyle(4, 0xa9a9a9, 1); // Contorno plateado

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

  destroyEagle() {
    let eagleTiles = this.objetivo.filterTiles(
      (tile) => tile.properties.aguila
    );

    if (eagleTiles.length > 0) {
      eagleTiles.forEach((tile) => {
        this.objetivo.removeTileAt(tile.x, tile.y, true, true, this.objetivo);
      });

      console.log('Todos los tiles del águila han sido destruidos');
      this.eagleDestroyed = true;
    } else {
      console.error('No se encontraron tiles del águila');
    }
  }
}
