var player = (function(){
    var self = this;
    var app;

    function load(app){
        self.app = app;
    }

    function init(){
        // Camera and game world
        app.game.camera.follow(player.sprite);
        app.game.world.setBounds(0, 0, 2500, 2500);
    }

    function update (){

    }

    function reset (){

    }

    return {
        load: load,
        init: init,
        update: update,
        reset: reset
    }
})();
