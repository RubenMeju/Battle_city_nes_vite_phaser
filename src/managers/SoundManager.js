import { EXPLOSION_VOLUME } from '../config';

export class SoundManager {
  constructor(scene) {
    this.scene = scene;
    this.initSounds();
  }

  initSounds() {
    this.explosionSound = this.scene.sound.add('explosion');
    this.stopSound = this.scene.sound.add('stop');
    this.walkSound = this.scene.sound.add('walk');
  }

  playExplosion() {
    this.explosionSound.play({ volume: EXPLOSION_VOLUME, loop: false });
  }
}
