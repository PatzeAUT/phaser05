class Dude extends Phaser.Physics.Arcade.Sprite {
    constructor(scene,x,y,key) {
        super(scene, x, y, key);
        scene.physics.world.enable(this);
        scene.add.existing(this);
        this.setCollideWorldBounds(true);
        this.setBounce(0.2);
        this.createAnimations(scene);
        this.anims.play('stand');
        this.score = 0;
        this.startscore = 0;
        this.hasKey = false;
        this.isFrozen = false;
    }

    createAnimations(scene) {
        scene.anims.create({
            key: 'runleft',
            frames: scene.anims.
                generateFrameNumbers('dude', {start: 0, end: 3}),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({
            key: 'runright',
            frames: scene.anims.
                generateFrameNumbers('dude', {start: 5, end: 8}),
            frameRate: 10,
            repeat: -1
        });
        scene.anims.create({
            key: 'stand',
            frames: [{ key: 'dude', frame: 4}],
            frameRate: 10,
            repeat: -1
        });
    }

    update(cursors, mysound) {
        if (!this.isFrozen) {
            if (cursors.left.isDown) {
                this.setVelocityX(-160);
                this.anims.play('runleft', true);
            } else if (cursors.right.isDown) {
                this.setVelocityX(160);
                this.anims.play('runright', true);
            } else {
                this.setVelocityX(0);
                this.anims.play('stand');		
            }
            if (cursors.up.isDown && this.body.touching.down) {
                this.setVelocityY(-330);
                mysound.jump.play();
            }
        }
    }

    freeze() {
        this.disableBody(true,false);
        this.isFrozen = true;
    }

    bounce() {
        const BOUNCE_SPEED = 200;
        this.setVelocityY(-BOUNCE_SPEED);
    }

    die() {
        this.setTint(0xff0000);
        this.anims.play('stand');
    }

}

export default Dude;