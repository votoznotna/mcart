/**
 * Created by User on 5/22/2015.
 */

(function (module) {
    "use strict";

    module.controller('HeaderCtrl',
        [ '$rootScope', '$scope', '$controller', HeaderCtrl ]);



    function HeaderCtrl($rootScope, $scope, $controller) {

        var defaultPriceOption = {id: 0, name: 'All prices'};

        var sortElement = angular.element(document.querySelector("#sortByPrice"));

        $rootScope.sortByPrice = 'price';

        var arrowDesc = '\u2191',  arrowAsc = '\u2193';
        var arrowDescClass = 'glyphicon-sort-by-attributes-alt',  arrowAscClass = 'glyphicon-sort-by-attributes';
        $scope.sortByPriceIcon = arrowAscClass;  //arrow down

        $scope.selectedPriceOption = defaultPriceOption;

        $scope.setPriceOption = function(option) {
            $scope.selectedPriceOption = option;
        };

        $scope.cnangePriceSort = function(){
            var sortElement = angular.element(document.querySelector("#sortByPrice"));
            sortElement.removeClass($scope.sortByPriceIcon);
            if($scope.sortByPriceIcon == arrowAscClass) {
                $scope.sortByPriceIcon = arrowDescClass; //arrow up
                $rootScope.sortByPrice = '-price';
            }
            else  {
                $scope.sortByPriceIcon = arrowAscClass;
                $rootScope.sortByPrice = 'price';
            }
            sortElement.addClass($scope.sortByPriceIcon);
        };

        $scope.$watch('selectedPriceOption', function(newValue, oldValue) {
            $rootScope.extPrice =  $scope.selectedPriceOption.id
        });

        var priceOptionPre = "Less than $";

        $scope.priceOptions = [
            defaultPriceOption,
            {id: 50, name: priceOptionPre + '50'},
            {id: 100, name: priceOptionPre + '100'},
            {id: 300, name: priceOptionPre + '300'},
            {id: 600, name: priceOptionPre + '600'}
        ];


    }

}(angular.module("shoppingCart")));