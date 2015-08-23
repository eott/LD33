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
    this.treasures = 0;
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

var maxGroupSize = 6;

/**
 * Setter / getter for the group size.
 *
 * @param size
 * @returns {number}
 */
Visitor.prototype.groupSize = function (size) {
    if (size) {
        this.groupsize = size;
    }

    return this.groupsize;
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
    this.treasures.push(treasure);

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
 * Updates the Visitor each cycle. Contains the Visitor's KI-circuits.
 *
 * @method Visitor#update
 * @param {Minotaur} minotaur - The player object
 * @param {Array.<Treasure>} treasures - The treasure collection
 */
Visitor.prototype.update = function (minotaur, treasures) {
    //Collision
    this.game.physics.arcade.collide(this.sprite, wallsLayer);
    this.game.physics.arcade.collide(this.sprite, decorationLayer);

    var seesMinotaur = Phaser.Point.distance(this.body.position, minotaur.body.position, 0) < iCanSeeYouDistance;
    var isMoving     = this.body.velocity.x || this.body.velocity.y;
    var blocked      = this.blocked();
    var foundTreasure = this.findNearestTreasure(treasures);

    var seesTreasure = false;
    if (typeof foundTreasure != 'undefined') {
        seesTreasure = Phaser.Point.distance(this.body.position, foundTreasure.body.position, 0) < iCanSeeYouDistance;
    }

    var foundVisitor = this.findNearestVisitor(visitors);

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
        case (seesTreasure):
            this.changeDirection(foundTreasure.body.position);
            break;
        case (foundVisitor):
            var meetVisitor = Phaser.Point.distance(this.body.position, foundVisitor.body.position, 0) < 5;
            if (meetVisitor) {
                this.groupsize += 1;

                if (this.groupSize() > maxGroupSize) {
                    this.splitGroup();
                }

                // select a new image for the current view-direction
                this.sprite.frame = this.groupsize + 10 * this.rotationIndex;

                // transfer the treasures
                groupTreasures = this.treasures.concat(foundVisitor.treasures);
                this.treasures = groupTreasures;
                foundVisitor.destroy();
            }
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
    var sprite = game.add.sprite(gameObject.x, gameObject.y, 'visitor');
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
 * n, ne, e, ...
 *
 * @param {string} skyDir
 * @returns {number}
 */
Visitor.prototype.setSpriteOrientation = function (orientation) {
    switch (orientation) {
        case ('n'):
            this.rotationIndex = 1;
            break;
        case ('ne'):
            this.rotationIndex = 2;
            break;
        case ('e'):
            this.rotationIndex = 3;
            break;
        case ('se'):
            this.rotationIndex = 4;
            break;
        case ('s'):
            this.rotationIndex = 5;
            break;
        case ('sw'):
            this.rotationIndex = 6;
            break;
        case ('w'):
            this.rotationIndex = 7;
            break;
        case ('nw'):
            this.rotationIndex = 8;
            break;
        default:
            this.rotationIndex = 1;
            break;
    }
    return this.rotationIndex;
};


