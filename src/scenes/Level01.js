class Level01 extends Phaser.Scene {
    constructor() {
        super("level01");
    }

    preload() {
        this.load.image("obstacle", "./assets/test-obstacle.png");
        this.load.image("lollipopSpike", "./assets/candycanespike.png");
        this.load.image("player", "./assets/Player.png");
        this.load.image("terrain", "./assets/block.png");
        this.load.image("flag", "./assets/test-flag.png");
        this.load.image("spark", "./assets/spark.png");
        this.load.image("vicText", "./assets/victory text.png");
    }

    create() {
        //reset variables
        this.playerDead = false;
        this.playerWin = false;

        // set bounds of world so player can't walk off
        this.physics.world.setBounds(0, 0, game.config.width * 2, game.config.height , true, false, true, true);

        // add victory text and hide it
        this.vicText = this.add.tileSprite(1280, 0, 1280, 720, "vicText").setOrigin(0, 0);
        this.vicText.alpha = 0;
        this.vicText.depth = 3;
        
        // set gravity
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
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        
        // create the player
        this.player = this.physics.add.sprite(tileSize * 2, game.config.height - (tileSize * 3), "player").setScale(0.3);
        this.player.body.setCollideWorldBounds(true);
        this.player.setMaxVelocity(max_x_vel, max_y_vel);
        this.player.body.setSize(130, 171);
        
        // change background color
        this.cameras.main.setBackgroundColor("#227B96");

        // set up other camera options
        this.cameras.main.setBounds(0, 0, game.config.width * 2, game.config.height);
        this.cameras.main.startFollow(this.player);

        // create platform group
        this.platforms = this.add.group();
        
        // ------- START OF LEVEL TERRAIN CREATION  -------
        this.createTerrainHorizontal(0, game.config.width * 2, game.config.height - tileSize); // base terrain

        this.createTerrainHorizontal(tileSize * 12, tileSize * 34, game.config.height  - (tileSize * 2)); //
        this.createTerrainHorizontal(tileSize * 22, tileSize * 34, game.config.height  - (tileSize * 3)); //
        this.createTerrainHorizontal(tileSize * 24, tileSize * 34, game.config.height  - (tileSize * 4)); //  large hill in middle of map
        this.createTerrainHorizontal(tileSize * 26, tileSize * 34, game.config.height  - (tileSize * 5)); //
        this.createTerrainHorizontal(tileSize * 28, tileSize * 34, game.config.height  - (tileSize * 6)); //

        this.createTerrainHorizontal(tileSize * 41, tileSize * 51, game.config.height  - (tileSize * 2)); //  small landing hill
        this.createTerrainHorizontal(tileSize * 41, tileSize * 44, game.config.height  - (tileSize * 3)); // 

        this.createTerrainHorizontal(tileSize * 54, tileSize * 70, game.config.height  - (tileSize * 6)); //  floating platform
        // ------- END OF LEVEL TERRAIN CREATION -------

        // set up collider for player and ground
        this.physics.add.collider(this.player, this.platforms);

        // create drop down obstacle
        this.obstacle = new ObstacleDrop(this, tileSize * 35, -64).setScale(2).setOrigin(0);
        this.obstacle.body.setAllowGravity(false);
        this.obstacle.depth = -1;

        // create fake and real spike groups
        this.popFakeGroup = this.add.group();
        this.popRealGroup = this.add.group();

        // ------- CREATE ALL SPIKES -------
        this.createSpike(tileSize * 14, game.config.height - (tileSize * 3), true);     // 
        this.createSpike(tileSize * 15, game.config.height - (tileSize * 3), false);    //
        this.createSpike(tileSize * 16, game.config.height - (tileSize * 3), false);    //  first batch of spikes
        this.createSpike(tileSize * 17, game.config.height - (tileSize * 3), false);    //
        this.createSpike(tileSize * 18, game.config.height - (tileSize * 3), false);    //
        this.createSpike(tileSize * 19, game.config.height - (tileSize * 3), true);     //
        
        this.createSpike(tileSize * 34, game.config.height - (tileSize * 2), true);     //
        this.createSpike(tileSize * 35, game.config.height - (tileSize * 2), true);     //
        this.createSpike(tileSize * 36, game.config.height - (tileSize * 2), true);     //
        this.createSpike(tileSize * 37, game.config.height - (tileSize * 2), true);     //  batch of spikes at the bottom of pit
        this.createSpike(tileSize * 38, game.config.height - (tileSize * 2), true);     //
        this.createSpike(tileSize * 39, game.config.height - (tileSize * 2), true);     //
        this.createSpike(tileSize * 40, game.config.height - (tileSize * 2), true);     //

        this.createSpike(tileSize * 60, game.config.height - (tileSize * 2), false);    //
        this.createSpike(tileSize * 61, game.config.height - (tileSize * 2), false);    //  batch of spikes underneath floating platform
        this.createSpike(tileSize * 62, game.config.height - (tileSize * 2), false);    //
        this.createSpike(tileSize * 63, game.config.height - (tileSize * 2), false);    //

        this.createSpike(tileSize * 58, game.config.height - (tileSize * 7), true);     //
        this.createSpike(tileSize * 59, game.config.height - (tileSize * 7), true);     //
        this.createSpike(tileSize * 60, game.config.height - (tileSize * 7), true);     //  batch of spikes on top of floating platform
        this.createSpike(tileSize * 64, game.config.height - (tileSize * 7), true);     //
        this.createSpike(tileSize * 65, game.config.height - (tileSize * 7), true);     //
        // ------- FINISHED CREATING SPIKES -------
        
        // create end of level flag
        this.flag = new Flag(this, 2560 - tileSize, game.config.height - (tileSize * 1)).setOrigin(1);
        this.flag.body.setAllowGravity(false);
        this.flag.body.setSize(24, 192);
        this.flag.depth = 2;

        // if player collides with the flag, do whatever levelWin funsion does
        let flagCollider = this.physics.add.collider(this.player, this.flag, this.levelWin, function ()
        {
            this.physics.world.removeCollider(flagCollider);
        }, this);


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

        if(this.playerWin) {
            if(Phaser.Input.Keyboard.JustDown(keyR)) {
                this.sound.play("sfx_select");
                this.scene.start("level02");
            }
            if(Phaser.Input.Keyboard.JustDown(keySPACE)) {
                this.sound.play("sfx_select");
                this.scene.start("menuScene");
            }
        }

        // trigger the obstacle to drop on the player
        if(this.player.x >= tileSize * 33) {
            this.obstacleTrigger = true;
        }
        // once obstacle is triggered, move it through screen
        if(this.obstacleTrigger) {
            this.obstacle.body.y += 15;
        }

        // if player collides with bad stuff, do whatever playerCollision function does
        this.physics.world.collide(this.player, this.obstacle, this.playerCollision, null, this);
        this.physics.world.collide(this.player, this.popRealGroup, this.playerCollision, null, this);
    }

    playerCollision() {
        this.playerDead = true;
        this.sound.play("sfx_death");
        this.cameras.main.shake(1500, 0.0025);
        this.player.destroy();
        this.time.delayedCall(1000, () => { this.scene.start("gameOverScene"); });
        this.music.stop();
    }

    levelWin() {
        this.music.stop();
        this.sound.play("sfx_victory", {volume: 0.2});
        this.playerDead = true;
        this.playerWin = true;
        let sparks = this.add.particles('spark');    
        let emitter = sparks.createEmitter();
        
        emitter.setPosition(this.flag.x - 32, this.flag.y - 185);
        emitter.setSpeed(45);
        emitter.setScale(0.7);
        emitter.setLifespan(850);

        this.vicText.alpha = 1;
        //this.time.delayedCall(3000, () => { this.scene.start("menuScene"); });
    }

    createTerrainHorizontal(start, finish, height) {
        for(let i = start; i < finish; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, height, "terrain").setScale(0.5).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.platforms.add(groundTile);
        }
    }

    createSpike(x, y, Boolean) {
        this.lollipopSpike = new LollipopOb(this, x, y).setScale(0.5).setOrigin(0);
        this.lollipopSpike.body.setAllowGravity(false);
        if(Boolean) {
            this.popRealGroup.add(this.lollipopSpike);
        } else {
            this.popFakeGroup.add(this.lollipopSpike);
        }
    }
}