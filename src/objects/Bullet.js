import Phaser from 'phaser';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Crear un círculo como la bala
    this.graphics = scene.add.graphics();
    this.graphics.fillStyle(0xffffff, 1); // Color blanco
    this.graphics.fillCircle(0, 0, 5); // Radio de 5 píxeles

    this.texture = this.graphics.generateTexture('bulletTexture', 10, 10);
    this.setTexture('bulletTexture');

    this.setScale(1);
    this.body.setSize(10, 10);
    this.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;
    this.body.world.on('worldbounds', this.destroy, this);
  }

  fire(x, y, direction) {
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.direction = direction; // Guarda la dirección del disparo

    let velocity = 300;
    switch (direction) {
      case 'up':
        this.setVelocityY(-velocity);
        break;
      case 'down':
        this.setVelocityY(velocity);
        break;
      case 'left':
        this.setVelocityX(-velocity);
        break;
      case 'right':
        this.setVelocityX(velocity);
        break;
    }
  }

  update() {
    if (
      this.x < 0 ||
      this.x > this.scene.scale.width ||
      this.y < 0 ||
      this.y > this.scene.scale.height
    ) {
      this.destroy();
    }
  }

  destroy() {
    super.destroy();
    this.graphics.destroy();
  }
}
