/**
 * A Hunter object represents a NPC walking on the map,
 * searching for gold and hunting Visitors
 *
 * @class Hunter
 * @constructor
 * @param {Phaser.Game} game
 * @param {Phaser.Sprite} sprite
 */
Hunter = function (game, sprite) {
    this.game = game;
    this.sprite = sprite;
    this.body = this.sprite.body;
    this.awarenessRadius = 100;
};

/**
 * If the Hunter is moving
 *
 * @method Hunter#isMoving
 * @returns {boolean}
 */
Hunter.prototype.isMoving = function () {
    return this.body.velocity.x || this.body.velocity.y;
}

/**
 * The Hunter is looking for treasures in his awareness radius.
 *
 * @method Hunter#findTreasures
 * @param {Array.<Treasure>} treasures - The treasure collection
 * @return {Treasure|undefined}
 */
Hunter.prototype.findTreasures = function (treasures) {
    var shortestDistance = 0;
    var nearestTreasure;
    for (var idx in treasures) {
        var distance = Phaser.Point.distance(this.body.position, treasures[idx].body.position, 0);
        if (distance < this.awarenessRadius && (!shortestDistance || distance < shortestDistance)) {
            nearestTreasure = treasures[idx];
            shortestDistance = distance;
        }
    }
    return nearestTreasure;
}

/**
 * The Hunter is looking for visitors in his awareness radius
 *
 * @method Hunter#findVisitors
 * @param {Array.<Visitor>} visitors - The visitor collection
 * @return {Visitor|undefined}
 */
Hunter.prototype.findVisitors = function () {
    var shortestDistance = 0;
    var nearestVisitor;
    for (var idx in visitors) {
        if (visitors[idx] !== this) {
            var distance = Phaser.Point.distance(this.body.position, visitors[idx].body.position, 0);
            if (distance < this.awarenessRadius && (!shortestDistance || distance < shortestDistance)) {
                nearestVisitor = visitors[idx];
                shortestDistance = distance;
            }
        }
    }
    return nearestVisitor;
}

/**
 * Updates the Hunter each cycle. Contains the Hunter's KI-circuits.
 *
 * @method Hunter#update
 * @param {Minotaur} minotaur - The Minotaur
 * @param {Array.<Treasure>} treasures - The treasure collection
 * @param {Array.<Visitor>} visitors - The visitor collection
 */
Hunter.prototype.update = function (minotaur, treasures, visitors) {
    var visitor = this.findVisitors(visitors);
    var treasure = this.findTreasures(treasures);

    // seek

    // rob

    // pick

    // fight

};

/**
 * Creates and returns a new Hunter. Consumes an 'Game Object' with
 * type 'hunter_start'. Creates a sprite for the loaded hunter image.
 * Enables the physics and returns the newly created Hunter.
 *
 * {@link http://phaser.io/docs/2.4.2/Phaser.Physics.html#enable}
 *
 * @method Hunter.create
 * @static
 * @param {Phaser.Game} game
 * @param {object} gameObject
 * @return {Hunter}
 */
Hunter.create = function (game, gameObject) {
    // Stealth mode
    var sprite = game.add.sprite(gameObject.x, gameObject.y, 'hunter');
    sprite.anchor.setTo(0.5, 0.5);
    sprite.scale.setTo(0.5, 0.5);
    sprite.bringToTop();

    game.physics.arcade.enable(sprite);
    sprite.body.collideWorldBounds = true;

    return new Hunter(game, sprite);
};