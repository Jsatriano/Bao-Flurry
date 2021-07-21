class level02 extends Phaser.Scene {
    constructor() {
        super("level02");
    }

    preload() {
        this.load.image("obstacle", "./assets/test-obstacle.png");
        this.load.image("lollipopSpike", "./assets/candycanespike.png");
        this.load.image("player", "./assets/Player.png");
        this.load.image("enemy", "./assets/Enemy.png");
        this.load.image("terrain", "./assets/block.png");
        this.load.image("bounceBlock", "./assets/block-bounce.png");
        this.load.image("flag", "./assets/test-flag.png");
        this.load.image("spark", "./assets/spark.png");
        this.load.image("vicText", "./assets/victory text.png");
        this.load.spritesheet("player_walk", "./assets/Player.png", {frameWidth: 771, frameHeight: 731, startFrame: 0, endFrame: 0});
        this.load.spritesheet("player_idle", "./assets/Player_Idle.png", {frameWidth: 796, frameHeight: 771, startFrame: 0, endFrame: 4});
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
        this.vicText = this.add.tileSprite(game.config.width * 1.5, 0, 1280, 720, "vicText").setOrigin(0, 0);
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

        // create idle animation for player
        this.anims.create({
            key: 'player-idle',
            frames: this.anims.generateFrameNumbers('player_idle', { start: 0, end: 4, first: 0}),
            frameRate: 8,
            loop: true
        });
        // create walk animation for player
        this.anims.create({
            key: 'player-walk',
            frames: this.anims.generateFrameNumbers('player_walk', { start: 0, end: 0, first: 0}),
            frameRate: 8,
            loop: true
        });

        // create keybinds
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // create the player
        this.player = this.physics.add.sprite(tileSize * 2, game.config.height - (tileSize * 3), "player").setScale(0.085);
        this.player.body.setCollideWorldBounds(true);
        this.player.setMaxVelocity(max_x_vel, max_y_vel);
        this.player.body.setSize(450, 731);

        // change background color
        this.cameras.main.setBackgroundColor("#227B96");
        
        // set up other camera options
        this.cameras.main.setBounds(0, 0, game.config.width * 2.5, game.config.height);
        this.cameras.main.startFollow(this.player);

        // create platform group
        this.platforms = this.add.group();
        
        // ------- START OF LEVEL TERRAIN CREATION  -------
        this.createTerrainHorizontal(0, game.config.width * 2.5, game.config.height - tileSize);                                //  base terrain

        this.createTerrainHorizontal(tileSize * 5, tileSize * 9, game.config.height - (tileSize * 5));                          //
        this.createTerrainHorizontal(tileSize * 8, tileSize * 12, game.config.height - (tileSize * 6));                         //  lighting shaped platform
        this.createTerrainHorizontal(tileSize * 11, tileSize * 15, game.config.height - (tileSize * 7));                        //

        this.createTerrainHorizontal(tileSize * 20, tileSize * 28, game.config.height - (tileSize * 9));                        //  platform after lighting shaped platform

        this.createTerrainHorizontal(tileSize * 12, tileSize * 15, game.config.height - (tileSize * 2));                        //  tiny hill at start of level
        
        this.createTerrainHorizontal(tileSize * 26, tileSize * 49, game.config.height - (tileSize * 2));                        // increase of terrain at middle of level

        this.createTerrainVertical(game.config.height - (tileSize * 20), game.config.height - (tileSize * 6), tileSize * 47);   //  left most vertical wall
        this.createTerrainHorizontal(tileSize * 48, tileSize * 49, game.config.height - (tileSize * 7));                        //  stubs on this wall
        this.createTerrainHorizontal(tileSize * 48, tileSize * 49, game.config.height - (tileSize * 14));                       //

        this.createTerrainVertical(game.config.height - (tileSize * 16), game.config.height - (tileSize * 1), tileSize * 55);   //  right most vertical wall
        this.createTerrainHorizontal(tileSize * 54, tileSize * 55, game.config.height - (tileSize * 3));                        //  stubs on this wall
        this.createTerrainHorizontal(tileSize * 54, tileSize * 55, game.config.height - (tileSize * 10));                       //
        this.createTerrainHorizontal(tileSize * 54, tileSize * 55, game.config.height - (tileSize * 2));                        //

        this.createTerrainHorizontal(tileSize * 55, tileSize * 72, game.config.height - (tileSize * 16));                       // platform after vertical walls

        this.createTerrainVertical(game.config.height - (tileSize * 16), game.config.height - (tileSize * 5), tileSize * 76);   // left most wall

        this.createTerrainVertical(game.config.height - (tileSize * 12), game.config.height - (tileSize * 6), tileSize * 70);   //
        this.createTerrainVertical(game.config.height - (tileSize * 12), game.config.height - (tileSize * 6), tileSize * 60);   //  series of walls inside cube
        this.createTerrainVertical(game.config.height - (tileSize * 16), game.config.height - (tileSize * 9), tileSize * 65);   //

        this.createTerrainHorizontal(tileSize * 80, tileSize * 87, game.config.height - (tileSize * 16));                       // floating platrom with fake flag
        this.createTerrainVertical(game.config.height - (tileSize * 23), game.config.height - (tileSize * 15), tileSize * 87);  // wall near fake flag
        
        this.createTerrainHorizontal(tileSize * 70, tileSize * 77, game.config.height - (tileSize * 12));                       //
        this.createTerrainHorizontal(tileSize * 60, tileSize * 71, game.config.height - (tileSize * 6));                        //  series of platforms inside cube
        this.createTerrainHorizontal(tileSize * 58, tileSize * 60, game.config.height - (tileSize * 12));                       //
        this.createTerrainHorizontal(tileSize * 76, tileSize * 80, game.config.height - (tileSize * 16));                       //

        this.createTerrainHorizontal(tileSize * 92, game.config.width * 2.5, game.config.height - (tileSize * 11));             // platform with real flag
        this.createTerrainVertical(game.config.height - (tileSize * 11), game.config.height, tileSize * 92);                    // wall near real flag
        
        this.createTerrainVertical(game.config.height - (tileSize * 12), game.config.height - (tileSize * 5), tileSize * 59);  //
        this.createTerrainVertical(game.config.height - (tileSize * 12), game.config.height - (tileSize * 5), tileSize * 71);  //
        this.createTerrainVertical(game.config.height - (tileSize * 12), game.config.height - (tileSize * 5), tileSize * 72);  //  
        this.createTerrainVertical(game.config.height - (tileSize * 12), game.config.height - (tileSize * 5), tileSize * 73);  //
        this.createTerrainVertical(game.config.height - (tileSize * 12), game.config.height - (tileSize * 5), tileSize * 74);  //
        this.createTerrainVertical(game.config.height - (tileSize * 12), game.config.height - (tileSize * 5), tileSize * 75);  //
        this.createTerrainVertical(game.config.height - (tileSize * 16), game.config.height - (tileSize * 7), tileSize * 77);  //
        this.createTerrainVertical(game.config.height - (tileSize * 16), game.config.height - (tileSize * 7), tileSize * 78);  //
        this.createTerrainVertical(game.config.height - (tileSize * 16), game.config.height - (tileSize * 7), tileSize * 79);  //  filler terrain
        this.createTerrainVertical(game.config.height - (tileSize * 10), game.config.height, tileSize * 93);                   //
        this.createTerrainVertical(game.config.height - (tileSize * 10), game.config.height, tileSize * 94);                   //
        this.createTerrainVertical(game.config.height - (tileSize * 10), game.config.height, tileSize * 95);                   //
        this.createTerrainVertical(game.config.height - (tileSize * 10), game.config.height, tileSize * 96);                   //
        this.createTerrainVertical(game.config.height - (tileSize * 10), game.config.height, tileSize * 97);                   //
        this.createTerrainVertical(game.config.height - (tileSize * 10), game.config.height, tileSize * 98);                   //
        this.createTerrainVertical(game.config.height - (tileSize * 10), game.config.height, tileSize * 99);                   //
        // ------- END OF LEVEL TERRAIN CREATION -------

        // set up collider for player and ground
        this.physics.add.collider(this.player, this.platforms);

        // create bounceBlock group
        this.bounceBlock = this.add.group();
        
        // create the bounce blocks
        this.createBounceBlock(tileSize * 61, tileSize * 63, game.config.height - (tileSize * 6) - 1);  // bounce blocks inside cube

        this.createBounceBlock(tileSize * 86, tileSize * 89, game.config.height - (tileSize * 1) - 1);  // bounce blocks before real flag

        
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

        this.createSpike(tileSize * 76, game.config.height - (tileSize * 17), true);    //  spikes leading to fake flag
        this.createSpike(tileSize * 79, game.config.height - (tileSize * 17), true);    //

        this.createSpike(tileSize * 68, game.config.height - (tileSize * 7), true);     //   spikes inside cube
        this.createSpike(tileSize * 69, game.config.height - (tileSize * 7), true);     //
        this.createSpike(tileSize * 63, game.config.height - (tileSize * 2), false);    //
        this.createSpike(tileSize * 70, game.config.height - (tileSize * 2), false);    //
        
        // ------- FINISHED CREATING SPIKES -------

        this.enemyGroup = this.add.group();
        // create enemies
        this.enemy01 = this.physics.add.sprite(tileSize * 16, game.config.height - (tileSize * 3), "enemy").setScale(0.1);
        this.enemy01.body.setSize(500, 820);
        this.enemyGroup.add(this.enemy01);
        this.enemy02 = this.physics.add.sprite(tileSize * 56, game.config.height - (tileSize * 19), "enemy").setScale(0.11);
        this.enemy02.body.setSize(500, 820);
        this.enemyGroup.add(this.enemy02);
        this.enemy03= this.physics.add.sprite(tileSize * 57, game.config.height - (tileSize * 2), "enemy").setScale(0.06);
        this.enemy03.body.setSize(500, 820);
        this.enemyGroup.add(this.enemy03);
        // set up colliders for player and enemies
        this.physics.add.collider(this.player, this.platforms);
        this.physics.add.collider(this.enemyGroup, this.platforms);

        // create end of level flag
        this.flag = new Flag(this, game.config.width * 2.5 - (tileSize * 2), game.config.height - (tileSize * 11)).setOrigin(1);
        this.flag.body.setAllowGravity(false);
        this.flag.body.setSize(24, 192);
        this.flag.depth = 2;

        // if player collides with the flag, do whatever levelWin funsion does
        let flagCollider = this.physics.add.collider(this.player, this.flag, this.levelWin, function ()
        {
            this.physics.world.removeCollider(flagCollider);
        }, this);

        this.fakeFlag = new Flag(this, tileSize * 86, game.config.height - (tileSize * 16)).setOrigin(1);
        this.fakeFlag.body.setAllowGravity(false);
        this.fakeFlag.body.setSize(24, 192);
        this.fakeFlag.depth = 2;

        // create drop down obstacle
        this.obstacle = new ObstacleDrop(this, tileSize * 81, -64).setScale(2).setOrigin(0);
        this.obstacle.body.setAllowGravity(false);
        this.obstacle.depth = -1;

    }

    update() {
        // set left and right movement
        if(!this.playerDead) {
            if(keyA.isDown) {
                this.player.body.setAccelerationX(-acceleration);
                this.player.setFlip(true, false);
                this.player.anims.play("player-walk", true);
            } else if(keyD.isDown) {
                this.player.body.setAccelerationX(acceleration);
                this.player.resetFlip();
                this.player.anims.play("player-walk", true);
            } else {
                this.player.body.setAccelerationX(0);
                this.player.body.setDragX(2500);
                this.player.anims.play("player-idle", true);
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
        // patrolling movement for enemy02
        if(this.enemy02.x <= tileSize * 56) {
            this.enemy02.body.setVelocityX(0);
            this.time.delayedCall(500, () => { this.enemy02.body.setVelocityX(150); this.enemy02.resetFlip(); });
        }

        if(this.enemy02.x >= tileSize * 70) {
            this.enemy02.body.setVelocityX(0);
            this.time.delayedCall(1500, () => { this.enemy02.body.setVelocityX(-150); this.enemy02.setFlip(true, false); });
        }
        // patrolling movement for enemy03
        if(this.enemy03.x <= tileSize * 57) {
            this.enemy03.body.setVelocityX(0);
            this.time.delayedCall(100, () => { this.enemy03.body.setVelocityX(225); this.enemy03.resetFlip(); });
        }

        if(this.enemy03.x >= tileSize * 76) {
            this.enemy03.body.setVelocityX(0);
            this.time.delayedCall(100, () => { this.enemy03.body.setVelocityX(-225); this.enemy03.setFlip(true, false); });
        }

        // trigger the obstacle to drop on the player
        if(this.player.x >= tileSize * 78.5 && this.player.x <= tileSize * 79  && this.player.y <= game.config.height - (tileSize * 10)) {
            this.obstacleTrigger = true;
        }
        // once obstacle is triggered, move it through screen
        if(this.obstacleTrigger) {
            this.obstacle.body.y += 10;
        }

        // if player has  reached the flag, new keybinds are available
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

        // add colliders
        this.physics.world.collide(this.player, this.bounceBlock, this.playerBounce, null, this);
        this.physics.world.collide(this.player, this.popRealGroup, this.playerCollision, null, this);
        this.physics.world.collide(this.player, this.enemyGroup, this.playerCollision, null, this);
        this.physics.world.collide(this.player, this.obstacle, this.playerCollision, null, this);
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