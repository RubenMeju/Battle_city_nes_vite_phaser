export const powerUpEffects = {
  191: (player) => {
    console.log('CASCO: player: ', player);
    // Efecto del Casco: Invulnerabilidad temporal
    player.activateInvulnerability();
    console.log('Player is invulnerable with a Helmet!');
  },
  192: (player) => {
    console.log('RELOJ: player: ', player);

    // Efecto del Reloj: Congela a los enemigos
    player.scene.freezeEnemies();
    console.log('Enemies frozen with a Clock!');
  },
  193: (player) => {
    console.log('PALA: player: ', player);

    // Efecto de la Pala: Refuerza la base
    player.scene.reinforceBase();
    console.log('Base reinforced with a Shovel!');
  },
  194: (player) => {
    console.log('ESTRELLA: player: ', player);

    // Efecto de la Estrella: Mejora el tanque
    player.upgradeTransformation();
    console.log('Player upgraded with a Star!');
  },
  195: (player) => {
    // Efecto de la Granada: Destruye todos los enemigos en pantalla
    player.scene.destroyAllEnemies();
    console.log('All enemies destroyed with a Grenade!');
  },
  196: (player) => {
    // Efecto del Tanque: Vida extra
    player.addLife();
    console.log('Player gained an extra life with a Tank!');
  },
  197: (player) => {
    // Efecto del Hacha: Transforma las defensas de la base
    player.scene.modifyBaseDefenses();
    console.log('Base defenses modified with a Hatchet!');
  },
};
