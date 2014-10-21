/**
 * @ngdoc controller
 * @name CDefaultSubscribeForm
 *
 * @description
 * Общий контроллер для форм подписк.
 * Автоматически заполняет поле email авторизованного пользователя.
 *
 */
module.controller('CDefaultSubscribeForm', ['$scope', 'SDataSource', function($scope, SDataSource) {

	$scope.DataSource = SDataSource;
	$scope.panel={};

	$scope.getGtmCurrentPrice = function() {
		return window.gtmCurrentPrice;
	};

	// Для автозаполенения почты, если пользователь авторизирован
	var profile = SDataSource.getProfileData();
	$scope.email = profile.email;
	$scope.$watch(function() {
		return profile.email;
	}, function(email, prev) {
		if ($scope.email && $scope.email != prev) {
			return;
		}
		$scope.email = email;
	});

}]);