import Phaser from 'phaser';
import { TILE_SIZE } from '../config';

export class PreloadLevelScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadLevelScene' });
  }

  init(data) {
    this.levelIndex = data.levelIndex || 0;
  }

  preload() {
    const mapKey = `mapa${this.levelIndex}`;

    this.load.spritesheet('tiles', 'assets/sprites1.png', {
      frameWidth: TILE_SIZE,
      frameHeight: TILE_SIZE,
    });
    this.cache.tilemap.remove('mapa'); // Eliminar del caché

    // Cargar el archivo JSON del nivel actual
    this.load.tilemapTiledJSON('mapa', `/assets/${mapKey}.json`);
    this.load.image('tileSets', 'assets/sprites1.png');

    // Cargar otros recursos necesarios
    this.load.audio('explosion', 'assets/sounds/explosion.wav');
    this.load.audio('stop', 'assets/sounds/stop.wav');
    this.load.audio('walk', 'assets/sounds/walk.wav');
    this.load.audio('powerup', 'assets/sounds/coger_power_up.wav');
    this.load.audio('bala_bloque', 'assets/sounds/bala_bloque.wav');
    this.load.audio('bala_bordes', 'assets/sounds/bala_bordes.wav');
    this.load.audio('vida', 'assets/sounds/vida.wav');
  }

  create() {
    // Mostrar mensaje de bienvenida o nivel actual
    this.add
      .text(400, 300, `Nivel ${this.levelIndex + 1}`, {
        font: '32px Arial',
        fill: '#ffffff',
        align: 'center',
      })
      .setOrigin(0.5, 0.5);

    this.add
      .text(400, 350, 'Presiona Enter para comenzar', {
        font: '24px Arial',
        fill: '#ffffff',
        align: 'center',
      })
      .setOrigin(0.5, 0.5);

    // Configurar la entrada de teclado para avanzar
    this.input.keyboard.once('keydown-ENTER', () => {
      this.scene.start('GameScene', { levelIndex: this.levelIndex });
    });
  }
}
