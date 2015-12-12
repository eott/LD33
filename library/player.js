var Player = function (app) {
    this.app = app
}

Player.prototype.load = function () {
    self.app = app;
}

Player.prototype.init = function () {
    // Camera and game world
    app.game.camera.follow(player.sprite);
    app.game.world.setBounds(0, 0, 2500, 2500);
}

Player.prototype.update = function () {

}

Player.prototype.reset = function () {

}