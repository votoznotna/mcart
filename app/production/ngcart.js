(function(module) {
try {
  module = angular.module('ngcart.templates');
} catch (e) {
  module = angular.module('ngcart.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/ngCart/addtocart.html',
    '<div ng-hide="attrs.id"><a class="btn btn-lg btn-primary" ng-disabled="true" ng-transclude=""></a></div><div ng-show="attrs.id"><div><span style="display:inline-block; white-space:nowrap; margin-bottom: 15px"><span class="glyphicon thumbGlyphiconSize glyphicon-minus" ng-class="{\'blue-disabled\': !ngCart.getItemById(id),\'default-cursor\': !ngCart.getItemById(id), \'hand-cursor\': ngCart.getItemById(id)}" ng-click="ngCart.getItemById(id) ? (ngCart.getItemById(id).getQuantity()==1 ? ngCart.removeItemById(id) : ngCart.getItemById(id).setQuantity(-1, true)) : angular.noop"></span> <a ui-sref="cart" style="margin: 0 2px 0 6px"><span class="glyphicon thumbGlyphiconSize glyphicon-shopping-cart"></span></a> <span class="thumbGlyphiconSize" style="padding:0 0 1px 0;margin: 0 3px">{{(ngCart.getItemById(id).getQuantity() || 0) | number }}</span></span> <span style="margin: 0 3px" class="thumbBtnSize btn btn-sm btn-primary" ng-click="ngCart.getItemById(id) ? ngCart.getItemById(id).setQuantity(1, true) : ngCart.addItem(id, name, price, 1, data)" ng-transclude=""></span></div></div>');
}]);
})();

'use strict';


