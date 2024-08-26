import Phaser from 'phaser';

export class Bullet extends Phaser.Physics.Arcade.Sprite {
  constructor(scene, x, y) {
    super(scene, x, y);

    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.graphics = scene.add.graphics();
    this.graphics.fillStyle(0xffffff, 1); // Color blanco
    this.graphics.fillCircle(0, 0, 5); // Radio de 5 píxeles

    this.texture = this.graphics.generateTexture('bulletTexture', 10, 10);
    this.setTexture('bulletTexture');

    this.setScale(1);
    this.body.setSize(10, 10);
    this.setCollideWorldBounds(true);
    this.body.onWorldBounds = true;

    // Asegurarse de que destroy() se llame con el contexto correcto
    this.body.world.on('worldbounds', () => this.destroy(), this);
  }

  fire(x, y, direction) {
    this.setPosition(x, y);
    this.setActive(true);
    this.setVisible(true);
    this.direction = direction;

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

  update() {}

  destroy() {
    console.log('DESTROY()');
    this.setScale(3);

    // Reproduce la animación antes de destruir
    this.play('destruccion');

    // Escucha el evento que indica que la animación ha terminado
    this.once('animationcomplete-destruccion', () => {
      console.log('animacion completada');
      super.destroy();
    });
  }
}
