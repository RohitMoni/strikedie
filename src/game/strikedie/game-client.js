import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { StrikeDieGame } from './game';

const StrikeDieClient = Client({
    game: StrikeDieGame,
    multiplayer: Local(),
});

export default StrikeDieClient;