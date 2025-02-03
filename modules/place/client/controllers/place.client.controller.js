'use strict';

angular
	.module('core')
	.controller('placeCtrl', placeCtrl);

// Inject dependencies properly
placeCtrl.$inject = ['$scope', '$http', '$stateParams'];

function placeCtrl($scope, $http, $stateParams) {
	// Function to make API calls
	var apiCall = function (url, method) {
		return $http({
			method: method,
			url: url,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

	// Function to create cards from response
	$scope.createCard = function (response) {
		$("#content").html('');
		var items = response.data[0];
		console.log(items)
		// console.log()
		$("#content").html(
			'<div class="row">' +
			// '<div class="col-sm-2">' +
			// '<button id="decrease-text-size" class="btn btn-sm btn-default text-size"> - </button>' +
			// '<button id="default-text-size" class="btn btn-sm btn-default text-size">ปกติ</button>' +
			// '<button id="increase-text-size" class="btn btn-sm btn-default text-size">+</button>' +
			// '</div>' +
			'<div class="col-sm-12"><p class="place-name">' + items["name"] + '</p></div>' +
			'<div class="col-sm-12"><img src="' + items["imgfeatured"] + '" alt="" style="width:100%;margin-bottom: 20px;"></div>' +
			// '<div class="col-sm-12"><p style="font-size: 12px;">ที่มาของรูป: '+items["imgfeatured"]+'</p></div>'+
			'<div class="col-sm-12">' +
			'<audio controls="controls"><source src="' + items["audio"] + '" ></audio>' +
			'<p class="place-desc"><b>สถานที่ตั้ง:</b> ' + items["location"] + '</p>' +
			'<p class="place-desc"><b>พิกัด:</b> ' + items["lat"] + ', ' + items["lng"] + '</p>' +
			'<p class="place-desc"><b>ความเป็นมา:</b> ' + items["description"] + '</p>' +
			'<p class="place-desc"><b>สิ่งอำนวยความสะดวก:</b></p>' +
			'<div class="col-sm-12" style="margin-bottom: 15px;">' +
			'<select class="js-example-basic-multiple" id="facilities_selects" name="facilities_selects[]" multiple="multiple" style="width: 100%;margin-bottom:15px;" disabled >' +
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
			'<p class="place-desc"><b>ลิงค์ใส่รูปเพิ่มเติม:</b> ' + items["extralink"] + '</p>' +
			'<p class="place-desc"><b>ลิงค์ใส่รูปเพิ่มเติม:</b> ' + items["extralink"] + '</p>' +

			'</div>' +
			'</div>');
		$(document).ready(function () {
		$('.js-example-basic-multiple').select2();
	});
		

		console.log(items["facilities"])
		if (items["facilities"] !== null) {
			var facilitiesList = items["facilities"].split(",");
			console.log(facilitiesList)
			for (var i = 0; i < facilitiesList.length; i++) {
				$('#facilities_selects option[value="' + facilitiesList[i] + '"]').attr("selected", "selected").trigger('change');
			}
		}

	};

	// Function to fetch the place list
	$scope.fetchPlaceList = function () {
		// Access the placeId from $stateParams
		var pid = $stateParams.placeId;
		var getPlaceURL = '/' + $.param({ action: 'get-detail', pid: pid });

		// Make the API call
		apiCall(getPlaceURL, 'POST').then(
			function (response) {
				// Success callback
				$scope.createCard(response);
			},
			function (error) {
				// Error callback
				console.log('ERROR:', error);
			}
		);
	};

	// Fetch the place list on initialization
	$scope.fetchPlaceList();



	$(document).on('click', '#decrease-text-size', function (event) {
		$(".place-desc").css("font-size", "14px");
		$(".place-desc").css("font-weight", "500");
	});
	$(document).on('click', '#default-text-size', function (event) {
		$(".place-desc").css("font-size", "16px");
		$(".place-desc").css("font-weight", "500");
	});

	$(document).on('click', '#increase-text-size', function (event) {
		$(".place-desc").css("font-size", "20px");
		$(".place-desc").css("font-weight", "500");
	});

	// $(document).ready(function () {
	// 	$('.js-example-basic-multiple').select2();
	// });

}
