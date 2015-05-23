/**
 * Created by User on 5/1/2015.
 */
(function (module) {
    "use strict";

    module
        .controller("CartCtrl",
        ["$scope", "$log", "ngCart",
            CartCtrl]);

    function CartCtrl($scope, $log, ngCart) {

        $scope.size = ngCart.getTotalItems();

        $scope.$on('ngCart:itemRemoved', function(){
            $scope.size = ngCart.getTotalItems();
        });

        $scope.httpSettings = {
            url:'/checkout'
        };

        $scope.payPalSettings ={ paypal:{
            business:'anzotov@griddynamics.com',
            item_name:'Order',
            item_number:'item_number',
            currency_code:'USD'
        }};

        $scope.showCart = function(){

            $log.info ('---Total Cost:---');
            $log.info (ngCart.totalCost());
            $log.info ('---Items in Cart:---');
            $log.info (ngCart.getItems());

        }

    }
}(angular.module("shoppingCart")));