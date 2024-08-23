import Phaser from "phaser";

export class StartScene extends Phaser.Scene {
  constructor() {
    super({ key: "StartScene" });
  }

  preload() {
    // Aquí puedes cargar imágenes o sonidos necesarios para la pantalla de inicio
    this.load.image("titleImage", "assets/startgame.png"); // Carga una imagen de título
  }

  create() {
    // Mostrar el título del juego
    this.add
      .image(this.scale.width / 2, this.scale.height / 2 - 50, "titleImage")
      .setScale(2)
      .setOrigin(0.5);

    // Añadir una tecla de entrada para iniciar el juego
    this.input.keyboard.once("keydown-ENTER", () => {
      this.scene.start("GameScene"); // Cambia a la escena principal
    });
  }
}
