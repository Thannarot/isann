

'use strict';

angular.module('core').controller('mapCtrl', function ($scope, $http) {
	$scope.rssFeeds = [];

	var apiCall = function (url, method, data) {
		return $http({
			method: method,
			url: url,
			data: data,
			headers: { 'Content-Type': 'application/json' }
		});
	};

	// Helper function to extract photo ID and build display URL
	function transformDriveUrl(url) {
		try {
			const idMatch = url.match(/id=([^&]+)/);
			if (idMatch && idMatch[1]) {
				return `https://lh3.googleusercontent.com/d/${idMatch[1]}=s1290`;
			}
		} catch (e) {
			console.warn('Invalid photo URL:', url);
		}
		return ''; // fallback
	}


	$scope.listProvinceOptions = function () {
		// Make a request
		apiCall('/get-province-list', 'POST', {}).then(
			function (response) {
				// Success Callback
				var items = response.data;
				$.each(items, function (i, item) {
					$('#province_selector').append($('<option>', {
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
		const prov_id = $('#province_selector').val();
		// Make a request
		apiCall('/get-city-list', 'POST', { prov_id: prov_id }).then(
			function (response) {
				// Success Callback
				var items = response.data;
				$('#city_selector').html('');
				$('#city_selector').append('<option value="">ทั้งหมด</option>');
				$.each(items, function (i, item) {
					$('#city_selector').append($('<option>', {
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
		const dist_id = $('#city_selector').val();
		// Make a request
		apiCall('/get-township-list', 'POST', { dist_id: dist_id }).then(
			function (response) {
				// Success Callback
				var items = response.data;
				$('#township_selector').html('');
				$('#township_selector').append('<option value="">ทั้งหมด</option>');
				$.each(items, function (i, item) {
					$('#township_selector').append($('<option>', {
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
		// Make a request
		apiCall('/get-placetype-list', 'POST', {}).then(
			function (response) {
				// Success Callback
				var items = response.data;
				$.each(items, function (i, item) {
					$('#type_selector').append($('<option>', {
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

	mapboxgl.accessToken = 'pk.eyJ1IjoidGhhbm5hcm90IiwiYSI6ImNrOXFzZjgzcjA2OTczZXFrbXV4Z3lzejUifQ.4CmrqCen0XTYYYCjcWGrzg';
	var map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v11',
		zoom: 6,
		center: [103.226720, 16.617660]
	});

	if ("geolocation" in navigator) {
		navigator.geolocation.getCurrentPosition(position => {
			$("#geo-lat").val(position.coords.latitude);
			$("#geo-lng").val(position.coords.longitude);
			// var map = new mapboxgl.Map({
			//   container: 'map',
			//   style: 'mapbox://styles/mapbox/light-v10',
			//   center: [position.coords.longitude, position.coords.latitude],
			//  zoom: 14
			// });
		});
	} else {
		console.log("Geolocation is not available")
	}


	$scope.createPleaceList = function (response) {
		$("#tableList").html('');
		$(".marker").remove();
		$("#found-no").text("ทั้งหมด " + response.data.length);
		for (var i = 0; i < response.data.length; i++) {
			var pid = response.data[i]["pid"];
			var placeName = response.data[i]["name"];
			var placeLocation = response.data[i]["location"];
			var lng = response.data[i]["lng"];
			var lat = response.data[i]["lat"];
			var placetype = response.data[i]["tid"];
			var imgfeatured = transformDriveUrl(response.data[i]["imgfeatured"]);
			// create a HTML element for each feature
			var el = document.createElement('div');

			if (placetype === 1) {
				el.className = 'marker marker-tourist';
			} else if (placetype === 2) {
				el.className = 'marker marker-hotel';
			} else if (placetype === 3) {
				el.className = 'marker marker-educational_center';
			} else if (placetype === 4) {
				el.className = 'marker marker-coffee';
			} else if (placetype === 5) {
				el.className = 'marker marker-shopping';
			} else if (placetype === 6) {
				el.className = 'marker marker-resturent';
			} else if (placetype === 7) {
				el.className = 'marker marker-health';
			} else if (placetype === 8) {
				el.className = 'marker marker-farm';
			}
			// make a marker for each feature and add to the map
			new mapboxgl.Marker(el)
				.setLngLat([lng, lat])
				.setPopup(
					new mapboxgl.Popup({ offset: 25 }) // add popups
						.setHTML(
							'<h3>' +
							placeName +
							'</h3><p>' +
							placeLocation +
							'</p>'
						)
				)
				.addTo(map);

			$("#tableList").append('<li>' +
				'<a href="#" class="liPlaceName" data-pid="' + pid + '">' +
				'<div class="row">' +
				'<div class="col-sm-4"><img src="' + imgfeatured + '" alt="" style="width:100px;"></div>' +
				'<div class="col-sm-8">' +
				'<p class="place-name-list">' + placeName + '</p>' +
				'<p class="place-location-list">' + placeLocation + '</p>' +
				'</div>' +
				'</div>' +
				'</a>' +
				'</li>')
		}
	}

	$scope.fetchPlaceList = function () {
		// Make a request
		apiCall('/get-places', 'POST', {}).then(
			function (response) {
				// Success Callback
				$scope.createPleaceList(response);
			},
			function (error) {
				// Error Callback
				console.log('ERROR: ' + error);
			}
		);
	};

	$scope.filterPlaceList = function () {
		// Make a request
		apiCall('/filter-place', 'POST', {}).then(
			function (response) {
				// Success Callback
				$scope.createPleaceList(response);
			},
			function (error) {
				// Error Callback
				console.log('ERROR: ' + error);
			}
		);
	};

	$scope.fetchPlaceList();

	$('#slider-distance').ionRangeSlider({
		skin: "round",
		type: "single",
		min: 0,
		max: 500,
		grid: true,
		from: 500
	});

	$('#slider-rating').ionRangeSlider({
		skin: "round",
		type: "single",
		min: 0,
		max: 5,
		grid: true,
		from: 5
	});

	var distanceSlider = document.getElementById('slider-distance');

	$('#province_selector').change(function () {
		$scope.listCityOptions();
	});

	$('#city_selector').change(function () {
		$scope.listTownshipOptions();
	});

	$('#zoom-in').click(function () {
		var zl = map.getZoom();
		map.setZoom(zl + 1);
	});
	$('#zoom-out').click(function () {
		var zl = map.getZoom();
		map.setZoom(zl - 1);
	});
	$('#streets-v11').click(function () {
		map.setStyle('mapbox://styles/mapbox/streets-v11');
		$(this).addClass('active');
		$('#light-v10').removeClass('active');
		$('#dark-v10').removeClass('active');
		$('#satellite-v9').removeClass('active');
	});
	$('#light-v10').click(function () {
		map.setStyle('mapbox://styles/mapbox/light-v10');
		$(this).addClass('active');
		$('#dark-v10').removeClass('active');
		$('#streets-v11').removeClass('active');
		$('#satellite-v9').removeClass('active');
	});
	$('#dark-v10').click(function () {
		map.setStyle('mapbox://styles/mapbox/dark-v10');
		$(this).addClass('active');
		$('#light-v10').removeClass('active');
		$('#streets-v11').removeClass('active');
		$('#satellite-v9').removeClass('active');
	});
	$('#satellite-v9').click(function () {
		map.setStyle('mapbox://styles/mapbox/satellite-v9');
		$(this).addClass('active');
		$('#streets-v11').removeClass('active');
		$('#light-v10').removeClass('active');
		$('#dark-v10').removeClass('active');
	});


	$('.branding').click(function () {
		$("#menuSidenav").css("width", "300px");
		$(".main").css("marginLeft", "300px");
	});
	$('#table-open').click(function () {
		$("#sidenav-table").css("width", "350px");
	});

	$('#menu-close-btn').click(function () {
		$("#menuSidenav").css("width", "0px");
		$(".main").css("marginLeft", "0px");
	});

	$('#table-close').click(function () {
		$("#sidenav-table").css("width", "0px");
		$(".detail-right").css("right", "0px");
	});

	$('#detail-close').click(function () {
		$("#detail-panel").css("width", "0px");
	});

	$("#table-open").click();

	$("#filter-btn").click(function () {
		var pname = $("#pname").val();
		var ptype = $("#type_selector").val();
		var distance = $("#slider-distance").val();
		var rating = $("#slider-rating").val();
		var adm1 = $("#province_selector").val();
		var adm2 = $("#city_selector").val();
		var adm3 = $("#township_selector").val();
		var geolocate_lat = $("#geo-lat").val();
		var geolocate_lng = $("#geo-lng").val();

		var data = {
			pname: pname,
			distance: distance,
			rating: rating,
			ptype: ptype,
			adm1: adm1,
			adm2: adm2,
			adm3: adm3,
			geolocate_lat: geolocate_lat,
			geolocate_lng: geolocate_lng,
		};

		// Make a request
		apiCall('/filter-place', 'POST', data)
			.then(function (response) {
				// Success Callback
				$scope.createPleaceList(response);
			})
			.catch(function (error) {
				// Error Callback
				console.log('ERROR: ' + error);
			});
	});


	$("#filter-all-btn").click(function () {
		$scope.fetchPlaceList();
	});


	$(document).on('click', '.liPlaceName', function (event) {
		$('#menu-close-btn').click();
		event.preventDefault();
		// Make a request
		apiCall('/get-detail', 'POST', { pid: $(this).attr('data-pid') }).then(
			function (response) {
				// Success Callback
				var items = response.data[0];
				map.flyTo({ center: [items["lng"], items["lat"]], zoom: 16 });

				// Add big image and thumbnail gallery
				var photoPreviewHtml = `
				<div class="col-sm-12">
					<img id="main-photo" src="${transformDriveUrl(items.photo1)}" style="width:100%; height:400px; object-fit:cover; border-radius:8px; margin-bottom:15px;" />
				</div>
				<div class="col-sm-12" style="display:flex; gap:10px; flex-wrap:wrap; margin-bottom:20px;">`;

				for (var i = 1; i <= 10; i++) {
				var rawUrl = items["photo" + i];
				if (rawUrl && rawUrl !== "undefined") {
					var photoUrl = transformDriveUrl(rawUrl);
					photoPreviewHtml += `<img src="${photoUrl}" class="thumbnail-img" style="width:100px; height:60px; object-fit:cover; cursor:pointer; border-radius:5px;" onclick="document.getElementById('main-photo').src='${photoUrl}'" />`;
				}
				}

				photoPreviewHtml += '</div>';


				var videoBlock = '';
				const videoUrl = items["video"];

				if (videoUrl && videoUrl !== 'undefined' && videoUrl.trim() !== '') {
					let embedUrl = '';

					try {
						// Handle YouTube links
						if (videoUrl.includes('youtube.com') || videoUrl.includes('youtu.be')) {
							let youtubeId = '';

							if (videoUrl.includes('youtu.be')) {
								youtubeId = videoUrl.split('/').pop();
							} else {
								const urlObj = new URL(videoUrl);
								youtubeId = urlObj.searchParams.get("v");
							}

							if (youtubeId) {
								embedUrl = `https://www.youtube.com/embed/${youtubeId}`;
							}
						}

						// Handle Google Drive links
						else if (videoUrl.includes('drive.google.com')) {
							const match = videoUrl.match(/[-\w]{25,}/);
							if (match && match[0]) {
								const fileId = match[0];
								embedUrl = `https://drive.google.com/file/d/${fileId}/preview`;
							}
						}

						// Embed if valid
						if (embedUrl) {
							videoBlock = `
		<div class="col-sm-12" style="margin-bottom: 20px;">
			<iframe width="100%" height="400"
				src="${embedUrl}"
				frameborder="0"
				allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
				allowfullscreen>
			</iframe>
		</div>
	`;
						}
					} catch (err) {
						console.error("Error parsing video URL:", err);
					}
				}

				$(".table-detail").html(
					'<div class="row" style="margin-bottom: 150px;">' +
					// '<div class="flex">' +
					// '<div class="col-sm-12">' +
					// '<p>ปรับขนาดตัวอักษร</p>'+
					// '<button id="decrease-text-size" class="btn btn-sm btn-default text-size"> - </button>' +
					// '<button id="default-text-size" class="btn btn-sm btn-default text-size">ปกติ</button>' +
					// '<button id="increase-text-size" class="btn btn-sm btn-default text-size">+</button>' +
					// '</div>' +
					// '</div>' +
					'<div class="col-sm-12">' +
					'<p class= "place-name" > ' + items["name"] + '</p >' +
					'<p class="place-desc"><b>สถานที่ตั้ง:</b> ' + items["location"] + '</p>' +
					'<p class="place-desc"><b>พิกัด:</b> ' + items["lat"] + ', ' + items["lng"] + '</p>' +
					'</div > ' +
					'<div class="col-sm-12"><img src="' + transformDriveUrl(items["imgfeatured"]) + '" alt="" style="height:350px;margin-bottom: 20px;"></div>' +
					// '<div class="col-sm-12"><p style="font-size: 12px;">ที่มาของรูป: '+items["imgfeatured"]+'</p></div>'+
					'<div class="col-sm-12">' +
					videoBlock +

					'<p class="place-desc"><b>ความเป็นมา:</b> ' + items["description"] + '</p>' +
					'<p class="place-desc"><b>สิ่งอำนวยความสะดวก:</b></p>' +
					'<div class="col-sm-12">' +
					'<select class="js-example-basic-multiple" id="facilities_selects" name="facilities_selects[]" multiple="multiple" style="width: 100%;margin-bottom:15px;" disabled>' +
					'<option value="01">มีที่จอดรถ</option>' +
					'<option value="02">ทางลาดยาว ความชันไม่เกิน 4.76 องศาและมีราวจับ</option>' +
					'<option value="03">ห้องน้ำและห้องส้วม สามารถเปิดปิดได้ง่ายและมีราวจับ</option>' +
					'<option value="04">ห้องน้ำและห้องส้วม พื้นไม่ลื่น</option>' +
					'<option value="05">มีป้ายสัญลักษณ์ชัดเจน มองเห็นได้ง่าย</option>' +
					'<option value="06">มีที่นั่งพัก ทุกระยะ 200เมตร</option>' +
					'<option value="07">มีบริการที่เก้าอี้เข็น</option>' +
					'<option value="08">มียาสามัญประจำบ้าน อุปกรณ์ปฐมพยาบาลสำหรับผู้สูงอายุ ที่ไม่หมดอายุและจัดเตรียมไว้ในจุดที่เหมาะสม</option>' +
					'<option value="09">มีตำแหน่งใกล้กับสถานพยาบาลสมารถให้บริการได้อย่างมีประสิทธิภาพและรวดเร็ว</option>' +
					'<option value="10">มีหน่วยพยาบาล ห้องพยาบาล</option>' +
					'<option value="11">มีบริการเคลื่อนย้ายผู้สูงอายุ</option>' +
					'<option value="12">มีลิฟต์ หรือบันได้ที่อำนวยความสะดวก</option>' +
					'<option value="13">มีการเข้าถึงอินเตอร์เน็ต</option>' +
					'<option value="14">มีห้องพักใกล้บันไดหนีไฟ หรือลิฟต์</option>' +
					'<option value="15">ห้องพักมีสัญญานบอกเหตุ หรือเตือนภัย</option>' +
					'</select>' +
					'</div>' +

					'<p class="place-desc"><b>สิ่งอำนวยความสะดวก เพิ่มเติม:</b> ' + items["description"] + '</p>' +
					'<p class="place-desc"><b>อัตราค่าบริการ:</b> ' + items["entrance_fee"] + '</p>' +
					'<p class="place-desc"><b>ร้านค้าสวัสดิการ:</b> ' + items["store"] + '</p>' +
					'<p class="place-desc"><b>สัญญาณโทรศัพท์ในพื้นที่:</b> ' + items["cellular_net"] + '</p>' +
					'<p class="place-desc"><b>หน่วยงานที่เกี่ยวข้อง:</b> ' + items["agency"] + '</p>' +
					'<p class="place-desc"><b>การเดินทาง:</b> ' + items["travel"] + '</p>' +
					'<p class="place-desc"><b>ติดต่อ:</b> ' + items["contactinfo"] + '</p>' +
					'<p class="place-desc"><b>แผนที่:</b> <a href="' + items["gmap"] + '" style="color:blue; font-size:16px;display: inline;" target="_blank">' + items["gmap"] + '</a></p>' +
					'<p class="place-desc"><b>ที่มาของข้อมูล:</b> ' + items["infosource"] + '</p>' +
					'<p class="place-desc"><b>ที่มาของรูป:</b> ' + items["photosource"] + '</p>' +
					// '<p class="place-desc"><b>ลิงค์ใส่รูปเพิ่มเติม:</b> ' + items["extralink"] + '</p>' +
					// '<p class="place-desc"><b>ลิงค์ใส่รูปเพิ่มเติม:</b> ' + items["extralink"] + '</p>' +

					photoPreviewHtml +

					'</div>' +
					'</div>');
				$(document).ready(function () {
					$('.js-example-basic-multiple').select2();
				});
				if (items["facilities_list"] !== null) {
					var facilitiesList = items["facilities_list"].split(",");
					for (var i = 0; i < facilitiesList.length; i++) {
						$('#facilities_selects option[value="' + facilitiesList[i] + '"]').attr("selected", "selected").trigger('change');
					}
				}

				$('#detail-panel').css("width", "calc(100vw - 350px)");
				$(".detail-right").css("right", "350px");

			},
			function (error) {
				// Error Callback
				console.log('ERROR: ' + error);
			}
		);

	});

	$(document).on('click', '#decrease-text-size', function (event) {
		$(".place-desc").css("font-size", "12px");
		$(".place-desc").css("font-weight", "300");
	});
	$(document).on('click', '#default-text-size', function (event) {
		$(".place-desc").css("font-size", "14px");
		$(".place-desc").css("font-weight", "300");
	});

	$(document).on('click', '#increase-text-size', function (event) {
		$(".place-desc").css("font-size", "16px");
		$(".place-desc").css("font-weight", "300");
	});

	$("#geolocate").click(function () {
		var lat = $("#geo-lat").val();
		var lng = $("#geo-lng").val();

		map.flyTo({ center: [lng, lat] });
		// make a marker for each feature and add to the map
		var el = document.createElement('div');
		el.className = 'marker geolocation';
		new mapboxgl.Marker(el)
			.setLngLat([lng, lat])
			.setPopup(
				new mapboxgl.Popup({ offset: 25 }) // add popups
					.setText('ตำแหน่งของคุณปัจจุบัน')
			)
			.addTo(map);

	});



});
