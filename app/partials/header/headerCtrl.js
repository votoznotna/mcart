/**
 * Created by User on 5/22/2015.
 */
(function (module) {
    "use strict";

    module.controller('HeaderCtrl',
        [ '$rootScope', '$scope', 'messaging', 'events',  HeaderCtrl ]);

    function HeaderCtrl($rootScope, $scope, messaging, events) {

        var defaultPriceOption = {id: 0, name: 'All prices'};

        var sortElement = angular.element(document.querySelector("#sortByPrice"));

        var arrowDescClass = 'glyphicon-sort-by-attributes-alt',  arrowAscClass = 'glyphicon-sort-by-attributes';
        var priceAsc = 'price', priceDesc = '-price';

        $rootScope.sortByPrice = priceAsc;
        $scope.sortByPriceIcon = arrowAscClass;  //arrow down

        $scope.selectedPriceOption = defaultPriceOption;
        $rootScope.extPrice =  defaultPriceOption.id;

        $scope.setPriceOption = function(option) {
            $scope.selectedPriceOption = option;
            $rootScope.extPrice =  option.id;
            $rootScope.$broadcast('priceUpdate');
        };

        $scope.priceSortAsc = function(){
            return $rootScope.sortByPrice === priceAsc;
        }

        $scope.cnangePriceSort = function(){
            var sortElement = angular.element(document.querySelector("#sortByPrice"));
            sortElement.removeClass($scope.sortByPriceIcon);
            if($scope.sortByPriceIcon == arrowAscClass) {
                $scope.sortByPriceIcon = arrowDescClass; //arrow up
                $rootScope.sortByPrice = priceDesc;
            }
            else  {
                $scope.sortByPriceIcon = arrowAscClass;
                $rootScope.sortByPrice = priceAsc;
            }
            sortElement.addClass($scope.sortByPriceIcon);
            $rootScope.$broadcast('sortUpdate');

        };

/*        $scope.$watch('selectedPriceOption', function(newValue, oldValue) {
            $rootScope.extPrice =  $scope.selectedPriceOption.id;
            //$rootScope.$broadcast('price')
            //messaging.publish(events.message._SERVER_REQUEST_STARTED_);
        });*/

        var priceOptionPre = "Less than $";

        $scope.priceOptions = [
            defaultPriceOption,
            {id: 100, name: priceOptionPre + '100'},
            {id: 300, name: priceOptionPre + '300'},
            {id: 500, name: priceOptionPre + '500'},
            {id: 1000, name: priceOptionPre + '1000'}
        ];


    }

}(angular.module("shoppingCart")));