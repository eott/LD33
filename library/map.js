var Map = function (app) {
    this.app = app
    this.map // <- still needed ?

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
        this.app.game.load.image(key, 'assets/images/objects/' + key + '.png')
    }
}

Map.prototype.create = function () {
    // Place boxes in the world
    this.map = this.app.game.add.group()
    this.map.enableBody = false
    var tilesize = 16
    var maxMapSize = 100
//    var tiles = []

    for (var i = 0; i < maxMapSize; i++) {
        for (var j = 0; j < maxMapSize; j++) {
            var rand = Math.random()
            var previousProbability = 0;

            for (key in this.probabilities) {
                if (rand < (previousProbability += this.probabilities[key])) {
                    var tile = this.map.create(i * tilesize, j * tilesize, key)
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
