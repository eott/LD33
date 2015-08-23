/**
 * A Minotaur object represents the player's character interacting in our world
 *
 * @class Minotaur
 * @constructor
 * @param {Phaser.Game} game
 * @param {Phaser.Sprite} sprite
 */
Minotaur = function (game, sprite) {
    this.game = game;
    this.sprite = sprite;
    this.body = this.sprite.body;
    this.wallet = 0;
}

/**
 * Loops the treasure collection. Returns the nearest treasure found
 *
 * @method Minotaur#findNearestTreasure
 * @param {Array.<Treasure>} treasures - The treasure collection
 * @return {Treasure|undefined} Nearest treasure found
 */
Minotaur.prototype.findNearestTreasure = function (treasures) {
    var maxRange = 50;
    var shortestDistance = 0;
    var nearestTreasure;
    for (var idx in treasures) {
        var distance = Phaser.Point.distance(this.body.position, treasures[idx].body.position, 0);
        if (distance < maxRange && (!shortestDistance || distance < shortestDistance)) {
            nearestTreasure = treasures[idx];
            shortestDistance = distance;
        }
    }
    return nearestTreasure;
}

/**
 * Indicates if user tells to move
 *
 * @method Visitor#move
 * @retrun {boolean}
 */
Minotaur.prototype.isMoving = function () {
    return cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown
    || cursors.a.isDown || cursors.d.isDown || cursors.w.isDown || cursors.s.isDown;
}

/**
 * Moves the Minotaur by cursors input
 *
 * @method Visitor#move
 */
Minotaur.prototype.move = function () {
    var playerSpeed = 400;

    // Reset actual movement
    this.body.velocity.x = 0;
    this.body.velocity.y = 0;

    if (cursors.left.isDown || cursors.a.isDown) {
        this.body.velocity.x -= playerSpeed;
    }

    if (cursors.right.isDown || cursors.d.isDown) {
        this.body.velocity.x += playerSpeed;
    }

    if (cursors.up.isDown || cursors.w.isDown) {
        this.body.velocity.y -= playerSpeed;
    }

    if (cursors.down.isDown || cursors.s.isDown) {
        this.body.velocity.y += playerSpeed;
    }

    // Slow down diagonal movement to playerSpeed
    if (
        this.body.velocity.y != 0
            && this.body.velocity.x != 0
        ) {
        this.body.velocity.y /= Math.sqrt(2);
        this.body.velocity.x /= Math.sqrt(2);
    }
}

/**
 * Rotates Minotaur towards moving direction
 *
 * @method Visitor#rotate
 */
Minotaur.prototype.rotate = function () {
    var rotation = getRotationForVelocity(this.body.velocity.x, this.body.velocity.y, "player");
    game.add.tween(this.sprite).to({rotation: rotation}, 40, Phaser.Easing.Linear.Out, true);
}

/**
 * Grabs treasure
 *
 * @method Visitor#grab
 * @param {Treasure} treasure - The treasure to chase and grab
 */
Minotaur.prototype.grab = function (treasure) {
    /*
     ToDos:
     - GoldCounter/Amount on Player/Visitor needs to go up by Gold Value X
     - Animation / Sound etc.
     - Maybe: Add dynamic gold amount from treasure object
     */

    var style = { font: "20px Arial", fill: "yellow", stroke: "black", strokeThickness: 7, align: "center" };

    // Add text
    text = this.game.add.text(treasure.body.position.x + 20, treasure.body.position.y, '+500G', style);
    text.anchor.set(0.5);

    // Animate text
    var tween = this.game.add.tween(text).to( { y: treasure.body.position.y - 10, alpha: 0 }, 2000, Phaser.Easing.Linear.Out, true);

    // Remove text after animation is done
    tween.onComplete.add(function() {
        text.destroy();
    }, this);

    // Remove the treasure object (currently just moves the treasure really far away...)
    treasure.position.x = - -1000000;
    treasure.position.y = - -1000000;

    // @todo: add treasure.destroy(); or .kill() to actually remove the elements from memory? both behave kind of weirdly...
}

/**
 * Updates the Minotaur each cycle.
 *
 * @param {Array.<Treasure>} treasures - The treasure collection
 */
Minotaur.prototype.update = function (treasures) {
    // Collision
    this.game.physics.arcade.collide(this.sprite, wallsLayer);
    this.game.physics.arcade.collide(this.sprite, decorationLayer);

    // Interact with world
    var foundTreasure = this.findNearestTreasure(treasures);
    var foundGold = typeof foundTreasure !== 'undefined' && Phaser.Point.distance(this.body.position, foundTreasure.body.position, 0) < 50;

    switch (true) {
        case (foundGold):
            this.grab(foundTreasure);
            break;
        default:
    }

    // Move and rotate
    this.move();
    this.rotate();
}

/**
 * Creates and returns a new Minotaur. Consumes an 'Game Object' with
 * type 'player_start'. Creates a sprite for the loaded player image.
 * Enables the physics and returns the newly created Minotaur.
 *
 * {@link http://phaser.io/docs/2.4.2/Phaser.Physics.html#enable}
 *
 * @method Minotaur.create
 * @static
 * @param {Phaser.Game} game
 * @param {object} gameObject
 * @return {Minotaur}
 */
Minotaur.create = function (game, gameObject) {
    var sprite = game.add.sprite(gameObject.x, gameObject.y, 'player');
    sprite.anchor.setTo(0.5, 0.5);
    sprite.scale.setTo(0.5, 0.5);
    sprite.bringToTop();

    // How about some physics?
    game.physics.arcade.enable(sprite);
    sprite.body.collideWorldBounds = true;

    // Change the size of the Collision Box
    sprite.body.width = 30;
    sprite.body.height = 30;

    return new Minotaur(game, sprite);
}