angular.module('ngCart', ['ngCart.directives'])

    .config([function () {

    }])

    .provider('$ngCart', function () {
        this.$get = function () {
        };
    })

    .run(['$rootScope', 'ngCart','ngCartItem', 'store', function ($rootScope, ngCart, ngCartItem, store) {

        $rootScope.$on('ngCart:change', function(){
            ngCart.$save();
        });

        if (angular.isObject(store.get('cart'))) {
            ngCart.$restore(store.get('cart'));

        } else {
            ngCart.init();
        }

    }])

    .service('ngCart', ['$rootScope', 'ngCartItem', 'store', function ($rootScope, ngCartItem, store) {

        this.init = function(){
            this.$cart = {
                shipping : null,
                taxRate : null,
                tax : null,
                items : []
            };
        };

        this.addItem = function (id, name, price, quantity, data) {

            var inCart = this.getItemById(id);

            if (typeof inCart === 'object'){
                //Update quantity of an item if it's already in the cart
                inCart.setQuantity(quantity, false);
            } else {
                var newItem = new ngCartItem(id, name, price, quantity, data);
                this.$cart.items.push(newItem);
                $rootScope.$broadcast('ngCart:itemAdded', newItem);
            }

            $rootScope.$broadcast('ngCart:change', {});
        };

        this.getItemById = function (itemId) {
            var items = this.getCart().items;
            var build = false;

            angular.forEach(items, function (item) {
                if  (item.getId() === itemId) {
                    build = item;
                }
            });
            return build;
        };

        this.setShipping = function(shipping){
            this.$cart.shipping = shipping;
            return this.getShipping();
        };

        this.getShipping = function(){
            if (this.getCart().items.length == 0) return 0;
            return  this.getCart().shipping;
        };

        this.setTaxRate = function(taxRate){
            this.$cart.taxRate = +parseFloat(taxRate).toFixed(2);
            return this.getTaxRate();
        };

        this.getTaxRate = function(){
            return this.$cart.taxRate
        };

        this.getTax = function(){
            return +parseFloat(((this.getSubTotal()/100) * this.getCart().taxRate )).toFixed(2);
        };

        this.setCart = function (cart) {
            this.$cart = cart;
            return this.getCart();
        };

        this.getCart = function(){
            return this.$cart;
        };

        this.getItems = function(){
            return this.getCart().items;
        };

        this.getTotalItems = function () {
            var count = 0;
            var items = this.getItems();
            angular.forEach(items, function (item) {
                count += item.getQuantity();
            });
            return count;
        };

        this.getTotalUniqueItems = function () {
            return this.getCart().items.length;
        };

        this.getSubTotal = function(){
            var total = 0;
            angular.forEach(this.getCart().items, function (item) {
                total += item.getTotal();
            });
            return +parseFloat(total).toFixed(2);
        };

        this.totalCost = function () {
            return +parseFloat(this.getSubTotal() + this.getShipping() + this.getTax()).toFixed(2);
        };

        this.removeItem = function (index) {
            this.$cart.items.splice(index, 1);
            $rootScope.$broadcast('ngCart:itemRemoved', {});
            $rootScope.$broadcast('ngCart:change', {});

        };

        this.removeItemById = function (id) {
            var cart = this.getCart();
            angular.forEach(cart.items, function (item, index) {
                if  (item.getId() === id) {
                    cart.items.splice(index, 1);
                }
            });
            this.setCart(cart);
            $rootScope.$broadcast('ngCart:itemRemoved', {});
            $rootScope.$broadcast('ngCart:change', {});
        };

        this.empty = function () {
            
            $rootScope.$broadcast('ngCart:change', {});
            this.$cart.items = [];
            localStorage.removeItem('cart');
        };

        this.toObject = function() {

            if (this.getItems().length === 0) return false;

            var items = [];
            angular.forEach(this.getItems(), function(item){
                items.push (item.toObject());
            });

            return {
                shipping: this.getShipping(),
                tax: this.getTax(),
                taxRate: this.getTaxRate(),
                subTotal: this.getSubTotal(),
                totalCost: this.totalCost(),
                items:items
            }
        };


        this.$restore = function(storedCart){
            var _self = this;
            _self.init();
            _self.$cart.shipping = storedCart.shipping;
            _self.$cart.tax = storedCart.tax;

            angular.forEach(storedCart.items, function (item) {
                _self.$cart.items.push(new ngCartItem(item._id,  item._name, item._price, item._quantity, item._data));
            });
            this.$save();
        };

        this.$save = function () {
            return store.set('cart', JSON.stringify(this.getCart()));
        }

    }])

    .factory('ngCartItem', ['$rootScope', '$log', function ($rootScope, $log) {

        var item = function (id, name, price, quantity, data) {
            this.setId(id);
            this.setName(name);
            this.setPrice(price);
            this.setQuantity(quantity);
            this.setData(data);
        };


        item.prototype.setId = function(id){
            if (id)  this._id = id;
            else {
                $log.error('An ID must be provided');
            }
        };

        item.prototype.getId = function(){
            return this._id;
        };


        item.prototype.setName = function(name){
            if (name)  this._name = name;
            else {
                $log.error('A name must be provided');
            }
        };
        item.prototype.getName = function(){
            return this._name;
        };

        item.prototype.setPrice = function(price){
            var priceFloat = parseFloat(price);
            if (priceFloat) {
                if (priceFloat <= 0) {
                    $log.error('A price must be over 0');
                } else {
                    this._price = (priceFloat);
                }
            } else {
                $log.error('A price must be provided');
            }
        };
        item.prototype.getPrice = function(){
            return this._price;
        };


        item.prototype.setQuantity = function(quantity, relative){


            var quantityInt = parseInt(quantity);
            if (quantityInt % 1 === 0){
                if (relative === true){
                    this._quantity  += quantityInt;
                } else {
                    this._quantity = quantityInt;
                }
                if (this._quantity < 1) this._quantity = 1;

            } else {
                this._quantity = 1;
                $log.info('Quantity must be an integer and was defaulted to 1');
            }
            $rootScope.$broadcast('ngCart:change', {});

        };

        item.prototype.getQuantity = function(){
            return this._quantity;
        };

        item.prototype.setData = function(data){
            if (data) this._data = data;
        };

        item.prototype.getData = function(){
            if (this._data) return this._data;
            else $log.info('This item has no data');
        };


        item.prototype.getTotal = function(){
            return +parseFloat(this.getQuantity() * this.getPrice()).toFixed(2);
        };

        item.prototype.toObject = function() {
            return {
                id: this.getId(),
                name: this.getName(),
                price: this.getPrice(),
                quantity: this.getQuantity(),
                data: this.getData(),
                total: this.getTotal()
            }
        };

        return item;

    }])

    .service('store', ['$window', function ($window) {

        return {

            get: function (key) {
                if ($window.localStorage [key]) {
                    var cart = angular.fromJson($window.localStorage [key]);
                    return JSON.parse(cart);
                }
                return false;

            },


            set: function (key, val) {

                if (val === undefined) {
                    $window.localStorage .removeItem(key);
                } else {
                    $window.localStorage [key] = angular.toJson(val);
                }
                return $window.localStorage [key];
            }
        }
    }])

    .controller('CartController',['$scope', 'ngCart', function($scope, ngCart) {
        $scope.ngCart = ngCart;

    }])

    .value('version', '0.0.3-rc.1');
;'use strict';


