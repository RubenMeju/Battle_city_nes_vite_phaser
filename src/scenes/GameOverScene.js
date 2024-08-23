import Phaser from 'phaser';

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: 'GameOverScene' });
  }

  preload() {
    // Aquí puedes cargar cualquier recurso necesario para la pantalla de Game Over, como imágenes, sonidos, etc.
  }

  create() {
    // Mostrar el texto de "Game Over"
    this.add
      .text(this.scale.width / 2, this.scale.height / 2 - 50, 'Game Over', {
        fontSize: '64px',
        fill: '#ff0000'
      })
      .setOrigin(0.5);

    // Mostrar un mensaje para reiniciar o volver al menú principal
    this.add
      .text(this.scale.width / 2, this.scale.height / 2 + 20, 'Press ENTER to Restart', {
        fontSize: '32px',
        fill: '#ffffff'
      })
      .setOrigin(0.5);

    // Añadir una tecla de entrada para reiniciar el juego
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    // Opción para volver a la escena principal
    this.input.keyboard.on('keydown-ENTER', () => {
      this.scene.start('GameScene', { lives: 3 }); // Pasa las vidas al reiniciar
    });
  }
}
