// http://www.zhex.me/blog/2013/08/03/provider-factory-and-service-in-angularjs/

$provide.provider('test', {
  n: 3;
  $get: function () {
    return n;
  };
});

// 方法 2
$provide.provider('test', function () {
  this.n = 3;
  this.$get = function () {
    return n;
  };
});

// 使用
app.controller('MainCtrl', function ($scope, test) {
  $scope.test = test;
});


//让我们看看 provider 的内部实现代码,可以看到 provider 的基本原则就是通过实现 $get 方法
//来进行单例注入，使用时获得的就是 $get 执行后的结果。
/***********************************************************

function provider(name, provider_) {
  if (isFunction(provider_)) {
    provider_ = providerInjector.instantiate(provider_);
  }
  if (!provider_.$get) {
    throw Error('Provider ' + name + ' must define $get factory method.');
  }
  return providerCache[name + providerSuffix] = provider_;
}

************************************************************/