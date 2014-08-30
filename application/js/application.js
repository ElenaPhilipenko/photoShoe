var shoeApp = angular.module("photo-shoe", [
    "presentator-front",
    "listener-front",
    'ngRoute']);

shoeApp.config(['$routeProvider',
    function ($routeProvider) {
        $routeProvider.
            when('/', {
                templateUrl: 'pages/folders.html',
                controller: 'folderController'
            })
            .when('/folder/:folderId', {
                templateUrl: 'pages/photos.html',
                controller: 'photoController'
            })
            .when('/presentation/:presentationId', {
                templateUrl: 'pages/photosListener.html',
                controller: 'listenerController'
            })
    }]);
