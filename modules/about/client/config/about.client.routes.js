(function () {
	'use strict';

	angular
		.module('core')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('about', {
				url: '/about',
				views: {
					'': { 
						templateUrl: 'modules/about/client/views/about.client.view.html' 
					},
					'nav@about': { 
						templateUrl: 'modules/navigation/client/views/navigation.client.view.html' 
					},
					'footer@about': { 
						templateUrl: 'modules/footer/client/views/footer.client.view.html' 
					}
				}
			});
	}
})();
