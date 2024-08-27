import Phaser from 'phaser';
import { PowerUp } from '../objects/PowerUp';

export class PowerUpController {
  constructor(scene) {
    this.scene = scene;
    this.powerUps = this.scene.physics.add.group(); // Un grupo para manejar los power-ups
    this.spawnInterval = 5000; // Intervalo de aparición en milisegundos (5 segundos)

    // Programar la aparición del primer power-up
    this.scene.time.addEvent({
      delay: this.spawnInterval,
      callback: this.spawnPowerUp,
      callbackScope: this,
      loop: true,
    });
  }

  spawnPowerUp() {
    // Verificar si ya hay un power-up en pantalla
    if (this.powerUps.countActive(true) > 0) {
      return; // Si ya hay un power-up activo, no crear otro
    }

    // Generar coordenadas aleatorias dentro de los límites del mundo
    const x = Phaser.Math.Between(50, this.scene.scale.width - 50);
    const y = Phaser.Math.Between(50, this.scene.scale.height - 50);

    // Seleccionar aleatoriamente un tipo de power-up (en este ejemplo, solo hay uno)
    const texture = 'tiles';
    const frame = 194; // Aquí podrías tener una lógica para seleccionar diferentes power-ups

    // Crear el power-up y añadirlo al grupo
    const powerUp = new PowerUp(this.scene, x, y, texture, frame);
    this.powerUps.add(powerUp);

    // Configurar la colisión entre el jugador y el nuevo power-up
    this.scene.physics.add.collider(
      this.scene.playerController.player,
      powerUp,
      this.handlePowerUpCollision,
      null,
      this.scene
    );
  }

  handlePowerUpCollision(player, powerUp) {
    // Aquí puedes manejar la lógica cuando el jugador recoge el power-up
    powerUp.destroy(); // Destruir el power-up cuando se recoja
    player.transformation = 'tank3';
  }

  update() {
    // Si necesitas actualizar algo en cada frame
  }
}
