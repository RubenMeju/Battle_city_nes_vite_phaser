import Phaser from 'phaser';
import { PowerUp } from '../objects/PowerUp';
import { RIGHT_LIMIT_X } from '../config';

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
    const x = Phaser.Math.Between(50, RIGHT_LIMIT_X - 50);
    const y = Phaser.Math.Between(50, this.scene.scale.height - 50);

    const texture = 'tiles';
    const frame = Phaser.Math.Between(191, 196);

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
    this.soundController.playPowerUp();

    powerUp.destroy(); // Destruir el Power-Up cuando se recoja

    // Efectos según el tipo de Power-Up recogido
    switch (powerUp.frame.name) {
      case 191: // Casco
        player.activateInvulnerability(10000); // 10 segundos de invulnerabilidad
        break;
      case 192: //  Reloj
        player.freezeEnemies(5000); // Congelar enemigos por 5 segundos
        break;
      case 193: // Pala
        player.fortifyEagle();
        break;
      case 194: // Estrella
        player.upgradeTransformation();
        break;
      case 195: // Granada
        player.destroyAllEnemies();
        break;
      case 196: // Vida extra
        player.gainExtraLife();
        break;
      default:
        console.warn(
          `No action defined for Power-Up with frame: ${powerUp.frame.name}`
        );
        break;
    }
  }

  update() {}
}
