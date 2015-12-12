var app = (function (sfx, gfx, player) {

// Game related
    var game;
    var cursors;
    var buttonWasDown = false;

// Meta
    var timeOfStart = Date.now();
    var levelName;

    function preload() {
        game.load.image('player', 'assets/images/player/player.png');
        game.load.spritesheet('game_objects', 'assets/images/objects/game_objects.png', 64, 64);

        gfx.load(this);
        sfx.load(this);
        player.load(this);
    }


    function start() {
        console.log('Starting app')
        game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameView', { preload: preload, create: init, update: update })
    }

    function init() {
        // Init graphics and sound
        gfx.init();
        sfx.init();
        player.init();

        // Init inputs
        cursors = game.input.keyboard.addKeys({
            'up'   : Phaser.Keyboard.UP,
            'down' : Phaser.Keyboard.DOWN,
            'left' : Phaser.Keyboard.LEFT,
            'right': Phaser.Keyboard.RIGHT,
            'w'    : Phaser.Keyboard.W,
            's'    : Phaser.Keyboard.S,
            'a'    : Phaser.Keyboard.A,
            'd'    : Phaser.Keyboard.D
        });

        game.canvas.oncontextmenu = function (e) {
            e.preventDefault();
        };
    }

    function update() {
        // Custom click event, because why the hell has Phaser these not by default?
        if (
            game.input.mousePointer.isDown
                && !buttonWasDown
            ) {
            onMouseClick();
        }
        buttonWasDown = game.input.mousePointer.isDown;

        gfx.update();
        sfx.update();
    }

    function reset() {
        timeOfStart = Date.now();
    }

    return {
        game   : game,
        preload: preload,
        init   : init,
        start  : start,
        update : update,
        reset  : reset,
        player : player

    }
})(sfx, gfx, player);

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o) { //v1.0
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};