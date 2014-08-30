var MongoClient = require('mongodb').MongoClient
    , format = require('util').format;

var usersCollection = 'presentation';

function openConnection(callback) {
    MongoClient.connect('mongodb://127.0.0.1:27017/photoShoe', function (err, db) {
        if (err) throw err;
        callback(db);
    });
}

//
//exports.userWaitForPresentation = function (userEmail, folderIdOfPresentation) {
//    openConnection(function (db) {
//        var users = db.collection(usersCollection);
//        users.insert({email: userEmail, listenFolderId: folderIdOfPresentation}, function (err, res) {
//            if (err) throw err;
//            db.close();
//        });
//    });
//};

exports.startPresentation = function (presentationId, folderIdOfPresentation, callback) {
    openConnection(function (db) {
        var users = db.collection(usersCollection);
        users.insert({presentationId: presentationId}, function (err, res) {
            if (err) throw err;
            db.close();
            callback();
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
            callback(result.photoUrl);
            db.close();
        });
    });
};
