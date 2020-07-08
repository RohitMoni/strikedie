const express = require('express');
const path = require('path');

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
console.log(distPath);
app.use(express.static(distPath));

app.post('/create-room', function(req, res) {
    const response = await fetch(`${lobbyServerIp}:${lobbyServerPort}/games/StrikeDieGame/create`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            numPlayers: 6,
            unlisted: true,
        }),
    });
    const result = await response.json();
    console.log(result);

    // TODO: make the roomCode and roomID be a mapping so that the BGIO roomID is abstracted from client code.
    res.send({roomCode: result.roomID})
})

app.post('/join-room/:roomcode', function(req, res) {
    console.log(req.params);

    // TODO: make a GET request for the the specific room data (number of players joined already) and use
    // that to set the playerID and playerName for the join request

    // TODO: make the roomCode and roomID be a mapping so that the BGIO roomID is abstracted from client code.
    let roomID = req.params.roomCode;

    const response = await fetch(`${lobbyServerIp}:${lobbyServerPort}/games/StrikeDieGame/${roomID}/join`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
        },
        body: JSON.stringify({
            playerID: 0,            // TODO: fix this
            playerName: "jane",     // TODO: fix this
        }),
    });
    const result = await response.json();
    console.log(result);

    // TODO: return a response
})

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});