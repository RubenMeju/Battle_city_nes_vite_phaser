import Phaser from 'phaser';

import { GameScene } from './scenes/GameScene.js';
import { GameOverScene } from './scenes/GameOverScene.js';
import { StartScene } from './scenes/StartScene.js';
import { PreloadLevelScene } from './scenes/PreloadLevelScene.js';
import { FinishGameScene } from './scenes/FinishGameScene.js';

const config = {
  type: Phaser.AUTO,
  width: 750,
  height: 675,
  scene: [
    StartScene,
    PreloadLevelScene,
    GameScene,
    GameOverScene,
    FinishGameScene,
  ],
  physics: {
    default: 'arcade',
    arcade: { debug: true, gravity: { y: 0 } },
  },
};

export const game = new Phaser.Game(config);
