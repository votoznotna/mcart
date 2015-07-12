!function(module){try{module=angular.module("ngcart.templates")}catch(e){module=angular.module("ngcart.templates",[])}module.run(["$templateCache",function($templateCache){$templateCache.put("template/ngCart/addtocart.html",'<div ng-hide="attrs.id"><a class="btn btn-lg btn-primary" ng-disabled="true" ng-transclude=""></a></div><div ng-show="attrs.id"><div><span style="display:inline-block; white-space:nowrap; margin-bottom: 15px"><span class="glyphicon thumbGlyphiconSize glyphicon-minus" ng-class="{\'blue-disabled\': !ngCart.getItemById(id),\'default-cursor\': !ngCart.getItemById(id), \'hand-cursor\': ngCart.getItemById(id)}" ng-click="ngCart.getItemById(id) ? (ngCart.getItemById(id).getQuantity()==1 ? ngCart.removeItemById(id) : ngCart.getItemById(id).setQuantity(-1, true)) : angular.noop"></span> <a ui-sref="cart" style="margin: 0 2px 0 6px"><span class="glyphicon thumbGlyphiconSize glyphicon-shopping-cart"></span></a> <span class="thumbGlyphiconSize" style="padding:0 0 1px 0;margin: 0 3px">{{(ngCart.getItemById(id).getQuantity() || 0) | number }}</span></span> <span style="margin: 0 3px" class="thumbBtnSize btn btn-sm btn-primary" ng-click="ngCart.getItemById(id) ? ngCart.getItemById(id).setQuantity(1, true) : ngCart.addItem(id, name, price, 1, data)" ng-transclude=""></span></div></div>')}])}(),angular.module("ngCart",["ngCart.directives"]).config([function(){}]).provider("$ngCart",function(){this.$get=function(){}}).run(["$rootScope","ngCart","ngCartItem","store",function($rootScope,ngCart,ngCartItem,store){$rootScope.$on("ngCart:change",function(){ngCart.$save()}),angular.isObject(store.get("cart"))?ngCart.$restore(store.get("cart")):ngCart.init()}]).service("ngCart",["$rootScope","ngCartItem","store",function($rootScope,ngCartItem,store){this.init=function(){this.$cart={shipping:null,taxRate:null,tax:null,items:[]}},this.addItem=function(id,name,price,quantity,data){var inCart=this.getItemById(id);if("object"==typeof inCart)inCart.setQuantity(quantity,!1);else{var newItem=new ngCartItem(id,name,price,quantity,data);this.$cart.items.push(newItem),$rootScope.$broadcast("ngCart:itemAdded",newItem)}$rootScope.$broadcast("ngCart:change",{})},this.getItemById=function(itemId){var items=this.getCart().items,build=!1;return angular.forEach(items,function(item){item.getId()===itemId&&(build=item)}),build},this.setShipping=function(shipping){return this.$cart.shipping=shipping,this.getShipping()},this.getShipping=function(){return 0==this.getCart().items.length?0:this.getCart().shipping},this.setTaxRate=function(taxRate){return this.$cart.taxRate=+parseFloat(taxRate).toFixed(2),this.getTaxRate()},this.getTaxRate=function(){return this.$cart.taxRate},this.getTax=function(){return+parseFloat(this.getSubTotal()/100*this.getCart().taxRate).toFixed(2)},this.setCart=function(cart){return this.$cart=cart,this.getCart()},this.getCart=function(){return this.$cart},this.getItems=function(){return this.getCart().items},this.getTotalItems=function(){var count=0,items=this.getItems();return angular.forEach(items,function(item){count+=item.getQuantity()}),count},this.getTotalUniqueItems=function(){return this.getCart().items.length},this.getSubTotal=function(){var total=0;return angular.forEach(this.getCart().items,function(item){total+=item.getTotal()}),+parseFloat(total).toFixed(2)},this.totalCost=function(){return+parseFloat(this.getSubTotal()+this.getShipping()+this.getTax()).toFixed(2)},this.removeItem=function(index){this.$cart.items.splice(index,1),$rootScope.$broadcast("ngCart:itemRemoved",{}),$rootScope.$broadcast("ngCart:change",{})},this.removeItemById=function(id){var cart=this.getCart();angular.forEach(cart.items,function(item,index){item.getId()===id&&cart.items.splice(index,1)}),this.setCart(cart),$rootScope.$broadcast("ngCart:itemRemoved",{}),$rootScope.$broadcast("ngCart:change",{})},this.empty=function(){$rootScope.$broadcast("ngCart:change",{}),this.$cart.items=[],localStorage.removeItem("cart")},this.toObject=function(){if(0===this.getItems().length)return!1;var items=[];return angular.forEach(this.getItems(),function(item){items.push(item.toObject())}),{shipping:this.getShipping(),tax:this.getTax(),taxRate:this.getTaxRate(),subTotal:this.getSubTotal(),totalCost:this.totalCost(),items:items}},this.$restore=function(storedCart){var _self=this;_self.init(),_self.$cart.shipping=storedCart.shipping,_self.$cart.tax=storedCart.tax,angular.forEach(storedCart.items,function(item){_self.$cart.items.push(new ngCartItem(item._id,item._name,item._price,item._quantity,item._data))}),this.$save()},this.$save=function(){return store.set("cart",JSON.stringify(this.getCart()))}}]).factory("ngCartItem",["$rootScope","$log",function($rootScope,$log){var item=function(id,name,price,quantity,data){this.setId(id),this.setName(name),this.setPrice(price),this.setQuantity(quantity),this.setData(data)};return item.prototype.setId=function(id){id?this._id=id:$log.error("An ID must be provided")},item.prototype.getId=function(){return this._id},item.prototype.setName=function(name){name?this._name=name:$log.error("A name must be provided")},item.prototype.getName=function(){return this._name},item.prototype.setPrice=function(price){var priceFloat=parseFloat(price);priceFloat?0>=priceFloat?$log.error("A price must be over 0"):this._price=priceFloat:$log.error("A price must be provided")},item.prototype.getPrice=function(){return this._price},item.prototype.setQuantity=function(quantity,relative){var quantityInt=parseInt(quantity);quantityInt%1===0?(relative===!0?this._quantity+=quantityInt:this._quantity=quantityInt,this._quantity<1&&(this._quantity=1)):(this._quantity=1,$log.info("Quantity must be an integer and was defaulted to 1")),$rootScope.$broadcast("ngCart:change",{})},item.prototype.getQuantity=function(){return this._quantity},item.prototype.setData=function(data){data&&(this._data=data)},item.prototype.getData=function(){return this._data?this._data:void $log.info("This item has no data")},item.prototype.getTotal=function(){return+parseFloat(this.getQuantity()*this.getPrice()).toFixed(2)},item.prototype.toObject=function(){return{id:this.getId(),name:this.getName(),price:this.getPrice(),quantity:this.getQuantity(),data:this.getData(),total:this.getTotal()}},item}]).service("store",["$window",function($window){return{get:function(key){if($window.localStorage[key]){var cart=angular.fromJson($window.localStorage[key]);return JSON.parse(cart)}return!1},set:function(key,val){return void 0===val?$window.localStorage.removeItem(key):$window.localStorage[key]=angular.toJson(val),$window.localStorage[key]}}}]).controller("CartController",["$scope","ngCart",function($scope,ngCart){$scope.ngCart=ngCart}]).value("version","0.0.3-rc.1"),angular.module("ngCart.directives",["ngCart.fulfilment"]).controller("CartController",["$scope","ngCart",function($scope,ngCart){$scope.ngCart=ngCart}]).directive("ngcartAddtocart",["ngCart",function(ngCart){return{restrict:"E",controller:"CartController",scope:{id:"@",name:"@",quantity:"@",quantityMax:"@",price:"@",data:"="},transclude:!0,templateUrl:"template/ngCart/addtocart.html",link:function(scope,element,attrs){scope.attrs=attrs,scope.inCart=function(){return ngCart.getItemById(attrs.id)},scope.q=scope.inCart()?ngCart.getItemById(attrs.id).getQuantity():parseInt(scope.quantity),scope.qtyOpt=[];for(var i=1;i<=scope.quantityMax;i++)scope.qtyOpt.push(i)}}}]).directive("ngcartCart",[function(){return{restrict:"E",controller:"CartController",scope:{},templateUrl:"template/ngCart/cart.html",link:function(){}}}]).directive("ngcartSummary",[function(){return{restrict:"E",controller:"CartController",scope:{},transclude:!0,templateUrl:"template/ngCart/summary.html"}}]).directive("ngcartCheckout",[function(){return{restrict:"E",controller:["$scope","ngCart","fulfilmentProvider",function($scope,ngCart,fulfilmentProvider){$scope.ngCart=ngCart,$scope.checkout=function(){fulfilmentProvider.setService($scope.service),fulfilmentProvider.setSettings($scope.settings);var promise=fulfilmentProvider.checkout();console.log(promise)}}],scope:{service:"@",settings:"="},transclude:!0,templateUrl:"template/ngCart/checkout.html"}}]),angular.module("ngCart.fulfilment",[]).service("fulfilmentProvider",["$injector",function($injector){this._obj={service:void 0,settings:void 0},this.setService=function(service){this._obj.service=service},this.setSettings=function(settings){this._obj.settings=settings},this.checkout=function(){var provider=$injector.get("ngCart.fulfilment."+this._obj.service);return provider.checkout(this._obj.settings)}}]).service("ngCart.fulfilment.log",["$q","$log","ngCart",function($q,$log,ngCart){this.checkout=function(){var deferred=$q.defer();return $log.info(ngCart.toObject()),deferred.resolve({cart:ngCart.toObject()}),deferred.promise}}]).service("ngCart.fulfilment.http",["$http","ngCart",function($http,ngCart){this.checkout=function(settings){return $http.post(settings.url,{data:ngCart.toObject()})}}]).service("ngCart.fulfilment.paypal",["$http","ngCart",function(){}]),function(module){try{module=angular.module("ngcart.templates")}catch(e){module=angular.module("ngcart.templates",[])}module.run(["$templateCache",function($templateCache){$templateCache.put("template/ngCart/cart.html",'<div class="alert alert-warning" role="alert" ng-show="ngCart.getTotalItems() === 0">Your cart is empty</div><div class="table-responsive" ng-show="ngCart.getTotalItems() > 0"><table class="table ngCart cart"><thead><tr><th></th><th></th><th colspan="3"><span class="pull-right">Quantity</span></th><th><span class="pull-right">Amount</span></th><th><span class="pull-right">Total</span></th></tr></thead><tbody><tr ng-repeat="item in ngCart.getCart().items track by $index"><td><span ng-click="ngCart.removeItemById(item.getId())" class="glyphicon glyphicon-remove"></span></td><td class="width100pcnt okbreak">{{ item.getName() }}</td><td><span class="glyphicon glyphicon-minus" ng-class="{\'disabled\':item.getQuantity()==1,\'default-cursor\':item.getQuantity()==1}" ng-click="item.setQuantity(-1, true)"></span></td><td><span class="pull-right">{{ item.getQuantity() | number }}</span></td><td><span class="glyphicon glyphicon-plus" ng-click="item.setQuantity(1, true)" ng-class="{\'hand-cursor\':item.getQuantity()>1}"></span></td><td><span class="pull-right">{{ item.getPrice() | currency}}</span></td><td><span class="pull-right">{{ item.getTotal() | currency }}</span></td></tr></tbody><tfoot><tr ng-show="ngCart.getTax()"><td></td><td></td><td colspan="3"></td><td><span class="pull-right text-nowrap">Tax ({{ ngCart.getTaxRate() }}%):</span></td><td><span class="pull-right">{{ ngCart.getTax() | currency }}</span></td></tr><tr ng-show="ngCart.getShipping()"><td></td><td></td><td colspan="3"></td><td><span class="pull-right">Shipping:</span></td><td><span class="pull-right">{{ ngCart.getShipping() | currency }}</span></td></tr><tr><td></td><td></td><td colspan="3"></td><td><span class="pull-right">Total:</span></td><td><span class="pull-right">{{ ngCart.totalCost() | currency }}</span></td></tr></tfoot></table></div>')}])}(),function(module){try{module=angular.module("ngcart.templates")}catch(e){module=angular.module("ngcart.templates",[])}module.run(["$templateCache",function($templateCache){$templateCache.put("template/ngCart/checkout.html",'<div ng-if="service==\'paypal\'"><form action="https://www.paypal.com/cgi-bin/webscr" method="post" target="_top" ng-show="ngCart.getTotalItems()"><input type="hidden" name="cmd" value="_xclick"> <input type="hidden" name="business" value="{{ settings.paypal.business }}"> <input type="hidden" name="lc" value="US"> <input type="hidden" name="item_name" value="{{ settings.paypal.item_name }}"> <input type="hidden" name="item_number" value="{{ settings.paypal.item_number }}"> <input type="hidden" name="amount" value="{{ ngCart.getSubTotal()}}"> <input type="hidden" name="currency_code" value="{{ settings.paypal.currency_code }}"> <input type="hidden" name="button_subtype" value="services"> <input type="hidden" name="no_note" value="0"> <input type="hidden" name="tax_rate" value="{{ ngCart.getTaxRate()}}"> <input type="hidden" name="shipping" value="{{ ngCart.getShipping()}}"> <input type="hidden" name="bn" value="PP-BuyNowBF:btn_buynowCC_LG.gif:NonHostedGuest"> <input type="image" src="https://www.paypalobjects.com/en_US/i/btn/btn_buynowCC_LG.gif" border="0" name="submit" alt="PayPal - The safer, easier way to pay online!"> <img alt="" border="0" src="https://www.paypalobjects.com/en_US/i/scr/pixel.gif" width="1" height="1"></form></div>')}])}(),function(module){try{module=angular.module("ngcart.templates")}catch(e){module=angular.module("ngcart.templates",[])}module.run(["$templateCache",function($templateCache){$templateCache.put("template/ngCart/summary.html",'<div class="row text-nowrap"><div style="display:inline-block; margin-right:15px"><svg version="1.1" class="icon" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="30px" height="30px" xml:space="preserve"><path d="M27.715,10.48l-2.938,6.312c-0.082,0.264-0.477,0.968-1.318,0.968H11.831 c-0.89,0-1.479-0.638-1.602-0.904l-2.048-6.524C7.629,8.514,8.715,7.933,9.462,7.933c0.748,0,14.915,0,16.805,0 C27.947,7.933,28.17,9.389,27.715,10.48L27.715,10.48z M9.736,9.619c0.01,0.061,0.026,0.137,0.056,0.226l1.742,6.208 c0.026,0.017,0.058,0.028,0.089,0.028h11.629l2.92-6.27c0.025-0.073,0.045-0.137,0.053-0.192H9.736L9.736,9.619z M13.544,25.534 c-0.819,0-1.482-0.662-1.482-1.482s0.663-1.484,1.482-1.484c0.824,0,1.486,0.664,1.486,1.484S14.369,25.534,13.544,25.534 L13.544,25.534z M23.375,25.534c-0.82,0-1.482-0.662-1.482-1.482s0.662-1.484,1.482-1.484c0.822,0,1.486,0.664,1.486,1.484 S24.197,25.534,23.375,25.534L23.375,25.534z M24.576,21.575H13.965c-2.274,0-3.179-2.151-3.219-2.244 c-0.012-0.024-0.021-0.053-0.028-0.076c0,0-3.56-12.118-3.834-13.05c-0.26-0.881-0.477-1.007-1.146-1.007H2.9 c-0.455,0-0.82-0.364-0.82-0.818s0.365-0.82,0.82-0.82h2.841c1.827,0,2.4,1.103,2.715,2.181 c0.264,0.898,3.569,12.146,3.821,12.999c0.087,0.188,0.611,1.197,1.688,1.197h10.611c0.451,0,0.818,0.368,0.818,0.818 C25.395,21.21,25.027,21.575,24.576,21.575L24.576,21.575z"></path></svg></div><div style="display:inline-block;">{{ ngCart.getTotalItems() }}&nbsp;<ng-pluralize count="ngCart.getTotalItems()" when="{1: \'item\', \'other\':\'items\'}"></ng-pluralize><br>{{ ngCart.totalCost() | currency }}</div></div>')}])}();
!function(){"use strict";angular.module("shoppingCart",["common.services","ui.router","ui.utils","ngAnimate","ui.bootstrap","ngSanitize","ng.deviceDetector","productResourceMock","ngcart.templates","ngCart"]).run(["$rootScope","$state",function($rootScope,$state){$rootScope.$state=$state}]).constant("descLength",150).config(function($provide){$provide.decorator("$exceptionHandler",["$delegate",function($delegate){return function(exception,cause){exception.message="Please contact the Help Desk! \n Message: "+exception.message,$delegate(exception,cause),alert(exception.message)}}])}).run(["$state","$rootScope","$location","messaging","events",function($state,$rootScope,$location,messaging,events){$rootScope.$on("$stateChangeStart",function(){$rootScope.selectPriceBar=!1,messaging.publish(events.message._SERVER_REQUEST_ENDED_)})}]).filter("html",["$sce",function($sce){return function(text){return $sce.trustAsHtml(text)}}]);angular.element(document).ready(function(){"#_=_"===window.location.hash&&(window.location.hash="#!")})}();
!function(module){"use strict";module.config(["$locationProvider","$stateProvider","$urlRouterProvider",function($locationProvider,$stateProvider,$urlRouterProvider){$locationProvider.hashPrefix("!"),$urlRouterProvider.otherwise("/"),$stateProvider.state("home",{url:"/",templateUrl:"partials/home/home.html",controller:"HomeCtrl"}).state("productList",{url:"/products",templateUrl:"partials/products/productListView.html",controller:"ProductListCtrl"}).state("cart",{url:"/cart",templateUrl:"partials/cart/cartView.html",controller:"CartCtrl"}).state("productDetail",{url:"/product/:productId",templateUrl:"partials/products/productDetailView.html",controller:"ProductDetailCtrl",resolve:{productResource:"productResource",product:function(productResource,$stateParams){var productId=$stateParams.productId;return productResource.getProduct({productId:productId}).$promise}}})}])}(angular.module("shoppingCart"));
!function(module){"use strict";module.filter("priceFilter",function(){return function(items,search){if(!items||0===items.length)return items;if(0===search)return items;for(var filtered=[],i=0;i<items.length;i++){var item=items[i];item.price<search&&filtered.push(item)}return filtered}})}(angular.module("shoppingCart"));
!function(){"use strict";angular.module("common.services",["ngResource"])}();
!function(module){"use strict";module.constant("events",{message:{_ADD_ERROR_MESSAGE_:"_ADD_ERROR_MESSAGE_",_CLEAR_ERROR_MESSAGES_:"_CLEAR_ERROR_MESSAGES_",_ERROR_MESSAGES_UPDATED_:"_ERROR_MESSAGES_UPDATED_",_ADD_USER_MESSAGE_:"_ADD_USER_MESSAGE_",_CLEAR_USER_MESSAGES_:"_CLEAR_USER_MESSAGES_",_USER_MESSAGES_UPDATED_:"_USER_MESSAGES_UPDATED_",_SERVER_REQUEST_STARTED_:"_SERVER_REQUEST_STARTED_",_SERVER_REQUEST_ENDED_:"_SERVER_REQUEST_ENDED_",_LOG_TRACE_:"_LOG_TRACE_",_LOG_DEBUG_:"_LOG_DEBUG_",_LOG_INFO_:"_LOG_INFO_",_LOG_WARNING_:"_LOG_WARNING_",_LOG_ERROR_:"_LOG_ERROR_",_LOG_FATAL_:"_LOG_FATAL_"}})}(angular.module("common.services"));
!function($,window,document){"use strict";var s=document.body||document.documentElement,s=s.style,$list=$(".flexList"),$items=$list.find(".flexListItem"),setHeights=function(){$items.css("height","auto");var perRow=Math.floor($list.width()/$items.width());if(null==perRow||2>perRow)return!0;for(var i=0,j=$items.length;j>i;i+=perRow){var maxHeight=0,$row=$items.slice(i,i+perRow);$row.each(function(){var itemHeight=parseInt($(this).outerHeight());itemHeight>maxHeight&&(maxHeight=itemHeight)}),$row.css("height",maxHeight)}};setHeights(),$(window).on("resize",setHeights),$list.find("img").on("load",setHeights)}(jQuery,window,document);
!function(module){"use strict";module.factory("messaging",function(){var cache={},subscribe=function(topic,callback){return cache[topic]||(cache[topic]=[]),cache[topic].push(callback),[topic,callback]},publish=function(topic,args){cache[topic]&&angular.forEach(cache[topic],function(callback){callback.apply(null,args||[])})},unsubscribe=function(handle){var t=handle[0];if(cache[t])for(var x=0;x<cache[t].length;x++)cache[t][x]===handle[1]&&cache[t].splice(x,1)},service={publish:publish,subscribe:subscribe,unsubscribe:unsubscribe};return service})}(angular.module("common.services"));
!function(){"use strict";function productResource($resource){return $resource("/api/products/:productId",{},{getProduct:{method:"GET",params:{productId:"@id"}},getProducts:{method:"GET",isArray:!0},create:{method:"POST"},update:{method:"PUT",params:{productId:"@id"}},remove:{method:"DELETE"},deleteProject:{method:"DELETE",params:{productId:"@id"}}})}angular.module("common.services").factory("productResource",["$resource",productResource])}();
!function(){"use strict";var app=angular.module("productResourceMock",["ngMockE2E"]);app.run(function($httpBackend){var products=[{id:1,code:"CHW-12",image:"755039_fpx.jpg",name:"Cuisinart CHW-12 Coffee Maker, 12 Cup Programmable with Hot Water System",description:"Quick, easy and wonderfully satisfying. Cuisinart's 12-cup programmable coffee maker features a hot water system for enjoying everything from coffee to tea plus oatmeal, instant soups and more! Exclusive Brew Pause™ feature allows you to enjoy a cup of coffee before the cycle is finished. Fully automatic with a 24-hour programming feature, self-clean function and auto shutoff to make your mornings a breeze. Three-year limited warranty. Model CHW-12.",origPrice:139.99,price:99.99},{id:2,code:"BTM800XL",image:"755045_fpx.jpg",name:"Breville BTM800XL Tea Maker, One Touch Electric",description:"Make tea time extra special with Breville's One Touch Tea Maker featuring variable steeping times and pre-set programs to ensure a perfect cup of tea every time. Tea basket automatically raises at the correct time to prevent over steeping. 51-oz. glass jug and 60-minute keep-warm setting. Makes a great gift for the avid tea drinker or someone just starting to explore the loose leaf tea world. One-year limited warranty. Model BTM800XL.",origPrice:299.99,price:249.98},{id:3,code:"EN520SL",image:"1009442_fpx.jpg",name:"De'Longhi EN520 Lattissima Plus Single Serve Espresso Maker",description:"A brilliant brew ready in an instant! Simply pick your favorite Nespresso pod, press a button and relax into the incredible flavors of gourmet coffee right at home. An included milk container tops each drink off with a burst of steamed or frothed milk. Model EN520SL.",origPrice:449.99,price:399.99},{id:4,code:"BES840XL",image:"1349665_fpx.jpg",name:"Breville BES840XL Espresso Maker, The Infuser",description:"Behold the best brew – using low pressure to gently expand the grinds before increasing high pressure, this espresso machine promotes a balanced, even extraction of flavor for consistently irresistible results. Electronic temperature control and a 1600-watt thermo-coil stainless steel system packs a punch of precision. 1-year warranty.",origPrice:589.99,price:499.98},{id:5,code:"DCC-3200",image:"2368631_fpx.jpg",name:"Cuisinart DCC-3200 PerfecTemp 14-Cup Programmable Coffee Maker",description:"No more coffee runs. Have the best cup right at home with this fully programmable 14-cup brewer, which features a Brew Strength Control, so you can cater each cup exactly to your preferences. From having a pot ready when you wake up to allowing you to pour a cup mid-brew to offering 1-to-4 cup settings, this coffee maker knows you like to keep your options open. Model DCC-3200.",origPrice:149.99,price:109.99},{id:6,code:"DCC-1200",image:"286341_fpx.jpg",name:"Cuisinart DCC-1200 Coffee Maker, Brew Central 12-Cup",description:"No more coffee runs. Have the best cup right at home with this fully programmable 14-cup brewer, which features a Brew Strength Control, so you can cater each cup exactly to your preferences. From having a pot ready when you wake up to allowing you to pour a cup mid-brew to offering 1-to-4 cup settings, this coffee maker knows you like to keep your options open. Model DCC-3200.",origPrice:129.99,price:89.99},{id:7,code:"DCC500",image:"1741154_fpx.jpg",name:"Cuisinart DCC500 12-Cup Programmable Coffee Maker",description:"Self starter. This coffee maker takes control of your counter with 24-hour programmability that gets your brew started before you've left your bed. Plus, with a convenient Brew Pause™ feature that puts a cup in your hand before the entire pot is ready and 1 to 4 cup settings that make just enough coffee for whoever is in the house, this coffee maker understands the joy of customizing each & every cup.",origPrice:109.99,price:69.99},{id:8,code:"EM-600",image:"2593982_fpx.jpg",name:"Illy by Cuisinart Buona Tazza EM-600 Super Automatic Single Serve Espresso, Caffe Latte, Cappuccino Machine",description:"Get barista-quality beverages without leaving your house. Simply pop in an illy® iperEspresso capsule & press a button for an exceptional espresso or a creamy cappuccino. A removable milk tank serves up steamy & frothy milk in three cup size settings. Model EM-600.",origPrice:729.99,price:599.99},{id:9,code:"CPK-17",image:"746906_fpx.jpg",name:"Cuisinart CPK-17 PerfecTemp 1.7L Electric Kettle",description:"Break free from the stove with a cordless kettle that steeps tea to its optimal temperature for a blend bursting with undiscovered full flavor and maximum healthful benefits. The PerfecTemp cordless kettle features six preset temperatures catered to some of the most popular teas and has a keep warm function that maintains your chosen temperature for 30 minutes so you can enjoy each hot cup. 3-year limited warranty. Model CPK-17.",origPrice:179.99,price:129.99},{id:10,code:"EM-100",image:"278834_fpx.jpg",name:"Cuisinart EM-100 Espresso Maker",description:"Do café your way. This compact, 15-bar espresso and cappuccino maker is the perfect addition to your countertop, letting you enjoy the bold taste of Italy without ever leaving your kitchen. Made to brew one or two cups, the pro-grade die cast and stainless steel housing is handsome and extremely durable. Three-year limited warranty. Model EM-100.",origPrice:229.99,price:179.99},{id:11,code:"DCC-3000",image:"946318_fpx.jpg",name:"Cuisinart DCC-3000 Coffee Maker, Coffee on Demand",description:"Coffee by the cup! This early riser brews 12 cups of coffee cup by cup, so you can grab, go and get your fix quick. Up when you are with 24-hour advance programming, this coffee maker features a dispenser light that lets you know when to pull the lever and get a steaming hot cup of Joe. 3-year limited warranty. Model DCC-3000.",origPrice:249.99,price:179.99},{id:12,code:"DGB-1",image:"2386689_fpx.jpg",name:"Cuisinart DGB-1 Grind & Brew Coffee Maker",description:"Brew the perfect cup of coffee with Cuisinart's coffee maker. Easy-to-use features make your mornings a cinch! Model DGB-1.",origPrice:159.99,price:119.99},{id:13,code:"1536173",image:"2674200_fpx.tif.jpg",name:"Nespresso Inissia Espresso Maker",description:"The pod bunch. Just pop in a capsule & let this compact morning maker do the rest. With a 19-bar high-pressure pump & programmable features, this espresso machine masters everything from machiattos to lungos & beyond, while taking up minimal space on your countertop.",origPrice:189.99,price:129.99},{id:14,code:"Z9",image:"2129725_fpx.tif.jpg",name:"Jura Impressa Z9 One Touch TFT Espresso Maker",description:"The daily grind made perfect. Starting with an Aroma+ grinder, this espresso machine perfectly preps your fresh beans & fully preserves their aroma for a bolder & stronger brew you'll love. Two thermoblocks, 11 specialty settings & Fine Foam Technology guarantee your best blends will be professionally prepared & topped with a feather-fine froth. Model Z9.",origPrice:5139.99,price:3699.99},{id:15,code:"DLX1050B",image:"1572317_fpx.tif.jpg",name:"Black & Decker DLX1050B Coffee Maker, 12 Cup Programmable",description:"A true self starter. Totally programmable & totally a coffee connoisseur, this morning maker steps up to every cup with gourmet brilliance. From automatically choosing the optimal brewing temp to extracting even more flavor from grinds to Quick Touch™ programming for custom cups to the Sneak-A-CupⓇ feature, this coffee maker is not your average joe. Model DLX1050B.",origPrice:39.99,price:29.99},{id:16,code:"R500",image:"1717868_fpx.tif.jpg",name:"KeurigⓇ R500 Rivo Cappuccino and Latte Single Serve Brewer",description:"Café coffee on demand. Enjoy a piping hot brew of your favorite cappuccino, latte or espresso & top it off with frothed milk with just the touch of a button & in just seconds. This gourmet go-to whips up authentic flavors & offers two brewing sizes. Model R500.",origPrice:299.99,price:199.99},{id:17,code:"C60D60US",image:"940420_fpx.tif.jpg",name:"Nespresso C60/D60US Espresso Maker, Pixie Titan",description:"Small size, big flavor! A compact espresso maker that packs as much of a punch as your favorite morning pick-me-up. Heating up in less than 30 seconds, this powerhouse brings knock-out flavor and cafe-convenience into your home. 1-year warranty from date of purchase and registration. Model C60D60US.",origPrice:329.99,price:229.99},{id:18,code:"D111",image:"659581_fpx.tif.jpg",name:"Nespresso C111/D111 Espresso Maker, Citiz Black",description:"Small size, big presence. This gourmet addition is sleek, stylish and sized to fit anywhere from a tight countertop to an elegant living room. Ready to serve up undeniably rich crema, this espresso machine tackles a range of your favorite coffee recipes with 19-bar pump pressure and a thermoblock heating unit. Model D111.",origPrice:359.99,price:249.99}],productUrl="/api/products";$httpBackend.whenGET(productUrl).respond(products);var editingRegex=new RegExp(productUrl+"/[0-9][0-9]*","");$httpBackend.whenGET(editingRegex).respond(function(method,url){var product={productId:0},parameters=url.split("/"),length=parameters.length,id=parameters[length-1];if(id>0)for(var i=0;i<products.length;i++)if(products[i].id==id){product=products[i];break}return[200,product,{}]}),$httpBackend.whenGET(/app/).passThrough(),$httpBackend.whenGET(/template/).passThrough(),$httpBackend.whenGET(/partials/).passThrough()})}();
!function(){"use strict";function productService(){return{}}angular.module("common.services").factory("productService",productService)}();
!function(module){"use strict";module.directive("imageonload",function(){return{restrict:"A",link:function(scope,element,attrs){var imgLoadingIcon=attrs.imageonload,loader=null;imgLoadingIcon&&(loader=angular.element("<img class='center-block' src='"+imgLoadingIcon+"' style='visibility:visible; margin: 50px auto' alt='Processing...'>"),element.after(loader)),element.bind("load",function(){loader.remove(),element.css("display","block")})}}})}(angular.module("common.services"));
!function(module){"use strict";module.directive("waitSpinner",["messaging","events",function(messaging,events){return{restrict:"E",replace:!0,templateUrl:"template/waitSpinner/waitSpinner.html",link:function(scope,element){element.hide();var startRequestHandler=function(){element.show(),angular.element("#main").css("opacity","0.5")},endRequestHandler=function(){element.hide(),angular.element("#main").css("opacity","1.0")};scope.startHandle=messaging.subscribe(events.message._SERVER_REQUEST_STARTED_,startRequestHandler),scope.endHandle=messaging.subscribe(events.message._SERVER_REQUEST_ENDED_,endRequestHandler),scope.$on("$destroy",function(){messaging.unsubscribe(scope.startHandle),messaging.unsubscribe(scope.endHandle)})}}}])}(angular.module("common.services"));
!function(module){"use strict";module.controller("BaseCtrl",["$scope","$location","messaging","events","deviceDetector",function($scope,$location,messaging,events,deviceDetector){$scope.oddPlayerBrowser=function(){return deviceDetector.raw.browser.ie||deviceDetector.raw.browser.firefox}}])}(angular.module("shoppingCart"));
!function(module){"use strict";function CartCtrl($scope,$log,ngCart){$scope.size=ngCart.getTotalItems(),ngCart.setShipping(10.99),ngCart.setTaxRate(13),$scope.$on("ngCart:itemRemoved",function(){$scope.size=ngCart.getTotalItems()}),$scope.httpSettings={url:"/checkout"},$scope.payPalSettings={paypal:{business:"anzotov@griddynamics.com",item_name:"Order",item_number:"item_number",currency_code:"USD"}}}module.controller("CartCtrl",["$scope","$log","ngCart",CartCtrl])}(angular.module("shoppingCart"));
!function(module){"use strict";function HeaderCtrl($rootScope,$scope){var defaultPriceOption={id:0,name:"All prices"},arrowDescClass=(angular.element(document.querySelector("#sortByPrice")),"glyphicon-sort-by-attributes-alt"),arrowAscClass="glyphicon-sort-by-attributes",priceAsc="price",priceDesc="-price";$rootScope.sortByPrice=priceAsc,$scope.sortByPriceIcon=arrowAscClass,$scope.selectedPriceOption=defaultPriceOption,$scope.setPriceOption=function(option){$scope.selectedPriceOption=option},$scope.priceSortAsc=function(){return $rootScope.sortByPrice===priceAsc},$scope.cnangePriceSort=function(){var sortElement=angular.element(document.querySelector("#sortByPrice"));sortElement.removeClass($scope.sortByPriceIcon),$scope.sortByPriceIcon==arrowAscClass?($scope.sortByPriceIcon=arrowDescClass,$rootScope.sortByPrice=priceDesc):($scope.sortByPriceIcon=arrowAscClass,$rootScope.sortByPrice=priceAsc),sortElement.addClass($scope.sortByPriceIcon)},$scope.$watch("selectedPriceOption",function(){$rootScope.extPrice=$scope.selectedPriceOption.id});var priceOptionPre="Less than $";$scope.priceOptions=[defaultPriceOption,{id:100,name:priceOptionPre+"100"},{id:300,name:priceOptionPre+"300"},{id:500,name:priceOptionPre+"500"},{id:1e3,name:priceOptionPre+"1000"}]}module.controller("HeaderCtrl",["$rootScope","$scope","$controller",HeaderCtrl])}(angular.module("shoppingCart"));
!function(module){"use strict";function HomeCtrl($scope,$controller){$controller("BaseCtrl",{$scope:$scope}),$scope.oddClass=$scope.oddPlayerBrowser()?"col-sm-offset-2 col-sm-8 col-md-offset-3 col-md-6  col-lg-offset-4 col-lg-4":""}module.controller("HomeCtrl",["$scope","$controller",HomeCtrl])}(angular.module("shoppingCart"));
!function(module){"use strict";function ProductDetailCtrl($scope,product){$scope.item=product}module.controller("ProductDetailCtrl",["$scope","product","productService",ProductDetailCtrl])}(angular.module("shoppingCart"));
!function(module){"use strict";function ProductListCtrl($rootScope,$scope,$filter,productResource,messaging,events,descLength){$rootScope.selectPriceBar=!0,productResource.getProducts(function(data){$scope.products=angular.forEach(data,function(value){value.description=$scope.descTruncate(value.description)})}),$scope.descTruncate=function(value){return value.length>descLength?value.substring(0,descLength)+"...":value}}module.controller("ProductListCtrl",["$rootScope","$scope","$filter","productResource","messaging","events","descLength","ngCart","$http",ProductListCtrl])}(angular.module("shoppingCart"));