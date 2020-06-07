import { Client } from 'boardgame.io/client';
import { TicTacToe } from './game';
const Phaser = require('phaser');

class TicTacToeClient {
    constructor() {
        this.client = Client({ game: TicTacToe });
        this.client.subscribe(state => OnStateChanged(state));
        this.client.start();
    }
}

function OnStateChanged(state) {
    redraw(state);
}

const app = new TicTacToeClient();

// Beyond here be phaser rendering

const phaserConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        create: create,
    }
};

const phaserGame = new Phaser.Game(phaserConfig);
var phaserGraphics = null;
var boardConfig = {
    boardSize: 300,
    topLeft: {
        x: 200,
        y: 100
    },
}

function create() {
    const lineWidth = 5;
    phaserGraphics = this.add.graphics({ lineStyle: { width: lineWidth, color: 0xaa00aa } });

    this.input.on('pointerdown', (pointer) => {
        // Calc if we click inside a box
        var boardSpacex = pointer.x - boardConfig.topLeft.x;
        var boardSpacey = pointer.y - boardConfig.topLeft.y;
        if (boardSpacex > 0 && boardSpacex < boardConfig.boardSize &&
            boardSpacey > 0 && boardSpacey < boardConfig.boardSize) 
        {
            // We're clicking in the board, now need to narrow it down
            var xBoardCoord = Math.floor(boardSpacex / (boardConfig.boardSize / 3));
            var yBoardCoord = Math.floor(boardSpacey / (boardConfig.boardSize / 3));
            var arrayIndex = (yBoardCoord * 3) + xBoardCoord;
            app.client.moves.clickCell(arrayIndex);
        }
    });

    redraw();
}

function redraw(state) {
    if (phaserGraphics == null) {
        return;
    }

    phaserGraphics.clear();

    drawBoard();

    drawMoves(state);
}

function drawBoard() {
    var topLeft = boardConfig.topLeft;
    var boardSize = boardConfig.boardSize;
    for (var i = 1; i < 3; ++i) {
        // Draw vertical lines
        var x1 = topLeft.x + (i * boardSize / 3);
        var y1 = topLeft.y;
        var x2 = x1;
        var y2 = y1 + boardSize;
        phaserGraphics.strokeLineShape(new Phaser.Geom.Line(x1, y1, x2, y2));

        // Draw horizontal lines
        x1 = topLeft.x;
        y1 = topLeft.y + (i * boardSize / 3);
        x2 = x1 + boardSize;
        y2 = y1;
        phaserGraphics.strokeLineShape(new Phaser.Geom.Line(x1, y1, x2, y2));
    }
}

function drawMoves(state) {
    if (state == null) {
        return;
    }

    var topLeft = boardConfig.topLeft;
    var boardSize = boardConfig.boardSize;

    function drawX(index) {
        var x1 = topLeft.x + ((index%3) * boardSize / 3) + 20;
        var y1 = topLeft.y + (Math.floor(index/3) * boardSize / 3) + 20;
        var x2 = x1 + (boardSize / 3) - 40;
        var y2 = y1 + (boardSize / 3) - 40;
        phaserGraphics.strokeLineShape(new Phaser.Geom.Line(x1, y1, x2, y2));

        var temp = x1;
        x1 = x2;
        x2 = temp;
        phaserGraphics.strokeLineShape(new Phaser.Geom.Line(x1, y1, x2, y2));
    }

    function drawO(index) {
        var x = topLeft.x + ((index % 3) * boardSize / 3) + (boardSize / 3 / 2);
        var y = topLeft.y + (Math.floor(index / 3) * boardSize / 3) + (boardSize / 3 / 2);
        phaserGraphics.strokeCircleShape(new Phaser.Geom.Circle(x, y, 30));
    }

    for (var i = 0; i < 9; ++i) {
        var cell = state.G.cells[i];
        if (cell == 0) {
            drawX(i);
        }
        else if (cell == 1) {
            drawO(i);
        }
    }
}