angular.module('ngCart.directives', ['ngCart.fulfilment'])

    .controller('CartController',['$scope', 'ngCart', function($scope, ngCart) {
        $scope.ngCart = ngCart;
    }])

    .directive('ngcartAddtocart', ['ngCart', function(ngCart){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {
                id:'@',
                name:'@',
                quantity:'@',
                quantityMax:'@',
                price:'@',
                data:'='
            },
            transclude: true,
            templateUrl: 'template/ngCart/addtocart.html',
            link:function(scope, element, attrs){
                scope.attrs = attrs;
                scope.inCart = function(){
                    return  ngCart.getItemById(attrs.id);
                };

                if (scope.inCart()){
                    scope.q = ngCart.getItemById(attrs.id).getQuantity();
                } else {
                    scope.q = parseInt(scope.quantity);
                }

                scope.qtyOpt =  [];
                for (var i = 1; i <= scope.quantityMax; i++) {
                    scope.qtyOpt.push(i);
                }

            }

        };
    }])

    .directive('ngcartCart', [function(){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {},
            templateUrl: 'template/ngCart/cart.html',
            link:function(scope, element, attrs){

            }
        };
    }])

    .directive('ngcartSummary', [function(){
        return {
            restrict : 'E',
            controller : 'CartController',
            scope: {},
            transclude: true,
            templateUrl: 'template/ngCart/summary.html'
        };
    }])

    .directive('ngcartCheckout', [function(){
        return {
            restrict : 'E',
            controller : ('CartController', ['$scope', 'ngCart', 'fulfilmentProvider', function($scope, ngCart, fulfilmentProvider) {
                $scope.ngCart = ngCart;

                $scope.checkout = function () {
                    fulfilmentProvider.setService($scope.service);
                    fulfilmentProvider.setSettings($scope.settings);
                    var promise = fulfilmentProvider.checkout();
                    console.log(promise);
                }
            }]),
            scope: {
                service:'@',
                settings:'='
            },
            transclude: true,
            templateUrl: 'template/ngCart/checkout.html'
        };
    }]);;
angular.module('ngCart.fulfilment', [])
    .service('fulfilmentProvider', ['$injector', function($injector){

        this._obj = {
            service : undefined,
            settings : undefined
        };

        this.setService = function(service){
            this._obj.service = service;
        };

        this.setSettings = function(settings){
            this._obj.settings = settings;
        };

        this.checkout = function(){
            var provider = $injector.get('ngCart.fulfilment.' + this._obj.service);
              return provider.checkout(this._obj.settings);

        }

    }])


.service('ngCart.fulfilment.log', ['$q', '$log', 'ngCart', function($q, $log, ngCart){

        this.checkout = function(){

            var deferred = $q.defer();

            $log.info(ngCart.toObject());
            deferred.resolve({
                cart:ngCart.toObject()
            });

            return deferred.promise;

        }

 }])

.service('ngCart.fulfilment.http', ['$http', 'ngCart', function($http, ngCart){

        this.checkout = function(settings){
            return $http.post(settings.url,
                {data:ngCart.toObject()})
        }
 }])


.service('ngCart.fulfilment.paypal', ['$http', 'ngCart', function($http, ngCart){


}]);

