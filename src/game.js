import Phaser from "phaser";

import { GameScene } from "./scenes/GameScene.js";
const config = {
  type: Phaser.AUTO,
  width: 628,
  height: 675,
  scene: [GameScene],
  physics: {
    default: "arcade",
    arcade: { debug: true, gravity: { y: 0 } },
  },
};

export const game = new Phaser.Game(config);
