class GameOverScene extends Phaser.Scene {
    constructor(test) {
        super({
            key: 'GameOverScene'
        });
    }

    create() {
        this.levelText = this.add.dynamicBitmapText(400, 199, 'ice', 'Game Over', 100).setOrigin(0.5,0.5);
        var textConfig = {
            color: '#000000',
            fill: '#ffffff',
            backgroundColor: '#0000ff',
            padding: 20
        }
        var startButton = this.add.text(400, 300, 'Spiel neu starten', textConfig).setOrigin(0.5,0.5);
        startButton.setInteractive({ useHandCursor: true });
        startButton.on('pointerdown', this.startGame, this);
    }

    startGame() {
        this.scene.start("GameScene",{level:1,score:0});
    }
}

export default GameOverScene;