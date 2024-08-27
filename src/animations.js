const playerTransform = {
  tank1: {
    up: { start: 0, end: 1 },
    left: { start: 2, end: 3 },
    down: { start: 4, end: 5 },
    right: { start: 6, end: 7 },
  },
  tank2: {
    up: { start: 25, end: 26 },
    left: { start: 27, end: 28 },
    down: { start: 29, end: 30 },
    right: { start: 31, end: 32 },
  },
  tank3: {
    up: { start: 50, end: 51 },
    left: { start: 52, end: 53 },
    down: { start: 54, end: 55 },
    right: { start: 56, end: 57 },
  },
  tank4: {
    up: { start: 75, end: 76 },
    left: { start: 77, end: 78 },
    down: { start: 79, end: 80 },
    right: { start: 81, end: 82 },
  },
};

function generateAnimationConfig(transformation) {
  return {
    [`${transformation}_up`]: {
      texture: 'tiles',
      frames: playerTransform[transformation].up,
      frameRate: 10,
      repeat: -1,
    },
    [`${transformation}_left`]: {
      texture: 'tiles',
      frames: playerTransform[transformation].left,
      frameRate: 10,
      repeat: -1,
    },
    [`${transformation}_right`]: {
      texture: 'tiles',
      frames: playerTransform[transformation].right,
      frameRate: 10,
      repeat: -1,
    },
    [`${transformation}_down`]: {
      texture: 'tiles',
      frames: playerTransform[transformation].down,
      frameRate: 10,
      repeat: -1,
    },
  };
}

// Configuración para todas las transformaciones posibles
const animationsConfig = {
  ...generateAnimationConfig('tank1'),
  ...generateAnimationConfig('tank2'),
  ...generateAnimationConfig('tank3'),
  ...generateAnimationConfig('tank4'),

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
  aparecer: {
    texture: 'tiles',
    frames: { start: 166, end: 169 },
    frameRate: 6,
    repeat: -1,
  },
  destruccion: {
    texture: 'tiles',
    frames: { start: 216, end: 218 },
    frameRate: 7,
    repeat: 0,
  },
};

export function createAnimations(scene) {
  Object.entries(animationsConfig).forEach(([key, config]) => {
    // Verifica si la animación ya existe antes de crearla
    if (!scene.anims.exists(key)) {
      scene.anims.create({
        key,
        frames: scene.anims.generateFrameNumbers(config.texture, config.frames),
        frameRate: config.frameRate,
        repeat: config.repeat,
      });
    }
  });
}

export function removeAnimations(scene) {
  Object.keys(animationsConfig).forEach((key) => {
    scene.anims.remove(key);
  });
}
