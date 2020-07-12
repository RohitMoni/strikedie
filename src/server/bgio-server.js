 const { Server } = require('boardgame.io/server');
 const { StrikeDieGame } = require('../game/strikedie/game');

 const server = Server({ games: [StrikeDieGame] });

 server.run(8000);