// file ng.filter.js
define(function(require){
	return {
		init: function(){
			var md = angular.module('ng.filter', []);

			// 过滤器方法都会执行两次。。。吐血
			// http://stackoverflow.com/questions/11676901/is-this-normal-for-angularjs-filtering

			// 日期格式转换
			md.filter('formatDate', function(){
				return function(value, format){
					if (!value)
						return value;

					return value.format(format || 'yyyy-MM-dd');
				};
			});
		}
	};
});