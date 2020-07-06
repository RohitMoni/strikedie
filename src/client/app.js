import { Client } from 'boardgame.io/client';
import { StrikeDieGame } from './strikedie/game'

class StrikeDieClient {
    constructor() {
        this.client = Client({
          game: StrikeDieGame,
          numPlayers: 6
        });
        this.client.start();
    }
}

const app = new StrikeDieClient();
