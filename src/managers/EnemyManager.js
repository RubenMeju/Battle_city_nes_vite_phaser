import { Enemy } from "../objects/Enemy.js";
import { INITIAL_ENEMIES } from "../config.js";

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
      const enemy = new Enemy(this.scene, position.x, position.y, "enemy");

      // Configuración inicial
      enemy.play("aparecer"); // Reproduce la animación de aparición
      this.scene.time.delayedCall(1500, () => {
        if (enemy.active) {
          enemy.play("down_enemy"); // Cambia a la animación normal después de 3 segundos
        }
      });

      // Agregar colisiones
      this.enemies.add(enemy);
      this.scene.physics.add.collider(enemy, this.scene.bloques.solidos);
      this.scene.physics.add.collider(enemy, this.scene.rightLimit);
      this.scene.physics.add.collider(
        enemy.bullets,
        this.scene.bloques.solidos,
        this.scene.handleBulletBlockCollision,
        null,
        this.scene,
      );

      this.enemiesCreated++;
      this.enemiesRemaining++;
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
