var PowerupDistributor = function (app) {
    this.app = app
    this.powerups = {}
}

PowerupDistributor.prototype.preload = function () {
    for (var value of ['ballon', 'speed', 'spray'])
    {
        this.app.game.load.spritesheet(value, 'assets/images/objects/' + value + '.png', 32, 32)
    }
}

PowerupDistributor.prototype.create = function () {

}

PowerupDistributor.prototype.update = function () {

}