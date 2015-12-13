var GFX = function (app) {
    this.app = app
    this.map = new Map(app)

    this.probabilities = {
        ash     : 0.1,
        fire    : 0.2,
        forest  : 0.5,
        gras    : 0.9,
        mountain: 1
    }
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
