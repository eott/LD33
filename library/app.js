var app = (function (sfx, gfx, menu, player) {

// Game related
    var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameView', { preload: preload, create: init, update: update });
    var cursors;
    var buttonWasDown = false;

// Meta
    var timeOfStart = Date.now();
    var levelName;

    function preload() {
        game.load.image('player', 'assets/images/player/player.png');
        game.load.spritesheet('game_objects', 'assets/images/objects/game_objects.png', 64, 64);

        gfx.load();
        sfx.load();
    }


    function start() {
        levelName = "Level1";
        menu.hide();
    }

    function init() {
        // Init graphics and sound
        gfx.init();
        sfx.init();

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

        /**
         * Player
         */
        var start = findObjectsByType('player_start', map, 'Game objects');
        start = start.pop();
        player = Minotaur.create(game, start);

        // Camera and game world
        game.camera.follow(player.sprite);
        game.world.setBounds(0, 0, 2500, 2500);
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
        player.body.x = 0;
        player.body.y = 0;
        player.body.velocity.x = 0;
        player.body.velocity.y = 0;
    }

    return {
        game   : game,
        preload: preload,
        init   : init,
        start  : start,
        update : update,
        reset  : reset

    }
})(sfx, gfx, menu, player);

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o) { //v1.0
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};