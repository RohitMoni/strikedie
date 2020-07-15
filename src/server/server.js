const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();

const port = process.env.PORT || 3000;

// Stop crawlers from seeing our webpage
app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
});

var distPath = path.join(__dirname, '../../dist');
app.use(express.static(distPath));

// Logging middleware to see what requests we get
// Note: This is after our static use, so we don't spam our log with static file requests
app.use((req, res, next) => {
    requestLogData = {
        url: req.originalUrl,
        type: req.method,
        time: Date.now(),
        params: req.params,
    }
    
    console.log("------Request received-------");
    console.log(JSON.stringify(requestLogData));
    console.log("-------End of Request--------");
    next();
});

function HttpResponseCatcher(response) {
    // This middleware catches non-2xx http response codes (like 404s) and makes them errors for handling
    if (!response.ok) {
        throw Error(response.statusText);
    }
    return response;
}

// -------------------------------------------- App specific logic


const lobbyServerIp = "http://localhost";
const lobbyServerPort = 8000;
const gameName = 'strike-die';

var lobbyMapping = {};

function getRandomUnusedString(length, maxRetries=5) {
    for (var i = 0; i < maxRetries; ++i) {
        var randomChars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        var result = '';
        for (var i = 0; i < length; i++) {
            result += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }

        if (!(result in lobbyMapping)) {
            return result;
        }
    }

    throw Error(`Couldn't generate a new lobby mapping string after ${maxRetries} retries...`);
}

app.post('/create-room', (req, res) => {
    fetch(`${lobbyServerIp}:${lobbyServerPort}/games/${gameName}/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            numPlayers: 6,
        }),
    })
    .then(HttpResponseCatcher)
    .then((response) => response.json())
    .then((result) => {
        console.log(result);
        var randomString = getRandomUnusedString(10);
        lobbyMapping[randomString] = result.gameID;
        res.send({ roomCode: randomString });
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({});
    });
});

app.get('/room/:roomCode', function(req, res) {
    const roomCode = req.params.roomCode;
    const gameID = lobbyMapping[roomCode];
    var playerNumber = -1;
    var playerName;
    var players;
    
    // First need to get our room's details, so we can figure out what player number we're joining as / our default name
    fetch(`${lobbyServerIp}:${lobbyServerPort}/games/${gameName}/${gameID}`, {
        headers: {
            'Accept': 'application/json',
        },
    })
    .then(HttpResponseCatcher)
    .then((response) => response.json())
    .then((result) => {
        players = result['players'];

        // Find which player number we are by iterating from 0->n and checking to see which player doesn't already have a name.
        for (var i = 0; i < players.length; ++i) {
            if (!('name' in players[i])) {
                playerNumber = i;
                playerName = `Player_${playerNumber}`;
                return;
            }
        }
    })
    .then(() => {
        if (playerNumber == -1) {
            res.status(507).send({error: "Cannot join game, the lobby is full"});
            throw Error("Cannot join game, the lobby is full");
        }
    })
    .then(() => {
        // Now we can initiate the join lobby request
        return fetch(`${lobbyServerIp}:${lobbyServerPort}/games/${gameName}/${gameID}/join`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify({
                playerID: playerNumber,
                playerName: playerName,
            }),
        })
    })
    .then(HttpResponseCatcher)
    .then((response) => response.json())
    .then((result) => {
        // We should have our player credentials here, can return that to the client for future requests
        console.log(result);
        res.send(result);
    })
    .catch((err) => {
        console.log(err);
        if (!res.headersSent) { // Need to do this to allow earlier steps in the chain to return their own codes and errors to the client
            res.status(500).send({});
        }
    });
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});
