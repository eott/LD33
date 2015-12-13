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
}
