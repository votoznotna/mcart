(function (module) {
    "use strict";

    module
    .controller("ProductListCtrl",
    ["$rootScope", "$scope", "$filter", "$safeApply", "$timeout", "productResource", "messaging", "events", "descLength", "ngCart", "$http",
        ProductListCtrl]);

    function ProductListCtrl($rootScope, $scope, $filter, $safeApply, $timeout, productResource, messaging, events, descLength, ngCart, $http) {

        $rootScope.selectPriceBar = true;
        $scope.initProducts = [];

        productResource.getProducts(function(data){

           $scope.products = angular.forEach(data, function(value, key) {
               value.description = $scope.descTruncate(value.description);

            });
            $scope.initProducts = angular.copy($scope.products);
            $scope.filterUpdate();
        });


        $scope.removeProducts = function(){
            $scope.products.splice(0,  $scope.products.length);
        };

        $scope.filterUpdate = function(){
            messaging.publish(events.message._SERVER_REQUEST_STARTED_);
            $scope.toggle = false;
            $scope.removeProducts();
            $scope.$safeApply();
            $scope.$$postDigest(function(){
                $scope.products = $filter('priceFilter')($scope.initProducts,$rootScope.extPrice);
                $scope.products = $filter('orderBy')($scope.products,$rootScope.sortByPrice);
                $scope.$safeApply();
                $scope.$$postDigest(function(){
                    messaging.publish(events.message._SERVER_REQUEST_ENDED_);
                });
            });
        };

        $scope.$on('priceUpdate', function() {
            $scope.filterUpdate();
        });

        $scope.$on('sortUpdate', function() {
            $scope.filterUpdate();
        });

        $scope.descTruncate = function (value) {
            return value.length > descLength ? value.substring(0, descLength) + "..." : value;
        }

        $scope.finishLoopRendering = function(){
            messaging.publish(events.message._SERVER_REQUEST_ENDED_);
        }
    }
}(angular.module("shoppingCart")));
