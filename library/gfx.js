var GFX = function (app) {
    this.app = app
    this.map

    this.probabilities = {
        ash:      0,
        fire:     0.2,
        forest:   0.6,
        gras:     1,
        mountain: 0
    }
}

GFX.prototype.preload = function () {
    for (key in this.probabilities) {
        this.app.game.load.image(key, 'assets/images/objects/' + key + '.png');
    }
}

GFX.prototype.create = function () {
    // Place boxes in the world
    this.map = this.app.game.add.group();
    this.map.enableBody = false;
    var tilesize = 16;

    for (var i = 0; i < 100; i++) {
        for (var j = 0; j < 100; j++) {
            var rand = Math.random();
            for (key in this.probabilities) {
                if (rand < this.probabilities[key]) {
                    var tile = this.map.create(i * tilesize, j * tilesize, key, 100);
                    break;
                }
            }
        }
    }

    // - Teleport on boundaries
    // - Dangerous tiles should have a certain padding away from the boundaries
    // - Map? which shows on which tile the player is on?
}

GFX.prototype.update = function () {
}
