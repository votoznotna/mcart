/**
 * Created by User on 5/22/2015.
 */

(function (module) {
    "use strict";

    module.filter('priceFilter', function () {
         function priceFilter(items, search) {

            if(!items || items.length === 0) return items;
            if(search === 0) return items;

            var filtered = [];

            for (var i = 0; i < items.length; i++) {
                var item = items[i];
                if (item.price < search) {
                    filtered.push(item);
                }
            }

            return filtered;
         };

        priceFilter.$stateful = true;

        return priceFilter;

});

}(angular.module("shoppingCart")));
