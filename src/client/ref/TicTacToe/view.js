const Phaser = require('phaser');

const phaserConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scale: {
        mode: Phaser.Scale.RESIZE,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    }
};

const renderConfig = {
    board: {
        size: 500,
        topLeft: {
            x: 500,
            y: 100,
        }
    }
};

const ticTacToeScene = new Phaser.Scene('TicTacToe');
ticTacToeScene.create = function() {
    const lineWidth = 5;
    const phaserGraphics = this.add.graphics({ lineStyle: { width: lineWidth, color: 0xaa00aa } });
    this.data.set('graphics', phaserGraphics);

    registerListeners(this);
    render();
}

function registerListeners() {
    ticTacToeScene.input.on('pointerdown', (pointer) => {
        // Calc if we click inside a box
        var boardSpacex = pointer.x - renderConfig.board.topLeft.x;
        var boardSpacey = pointer.y - renderConfig.board.topLeft.y;
        if (boardSpacex > 0 && boardSpacex < renderConfig.board.size &&
            boardSpacey > 0 && boardSpacey < renderConfig.board.size) {
            // We're clicking in the board, now need to narrow it down
            var xBoardCoord = Math.floor(boardSpacex / (renderConfig.board.size / 3));
            var yBoardCoord = Math.floor(boardSpacey / (renderConfig.board.size / 3));
            var arrayIndex = (yBoardCoord * 3) + xBoardCoord;

            view.model.moves.clickCell(arrayIndex);
            render();
        }
    });

    ticTacToeScene.scale.on('resize', (gameSize, baseSize, displaySize, resolution, previousWidth, previousHeight) => {
        renderConfig.board.topLeft.x = gameSize._width / 2 - renderConfig.board.size / 2;
        renderConfig.board.topLeft.y = gameSize._height / 2 - renderConfig.board.size / 2;

        render();
    });

    // Doing this works, but is basically polling our state constantly. Not very efficient for a game like tic-tac-toe,
    // where we could easily do event-based rendering whenever a move is made.
    // ticTacToeScene.events.on('render', render);
}

function render() {
    const graphics = ticTacToeScene.data.get('graphics');
    graphics.clear();

    drawBoard();

    drawMoves();
}

function drawBoard() {
    const graphics = ticTacToeScene.data.get('graphics');

    var topLeft = renderConfig.board.topLeft;
    var size = renderConfig.board.size;
    for (var i = 1; i < 3; ++i) {
        // Draw vertical lines
        var x1 = topLeft.x + (i * size / 3);
        var y1 = topLeft.y;
        var x2 = x1;
        var y2 = y1 + size;
        graphics.strokeLineShape(new Phaser.Geom.Line(x1, y1, x2, y2));

        // Draw horizontal lines
        x1 = topLeft.x;
        y1 = topLeft.y + (i * size / 3);
        x2 = x1 + size;
        y2 = y1;
        graphics.strokeLineShape(new Phaser.Geom.Line(x1, y1, x2, y2));
    }
}

function drawMoves() {
    const graphics = ticTacToeScene.data.get('graphics');

    var topLeft = renderConfig.board.topLeft;
    var size = renderConfig.board.size;

    function drawX(index) {
        var x1 = topLeft.x + ((index % 3) * size / 3) + 20;
        var y1 = topLeft.y + (Math.floor(index / 3) * size / 3) + 20;
        var x2 = x1 + (size / 3) - 40;
        var y2 = y1 + (size / 3) - 40;
        graphics.strokeLineShape(new Phaser.Geom.Line(x1, y1, x2, y2));

        var temp = x1;
        x1 = x2;
        x2 = temp;
        graphics.strokeLineShape(new Phaser.Geom.Line(x1, y1, x2, y2));
    }

    function drawO(index) {
        var x = topLeft.x + ((index % 3) * size / 3) + (size / 3 / 2);
        var y = topLeft.y + (Math.floor(index / 3) * size / 3) + (size / 3 / 2);
        graphics.strokeCircleShape(new Phaser.Geom.Circle(x, y, size / 10));
    }

    for (var i = 0; i < 9; ++i) {
        var cell = view.model.getState().G.cells[i];
        if (cell == 0) {
            drawX(i);
        }
        else if (cell == 1) {
            drawO(i);
        }
    }
}

class TicTacToeView {
    constructor() {}

    start() {
        this.phaserGame = new Phaser.Game(phaserConfig);
        const autoStart = true;
        this.phaserGame.scene.add('scene', ticTacToeScene, autoStart);
    }
}

const view = new TicTacToeView();

export {
    view,
};
