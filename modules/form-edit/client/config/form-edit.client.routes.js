(function () {
	'use strict';

	angular
		.module('home')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('form-edit', {
				url: '/form-edit/pid=:pid?',
				views: {
					'': { 
						templateUrl: 'modules/form-edit/client/views/form-edit.client.view.html'
					},
					'nav@form-edit': { 
						templateUrl: 'modules/navigation/client/views/navigation.client.view.html' 
					},
					'footer@form-edit': { 
						templateUrl: 'modules/footer/client/views/footer.client.view.html' 
					}
				}

			});
	}
})();
