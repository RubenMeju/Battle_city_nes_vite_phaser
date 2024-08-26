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
