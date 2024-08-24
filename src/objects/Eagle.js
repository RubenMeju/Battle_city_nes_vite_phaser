export class Eagle {
  constructor(scene, mapa, tilesetKey, layerName, collisionProperty) {
    this.scene = scene;
    this.mapa = mapa;

    // Cargar el tileset y crear la capa
    const tileset = this.mapa.addTilesetImage(tilesetKey);
    this.eagleLayer = this.mapa.createLayer(layerName, tileset, 0, 0);
    this.eagleLayer.setScale(this.scene.escalado);
    this.eagleLayer.setCollisionByProperty(collisionProperty);

    // Hacer que el layer sea colisionable si es necesario
    this.scene.physics.world.enable(this.eagleLayer);
    this.eagleLayer.body.setImmovable(true);
    this.eagleLayer.body.setAllowGravity(false);
  }

  // Método para obtener el layer objetivo como un objeto físico
  getLayer() {
    return this.eagleLayer;
  }
}
