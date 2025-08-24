

'use strict';

angular.module('form-edit').controller('formEditCtl', function ($scope, $state, $http) {

	// Check if Admin is logged in
	if (!localStorage.getItem('isAdmin')) {
		$state.go('admin-login'); // Redirect to login if not logged in
	}

	var tid = "";
	var pprovince = "";
	var pcity = "";
	var ptownship = "";
	var apiCall = function (url, method, data) {
		return $http({
			method: method,
			url: url,
			data: data,
			headers: { 'Content-Type': 'application/json' }
		});
	};

	$scope.listProvinceOptions = function () {
		// Make a request
		apiCall('get-province-list', 'POST', {}).then(
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
		const prov_id = $("#pprovince option:selected").val();
		// Make a request
		apiCall('get-city-list', 'POST', {prov_id: prov_id}).then(
			function (response) {
				// Success Callback
				var items = response.data;
				$('#pcity').html('');
				$('#pcity').append('<option value="">ทั้งหมด</option>');
				$.each(items, function (i, item) {
					$('#pcity').append($('<option>', {
						value: item.id_2,
						text: item.name_2
					}));
				});
				$('#pcity option[value="' + pcity + '"]').attr("selected", "selected").change();
			},
			function (error) {
				// Error Callback
				console.log('ERROR: ' + error);
			}
		);
	};

	$scope.listTownshipOptions = function () {
		const dist_id = $('#pcity').val();
		// Make a request
		apiCall('get-township-list', 'POST', {dist_id: dist_id}).then(
			function (response) {
				// Success Callback
				var items = response.data;
				$('#ptownship').html('');
				$('#ptownship').append('<option value="">ทั้งหมด</option>');
				$.each(items, function (i, item) {
					$('#ptownship').append($('<option>', {
						value: item.id_3,
						text: item.name_3
					}));
				});
				$('#ptownship option[value="' + ptownship + '"]').attr("selected", "selected");
			},
			function (error) {
				// Error Callback
				console.log('ERROR: ' + error);
			}
		);
	};


	$scope.listPlaceTypeOptions = function () {
		apiCall('get-placetype-list', 'POST').then(
		  function (response) {
			const items = Array.isArray(response.data) ? response.data : [];
	  
			// Build: { group: { subgroups: { [subgroup]: item[] }, ungrouped: item[] } }
			const groups = {};
			items.forEach((it) => {
			  const g = (it.group || 'อื่น ๆ').trim();
			  const sg = it.subgroup && String(it.subgroup).trim() ? String(it.subgroup).trim() : null;
	  
			  if (!groups[g]) groups[g] = { subgroups: {}, ungrouped: [] };
			  if (sg) {
				if (!groups[g].subgroups[sg]) groups[g].subgroups[sg] = [];
				groups[g].subgroups[sg].push(it);
			  } else {
				groups[g].ungrouped.push(it);
			  }
			});
	  
			const $sel = $('#ptype_selector');
			$sel.empty();
	  
			Object.keys(groups).forEach((groupName) => {
			  const node = groups[groupName];
			  const $group = $('<optgroup>', { label: groupName });
	  
			  // Each subgroup → subtitle row from res.subgroup, then its options
			  Object.keys(node.subgroups).forEach((subName) => {
				// Subtitle from API's subgroup value
				$group.append(
				  $('<option>', {
					text: `— ${subName} —`,
					disabled: true
				  }).attr({
					'data-meta': 'subgroup-title',
					'data-group': groupName,
					'data-subgroup': subName
				  })
				);
	  
				node.subgroups[subName].forEach((item) => {
				  $group.append(
					$('<option>', {
					  value: item.tid,
					  // Indent child options under the subtitle
					  text: `\u00A0\u00A0• ${item.name_th}`
					}).attr({
					  'data-group': groupName,
					  'data-subgroup': subName
					})
				  );
				});
			  });
	  
			  // Items with no subgroup
			  if (node.ungrouped.length) {
				$group.append(
				  $('<option>', {
					text: '——',
					disabled: true
				  }).attr({
					'data-meta': 'subgroup-title',
					'data-group': groupName,
					'data-subgroup': ''
				  })
				);
				node.ungrouped.forEach((item) => {
				  $group.append(
					$('<option>', {
					  value: item.tid,
					  text: `\u00A0\u00A0• ${item.name_th}`
					}).attr({
					  'data-group': groupName,
					  'data-subgroup': ''
					})
				  );
				});
			  }
	  
			  $sel.append($group);
			});
		  },
		  function (error) {
			console.error('ERROR:', error);
		  }
		);
	  };

	$scope.listProvinceOptions();

	$('#pprovince').change(function () { 
		$scope.listCityOptions();
	});
	$('#pcity').change(function () {
		$scope.listTownshipOptions();
	});
	// $scope.listCityOptions();
	// $scope.listTownshipOptions();
	$scope.listPlaceTypeOptions();

	$(document).ready(function () {
		$('.js-example-basic-multiple').select2();
	});

	var urlParams = window.location.pathname;
	urlParams = urlParams.split("/")[2]
	var pid = urlParams.split("=")[1]
	// Make a request
	apiCall('/get-detail', 'POST', {pid: pid}).then(
		function (response) {
			// Success Callback
			var items = response.data[0];
			$("#pname").val(items["name"]);
			$("#plat").val(items["lat"]);
			$("#plng").val(items["lng"]);
			$("#pdesc").val(items["description"]);
			$("#pentranfee").val(items["entrance_fee"]);
			$("#pshop").val(items["store"]);
			$("#pcell").val(items["cellular_net"]);
			$("#ptravel").val(items["travel"]);
			$("#pagency").val(items["agency"]);
			$("#plocation").val(items["location"]);
			$("#pmap").val(items["gmap"]);
			$("#pinfosource").val(items["infosource"]);
			$("#pphotosource").val(items["photosource"]);
			$("#pextrasource").val(items["extralink"]);
			$("#pfacilities").val(items["facilities"]);
			$("#pcontact").val(items["contactinfo"]);
			$("#imgfeatured").val(items["imgfeatured"]);
			$("#pvideo").val(items["video"]);
			$("#photo1").val(items["photo1"]);
			$("#photo2").val(items["photo2"]);
			$("#photo3").val(items["photo3"]);
			$("#photo4").val(items["photo4"]);
			$("#photo5").val(items["photo5"]);
			$("#photo6").val(items["photo6"]);
			$("#photo7").val(items["photo7"]);
			$("#photo8").val(items["photo8"]);
			$("#photo9").val(items["photo9"]);
			$("#photo10").val(items["photo10"]);
			// $("#paudio").val(items["audio"]);
			tid = items["tid"];
			pprovince = items["id_1"];
			pcity = items["adm2"];
			ptownship = items["adm3"];
			var prating = items["rating"];
			$('#ptype_selector option[value="' + tid + '"]').attr("selected", "selected");
			$('#pprovince option[value="' + pprovince + '"]').attr("selected", "selected").change();
			$('#prating option[value="' + prating + '"]').attr("selected", "selected");

			if (items["facilities_list"] !== null) {
				var facilitiesList = items["facilities_list"].split(",");
				for (var i = 0; i < facilitiesList.length; i++) {
					$('#facilities_selects option[value="' + facilitiesList[i] + '"]').attr("selected", "selected").trigger('change');
				}
			}
		},
		function (error) {
			// Error Callback
			console.log('ERROR: ' + error);
		}
	);

	$("#form_edit_submit_btn").click(function () {

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
		var rating = $("#prating").val();
		var imgfeatured = $("#imgfeatured").val();
		var facilities_list = $("#facilities_selects").val();
		// var audio = $("#paudio").val();
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
			pid: pid,
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
		};

		// Make a request
		apiCall('edit-place', 'POST', data).then(
			function (response) {
				// Success Callback
				window.location.href = "/data-management";

			},
			function (error) {
				// Error Callback
				console.log('ERROR: ' + error);
			}
		);
	});

	$("#form_edit_cancel").click(function () {
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
		} else {
			$("#input-entrance_fee").css("display", "none");
			$("#input-shop").css("display", "none");
			$("#input-cellular").css("display", "none");
			$("#input-agency").css("display", "none");
		}

	});


});
