(function () {
	'use strict';

	angular
		.module('core')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('resturant', {
				url: '/resturant',
				views: {
					'': { 
						templateUrl: 'modules/resturant/client/views/resturant.client.view.html' 
					},
					'nav@resturant': { 
						templateUrl: 'modules/navigation/client/views/navigation.client.view.html' 
					},
					'footer@resturant': { 
						templateUrl: 'modules/footer/client/views/footer.client.view.html' 
					}
				}
			});
	}
})();
