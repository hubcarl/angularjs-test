'use strict';

/* App Module */

var myApp = angular.module('myApp', []);
app.service('dbService', function() {
  return {
    getData: function($q, $http) {
      var defer = $q.defer();
      $http.get('db.php/score/getData').success(function(data) {
        defer.resolve(data);
      });
      return defer.promise;
    }
  };
});
myApp.config(['$routeProvider','dbService',function($routeProvider,dbService) {
    $routeProvider.
      when('/phones', {
        templateUrl: 'partials/phone-list.html',
        controller: 'PhoneListCtrl',
        resolve: {
          data: function (dbService) {
            return dbService.getData();
          }
        }
      }).
      when('/phones/:phoneId', {
        templateUrl: 'partials/phone-detail.html',
        controller: 'PhoneDetailCtrl'
      }).
      otherwise({
        redirectTo: '/phones'
      });
  }]);
