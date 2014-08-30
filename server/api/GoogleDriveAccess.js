var googleapis = require('googleapis');
//var GoogleTokenProvider = require("refresh-token").GoogleTokenProvider;
var googleDrive = require('google-drive');
var request = require('request');
var OAuth2 = googleapis.auth.OAuth2;

var CLIENT_ID = '498533563188-bfo6bd0oj7259t5rse1bca6p6quistv7.apps.googleusercontent.com',
    CLIENT_SECRET = 'BzkQR_BgKpDCBSMjF0cv7-3a',
    REDIRECT_URL = 'http://localhost:2013/oauth2callback',
    ENDPOINT_OF_GDRIVE = 'https://www.googleapis.com/drive/v2',
    SCOPE = 'https://www.googleapis.com/auth/drive';// https://www.googleapis.com/auth/plus.login';

var auth = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);
var token;


exports.getAuthUrl = function () {
    if (exports.isAuthorized()) return "";
    console.log("request for auth url");
    return auth.generateAuthUrl({
        access_type: 'offline', // will return a refresh token
        scope: SCOPE // can be a space-delimited string or an array of scopes
    });
};

exports.isAuthorized = function () {
    return (token && token.access_token);
};

exports.setCode = function (code, callback) {
    var params = {
        code: code,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        redirect_uri: REDIRECT_URL,
        grant_type: 'authorization_code'
    };

    request.post('https://accounts.google.com/o/oauth2/token', {form: params}, function (err, resp, body) {
        token = JSON.parse(body);
        callback();
    });
};

exports.getListOfFolders = function (callback) {
    listFilesFromDrive("mimeType = 'application/vnd.google-apps.folder'", callback);
};

exports.getListOfImages = function (folderId, callback) {
    listFilesFromDrive("'" + folderId + "' in parents and mimeType contains 'image/'", callback);
};

exports.getMetadata = function (id, callback) {
    googleDrive(token.access_token).files(id).get({}, function (err, res, body) {
        if (err) throw err;
        callback(JSON.parse(body));
//        console.log(JSON.parse(body));
    });
};


function listFilesFromDrive(query, callback) {
    function driveFilesHandler(err, response, body) {
        if (err) return console.log('err', err);
        callback(JSON.parse(body).items);
    }

    googleDrive(token.access_token)
        .files()
        .list({q: query, maxResults: 1000}, driveFilesHandler);
}


//function getProfileInfo(folderId, callback) {
//    request.get({
//        'url': 'https://www.googleapis.com/plus/v1/people/me',
//        'qs': {
//            'access_token': token.access_token
//        }
//    }, handleProfileInfo);
//}
//
//function handleProfileInfo(err, result) {
//    console.log(result);
//}

