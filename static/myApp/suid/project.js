angular.module('project', []).config(function($routeProvider) {
    $routeProvider.
      when('/', {controller:ListCtrl, templateUrl:'list.html'}).
      when('/edit/:projectId', {controller:EditCtrl, templateUrl:'detail.html'}).
      when('/new', {controller:CreateCtrl, templateUrl:'detail.html'}).
      otherwise({redirectTo:'/'});
  });

function ListCtrl($scope, Project) {
  //$scope.projects = Project.query();
  $scope.projects = [
  {name: "Nexus S",description: "Fast just got faster with Nexus S."},
  {name: "Motorola XOOM with Wi-Fi",description: "The Next, Next Generation tablet."},
  {name: "MOTOROLA XOOM",description: "The Next, Next Generation tablet."}];
}

function CreateCtrl($scope, $location, Project) {
  $scope.save = function() {
    Project.save($scope.project, function(project) {
      $location.path('/edit/' + project._id.$oid);
    });
  }

}

function EditCtrl($scope, $location, $routeParams, Project) {
  var self = this;

  Project.get({id: $routeParams.projectId}, function(project) {
    self.original = project;
    $scope.project = new Project(self.original);
  });

  $scope.isClean = function() {
    return angular.equals(self.original, $scope.project);
  }

  $scope.destroy = function() {
    self.original.destroy(function() {
      $location.path('/list');
    });
  };

  $scope.save = function() {
    $scope.project.update(function() {
      $location.path('/');
    });
  };

}