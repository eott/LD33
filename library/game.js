// Game related objects
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameView', { preload: preload, create: create, update: update });
var cursors;
var buttonWasDown = false;
var treasures = [];
var visitors = [];
var player;

// Meta globals
var timeOfStart = Date.now();
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
    cursors = game.input.keyboard.createCursorKeys();
    game.canvas.oncontextmenu = function (e) {
        e.preventDefault();
    }

    // Player
    var start = findObjectsByType('player_start', map, 'Game objects');
    start = start.pop();
    player = Minotaur.create(game, start);

    // Camera and game world
    game.camera.follow(player.sürite);
    game.world.setBounds(0, 0, 1500, 1500);

    // Visitors
    var visitorStart = findObjectsByType('visitor_start', map, 'Game objects');
    for (var idx in visitorStart){
        var visitor = Visitor.create(game, visitorStart[idx]);
        visitors.push(visitor);
    }

    // Treasures
    var treasureStart = findObjectsByType('treasure', map, 'Game objects');
    for (var i = 0; i < treasureStart.length; i++) {
        var start     = treasureStart[i];
        var treasure  = game.add.sprite(start.x, start.y, 'game_objects');
        treasure.frame = 1;
        game.physics.arcade.enable(treasure);
        treasure.bringToTop();
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
    for (var idx in visitors){
        visitors[idx].update(player, treasures);
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