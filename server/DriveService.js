var drive = require(global.rootPath('server/api/drive'));

exports.printList = function (req, res) {
    drive.getListOfFolders(function (folders) {
        res.json(folders);
    });
};

exports.getAuthUrl = function (req, res) {
    res.json({url: drive.getAuthUrl()});
};

exports.setCode = function (req, res) {
    var params = req.query;
    drive.setCode(params.code);
    res.sendFile(global.rootPath("./application/pages/index.html"));
};

exports.getAuth = function (req, res) {
    res.json({auth: drive.isAuthorized()});
};
//res.status(status).end()