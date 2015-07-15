(function (module) {
    "use strict";

    module.directive("repeater", function () {
        return {
            scope: {
                data: "=source",
                propName: "@itemName"
            },
            transclude: 'element',
            compile: function (element, attrs, transcludeFn) {
                return function ($scope, $element, $attr) {
                    $scope.$watch("data.length", function () {
                        if(!$scope.data) return;
                        var parent = $element.parent();
                        parent.children().remove();
                        for (var i = 0; i < $scope.data.length; i++) {
                            var childScope = $scope.$new();
                            childScope[$scope.propName] = $scope.data[i];
                            transcludeFn(childScope, function (clone) {
                                parent.append(clone);
                                    });
                                }
                            });
                        }
                    }
                }
            });
}(angular.module('common.services')));

