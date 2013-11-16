// file ng.config.js
define(function(require){
	return {
		init: function(){
			// 默认配置
			var conf = {};

			conf.date = {dateFormat: 'yy-mm-dd'};
			conf.autocomplete = {minChars: 3, maxItemsToShow: 20};

			var md = angular.module('ng.config', []);
			md.value('ng.config', conf);
		}
	};
});



