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

app.get('/join/:roomCode', function(req, res) {

    const roomCode = req.params.roomCode;
    const gameID = lobbyMapping[roomCode];
    var playerNumber;
    var playerName;
    var players;
    
    fetch(`${lobbyServerIp}:${lobbyServerPort}/games/${gameName}/${gameID}`, {
        headers: {
            'Accept': 'application/json',
        },
    })
    .then(HttpResponseCatcher)
    .then((response) => response.json())
    .then((result) => {
        console.log(result);
        players = result['players'];
        // Todo: Figure out how many players in room
        numPlayersInRoom = 0;

        playerNumber = numPlayersInRoom + 1;
        playerName = `Player_${playerNumber}`;
    })
    .then(() => {
        if (playerNumber > players.length) {
            // No space. Return error, couldn't join the game because full
        }
    })
    .then(() => {
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
        console.log(result);
    })
    .catch((err) => {
        console.log(err);
        res.status(500).send({});
    });



    // TODO: make a GET request for the the specific room data (number of players joined already) and use
    // that to set the playerID and playerName for the join request

    // TODO: make the roomCode and roomID be a mapping so that the BGIO roomID is abstracted from client code.

    // fetch(`${lobbyServerIp}:${lobbyServerPort}/games/StrikeDieGame/${roomID}/join`, {
    //     method: 'POST',
    //     headers: {
    //         'Content-Type': 'application/json',
    //         'Accept': 'application/json',
    //     },
    //     body: JSON.stringify({
    //         playerID: 0,            // TODO: fix this
    //         playerName: "jane",     // TODO: fix this
    //     }),
    // })
    // .then((response) => {
    //     result = response.json(); 
    //     console.log(result);
    //     // TODO: return a response
    // })
    // .catch((error) => console.log(error));
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});
