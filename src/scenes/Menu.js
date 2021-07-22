class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.audio("sfx_select", "./assets/sfx/test-select.wav");
        this.load.audio("sfx_death", "./assets/sfx/test-death.wav");
        this.load.audio("sfx_music01", "./assets/sfx/backgroundmusic01.wav");
        this.load.audio("sfx_music02", "./assets/sfx/backgroundmusic02.wav");
        this.load.audio("sfx_victory", "./assets/sfx/victory.wav");
        this.load.audio("sfx_jump", "./assets/sfx/jump.wav");
        this.load.audio("sfx_bounce", "./assets/sfx/bounce.wav");
    }

    create() {
        let tempText = {
            fontFamily: 'Verdana',
            fontSize: '32px',
            backgroundColor: '#fecc98',
            color: '#fd7f00',
            align: 'center',
            padding: {
            top: 5,
            bottom: 5,
            },
        }
        this.add.rectangle(0, 0, game.config.width, game.config.height, 0xFACADE).setOrigin(0, 0);
        this.add.text(centerX, centerY, "main menu", tempText).setOrigin(0.5);
        this.add.text(centerX, centerY + 64, "press (space) to play", tempText).setOrigin(0.5);

        // create keybinds
        keyS = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
        keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
        keyH = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.H);
    }

    update() {
        //this.scene.start("level02");
        if(Phaser.Input.Keyboard.JustDown(keyS)) {
            this.sound.play("sfx_select");
            this.scene.start("level01");
        }

        if(Phaser.Input.Keyboard.JustDown(keyC)) {
            this.sound.play("sfx_select");
            this.scene.start("creditScene");
        }
        if(Phaser.Input.Keyboard.JustDown(keyH)) {
            this.sound.play("sfx_select");
            this.scene.start("howtoplayScene");
        }
        
    }
}