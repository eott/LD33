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

    // Add the text for the player gold amount
    var style = { font: "20px Arial", fill: "yellow", stroke: "black", strokeThickness: 7, align: "center" };
    this.text = this.game.add.text(20, 20, this.wallet + ' G', style);
    this.text.fixedToCamera = true;
};

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
};

/**
 * Indicates if user tells to move
 *
 * @method Minotaur#move
 * @retrun {boolean}
 */
Minotaur.prototype.isMoving = function () {
    return cursors.left.isDown || cursors.right.isDown || cursors.up.isDown || cursors.down.isDown
        || cursors.a.isDown || cursors.d.isDown || cursors.w.isDown || cursors.s.isDown;
};

/**
 * Moves the Minotaur by cursors input
 *
 * @method Minotaur#move
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
};

/**
 * Rotates Minotaur towards moving direction
 *
 * @method Minotaur#rotate
 */
Minotaur.prototype.rotate = function () {
    if (this.body.velocity.x == 0 && this.body.velocity.y == 0) return;
    var rotation = getRotationForVelocity(this.body.velocity.x, this.body.velocity.y, "player");    
    if (rotation > (Math.Pi - .5) && rotation < (Math.PI + .5)) rotation = Math.PI - .1 ;
    if (Math.abs(rotation) > Math.PI - .2 && Math.abs(rotation) < Math.PI + .2) {
        this.sprite.rotation = Math.PI;
        return;
    }
    game.add.tween(this.sprite).to({ rotation: rotation }, 40, Phaser.Easing.Linear.Out, true);
};

/**
 * Grabs treasure
 *
 * @method Minotaur#grab
 * @param {Treasure} treasure - The treasure to chase and grab
 */
Minotaur.prototype.grab = function (treasure) {
    // Add the treasure value to the wallet
    this.wallet += treasure.value;
    this.updateCounter(this.wallet);

    // Run the grab function on the treasure
    treasure.grab();
};

/**
 * updates treasure counter
 *
 * @method Minotaur#updateCounter
 * @param {number} value - The value to display
 */
Minotaur.prototype.updateCounter = function (value) {
    // Add the treasure value to the wallet
    this.text.setText(value + ' G');
};

/**
 * Absconds from Visitor into reverse direction accelerated by factor 10
 *
 * @method Minotaur#flee
 * @param {Visitor} person
 */
Minotaur.prototype.flee = function (person) {
    this.changeDirection(Phaser.Point.angle(this.body.position, person.body.position), 10);
};

/**
 * Changes the Minotaur's direction relative to the given target. Or changes
 * the direction by a given angle. Accepts an optional acceleration parameter.
 *
 * @method Minotaur#changeDirection
 * @param {Phaser.Point|number} targetOrAngle - The treasure to chase and grab
 * @param {number} [acceleration] - The factor to accelerate the velocity
 */
Minotaur.prototype.changeDirection = function (targetOrAngle, acceleration) {
    var visitorSpeed = 50;
    if (targetOrAngle instanceof Phaser.Point) {
        targetOrAngle = Phaser.Point.angle(targetOrAngle, this.body.position);
    }
    if (typeof acceleration === 'undefined') {
        acceleration = 1;
    }
    this.body.velocity.y = visitorSpeed * Math.sin(targetOrAngle) * acceleration;
    this.body.velocity.x = visitorSpeed * Math.cos(targetOrAngle) * acceleration;

    // Set orientation of sprite based on movement, ignore small sideways velocities
    var x = this.body.velocity.x;
    var y = this.body.velocity.y;
    var s = Math.sqrt(x * x + y * y);
    x = Math.round(x / s);
    y = Math.round(y / s);
    var orientation = 'n';
    if (x == 0 && y < 0) {
        orientation = 'n';
    } else if (x > 0 && y < 0) {
        orientation = 'ne';
    } else if (x > 0 && y == 0) {
        orientation = 'e';
    } else if (x > 0 && y > 0) {
        orientation = 'se';
    } else if (x == 0 && y > 0) {
        orientation = 's';
    } else if (x < 0 && y > 0) {
        orientation = 'sw';
    } else if (x < 0 && y == 0) {
        orientation = 'w';
    } else if (x < 0 && y < 0) {
        orientation = 'nw';
    }
//    this.setSpriteOrientation(orientation);
};

/**
 * Updates the Minotaur each cycle.
 *
 * @param {Array.<Treasure>} treasures - The treasure collection
 */
Minotaur.prototype.update = function (treasures) {
    // Within this distance the minotaur (e.g.) picks up a treasure.
    var catchReach = 50;

    // Collision
    this.game.physics.arcade.collide(this.sprite, wallsLayer);
    this.game.physics.arcade.collide(this.sprite, decorationLayer);

    // Interact with world
    var foundTreasure = this.findNearestTreasure(treasures);
    var foundGold = typeof foundTreasure !== 'undefined' && Phaser.Point.distance(this.body.position, foundTreasure.body.position, 0) < catchReach;

    switch (true) {
        case (foundGold):
            this.grab(foundTreasure);
            break;
        default:
    }

    // Move and rotate
    this.move();
    this.rotate();
};

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

    // Initialize and return the new Minotaur object
    return new Minotaur(game, sprite);
};