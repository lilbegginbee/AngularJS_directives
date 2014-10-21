/**
 * @ngdoc directive
 * @name yaGoalSubmit
 * @restrict A
 *
 * @description
 * See {@link ng.directive:ngClick ngClick}, только для события submit.
 *
 * @example
 * <form ya-goal-submit="goal1">...
 *
 */
module.directive('yaGoalSubmit', ['SYaGoal', function(SYaGoal) {
	return {
		restrict: 'A',
		link: function(scope, element, attrs) {
					element.on('submit', function() {
						var yaGoals = attrs.yaGoal.split(',');
						yaGoals.forEach(function(value){
							SYaGoal.goal(value);
						})
					});
			}
		}
	}]);