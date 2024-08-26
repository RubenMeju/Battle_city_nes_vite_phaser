const animationsConfig = {
  up: {
    texture: 'tiles',
    frames: { start: 0, end: 1 },
    frameRate: 10,
    repeat: -1,
  },
  left: {
    texture: 'tiles',
    frames: { start: 2, end: 3 },
    frameRate: 10,
    repeat: -1,
  },
  right: {
    texture: 'tiles',
    frames: { start: 6, end: 7 },
    frameRate: 10,
    repeat: -1,
  },
  down: {
    texture: 'tiles',
    frames: { start: 4, end: 5 },
    frameRate: 10,
    repeat: -1,
  },
  // Enemigos
  up_enemy: {
    texture: 'tiles',
    frames: { start: 8, end: 9 },
    frameRate: 10,
    repeat: -1,
  },
  left_enemy: {
    texture: 'tiles',
    frames: { start: 10, end: 11 },
    frameRate: 10,
    repeat: -1,
  },
  right_enemy: {
    texture: 'tiles',
    frames: { start: 14, end: 15 },
    frameRate: 10,
    repeat: -1,
  },
  down_enemy: {
    texture: 'tiles',
    frames: { start: 12, end: 13 },
    frameRate: 10,
    repeat: -1,
  },
  // Aparecer
  aparecer: {
    texture: 'tiles',
    frames: { start: 166, end: 169 },
    frameRate: 6,
    repeat: -1,
  },
  // Destrucción
  destruccion: {
    texture: 'tiles',
    frames: { start: 216, end: 218 },
    frameRate: 7,
    repeat: 0,
  },
};

export function createAnimations(scene) {
  Object.entries(animationsConfig).forEach(([key, config]) => {
    scene.anims.create({
      key,
      frames: scene.anims.generateFrameNumbers(config.texture, config.frames),
      frameRate: config.frameRate,
      repeat: config.repeat,
    });
  });
}

export function removeAnimations(scene) {
  Object.keys(animationsConfig).forEach((key) => {
    scene.anims.remove(key);
  });
}
