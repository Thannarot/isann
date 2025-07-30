

'use strict';

angular.module('core').controller('inputHomeImgCtl', function ($scope, $http) {
	// Check if Admin is logged in
	if (!localStorage.getItem('isAdmin')) {
		$state.go('admin-login'); // Redirect to login if not logged in
	}

	var apiCall = function (url, method, data) {
		return $http({
			method: method,
			url: url,
			data: data,
			headers: { 'Content-Type': 'application/json' }
		});
	};
	

	$("#form_input_submit_btn").click(function () {
		var imgLink = $("#imglink").val();
		var status = $("#status option:selected").val();
		var data = {
			link: imgLink,
			status: status
		};

		apiCall('/add-home-img', 'POST', data).then(
			function (response) {
				window.location.href = "/data-management";
			},
			function (error) {
				console.log('ERROR: ' + error);
				alert("กรุณากรอกข้อมูลให้ครบถ้วน");
			}
		);
	});

	$("#form_input_cancel").click(function () {
		window.location.href = "/data-management";
	});


});
