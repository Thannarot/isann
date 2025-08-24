(function () {
	'use strict';

	angular
		.module('core')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('tourism3', {
				url: '/tourism3',
				views: {
					'': { 
						templateUrl: 'modules/tourism3/client/views/tourism3.client.view.html' 
					},
					'nav@tourism3': { 
						templateUrl: 'modules/navigation/client/views/navigation.client.view.html' 
					},
					'footer@tourism3': { 
						templateUrl: 'modules/footer/client/views/footer.client.view.html' 
					}
				}
			});
	}
})();
