var GFX = function (app) {
    this.app = app
    this.map = new Map(app)
}

GFX.prototype.preload = function () {
    // Initialize map
    this.map.preload()
}

GFX.prototype.create = function () {
    this.map.create()
}

GFX.prototype.update = function () {
    this.map.update()

    // Draw timer
    if (!this.timerText) {
        this.timerText = this.app.game.add.text(
            this.app.game.width / 2 - 45,
            10,
            this.app.timer.getTimeString(),
            {font: "50px Bangers", fill: "white", stroke: "black", strokeThickness: 7, align: "center"}
        )
        this.timerText.fixedToCamera = true
    } else {
        this.timerText.text = this.app.timer.getTimeString()
    }
}

GFX.prototype.drawEndScreen = function () {
    this.app.game.add.text(
        this.app.game.width / 2 - 120,
        100,
        this.app.getScore() + '% / 100%',
        {font: "50px Bangers", fill: "white", stroke: "black", strokeThickness: 7, align: "center"}
    )
}