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
    solidos.forEachTile((tile) => {
      if (tile.properties.fuerte) {
        const worldX = tile.getCenterX();
        const worldY = tile.getCenterY();

        // Crear y mostrar el croppedImage
        const croppedImage = this.scene.add
          .image(worldX - 250, worldY + 215, 'tileSets')
          .setCrop(320, 16, 8, 8)
          .setScale(2);

        // Añadir física arcade al croppedImage
        this.scene.physics.add.existing(croppedImage);
        croppedImage.body.setSize(8, 6);
        croppedImage.body.setOffset(320, 15);
        croppedImage.body.setImmovable(true);
        croppedImage.body.allowGravity = false;

        // Añadir el collider
        this.scene.physics.add.collider(
          this.scene.playerController.player.bullets,
          croppedImage,
          this.collisionPlayerBulletsDefenseEagle,
          null,
          this
        );

        // Configurar el temporizador para eliminar croppedImage
        this.scene.time.delayedCall(8000, () => {
          croppedImage.destroy();
        });
      }
    });
  }

  collisionPlayerBulletsDefenseEagle(crop, bullet) {
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
