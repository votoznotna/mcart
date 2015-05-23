/**
 * Created by User on 5/21/2015.
 */

(function (module) {
    "use strict";

    module.controller('BaseCtrl',
    [ '$scope', '$location', 'messaging', 'events', 'deviceDetector',
        function ($scope, $location, messaging, events, deviceDetector) {
            //#region login methods
            $scope.oddPlayerBrowser = function () {
                return deviceDetector.raw.browser.ie || deviceDetector.raw.browser.firefox;
            }
        }
    ]);


}(angular.module("shoppingCart")));
