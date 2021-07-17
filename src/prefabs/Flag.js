class Flag extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y) {
        super(scene, x, y, "flag");

        scene.add.existing(this);
        scene.physics.add.existing(this);

        this.setImmovable();

        
    }
}