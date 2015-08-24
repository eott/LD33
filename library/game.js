// Game related objects
var game;
var cursors;
var buttonWasDown = false;
var treasures = [];
var visitors = [];
var player;

// Meta globals
var timeOfStart = Date.now();
var lastRotations = {"player": 0};
var levelName;

// Defines how much gold is need to win/lose
var winScores = {
    "Tutorial": [2000, 2500],
    "Level1": [9000, 12000]
};

function startGame() {
    levelName = "Level1";
    hideMenu();
    initGame();
}

function initGame() {
    game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameView', { preload: preload, create: create, update: update });
}

function preload() {
    game.load.image('player', 'assets/images/player/player.png');
    game.load.image('hunter', 'assets/images/objects/hunter.png');
    game.load.spritesheet('visitor_spritesheet', 'assets/images/objects/visitor_spritesheet.png', 128, 128);
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

    // Camera and game world
    game.camera.follow(player.sprite);
    game.world.setBounds(0, 0, 2500, 2500);

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
        var treasure = Treasure.create(game, treasureStart[idx], 500);
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

    // Check for winning / losing conditions
    checkWinOrLose();

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

/**
 * Checks if the player has won or lost, and shows the according screen.
 * When neither is true, nothing happens and false is returned.
 *
 * @returns {boolean}
 */
function checkWinOrLose() {
    if (player.wallet >= winScores[levelName][0]) {
        // Player won! Show win screen and stop the game.
        var style = { font: "50px Arial", fill: "yellow", stroke: "black", strokeThickness: 7, align: "center" };
        this.text = this.game.add.text(this.game.width / 2 - 130, this.game.height / 2 - 50, 'YOU WIN! :)', style);
        this.text.fixedToCamera = true;
        pauseAndReset();
    } else {
        // Summarize all visitor wallets
        var visitorWallet = 0;
        for (idx in visitors) {
            visitorWallet += visitors[idx].wallet;
        }

        if (visitorWallet >= winScores[levelName][1]) {
            // Player wlost! Show lose screen and stop the game.
            var style = { font: "50px Arial", fill: "red", stroke: "black", strokeThickness: 7, align: "center" };
            this.text = this.game.add.text(this.game.width / 2 - 140, this.game.height / 2 - 50, 'YOU LOSE! :(', style);
            this.text.fixedToCamera = true;
            pauseAndReset();
        }
    }

    return false;
}

function pauseAndReset() {
    this.game.gamePaused();
    window.setInterval(function() {
        window.location.reload();
    }, 3000);
}