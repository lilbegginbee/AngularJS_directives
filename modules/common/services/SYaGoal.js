/**
 * Настройка таргетов для яндекс.Метрика
 */
module.factory('SYaGoal', ['$window', function($window) {
	var config = {
		'counters': {
			'main': 10670923,
			'fourth': 21828691
		},
		goals: {
			'discover-btn-click': ['main'],
			'booktree-link-click': ['main'],
			'hochu-tirazh-logo-button': ['main'],
			'appstore-available-button': ['main'],
			'nkk-get-chapter': ['main'],
			'nkk-subscribe': ['main'],
			'ebooks-page-ios-popup-click': ['main'],
			'click_buybutton_mif': ['main'],
			'click_download_mif': ['main'],
			'ozon_buy_top': [],
			'ozon_buy_bottom': [],
			'labirint_buy_top': [],
			'labirint_buy_bottom': [],
			'knigabiz_buy_top': [],
			'knigabiz_buy_bottom': [],
			'SEARCH': [],
			'READ': [],
			'USE-SEARCH': [],
			'GET-PAGES': [],
			'OZON-TRANSITION': [],
			'get-chapter': [],
			'podrobnee_o_podarkah': ['fourth'],
			'sales-mif': ['fourth']

		}
	}

    return {
        goal: function(goal) {
			if (!config.goals.hasOwnProperty(goal)) {
				// The goal doesn't exist
				return false;
			}
			config.goals[goal].forEach(function( value ) {
				var yaCounter = $window['yaCounter' + config.counters[value]];
				return yaCounter.reachGoal(goal);
			});
        }
    }
}]);