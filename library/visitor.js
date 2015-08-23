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
    this.groupsize = 1;
    this.wallet = 0;

    /**
     * 1 = north
     * 2 = north-east
     * 3 = east
     * ...
     * 8 = north-west
     *
     * @type {number} rotationIndex
     */
    this.rotationIndex = 1;
};

/**
 * Returns true if the Visitor is blocked on any side
 *
 * @method Visitor#blocked
 * @return {boolean}
 */
Visitor.prototype.blocked = function () {
    return this.body.blocked.up || this.body.blocked.down || this.body.blocked.left || this.body.blocked.right;
};

/**
 * Absconds from Minotaur into reverse direction accelerated by factor 10
 *
 * @method Visitor#flee
 * @param {Minotaur} minotaur
 */
Visitor.prototype.flee = function (minotaur) {
    this.changeDirection(Phaser.Point.angle(this.body.position, minotaur.body.position), 10);
};

/**
 * Starts walking randomly around
 *
 * @method Visitor#startWalking
 */
Visitor.prototype.startWalking = function () {
    this.changeDirection(Math.random() * Math.PI * 2);
};

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
};

/**
 * Grabs treasure
 *
 * @method Visitor#grab
 * @param {Treasure} treasure - The treasure to chase and grab
 */
Visitor.prototype.grab = function (treasure) {
    // Add the treasure value to the wallet
    this.wallet += treasure.value;

    // Run the grab function on the treasure
    treasure.grab();
};

/**
 * Loops the treasure collection. Returns the nearest treasure found
 *
 * @method Visitor#findNearestTreasure
 * @param {Array.<Treasure>} treasures - The treasure collection
 * @return {Treasure|undefined} Nearest treasure found
 */
Visitor.prototype.findNearestTreasure = function (treasures) {
    var maxRange = 150;
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
};

/**
 * Loops the treasure collection. Returns the nearest treasure found
 *
 * @method Visitor#findNearestVisitor
 * @param {Array.<Treasure>} visitors - The visitor collection
 * @return {Treasure|undefined} Nearest treasure found
 */
Visitor.prototype.findNearestVisitor = function (visitors) {
    var maxRange = 50;
    var shortestDistance = 0;
    var nearestTreasure;
    for (var idx in visitors) {
        var distance = Phaser.Point.distance(this.body.position, visitors[idx].body.position, 0);
        if (distance < maxRange && (!shortestDistance || distance < shortestDistance)) {
            nearestTreasure = visitors[idx];
            shortestDistance = distance;
        }
    }
    return nearestTreasure;
};

/**
 * Joins a group with another visitor
 *
 * @method Visitor#meet
 * @param {Visitor} visitor
 */
Visitor.prototype.meet = function (visitor) {
    var maxGroupSize = 6;
    if (this.groupsize < maxGroupSize) {
        this.groupsize += 1;

        if (this.groupSize() > maxGroupSize) {
            this.splitGroup();
        }

        // select a new image for the current view-direction
        this.sprite.frame = -1 + this.groupsize + 10 * this.rotationIndex;

        // transfer the treasures
        this.wallet += visitor.wallet;

        var index = visitors.indexOf(visitor);
        visitors.splice(index, 1);
        visitor.sprite.destroy();
    }
};

/**
 * Updates the Visitor each cycle. Contains the Visitor's KI-circuits.
 *
 * @method Visitor#update
 * @param {Minotaur} minotaur - The player object
 * @param {Array.<Treasure>} treasures - The treasure collection
 */
Visitor.prototype.update = function (minotaur, treasures) {
    // Within this distance a visitor (e.g.) recognises the minotaur.
    var iCanSeeYouDistance = 150;

    //Collision
    this.game.physics.arcade.collide(this.sprite, wallsLayer);
    this.game.physics.arcade.collide(this.sprite, decorationLayer);

    var seesMinotaur = Phaser.Point.distance(this.body.position, minotaur.body.position, 0) < iCanSeeYouDistance;
    var isMoving = this.body.velocity.x || this.body.velocity.y;
    var blocked = this.blocked();
    var nearestTreasure = this.findNearestTreasure(treasures);
    var foundTreasure = typeof nearestTreasure !== 'undefined';
    var seesTreasure = foundTreasure && Phaser.Point.distance(this.body.position, nearestTreasure.body.position, 0) < iCanSeeYouDistance;
    var standsOnTreasure = foundTreasure && Phaser.Point.distance(this.body.position, nearestTreasure.body.position, 0) < 25;
    var foundVisitor = this.findNearestVisitor(visitors);
    var meetVisitor = foundVisitor && Phaser.Point.distance(this.body.position, foundVisitor.body.position, 0) < 25;

    switch (true) {
        case (seesMinotaur):
            this.flee(minotaur);
            break;
        case (standsOnTreasure):
            this.grab(nearestTreasure);
            break;
        case (seesTreasure):
            this.changeDirection(nearestTreasure.body.position);
            break;
        case (meetVisitor):
            this.meet(foundVisitor);
            break;
        case (blocked):
        case (!isMoving):
            this.startWalking();
        default:
    }
};

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
    var sprite = game.add.sprite(gameObject.x, gameObject.y, 'visitor_spritesheet');
    sprite.anchor.setTo(0.5, 0.5);
    sprite.scale.setTo(0.5, 0.5);
    sprite.bringToTop();

    game.physics.arcade.enable(sprite);
    sprite.body.collideWorldBounds = true;

    return new Visitor(game, sprite);
};

/**
 * Sets the orientation of the visitor image.
 * Takes an orientation short cut as argument:
 * n, ne, e, ... or degree.
 *
 * @param {string} orientation
 * @returns {number}
 */
Visitor.prototype.setSpriteOrientation = function (orientation) {
    switch (orientation) {
        case ('n'):
        case (90):
            this.rotationIndex = 1;
            break;
        case ('ne'):
        case (45):
            this.rotationIndex = 2;
            break;
        case ('e'):
        case (0):
            this.rotationIndex = 3;
            break;
        case ('se'):
        case (315):
            this.rotationIndex = 4;
            break;
        case ('s'):
        case (270):
            this.rotationIndex = 5;
            break;
        case ('sw'):
        case (225):
            this.rotationIndex = 6;
            break;
        case ('w'):
        case (180):
            this.rotationIndex = 7;
            break;
        case ('nw'):
        case (135):
            this.rotationIndex = 8;
            break;
        default:
            this.rotationIndex = 1;
            break;
    }
    return this.rotationIndex;
};

/**
 * Splits a group in single people.
 */
Visitor.prototype.splitGroup = function () {
    size = this.groupSize();

    for (var $v = 1; $v < size; $v++) {
        var visitor = Visitor.create(game, this);
        visitor.wallet = Math.floor(this.wallet / size);
        visitor.position = this.position;
        visitor.changeDirection(45 * $v); // stray them in different directions
        visitor.setOrientation(45 * $v);  // prepare change image
        // select a new image for the current view-direction
        visitor.sprite.frame = -1 + visitor.groupsize + 10 * visitor.rotationIndex;
    }

    // at last: modify this visitor:
    this.groupSize(1);
    this.wallet = Math.floor(this.wallet / size);
    this.changeDirection(0); // stray them in different directions
    this.setOrientation(0);  // prepare change image
    // select a new image for the current view-direction
    this.sprite.frame = -1 + this.groupsize + 10 * this.rotationIndex;
};
