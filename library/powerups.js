var Powerups = function (app) {
    this.app = app
    this.powerups = []
    this.maxPowerups = 5
    this.types = ['ballon', 'speed', 'spray']
}

Powerups.prototype.preload = function () {
    for (var value of this.types)
    {
        this.app.game.load.spritesheet(value, 'assets/images/objects/' + value + '.png', 32, 32)
    }
}

Powerups.prototype.create = function () {
    while (this.powerups.length < this.maxPowerups) {
        this.powerups.push(this.app.add.sprite(Math.random() * this.app.game.width, Math.random() * this.app.game.height, this.types[Math.floor(Math.random() * this.types.length)]))
    }
}

Powerups.prototype.update = function () {

}