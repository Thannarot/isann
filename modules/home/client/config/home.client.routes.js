(function () {
	'use strict';

	angular
		.module('core')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('home', {
				url: '/home',
				views: {
					'': { 
						templateUrl: 'modules/home/client/views/home.client.view.html' 
					},
					'nav@home': { 
						templateUrl: 'modules/navigation/client/views/navigation.client.view.html' 
					},
					'footer@home': { 
						templateUrl: 'modules/footer/client/views/footer.client.view.html' 
					}
				}
			});
	}
})();
