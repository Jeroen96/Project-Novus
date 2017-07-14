/**
 * Created by Jeroen_B on 24-4-2017.
 */
var express = require('express');
var http = require('http');
var https = require('https');
var fs = require('fs');
var mkApi = require('./mk_api');
// var webApi = require('./web_api');
var bodyParser = require('body-parser');
var cors = require('cors');
var app = express();

var settings = require('./config.json');
app.set('secretkey', settings.secretkey);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(cors());

// Redirect from http to https
app.enable('trust proxy');
app.all('*', checkSecure);
function checkSecure(req, res, next) {
    if (req.secure) {
        // request was via https, so do no special handling
        next();
    } else {
        // request was via http, so redirect to https
        res.redirect('https://' + req.headers.host + req.url);
    }
};

// Redirect from www to naked
app.use(wwwRedirect);
function wwwRedirect(req, res, next) {
    if (req.headers.host.slice(0, 4) === 'www.') {
        var newHost = req.headers.host.slice(4);
        return res.redirect(301, req.protocol + '://' + newHost + req.originalUrl);
    }
    next();
};

app.use('/mkApi', mkApi);
// app.use('/api', webApi);

app.get('/info', function (req, res) {
    res.send('Welcome to treepi. This domain is used to host a Node.JS® REST api and Angular site');
});

// Serve angular app
app.use(express.static(__dirname + '/dist/'));
app.use('/home', express.static(__dirname + '/dist/'));
app.use('/downloads', express.static(__dirname + '/dist/'));
app.use('/em', express.static(__dirname + '/dist/'));
app.use('/em/login', express.static(__dirname + '/dist/'));
app.use('/em/dashboard', express.static(__dirname + '/dist/'));
app.use('/em/dashboard/*', express.static(__dirname + '/dist/'));

// SSL options for certificate
var sslPath = '/etc/letsencrypt/live/treepi.dynu.net/';
var options = {
    key: fs.readFileSync(sslPath + 'privkey.pem'),
    cert: fs.readFileSync(sslPath + 'fullchain.pem')
};

http.createServer(app).listen(80);
https.createServer(options, app).listen(443, function () {
    console.log('Node server listening on port 80 and 443');
});
