// Game related objects
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameView', { preload: preload, create: create, update: update });
var cursors;
var buttonWasDown = false;
var treasures = [];
var visitors = [];
var player;

// Meta globals
var timeOfStart = Date.now();

var playerSpeed        = 400;
var visitorSpeed       = 200;
var iCanSeeYouDistance = 150; // Within this distance a visitor (e.g.) recognises the minotaur.
var catchReach         = 50;  // Within this distance the minotaur (e.g.) picks up a treasure.

var lastRotations = {"player": 0};

function preload() {
    game.load.image('player', 'assets/images/player/player.png');
    game.load.image('visitor', 'assets/images/objects/visitor.png');
    game.load.spritesheet('game_objects', 'assets/images/objects/game_objects.png', 64, 64);

    gfxPreload();
    sfxPreload();
}

function create() {
    // Init graphics and sound
    gfxCreate();
    sfxCreate();

    // Init inputs
    cursors = game.input.keyboard.addKeys({
        'up': Phaser.Keyboard.UP,
        'down': Phaser.Keyboard.DOWN,
        'left': Phaser.Keyboard.LEFT,
        'right': Phaser.Keyboard.RIGHT,
        'w': Phaser.Keyboard.W,
        's': Phaser.Keyboard.S,
        'a': Phaser.Keyboard.A,
        'd': Phaser.Keyboard.D
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

    // further initialisations
    player.treasures = 0;
    
    // Camera and game world
    game.camera.follow(player.sprite);
    game.world.setBounds(0, 0, 1500, 1500);

    // Visitors
    var visitorStart = findObjectsByType('visitor_start', map, 'Game objects');
    for (var idx in visitorStart) {
        var visitor = Visitor.create(game, visitorStart[idx]);
        visitors.push(visitor);
    }

    /**
     * Treasures
     */
    var treasureStart = findObjectsByType('treasure', map, 'Game objects');
    for(var idx in treasureStart){
        var treasure = Treasure.create(game, treasureStart[idx],500);
        treasures.push(treasure);
    }
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

    // Player's interactions
    player.update(treasures);

    // Visitor movement
    for (var idx in visitors) {
        visitors[idx].update(player, treasures);
    }

    // Treasure behaviour
    for (var i = 0; i < treasures.length; i++) {
        var treasure = treasures[i];
        var foundGold = Phaser.Point.distance(player.body.position, treasure.body.position, 0) < 50;

        if (foundGold) {
            /*
                ToDos:
                - GoldCounter/Amount on Player/Visitor needs to go up by Gold Value X
                - Animation / Sound etc.
                - Maybe: Add dynamic gold amount from treasure object
             */

            var style = { font: "20px Arial", fill: "yellow", stroke: "black", strokeThickness: 7, align: "center" };

            // Add text
            text = game.add.text(treasure.body.position.x + 20, treasure.body.position.y, '+500G', style);
            text.anchor.set(0.5);

            // Animate text
            var tween = game.add.tween(text).to( { y: treasure.body.position.y - 10, alpha: 0 }, 2000, Phaser.Easing.Linear.Out, true);

            // Remove text after animation is done
            tween.onComplete.add(function() {
                text.destroy();
            }, this);

            // Remove the treasure object (currently just moves the treasure really far away...)
            treasure.position.x = - -1000000;
            treasure.position.y = - -1000000;

            // @todo: add treasure.destroy(); or .kill() to actually remove the elements from memory? both behave kind of weirdly...
        }
    }

    gfxUpdate();
    sfxUpdate();
}

function onMouseClick() {

}

function findObjectsByType(type, map, layer) {
    var result = new Array();
    map.objects[layer].forEach(function (element) {
        if (element.type === type || element.properties.type === type) {
            // Phaser uses top left, Tiled bottom left so we have to adjust
            // the y position
            element.y -= map.tileHeight;
            result.push(element);
        }
    });
    return result;
}

function reset() {
    timeOfStart = Date.now();
    player.body.x = 0;
    player.body.y = 0;
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;
}

//+ Jonas Raoni Soares Silva
//@ http://jsfromhell.com/array/shuffle [v1.0]
function shuffle(o) { //v1.0
    for (var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
};

function getRotationForVelocity(x, y, key) {
    var rot = 0;
    var signs = [Math.sign(x), Math.sign(y)];
    if (signs[1] == -1) {
        rot = 0 + 0.25 * Math.PI * signs[0];
    } else if (signs[1] == 1) {
        rot = Math.PI - 0.25 * Math.PI * signs[0];
    } else if (signs[0] == 0) {
        rot = lastRotations[key];
    } else {
        rot = 0.5 * Math.PI * signs[0];
    }
    lastRotations[key] = rot;
    return rot;
}