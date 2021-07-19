class level02 extends Phaser.Scene {
    constructor() {
        super("level02");
    }

    preload() {
        this.load.image("obstacle", "./assets/test-obstacle.png");
        this.load.image("lollipopSpike", "./assets/candycanespike.png");
        this.load.image("player", "./assets/Player.png");
        this.load.image("enemy", "./assets/Enemies.png");
        this.load.image("terrain", "./assets/block.png");
        this.load.image("bounceBlock", "./assets/block-bounce.png");
        this.load.image("flag", "./assets/test-flag.png");
        this.load.image("spark", "./assets/spark.png");
        this.load.image("vicText", "./assets/victory text.png");
    }

    create() {
        //reset variables
        this.playerDead = false;
        this.playerWin = false;
        this.goLeft01 = false;
        this.goRight01 = false;

        // set bounds of world so player can't walk off
        this.physics.world.setBounds(0, 0, game.config.width * 2.5, game.config.height , true, false, true, true);

        // add victory text and hide it
        this.vicText = this.add.tileSprite(1280, 0, 1280, 720, "vicText").setOrigin(0, 0);
        this.vicText.alpha = 0;
        this.vicText.depth = 3;

        // set gravity
        this.physics.world.gravity.y = 3000;
        
        this.obstacleTrigger = false;

        // create and play background music
        this.music = this.sound.add("sfx_music02", {
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
        this.player = this.physics.add.sprite(tileSize * 2, game.config.height - (tileSize * 25), "player").setScale(0.3);
        this.player.body.setCollideWorldBounds(true);
        this.player.setMaxVelocity(max_x_vel, max_y_vel);
        this.player.body.setSize(130, 171);

        // change background color
        this.cameras.main.setBackgroundColor("#227B96");
        
        // set up other camera options
        this.cameras.main.setBounds(0, 0, 2560, game.config.height);
        this.cameras.main.startFollow(this.player);

        // create platform group
        this.platforms = this.add.group();
        
        // ------- START OF LEVEL TERRAIN CREATION  -------
        this.createTerrainHorizontal(0, game.config.width * 2.5, game.config.height - tileSize);            //  base terrain

        this.createTerrainHorizontal(tileSize * 5, tileSize * 9, game.config.height - (tileSize * 5));      //
        this.createTerrainHorizontal(tileSize * 8, tileSize * 12, game.config.height - (tileSize * 6));     //  lighting shaped platform
        this.createTerrainHorizontal(tileSize * 11, tileSize * 15, game.config.height - (tileSize * 7));    //

        this.createTerrainHorizontal(tileSize * 20, tileSize * 28, game.config.height - (tileSize * 9));    //  platform after lighting shaped platform

        this.createTerrainHorizontal(tileSize * 12, tileSize * 15, game.config.height - (tileSize * 2));    //  tiny hill at start of level
        
        this.createTerrainHorizontal(tileSize * 26, tileSize * 49, game.config.height - (tileSize * 2));    // increase of terrain at middle of level

        this.createTerrainVertical(game.config.height - (tileSize * 20), game.config.height - (tileSize * 6), tileSize * 47);   //  left most vertical wall
        this.createTerrainHorizontal(tileSize * 48, tileSize * 49, game.config.height - (tileSize * 7));                        //  stubs on this wall
        this.createTerrainHorizontal(tileSize * 48, tileSize * 49, game.config.height - (tileSize * 14));                       //

        this.createTerrainVertical(game.config.height - (tileSize * 16), game.config.height - (tileSize * 1), tileSize * 55);   //  right most vertical wall
        this.createTerrainHorizontal(tileSize * 54, tileSize * 55, game.config.height - (tileSize * 3));                        //  stubs on this wall
        this.createTerrainHorizontal(tileSize * 54, tileSize * 55, game.config.height - (tileSize * 10));                       //
        this.createTerrainHorizontal(tileSize * 54, tileSize * 55, game.config.height - (tileSize * 2));                        //

        this.createTerrainHorizontal(tileSize * 55, tileSize * 72, game.config.height - (tileSize * 16));   // platform after vertical walls

        this.createTerrainVertical(game.config.height - (tileSize * 16), game.config.height - (tileSize * 5), tileSize * 76);   // left most wall

        this.createTerrainVertical(game.config.height - (tileSize * 12), game.config.height - (tileSize * 6), tileSize * 70);   //
        this.createTerrainVertical(game.config.height - (tileSize * 12), game.config.height - (tileSize * 6), tileSize * 60);   //  series of walls inside cube
        this.createTerrainVertical(game.config.height - (tileSize * 16), game.config.height - (tileSize * 9), tileSize * 65);   //

        this.createTerrainHorizontal(tileSize * 70, tileSize * 77, game.config.height - (tileSize * 12));   //
        this.createTerrainHorizontal(tileSize * 60, tileSize * 71, game.config.height - (tileSize * 6));    //  series of platforms inside cube
        this.createTerrainHorizontal(tileSize * 58, tileSize * 60, game.config.height - (tileSize * 12));   //
        this.createTerrainHorizontal(tileSize * 76, tileSize * 80, game.config.height - (tileSize * 16));
        
        this.createTerrainVertical(game.config.height - (tileSize * 12), game.config.height - (tileSize * 5), tileSize * 59);   //
        this.createTerrainVertical(game.config.height - (tileSize * 12), game.config.height - (tileSize * 5), tileSize * 71);   //
        this.createTerrainVertical(game.config.height - (tileSize * 12), game.config.height - (tileSize * 5), tileSize * 72);   //  filler terrain
        this.createTerrainVertical(game.config.height - (tileSize * 12), game.config.height - (tileSize * 5), tileSize * 73);   //
        this.createTerrainVertical(game.config.height - (tileSize * 12), game.config.height - (tileSize * 5), tileSize * 74);   //
        this.createTerrainVertical(game.config.height - (tileSize * 12), game.config.height - (tileSize * 5), tileSize * 75);   //
        this.createTerrainVertical(game.config.height - (tileSize * 16), game.config.height - (tileSize * 7), tileSize * 77);
        this.createTerrainVertical(game.config.height - (tileSize * 16), game.config.height - (tileSize * 7), tileSize * 78);
        this.createTerrainVertical(game.config.height - (tileSize * 16), game.config.height - (tileSize * 7), tileSize * 79);
        // ------- END OF LEVEL TERRAIN CREATION -------

        // set up collider for player and ground
        this.physics.add.collider(this.player, this.platforms);

        // create bounceBlock group
        this.bounceBlock = this.add.group();
        
        // create the bounce blocks
        this.createBounceBlock(tileSize * 61, tileSize * 63, game.config.height - (tileSize * 6) - 1);
        
        // create fake and real spike groups
        this.popFakeGroup = this.add.group();
        this.popRealGroup = this.add.group();

        // ------- CREATE ALL SPIKES -------
        this.createSpike(tileSize * 11, game.config.height - (tileSize * 2), true);     //  single spike at start

        this.createSpike(tileSize * 20, game.config.height - (tileSize * 10), false);   //
        this.createSpike(tileSize * 21, game.config.height - (tileSize * 10), false);   //
        this.createSpike(tileSize * 25, game.config.height - (tileSize * 10), true);    //  spikes on high platform
        this.createSpike(tileSize * 26, game.config.height - (tileSize * 10), true);    //
        this.createSpike(tileSize * 27, game.config.height - (tileSize * 10), true);    //

        this.createSpike(tileSize * 49, game.config.height - (tileSize * 2), true);     //
        this.createSpike(tileSize * 50, game.config.height - (tileSize * 2), true);     //
        this.createSpike(tileSize * 51, game.config.height - (tileSize * 2), true);     //   spikes in pit at vertical walls
        this.createSpike(tileSize * 52, game.config.height - (tileSize * 2), true);     //
        this.createSpike(tileSize * 53, game.config.height - (tileSize * 2), true);     // 

        this.createSpike(tileSize * 68, game.config.height - (tileSize * 7), true);     //   spikes inside cube
        this.createSpike(tileSize * 69, game.config.height - (tileSize * 7), true);     //
        // ------- FINISHED CREATING SPIKES -------

        this.enemyGroup = this.add.group();
        // create enemies
        this.enemy01 = this.physics.add.sprite(tileSize * 16, game.config.height - (tileSize * 3), "enemy").setScale(0.3);
        this.enemyGroup.add(this.enemy01);
        // set up colliders for player and enemies
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemy01, this.platforms);
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

        // patrolling movement for enemy01
        if(this.enemy01.x <= tileSize * 16) {
            this.enemy01.body.setVelocityX(0);
            this.time.delayedCall(300, () => { this.enemy01.body.setVelocityX(150); this.enemy01.resetFlip(); });
        }

        if(this.enemy01.x >= tileSize * 25) {
            this.enemy01.body.setVelocityX(0);
            this.time.delayedCall(300, () => { this.enemy01.body.setVelocityX(-150); this.enemy01.setFlip(true, false); });
        }

        // add colliders
        this.physics.world.collide(this.player, this.bounceBlock, this.playerBounce, null, this);
        this.physics.world.collide(this.player, this.popRealGroup, this.playerCollision, null, this);
        this.physics.world.collide(this.player, this.enemyGroup, this.playerCollision, null, this);
    }


    playerCollision() {
        this.playerDead = true;
        this.sound.play("sfx_death");
        this.cameras.main.shake(1500, 0.0025);
        this.player.destroy();
        this.time.delayedCall(1000, () => { this.scene.start("gameOverScene"); });
        this.music.stop();
    }

    playerBounce() {
        this.player.body.setVelocityY(jumpVelocity * 1.5);
        // this.sound.play("sfx_bounce");
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

    createTerrainVertical(start, finish, tile) {
        for(let i = start; i < finish; i += tileSize) {
            let groundTile = this.physics.add.sprite(tile, i, "terrain").setScale(0.5).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.platforms.add(groundTile);
        }
    }

    createBounceBlock(start, finish, height) {
        for(let i = start; i < finish; i += tileSize) {
            let bounce = this.physics.add.sprite(i, height, "bounceBlock").setScale(0.51).setOrigin(0);
            bounce.body.immovable = true;
            bounce.body.allowGravity = false;
            this.bounceBlock.add(bounce);
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