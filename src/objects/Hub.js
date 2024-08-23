export class Hub {
  constructor(scene) {
    this.scene = scene;
    this.totalEnemies = this.scene.totalEnemies;

    this.createHud(); // Crear el HUD al inicio
    this.createEnemies(this.totalEnemies); // Crear los enemigos al inicio
  }

  createHud() {
    // Crear la parte gris para el HUD
    this.grayPanel = this.scene.add.rectangle(625, 0, 200, 675, 0x808080);
    this.grayPanel.setOrigin(0, 0);

    // Crear el texto de las vidas
    this.livesText = this.scene.add.text(
      635,
      460,
      `Lives: ${this.scene.lives}`,
      {
        fontSize: "20px",
        fill: "#fff",
      },
    );
  }

  createEnemies(enemyCount) {
    const { x, y, width, height } = this.getEnemyCropData();
    const { startX, startY, xOffset, yOffset, enemiesPerColumn } =
      this.getEnemyGridData(enemyCount);

    // Eliminar cualquier imagen de enemigos anterior
    if (this.enemyImages) {
      this.enemyImages.forEach((image) => image.destroy());
    }

    this.enemyImages = []; // Reiniciar el array de imágenes

    for (let i = 0; i < enemyCount; i++) {
      const posX = startX + Math.floor(i / enemiesPerColumn) * xOffset;
      const posY = startY + (i % enemiesPerColumn) * yOffset;

      const croppedImage = this.scene.add
        .image(posX, posY, "tileSets")
        .setCrop(x, y, width, height)
        .setScale(2.5);

      this.enemyImages.push(croppedImage); // Almacenar la imagen
    }
  }

  getEnemyCropData() {
    return {
      x: 320,
      y: 192,
      width: 9,
      height: 8,
    };
  }

  getEnemyGridData(enemyCount) {
    const enemiesPerColumn = Math.ceil(enemyCount / 2);
    return {
      startX: 360,
      startY: 0,
      xOffset: 28,
      yOffset: 28,
      enemiesPerColumn,
    };
  }

  updateLives(lives) {
    this.lives = lives;
    this.livesText.setText(`Lives: ${this.lives}`);
  }

  updateEnemies(totalEnemies) {
    this.totalEnemies = totalEnemies;
    this.createEnemies(this.totalEnemies); // Actualizar las imágenes de los enemigos
  }
}
