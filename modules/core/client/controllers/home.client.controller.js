(function () {

	'use strict';
	angular.module('core')
	.controller('settingsCtrl', function ($http, $translate, $scope, settings) {


		$(document).on('click', '#decrease-text-size', function(event) {
			$(".place-desc").css("font-size", "14px");
			$(".place-desc").css("font-weight", "500");
		});
		$(document).on('click', '#default-text-size', function(event) {
			$(".place-desc").css("font-size", "16px");
			$(".place-desc").css("font-weight", "500");
		});

		$(document).on('click', '#increase-text-size', function(event) {
			$(".place-desc").css("font-size", "20px");
			$(".place-desc").css("font-weight", "500");
		});

		
	});

})();
