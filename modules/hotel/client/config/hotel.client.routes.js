(function () {
	'use strict';

	angular
		.module('core')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('hotel', {
				url: '/hotel',
				views: {
					'': { 
						templateUrl: 'modules/hotel/client/views/hotel.client.view.html' 
					},
					'nav@hotel': { 
						templateUrl: 'modules/navigation/client/views/navigation.client.view.html' 
					},
					'footer@hotel': { 
						templateUrl: 'modules/footer/client/views/footer.client.view.html' 
					}
				}
			});
	}
})();
