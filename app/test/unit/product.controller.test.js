/**
 * Created by User on 5/15/2015.
 */
/**
 * Created by User on 3/20/2015.
 */
(function() {
    // Exhibitino Controller Spec
    describe('ProductListCtrl', function() {
        // Initialize global variables
        var ProductListCtrl,
            scope,
            rootScope,
            timeout,
            $httpBackend,
            $stateParams,
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


        //beforeEach(inject(function($urlRouterProvider) { $urlRouterProvider.deferIntercept(); }));

        beforeEach(inject(function($controller, _$rootScope_, _$location_, _$stateParams_, _$httpBackend_, _$timeout_) {
            // Set a new global scope
            scope = _$rootScope_.$new();
            rootScope =  _$rootScope_;
            timeout = _$timeout_;
            // Point global variables to injected services
            $stateParams = _$stateParams_;
            $httpBackend = _$httpBackend_;
            $location = _$location_;
            // Initialize the controller.
            ProductListCtrl = $controller('ProductListCtrl', {
                $scope: scope
            });
        }));

        afterEach(function() {
            $httpBackend.verifyNoOutstandingExpectation();
            $httpBackend.verifyNoOutstandingRequest();
        });

        it('controller run should create an array with at least one product object fetched from XHR', inject(function(productResource) {

            var sampleProduct = new productResource({
                "id": 6,
                "code": "DCC-1200",
                "image": "286341_fpx.jpg",
                "name": "Cuisinart DCC-1200 Coffee Maker, Brew Central 12-Cup",
                "description": scope.descTruncate("No more coffee runs. Have the best cup right at home with this fully programmable 14-cup brewer, which features a Brew Strength Control, so you can cater each cup exactly to your preferences. From having a pot ready when you wake up to allowing you to pour a cup mid-brew to offering 1-to-4 cup settings, this coffee maker knows you like to keep your options open. Model DCC-3200."),
                "origPrice": 129.99,
                "price": 89.99
            });

            // Create a sample exhibits array that includes the new exhibit
            var sampleProducts = [sampleProduct];

            // Set GET response
            $httpBackend.expect("GET", "/api/products").respond(sampleProducts);

            $httpBackend.flush();

            // Test scope value
            expect(scope.initProducts).toEqualData(sampleProducts);
        }));
    });
}());

