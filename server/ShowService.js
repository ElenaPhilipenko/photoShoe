var presentationData = require(global.rootPath('server/PresentationData'));

exports.startPresentationh = function (req, res) {
    presentationData.startPresentation(req.body.presentationId, req.body.folderId,
        function () {
            res.status(200).send();
        });

};

exports.getCurrentPhoto = function (req, res) {
    presentationData.findCurrentPhoto(req.query.presentationId,
        function (photoUrl) {
            res.json({currentUrl: photoUrl});
        });
};
exports.setCurrentPhoto = function (req, res) {
    presentationData.setCurrentPhoto(req.body.presentationId, req.body.photo,
        function (photoUrl) {
            res.status(200).end();
        });
};


//res.status(status).end()