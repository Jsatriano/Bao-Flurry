class level02 extends Phaser.Scene {
    constructor() {
        super("level02");
    }

    preload() {
        this.load.image("claw", "./assets/claw.png");
        this.load.image("lollipopSpike", "./assets/candycanespike.png");
        this.load.image("player", "./assets/Player.png");
        this.load.image("enemy", "./assets/Enemy.png");
        this.load.image("terrain2", "./assets/blockBorder2.png");
        this.load.image("bounceBlock", "./assets/block-bounce.png");
        this.load.image("flag", "./assets/test-flag.png");
        this.load.image("spark", "./assets/spark.png");
        this.load.image("vicText", "./assets/victory text.png");
        this.load.image("cloud", "./assets/cloud.png");
        this.load.spritesheet("player_walk", "./assets/Animations/PlayerRunAnim.png", {frameWidth: 200, frameHeight: 189, startFrame: 0, endFrame: 8});
        this.load.spritesheet("player_idle", "./assets/Animations/PlayerIdleAnim.png", {frameWidth: 191, frameHeight: 185, startFrame: 0, endFrame: 4});
        this.load.spritesheet("player_jump", "./assets/Animations/PlayerJumpAnim.png", {frameWidth: 210, frameHeight: 185, startFrame: 0, endFrame: 1});
        this.load.spritesheet("enemy_idle", "./assets/Animations/EnemyIdleAnim.png", {frameWidth: 150, frameHeight: 210, startFrame: 0, endFrame: 4});
        this.load.spritesheet("enemy_walk", "./assets/Animations/EnemyRunAnim.png", {frameWidth: 150, frameHeight: 210, startFrame: 0, endFrame: 4});
        this.load.spritesheet("player_deathEnemy", "./assets/Animations/PlayerDeath(1)Anim.png", {frameWidth: 180, frameHeight: 181, startFrame: 0, endFrame: 3});
        this.load.spritesheet("player_deathClaw", "./assets/Animations/PlayerDeath(2)Anim.png", {frameWidth: 180, frameHeight: 191, startFrame: 0, endFrame: 4});
        this.load.spritesheet("player_deathSpike", "./assets/Animations/PlayerDeath(3)Anim.png", {frameWidth: 180, frameHeight: 191, startFrame: 0, endFrame: 3});
    }

    create() {
        //reset variables
        this.playerDead = false;
        this.playerWin = false;
        this.enemy01Move = false;
        this.enemy02Move = false;
        this.enemy03Move = false;
        this.obstacleTrigger = false;
        this.obstacleRetract = false;
        onLevel02 = true;
        
        // set bounds of world so player can't walk off
        this.physics.world.setBounds(0, 0, game.config.width * 2.5, game.config.height , true, false, true, true);

        // set gravity
        this.physics.world.gravity.y = 3000;

        // create cloud objects for parallax scrolling
        this.cloud01 = this.physics.add.sprite(2000, 150, "cloud").setScale(1.2);
        this.cloud01.body.setAllowGravity(false).setVelocityX(70);
        this.cloud02 = this.physics.add.sprite(100, 50, "cloud").setScale(0.4);
        this.cloud02.body.setAllowGravity(false).setVelocityX(130);
        this.cloud02.depth = -2;
        this.cloud03 = this.physics.add.sprite(1000, 200, "cloud").setScale(0.7);
        this.cloud03.body.setAllowGravity(false).setVelocityX(100);
        this.cloud04 = this.physics.add.sprite(2800, 400, "cloud").setScale(1.5);
        this.cloud04.body.setAllowGravity(false).setVelocityX(40);

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
            frameRate: 10,
            loop: true
        });
        // create walk animation for player
        this.anims.create({
            key: 'player-walk',
            frames: this.anims.generateFrameNumbers('player_walk', { start: 0, end: 8, first: 0}),
            frameRate: 15,
            loop: true
        });
        // create jump animation for player
        this.anims.create({
            key: 'player-jump',
            frames: this.anims.generateFrameNumbers('player_jump', { start: 0, end: 1, first: 0}),
            frameRate: 15,
        });
        // create idle animation for enemy
        this.anims.create({
            key: 'enemy-idle',
            frames: this.anims.generateFrameNumbers('enemy_idle', { start: 0, end: 4, first: 0}),
            frameRate: 10,
            loop: true
        });
        // create walking animation for enemy
        this.anims.create({
            key: 'enemy-walk',
            frames: this.anims.generateFrameNumbers('enemy_walk', { start: 0, end: 4, first: 0}),
            frameRate: 10,
            loop: true
        });
        // create death by claw player anim
        this.anims.create({
            key: 'death-claw',
            frames: this.anims.generateFrameNumbers('player_deathClaw', { start: 0, end: 4, first: 0}),
            frameRate: 10
        });
        // create death by spike player anim
        this.anims.create({
            key: 'death-spike',
            frames: this.anims.generateFrameNumbers('player_deathSpike', { start: 0, end: 3, first: 0}),
            frameRate: 10
        });
        // create death by enemy player anim
        this.anims.create({
            key: 'death-enemy',
            frames: this.anims.generateFrameNumbers('player_deathEnemy', { start: 0, end: 3, first: 0}),
            frameRate: 10
        });

        // create keybinds
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keySPACE = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);

        // create the player
        this.player = this.physics.add.sprite(tileSize * 2, game.config.height - (tileSize * 3), "player").setScale(0.3);
        this.player.body.setCollideWorldBounds(true);
        this.player.setMaxVelocity(max_x_vel, max_y_vel);
        this.player.body.setSize(130, 185);

        // change background color
        this.cameras.main.setBackgroundColor("#3B75A5");
        
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
        this.createSpike(tileSize * 80, game.config.height - (tileSize * 17), true);    //

        this.createSpike(tileSize * 68, game.config.height - (tileSize * 7), true);     //   spikes inside cube
        this.createSpike(tileSize * 69, game.config.height - (tileSize * 7), true);     //
        this.createSpike(tileSize * 63, game.config.height - (tileSize * 2), false);    //
        this.createSpike(tileSize * 70, game.config.height - (tileSize * 2), true);     //
        // ------- FINISHED CREATING SPIKES -------

        // create enemy group
        this.enemyGroup = this.add.group();
        // create enemies
        this.enemy01 = this.physics.add.sprite(tileSize * 16, game.config.height - (tileSize * 3), "enemy").setScale(0.3);
        this.enemy01.body.setSize(120, 201);
        this.enemyGroup.add(this.enemy01);
        this.enemy02 = this.physics.add.sprite(tileSize * 56, game.config.height - (tileSize * 19), "enemy").setScale(0.45);
        this.enemy02.body.setSize(120, 201);
        this.enemyGroup.add(this.enemy02);
        this.enemy03= this.physics.add.sprite(tileSize * 57, game.config.height - (tileSize * 2), "enemy").setScale(0.21);
        this.enemy03.body.setSize(120, 201);
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
        this.obstacle = new ObstacleDrop(this, tileSize * 87, -64).setScale(1.4).setOrigin(1);
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

            // play jump animation
            if(!this.player.body.touching.down) {
                this.player.anims.play("player-jump", true);
                this.justJumped = true;
                
            }

            // allow player to jump
            if(this.player.body.touching.down && Phaser.Input.Keyboard.JustDown(keySPACE)) {
                this.player.body.setVelocityY(jumpVelocity);
                this.sound.play("sfx_bounce", {volume: 0.2});
            }

            // trigger the obstacle to drop on the player
            if(this.player.x >= tileSize * 78.5 && this.player.x <= tileSize * 79  && this.player.y <= game.config.height - (tileSize * 10)) {
                this.obstacleTrigger = true;
            }
            // once obstacle is triggered, move it through screen
            if(this.obstacleTrigger) {
                this.obstacle.body.y += 10;
            }
            // once obstacle reaches bottom of screen, retract it
            if(this.obstacle.y >= game.config.height - (tileSize * 16)) {
                this.obstacleTrigger = false;
                this.obstacleRetract = true;
            }
            // move it back up
            if(this.obstacleRetract) {
                this.obstacle.body.y -= 12;
            }
        }

        // patrolling movement for enemy01
        if(this.enemy01.x <= tileSize * 16) {
            this.enemy01Move = false;
            this.enemy01.body.setVelocityX(0);
            this.enemy01.anims.play("enemy-idle", true);
            this.time.delayedCall(300, () => { this.enemy01.body.setVelocityX(150); this.enemy01.resetFlip(); this.enemy01.anims.stop("enemy-idle"); this.enemy01Move = true; });
        }

        if(this.enemy01.x >= tileSize * 25) {
            this.enemy01Move = false;
            this.enemy01.body.setVelocityX(0);
            this.enemy01.anims.play("enemy-idle", true);
            this.time.delayedCall(300, () => { this.enemy01.body.setVelocityX(-150); this.enemy01.setFlip(true, false); this.enemy01.anims.stop("enemy-idle"); this.enemy01Move = true; });
        }
        // patrolling movement for enemy02
        if(this.enemy02.x <= tileSize * 56) {
            this.enemy02Move = false;
            this.enemy02.body.setVelocityX(0);
            this.enemy02.anims.play("enemy-idle", true);
            this.time.delayedCall(500, () => { this.enemy02.body.setVelocityX(150); this.enemy02.resetFlip(); this.enemy02.anims.stop("enemy-idle"); this.enemy02Move = true; });
        }

        if(this.enemy02.x >= tileSize * 70) {
            this.enemy02Move = false;
            this.enemy02.body.setVelocityX(0);
            this.enemy02.anims.play("enemy-idle", true);
            this.time.delayedCall(1500, () => { this.enemy02.body.setVelocityX(-150); this.enemy02.setFlip(true, false); this.enemy02.anims.stop("enemy-idle"); this.enemy02Move = true; });
        }
        // patrolling movement for enemy03
        if(this.enemy03.x <= tileSize * 57) {
            this.enemy03Move = false;
            this.enemy03.body.setVelocityX(0);
            this.enemy03.anims.play("enemy-idle", true);
            this.time.delayedCall(100, () => { this.enemy03.body.setVelocityX(225); this.enemy03.resetFlip(); this.enemy03.anims.stop("enemy-idle"); this.enemy03Move = true; });
        }

        if(this.enemy03.x >= tileSize * 76) {
            this.enemy03Move = false;
            this.enemy03.body.setVelocityX(0);
            this.enemy03.anims.play("enemy-idle", true);
            this.time.delayedCall(100, () => { this.enemy03.body.setVelocityX(-225); this.enemy03.setFlip(true, false); this.enemy03.anims.stop("enemy-idle"); this.enemy03Move = true; });
        }

        if(this.enemy01Move) {
            this.enemy01.anims.play("enemy-walk", true);
        }
        if(this.enemy02Move) {
            this.enemy02.anims.play("enemy-walk", true);
        }
        if(this.enemy03Move) {
            this.enemy03.anims.play("enemy-walk", true);
        }

        // if player has  reached the flag, new keybinds are available
        if(this.playerWin) {
            this.time.delayedCall(3000, () => { this.scene.start("victoryScene"); });
        }

        // add colliders
        this.physics.world.collide(this.player, this.bounceBlock, this.playerBounce, null, this);
        this.physics.world.collide(this.player, this.popRealGroup, this.playerCollisionSpike, null, this);
        this.physics.world.collide(this.player, this.enemyGroup, this.playerCollisionEnemy, null, this);
        this.physics.world.collide(this.player, this.obstacle, this.playerCollisionClaw, null, this);

        // wrap cloud objects
        this.physics.world.wrap(this.cloud01, this.cloud01.width / 2);
        this.physics.world.wrap(this.cloud02, this.cloud02.width / 2);
        this.physics.world.wrap(this.cloud03, this.cloud03.width / 2);
        this.physics.world.wrap(this.cloud04, this.cloud04.width / 2);
    }

    playerCollisionClaw() {
        this.playerDead = true;
        this.sound.play("sfx_death");
        this.cameras.main.shake(1500, 0.0025);
        let deathClaw = this.add.sprite(this.player.x, this.player.y, "player_deathClaw").setScale(0.3).setOrigin(0.4);
        deathClaw.anims.play("death-claw");
        //deathClaw.on("animationcomplete", () => { deathClaw.destroy(); })
        this.player.destroy();
        this.music.stop();
        this.time.delayedCall(2000, () => { deathClaw.destroy(); this.scene.start("gameOverScene"); });
    }

    playerCollisionSpike() {
        this.playerDead = true;
        this.sound.play("sfx_death");
        this.cameras.main.shake(1500, 0.0025);
        let deathSpike = this.add.sprite(this.player.x, this.player.y, "player_deathSpike").setScale(0.3).setOrigin(0.4);
        deathSpike.anims.play("death-spike");
        //deathSpike.on("animationcomplete",  () => { deathSpike.destroy(); })
        this.player.destroy();
        this.music.stop();
        this.time.delayedCall(2000, () => { deathSpike.destroy(); this.scene.start("gameOverScene"); });
    }

    playerCollisionEnemy() {
        this.playerDead = true;
        this.sound.play("sfx_death");
        this.cameras.main.shake(1500, 0.0025);
        let deathEnemy = this.add.sprite(this.player.x, this.player.y, "player_deathEnemy").setScale(0.3).setOrigin(0.4);
        deathEnemy.anims.play("death-enemy");
        //deathEnemy.on("animationcomplete",  () => { deathEnemy.destroy(); })
        this.player.destroy();
        this.music.stop();
        this.time.delayedCall(2000, () => { deathEnemy.destroy(); this.scene.start("gameOverScene"); });
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
        this.sound.play("sfx_bounce");
    }

    levelWin() {
        this.music.stop();
        this.sound.play("sfx_victory", {volume: 0.05});
        this.playerDead = true;
        this.playerWin = true;
        let sparks = this.add.particles('spark');    
        let emitter = sparks.createEmitter();
        
        emitter.setPosition(this.flag.x - 32, this.flag.y - 185);
        emitter.setSpeed(45);
        emitter.setScale(0.7);
        emitter.setLifespan(850);

        onLevel02 = false;
    }

    createTerrainHorizontal(start, finish, height) {
        for(let i = start; i < finish; i += tileSize) {
            let groundTile = this.physics.add.sprite(i, height, "terrain2").setScale(0.5).setOrigin(0);
            groundTile.body.immovable = true;
            groundTile.body.allowGravity = false;
            this.platforms.add(groundTile);
        }
    }

    createTerrainVertical(start, finish, tile) {
        for(let i = start; i < finish; i += tileSize) {
            let groundTile = this.physics.add.sprite(tile, i, "terrain2").setScale(0.5).setOrigin(0);
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