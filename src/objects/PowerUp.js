import Phaser from 'phaser';

export class PowerUp extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture, frame) {
    super(scene, x, y, texture, frame);

    // Añadir el sprite a la escena y la física
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(scene.escalado || 1); // Asegúrate de que `escalado` esté definido en la escena
    this.setCollideWorldBounds(true); // El power-up no debe salir del mundo
    this.setImmovable(true);
    this.setOffset(0, 0); // Ajusta el offset si es necesario

    // Configurar parpadeo
    this.blinking = true; // Controlar el parpadeo
    this.blinkSpeed = 500; // Tiempo en milisegundos entre parpadeos
    this.timeEvent = scene.time.addEvent({
      delay: this.blinkSpeed,
      callback: this.blink,
      callbackScope: this,
      loop: true,
    });
  }

  blink() {
    // Alternar visibilidad entre visible e invisible
    this.setVisible(!this.visible);
  }
}
