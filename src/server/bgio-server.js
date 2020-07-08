 const { Server } = require('boardgame.io/server');
 const { StrikeDieGame } = require('../game/strikedie/game');

 const server = Server({ games: [StrikeDieGame] });

 game.server.run(8000);