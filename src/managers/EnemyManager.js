import { Enemy } from '../objects/Enemy.js';
import { INITIAL_ENEMIES } from '../config.js';

export class EnemyManager {
  constructor(scene) {
    this.scene = scene;
    this.enemies = this.scene.add.group({
      classType: Enemy,
      runChildUpdate: true,
    });
    this.enemiesCreated = 0;
    this.enemiesRemaining = 0;
    this.generateEnemies(INITIAL_ENEMIES);
  }

  generateEnemies(num) {
    const enemyPositions = [
      { x: 50, y: 0 },
      { x: this.scene.scale.width / 2, y: 0 },
      { x: this.scene.scale.width - 200, y: 0 },
    ];

    const remainingEnemiesToCreate =
      this.scene.totalEnemies - this.enemiesCreated;
    const enemiesToCreate = Math.min(num, remainingEnemiesToCreate);

    for (let i = 0; i < enemiesToCreate; i++) {
      const position = enemyPositions[i % enemyPositions.length];
      const enemy = new Enemy(this.scene, position.x, position.y, 'enemy');

      // Configuración inicial
      enemy.play('aparecer');
      this.scene.time.delayedCall(1500, () => {
        if (enemy.active) {
          enemy.play('down_enemy');
        }
      });

      // Obtener la referencia a los bloques sólidos y al límite derecho
      const blocks = this.scene.mapManager.getBlocks();
      const rightLimit = this.scene.mapManager.getRightLimit();

      // Agregar colisiones
      this.enemies.add(enemy);
      this.scene.physics.add.collider(enemy, blocks.solidos);

      // Colisión con el límite derecho
      this.scene.physics.add.collider(enemy, rightLimit);

      // Otras colisiones
      this.scene.physics.add.collider(
        enemy.bullets,
        blocks.solidos,
        this.scene.handleBulletBlockCollision,
        null,
        this.scene
      );

      this.scene.physics.add.collider(
        this.scene.playerManager.player.bullets,
        this.enemies,
        this.balaJugadorImpactaEnElEnemigo,
        null,
        this.scene
      );

      this.scene.physics.add.collider(
        this.scene.playerManager.player,
        this.enemies.children.getArray().flatMap((enemy) => enemy.bullets),
        this.balaEnemigoImpactaEnElJugador,
        null,
        this.scene
      );

      this.enemiesCreated++;
      this.enemiesRemaining++;
    }
  }

  balaJugadorImpactaEnElEnemigo(enemy, bullet) {
    //console.log('ENEMIGO MUERTO', enemy);
    if (enemy && bullet) {
      enemy.alive = false;
      enemy.disableBody(false, false);
      bullet.destroy();

      enemy.setVelocity(0);
      enemy.anims.play('destruccion', true);
      this.soundManager.playExplosion();

      enemy.once('animationcomplete-destruccion', () => {
        // console.log('animation complete mejuuuuuuu');
        enemy.destroy();
        this.enemyManager.enemiesRemaining--;
        if (this.enemyManager.enemiesRemaining === 0) {
          this.enemyManager.checkNextWave();
        }
      });
    }
  }

  balaEnemigoImpactaEnElJugador(player, bullet) {
    //  console.log('JUGADOR MUERTO: ', player);
    if (player && bullet) {
      player.alive = false;

      bullet.destroy();

      player.setVelocity(0);
      this.soundManager.playExplosion();
      player.anims.play('destruccion', true);

      player.once('animationcomplete-destruccion', () => {
        //   console.log("animacion completada");
        player.setActive(false);
        player.setVisible(false);
        player.isMoving = false;

        // Reaparecer el jugador si aún tiene vidas
        if (this.lives > 0) {
          this.playerManager.respawnPlayer();
        }
      });
    }
  }

  checkNextWave() {
    if (
      this.enemiesRemaining === 0 &&
      this.enemiesCreated < this.scene.totalEnemies
    ) {
      this.generateEnemies(INITIAL_ENEMIES);
    }
  }

  update() {
    this.checkNextWave();
  }
}
