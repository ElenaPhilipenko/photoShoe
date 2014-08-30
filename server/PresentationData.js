var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;
var config = require('conf');

var usersCollection = 'presentation';

function openConnection(callback) {
    MongoClient.connect(config.get('dbUrl'), function (err, db) {
        if (err) throw err;
        callback(db);
    });
}

exports.startPresentation = function (presentationId, callback) {
    openConnection(function (db) {
        var users = db.collection(usersCollection);
        users.insert({presentationId: presentationId}, function (err, res) {
            if (err) throw err;
            db.close();
            callback();
        });

    });
};

exports.setCurrentPhoto = function (presentationId, photoUrl, callback) {
    openConnection(function (db) {
        var users = db.collection(usersCollection);
        users.update({presentationId: presentationId}, {$set: {photoUrl: photoUrl}},
            function (err, res) {
                if (err) throw err;
                db.close();
                callback();
            });

    });
};

exports.findCurrentPhoto = function (presentationId, callback) {
    openConnection(function (db) {
        var users = db.collection(usersCollection);
        users.findOne({presentationId: presentationId}, function (err, result) {
            if (err) throw err;
            if (result) {
                callback(result.photoUrl);
            } else {
                callback("")
            }
            db.close();
        });
    });
};

exports.endPresentation = function (presentationId) {
    openConnection(function (db) {
        var presentations = db.collection(usersCollection);
        presentations.remove({presentationId: presentationId}, function (err, result) {
            if (err) throw err;
            db.close();
        });
    });
};
