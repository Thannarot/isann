(function () {
	'use strict';

	angular
		.module('core')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('tourism', {
				url: '/tourism',
				views: {
					'': { 
						templateUrl: 'modules/tourism/client/views/tourism.client.view.html' 
					},
					'nav@tourism': { 
						templateUrl: 'modules/navigation/client/views/navigation.client.view.html' 
					},
					'footer@tourism': { 
						templateUrl: 'modules/footer/client/views/footer.client.view.html' 
					}
				}
			});
	}
})();
