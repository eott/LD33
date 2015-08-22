var map;
var wallsLayer;
var furnitureLayer;

function gfxPreload() {
    // game.load.spritesheet('explosion', 'assets/images/mobs/explosion_spritesheet.png', 64, 64);
    game.load.tilemap('level', 'assets/maps/demo_level.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('staticSprites', 'assets/images/background/static_spritesheet.png');
}

function gfxCreate() {
    map = this.game.add.tilemap('level');

    // Add the tileset images. The first parameter is the tileset name as
    // specified in Tiled, the second is the key to the asset.
    map.addTilesetImage('static_spritesheet', 'staticSprites');

    // Create layers
    var floorLayer = map.createLayer('Floor');
    wallsLayer = map.createLayer('Walls');
    furnitureLayer = map.createLayer('Furniture');

    // Collision for walls and furniture
    // The second argument is the max amount of tiles that are used. You want
    // to keep it as close as possible to the actual amount due to performance
    // reasons
    map.setCollisionBetween(1, 200, true, 'Walls');
    map.setCollisionBetween(1, 200, true, 'Furniture');

    // Resize the game world to match the layer dimensions
    floorLayer.resizeWorld();
}

function gfxUpdate() {
    
}