(function (module) {
    "use strict";


    module.directive('onFinishRender', ['messaging', 'events',
        function(messaging, events) {
            return {
                restrict: 'E',
                link: function (scope, element, attrs) {
                    if(scope.$last){
                        scope.$evalAsync(attrs.callBack);
                    }
                }
            };
        }]);

}(angular.module('common.services')));
