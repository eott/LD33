var App = function () {
    this.cursors
    this.sfx = new SFX(this)
    this.gfx = new GFX(this)
    this.player = new Player(this)
    console.log('Starting App')
    this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameView', this)
}

App.prototype.preload = function () {
    console.log('Loading App')
    this.gfx.preload()
    this.sfx.preload()
    this.player.preload()
}

App.prototype.create = function () {
    console.log('Init App')
    // Init graphics and sound
    this.gfx.create()
    this.sfx.create()
    this.player.create()

    // Init inputs
    this.cursors = this.game.input.keyboard.addKeys({
        'up'   : Phaser.Keyboard.UP,
        'down' : Phaser.Keyboard.DOWN,
        'left' : Phaser.Keyboard.LEFT,
        'right': Phaser.Keyboard.RIGHT,
        'w'    : Phaser.Keyboard.W,
        's'    : Phaser.Keyboard.S,
        'a'    : Phaser.Keyboard.A,
        'd'    : Phaser.Keyboard.D
    })
}

App.prototype.update = function () {
    this.gfx.update()
    this.sfx.update()
    this.player.update()
}