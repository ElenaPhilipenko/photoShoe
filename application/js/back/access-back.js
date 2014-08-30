angular.module("access-back", ["ngResource"])
    .factory('DriveFiles', function ($resource) {
        return $resource('api/:path', {}, {
            getFolders: {method: 'GET', isArray: true, params: {path: 'list'}},
            getPhotos: {method: 'GET', isArray: true, params: {path: 'photos'}},
            getInfo: {method: 'GET', isArray: false, params: {path: 'info'}}
        });
    })
    .factory('GoogleAccess', function ($resource) {
        return $resource('api/:path', {}, {
            'getAccessUrl': {method: 'GET', isArray: false, params: {path: 'url'}},
            'isAuthorize': {method: 'GET', isArray: false, params: {path: 'auth'}}
        });
    });
