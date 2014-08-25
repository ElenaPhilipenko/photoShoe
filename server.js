//var static = require('node-static');
var http = require('http');
var express = require('express');
var path = require('path');


function root(path) {
    return __dirname + "/" + path;
}
global.rootPath = root;
var drive = require(root('server/DriveService'));

var app = express();
app.set('port', 2013);
app.use(express.static(path.join(__dirname, 'application')));

app.get('/', function (req, res) {
    res.sendFile(root("./application/pages/index.html"));
});

var api = "/api";

app.get(api + '/url', drive.getAuthUrl);
app.get(api + '/auth', drive.getAuth);

app.get(api + '/list', drive.printList);
app.get(api + '/photos', drive.findPhotos);
app.get('/oauth2callback', drive.setCode);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

