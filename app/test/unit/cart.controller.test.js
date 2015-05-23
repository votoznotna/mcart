(function() {
    // Exhibitino Controller Spec
    describe('CartCtrl', function() {



        // Initialize global variables
        var CartCtrl,
            scope,
            rootScope,
            $stateParams,
            isolateScope,
            windowMock,
            compile,
            ngCart,
            element,
            $location;

        beforeEach(function() {
            jasmine.addMatchers({
                toEqualData: function(util, customEqualityTesters) {
                    return {
                        compare: function(actual, expected) {
                            return {
                                pass: angular.equals(actual, expected)
                            };
                        }
                    };
                }
            });
        });

        // Then we can start by loading the main application module
        beforeEach(module("shoppingCart"));
        beforeEach(module("templates"));

        //beforeEach(inject(function($urlRouterProvider) { $urlRouterProvider.deferIntercept(); }));

        beforeEach(inject(["$controller", "$rootScope", "$compile", "$location", "$window", "ngCart",
            function($controller,  _$rootScope_, _$compile_, _$location_, _$window_, _ngCart_) {
            // Set a new global scope
            scope = _$rootScope_.$new();
            rootScope =  _$rootScope_;
            windowMock = _$window_;
            compile = _$compile_;
            $location = _$location_;
            ngCart = _ngCart_;

            // Initialize the controller.
            CartCtrl = $controller('CartCtrl', {
                $scope: scope
            });
        }]));


        beforeEach(function() {
            element = null;
            isolateScope = null;
            scope.item = null;
            ngCart.init();
        });

        function createTestHtml(html) {
            element =  angular.element(html || defaultHtml);
            compile(element)(scope);
            scope.$digest();
            isolateScope = element.isolateScope();
            scope.$digest();
        }

        it('total number of items should change with + and - clicks', inject(function() {

            var html = '<ngcart-addtocart id="{{item.id}}"  name="{{item.name}}" price="{{item.price}}"  data="item"  quantity="1" quantity-max="5"> Add to Cart </ngcart-addtocart>';

            scope.item =  {
                    "id": 6,
                    "code": "DCC-1200",
                    "image": "286341_fpx.jpg",
                    "name": "Cuisinart DCC-1200 Coffee Maker, Brew Central 12-Cup",
                    "description": "No more coffee runs. Have the best cup right at home with this fully programmable 14-cup brewer, which features a Brew Strength Control, so you can cater each cup exactly to your preferences. From having a pot ready when you wake up to allowing you to pour a cup mid-brew to offering 1-to-4 cup settings, this coffee maker knows you like to keep your options open. Model DCC-3200.",
                    "origPrice": 129.99,
                    "price": 89.99
                 }

            spyOn(scope, '$on').and.callThrough();

            createTestHtml(html);

            var clickBtn =  element.find("span.btn").eq(0);
            clickBtn.click();
            expect(ngCart.getTotalItems()).toEqual(1);
            expect(clickBtn.prev().text().trim()).toEqual("1");

            html = "<ngcart-cart></ngcart-cart>";
            createTestHtml(html);
            var tdParent = element.find("span.glyphicon-minus").parent();
            element.find("span.glyphicon-plus").eq(0).click();
            expect(ngCart.getTotalItems()).toEqual(2);


            expect(scope.$on).toHaveBeenCalled();

            expect(tdParent.text().trim()).toBe("2");
            element.find("span.glyphicon-minus").eq(0).click();
            expect(ngCart.getTotalItems()).toEqual(1);
            expect(tdParent.text().trim()).toBe("1");
            expect(scope.$on).toHaveBeenCalled();

/*            runs(function() {
                return scope.size == 1;
            }, "the value should decrement in allocated time", 1000);*/

        }));
    });
}());