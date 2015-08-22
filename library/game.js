// Game related objects
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameView', { preload: preload, create: create, update: update });
var cursors;
var buttonWasDown = false;
var treasures = [];
var visitors = [];

// Meta globals
var timeOfStart = Date.now();
var playerSpeed = 400;
var visitorSpeed = 50;
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

    // Change the size of the Collision Box
    player.body.width = 30;
    player.body.height = 30;

    // Visitors
    var visitorStart = findObjectsByType('visitor_start', map, 'Game objects');
    for (var i = 0; i < visitorStart.length; i++) {
        var start = visitorStart[i];
        var visitor = game.add.sprite(start.x, start.y, 'visitor');
        visitor.anchor.setTo(0.5, 0.5);
        visitor.scale.setTo(0.5, 0.5);
        visitor.bringToTop();
        game.physics.arcade.enable(visitor);
        visitor.body.collideWorldBounds = true;
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

    // Collision
    this.game.physics.arcade.collide(player, wallsLayer);
    this.game.physics.arcade.collide(player, decorationLayer);

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

    // Rotate player towards movement
    player.rotation = getRotationForVelocity(player.body.velocity.x, player.body.velocity.y, "player");

    // Visitor Movement
    for (var i = 0; i < visitors.length; i++) {
        var visitor = visitors[i];
        this.game.physics.arcade.collide(visitor, wallsLayer);
        this.game.physics.arcade.collide(visitor, decorationLayer);

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