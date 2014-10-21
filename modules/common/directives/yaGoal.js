/**
 * @ngdoc directive
 * @name yaGoal
 * @restrict A
 *
 * @description
 * Управляет целями яндекс-метрики для элемента. При клике указывает сервису SYaGoal какие цели нужно отправить.
 *
 *
 * @example
 * <a href="#" ya-goal="goal1">Goal1</a>
 *
 */
module.directive('yaGoal', ['SYaGoal', function(SYaGoal) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
					element.on('click', function() {
						var yaGoals = attrs.yaGoal.split(',');
						yaGoals.forEach(function(value){
							SYaGoal.goal(value);
						})
					});
			}
		}
	}]);