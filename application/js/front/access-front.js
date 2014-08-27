angular.module('access-front', ['ngCookies', 'access-back'])
    .controller('folderController', ['$scope', '$window', '$location', 'DriveFiles', 'AuthService',
        function ($scope, $window, $location, DriveFiles, AuthService) {
            $scope.permission = false;
            AuthService.authIfNot(function () {
                DriveFiles.getFolders(function (folders) {
                    $scope.folders = folders;
                });
            });
            $scope.openFolder = function (id) {
                $window.location.href = "http://" + $location.host() + ":" + $location.port() + "#/folder/" + id;
            };
        }
    ])

    .controller('photoController', ['$scope', '$routeParams', 'DriveFiles', 'AuthService',
        function ($scope, $routeParams, DriveFiles, AuthService) {
            AuthService.authIfNot(function () {
                DriveFiles.getPhotos({folderId: $routeParams.folderId}, function (result) {
                    angular.forEach(result, function (value, key) {
                        parseAndSetDate(value);
                    });
                    $scope.photos = result;
                });
            });
        }])

    .factory('AuthService', [ 'GoogleAccess', '$cookies', '$window', '$location',
        function (GoogleAccess, $cookies, $window, $location) {
            return {
                authIfNot: function (callback) {
                    GoogleAccess.isAuthorize(function (result) {
                        if (!result.auth) {
                            $cookies.beforeUrl = $location.url();
                            console.log($cookies.beforeUrl + " was ser");
                            GoogleAccess.getAccessUrl(function (data) {
                                if (data.url.length > 0) {
                                    $window.location.href = data.url;
                                }
                            });
                        } else {
                            if ($cookies.beforeUrl && $cookies.beforeUrl.length > 0) {
                                console.log($cookies.beforeUrl + " will be set");
                                $location.url($cookies.beforeUrl);
                                $cookies.beforeUrl = "";
                            }
                            callback();
                        }
                    });
                }
            }
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
