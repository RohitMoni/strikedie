import { Client } from 'boardgame.io/client';
import { TicTacToe } from './game';

class TicTacToeClient {
    constructor() {
        this.client = Client({ game: TicTacToe });
        this.client.start();
    }
}

const app = new TicTacToeClient();