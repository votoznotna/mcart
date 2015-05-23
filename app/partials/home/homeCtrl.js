/**
 * Created by User on 5/21/2015.
 */
(function (module) {
    "use strict";

    module.controller('HomeCtrl',
        [ '$scope', '$controller', HomeCtrl ]);

     function HomeCtrl($scope, $controller) {

         $controller('BaseCtrl', {$scope: $scope});

         $scope.oddClass = $scope.oddPlayerBrowser() ?
             "col-sm-offset-2 col-sm-8 col-md-offset-3 col-md-6  col-lg-offset-4 col-lg-4" : "";
     }

}(angular.module("shoppingCart")));
