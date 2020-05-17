class BootScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'BootScene'
        });
        this.audiopath = "assets/audio/";
        this.imgpath = "assets/images/";
        this.spritepath = "assets/sprites/";
    }
    preload() {
        this.runProgressBar();
        //JSON-Files
        this.load.json('config', 'config.json'); 
        this.load.json('level1', 'levels/level01.json');
        this.load.json('level2', 'levels/level02.json');

        this.load.image('sky',this.imgpath+'sky.png');
        this.load.image('platform',this.imgpath+'platform.png');
        this.load.image('star', this.imgpath+'star.png');
        this.load.image('seifenblase', this.imgpath+'bubble.png');
        this.load.image('bomb', this.imgpath+'bomb.png');
        this.load.image('key', this.imgpath+'key.png');
        this.load.image('enemy-wall', this.imgpath+'invisible_wall.png');

        this.load.spritesheet('dude',this.spritepath+'dude.png', { frameWidth: 32, frameHeight: 48});
        this.load.spritesheet('decoration', this.spritepath+'decor.png', { frameWidth: 42, frameHeight: 42});
        this.load.spritesheet('keyicon', this.spritepath+'key_icon.png', { frameWidth: 34, frameHeight: 30});
        this.load.spritesheet('door',this.spritepath+'door.png', { frameWidth: 42, frameHeight: 66});
        this.load.spritesheet('spider',this.spritepath+'spider.png', { frameWidth: 42, frameHeight: 32});

        this.load.audio('backgroundmusic', [this.audiopath+'bgm.ogg',this.audiopath+'bgm.mp3']);
        this.load.audio('jump',this.audiopath+'jump.wav');
        this.load.audio('collect', this.audiopath+'coin.wav');
        this.load.audio('getkey', this.audiopath+'key.wav');
        this.load.audio('opendoor', this.audiopath+'door.wav');
        this.load.audio('stomp', this.audiopath+'stomp.wav');

        //this.load.bitmapFont('ice', 'assets/fonts/bitmap/iceicebaby.png', 'assets/fonts/bitmap/iceicebaby.xml');
        this.load.bitmapFont('ice', 'assets/fonts/bitmap/topaz-green.png', 'assets/fonts/bitmap/topaz-green.xml');
        //this.progressBarStressTest();
    }

    progressBarStressTest() {
        for (var i = 0; i < 2000; i++) {
            this.load.image('logo'+i, this.imgpath+'bubble.png');
        }
    }

    runProgressBar() {
        var progressBar = this.add.graphics();
        var progressBox = this.add.graphics();
        progressBox.fillStyle(0x222222, 0.8);
        progressBox.fillRect(240, 270, 320, 50);
        
        var width = this.cameras.main.width;
        var height = this.cameras.main.height;
        var loadingText = this.make.text({
            x: width / 2,
            y: height / 2 - 50,
            text: 'Loading...',
            style: {
                font: '20px monospace',
                fill: '#ffffff'
            }
        });
        loadingText.setOrigin(0.5, 0.5);
        
        var percentText = this.make.text({
            x: width / 2,
            y: height / 2 - 5,
            text: '0%',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        percentText.setOrigin(0.5, 0.5);
        
        var assetText = this.make.text({
            x: width / 2,
            y: height / 2 + 50,
            text: '',
            style: {
                font: '18px monospace',
                fill: '#ffffff'
            }
        });
        assetText.setOrigin(0.5, 0.5);
        
        this.load.on('progress', function (value) {
            percentText.setText(parseInt(value * 100) + '%');
            progressBar.clear();
            progressBar.fillStyle(0xffffff, 1);
            progressBar.fillRect(250, 280, 300 * value, 30);
        });
        
        this.load.on('fileprogress', function (file) {
            assetText.setText('Loading asset: ' + file.key);
        });

        this.load.on('complete', function () {
            progressBar.destroy();
            progressBox.destroy();
            loadingText.destroy();
            percentText.destroy();
            assetText.destroy();
        });
    }

    create() {
        var textConfig = {
            color: '#000000',
            fill: '#ffffff',
            backgroundColor: '#0000ff',
            padding: 20
        }
        var startButton = this.add.text(400, 300, 'Spiel starten', textConfig).setOrigin(0.5,0.5);
        startButton.setInteractive({ useHandCursor: true });
        startButton.on('pointerdown', this.startGame, this);
        //this.startGame();
    }

    startGame() {
        this.scene.start("GameScene",{level:1,score:0});
    }
}

export default BootScene;