// Game related objects
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameView', { preload: preload, create: create, update: update });
var cursors;
var buttonWasDown = false;

// Meta globals
var timeOfStart = Date.now();
var playerSpeed = 400;
var visitorSpeed = 50;

function preload() {
    game.load.image('player', 'assets/images/player/player.png');
    game.load.image('visitor', 'assets/images/player/visitor.png');
    game.load.image('treasure', 'assets/images/player/treasure.png');

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
    var start = findObjectsByType('player_start', map, 'Game Objects');
    start = start.pop();

    player = game.add.sprite(start.x, start.y, 'player');
    player.anchor.setTo(0.5, 0.5);
    player.scale.setTo(0.5, 0.5);
    player.bringToTop();

    // Camera and game world
    game.camera.follow(player);
    game.world.setBounds(0, 0, 1500, 1500);

    // How about some physics?
    game.physics.arcade.enable(player);
    player.body.collideWorldBounds = true;

    // Visitors
    var visitorStart = findObjectsByType('visitor_start', map, 'Game Objects');
    visitorStart = visitorStart.pop();

    visitor = game.add.sprite(visitorStart.x, visitorStart.y, 'visitor');
    visitor.anchor.setTo(0.5, 0.5);
    visitor.scale.setTo(0.5, 0.5);
    visitor.bringToTop();


    game.physics.arcade.enable(visitor);
    visitor.body.collideWorldBounds = true;

    // Treasures
    var treasureStart = findObjectsByType('treasure_start', map, 'Game Objects');
    console.log(treasureStart);
    treasureStart = treasureStart.pop();

    treasure = game.add.sprite(treasureStart.x, treasureStart.y, 'treasure');
    treasure.anchor.setTo(0.5, 0.5);
    treasure.scale.setTo(0.5, 0.5);
    treasure.bringToTop();

    game.physics.arcade.enable(treasure);
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

    // Collision
    this.game.physics.arcade.collide(player, wallsLayer);
    this.game.physics.arcade.collide(player, furnitureLayer);

    // Movement
    player.body.velocity.x = 0;
    player.body.velocity.y = 0;

    if (cursors.left.isDown) {
        player.body.velocity.x -= playerSpeed;
    }

    if (cursors.right.isDown) {
        player.body.velocity.x += playerSpeed;
    }

    if (cursors.up.isDown) {
        player.body.velocity.y -= playerSpeed;
    }

    if (cursors.down.isDown) {
        player.body.velocity.y += playerSpeed;
    }

    // Slow down diagonal movement to playerSpeed
    if (
        player.body.velocity.y != 0
            && player.body.velocity.x != 0
        ) {
        player.body.velocity.y /= Math.sqrt(2);
        player.body.velocity.x /= Math.sqrt(2);
    }

    // Visitor Movement
    this.game.physics.arcade.collide(visitor, wallsLayer);
    this.game.physics.arcade.collide(visitor, furnitureLayer);

    var blocked = visitor.body.blocked.up || visitor.body.blocked.down || visitor.body.blocked.left || visitor.body.blocked.right;
    var moving = visitor.body.velocity.x || visitor.body.velocity.y;
    var seesMinotaur = Phaser.Point.distance(visitor.body.position, player.body.position, 0) < 50;
    if (blocked || !moving || seesMinotaur) {
        visitor.body.velocity.x = 0;
        visitor.body.velocity.y = 0;

        if (seesMinotaur) {
            var angle = Phaser.Point.angle(visitor.body.position, player.body.position);
            visitor.body.velocity.y = visitorSpeed * Math.sin(angle) * 10;
            visitor.body.velocity.x = visitorSpeed * Math.cos(angle) * 10;
        } else {
            switch (Math.floor(Math.random() * 9)) {
                case 1:
                    visitor.body.velocity.x -= visitorSpeed; // West
                    break;
                case 2:
                    visitor.body.velocity.x += visitorSpeed; // East
                    break;
                case 3:
                    visitor.body.velocity.y -= visitorSpeed; // South
                    break;
                case 4:
                    visitor.body.velocity.y += visitorSpeed; // North
                    break;
                case 5:
                    visitor.body.velocity.x -= Math.sqrt(visitorSpeed * visitorSpeed / 2); // South-West
                    visitor.body.velocity.y -= Math.sqrt(visitorSpeed * visitorSpeed / 2);
                    break;
                case 6:
                    visitor.body.velocity.x += Math.sqrt(visitorSpeed * visitorSpeed / 2); // South-East
                    visitor.body.velocity.y -= Math.sqrt(visitorSpeed * visitorSpeed / 2);
                    break;
                case 7:
                    visitor.body.velocity.x -= Math.sqrt(visitorSpeed * visitorSpeed / 2); // North-West
                    visitor.body.velocity.y += Math.sqrt(visitorSpeed * visitorSpeed / 2);
                    break;
                case 8:
                    visitor.body.velocity.x += Math.sqrt(visitorSpeed * visitorSpeed / 2); // North-East
                    visitor.body.velocity.y += Math.sqrt(visitorSpeed * visitorSpeed / 2);
                    break;
            }
        }
    }

    var foundGold = Phaser.Point.distance(visitor.body.position, treasure.body.position, 0) < 250;

    if (foundGold) {
        //@TODO
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