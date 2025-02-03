

'use strict';

angular.module('home').controller('managementCtl', function ($scope, $state, $http) {

	// localStorage.removeItem('isAdmin')
	// Check if Admin is logged in
	if (!localStorage.getItem('isAdmin')) {
		$state.go('admin-login'); // Redirect to login if not logged in
	}

	$scope.placeList = [];

	var apiCall = function (url, method) {
		//console.log(method, url);
		return $http({
			method: method,
			url: url,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

	$scope.fetchPlaceList = function () {
		var getPleaceURL = '/' + $.param({ action: 'get-places' });
		// Make a request
		apiCall(getPleaceURL, 'POST').then(
			function (response) {
				// Success Callback

				for (var i = 0; i < response.data.length; i++) {
					$scope.placeList.push(response.data[i]);
				}
				$("#table-status").val("1");
				//$('#dtBasicExample').dataTable();
				setTimeout(function () {
					$("#table-status").change();
				}, 1000);
			},
			function (error) {
				// Error Callback
				console.log('ERROR: ' + error);
			}
		);
	};
	$scope.fetchPlaceList();

	$("#table-status").on('change', function () {
		//$('#tensor-table').DataTable().destroy();
		if ($(this).val() === "1") {
			$('#dtBasicExample').dataTable();
		}
	});

	$(document).on('click', '.btn-delete', function (event) {
		var cf = confirm("กรุณาคลิกปุ่ม Ok ถ้าคุณต้องการลบข้อมูลนี้");
		if (cf == true) {
			var getPleaceURL = '/' + $.param({ action: 'delete-place', pid: $(this).attr('data-pid') });
			// Make a request
			apiCall(getPleaceURL, 'POST').then(
				function (response) {
					// Success Callback
					window.location.href = "/data-management";

				},
				function (error) {
					// Error Callback
					console.log('ERROR: ' + error);
				}
			);
		}

	});

});
