class Victory extends Phaser.Scene {
    constructor() {
        super("victoryScene");
    }

    create() {

        this.menu = this.add.tileSprite(0, 0, 1280, 720, "victory").setOrigin(0,0);

        // create keybinds
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyC = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.C);
    }

    update() {
        //this.scene.start("level02");
        if(Phaser.Input.Keyboard.JustDown(keySPACE)) {
            this.sound.play("sfx_select");
            this.scene.start("menuScene");
        }

        if(Phaser.Input.Keyboard.JustDown(keyC)) {
            this.sound.play("sfx_select");
            this.scene.start("creditScene");
        }
    }
    

}