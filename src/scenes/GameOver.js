class GameOver extends Phaser.Scene {
    constructor() {
        super("gameOverScene");
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
        this.add.text(centerX, centerY - 64, "game over", tempText).setOrigin(0.5);
        this.add.text(centerX, centerY, "press (R) to restart level", tempText).setOrigin(0.5);
        this.add.text(centerX, centerY + 64, "press (space) to return to main menu", tempText).setOrigin(0.5);

        // create keybinds
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

    }

    update() {
        if(onLevel01) {
            if(Phaser.Input.Keyboard.JustDown(keyR)) {
                this.sound.play("sfx_select");
                this.scene.start("level01");
            }
        }
        if(onLevel02) {
            if(Phaser.Input.Keyboard.JustDown(keyR)) {
                this.sound.play("sfx_select");
                this.scene.start("level02");
            }
        }
        
        if(Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.sound.play("sfx_select");
            this.scene.start("menuScene");
        }
    }
}