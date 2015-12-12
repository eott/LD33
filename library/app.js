var APP = function () {
    console.log('Starting app')
    this.game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameView', { preload: this.load, create: this.init, update: this.update })
    this.cursors
    this.sfx = new SFX(this)
    this.gfx = new GFX(this)
    this.player = new Player(this)
}

APP.prototype.load = function () {
    console.log('Loading app')
    this.gfx.load()
    this.sfx.load()
    this.player.load()
}

APP.prototype.init = function () {
    console.log('Init app')
    // Init graphics and sound
    this.gfx.init()
    this.sfx.init()
    this.player.init()

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

APP.prototype.update = function () {
    this.gfx.update()
    this.sfx.update()
    this.player.update()
}