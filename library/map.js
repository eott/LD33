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
    var tiles = this.getTileTypes(50, 38, 16)

    for (var i in tiles) {
        var tile = tiles[i]
        var sprite = this[tile.type].create(tile.x, tile.y, tile.type)
        if (tile.type == 'fire') {
            sprite.animations.add('s');
            sprite.animations.play('s', 3, true);
        }
    }

    // - Teleport on boundaries
    // - Dangerous tiles should have a certain padding away from the boundaries
    // - Map? which shows on which tile the player is on?
}

Map.prototype.update = function () {

}

Map.prototype.getTileTypes = function (sizeX, sizeY, tilesize) {
    var tiles = []

    // Init everything as forest
    for (var i = 0; i < sizeX; i++) {
        tiles[i] = []
        for (var j = 0; j < sizeY; j++) {
            tiles[i][j] = {
                x: i * tilesize,
                y: j * tilesize,
                type: 'forest'
            }
        }
    }

    // Set two mountain ranges
    for (var k = 0; k < 2; k++) {
        var rX = Math.floor(Math.max(0.1, Math.min(0.9, Math.random())) * sizeX),
            rY = Math.floor(Math.max(0.1, Math.min(0.9, Math.random())) * sizeY)

        // Do a random walk over twenty tiles from the starting points
        var dX = 0,
            dY = 0

        for (var i = 0; i < 20; i++) {
            if (tiles[rX + dX] != undefined && tiles[rX + dX][rY + dY] != undefined) {
                tiles[rX + dX][rY + dY].type = 'mountain'
            }
            dX += Math.floor(Math.random() * 3) - 1
            dY += Math.floor(Math.random() * 3) - 1
        }
    }

    // Clear all forest around mountains and change them to gras
    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
            // Iterate over Moore neighborhood
            for (var dX = -1; dX < 2; dX++) {
                for (var dY = -1; dY < 2; dY++) {
                    if (
                        tiles[i + dX] != undefined
                        && tiles[i + dX][j + dY] != undefined
                        && tiles[i + dX][j + dY].type == 'mountain'
                        && tiles[i][j].type == 'forest'
                    ) {
                        tiles[i][j].type = 'gras'
                    }
                }
            }
        }
    }

    // Add some random clearings
    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
            if (tiles[i][j].type == 'forest' && Math.random() < 0.07) {
                tiles[i][j].type = 'gras'
            }
        }
    }

    // Add some random starting fires
    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
            if (tiles[i][j].type == 'forest' && Math.random() < 0.01) {
                tiles[i][j].type = 'fire'
            }
        }
    }

    // Put everything in a flat array for easier iteration
    var ret = []
    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
            ret.push(tiles[i][j])
        }
    }

    return ret
}