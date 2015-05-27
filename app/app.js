/**
 * Created by User on 5/1/2015.
 */
(function () {
    "use strict";
    var app = angular.module("shoppingCart",
        ["common.services",
            "ui.router",
            "ui.utils",
            "ngAnimate",
            "ui.bootstrap",
            "ngSanitize",
            "ng.deviceDetector",
            "productResourceMock",
            "ngcart.templates",
            "ngCart"])

    .run (['$rootScope', '$state', function($rootScope, $state){
        $rootScope.$state = $state;
    }])
    .constant('descLength', 150)
    .config(function ($provide) {
        $provide.decorator("$exceptionHandler",
            ["$delegate",
                function ($delegate) {
                    return function (exception, cause) {
                        exception.message = "Please contact the Help Desk! \n Message: " +
                            exception.message;
                        $delegate(exception, cause);
                        alert(exception.message);
                    };
                }]);
    })
    .run(['$state', '$rootScope', '$location', 'messaging', 'events',
            function($state, $rootScope, $location, messaging, events) {
        //Check when routing starts
        $rootScope.$on( '$stateChangeStart', function(e, toState, toParams, fromState, fromParams) {
            $rootScope.selectPriceBar = false;
            messaging.publish(events.message._SERVER_REQUEST_ENDED_);
        });
    }])
    .filter('html', ['$sce', function ($sce) {
        return function (text) {
            return $sce.trustAsHtml(text);
        };
    }])

    angular.element(document).ready(function() {
        //Fixing facebook bug with redirect
        if (window.location.hash === '#_=_') window.location.hash = '#!';

    });

}());
