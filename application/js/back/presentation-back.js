angular.module("presentation-back", ["ngResource"])
    .factory('Presentation', function ($resource) {
        return $resource('api/:path', {}, {
            startPresentation: {method: 'POST', isArray: false, params: {path: 'startPresentation'}},
            getCurrentPhoto: {method: 'GET', isArray: false, params: {path: 'getCurrentPhoto'}},
            setCurrentPhoto: {method: 'POST', isArray: false, params: {path: 'setCurrentPhoto'}},
            endPresentation: {method: 'POST', isArray: false, params: {path: 'endPresentation'}}
        });
    });
