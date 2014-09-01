angular.module('listener-front', ['presentation-back'])

    .controller('listenerController', ['$scope', '$sce', '$routeParams', 'Presentation',
        function ($scope, $sce, $routeParams, Presentation) {
            setInterval(function () {
                Presentation.getCurrentPhoto({presentationId: $routeParams.presentationId}, function (photo) {
                    $scope.showPhotoUrl = $sce.trustAsResourceUrl(photo.currentUrl);
                })
            }, 1000);

        }]);



