var Map = function (app) {
    this.app = app

    this.types = [
        'fire',
        'forest',
        'mountain',
        'ash',
        'gras'
    ]
}

Map.prototype.preload = function () {
    for (key in this.types) {
        type = this.types[key]

        this[type] = this.app.game.add.group()
        this[type].enableBody = false

        if (type == 'fire') {
            this.app.game.load.spritesheet(type, 'assets/images/objects/' + type + '.png', 16, 16)
        } else {
            this.app.game.load.image(type, 'assets/images/objects/' + type + '.png')
        }
    }
}

Map.prototype.create = function () {
    this.tiles = this.generateTiles(50, 38, 16)

    for (var i = 0; i < this.tiles.length; i++) {
        for (var j = 0; j < this.tiles[i].length; j++) {
            var tile = this.tiles[i][j],
                sprite = this[tile.type].create(tile.x, tile.y, tile.type)

            if (tile.type == 'fire') {
                sprite.animations.add('s');
                sprite.animations.play('s', 3, true);
            }
        }
    }

    // - Teleport on boundaries
    // - Dangerous tiles should have a certain padding away from the boundaries
    // - Map? which shows on which tile the player is on?
}

Map.prototype.update = function () {

}

Map.prototype.generateTiles = function (sizeX, sizeY, tilesize) {
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

    return tiles
}