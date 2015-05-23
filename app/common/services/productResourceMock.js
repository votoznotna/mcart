/**
 * Created by User on 5/1/2015.
 */
(function () {
    "use strict";

    var app = angular
        .module("productResourceMock",
        ["ngMockE2E"]);

    app.run(function ($httpBackend) {
        var products =
            [
                {
                    "id": 1,
                    "code": "CHW-12",
                    "image": "755039_fpx.jpg",
                    "name": "Cuisinart CHW-12 Coffee Maker, 12 Cup Programmable with Hot Water System",
                    "description": "Quick, easy and wonderfully satisfying. Cuisinart's 12-cup programmable coffee maker features a hot water system for enjoying everything from coffee to tea plus oatmeal, instant soups and more! Exclusive Brew Pause\u2122 feature allows you to enjoy a cup of coffee before the cycle is finished. Fully automatic with a 24-hour programming feature, self-clean function and auto shutoff to make your mornings a breeze. Three-year limited warranty. Model CHW-12.",
                    "origPrice": 139.99,
                    "price": 99.99
                },
                {
                    "id": 2,
                    "code": "BTM800XL",
                    "image": "755045_fpx.jpg",
                    "name": "Breville BTM800XL Tea Maker, One Touch Electric",
                    "description": "Make tea time extra special with Breville's One Touch Tea Maker featuring variable steeping times and pre-set programs to ensure a perfect cup of tea every time. Tea basket automatically raises at the correct time to prevent over steeping. 51-oz. glass jug and 60-minute keep-warm setting. Makes a great gift for the avid tea drinker or someone just starting to explore the loose leaf tea world. One-year limited warranty. Model BTM800XL.",
                    "origPrice": 299.99,
                    "price": 249.98
                },
                {
                    "id": 3,
                    "code": "EN520SL",
                    "image": "1009442_fpx.jpg",
                    "name": "De'Longhi EN520 Lattissima Plus Single Serve Espresso Maker",
                    "description": "A brilliant brew ready in an instant! Simply pick your favorite Nespresso pod, press a button and relax into the incredible flavors of gourmet coffee right at home. An included milk container tops each drink off with a burst of steamed or frothed milk. Model EN520SL.",
                    "origPrice": 449.99,
                    "price": 399.99
                },
                {
                    "id": 4,
                    "code": "BES840XL",
                    "image": "1349665_fpx.jpg",
                    "name": "Breville BES840XL Espresso Maker, The Infuser",
                    "description": "Behold the best brew \u2013 using low pressure to gently expand the grinds before increasing high pressure, this espresso machine promotes a balanced, even extraction of flavor for consistently irresistible results. Electronic temperature control and a 1600-watt thermo-coil stainless steel system packs a punch of precision. 1-year warranty.",
                    "origPrice": 589.99,
                    "price": 499.98
                },
                {
                    "id": 5,
                    "code": "DCC-3200",
                    "image": "2368631_fpx.jpg",
                    "name": "Cuisinart DCC-3200 PerfecTemp 14-Cup Programmable Coffee Maker",
                    "description": "No more coffee runs. Have the best cup right at home with this fully programmable 14-cup brewer, which features a Brew Strength Control, so you can cater each cup exactly to your preferences. From having a pot ready when you wake up to allowing you to pour a cup mid-brew to offering 1-to-4 cup settings, this coffee maker knows you like to keep your options open. Model DCC-3200.",
                    "origPrice": 149.99,
                    "price": 109.99
                },
                {
                    "id": 6,
                    "code": "DCC-1200",
                    "image": "286341_fpx.jpg",
                    "name": "Cuisinart DCC-1200 Coffee Maker, Brew Central 12-Cup",
                    "description": "No more coffee runs. Have the best cup right at home with this fully programmable 14-cup brewer, which features a Brew Strength Control, so you can cater each cup exactly to your preferences. From having a pot ready when you wake up to allowing you to pour a cup mid-brew to offering 1-to-4 cup settings, this coffee maker knows you like to keep your options open. Model DCC-3200.",
                    "origPrice": 129.99,
                    "price": 89.99
                },
                {
                    "id": 7,
                    "code": "DCC500",
                    "image": "1741154_fpx.jpg",
                    "name": "Cuisinart DCC500 12-Cup Programmable Coffee Maker",
                    "description": "Self starter. This coffee maker takes control of your counter with 24-hour programmability that gets your brew started before you've left your bed. Plus, with a convenient Brew Pause\u2122 feature that puts a cup in your hand before the entire pot is ready and 1 to 4 cup settings that make just enough coffee for whoever is in the house, this coffee maker understands the joy of customizing each & every cup.",
                    "origPrice": 109.99,
                    "price": 69.99
                },
                {
                    "id": 8,
                    "code": "EM-600",
                    "image": "2593982_fpx.jpg",
                    "name": "Illy by Cuisinart Buona Tazza EM-600 Super Automatic Single Serve Espresso, Caffe Latte, Cappuccino Machine",
                    "description": "Get barista-quality beverages without leaving your house. Simply pop in an illy\u00AE iperEspresso capsule & press a button for an exceptional espresso or a creamy cappuccino. A removable milk tank serves up steamy & frothy milk in three cup size settings. Model EM-600.",
                    "origPrice": 729.99,
                    "price": 599.99
                },
                {
                    "id": 9,
                    "code": "CPK-17",
                    "image": "746906_fpx.jpg",
                    "name": "Cuisinart CPK-17 PerfecTemp 1.7L Electric Kettle",
                    "description": "Break free from the stove with a cordless kettle that steeps tea to its optimal temperature for a blend bursting with undiscovered full flavor and maximum healthful benefits. The PerfecTemp cordless kettle features six preset temperatures catered to some of the most popular teas and has a keep warm function that maintains your chosen temperature for 30 minutes so you can enjoy each hot cup. 3-year limited warranty. Model CPK-17.",
                    "origPrice": 179.99,
                    "price": 129.99
                },
                {
                    "id": 10,
                    "code": "EM-100",
                    "image": "278834_fpx.jpg",
                    "name": "Cuisinart EM-100 Espresso Maker",
                    "description": "Do caf\u00E9 your way. This compact, 15-bar espresso and cappuccino maker is the perfect addition to your countertop, letting you enjoy the bold taste of Italy without ever leaving your kitchen. Made to brew one or two cups, the pro-grade die cast and stainless steel housing is handsome and extremely durable. Three-year limited warranty. Model EM-100.",
                    "origPrice": 229.99,
                    "price": 179.99
                },
                {
                    "id": 11,
                    "code": "DCC-3000",
                    "image": "946318_fpx.jpg",
                    "name": "Cuisinart DCC-3000 Coffee Maker, Coffee on Demand",
                    "description": "Coffee by the cup! This early riser brews 12 cups of coffee cup by cup, so you can grab, go and get your fix quick. Up when you are with 24-hour advance programming, this coffee maker features a dispenser light that lets you know when to pull the lever and get a steaming hot cup of Joe. 3-year limited warranty. Model DCC-3000.",
                    "origPrice": 249.99,
                    "price": 179.99
                },
                {
                    "id": 12,
                    "code": "DGB-1",
                    "image": "2386689_fpx.jpg",
                    "name": "Cuisinart DGB-1 Grind & Brew Coffee Maker",
                    "description": "Brew the perfect cup of coffee with Cuisinart's coffee maker. Easy-to-use features make your mornings a cinch! Model DGB-1.",
                    "origPrice": 159.99,
                    "price": 119.99
                }

            ]

        var productUrl = "/api/products"

        $httpBackend.whenGET(productUrl).respond(products);

        var editingRegex = new RegExp(productUrl + "/[0-9][0-9]*", '');
        $httpBackend.whenGET(editingRegex).respond(function (method, url, data) {
            var product = {"productId": 0};
            var parameters = url.split('/');
            var length = parameters.length;
            var id = parameters[length - 1];

            if (id > 0) {
                for (var i = 0; i < products.length; i++) {
                    if (products[i].id == id) {
                        product = products[i];
                        break;
                    }
                };
            }
            return [200, product, {}];
        });

        // Pass through any requests for application files
        $httpBackend.whenGET(/app/).passThrough();
        $httpBackend.whenGET(/template/).passThrough();
        $httpBackend.whenGET(/partials/).passThrough();
    })
}());