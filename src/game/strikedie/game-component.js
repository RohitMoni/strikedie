import React from 'react';
import { Client } from 'boardgame.io/react';
import { Local } from 'boardgame.io/multiplayer';
import { StrikeDieGame } from './game';

const StrikeDieClient = Client({
    game: StrikeDieGame,
    multiplayer: Local(),
});

const TestStrikeDieMultiplayer = () => (
    <div>
        <StrikeDieClient playerID="0" />
        <StrikeDieClient playerID="1" />
    </div>
);

export default TestStrikeDieMultiplayer;