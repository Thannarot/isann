(function () {
	'use strict';

	angular
		.module('core')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('cafe', {
				url: '/cafe',
				views: {
					'': { 
						templateUrl: 'modules/cafe/client/views/cafe.client.view.html' 
					},
					'nav@cafe': { 
						templateUrl: 'modules/navigation/client/views/navigation.client.view.html' 
					},
					'footer@cafe': { 
						templateUrl: 'modules/footer/client/views/footer.client.view.html' 
					}
				}
			});
	}
})();
