const express = require('express');
const path = require('path');
const fetch = require('node-fetch');

const app = express();

const port = process.env.PORT || 3000;

const lobbyServerIp = "http://localhost";
const lobbyServerPort = 8000;

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
});

app.post('/create-room', async (req, res) => {
    console.log("Test 1");
    fetch(`${lobbyServerIp}:${lobbyServerPort}/games/StrikeDieGame/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            numPlayers: 6,
        }),
    })
    .then((response) => {
        console.log("test 2");
        resule = response.json();
        console.log(result);
        // TODO: make the roomCode and roomID be a mapping so that the BGIO roomID is abstracted from client code.
        res.send({ roomCode: result.roomID });
    })
    .catch((error) => console.log(error));
});

app.post('/join-room/:roomCode', function(req, res) {
    // TODO: make a GET request for the the specific room data (number of players joined already) and use
    // that to set the playerID and playerName for the join request

    // TODO: make the roomCode and roomID be a mapping so that the BGIO roomID is abstracted from client code.
    var roomID = req.params.roomCode;

    fetch(`${lobbyServerIp}:${lobbyServerPort}/games/StrikeDieGame/${roomID}/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            playerID: 0,            // TODO: fix this
            playerName: "jane",     // TODO: fix this
        }),
    })
    .then((response) => {
        result = response.json(); 
        console.log(result);
        // TODO: return a response
    })
    .catch((error) => console.log(error));
});

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});
