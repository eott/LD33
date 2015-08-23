/**
 * A Visitor object represents a NPC walking on the map, searching for gold and interact with
 * the minotaur.
 *
 * @class Visitor
 * @constructor
 * @param {Phaser.Game} game
 * @param {Phaser.Sprite} sprite
 */
Visitor = function (game, sprite) {
    this.game = game;
    this.sprite = sprite;
    this.body = this.sprite.body;
}


/**
 * Returns true if the Visitor is blocked on any side
 *
 * @method Visitor#blocked
 * @return {boolean}
 */
Visitor.prototype.blocked = function () {
    return this.body.blocked.up || this.body.blocked.down || this.body.blocked.left || this.body.blocked.right;
}

/**
 * Absconds from Minotaur into reverse direction accelerated by factor 10
 *
 * @method Visitor#flee
 * @param {Minotaur} minotaur
 */
Visitor.prototype.flee = function (minotaur) {
    this.changeDirection(Phaser.Point.angle(this.body.position, minotaur.body.position), 10);
}

/**
 * Starts walking randomly around
 *
 * @method Visitor#startWalking
 */
Visitor.prototype.startWalking = function () {
    this.changeDirection(Math.random() * Math.PI * 2);

}

/**
 * Changes the Visitor's direction relative to the given target. Or changes
 * the direction by a given angle. Accepts an optional acceleration parameter.
 *
 * @method Visitor#changeDirection
 * @param {Phaser.Point|number} targetOrAngle - The treasure to chase and grab
 * @param {number} [acceleration] - The factor to accelerate the velocity
 */
Visitor.prototype.changeDirection = function (targetOrAngle, acceleration) {
    var visitorSpeed = 50;
    if (targetOrAngle instanceof Phaser.Point) {
        targetOrAngle = Phaser.Point.angle(targetOrAngle, this.body.position);
    }
    if (typeof acceleration === 'undefined') {
        acceleration = 1;
    }
    this.body.velocity.y = visitorSpeed * Math.sin(targetOrAngle) * acceleration;
    this.body.velocity.x = visitorSpeed * Math.cos(targetOrAngle) * acceleration;
}

/**
 * Grabs treasure
 *
 * @method Visitor#grab
 * @param {Treasure} treasure - The treasure to chase and grab
 */
Visitor.prototype.grab = function (treasure) {

}

/**
 * Loops the treasure collection. Returns the nearest treasure found
 *
 * @method Visitor#findNearestTreasure
 * @param {Array.<Treasure>} treasures - The treasure collection
 * @return {Treasure|undefined} Nearest treasure found
 */
Visitor.prototype.findNearestTreasure = function (treasures) {
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
 * Updates the Visitor each cycle. Contains the Visitor's KI-circuits.
 *
 * @method Visitor#update
 * @param {Minotaur} minotaur - The player object
 * @param {Array.<Treasure>} treasures - The treasure collection
 */
Visitor.prototype.update = function (minotaur, treasures) {
    this.game.physics.arcade.collide(this.sprite, wallsLayer);
    this.game.physics.arcade.collide(this.sprite, decorationLayer);
    var seesMinotaur = Phaser.Point.distance(this.body.position, minotaur.body.position, 0) < 200;
    var isMoving = this.body.velocity.x || this.body.velocity.y;
    var blocked = this.blocked();
    var foundTreasure = this.findNearestTreasure(treasures);

    switch (true) {
        case (seesMinotaur):
            this.flee(minotaur);
            break;
        case (foundTreasure):
            var standsOnTreasure = Phaser.Point.distance(this.body.position, foundTreasure.body.position, 0) < 5;
            if (standsOnTreasure){
                this.grab(foundTreasure);
                break;
            }
        case (foundTreasure):
            this.changeDirection(foundTreasure.body.position);
            break;
        case (blocked):
        case (!isMoving):
            this.startWalking();
        default:
    }
}

/**
 * Creates and returns a new visitor. Consumes an 'Game Object' with
 * type 'visitor_start'. Creates a sprite for the loaded visitor image.
 * Enables the physics and returns the newly created Visitor.
 *
 * {@link http://phaser.io/docs/2.4.2/Phaser.Physics.html#enable}
 *
 * @method Visitor.create
 * @static
 * @param {Phaser.Game} game
 * @param {object} gameObject
 * @return {Visitor}
 */
Visitor.create = function (game, gameObject) {
    var sprite = game.add.sprite(gameObject.x, gameObject.y, 'visitor');
    sprite.anchor.setTo(0.5, 0.5);
    sprite.scale.setTo(0.5, 0.5);
    sprite.bringToTop();

    game.physics.arcade.enable(sprite);
    sprite.body.collideWorldBounds = true;

    return new Visitor(game, sprite);
}
