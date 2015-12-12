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



    this.plane.body.velocity.x = 1000
    this.plane.body.velocity.y = 1000
}

Player.prototype.onOutOfBounds = function(){
    console.log('collision')
    console.log(this.app.game.height)
    console.log(this.plane.position.y)

    this.plane.position.y = this.app.game.height - this.plane.position.y
    this.plane.position.x = this.app.game.width - this.plane.position.x

    console.log(this.app.game.height)
    console.log(this.plane.position.y)

}

Player.prototype.update = function () {

}

Player.prototype.reset = function () {

}