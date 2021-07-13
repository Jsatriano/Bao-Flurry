class Menu extends Phaser.Scene {
    constructor() {
        super("menuScene");
    }

    preload() {
        this.load.audio("sfx_select", "./assets/sfx/test-select.wav");
        this.load.audio("sfx_death", "./assets/sfx/test-death.wav");
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
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
    }

    update() {
        if(Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.sound.play("sfx_select");
            this.scene.start("level01");
        }
        
    }
}