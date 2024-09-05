import { EXPLOSION_VOLUME } from '../config';

export class SoundController {
  constructor(scene) {
    this.scene = scene;
    this.initSounds();
  }

  initSounds() {
    this.walkSound = this.scene.sound.add('walk');
    this.stopSound = this.scene.sound.add('stop');
    this.explosionSound = this.scene.sound.add('explosion');
    this.powerUpSound = this.scene.sound.add('powerup');
    this.balaBloqueSound = this.scene.sound.add('bala_bloque');
    this.balaBordesSound = this.scene.sound.add('bala_bordes');
    this.vidaSound = this.scene.sound.add('vida');
  }

  playWalk() {
    this.walkSound.play({ volume: 0.1, loop: true }); // Reproduce en bucle
  }

  stopWalkSound() {
    this.walkSound.stop(); // Detiene el sonido de caminar
  }

  stopWalk() {
    this.stopSound.play({ volume: 0.1, loop: false }); // Reproduce el sonido de detenerse
  }

  playExplosion() {
    this.explosionSound.play({ volume: EXPLOSION_VOLUME, loop: false });
  }

  playPowerUp() {
    this.powerUpSound.play({ volume: 0.5, loop: false });
  }

  playBalaBloque() {
    this.balaBloqueSound.play({ volume: 0.5, loop: false });
  }

  playBalaBorde() {
    this.balaBordesSound.play({ volume: 0.5, loop: false });
  }

  playVida() {
    this.vidaSound.play({ volume: 0.5, loop: false });
  }

  // Nuevo método para detener todos los sonidos
  stopAllSounds() {
    if (this.walkSound.isPlaying) this.walkSound.stop();
    if (this.stopSound.isPlaying) this.stopSound.stop();
    if (this.explosionSound.isPlaying) this.explosionSound.stop();
    if (this.powerUpSound.isPlaying) this.powerUpSound.stop();
    if (this.balaBloqueSound.isPlaying) this.balaBloqueSound.stop();
    if (this.balaBordesSound.isPlaying) this.balaBordesSound.stop();
    if (this.vidaSound.isPlaying) this.vidaSound.stop();
  }
}
