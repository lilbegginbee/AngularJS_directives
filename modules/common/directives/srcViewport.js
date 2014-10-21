/**
 * @ngdoc directive
 * @name srcViewport
 * @restrict A
 *
 * @description
 * Указывает, что изображение нужно загрузить, только когда оно попадёт в видимую часть экрана.
 *
 * @example
 * &lt;img data-img-src="/images/bottom.png" src-viewport /&rt;
 *
 * @todo
 * Отказаться от data-img-src, использовать значение в src-viewport
 *
 * @element IMG
 */
module.directive('srcViewport', ['$window', '$document', function($window, $document) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {

				var imgHandler =
					function() {
						var rect = element[0].getBoundingClientRect();

						if (rect.top >= 0 &&
							rect.left >= 0 &&
							(rect.top) <= ($window.innerHeight || $document.documentElement.clientHeight) &&
							(rect.left) <= ($window.innerWidth || $document.documentElement.clientWidth)) {

							var img = new Image();
							var afterLoadedHandler = function() {
									element.attr('src', img.src);
									delete img;
							};
							img.onload = afterLoadedHandler;
							img.onerror = afterLoadedHandler;
							img.src = element.attr('data-img-src');
							element.removeAttr('data-img-src');

							// Убираем обработчик для данного элемента
							angular.element($window)
								.unbind('scroll', 			imgHandler )
								.unbind('resize', 			imgHandler )
								.unbind('load', 			imgHandler )
								.unbind("DOMContentLoaded",	imgHandler )

						}
					};

				// дефолтное изображение, чтобы браузер не считал наше изображние битым/незагруженным
				element.attr('src','data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7');

				angular.element($window)
					.bind("scroll", 			imgHandler )
					.bind("resize", 			imgHandler )
					.bind("load", 				imgHandler )
					.bind("DOMContentLoaded",	imgHandler );

				// @todo don't forget to destroy

			}
		}
	}]);