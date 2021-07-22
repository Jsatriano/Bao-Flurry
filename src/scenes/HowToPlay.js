class HowToPlay extends Phaser.Scene {
    constructor() {
        super("howtoplayScene");
    }
    create() {
        // new config for credit text
        let boldConfig = {
            fontFamily: 'Verdana',
            fontSize: '40px',
            color: '#9effe8',
            align: 'center',
            stroke: "#000000",
            strokeThickness: 3,
            padding: {
              top: 5,
              bottom: 5,
            },
        }
        let smallConfig = {
            fontFamily: 'Verdana',
            fontSize: '32px',
            color: '#9effe8',
            align: 'center',
            stroke: "#000000",
            strokeThickness: 3,
            padding: {
              top: 5,
              bottom: 5,
            },
        }

        // create keybinds
        keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
        
        // create background
        this.add.rectangle(0, 0, game.config.width, game.config.height, 0xffd1dc).setOrigin(0, 0);

        // add all the text that is shown on screen
        this.add.text(game.config.width / 2, game.config.height / 2 - 280, "How To Play", boldConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 - 150, "Controls", boldConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 - 60, "A = move left\nD = move right\nSPACE = jump", smallConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 + 80, "Goal", boldConfig).setOrigin(0.5)
        this.add.text(game.config.width / 2, game.config.height / 2 + 150, "Dodge all the obstacles\nand get to the flag to beat each level", smallConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 + 280, "HINT: not everything is as it seems!", smallConfig).setOrigin(0.5);
        this.add.text(tileSize, game.config.height  - (tileSize * 2) , "Return (H)", smallConfig).setOrigin(0);
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyH)) {
            this.sound.play('sfx_select');
            this.scene.start('menuScene');
        }
    }
}