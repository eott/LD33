var Player = function (app) {
    this.app = app
    this.plane
    this.speed = 100
    this.incr = 32
    this.dimension = new Phaser.Point(128, 128)
}

Player.prototype.preload = function () {
    this.app.game.load.spritesheet('plane', 'assets/images/player/plane.png', this.dimension.x, this.dimension.y)
}

Player.prototype.create = function () {
    this.plane = this.app.game.add.sprite(300, 300, 'plane')
    this.app.game.physics.arcade.enable(this.plane)
    this.plane.checkWorldBounds = true
    this.plane.events.onOutOfBounds.add(this.onOutOfBounds, this)

    var angle = Phaser.Point.angle(new Phaser.Point(0, 0), new Phaser.Point(1 * this.speed, 1 * this.speed))
    this.plane.body.velocity.y = Math.sin(angle) * this.speed
    this.plane.body.velocity.x = Math.cos(angle) * this.speed
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
    var angle = Phaser.Point.angle(this.plane.body.velocity, new Phaser.Point(0, 0))

    if (this.app.cursors.left.isDown) {
        angle -= Math.PI / this.incr
    }

    if (this.app.cursors.right.isDown) {
        angle += Math.PI / this.incr
    }

    this.plane.body.velocity.y = Math.sin(angle) * this.speed
    this.plane.body.velocity.x = Math.cos(angle) * this.speed
}

Player.prototype.reset = function () {

}