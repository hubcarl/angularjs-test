var app = angular.module('myApp',[]);

app.service('reverseService',function(){
	this.reverse = function(text){
	    return text.split(" ").reverse().join(" ");
	}
});

app.factory('testFactory', function(){
    return {
        sayHello: function(text){
            return "Factory says \"Hello " + text + "\"";
        },
        sayGoodbye: function(text){
            return "Factory says \"Goodbye " + text + "\"";
        }  
    }               
});

app.service('testService', function(){
    this.sayHello= function(text){
        return "Service says \"Hello " + text + "\"";
    };        
    this.sayGoodbye = function(text){
        return "Service says \"Goodbye " + text + "\"";
    };   
});

function HelloCtrl($scope, testService, testFactory)
{
    $scope.fromService = testService.sayHello("World");
    $scope.fromFactory = testFactory.sayHello("World");
}

function GoodbyeCtrl($scope, testService, testFactory)
{
    $scope.fromService = testService.sayGoodbye("World");
    $scope.fromFactory = testFactory.sayGoodbye("World");
}


app.service('reverseService',function(){
    this.reverse = function(text){
        return text.split(" ").reverse().join(" ");
    }
});

app.factory('testFactory',['$window', function(win){
    return {
        sayHello: function(text){
            win.alert('hello,I am factory!!')
            return "Factory says \"Hello " + text + "\"";
        },
        sayGoodbye: function(text){
            return "Factory says \"Goodbye " + text + "\"";
        }  
    }               
}]);


// factory 可以有自己的依赖，
//像上面的代码，factory 可以 注入 $window 服务来调用   win.alert("")。而且service 就不行了。
app.factory('helloWorld', ['$rootScope','$http',function($rootScope, $http) {

}]);


// 为了理解根本上的不同，可以扒一下源码来看看两个func的实现：
/***************************************************************
 function provider(name, provider_) {
    if (isFunction(provider_) || isArray(provider_)) { //判断是函数还是数组
      provider_ = providerInjector.instantiate(provider_);
    }
    if (!provider_.$get) {
      throw Error('Provider ' + name + ' must define $get factory method.');
    }
    return providerCache[name + providerSuffix] = provider_;
  }

function factory(name, factoryFn) { 
    return provider(name, { $get: factoryFn }); 
}


function service(name, constructor) {
    return factory(name, ['$injector', function($injector) {
      return $injector.instantiate(constructor);
    }]);
}

***************************************************************/
// provider 是通过 $get 来在应用中注入单例，使用时取到的age就是 $get 返回的结果 。
// 结论就是：factory 是封装且简化了provide的一个功能,返回对象 。
var app = angular.module('myApp',[],function($provide) {
    $provide.provider('age',{
        start  : 10 ,
        $get : function() {
            return this.start + 10  ;
        }
    });
});
//or : 添加注入器案例：
var app = angular.module('myApp',[],function($provide) {
    $provide.provider('age',{
    start  : 10 ,
    $get : ['$window',function(win) {
            win.alert('hi');
            return this.start + 10  ;
           }]
    });
});

function HelloCtrl($scope,age){
    $scope.myage = age; 
}



// service 和 factory 都是单例模式（单例模式是一种设计模式）
app.service('Service', function(){
    this.name = 'yeelone';
    this.set = function(name){
        this.name = name ; 
    };
    
    this.get = function(){
        return this.name; 
    };
});


function HelloCtrl($scope,Service){
    $scope.name = Service.get();
    Service.set('newName'); 
}

function ByeCtrl($scope,Service){
    $scope.name = Service.get();
}
//输出结果 ：
//yeelone
//newName


var app = angular.module('myApp',[]);

app.factory('NameFactory',function(){
    var name = 'init';
    return {       
        set : function(name){
            this.name = name ; 
        },
        get : function(){
            return this.name ; 
        }
    };
}
);

function HelloCtrl($scope,NameFactory){
    
    NameFactory.set('yeelone');
    $scope.name = NameFactory.get();
}

function ByeCtrl($scope,NameFactory){
    $scope.name2 = NameFactory.get();
}

// service和factory可以 实现 controller 之间的数据共享