var googleapis = require('googleapis');
//var GoogleTokenProvider = require("refresh-token").GoogleTokenProvider;
var googleDrive = require('google-drive');
var request = require('request');
var OAuth2 = googleapis.auth.OAuth2;

var CLIENT_ID = '498533563188-bfo6bd0oj7259t5rse1bca6p6quistv7.apps.googleusercontent.com',
    CLIENT_SECRET = 'BzkQR_BgKpDCBSMjF0cv7-3a',
    REDIRECT_URL = 'http://localhost:2013/oauth2callback',
    ENDPOINT_OF_GDRIVE = 'https://www.googleapis.com/drive/v2',
    SCOPE = 'https://www.googleapis.com/auth/drive';

var auth = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
var token;


exports.getAuthUrl = function () {
    console.log("request for auth url");
    return auth.generateAuthUrl({
        access_type: 'offline', // will return a refresh token
        scope: SCOPE // can be a space-delimited string or an array of scopes
    });
};

exports.isAuthorized = function () {
    return (token && token.access_token);
};

exports.setCode = function (code) {
    var params = {
        code: code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URL,
        grant_type: 'authorization_code'
    };

    request.post('https://accounts.google.com/o/oauth2/token', {form: params}, function (err, resp, body) {
        token = JSON.parse(body);
    });
};


exports.getListOfFolders = function (callback) {
    function foldersHandler(err, response, body) {
        if (err) return console.log('err', err);
        console.log('body', JSON.parse(body).items);
        callback(JSON.parse(body).items);
    }

    googleDrive(token.access_token).files().list({q: "mimeType = 'application/vnd.google-apps.folder'"}, foldersHandler);
};

//function fullGetList() {
//    request.get({
//        'url': ENDPOINT_OF_GDRIVE + '/files/',
//        'qs': {
//            'access_token': token.access_token
//        }
//    }, callback);
//}

