var googleapis = require('googleapis');
//var GoogleTokenProvider = require("refresh-token").GoogleTokenProvider;
var GoogleTokenProvider = require('refresh-token').GoogleTokenProvider;

var googleDrive = require('google-drive');
var request = require('request');
var OAuth2 = googleapis.auth.OAuth2;

var CLIENT_ID = process.env.CLIENT_ID,
    CLIENT_SECRET = process.env.CLIENT_SECRET,
    REDIRECT_URL = process.env.REDIRECT_URI,
    SCOPE = 'https://www.googleapis.com/auth/drive';

var auth = new OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URL);


var getToken = function (refresh, callback) {
    var tokenProvider = new GoogleTokenProvider({
        refresh_token: refresh,
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET
    });
    tokenProvider.getToken(function (error, token) {
        if (error) console.log(error);
        else callback(token);
    });

};

exports.getAuthUrl = function () {
    console.log("request for auth url");
    return auth.generateAuthUrl({
        access_type: 'offline', // will return a refresh token
        approval_prompt: 'force',
        scope: SCOPE // can be a space-delimited string or an array of scopes
    });
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
        var token = JSON.parse(body);
        console.log(token);
        if (token.error) console.log(token.error);
        callback(token);
    });
};

exports.getListOfFolders = function (refresh, callback) {
    getToken(refresh, function (token) {
        listFilesFromDrive("mimeType = 'application/vnd.google-apps.folder'", token, callback);
    })
};

exports.getListOfImages = function (refresh, folderId, callback) {
    getToken(refresh, function (token) {
        listFilesFromDrive("'" + folderId + "' in parents and mimeType contains 'image/'", token, callback);
    });
};

exports.getMetadata = function (refresh, id, callback) {
    getToken(refresh, function (token) {
        googleDrive(token).files(id).get({}, function (err, res, body) {
            if (err) throw err;
            callback(JSON.parse(body));
        });
    });
};


function listFilesFromDrive(query, token, callback) {
    function driveFilesHandler(err, response, body) {
        var b = JSON.parse(body);
        if (b.error) console.log(b.error.message);
        callback(b.items);
    }

    googleDrive(token)
        .files()
        .list({q: query, maxResults: 1000}, driveFilesHandler);
}



