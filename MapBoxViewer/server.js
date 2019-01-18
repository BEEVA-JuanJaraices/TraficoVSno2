
const express = require('express');
var engines = require('consolidate');
var httpProxy = require('http-proxy');

// Constants
const PORT = 8080;
const HOST = '0.0.0.0';

// App
const app = express();
app.use(express.static('webmap'));

app.set('views', __dirname + '/webmap');
app.engine('html', engines.mustache);
app.set('view engine', 'html');

app.get('/webmap', function(req, res) {
       
    var mapboxApiKey = process.env.MAPBOX_API_KEY;

    res.render( __dirname + "/webmap/index.html", {
        mapboxApiKey: mapboxApiKey
    });
});

app.listen(PORT, HOST);
console.log(`Running on http://${HOST}:${PORT}`);