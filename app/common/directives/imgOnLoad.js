/**
 * Created by User on 5/23/2015.
 */

(function (module) {
    "use strict";

    module.directive('imageonload', function() {
        return {
            restrict: 'A',
            link: function(scope, element, attrs) {

                var imgLoadingIcon = attrs["imageonload"];
                var loader = null;

                if(imgLoadingIcon) {
                    loader = angular.element("<img src='" + imgLoadingIcon + "' style='visibility:visible; margin: 50px auto'>");
                    element.after(loader);
                }

                element.bind('load', function() {
                    loader.remove();
                    element.css('display', 'block');
                });
            }
        };
    });

}(angular.module('common.services')));
