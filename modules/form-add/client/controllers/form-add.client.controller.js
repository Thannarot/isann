

'use strict';

angular.module('form-add').controller('inputCtl', function ($scope, $http) {
	// Check if Admin is logged in
	if (!localStorage.getItem('isAdmin')) {
		$state.go('admin-login'); // Redirect to login if not logged in
	}

	var apiCall = function (url, method) {
		//console.log(method, url);
		return $http({
			method: method,
			url: url,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

	$scope.listProvinceOptions = function () {
		var cityOptionsURL = '/' + $.param({ action: 'get-province-list' });
		// Make a request
		apiCall(cityOptionsURL, 'POST').then(
			function (response) {
				// Success Callback
				var items = response.data;
				$.each(items, function (i, item) {
					$('#pprovince').append($('<option>', {
						value: item.id_1,
						text: item.name_1
					}));
				});
			},
			function (error) {
				// Error Callback
				console.log('ERROR: ' + error);
			}
		);
	};


	$scope.listCityOptions = function () {
		const prov_id = $('#pprovince').val();
		console.log(prov_id);
		var cityOptionsURL = '/' + $.param({ action: 'get-city-list', prov_id: prov_id });
		// Make a request
		apiCall(cityOptionsURL, 'POST').then(
			function (response) {
				// Success Callback
				var items = response.data;
				$('#pcity').html('');
				$('#pcity').append('<option value="9999">ทั้งหมด</option>');
				$.each(items, function (i, item) {
					$('#pcity').append($('<option>', {
						value: item.id_2,
						text: item.name_2
					}));
				});
			},
			function (error) {
				// Error Callback
				console.log('ERROR: ' + error);
			}
		);
	};

	$scope.listTownshipOptions = function () {
		const dist_id = $('#pcity').val();
		console.log(dist_id);
		var townshipOptionsURL = '/' + $.param({ action: 'get-township-list', dist_id:dist_id });
		// Make a request
		apiCall(townshipOptionsURL, 'POST').then(
			function (response) {
				// Success Callback
				var items = response.data;
				$('#ptownship').html('');
				$('#ptownship').append('<option value="9999">ทั้งหมด</option>');
				$.each(items, function (i, item) {
					$('#ptownship').append($('<option>', {
						value: item.id_3,
						text: item.name_3
					}));
				});
			},
			function (error) {
				// Error Callback
				console.log('ERROR: ' + error);
			}
		);
	};


	$scope.listPlaceTypeOptions = function () {
		var typeOptionsURL = '/' + $.param({ action: 'get-placetype-list' });
		// Make a request
		apiCall(typeOptionsURL, 'POST').then(
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

		var data = {
			action: 'add-place',
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
			// audio: audio

		};

		var typeOptionsURL = '/' + $.param(data);
		// Make a request
		apiCall(typeOptionsURL, 'POST').then(
			function (response) {
				// Success Callback
				window.location.href = "/data-management";
			},
			function (error) {
				// Error Callback
				console.log('ERROR: ' + error);
				alert("กรุณากรอกข้อมูลให้ครบถ้วน")
			}
		);
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
