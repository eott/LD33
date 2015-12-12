var GFX = function (app) {
    this.app = app
    this.map
}

GFX.prototype.preload = function () {
    this.app.game.load.image('ash', 'assets/images/objects/ash.png');
    this.app.game.load.image('fire', 'assets/images/objects/fire.png');
    this.app.game.load.image('forest', 'assets/images/objects/forest.png');
    this.app.game.load.image('gras', 'assets/images/objects/gras.png');
    this.app.game.load.image('mountain', 'assets/images/objects/mountain.png');
}

GFX.prototype.create = function () {
    // Place boxes in the world
    this.map = this.app.game.add.group();
    this.map.enableBody = false;
    var tilesize = 16;

    for (var i = 0; i < 100; i++) {
        for (var j = 0; j < 100; j++) {
            var tile = this.map.create(i * tilesize, j * tilesize, 'ash');
            tile.body.immovable = true;
        }
    }

    // - Teleport on boundaries
    // - Dangerous tiles should have a certain padding away from the boundaries
    // - Map? which shows on which tile the player is on?
}

GFX.prototype.update = function () {
}
