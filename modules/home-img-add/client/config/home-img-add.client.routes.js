(function () {
	'use strict';

	angular
		.module('home')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('home-img-add', {
				url: '/home-img-add',
				views: {
					'': { 
						templateUrl: 'modules/home-img-add/client/views/home-img-add.client.view.html'
					},
					'nav@home-img-add': { 
						templateUrl: 'modules/navigation/client/views/navigation.client.view.html' 
					},
					'footer@home-img-add': { 
						templateUrl: 'modules/footer/client/views/footer.client.view.html' 
					}
				}
			});
	}
})();
