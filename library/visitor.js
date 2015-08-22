/**
 * A Visitor object represent a NPC walking on the map, searching for gold and interact with
 * the minotaur.
 *
 * Sets and enables the sprite {@link http://phaser.io/docs/2.4.2/Phaser.Physics.html#enable}
 *
 * @class Visitor
 * @constructor
 * @param {Phaser.Game} game
 * @param {Phaser.Sprite} sprite
 */
Visitor = function (game, sprite) {
    this.game = game;
    this.sprite = sprite;
    this.game.physics.arcade.enable(this.sprite);
    this.body = this._sprite.body;
    this.body.collideWorldBounds = true;
}


/**
 * Returns true if the Visitor is blocked on any side
 *
 * @method Visitor#blocked
 * @return {boolean}
 */
Visitor.prototype.blocked = function () {
    return this.body.blocked.up || this.body.blocked.down || this.body.blocked.left || this.body.blocked.right
}

/**
 * Absconds from Minotaur into reverse direction accelerated by factor 10
 * @method Visitor#flee
 * @param {Minotaur} minotaur
 *
 */
Visitor.prototype.flee = function (minotaur) {
    var panic = 10;
    var angle = Phaser.Point.angle(this.body.position, minotaur.body.position);
    this.body.velocity.y = visitorSpeed * Math.sin(angle) * panic;
    this.body.velocity.x = visitorSpeed * Math.cos(angle) * panic;
}

/**
 * Walks randomly around
 */
Visitor.prototype.walk = function () {
    var angle = Math.random() * Math.PI * 2;
    this.body.velocity.y = visitorSpeed * Math.sin(angle);
    this.body.velocity.x = visitorSpeed * Math.cos(angle);
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
 *
 * @method Visitor#findNearestTreasure
 * @param {Array.<Treasure>} treasures - The treasure collection
 */
Visitor.prototype.findNearestTreasure = function (treasures) {
    var maxRange = 50;
    var shortestDistance = 0;
    var nearestTreasure;
    for (var treasure in treasures) {
        var distance = Phaser.Point.distance(this.body.position, treasure.body.position, 0);
        if (distance < maxRange && (!shortestDistance || distance < shortestDistance)) {
            nearestTreasure = treasure;
            shortestDistance = distance;
        }
    }
    return nearestTreasure;
}

/**
 * Updates the Visitor each cycle
 *
 * @method Visitor#update
 * @param {Minotaur} minotaur - The player object
 * @param {Array.<Treasure>} treasures - The treasure collection
 */
Visitor.prototype.update = function (minotaur, treasures) {
    var seesMinotaur = Phaser.Point.distance(this.body.position, minotaur.body.position, 0) < 50;
    var isMoving = visitor.body.velocity.x || visitor.body.velocity.y;
    var blocked = this.blocked();
    var foundTreasure = this.findNearestTreasure(treasures);

    switch (true) {
        case (seesMinotaur):
            this.flee(minotaur);
            break;
        case(foundTreasure):
            break;
        case(!isMoving):
        case(blocked):
        default:
            this.walk();
    }
}

/**
 * Creates and returns a new visitor
 * @method Visitor.create
 * @static
 */
Visitor.create = function (game, gameObject) {
    var sprite = game.add.sprite(gameObject.x, gameObject.y, 'visitor');
    sprite.anchor.setTo(0.5, 0.5);
    sprite.scale.setTo(0.5, 0.5);
    sprite.bringToTop();
    return new Visitor(game, sprite);
}