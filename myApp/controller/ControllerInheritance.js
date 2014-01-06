(function () {
  var app = angular.module('angularjs-starter', []);

  var ParentCtrl = function ($scope, $location) {
    $scope.path = function () {
      return $location.absUrl();
    };
  };
  app.controller('ChildCtrl', function($scope, $injector) {
    $injector.invoke(ParentCtrl, this, {$scope: $scope});
    $scope.url = $scope.path();
  });
})();
