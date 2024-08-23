import Phaser from "phaser";

import { GameScene } from "./scenes/GameScene.js";
import { GameOverScene } from "./scenes/GameOverScene.js";
import { StartScene } from "./scenes/StartScene.js";

const config = {
  type: Phaser.AUTO,
  width: 750,
  height: 675,
  scene: [StartScene, GameScene, GameOverScene],
  physics: {
    default: "arcade",
    arcade: { debug: true, gravity: { y: 0 } },
  },
};

export const game = new Phaser.Game(config);
