var app = angular.module('plunker', []);
app.value('fileSystem', {requestFileSystem: window.requestFileSystem || window.webkitRequestFileSystem});
//default sessionStorage
app.provider('storageService', function () {
  this.$get = function () {
    return {
      setItem: function (key, value) {
        sessionStorage.setItem(key, value);
        console.log('Fetching newly added key from sessionStorage for verification = ', sessionStorage.getItem(key));
      }
    };
  };
});
//File System storage if supported. Decorator will take care of it.
app.provider('storageServiceFile', function () {
  this.$get = ['$window', 'fileSystem', function($window, fileSystem) {
    var fs;
    function onInitFs(fSys) {
      console.log('Opened file system: ' + fSys.name);
      fs = fSys;
    }

    function errorHandler(e) {
      var msg = '';

      switch (e.code) {
        case FileError.QUOTA_EXCEEDED_ERR:
          msg = 'QUOTA_EXCEEDED_ERR';
          break;
        case FileError.NOT_FOUND_ERR:
          msg = 'NOT_FOUND_ERR';
          break;
        case FileError.SECURITY_ERR:
          msg = 'SECURITY_ERR';
          break;
        case FileError.INVALID_MODIFICATION_ERR:
          msg = 'INVALID_MODIFICATION_ERR';
          break;
        case FileError.INVALID_STATE_ERR:
          msg = 'INVALID_STATE_ERR';
          break;
        default:
          msg = 'Unknown Error';
          break;
      }
      console.log('Error: ' + msg);
    }

    var reqFileSystem = fileSystem.requestFileSystem;
    if (reqFileSystem) {
      reqFileSystem($window.TEMPORARY, 1*1024*1024 /*1MB*/, onInitFs, errorHandler);
    }
    return {
      setItem: function (key, value) {
        fs.root.getFile(key, {create: true}, function(fileEntry) {
          // Create a FileWriter object for our FileEntry (log.txt).
          fileEntry.createWriter(function(fileWriter) {
            fileWriter.onwriteend = function(e) {
              console.log('Write completed.');
            };

            fileWriter.onerror = function(e) {
              console.log('Write failed: ' + e.toString());
            };

            // Create a new Blob and write it to log.txt.
            var blob = new Blob([value], {type: 'text/plain'});
            fileWriter.write(blob);
          }, errorHandler);
        }, errorHandler);
      }
    };
  }];
});
app.config(function($provide) {
  $provide.decorator('storageService', ['$delegate', '$injector', '$rootScope', 'fileSystem', function ($delegate, $injector, $rootScope, fileSystem) {
    if (fileSystem.requestFileSystem) {
      $rootScope.isFileSystemSupported = true;
      return $injector.get('storageServiceFile');
    } else {
      $rootScope.isFileSystemSupported = false;
      return $delegate;
    }
  }]);
});
app.directive('dirResult', ['$rootScope', '$timeout', function ($rootScope, $timeout) {
  function getSessionStorageData() {
    var data = {};
    for (var i = 0; i < sessionStorage.length; i++) {
      var key = sessionStorage.key(i);
      data[key] = sessionStorage[key];
    }
    return data;
  }

  return {
    scope: {},
    controller: function ($scope, $element) {
      $scope.data = getSessionStorageData();
      $rootScope.$on('saveSuccess', function () {
        if ($rootScope.isFileSystemSupported) {//refresh iframe
          var fsIframe = $('iframe[name=fs]')[0];
          $timeout(function () {
            fsIframe.src = fsIframe.src;
          }, 100);
        } else {//refresh data from sessionScope
          $scope.data = getSessionStorageData();
        }
      });
    }
  };
}]);
app.controller('MainCtrl', ['$scope', 'storageService', function($scope, storageService) {
  $scope.record = {};
  $scope.save = function (rec) {
    storageService.setItem(rec.key, rec.value);
    $scope.$emit('saveSuccess');
    toastr.options = {
      "positionClass": "toast-bottom-right",
      "timeOut": 2000
    };
    toastr.success('Data added to storage');
  };
}]);
