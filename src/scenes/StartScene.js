import Phaser from 'phaser';

export class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: 'StartScene' });
  }

  preload() {
    // Cargar la imagen de título
    this.load.image('titleImage', 'assets/startgame.png');
  }

  create() {
    // Crear la imagen en una posición inicial fuera de la pantalla
    const titleImage = this.add
      .image(
        this.scale.width / 2,
        this.scale.height + 100, // Posición inicial fuera de la pantalla
        'titleImage'
      )
      .setScale(2.8)
      .setOrigin(0.5);

    // Animación para mover la imagen hacia arriba
    this.tweens.add({
      targets: titleImage,
      y: this.scale.height / 2 - 50, // Posición final de la imagen
      duration: 3000, // Duración en milisegundos
      ease: 'Sine', // Tipo de suavizado de la animación
    });

    // Añadir una tecla de entrada para iniciar el juego
    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('PreloadLevelScene'); // Cambia a la escena principal
    });
  }
}
