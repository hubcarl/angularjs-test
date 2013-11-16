
// file ng.service.js
define(function(require){
	return {
		init: function(){
			var md = angular.module('ng.service', []);

			// 注册服务
			// 全局变量获取，一种约定
			md.factory('uiGetPageData', ['$window', function(win){
				return function(key){
					var pageData = win.pageData;
					return pageData ? pageData[key] : null;
				};
			}]);

			// 日志
			md.factory('uiLog', ['$window', function(win){
				return function(msg, level){
					if(typeof(msg) != 'string')
						msg = JSON.stringify(msg);

					level = level || 'INFO';
					if(win.console && win.console.log)
						win.console.log('[' + level + ']' + msg);
				};
			}]);

			// 服务请求过滤
			md.factory('uiRequest', ['uiLog', function(log){
				return {
					filter: function(params, conf, skipLl){
						if(!conf)
							conf = {dateFormat: 'yyyy-MM-dd'};

						var r = {};
						if(params){
							for(key in params){
								if(skipLl && skipLl.contains(key))
									continue;

								var val = params[key];
								if(angular.isDate(val)){
									r[key] = val.format(conf.dateFormat);
								}else{
									r[key] = val;
								}
							}
						}
						return r;
					}
				};
			}]);

			// 验证服务
			md.factory('uiValid', function(){
				return {
					check: function(val, rule){
					}
				};
			});
		}
	};
});
