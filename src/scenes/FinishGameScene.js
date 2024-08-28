import Phaser from 'phaser';

export class FinishGameScene extends Phaser.Scene {
  constructor() {
    super({ key: 'FinishGameScene' });
  }

  preload() {
    // Aquí puedes cargar cualquier recurso necesario para la pantalla de Game Over, como imágenes, sonidos, etc.
  }

  create() {
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 50,
        'Has Completado todos los niveles!!!',
        {
          fontSize: '32px',
          fill: '#ff0000',
        }
      )
      .setOrigin(0.5);

    // Mostrar un mensaje para reiniciar o volver al menú principal
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 20,
        'Press ENTER to Restart',
        {
          fontSize: '32px',
          fill: '#ffffff',
        }
      )
      .setOrigin(0.5);

    // Añadir una tecla de entrada para reiniciar el juego
    this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ENTER);
    // Opción para volver a la escena principal
    this.input.keyboard.on('keydown-ENTER', () => {
      this.scene.start('StartScene', { lives: 3 }); // Pasa las vidas al reiniciar
    });
  }
}
