var Powerups = function (app) {
    this.app = app
    this.powerups = []
    this.maxPowerups = 5
    this.types = ['balloon', 'speed', 'spray']
}

Powerups.prototype.preload = function () {
    for (var value of this.types) {
        this.app.game.load.spritesheet(value, 'assets/images/objects/' + value + '.png', 32, 32)
    }
}

Powerups.prototype.create = function () {
    var sprite
    while (this.powerups.length < this.maxPowerups) {
        sprite = this.app.game.add.sprite(Math.random() * this.app.game.width, Math.random() * this.app.game.height, this.types[Math.floor(Math.random() * this.types.length)])
        this.app.game.physics.arcade.enable(sprite)
        sprite.app = this.app
        this.powerups.push(sprite)
    }
}

Powerups.prototype.update = function () {
    for (var i in this.powerups) {
        if(this.app.game.physics.arcade.collide(this.app.player.plane, this.powerups[i])) {
            this.handleCollision(i)
        }
    }
}

Powerups.prototype.handleCollision = function (index) {
    console.log('Powerup collected')
    var sprite = this.powerups[index]
    var key = sprite.key

    // Fancy collection animation

    // Remove sprite
    sprite.kill()
    this.powerups.splice(index, 1)

    // Apply powerup bonusses
}