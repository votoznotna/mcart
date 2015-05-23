/**
 * Created by User on 5/1/2015.
 */
(function (module) {
    "use strict";

    module
    .controller("ProductListCtrl",
    ["$rootScope", "$scope", "$filter", "productResource", "messaging", "events", "descLength", "ngCart", "$http",
        ProductListCtrl]);

    function ProductListCtrl($rootScope, $scope, $filter, productResource, messaging, events, descLength, ngCart, $http) {

        $rootScope.selectPriceBar = true;

        ngCart.setShipping(10.99);
        ngCart.setTaxRate(13);

        //messaging.publish(events.message._SERVER_REQUEST_STARTED_);
        productResource.getProducts(function(data){

           $scope.products = angular.forEach(data, function(value, key) {
               value.description = $scope.descTruncate(value.description);
            });

            //messaging.publish(events.message._SERVER_REQUEST_ENDED_)
        });

/*        $scope.noFilteredItems = function(){

            return $filter('priceFilter')($rootScope.extPrice).length === 0 ? true : false;
        }*/

        $scope.descTruncate = function (value) {
            return value.length > descLength ? value.substring(0, descLength) + "..." : value;
        }


/*        $http({method: 'GET', url: 'data/products.json'})
            .success(function(data, status, headers, config) {
                vm.products = data;
            })
            .error(function(data, status, headers, config) {
                // called asynchronously if an error occurs
                // or server returns response with an error status.
            });*/


/*        productResource.query(function(data) {
            vm.products = data;
        })*/;


    }
}(angular.module("shoppingCart")));
