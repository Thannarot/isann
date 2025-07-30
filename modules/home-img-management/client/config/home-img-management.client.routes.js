(function () {
	'use strict';

	angular
		.module('home')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('home-img-management', {
				url: '/home-img-management',
				views: {
					'': { 
						templateUrl: 'modules/home-img-management/client/views/home-img-management.client.view.html'
					},
					'nav@data-management': { 
						templateUrl: 'modules/navigation/client/views/navigation.client.view.html' 
					},
					'footer@data-management': { 
						templateUrl: 'modules/footer/client/views/footer.client.view.html' 
					}
				}
			});
	}
})();
