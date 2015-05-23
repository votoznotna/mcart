/**
 * Created by User on 5/17/2015.
 */
(function (module) {
    "use strict";

    module.config(["$locationProvider", "$stateProvider","$urlRouterProvider",
        function ($locationProvider, $stateProvider, $urlRouterProvider) {
            /*                $locationProvider.html5Mode({
             enabled: true,
             requireBase: false
             });*/
            $urlRouterProvider.otherwise('/');

            /*
             $locationProvider.html5Mode({
             enabled: true,
             requireBase: false
             });
             }*/

            $stateProvider
                .state("home", {
                    url: "/",
                    templateUrl: "partials/home/home.html",
                    controller: "HomeCtrl"
                })
                .state("productList", {
                    url: "/products",
                    templateUrl: "partials/products/productListView.html",
                    controller: "ProductListCtrl"
                })
                .state("cart", {
                    url: "/cart",
                    templateUrl: 'partials/cart/cartView.html',
                    controller:"CartCtrl"
                })
                .state("productDetail", {
                    url: "/products/:productId",
                    templateUrl: "partials/products/productDetailView.html",
                    controller: "ProductDetailCtrl",
                    resolve: {
                        productResource: "productResource",

                        product: function (productResource, $stateParams) {
                            var productId = $stateParams.productId;
                            return productResource.getProduct({ productId: productId }).$promise;
                        }
                    }
                })

        }])

}(angular.module("shoppingCart")));
