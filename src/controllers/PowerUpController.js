import Phaser from 'phaser';
import { PowerUp } from '../objects/PowerUp';
import { powerUpEffects } from '../powerUpEffects';

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

    const texture = 'tiles';
    const frame = Phaser.Math.Between(191, 197);

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
    // Obtener el frame del power-up
    const frame = powerUp.frame.name;

    // Verificar si hay un efecto asociado a este frame y aplicarlo
    if (powerUpEffects[frame]) {
      powerUpEffects[frame](player);
    } else {
      console.log('No effect found for this power-up.');
    }

    // Destruir el power-up cuando se recoja
    powerUp.destroy();

    // Incrementar la transformación del jugador
    player.upgradeTransformation();
  }

  update() {
    // Si necesitas actualizar algo en cada frame
  }
}
