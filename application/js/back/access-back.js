angular.module("access-back", ["ngResource"])
    .factory('DriveFiles', function ($resource) {
        return $resource('api/list', {}, {
            query: {method: 'GET', isArray: true}
        });
    })
    .factory('GoogleAccess', function ($resource) {
        return $resource('api/:path', {}, {
            'getAccessUrl': {method: 'GET', isArray: false, params: {path: 'url'}},
            'isAuthorize': {method: 'GET', isArray: false, params: {path: 'auth'}}
        });
    });
