angular.module('access-front', ['access-back'])
    .controller('folderController', ['$scope', '$window', '$location', '$routeParams', 'GoogleAccess', 'DriveFiles',
        function ($scope, $window, $location, $routeParams, GoogleAccess, DriveFiles) {
            $scope.permission = false;
            GoogleAccess.isAuthorize(function (result) {
                if (!result.auth) {
                    GoogleAccess.getAccessUrl(function (data) {
                        $window.location.href = data.url;
                    });
                } else {
                    DriveFiles.getFolders(function (folders) {
                        $scope.folders = folders;
                    });
                }
            });
            $scope.openFolder = function (id) {
                $window.location.href = "http://" + $location.host() + ":" + $location.port() + "#/folder/" + id;
            };
        }
    ])
    .controller('photoController', ['$scope', '$routeParams', 'DriveFiles',
        function ($scope, $routeParams, DriveFiles) {
            DriveFiles.getPhotos({folderId: $routeParams.folderId}, function (result) {
                angular.forEach(result, function (value, key) {
                    parseAndSetDate(value);
                });
                $scope.photos = result;
            });
        }]);


function parseDate(date) {
    var parts = date.split(" ");
    var day = parts[0].split(":");
    var time = parts[1].split(":");

    var result = new Date();
    result.setFullYear(day[0], day[1], day[2]);
    result.setHours(time[0]);
    result.setMinutes(time[1]);
    result.setSeconds(time[2]);
    return result;
}

function parseAndSetDate(value) {
    if (value.imageMediaMetadata && value.imageMediaMetadata.date) {
        value.photoDate = Date.parse(value.imageMediaMetadata.date);
        if (isNaN(value.photoDate)) {
            value.photoDate = parseDate(value.imageMediaMetadata.date);
        }
    }
    if (!value.photoDate || isNaN(value.photoDate)) {
        value.photoDate = Date.parse(value.modifiedDate);
    }
}
