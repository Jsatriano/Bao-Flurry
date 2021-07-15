class Level01 extends Phaser.Scene {
    constructor() {
        super("level01");
    }

    preload() {
        this.load.atlas("platformer_atlas", "./assets/kenny_sheet.png", "./assets/kenny_sheet.json");
        this.load.image("obstacle", "./assets/test-obstacle.png");
        this.load.image("player", "./assets/Player.png");
        this.load.image("terrain", "./assets/block.png");
        this.load.tilemapTiledJSON("level01", "./assets/Level01Tilemap.json");
    }

    create() {

        // ********************* LEVEL 1  TO DO *************************
        // NEED SPIKE ASSETS
        // ADD SPIKES TO START OF LEVEL (BEFORE HILL)
        // MOVE MOVING OBSTACLE TO  MIDDLE OF PIT
        // ADD SPIKES TO PIT
        // ADD REAL / FAKE SPIKES TO OVER AND UNDER FLOATING PLATFORM AS WELL AS ANOTHER MOVING OBSTACLE

        // create the map
        // this.map = this.add.tilemap("level01");
        // this.tileset = this.map.addTilesetImage("BLOCK", "terrain");
        // this.drawLayer = this.map.createLayer("Tile Layer 1", this.tileset, 0, 0);
        // this.drawLayer.setCollisionBetween([0], true);
        // this.physics.world.enable(this.drawLayer);
        // this.drawLayer.body.setAllowGravity(false);

        //reset variables
        this.playerDead = false;
        
        // set gravity setting
        this.physics.world.gravity.y = 3000;
        this.obstacleTrigger = false;

        // create and play background music
        this.music = this.sound.add("sfx_music01", {
            mute: false,
            volume: 0.1,
            loop: true
        });
        this.music.play();

        // create keybinds
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        // create the player
        this.player = this.physics.add.sprite(centerX, centerY, "player").setScale(0.3);
        this.player.setMaxVelocity(max_x_vel, max_y_vel);
        this.player.body.setSize(150, 171);
        
        // change background color
        this.cameras.main.setBackgroundColor("#227B96");
        // set up other camera options
        this.cameras.main.setBounds(0, 0, 2560, game.config.height);
        this.cameras.main.startFollow(this.player);

        // create platform group
        this.platforms = this.add.group();
        
        // ------- START OF LEVEL TERRAIN CREATION  -------
        this.createTerrain(0, 2560, game.config.height - tileSize); // base terrain

        this.createTerrain(tileSize * 12, tileSize * 34, game.config.height  - (tileSize * 2)); //
        this.createTerrain(tileSize * 22, tileSize * 34, game.config.height  - (tileSize * 3)); //
        this.createTerrain(tileSize * 24, tileSize * 34, game.config.height  - (tileSize * 4)); //  large hill in middle of map
        this.createTerrain(tileSize * 26, tileSize * 34, game.config.height  - (tileSize * 5)); //
        this.createTerrain(tileSize * 28, tileSize * 34, game.config.height  - (tileSize * 6)); //

        this.createTerrain(tileSize * 41, tileSize * 51, game.config.height  - (tileSize * 2)); //  small landing hill
        this.createTerrain(tileSize * 41, tileSize * 44, game.config.height  - (tileSize * 3)); // 

        this.createTerrain(tileSize * 54, tileSize * 70, game.config.height  - (tileSize * 6)); //  flaoting platform
        // ------- END OF LEVEL TERRAIN CREATION -------

        // set up collider for player and ground
        this.physics.add.collider(this.player, this.platforms);

        // create obstacle
        this.obstacle = new ObstacleDrop(this, tileSize * 37, -64);
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
        if(this.player.x >= tileSize * 33) {
            this.obstacleTrigger = true;
        }
        // once obstacle is triggered, move it through screen
        if(this.obstacleTrigger) {
            this.obstacle.body.y += 12;
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

    createTerrain(start, finish, height) {
        for(let i = start; i < finish; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, height, "terrain").setScale(0.5).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.platforms.add(groundTile);
        }
    }
}