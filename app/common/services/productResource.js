/**
 * Created by User on 5/1/2015.
 */
(function () {
    "use strict";

    angular
        .module("common.services")
        .factory("productResource",
        ["$resource",
            productResource]);

/*    function productResource($resource) {
         return $resource("/api/products/:productId")
    }*/


/*
    return $resource("api/products/:productId", {
        productId: '@_id'
    }, {
        update: {
            method: 'PUT'
        }
    })
    */

        function productResource($resource) {
            return $resource("/api/products/:productId", {}, {
                //return $resource("data/products.json/:productId", {}, {
                getProduct: {method: 'GET', params: {productId: '@id'}},
                getProducts: {method: 'GET', isArray: true},
                create: {method: 'POST'},
                update: {method: 'PUT', params: {productId: '@id'}},
                remove: {method: 'DELETE'},
                deleteProject: {method: 'DELETE', params: {productId: '@id'}}
            })
        }

 }());
