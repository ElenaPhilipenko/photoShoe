var shoeApp = angular.module("photo-shoe", [
    "access-front",
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
    }]);
