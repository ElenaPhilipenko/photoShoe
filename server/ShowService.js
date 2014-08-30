var presentationData = require(global.rootPath('server/api/PresentationData'));

exports.startPresentationh = function (req, res) {
    presentationData.startPresentation(req.body.presentationId,
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
exports.endPresentation = function (req, res) {
    presentationData.endPresentation(req.body.presentationId,
        function () {
            res.status(200).send();
        });

};

