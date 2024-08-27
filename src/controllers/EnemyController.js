import { Enemy } from '../objects/Enemy.js';
import { INITIAL_ENEMIES } from '../config.js';

export class EnemyController {
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
    const enemiesToCreate = Math.min(
      num,
      this.scene.totalEnemies - this.enemiesCreated
    );

    for (let i = 0; i < enemiesToCreate; i++) {
      const position = this.getEnemyPosition(i);
      const enemy = new Enemy(this.scene, position.x, position.y, 'enemy');
      this.setupEnemyCollisions(enemy);
      this.enemies.add(enemy);
      this.enemiesCreated++;
      this.enemiesRemaining++;
    }
  }

  getEnemyPosition(index) {
    const enemyPositions = [
      { x: 25, y: 0 },
      { x: this.scene.scale.width / 2 - 60, y: 0 },
      { x: this.scene.scale.width - 150, y: 0 },
    ];
    return enemyPositions[index % enemyPositions.length];
  }

  setupEnemyCollisions(enemy) {
    const blocks = this.scene.mapController.getBlocks();
    const rightLimit = this.scene.mapController.getRightLimit();

    this.scene.physics.add.collider(enemy, blocks.solidos);
    this.scene.physics.add.collider(enemy, rightLimit);

    this.scene.physics.add.collider(
      enemy.bullets,
      blocks.solidos,
      this.scene.handleBulletBlockCollision,
      null,
      this.scene
    );

    this.scene.physics.add.collider(
      this.scene.playerController.player.bullets,
      this.enemies,
      this.balaJugadorImpactaEnElEnemigo,
      null,
      this
    );

    this.scene.physics.add.collider(
      this.scene.playerController.player,
      enemy.bullets,
      this.balaEnemigoImpactaEnElJugador,
      null,
      this
    );
  }

  balaJugadorImpactaEnElEnemigo(enemy, bullet) {
    if (enemy && bullet) {
      enemy.alive = false;
      enemy.disableBody(false, false);
      bullet.destroy();

      enemy.setVelocity(0);
      enemy.anims.play('destruccion', true);

      // Accedemos a soundController desde la escena
      this.scene.soundController.playExplosion();

      enemy.once('animationcomplete-destruccion', () => {
        enemy.destroy();
        this.enemiesRemaining--;
        if (this.enemiesRemaining === 0) {
          this.checkNextWave();
        }
      });
    }
  }

  balaEnemigoImpactaEnElJugador(player, bullet) {
    if (player && bullet) {
      player.alive = false;
      bullet.destroy();
      player.setVelocity(0);

      // Accedemos a soundController desde la escena
      this.scene.soundController.playExplosion();
      player.anims.play('destruccion', true);

      player.once('animationcomplete-destruccion', () => {
        player.setActive(false);
        player.setVisible(false);
        player.isMoving = false;

        if (this.scene.lives > 0) {
          this.scene.playerController.respawnPlayer();
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
