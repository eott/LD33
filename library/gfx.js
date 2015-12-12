var gfx = (function () {
    var app;
    var map;
    var floorLayer
    var wallsLayer;
    var decorationLayer;
    var walkables;

    function load(app) {
        this.app = app;
        // game.load.spritesheet('explosion', 'assets/images/mobs/explosion_spritesheet.png', 64, 64);
        this.app.game.load.tilemap('level', 'assets/maps/Level1.json', null, Phaser.Tilemap.TILED_JSON);
        this.app.load.image('labyrinthSprites', 'assets/images/background/labyrinth_spritesheet.png');
    }

    function init() {
        map = app.game.add.tilemap('level');

        // Add the tileset images. The first parameter is the tileset name as
        // specified in Tiled, the second is the key to the asset.
        map.addTilesetImage('labyrinth_spritesheet', 'labyrinthSprites');

        // Create layers
        floorLayer = map.createLayer('Floor');
        wallsLayer = map.createLayer('Walls');
        decorationLayer = map.createLayer('Decoration');

        // Collision for walls and furniture
        // The second argument is the max amount of tiles that are used. You want
        // to keep it as close as possible to the actual amount due to performance
        // reasons
        map.setCollisionBetween(1, 500, true, 'Walls');
        map.setCollisionBetween(1, 10, true, 'Decoration');

        // Resize the game world to match the layer dimensions
        floorLayer.resizeWorld();

        // Prepare pathfinding plugin
        var grid = map.layers[0].data;
        walkables = [];

        for (var row in grid) {
            walkables[row] = [];
            for (var col in grid[row]) {
                var tile = grid[row][col];

                walkables[row][col] = tile.index > 0;
            }
        }
    }

    function update() {

    }

    return {
        load  : load,
        init  : init,
        update: update
    };
})();