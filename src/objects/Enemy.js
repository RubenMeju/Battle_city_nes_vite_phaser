import Phaser from 'phaser';
import { Bullet } from './Bullet.js';

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y, texture) {
    super(scene, x, y, texture);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.setScale(this.scene.escalado);
    this.body.setSize(15, 15);
    this.body.setOffset(0, 0);

    this.setCollideWorldBounds(true);

    this.velocidad = 100;
    this.alive = true;
    this.direction = 'right';
    this.moveTime = 2000;
    this.lastMoveTime = 0;
    this.appearTime = 1500;
    this.isMoving = false;

    this.bullets = this.scene.physics.add.group({
      classType: Bullet,
      runChildUpdate: true,
    });
    this.maxBullets = 1;
    this.bulletCooldown = 300;
    this.lastShot = 0;

    this.setRandomDirection();

    this.play('aparecer');
    this.scene.time.delayedCall(this.appearTime, () => {
      if (this.active) {
        this.play('down_enemy');
        this.isMoving = true;
        this.lastMoveTime = this.scene.time.now;
      }
    });
  }

  setRandomDirection() {
    const directions = ['up', 'down', 'left', 'right'];
    this.direction = directions[Phaser.Math.Between(0, directions.length - 1)];
  }

  update(time) {
    if (this.alive && this.isMoving) {
      this.movement(time);
    }
  }

  movement(time) {
    if (time - this.lastMoveTime > this.moveTime || this.isColliding()) {
      this.setRandomDirection();
      this.lastMoveTime = time;
      this.shoot();
    }

    this.updateMovement();
  }

  updateMovement() {
    const velocities = {
      up: { x: 0, y: -this.velocidad },
      down: { x: 0, y: this.velocidad },
      left: { x: -this.velocidad, y: 0 },
      right: { x: this.velocidad, y: 0 },
    };

    const anims = {
      up: 'up_enemy',
      down: 'down_enemy',
      left: 'left_enemy',
      right: 'right_enemy',
    };

    const { x, y } = velocities[this.direction];
    this.setVelocity(x, y);
    this.anims.play(anims[this.direction], true);
  }

  isColliding() {
    return (
      this.body.blocked.left ||
      this.body.blocked.right ||
      this.body.blocked.up ||
      this.body.blocked.down
    );
  }

  shoot() {
    if (this.bullets.getChildren().length < this.maxBullets) {
      const bullet = this.bullets.get(this.x, this.y);
      if (bullet) {
        bullet.fire(this.x, this.y, this.direction);
      }
    }
  }
}
