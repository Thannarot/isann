(function () {
	'use strict';

	angular
		.module('core')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('travel', {
				url: '/travel',
				views: {
					'': { 
						templateUrl: 'modules/travel/client/views/travel.client.view.html' 
					},
					'nav@travel': { 
						templateUrl: 'modules/navigation/client/views/navigation.client.view.html' 
					},
					'footer@travel': { 
						templateUrl: 'modules/footer/client/views/footer.client.view.html' 
					}
				}
			});
	}
})();
