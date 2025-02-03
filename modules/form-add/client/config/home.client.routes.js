(function () {
	'use strict';

	angular
		.module('home')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('form-add', {
				url: '/form-add',
				views: {
					'': { 
						templateUrl: 'modules/form-add/client/views/form-add.client.view.html'
					},
					'nav@form-add': { 
						templateUrl: 'modules/navigation/client/views/navigation.client.view.html' 
					},
					'footer@form-add': { 
						templateUrl: 'modules/footer/client/views/footer.client.view.html' 
					}
				}
			});
	}
})();
