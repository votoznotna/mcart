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

        ngCart.setShipping(10.99);
        ngCart.setTaxRate(13);

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

    }
}(angular.module("shoppingCart")));