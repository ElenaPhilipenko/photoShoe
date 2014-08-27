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

    .controller('photoController', ['$scope', '$sce', '$routeParams', 'DriveFiles', 'AuthService',
        function ($scope, $sce, $routeParams, DriveFiles, AuthService) {
            AuthService.authIfNot(function () {
                DriveFiles.getPhotos({folderId: $routeParams.folderId}, function (result) {
                    angular.forEach(result, function (value, key) {
                        parseAndSetDate(value);
                    });
                    result.sort(function (d1, d2) {
                        if (d1.photoDate > d2.photoDate) {
                            return 1;
                        } else {
                            return d1.photoDate == d2.photoDate ? 0 : -1;
                        }
                    });
                    $scope.photos = result;
                });
            });

            $scope.showPhoto = function (photo) {
                jQuery('#presentation').show();
                $scope.photoKey = $scope.photos.indexOf(photo);
                $scope.showPhotoUrl = $sce.trustAsResourceUrl(photo.alternateLink);
            };

            $scope.closePresentation = function () {
                jQuery('#presentation').hide();
            };

            $scope.showNext = function () {
                $scope.photoKey = $scope.photoKey + 1;
                if ($scope.photoKey == $scope.photos.length) $scope.photoKey = 0;
                $scope.showPhotoUrl = $sce.trustAsResourceUrl($scope.photos[$scope.photoKey].alternateLink);
            };

            $scope.showPrevious = function () {
                $scope.photoKey = $scope.photoKey - 1;
                if ($scope.photoKey < 0) $scope.photoKey = $scope.photos.length;
                $scope.showPhotoUrl = $sce.trustAsResourceUrl($scope.photos[$scope.photoKey].alternateLink);
            };
        }])

    .factory('pollingService', ['$http', function ($http) {
        var defaultPollingTime = 10000;
        var polls = {};

        return {
            startPolling: function (name, url, pollingTime, callback) {
                // Check to make sure poller doesn't already exist
                if (!polls[name]) {
                    var poller = function () {
                        $http.get(url).then(callback);
                    };
                    poller();
                    polls[name] = setInterval(poller, pollingTime || defaultPollingTime);
                }
            },

            stopPolling: function (name) {
                clearInterval(polls[name]);
                delete polls[name];
            }
        }
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
};
