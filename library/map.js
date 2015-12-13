var Map = function (app) {
    this.app = app
    this.frameCounter = 0

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
    // Width: 50 tiles, Height: 38 tiles, Tilesize: 16px
    this.generateTiles(50, 38, 16)

    for (var i = 0; i < this.tiles.length; i++) {
        for (var j = 0; j < this.tiles[i].length; j++) {
            var tile = this.tiles[i][j],
                sprite = this[tile.type].create(tile.x, tile.y, tile.type)

            // Set the sprite, so we later have access
            tile.sprite = sprite

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
    // The map doesn't need to update every frame
    if (this.frameCounter++ % 15 == 0) {
        // Spread fire
        this.fire.forEach(function (item) {
            this.applyOnMooreNeighborhood(item.position.x / 16, item.position.y / 16, 'forest', function (found) {
                if (Math.random() < 0.003) {
                    found.sprite.loadTexture('fire', 0)
                    this.fire.add(found.sprite)
                    found.type = 'fire'
                }
            }.bind(this));
        }, this)
    }
}

Map.prototype.generateTiles = function (sizeX, sizeY, tilesize) {
    this.tiles = []

    // Init everything as forest
    for (var i = 0; i < sizeX; i++) {
        this.tiles[i] = []
        for (var j = 0; j < sizeY; j++) {
            this.tiles[i][j] = {
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
            if (
                this.tiles[rX + dX] != undefined
                && this.tiles[rX + dX][rY + dY] != undefined
            ) {
                this.tiles[rX + dX][rY + dY].type = 'mountain'
            }
            dX += Math.floor(Math.random() * 3) - 1
            dY += Math.floor(Math.random() * 3) - 1
        }
    }

    // Clear all forest around mountains and change them to gras
    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
            if (
                this.tiles[i][j].type == 'forest'
                && this.getMooreNeighborhood(i, j, 'mountain').length > 0
            ) {
                this.tiles[i][j].type = 'gras'
            }
        }
    }

    // Add some random clearings
    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
            if (this.tiles[i][j].type == 'forest' && Math.random() < 0.07) {
                this.tiles[i][j].type = 'gras'
            }
        }
    }

    // Add some random starting fires
    for (var i = 0; i < sizeX; i++) {
        for (var j = 0; j < sizeY; j++) {
            if (this.tiles[i][j].type == 'forest' && Math.random() < 0.01) {
                this.tiles[i][j].type = 'fire'
            }
        }
    }
}

Map.prototype.getMooreNeighborhood = function (x, y, type) {
    type = type || 'all'

    var found = []

    for (var dX = -1; dX < 2; dX++) {
        for (var dY = -1; dY < 2; dY++) {
            if (
                this.tiles[x + dX] != undefined
                && this.tiles[x + dX][y + dY] != undefined
                && (
                    type == 'all'
                    || this.tiles[x + dX][y + dY].type == type
                )
            ) {
                found.push(this.tiles[x + dX][y + dY])
            }
        }
    }

    return found
}

Map.prototype.applyOnMooreNeighborhood = function (x, y, type, callback) {
    var nbh = this.getMooreNeighborhood(x, y, type)

    for (var i in nbh) {
        callback(nbh[i])
    }
}