export class Hub {
  constructor(scene) {
    this.scene = scene;

    // Crear la parte gris para el HUD
    this.grayPanel = this.scene.add.rectangle(625, 0, 200, 675, 0x808080);
    this.grayPanel.setOrigin(0, 0);

    // Array para almacenar las imágenes de los enemigos
    this.enemyImages = [];

    // Vidas
    this.livesText = this.scene.add.text(
      635,
      460,
      `Lives: ${this.scene.lives}`,
      {
        fontSize: "20px",
        fill: "#fff",
      }
    );

    this.createEnemies(); // Crear los enemigos al inicio
  }

  createEnemies() {
    // Elimina las imágenes de enemigos anteriores
    this.enemyImages.forEach((image) => image.destroy());
    this.enemyImages = []; // Limpia el array de imágenes

    // Coordenadas para recortar la imagen
    const x = 320;
    const y = 192;
    const width = 9;
    const height = 8;

    // Variables para disposición de los enemigos
    const enemiesPerColumn = Math.ceil(this.scene.totalEnemies / 2);
    const startX = 360;
    const startY = 0;
    const xOffset = 28;
    const yOffset = 28;

    console.log("Total Enemies:", this.scene.totalEnemies);

    // Crear los enemigos
    for (let i = 0; i < this.scene.totalEnemies; i++) {
      const column = Math.floor(i / enemiesPerColumn);
      const row = i % enemiesPerColumn;

      const posX = startX + column * xOffset;
      const posY = startY + row * yOffset;

      const croppedImage = this.scene.add
        .image(posX, posY, "tileSets")
        .setCrop(x, y, width, height)
        .setScale(2.5);

      this.enemyImages.push(croppedImage); // Almacena la imagen
    }
  }

  updateLives(lives) {
    this.lives = lives;
    this.livesText.setText(`Lives: ${this.lives}`);
  }

  updateEnemies(totalEnemies) {
    this.scene.totalEnemies = totalEnemies; // Actualiza el total de enemigos
    this.createEnemies(); // Re-renderiza los enemigos
  }
}
