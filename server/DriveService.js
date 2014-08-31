var drive = require(global.rootPath('server/api/GoogleDriveAccess'));

exports.printList = function (req, res) {
    drive.getListOfFolders(req.cookies.token, function (folders) {
        res.json(folders);
    });
};

exports.getInfo = function (req, res) {
    drive.getMetadata(req.cookies.token, req.query.id, function (info) {
        res.json(info);
    });
};

exports.getAuthUrl = function (req, res) {
    res.json({url: drive.getAuthUrl()});
};

exports.setCode = function (req, res) {
    var params = req.query;
    drive.setCode(params.code, function (token) {
        res.cookie('token', token);
        res.sendFile(global.rootPath("./application/pages/application.html"));
    });

};
exports.findPhotos = function (req, res) {
    drive.getListOfImages(req.cookies.token, req.query.folderId, function (photos) {
        res.json(photos);
    });
};


//res.status(status).end()