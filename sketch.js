const tiles = [];

function preLoad() {
    tiles[0] = loadImage("tiles/blank.png");
    tiles[1] = loadImage("tiles/up.png");
    tiles[2] = loadImage("tiles/right.png");
    tiles[3] = loadImage("tiles/down.png");
    tiles[4] = loadImage("tiles/left.png");
}

function setUp() {
    createCanvas(400, 400);
}

function draw() {
    background(0);
    Image(tiles[0], 0, 0);
    Image(tiles[1], 50, 0);
    Image(tiles[2], 100, 0);
    Image(tiles[4], 150, 0);
    Image(tiles[5], 0, 0);
}