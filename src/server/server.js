const express = require('express');
const path = require('path');

const app = express();

const port = process.env.PORT || 3000;

// Stop crawlers from seeing our webpage
app.get('/robots.txt', function (req, res) {
    res.type('text/plain');
    res.send("User-agent: *\nDisallow: /");
});

var distPath = path.join(__dirname, '../../dist');
console.log(distPath);
app.use(express.static(distPath));

app.listen(port, () => {
    console.log(`App listening on port ${port}`)
});