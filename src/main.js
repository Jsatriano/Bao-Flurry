// TO DO 
// sfx:
//  jump
//  get another death sound for spikes
//  bounce pad sfx
// 
// animaitons:
//  death
let config = {
    type: Phaser.CANVAS,
    width: 1280,
    height: 720,
    scale: {
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            //debug: true,
            gravity: {
                x: 0,
                y: 0
            }
        }
    },
    scene: [Menu, Level01, GameOver, level02, Credits]
}

// set game up
let game = new Phaser.Game(config);

// set up a border padding variable
let borderPadding = game.config.width / 300;

// reserve globals
let keyA, keyD, keySPACE, keyC, keyR;
let acceleration = 4000;
let max_x_vel = 350;
let max_y_vel = 5000;
let jumpVelocity = -1000;
let centerX = game.config.width / 2;
let centerY = game.config.height / 2;
const tileSize = 32;
let onLevel01 = false;
let onLevel02 = false;

