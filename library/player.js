var Player = function (app) {
    this.app = app
    this.plane
    this.speed = 140
    this.incr = 100
    this.frameCounter = 0
    this.dimension = new Phaser.Point(64, 64)
    this.speedModifier = 0
}

Player.prototype.preload = function () {
    this.app.game.load.spritesheet('plane', 'assets/images/player/plane.png', this.dimension.x, this.dimension.y)
}

Player.prototype.create = function () {
    this.plane = this.app.game.add.sprite(300, 300, 'plane')
    this.plane.anchor = new Phaser.Point(0.5, 0.5)
    this.app.game.physics.arcade.enable(this.plane)
    this.plane.checkWorldBounds = true
    this.plane.events.onOutOfBounds.add(this.onOutOfBounds, this)

    this.plane.body.velocity.x = this.modifiedSpeed()
    this.plane.body.velocity.y = this.modifiedSpeed()

    this.plane.animations.add('s')
    this.plane.animations.play('s', 20, true)
}

Player.prototype.onOutOfBounds = function () {
    console.log('collision')

    if (this.plane.position.y >= this.app.game.height) {
        this.plane.position.y = 0
    } else if (this.plane.position.y <= 0) {
        this.plane.position.y = this.app.game.height
    }

    if (this.plane.position.x >= this.app.game.width) {
        this.plane.position.x = 0
    } else if (this.plane.position.x <= 0) {
        this.plane.position.x = this.app.game.width
    }
}

Player.prototype.update = function () {

    // Rotation for sprite
    this.plane.rotation = this.plane.body.angle + Math.PI / 2

    //Direction for velocity
    var angle = this.plane.body.angle

    if (this.app.cursors.left.isDown) {
        angle -= Math.PI / this.incr
    }

    if (this.app.cursors.right.isDown) {
        angle += Math.PI / this.incr
    }

    this.plane.body.velocity.y = Math.sin(angle) * this.modifiedSpeed()
    this.plane.body.velocity.x = Math.cos(angle) * this.modifiedSpeed()

    // This method is costly, so we want to fire it only every so often
    if (this.frameCounter++ % 5 == 0) {
        this.app.gfx.map.extinguishAround(this.plane.position.x, this.plane.position.y, 1)
    }
}

Player.prototype.reset = function () {

}

Player.prototype.modifiedSpeed = function(){
    return this.speed + this.speedModifier / this.incr
}
