(function () {
	'use strict';

	angular
		.module('core')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('place', {
				url: '/place/:placeId',
				views: {
					'': { 
						templateUrl: 'modules/place/client/views/place.client.view.html' 
					},
					'nav@place': { 
						templateUrl: 'modules/navigation/client/views/navigation.client.view.html' 
					},
					'footer@place': { 
						templateUrl: 'modules/footer/client/views/footer.client.view.html' 
					}
				}
			});
	}
})();
