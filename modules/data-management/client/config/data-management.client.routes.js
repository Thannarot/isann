(function () {
	'use strict';

	angular
		.module('home')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('admin-login', {
				url: '/admin-login',
				views: {
					'': { 
						templateUrl: 'modules/data-management/client/views/admin-login.client.view.html',
					},
					'nav@admin-login': { 
						templateUrl: 'modules/navigation/client/views/navigation.client.view.html' 
					},
					'footer@admin-login': { 
						templateUrl: 'modules/footer/client/views/footer.client.view.html' 
					}
				},
				controller: 'AdminLoginController'
			})
			.state('data-management', {
				url: '/data-management',
				views: {
					'': { 
						templateUrl: 'modules/data-management/client/views/data-management.client.view.html'
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
