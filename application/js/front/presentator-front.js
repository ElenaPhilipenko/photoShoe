angular.module('presentator-front', ['ngCookies', 'access-back', 'presentation-back'])
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

    .controller('photoController', ['$scope', '$window', '$location', '$sce', '$routeParams', 'DriveFiles', 'AuthService',
        'Presentation',
        function ($scope, $window, $location, $sce, $routeParams, DriveFiles, AuthService, Presentation) {
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

            $scope.startPresentation = function () {
                $scope.presentationId = guid();
                Presentation.startPresentation({folderId: $routeParams.folderId, presentationId: $scope.presentationId},
                    function (result) {
                        $scope.presentationUri = $location.protocol() + "://" + $location.host() + ":" + $location.port()
                            + "#/presentation/" + $scope.presentationId;
                        var photo = $scope.photos[0];
                        Presentation.setCurrentPhoto({photo: photo.alternateLink, presentationId: $scope.presentationId});
                        $scope.showPhoto(photo);
                        console.log(result);
                    });
            };

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
                Presentation.setCurrentPhoto({photo: $scope.photos[$scope.photoKey].alternateLink, presentationId: $scope.presentationId});
            };

            $scope.showPrevious = function () {
                $scope.photoKey = $scope.photoKey - 1;
                if ($scope.photoKey < 0) $scope.photoKey = $scope.photos.length;
                $scope.showPhotoUrl = $sce.trustAsResourceUrl($scope.photos[$scope.photoKey].alternateLink);
                Presentation.setCurrentPhoto({photo: $scope.photos[$scope.photoKey].alternateLink, presentationId: $scope.presentationId});
            };
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

function guid() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

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
