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
  }

  playWalk() {
    this.walkSound.play({ volume: 0.5, loop: true }); // Reproduce en bucle
  }
  stopWalk() {
    this.stopSound.play({ volume: 0.5, loop: true }); // Reproduce en bucle
  }
  playExplosion() {
    this.explosionSound.play({ volume: EXPLOSION_VOLUME, loop: false });
  }
  playPowerUp() {
    this.powerUpSound.play({ volume: 1, loop: false });
  }
  playBalaBloque() {
    this.balaBloqueSound.play({ volume: 1, loop: false });
  }
}
