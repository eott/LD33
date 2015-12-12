var Player = function (app) {
    this.app = app
    this.plane
}

Player.prototype.preload = function () {
    this.app.game.load.spritesheet('plane', 'assets/images/player/plane.png', 128, 128)
}

Player.prototype.create = function () {
    this.plane = this.app.game.add.sprite(0, 0, 'plane')
    this.app.game.physics.arcade.enable(this.plane)
    this.plane.checkWorldBounds = true



    this.plane.events.onOutOfBounds.add(this.onOutOfBounds, this)



    this.plane.body.velocity.x = -1000
    this.plane.body.velocity.y = -1000
}

Player.prototype.onOutOfBounds = function(){
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

    this.plane.rotation = this.plane.body.angle + Math.PI/2;

    console.log(this.plane.rotation)

    console.log(Phaser.Point.angle(new Phaser.Point(0, 0), this.plane.body.velocity))

    if (this.app.cursors.left.isDown)
    {
        this.plane.body.velocity.y
    }

    if (this.app.cursors.right.isDown)
    {
        this.plane.body.velocity.y
    }

}

Player.prototype.reset = function () {

}