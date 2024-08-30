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
        const worldX = tile.getCenterX();
        const worldY = tile.getCenterY();

        // Eliminar el tile existente
        this.mapa.removeTileAt(tile.x, tile.y, true, true, solidos);

        //console.log('worldx: ', worldX);
        //console.log('wolrdY : ', worldY);
        const croppedImage = this.scene.add
          .image(worldX - 250, worldY + 215, 'tileSets')
          .setCrop(320, 16, 8, 8)
          .setScale(2);

        // Añadir física arcade al objeto
        this.scene.physics.add.existing(croppedImage);

        croppedImage.body.setSize(4, 4);
        croppedImage.body.setOffset(320, 20);
        // Configurar el cuerpo de física Arcade
        croppedImage.body.setImmovable(true); // Hacer el cuerpo inamovible
        croppedImage.body.allowGravity = false;

        // Añadir el collider
        this.scene.physics.add.collider(
          this.scene.playerController.player.bullets,
          croppedImage,
          this.prueba,
          null,
          this
        );
        // Marcar el tile como procesado
        processedTiles.add(tileKey);
      }
    });
  }

  prueba(crop, bullet) {
    console.log('probando', bullet);
    bullet.destroy();
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
