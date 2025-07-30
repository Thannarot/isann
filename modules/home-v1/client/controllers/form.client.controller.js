

'use strict';

angular.module('home').controller('inputCtl', function ($scope, $http) {


	$scope.rssFeeds = [];


	/**
	 * RSS Feed
	 */
	var apiCall = function (url, method) {
		//console.log(method, url);
		return $http({
			method: method,
			url: url,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

	$scope.listCityOptions = function () {
		var cityOptionsURL = '/' + $.param({ action: 'get-city-list' });
		// Make a request
		apiCall(cityOptionsURL, 'POST').then(
			function (response) {
				// Success Callback
				var items = response.data;
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
		var townshipOptionsURL = '/' + $.param({ action: 'get-township-list' });
		// Make a request
		apiCall(townshipOptionsURL, 'POST').then(
			function (response) {
				// Success Callback
				var items = response.data;
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
		apiCall('get-placetype-list', 'POST', {}).then(
			function (response) {
				const items = response.data;
				const grouped = {};
	
				// Group items by `group` field
				items.forEach(item => {
					if (!grouped[item.group]) {
						grouped[item.group] = [];
					}
					grouped[item.group].push(item);
				});
	
				// Clear existing options
				$('#ptype_selector').empty();
	
				// Create optgroups
				for (const [groupName, options] of Object.entries(grouped)) {
					const $optgroup = $('<optgroup>', { label: groupName });
	
					options.forEach(item => {
						$optgroup.append($('<option>', {
							value: item.tid,
							text: item.name_th
						}));
					});
	
					$('#ptype_selector').append($optgroup);
				}
			},
			function (error) {
				console.error('ERROR: ' + error);
			}
		);
	};


	$scope.listCityOptions();
	$scope.listTownshipOptions();
	$scope.listPlaceTypeOptions();


	$("#form_submit_btn").click(function () {
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
		var ptype = $("#ptype_selector").val();
		var adm2 = $("#pcity").val();
		var adm3 = $("#ptownship").val();

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
			adm3: adm3
		};

		var typeOptionsURL = '/' + $.param(data);
		// Make a request
		apiCall(typeOptionsURL, 'POST').then(
			function (response) {
				// Success Callback

			},
			function (error) {
				// Error Callback
				console.log('ERROR: ' + error);
			}
		);
	});


	$('#ptype_selector').change(function () {
		if ($(this).val() === "1") {
			$("#input-entrance_fee").css("display", "block");
			$("#input-shop").css("display", "block");
			$("#input-cellular").css("display", "block");
			$("#input-agency").css("display", "block");
		} else {
			$("#input-entrance_fee").css("display", "none");
			$("#input-shop").css("display", "none");
			$("#input-cellular").css("display", "none");
			$("#input-agency").css("display", "none");
		}

	});


});
