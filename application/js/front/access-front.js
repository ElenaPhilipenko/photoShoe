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
                $scope.photos = result;
            });
        }]);
