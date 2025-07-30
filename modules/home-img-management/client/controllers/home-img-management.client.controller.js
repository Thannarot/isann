

'use strict';

angular.module('home').controller('homeImgManagementCtl', function ($scope, $state, $http) {
	// localStorage.removeItem('isAdmin')
	// Check if Admin is logged in
	if (!localStorage.getItem('isAdmin')) {
		$state.go('admin-login'); // Redirect to login if not logged in
	}
	$scope.HomeImgs = [];

	var apiCall = function (url, method, data) {
		return $http({
			method: method,
			url: url,
			data: data,
			headers: { 'Content-Type': 'application/json' }
		});
	};
	$scope.fetchHomeImgs = function () {
		// Make a request
		apiCall('/get-home-imgs', 'POST', {}).then(
			function (response) {
				// Success Callback

				for (var i = 0; i < response.data.length; i++) {
					$scope.HomeImgs.push(response.data[i]);
				}
				$("#table-status").val("1");
				console.log("Home Images fetched successfully:", $scope.HomeImgs); // Debug log
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
	$scope.fetchHomeImgs();

	$("#table-status").on('change', function () {
		//$('#tensor-table').DataTable().destroy();
		if ($(this).val() === "1") {
			$('#dtBasicExample').dataTable();
		}
	});

	$(document).on('click', '.btn-delete', function (event) {
		var cf = confirm("กรุณาคลิกปุ่ม Ok ถ้าคุณต้องการลบข้อมูลนี้");
		if (cf == true) {
			var deleteImgURL = '/' + $.param({ action: 'delete-home-img', id: $(this).attr('data-id') });
			// Make a request
			apiCall(deleteImgURL, 'POST').then(
				function (response) {
					// Success Callback
					window.location.href = "/home-img-management";
				},
				function (error) {
					// Error Callback
					console.log('ERROR: ' + error);
				}
			);
		}
	});
});
