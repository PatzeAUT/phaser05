class Spider extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, key,group) {
        super(scene, x, y, key);
        group.add(this);
        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.setCollideWorldBounds(true);
        this.createAnimations(scene);
        this.anims.play('krabble');
        this.speed = 100;
        this.body.setVelocityX(this.speed);
    }

    createAnimations(scene) {
        scene.anims.create({
            key: 'krabble',
            frames: scene.anims.
                generateFrameNumbers('spider', {start: 0, end: 2}),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({
            key: 'die',
            frames: scene.anims.
                generateFrameNumbers('spider', {frames: [0,4,0,4,0,4,3,3,3,3,3,3]}),
            frameRate: 12
        });
    }

    update() {
        if (this.body.touching.right || this.body.blocked.right) {
			this.setVelocityX(-this.speed);
		} else if (this.body.touching.left || this.body.blocked.left) {
			this.setVelocityX(this.speed);
		}
    }

    die() {
        this.body.enable = false;
        this.anims.play("die");
        this.on('animationcomplete', function() {
            this.destroy();
        }, this);
    }

}

export default Spider;