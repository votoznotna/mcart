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

