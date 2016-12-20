new Dragdealer('slider-force', {
    animationCallback: function(x, y) {
        $('#slider-force .value-force').text(Math.round(x * 100) + '%');
    }
});

new Dragdealer('slider-angle', {
    animationCallback: function(x, y) {
        $('#slider-angle .value-angle').html(Math.round((Math.round(x * 100) * 0.9) + 90) + '&#176;');
    }
});

var cH = $('#game_controls').height();
var w = $(window).width();
var h = $(window).height();

var game = new Phaser.Game(w, h - cH, Phaser.AUTO, 'gameContainer', { preload: preload, create: create, update: update });

/**
 * Pre-load all assets here
 */
function preload() {
    console.log('Pre-loaded');

    game.load.image('sky', 'assets/img/sky.png');
    game.load.image('ground', 'assets/img/platform.png');
    game.load.image('star', 'assets/img/star.png');

    // load this as a sprite sheet because it contains animations
    // params: key, asset path, width, height
    game.load.spritesheet('dude', 'assets/img/dude.png', 32, 48);
}

var platforms;
var player;
function create() {
    console.log('Creating...');

    //  We're going to be using physics, so enable the Arcade Physics system
    game.physics.startSystem(Phaser.Physics.ARCADE);

    //  A simple background for our game
    var sky = game.add.tileSprite(0, 0, w, h, "sky");

    //  The platforms group contains the ground and the 2 ledges we can jump on
    platforms = game.add.group();

    // We will enable physics for any object that is created in this group
    // collision with the objects
    platforms.enableBody = true;

    // Here we create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    //  Scale it to fit the width of the game (the original sprite is 400x32 in size)
    ground.scale.setTo(3, 2);
    //  This stops it from falling away when you jump on it (do not move)
    ground.body.immovable = true;

    //  Now let's create castle
    var castle = platforms.create(w - 64, game.world.height - 88, 'star');
    castle.body.immovable = true;

    // The player and its settings
    player = game.add.sprite(32, game.world.height - 150, 'dude');
    //  We need to enable physics on the player
    game.physics.arcade.enable(player);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = true;

    //  Our two animations, walking left and right.
    // params: key animation, frames, speed, repeat animation
    player.animations.add('left', [0, 1, 2, 3], 10, true);
    player.animations.add('right', [5, 6, 7, 8], 10, true);
}

var clickButton = false;
function update() {
    //  Collide the player and the stars with the platforms
    var hitPlatform = game.physics.arcade.collide(player, platforms);

    //  Reset the players velocity (movement)
    player.body.velocity.x = 0;

    if (clickButton) {
        player.body.velocity.x = 380;
    }

    if (player.body.touching.down && hitPlatform) {
        clickButton = false;

        player.body.velocity.x = 0;
        player.body.position.x = 64;
    }

    console.log(player.body.position.x + ' ' + game.world.width);
    if (player.body.position.y <= 0 || player.body.position.x + 32 >= game.world.width) {
        clickButton = false;

        alert('KiKi');

        player.body.velocity.x = 0;
        player.body.position.x = 64;
        player.body.position.y = game.world.height - 120;
    }
}

$('#btn_fire').off().on('click', function (e) {
    e.preventDefault();

    //  Move to the left
    player.body.velocity.y = -350;

    clickButton = true;
});

function canonBallStop() {
    //  Stand still
    player.animations.stop();
    player.frame = 4;
}