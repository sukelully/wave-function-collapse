// Grid and tile variables
let grid = [];
const tiles = [];
const DIM = 4;

// Different tile types
const BLANK = 0;
const UP = 1;
const RIGHT = 2;
const DOWN = 3;
const LEFT = 4;

// Rules for tile placement
const rules = [
    [
        [BLANK, UP],
        [BLANK, RIGHT],
        [BLANK, DOWN],
        [BLANK, LEFT],
    ],
    [
        [RIGHT, DOWN, LEFT],
        [UP, DOWN, LEFT],
        [BLANK, DOWN],
        [UP, RIGHT, DOWN],
    ],
    [
        [RIGHT, DOWN, LEFT],
        [UP, DOWN, LEFT],
        [UP, RIGHT, LEFT],
        [BLANK, LEFT],
    ],
    [
        [BLANK, UP],
        [UP, DOWN, LEFT],
        [UP, RIGHT, LEFT],
        [UP, RIGHT, DOWN],
    ],
    [
        [RIGHT, DOWN, LEFT],
        [BLANK, RIGHT],
        [UP, RIGHT, LEFT],
        [UP, RIGHT, DOWN],
    ],
]

// Loads image for each tile type before program starts
function preload() {
    tiles[0] = loadImage("tiles/blank.png");
    tiles[1] = loadImage("tiles/up.png");
    tiles[2] = loadImage("tiles/right.png");
    tiles[3] = loadImage("tiles/down.png");
    tiles[4] = loadImage("tiles/left.png");
}

// Initialise each element in the grid with cell objects containing all tile options
function setup() {
    createCanvas(400, 400);

    for (let i = 0; i < DIM * DIM; i++) {
        grid[i] = {
            collapsed: false,
            options: [BLANK, UP, RIGHT, DOWN, LEFT]
        };
        console.log(grid[i]);
    }
}

// Removes invalid tile choices from cell.options array
function checkValid(arr, valid) {
    for (let i = arr.length - 1; i >= 0; i--) {

        let element = arr[i];
        if (!valid.includes(element)) {
            arr.splice(i, 1);
        }
    }
}

// Draws new tile manually with mouse click
function mousePressed() {
    redraw();
}

// Main drawing logic
function draw() {
    // Clear screen
    background(0);

    // Draw grid cells
    const w = width / DIM;
    const h = height / DIM;

    // Loop through grid and render an image if collapsed or a placeholder square
    for (let j = 0; j < DIM; j++) {
        for (let i = 0; i < DIM; i++) {
            let cell = grid[i + j * DIM];

            if (cell.collapsed) {
                let index = cell.options[0];
                image(tiles[index], i * w, j * h, w, h);
            } else {
                noFill();
                stroke(51);
                rect(i * w, j * h, w, h);
            }
        }
    }

    // Remove collapsed cells from grid and create copy
    let gridCopy = grid.slice();
    gridCopy = gridCopy.filter((a) => !a.collapsed);

    if (gridCopy.length === 0) {
        return;
    }

    // Sort by least entropy (amount of tile choices left available)
    gridCopy.sort((a, b) => {
        return a.options.length - b.options.length;
    });

    // Find cells with same minimum entropy and remove others
    let len = gridCopy[0].options.length;
    let stopIndex = 0;

    for (let i = 1; i < gridCopy.length; i++) {
        if (gridCopy[i].options.length > len) {
            stopIndex = i;
            break;
        }
    }
    if (stopIndex > 0) gridCopy.splice(stopIndex);

    // Choose randomly out of remaining grid cells (all have the same entropy level)
    const cell = random(gridCopy);
    // Choose randomly out of remaining available tiles and collapse the wave function
    const pick = random(cell.options);
    cell.collapsed = true;
    if (pick === undefined) {
        // startOver();
        return;
    }
    cell.options = [pick];

    // Update neighbour cells with new tile options (lowering entropy)
    const nextGrid = [];
    for (let j = 0; j < DIM; j++) {
        for (let i = 0; i < DIM; i++) {
            let index = i + j * DIM;
            if (grid[index].collapsed) {
                nextGrid[index] = grid[index];
            } else {
                let options = [BLANK, UP, RIGHT, DOWN, LEFT];
                //  Look up
                if (j > 0) {
                    let up = grid[i + (j - 1) * DIM];
                    let validOptions = [];
                    for (let option of up.options) {
                        let valid = rules[option][2];
                        validOptions = validOptions.concat(valid);
                    }
                    checkValid(options, validOptions);
                }
                // Look right
                if (i < DIM - 1) {
                    let right = grid[(i + 1) + j * DIM];
                    let validOptions = [];
                    for (let option of right.options) {
                        let valid = rules[option][3];
                        validOptions = validOptions.concat(valid);
                    }
                    checkValid(options, validOptions);
                }
                // Look down
                if (j < DIM - 1) {
                    let down = grid[i + (j + 1) * DIM];
                    let validOptions = [];
                    for (let option of down.options) {
                        let valid = rules[option][0];
                        validOptions = validOptions.concat(valid);
                    }
                    checkValid(options, validOptions);
                }
                // Look left
                if (i > 0) {
                    let left = grid[(i - 1) + j * DIM];
                    let validOptions = [];
                    for (let option of left.options) {
                        let valid = rules[option][1];
                        validOptions = validOptions.concat(valid);
                    }
                    checkValid(options, validOptions);
                }

                nextGrid[index] = {
                    options,
                    collapsed: false,
                };
            }
        }
    }

    grid = nextGrid;

    // noLoop();
}