var PowerupDistibutor = function (app) {
    this.app = app
    this.powerups = {}
}

Powerup.prototype.preload = function () {
    for (var value of ['ballon', 'speed', 'spray'])
    {
        this.app.game.load.spritesheet(value, 'assets/images/objects/' + value + '.png', 32, 32)
    }
}

Powerup.prototype.create = function () {

}

Powerup.prototype.update = function () {

}