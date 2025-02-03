(function () {
	'use strict';

	angular
		.module('home-v1')
		.config(routeConfig);

	routeConfig.$inject = ['$stateProvider'];

	function routeConfig($stateProvider) {
		$stateProvider
			.state('form', {
				url: '/form',
				templateUrl: 'modules/home-v1/client/views/home-v1.client.view.html'
			});
	}
})();
