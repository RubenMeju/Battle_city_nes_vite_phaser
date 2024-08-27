import { Hub } from '../objects/Hub.js';

export class HudController {
  constructor(scene) {
    this.scene = scene;
    this.hub = new Hub(this.scene);
  }

  updateLives(lives) {
    this.hub.updateLives(lives);
  }

  updateEnemies(remainingEnemies) {
    this.hub.updateEnemies(remainingEnemies);
  }
}
