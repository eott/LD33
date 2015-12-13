var Powerups = function (app) {
    this.app = app
    this.powerups = []
    this.maxPowerups = 5
    this.types = ['balloon', 'speed', 'spray']
    this.counter = 0
}

Powerups.prototype.preload = function () {
    for (var value of this.types) {
        this.app.game.load.spritesheet(value, 'assets/images/objects/' + value + '.png', 32, 32)
    }
}

Powerups.prototype.create = function () {
    while (this.powerups.length < this.maxPowerups) {
        this.spawn()
    }
}

Powerups.prototype.update = function () {
    for (var i in this.powerups) {
        if(this.app.game.physics.arcade.collide(this.app.player.plane, this.powerups[i])) {
            this.handleCollision(i)
        }
    }

    while (this.powerups.length < this.maxPowerups && !this.counter) {
        this.spawn()
        counter += 100
    }

    counter--
}

Powerups.prototype.handleCollision = function (index) {
    console.log('Powerup collected')
    var sprite = this.powerups[index]

    // Fancy collection animation
    this.app.sfx.play('pickup')

    // Apply powerup bonusses
    if(sprite.key = 'speed') {
        this.app.player.speedModifier += 100
    }

    if(sprite.key = 'balloon') {
    }

    if(sprite.key = 'spray') {
    }

    // Remove sprite
    sprite.kill()
    this.powerups.splice(index, 1)
}

Powerups.prototype.spawn = function () {
    var sprite = this.app.game.add.sprite(Math.random() * this.app.game.width, Math.random() * this.app.game.height, this.types[Math.floor(Math.random() * this.types.length)])
    this.app.game.physics.arcade.enable(sprite)
    this.powerups.push(sprite)
}