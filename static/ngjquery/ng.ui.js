// file ng.ui.js
define(function(require){
	require('ng/ng.config').init();
	require('ng/ng.service').init();
	require('ng/ng.filter').init();

	require('jquery.autocomplete');
	require('jquery.bgiframe');
	require('jquery.datepicker');
	require('jquery.hotkeys');

	var ag = window.angular;
	return {
		init: function(){
			var md = ag.module('ng.ui', ['ng.config', 'ng.service', 'ng.filter']);
			
			// 日期选择器
			// *** *** *** *** *** *** *** *** *** ***
			// *** *** *** *** *** *** *** *** *** ***
			md.directive('uiDate', ['ng.config', 'uiLog', function(conf, log){
				'use strict';
				var options = {};
				if(ag.isObject(conf.date)){
					ag.extend(options, conf.date);
				}
				return {
					restrict: 'A',
					require: 'ngModel',
					link: function(scope, el, attrs, ctrl){
						var getOptions = function(){
							return ag.extend(options, scope.$eval(attrs.uiDate));
						};

						var init = function(){
							var opts = getOptions();
							log('Init datepicker : ');
							log(opts);

							if(ctrl){
								// update model when datepicker value changes
								var updateModel = function(){
									scope.$apply(function(){
										var date = el.datepicker("getDate");
										ctrl.$setViewValue(date);
									});
								};

								if(opts.onSelect){
									var userHandler = opts.onSelect;
									opts.onSelect = function(value, picker){
										updateModel();
										return userHandler(value, picker);
									};
								}else{
									opts.onSelect = function(value, picker){
										updateModel();
									};
								}

								// datepicker后无法按键了
//								el.bind('change', updateModel);

								// Update the date picker when the model changes
								ctrl.$render = function(){
									var date = ctrl.$viewValue;
									if (ag.isDefined(date) && date !== null && !ag.isDate(date)){
										throw new Error('ng-Model value must be a Date object - currently it is a ' + typeof date + ' - use ui-date-format to convert it from a string');
									}

									el.datepicker("setDate", date);
								};
							}

							// If we don't destroy the old one it doesn't update properly when the config changes
							el.datepicker('destroy');
							// Create the new datepicker widget
							el.datepicker(opts);
							// Force a render to override whatever is in the input text box
							ctrl.$render();
						};

						// Watch for changes to the directives options
						scope.$watch(getOptions, init, true);
					}
				};
			}]);

			// 自动填充
			// *** *** *** *** *** *** *** *** *** ***
			// *** *** *** *** *** *** *** *** *** ***
			md.directive('uiAutocomplete', ['ng.config', 'uiLog', function(conf, log){
				'use strict';
				var options = {};
				if(ag.isObject(conf.autocomplete)){
					ag.extend(options, conf.autocomplete);
				}
				return {
					restrict: 'A',
					require: 'ngModel',
					link: function(scope, el, attrs, ctrl){
						var getOptions = function(){
							return ag.extend(options, scope.$eval(attrs.uiAutocomplete));
						};

						var init = function(){
							var opts = getOptions();
							log('Init autocomplete : ');
							log(opts);

							if(!opts.url || !opts.targetModel){
								log('Init autocomplete fail : url/targetModel required!');
								return;
							}

							if(ctrl){
								ctrl.$render = function(){
									// 自动填充如果没有填充的显示值，就默认取填充值
									var showLabel = ctrl.$viewValue;
									if(!showLabel){
										var targetModel = opts.targetModel;

										var showValue;
										if(targetModel.contains('.')){
											var arr = targetModel.split(/\./);
											var i = 0;
											var targetScope = scope;

											for(; i < arr.length; i++){
												var key = arr[i];
												if(i == arr.length - 1){
													showValue = targetScope[key];
												}else{
													if(!targetScope[key])
														break;
													targetScope = targetScope[key];
												}
											}
										}else{
											showValue = scope[targetModel];
										}
										if(showValue){
											ctrl.$setViewValue(showValue);
											el.val(showValue);
										}
									}
								};
							}

							// json : 
							// [{data: {result: i}, value: 'Col' + i}]
							el.autocomplete({
								url: opts.url, 
								minChars: opts.minChars, 
								maxItemsToShow: opts.maxItemsToShow, 
								remoteDataType: 'json', 
								useCache: false,
								processData: function(data) {
									var i, r = [];
									for(i = 0; i < data.length; i++){
										var item = data[i];
										r.push({data: {result: item.v}, value: item.v + '-' + item.l});
									}
									return r;
								},
								onItemSelect: function(item){
									var val = item.data.result;
									var showLabel = item.value;

									var targetModel = opts.targetModel;

									if(targetModel.contains('.')){
										var arr = targetModel.split(/\./);
										var i = 0;
										var targetScope = scope;

										for(; i < arr.length; i++){
											var key = arr[i];
											if(i == arr.length - 1){
												targetScope[key] = val;
											}else{
												if(!targetScope[key])
													targetScope[key] = {};
												targetScope = targetScope[key];
											}
										}
									}else{
										scope[targetModel] = val;
									}

									scope.$apply(function(){
										ctrl.$setViewValue(showLabel);
									});
								}
							});

							ctrl.$render();
						};

						// Watch for changes to the directives options
						scope.$watch(getOptions, init, true);
					}
				};
			}]);

			// 快捷键
			// *** *** *** *** *** *** *** *** *** ***
			// *** *** *** *** *** *** *** *** *** ***
			md.directive('uiShortkey', ['ng.config', 'uiLog', function(conf, log){
				'use strict';
				var options = {};
				return {
					restrict: 'A',
					link: function(scope, el, attrs, ctrl){
						var getOptions = function(){
							return ag.extend(options, scope.$eval(attrs.uiShortkey));
						};

						var init = function(){
							var opts = getOptions();
							log('Init shortkey : ');
							log(opts);

							if(!opts.key || !opts.method){
								log('Init shortkey fail : key/method required!');
								return;
							}

							$.hotkeys.add(opts.key, function(){
								var fn = scope[opts.method];
								if(fn)
									fn.call();
							});
						};

						// Watch for changes to the directives options
						scope.$watch(getOptions, init, true);
					}
				};
			}]);

			// 布局相关
			// *** *** *** *** *** *** *** *** *** ***
			// *** *** *** *** *** *** *** *** *** ***
			md.directive('uiLayoutCol', ['ng.config', 'uiLog', function(conf, log){
				'use strict';
				return {
					restrict: 'A',
					link: function(scope, el, attrs, ctrl){
						if('TR' != el[0].nodeName)
							return;

						log('Relayout...');

						var _tds = el.children('td');
						if(_tds.size() == 2){
							_tds.filter(':first').addClass('l');
							_tds.filter(':last').addClass('r');
						}else if(_tds.size() == 4){
							_tds.filter(':even').addClass('l2');
							_tds.filter(':odd').addClass('r2');
						}else if(_tds.size() == 6){
							_tds.eq(0).addClass('l3');
							_tds.eq(1).addClass('r3');
							_tds.eq(2).addClass('l3');
							_tds.eq(3).addClass('r3');
							_tds.eq(4).addClass('l3');
							_tds.eq(5).addClass('r3last');
						}

						// siblings tr set td text-align to right if exists label 
						el.siblings('tr').children('td').filter(function(){
							return $(this).find('label').size() > 0;
						}).addClass('ar');

						// set vertical-align = middle for label
			//			el.siblings('tr').children('td').each(function(){
			//				var _td = $(this);
			//				if(_td.find('label').size() > 0){
			//					_td.addClass('ar');
			//					_td.find('label').addClass('vm');
			//				}
			//			});
					}
				};
			}]);
		}
	};
});