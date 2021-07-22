class Credits extends Phaser.Scene {
    constructor() {
        super("creditScene");
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
        keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        
        // create background
        this.add.rectangle(0, 0, game.config.width, game.config.height, 0xffd1dc).setOrigin(0, 0);

        // add all the text that is shown on screen
        this.add.text(game.config.width / 2, game.config.height / 2 - 280, "Credits", boldConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 - 150, "Artwork", boldConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 - 105, "Hazim Awad / Melissa Liu", smallConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 - 20, "Coding", boldConfig).setOrigin(0.5)
        this.add.text(game.config.width / 2, game.config.height / 2 + 20, "Justin Satriano", smallConfig).setOrigin(0.5);
        this.add.text(game.config.width / 2, game.config.height / 2 + 105, "Design / Sound Design", boldConfig).setOrigin(0.5)
        this.add.text(game.config.width / 2, game.config.height / 2 + 150, "Hazim Awad / Melissa Liu", smallConfig).setOrigin(0.5);
        this.add.text(tileSize, game.config.height  - (tileSize * 2) , "Return (C)", smallConfig).setOrigin(0);
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keyC)) {
            this.sound.play('sfx_select');
            this.scene.start('menuScene');
        }
    }
}