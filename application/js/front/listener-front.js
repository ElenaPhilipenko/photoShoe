angular.module('listener-front', ['presentation-back'])

    .controller('listenerController', ['$scope', '$sce', '$routeParams', 'Presentation',
        function ($scope, $sce, $routeParams, Presentation) {
            setInterval(function () {
                Presentation.getCurrentPhoto({presentationId: $routeParams.presentationId}, function (photo) {
                    $scope.showPhotoUrl = $sce.trustAsResourceUrl(photo.currentUrl);
                })
            }, 1000);

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
    }]);


