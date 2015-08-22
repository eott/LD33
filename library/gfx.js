var map;
var wallsLayer;
var decorationLayer;

function gfxPreload() {
    // game.load.spritesheet('explosion', 'assets/images/mobs/explosion_spritesheet.png', 64, 64);
    game.load.tilemap('level', 'assets/maps/Level1.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('labyrinthSprites', 'assets/images/background/labyrinth_spritesheet.png');
}

function gfxCreate() {
    map = this.game.add.tilemap('level');

    // Add the tileset images. The first parameter is the tileset name as
    // specified in Tiled, the second is the key to the asset.
    map.addTilesetImage('labyrinth_spritesheet', 'labyrinthSprites');

    // Create layers
    var floorLayer = map.createLayer('Floor');
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
}

function gfxUpdate() {
    
}