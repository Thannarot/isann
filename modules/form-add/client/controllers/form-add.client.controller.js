

'use strict';

angular.module('form-add').controller('inputCtl', function ($scope, $http) {
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
	

	$scope.listProvinceOptions = function () {

		// Define endpoint and send data in body
		const endpoint = '/get-province-list';
		const data = {  };
	
		apiCall(endpoint, 'POST', data).then(
			function (response) {
				const items = Array.isArray(response.data) ? response.data : [];
	
				const $townshipSelect = $('#pprovince');
				$townshipSelect.html('');
				$townshipSelect.append('<option value="">ทั้งหมด</option>');
	
				$.each(items, function (i, item) {
					$townshipSelect.append(
						$('<option>', {
							value: item.id_1,
							text: item.name_1
						})
					);
				});
			},
			function (error) {
				console.error('Failed to load townships:', error);
			}
		);
	};
	
	// $scope.listProvinceOptions = function () {
	// 	var cityOptionsURL = '/' + $.param({ action: 'get-province-list' });
	// 	// Make a request
	// 	apiCall(cityOptionsURL, 'POST').then(
	// 		function (response) {
	// 			// Success Callback
	// 			var items = response.data;
	// 			$.each(items, function (i, item) {
	// 				$('#pprovince').append($('<option>', {
	// 					value: item.id_1,
	// 					text: item.name_1
	// 				}));
	// 			});
	// 		},
	// 		function (error) {
	// 			// Error Callback
	// 			console.log('ERROR: ' + error);
	// 		}
	// 	);
	// };

	// $scope.listCityOptions = function () {
	// 	const prov_id = $('#pprovince').val();
	// 	console.log(prov_id);
	// 	var cityOptionsURL = '/' + $.param({ action: 'get-city-list', prov_id: prov_id });
	// 	// Make a request
	// 	apiCall(cityOptionsURL, 'POST').then(
	// 		function (response) {
	// 			// Success Callback
	// 			var items = response.data;
	// 			$('#pcity').html('');
	// 			$('#pcity').append('<option value="">ทั้งหมด</option>');
	// 			$.each(items, function (i, item) {
	// 				$('#pcity').append($('<option>', {
	// 					value: item.id_2,
	// 					text: item.name_2
	// 				}));
	// 			});
	// 		},
	// 		function (error) {
	// 			// Error Callback
	// 			console.log('ERROR: ' + error);
	// 		}
	// 	);
	// };

	$scope.listCityOptions = function () {
		const prov_id = $('#pprovince').val();
		if (!prov_id) {
			console.warn("No township selected. Skipping township fetch.");
			return;
		}
	
		// Define endpoint and send data in body
		const endpoint = '/get-city-list';
		const data = { prov_id: prov_id };
	
		apiCall(endpoint, 'POST', data).then(
			function (response) {
				const items = Array.isArray(response.data) ? response.data : [];
	
				const $select = $('#pcity');
				$select.html('');
				$select.append('<option value="">ทั้งหมด</option>');
	
				$.each(items, function (i, item) {
					$select.append(
						$('<option>', {
							value: item.id_2,
							text: item.name_2
						})
					);
				});
			},
			function (error) {
				console.error('Failed to load townships:', error);
			}
		);
	};

	// $scope.listTownshipOptions = function () {
	// 	const dist_id = $('#pcity').val();
	// 	console.log(dist_id);
	// 	var townshipOptionsURL = '/' + $.param({ action: 'get-township-list', dist_id:dist_id });
	// 	// Make a request
	// 	apiCall(townshipOptionsURL, 'POST').then(
	// 		function (response) {
	// 			// Success Callback
	// 			var items = response.data;
	// 			$('#ptownship').html('');
	// 			$('#ptownship').append('<option value="">ทั้งหมด</option>');
	// 			$.each(items, function (i, item) {
	// 				$('#ptownship').append($('<option>', {
	// 					value: item.id_3,
	// 					text: item.name_3
	// 				}));
	// 			});
	// 		},
	// 		function (error) {
	// 			// Error Callback
	// 			console.log('ERROR: ' + error);
	// 		}
	// 	);
	// };

	$scope.listTownshipOptions = function () {
		const dist_id = $('#pcity').val();
		if (!dist_id) {
			console.warn("No district selected. Skipping township fetch.");
			return;
		}
		// Define endpoint and send data in body
		const endpoint = '/get-township-list';
		const data = { dist_id: dist_id };
	
		apiCall(endpoint, 'POST', data).then(
			function (response) {
				const items = Array.isArray(response.data) ? response.data : [];
	
				const $select = $('#ptownship');
				$select.html('');
				$select.append('<option value="">ทั้งหมด</option>');
	
				$.each(items, function (i, item) {
					$select.append(
						$('<option>', {
							value: item.id_3,
							text: item.name_3
						})
					);
				});
			},
			function (error) {
				console.error('Failed to load townships:', error);
			}
		);
	};


	$scope.listPlaceTypeOptions = function () {
		// var typeOptionsURL = '/' + $.param({ action: 'get-placetype-list' });
		// Make a request
		apiCall('get-placetype-list', 'POST', {}).then(
			function (response) {
				// Success Callback
				var items = response.data;
				$.each(items, function (i, item) {
					$('#ptype_selector').append($('<option>', {
						value: item.tid,
						text: item.name_th
					}));
				});
			},
			function (error) {
				// Error Callback
				console.log('ERROR: ' + error);
			}
		);
	};


	$scope.listProvinceOptions();
	$scope.listCityOptions();
	$scope.listTownshipOptions();
	$scope.listPlaceTypeOptions();


	$("#form_input_submit_btn").click(function () {
		var pname = $("#pname").val();
		var plat = $("#plat").val();
		var plng = $("#plng").val();
		var desc = $("#pdesc").val();
		var entrance_fee = $("#pentranfee").val();
		var store = $("#pshop").val();
		var cellular_net = $("#pcell").val();
		var travel = $("#ptravel").val();
		var agency = $("#pagency").val();
		var plocation = $("#plocation").val();
		var gmap = $("#pmap").val();
		var infosource = $("#pinfosource").val();
		var photosource = $("#pphotosource").val();
		var extralink = $("#pextrasource").val();
		var facilities = $("#pfacilities").val();
		var contactinfo = $("#pcontact").val();
		var ptype = $("#ptype_selector option:selected").val();
		var adm1 = $("#pprovince option:selected").val();
		var adm2 = $("#pcity option:selected").val();
		var adm3 = $("#ptownship option:selected").val();
		var rating = $("#rating").val();
		var imgfeatured = $("#imgfeatured").val();
		var facilities_list = $("#facilities_selects").val();
		var video = $("#pvideo").val();
		var photo1 = $("#photo1").val();
		var photo2 = $("#photo2").val();
		var photo3 = $("#photo3").val();
		var photo4 = $("#photo4").val();
		var photo5 = $("#photo5").val();
		var photo6 = $("#photo6").val();
		var photo7 = $("#photo7").val();
		var photo8 = $("#photo8").val();
		var photo9 = $("#photo9").val();
		var photo10 = $("#photo10").val();
		var data = {
			pname: pname,
			plat: plat,
			plng: plng,
			desc: desc,
			entrance_fee: entrance_fee,
			store: store,
			cellular_net: cellular_net,
			travel: travel,
			agency: agency,
			plocation: plocation,
			gmap: gmap,
			infosource: infosource,
			photosource: photosource,
			extralink: extralink,
			facilities: facilities,
			contactinfo: contactinfo,
			ptype: ptype,
			adm1: adm1,
			adm2: adm2,
			adm3: adm3,
			rating: rating,
			imgfeatured: imgfeatured,
			facilitiesList: facilities_list.toString(),
			video: video,
			photo1: photo1,
			photo2: photo2,
			photo3: photo3,
			photo4: photo4,
			photo5: photo5,
			photo6: photo6,
			photo7: photo7,
			photo8: photo8,
			photo9: photo9,
			photo10: photo10
			// audio: audio

		};

		apiCall('/add-place', 'POST', data).then(
			function (response) {
				window.location.href = "/data-management";
			},
			function (error) {
				console.log('ERROR: ' + error);
				alert("กรุณากรอกข้อมูลให้ครบถ้วน");
			}
		);

		// var typeOptionsURL = '/' + $.param(data);
		// // Make a request
		// apiCall(typeOptionsURL, 'POST').then(
		// 	function (response) {
		// 		// Success Callback
		// 		window.location.href = "/data-management";
		// 	},
		// 	function (error) {
		// 		// Error Callback
		// 		console.log('ERROR: ' + error);
		// 		alert("กรุณากรอกข้อมูลให้ครบถ้วน")
		// 	}
		// );
	});

	$("#form_input_cancel").click(function () {
		window.location.href = "/data-management";
	});

	$('#pprovince').change(function () {
		$scope.listCityOptions();
	});

	$('#pcity').change(function () {
		$scope.listTownshipOptions();
	});

	$('#ptype_selector').change(function () {
		if ($(this).val() === "1") {
			$("#input-entrance_fee").css("display", "block");
			$("#input-shop").css("display", "block");
			$("#input-cellular").css("display", "block");
			$("#input-agency").css("display", "block");
			$("#pentranfee").val('ไม่ระบุ');
			$("#pshop").val('ไม่ระบุ');
			$("#pcell").val('ไม่ระบุ');
			$("#pagency").val('ไม่ระบุ');
		} else {
			$("#input-entrance_fee").css("display", "none");
			$("#input-shop").css("display", "none");
			$("#input-cellular").css("display", "none");
			$("#input-agency").css("display", "none");
			$("#pentranfee").val('ไม่ระบุ');
			$("#pshop").val('ไม่ระบุ');
			$("#pcell").val('ไม่ระบุ');
			$("#pagency").val('ไม่ระบุ');
		}
	});
	$(document).ready(function () {
		$('.js-example-basic-multiple').select2();
	});


});
