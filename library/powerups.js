var Powerups = function (app) {
    this.app = app
    this.powerups = []
    this.maxPowerups = 5
    this.types = ['balloon', 'speed', 'spray']
}

Powerups.prototype.preload = function () {
    for (var value of this.types)
    {
        this.app.game.load.spritesheet(value, 'assets/images/objects/' + value + '.png', 32, 32)
    }
}

Powerups.prototype.create = function () {
    var sprite
    while (this.powerups.length < this.maxPowerups) {
        sprite = this.app.add.sprite(Math.random() * this.app.game.width, Math.random() * this.app.game.height, this.types[Math.floor(Math.random() * this.types.length)])
        this.powerups.push(sprite)
        this.app.game.physics.arcade.collide(
            this.app.player.plane,
            sprite,
            function () {
                console.log('power up collected')
            },
            null,
            this)
    }
}

Powerups.prototype.update = function () {

}