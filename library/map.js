var Map = function (app) {
    this.app = app

    this.probabilities = {
        ash     : 0.01,
        fire    : 0.1,
        forest  : 0.42,
        gras    : 0.44,
        mountain: 0.03
    }
}

Map.prototype.preload = function () {
    this.gras = this.app.game.add.group()
    this.forest = this.app.game.add.group()
    this.mountain = this.app.game.add.group()
    this.ash = this.app.game.add.group()
    this.fire = this.app.game.add.group()

    for (key in this.probabilities) {
        if (key == 'fire') {
            this.app.game.load.spritesheet(key, 'assets/images/objects/' + key + '.png', 16, 16)
        } else {
            this.app.game.load.image(key, 'assets/images/objects/' + key + '.png')
        }
        this[key].enableBody = false
    }
}

Map.prototype.create = function () {
    var tilesize = 16,
        maxMapSizeX = 50,
        maxMapSizeY = 38

    for (var i = 0; i < maxMapSizeX; i++) {
        for (var j = 0; j < maxMapSizeY; j++) {
            var rand = Math.random()
            var previousProbability = 0;

            for (key in this.probabilities) {
                if (rand < (previousProbability += this.probabilities[key])) {
                    var tile = this[key].create(i * tilesize, j * tilesize, key)
                    if (key == 'fire') {
                        tile.animations.add('s');
                        tile.animations.play('s', 3, true);
                    }
                    break
                }
            }
        }
    }

    // - Teleport on boundaries
    // - Dangerous tiles should have a certain padding away from the boundaries
    // - Map? which shows on which tile the player is on?
}

Map.prototype.update = function () {

}
