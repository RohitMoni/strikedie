import { Client } from 'boardgame.io/client';
import { TicTacToe } from './game';
const Phaser = require('phaser');

class TicTacToeClient {
    constructor() {
        this.client = Client({ game: TicTacToe });
        this.client.start();
    }
}

const app = new TicTacToeClient();

const phaserConfig = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    scene: {
        create: create,
    }
};

const phaserGame = new Phaser.Game(phaserConfig);

function create() {
    const lineWidth = 5;
    const boardSize = 300;
    var graphics = this.add.graphics({ lineStyle: { width: lineWidth, color: 0xaa00aa } });

    redraw();

    function redraw() {
        graphics.clear();

        drawBoard();

        drawMoves();
    }

    function drawBoard() {
        const topLeft = {
            x: 100,
            y: 100
        };

        for (var i = 1; i < 3; ++i) {
            // Draw vertical lines
            var x1 = topLeft.x + (i * boardSize / 3);
            var y1 = topLeft.y;
            var x2 = x1;
            var y2 = y1 + boardSize;
            graphics.strokeLineShape(new Phaser.Geom.Line(x1, y1, x2, y2));

            // Draw horizontal lines
            x1 = topLeft.x;
            y1 = topLeft.y + (i * boardSize / 3);
            x2 = x1 + boardSize;
            y2 = y1;
            graphics.strokeLineShape(new Phaser.Geom.Line(x1, y1, x2, y2));
        }
    }

    function drawMoves() {
        // graphics.strokeLineShape(new Phaser.Geom.Line(100, 100, 300, 400));
    }
}
