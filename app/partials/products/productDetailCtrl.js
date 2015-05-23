/**
 * Created by User on 5/6/2015.
 */
(function (module) {
    "use strict";

    module
    .controller("ProductDetailCtrl",
    ["$scope", "product",
        "productService",
        ProductDetailCtrl]);

    function ProductDetailCtrl($scope, product, productService) {

        $scope.item = product;

    }
}(angular.module("shoppingCart")));

