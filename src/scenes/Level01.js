class Level01 extends Phaser.Scene {
    constructor() {
        super("level01");
    }

    preload() {
        this.load.atlas("platformer_atlas", "./assets/kenny_sheet.png", "./assets/kenny_sheet.json");
        this.load.image("obstacle", "./assets/test-obstacle.png");
        this.load.image("player", "./assets/Player.png");
        this.load.image("terrain", "./assets/block.png");
    }

    create() {
        this.playerDead = false;
        // set gravity setting
        this.physics.world.gravity.y = 3000;
        this.obstacleTrigger = false;

        // create keybinds
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        // change background color
        this.cameras.main.setBackgroundColor("#227B96");

        // create platform group
        this.platforms = this.add.group();
        for(let i = 0; i < game.config.width; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize, "terrain").setScale(0.55).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.platforms.add(groundTile);
        }
        for(let i = tileSize*2; i < game.config.width-tileSize*13; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, game.config.height - tileSize*9, "terrain").setScale(0.55).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.platforms.add(groundTile);
        }
        
        this.player = this.physics.add.sprite(centerX, centerY, "player").setScale(0.3);
        this.player.setMaxVelocity(max_x_vel, max_y_vel);
        this.player.body.setSize(150, 171);

        // set up collider for player and ground
        this.physics.add.collider(this.player, this.platforms);

        // create obstacle
        this.obstacle = new ObstacleDrop(this, centerX + 300, -64);
        this.obstacle.body.setAllowGravity(false);

        this.popReal = new LollipopOb(this, centerX + 128, game.config.height - (tileSize + 32));
        this.popFake = new LollipopOb(this, centerX - 128, game.config.height - (tileSize + 32));
        this.popReal.body.setAllowGravity(false);
        this.popFake.body.setAllowGravity(false);

    }

    update() {
        // set left and right movement
        if(!this.playerDead) {
            if(keyA.isDown) {
                this.player.body.setAccelerationX(-acceleration);
                this.player.setFlip(true, false);
            } else if(keyD.isDown) {
                this.player.body.setAccelerationX(acceleration);
                this.player.resetFlip();
            } else {
                this.player.body.setAccelerationX(0);
                this.player.body.setDragX(2500);
            }

            // allow player to jump
            if(this.player.body.touching.down && Phaser.Input.Keyboard.JustDown(keySPACE)) {
                this.player.body.setVelocityY(jumpVelocity);
            }
        }

        // trigger the obstacle to drop on the player
        if(this.player.x >= centerX + 32) {
            this.obstacleTrigger = true;
        }
        // once obstacle is triggered, move it through screen
        if(this.obstacleTrigger) {
            this.obstacle.body.y += 10;
        }

        this.physics.world.collide(this.player, this.obstacle, this.playerCollision, null, this);
        this.physics.world.collide(this.player, this.popReal, this.playerCollision, null, this);
    }

    playerCollision() {
        this.playerDead = true;
        this.sound.play("sfx_death");
        this.cameras.main.shake(1500, 0.0025);
        this.player.destroy();
        this.time.delayedCall(1000, () => { this.scene.start("gameOverScene"); });
    }
}