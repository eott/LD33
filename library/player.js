var Player = function (app) {
    this.app = app

    this.load = function () {
        self.app = app;
    }

    this.init = function () {
        // Camera and game world
        app.game.camera.follow(player.sprite);
        app.game.world.setBounds(0, 0, 2500, 2500);
    }

    this.update = function () {

    }

    this.reset = function () {

    }
}
