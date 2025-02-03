(function () {
	'use strict';

	angular
		.module('core')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('map', {
				url: '/map',
				views: {
					'': { 
						templateUrl: 'modules/map/client/views/map.client.view.html' 
					},
					'nav@map': { 
						templateUrl: 'modules/navigation/client/views/navigation.client.view.html' 
					},
					'footer@map': { 
						templateUrl: 'modules/footer/client/views/footer.client.view.html' 
					}
				}
			});
	}
})();
