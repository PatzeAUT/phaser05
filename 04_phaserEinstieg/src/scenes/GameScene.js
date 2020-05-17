import Dude from '../sprites/Dude.js';
import Spider from '../sprites/Spider.js';

class GameScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'GameScene'
        });
        this.myconfig;
        this.level;this.levelnum;
        this.platforms;
        this.bgm;this.cursors;this.mysound;
        this.player;
        this.stars;
        this.scoreText;this.levelText;
        this.worldcam;
        this.door;this.key;this.keyIcon;
        this.enemies;
        this.enemyWalls;
    }

    create(data) {
        this.myconfig = this.cache.json.get('config');
        this.levelnum = (data.level <= this.myconfig.levels) ? data.level : 1;
        this.initWorld();
        this.createStars();
        this.createDoor();
        this.createKey();
        this.initPlayer(data.score);

        //Some dangerous things
        this.createBomb();
        this.enemies = this.physics.add.group();
        this.createSpiders();

        this.initControlsAndCams();
        this.addScoreBoard();
        this.addSound();

        this.addCollisionHandler();
    }

    update() {
        this.player.update(this.cursors, this.mysound);
        this.enemies.children.entries.forEach(function(enemy) {
            enemy.update();
        });
    }

    /*****************************
     *  Build the World 
     *****************************/

    initWorld() {
        this.add.image(0,0,'sky').setOrigin(0,0).setScale(2.5,1);
        this.platforms = this.physics.add.staticGroup();
        this.enemyWalls = this.physics.add.staticGroup();

        this.level = this.cache.json.get('level'+this.levelnum);
        this.level.platforms.forEach(this.createPlatform, this);
        this.level.decoration.forEach(this.addDecoration, this);
        //this.createBubbles();
    }

    createPlatform(p) {
        var newplatform = this.platforms.create(p.x,p.y, 'platform').setScale(p.scaleX,p.scaleY).refreshBody();
        this.createEnemyWall(newplatform,'left');
        this.createEnemyWall(newplatform,'right');
    }

    createEnemyWall(platform, pos) {
        var posx, originx;
        if (pos=="right") {
            posx = platform.x + platform.displayWidth/2;
            originx = 0;
        } else {
            posx = platform.x - platform.displayWidth/2;
            originx = 1;
        }
        var wall = this.enemyWalls.create(posx, platform.y, 'enemy-wall').setOrigin(originx,1).refreshBody();
        wall.visible = false;
    }

    addDecoration(decodata) {
        this.add.image(decodata.x, decodata.y, 'decoration', decodata.frame);
    }

    //Showcase Partikel-Emitter
    createBubbles() {
        var particles = this.add.particles('seifenblase');

        var emitter = particles.createEmitter({
            x: 600,
            y: 300,
            speed: 100,
            quantity: 1,
            frequency: 10,
            gravityY: -10,
            lifespan: { min: 1000, max: 2000 },
            blendMode: 'ADD'
        });
    }

    /*****************************
     *  Create Stars to collect
     *****************************/

    createStars() {
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: this.myconfig.stars-1,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        this.stars.children.iterate(function(stern) {
            stern.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

    }

    /*****************************
     * Door and Key to exit the Level
     *****************************/
    

    createDoor() {
        this.door = this.physics.add.image(this.level.door.x, this.level.door.y, "door").setOrigin(0.5,1);
        this.door.body.allowGravity = false;
    }

    createKey() {
        this.key = this.physics.add.image(this.level.key.x, this.level.key.y, "key");
        this.key.body.allowGravity = false;
        this.tweens.add({
            targets: this.key,
            y: this.key.y+6,
            duration: 800,
            ease: 'Sine.easeInOut',
            yoyo: true,
            loop: -1
        });
    }

    /*****************************
     * The Player
     *****************************/

    initPlayer(score) {
        this.player = new Dude(this,300,100,'dude');
        this.player.score = score;
        this.player.startscore = score;
    }

    /*****************************
     * Bombs and Enemies
     *****************************/

    createBomb() {
        this.bombs = this.physics.add.group();
        this.addBomb();
    }

    addBomb() {
        var x = (this.player.x < 400) ? Phaser.Math.Between(400, 800) : Phaser.Math.Between(0, 400);
        var bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }

    createSpiders() {
        for (var data of this.level.spiders) {
            var newspider = new Spider(this,data.x,data.y,'spider',this.enemies);
        }
    }

    /*****************************
     * Controls, ScoreBoard and Sound
     * Finish the Environment
     *****************************/

    initControlsAndCams() {
        this.cursors = this.input.keyboard.createCursorKeys();
        //Größere Welt als der Bildausschnitt - Kamera folgt dem Player
        this.cameras.main.startFollow(this.player);
        this.physics.world.setBounds(0,0,2000,600);
        this.cameras.main.setBounds(0,0,2000,600);
        //this.addMiniMap();
    }

    addMiniMap() {
        //Just another cam!
        this.worldcam = this.cameras.add(10, 10, 400, 120).setZoom(0.2).setName('mini');
        this.worldcam.scrollX = 800;
        this.worldcam.scrollY = 240;
        //this.worldcam.setBounds(0,0,2000,600);
    }

    addScoreBoard() {
        //this.scoreText = this.add.text(20, 550, 'Score: 0', { fontSize: '32px', fill: '#FFF' });
        this.scoreText = this.add.dynamicBitmapText(20, 550, 'ice', 'Score: '+this.player.score, 32);
        this.scoreText.setScrollFactor(0,0);
        //this.levelText = this.add.text(400, 550, 'Level: '+this.levelnum, { fontSize: '32px', fill: '#FFF' });
        this.levelText = this.add.dynamicBitmapText(400, 550, 'ice', 'Level: '+this.levelnum, 32);
        this.levelText.setScrollFactor(0,0);
        this.keyIcon = this.add.image(300,570,'keyicon',0);
        this.keyIcon.setScrollFactor(0,0);
    }

    addSound() {
        this.mysound = {
            jump: this.sound.add("jump"),
            collect: this.sound.add("collect"),
            getkey: this.sound.add("getkey"),
            opendoor: this.sound.add("opendoor")
        };
        if (this.myconfig.bgmusic) {
            if (this.bgm==null) {
                this.bgm = this.sound.add('backgroundmusic');
                this.bgm.play({loop: true});
            }
        }
    }

    /*****************************
     * Manage the Collisions
     *****************************/

    addCollisionHandler() {
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.enemies, this.platforms);
        this.physics.add.collider(this.enemies, this.enemyWalls);

        //Collisions with Callback-Functions
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);
        this.physics.add.overlap(this.player, this.bombs, this.killPlayer, null, this);
        this.physics.add.overlap(this.player, this.key, this.getKey, null, this);
        this.physics.add.overlap(this.player, this.door, this.openDoor, this.hasKey, this);
        this.physics.add.overlap(this.player, this.enemies, this.dudeVsEnemy, null, this);
    }

    collectStar(player, star) {
        this.mysound.collect.play();
        //Ist auch eine Möglichkeit - destroy ist besser
        //star.disableBody(true, true);
        star.destroy();
    
        //  Add and update the score
        this.player.score += this.myconfig.starpoints;
        this.scoreText.setText('Score: ' + this.player.score);
        if (this.myconfig.nextLevelDoor==false && this.stars.countActive(true) == 0) {
            this.startNewLevel(this.levelnum,player.score);
        }
    }

    startNewLevel(level,score) {
        this.cameras.main.fade(1000,0,0,0,false);
        this.cameras.main.on("camerafadeoutcomplete",function() {
            var newLevel = level + 1;
            if (newLevel <= this.myconfig.levels) {
                this.scene.restart({level:newLevel,score:score});
            } else {
                this.scene.start('GameOverScene');
            }
        },this);
    }

    killPlayer() {
        this.player.die();
        this.restartLevel(this.levelnum,this.player.startscore);
    }

    restartLevel(level, score) {
        this.cameras.main.shake(1000);
        this.cameras.main.on("camerashakecomplete",function() {
            this.scene.restart({level:level,score:score});
        },this);
    }
    
    getKey(player, key) {
        this.key.destroy();
        this.player.hasKey = true;
        this.mysound.getkey.play();
        this.keyIcon.setFrame(1);
    }

    hasKey(player, door) {
        return (player.hasKey && player.body.touching.down);
    }

    openDoor(player, door) {
        door.disableBody(true,false);
        door.setFrame(1);
        this.mysound.opendoor.play();
        this.player.freeze();
        this.tweens.add({
            targets: this.player,
            duration: 500,
            alpha: 0,
            x: this.door.x,
            onComplete: this.doorHandler,
            onCompleteParams: [ this ]
        })		
    }

    doorHandler(tween, targets, scene) {
        scene.startNewLevel(scene.levelnum, scene.player.score);
    }

    dudeVsEnemy(player, enemy) {
        if (player.body.velocity.y > 0) {
            //Player von oben: Spinne ist tot
            enemy.die();
            player.bounce();
        } else {
            //Sonst ist leider der Player tot
            this.killPlayer();
        }
    }

}

export default GameScene;