(function(module) {
try {
  module = angular.module('ngcart.templates');
} catch (e) {
  module = angular.module('ngcart.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/ngCart/cart.html',
    '<div class="alert alert-warning" role="alert" ng-show="ngCart.getTotalItems() === 0">Your cart is empty</div><div class="table-responsive" ng-show="ngCart.getTotalItems() > 0"><table class="table ngCart cart"><thead><tr><th></th><th></th><th colspan="3"><span class="pull-right">Quantity</span></th><th><span class="pull-right">Amount</span></th><th><span class="pull-right">Total</span></th></tr></thead><tbody><tr ng-repeat="item in ngCart.getCart().items track by $index"><td><span ng-click="ngCart.removeItemById(item.getId())" class="glyphicon glyphicon-remove"></span></td><td class="width100pcnt okbreak">{{ item.getName() }}</td><td><span class="glyphicon glyphicon-minus" ng-class="{\'disabled\':item.getQuantity()==1,\'default-cursor\':item.getQuantity()==1}" ng-click="item.setQuantity(-1, true)"></span></td><td><span class="pull-right">{{ item.getQuantity() | number }}</span></td><td><span class="glyphicon glyphicon-plus" ng-click="item.setQuantity(1, true)" ng-class="{\'hand-cursor\':item.getQuantity()>1}"></span></td><td><span class="pull-right">{{ item.getPrice() | currency}}</span></td><td><span class="pull-right">{{ item.getTotal() | currency }}</span></td></tr></tbody><tfoot><tr ng-show="ngCart.getTax()"><td></td><td></td><td colspan="3"></td><td><span class="pull-right text-nowrap">Tax ({{ ngCart.getTaxRate() }}%):</span></td><td><span class="pull-right">{{ ngCart.getTax() | currency }}</span></td></tr><tr ng-show="ngCart.getShipping()"><td></td><td></td><td colspan="3"></td><td><span class="pull-right">Shipping:</span></td><td><span class="pull-right">{{ ngCart.getShipping() | currency }}</span></td></tr><tr><td></td><td></td><td colspan="3"></td><td><span class="pull-right">Total:</span></td><td><span class="pull-right">{{ ngCart.totalCost() | currency }}</span></td></tr></tfoot></table></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ngcart.templates');
} catch (e) {
  module = angular.module('ngcart.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/ngCart/checkout.html',
    '<div ng-if="service==\'paypal\'"><form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" ng-show="ngCart.getTotalItems()"><input type="hidden" name="cmd" value="_xclick"> <input type="hidden" name="business" value="{{ settings.paypal.business }}"> <input type="hidden" name="lc" value="US"> <input type="hidden" name="item_name" value="{{ settings.paypal.item_name }}"> <input type="hidden" name="item_number" value="{{ settings.paypal.item_number }}"> <input type="hidden" name="amount" value="{{ ngCart.getSubTotal()}}"> <input type="hidden" name="currency_code" value="{{ settings.paypal.currency_code }}"> <input type="hidden" name="button_subtype" value="services"> <input type="hidden" name="no_note" value="0"> <input type="hidden" name="tax_rate" value="{{ ngCart.getTaxRate()}}"> <input type="hidden" name="shipping" value="{{ ngCart.getShipping()}}"> <input type="hidden" name="bn" value="PP-BuyNowBF:btn_buynowCC_LG.gif:NonHostedGuest"> <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!"> <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"></form></div>');
}]);
})();

(function(module) {
try {
  module = angular.module('ngcart.templates');
} catch (e) {
  module = angular.module('ngcart.templates', []);
}
module.run(['$templateCache', function($templateCache) {
  $templateCache.put('template/ngCart/summary.html',
    '<div class="row text-nowrap"><div style="display:inline-block; margin-right:15px"><svg version="1.1" class="icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30px" height="30px" xml:space="preserve"><path d="M27.715,10.48l-2.938,6.312c-0.082,0.264-0.477,0.968-1.318,0.968H11.831 c-0.89,0-1.479-0.638-1.602-0.904l-2.048-6.524C7.629,8.514,8.715,7.933,9.462,7.933c0.748,0,14.915,0,16.805,0 C27.947,7.933,28.17,9.389,27.715,10.48L27.715,10.48z M9.736,9.619c0.01,0.061,0.026,0.137,0.056,0.226l1.742,6.208 c0.026,0.017,0.058,0.028,0.089,0.028h11.629l2.92-6.27c0.025-0.073,0.045-0.137,0.053-0.192H9.736L9.736,9.619z M13.544,25.534 c-0.819,0-1.482-0.662-1.482-1.482s0.663-1.484,1.482-1.484c0.824,0,1.486,0.664,1.486,1.484S14.369,25.534,13.544,25.534 L13.544,25.534z M23.375,25.534c-0.82,0-1.482-0.662-1.482-1.482s0.662-1.484,1.482-1.484c0.822,0,1.486,0.664,1.486,1.484 S24.197,25.534,23.375,25.534L23.375,25.534z M24.576,21.575H13.965c-2.274,0-3.179-2.151-3.219-2.244 c-0.012-0.024-0.021-0.053-0.028-0.076c0,0-3.56-12.118-3.834-13.05c-0.26-0.881-0.477-1.007-1.146-1.007H2.9 c-0.455,0-0.82-0.364-0.82-0.818s0.365-0.82,0.82-0.82h2.841c1.827,0,2.4,1.103,2.715,2.181 c0.264,0.898,3.569,12.146,3.821,12.999c0.087,0.188,0.611,1.197,1.688,1.197h10.611c0.451,0,0.818,0.368,0.818,0.818 C25.395,21.21,25.027,21.575,24.576,21.575L24.576,21.575z"></path></svg></div><div style="display:inline-block;">{{ ngCart.getTotalItems() }}&nbsp;<ng-pluralize count="ngCart.getTotalItems()" when="{1: \'item\', \'other\':\'items\'}"></ng-pluralize><br>{{ ngCart.totalCost() | currency }}</div></div>');
}]);
})();
