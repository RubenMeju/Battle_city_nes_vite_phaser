export class Hub {
  constructor(scene) {
    this.scene = scene;
    this.totalEnemies = this.scene.totalEnemies;
    this.enemyImages = []; // Array para almacenar las imágenes de los enemigos

    this.createHud(); // Crear el HUD al inicio
    this.createEnemies(); // Crear los enemigos al inicio
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
      }
    );
  }

  createEnemies() {
    const { x, y, width, height } = this.getEnemyCropData(); // Obtener datos de recorte
    const { startX, startY, xOffset, yOffset, enemiesPerColumn } =
      this.getEnemyGridData(); // Obtener datos de la cuadrícula

    // Crear o actualizar las imágenes de los enemigos
    for (let i = 0; i < this.totalEnemies; i++) {
      if (i < this.enemyImages.length) {
        // Si ya existe una imagen para este enemigo, simplemente actualiza su posición
        const enemyImage = this.enemyImages[i];
        const posX = startX + Math.floor(i / enemiesPerColumn) * xOffset;
        const posY = startY + (i % enemiesPerColumn) * yOffset;

        enemyImage.setPosition(posX, posY);
      } else {
        // Si no existe una imagen para este enemigo, créala
        const posX = startX + Math.floor(i / enemiesPerColumn) * xOffset;
        const posY = startY + (i % enemiesPerColumn) * yOffset;

        const croppedImage = this.scene.add
          .image(posX, posY, "tileSets")
          .setCrop(x, y, width, height)
          .setScale(2.5);

        this.enemyImages.push(croppedImage); // Almacena la imagen
      }
    }

    // Eliminar imágenes si hay más imágenes que enemigos
    while (this.enemyImages.length > this.totalEnemies) {
      const imageToRemove = this.enemyImages.pop();
      imageToRemove.destroy();
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

  getEnemyGridData() {
    const enemiesPerColumn = Math.ceil(this.totalEnemies / 2);
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
    this.totalEnemies = totalEnemies; // Actualiza el total de enemigos
    this.createEnemies(); // Actualiza las imágenes de los enemigos
  }
}
