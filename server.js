//var static = require('node-static');
var http = require('http');
var express = require('express');
var parser = require('body-parser');
var path = require('path');


function root(path) {
    return __dirname + "/" + path;
}
global.rootPath = root;
var drive = require(root('server/DriveService'));
var presentation = require(root('server/ShowService'));

var app = express();
app.set('port', process.env.OPENSHIFT_NODEJS_PORT || 2013);
app.use(parser.json());
app.use(parser.urlencoded({ extended: false }));
//app.use(parser.methodOverride());
//app.use(app.router);
app.use(express.static(path.join(__dirname, 'application')));

app.get('/', function (req, res) {
    res.sendFile(root("./application/pages/index.html"));
});
app.get('/myDrive', function (req, res) {
    res.sendFile(root("./application/pages/application.html"));
});

var api = "/api";

app.get(api + '/url', drive.getAuthUrl);
app.get(api + '/auth', drive.getAuth);

app.get(api + '/list', drive.printList);
app.get(api + '/info', drive.getInfo);
app.get(api + '/photos', drive.findPhotos);
app.get('/oauth2callback', drive.setCode);

app.post(api + '/startPresentation', presentation.startPresentationh);
app.get(api + '/getCurrentPhoto', presentation.getCurrentPhoto);
app.post(api + '/setCurrentPhoto', presentation.setCurrentPhoto);
app.post(api + '/endPresentation', presentation.endPresentation);

http.createServer(app).listen(app.get('port'), function () {
    console.log('Express server listening on port ' + app.get('port'));
});

