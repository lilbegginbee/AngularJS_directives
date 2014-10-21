/**
 * @ngdoc directive
 * @name imgLoading
 * @restrict A
 *
 * @description
 * Контролирует загрузку изображений, продбрасывая последовательно классы ng-loading, ng-loaded, mg-loaded-fail,
 * манипулируя которыми можно задавать разное поведение и внешний вид для изображения.
 *
 * @element IMG
 */
module.directive('imgLoading', [function() {
	return {
		restrict: 'A',
		compile: function() {
			return {
				pre: function(scope, element, attrs) {

					var isError = false;

					attrs.$observe('src', function() {
						element.removeClass('ng-loaded')
							.addClass('ng-loading');
						isError = false;
					});

					element.addClass('ng-loading');


					element.on('load', function() {
						if (isError || !element.attr('src').search('data:image')) {
							return;
						}
						element.removeClass('ng-loading')
							.addClass('ng-loaded');
					});

					element.on('error', function() {
						isError = true;
						element.removeClass('ng-loading')
							// обложка не загрузилась, нужно убрать спиннер
							.addClass('ng-loaded ng-loaded-fail')
							.attr('src', 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');
					});


					// изображение уже может быть загружено и событие load никогда не отработает,
					if(element[0].complete) {
						element.removeClass('ng-loading')
							.addClass('ng-loaded');
					}
				}
			}
		}
	}
}]);