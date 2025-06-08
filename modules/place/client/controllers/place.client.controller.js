'use strict';

angular
	.module('core')
	.controller('placeCtrl', placeCtrl);

// Inject dependencies properly
placeCtrl.$inject = ['$scope', '$http', '$stateParams'];

// Helper function to extract photo ID and build display URL
function transformDriveUrl(url) {
	try {
		const idMatch = url.match(/id=([^&]+)/);
		if (idMatch && idMatch[1]) {
			return `https://lh3.googleusercontent.com/d/${idMatch[1]}=s1024`;
		}
	} catch (e) {
		console.warn('Invalid photo URL:', url);
	}
	return ''; // fallback
}

  
function placeCtrl($scope, $http, $stateParams) {
	// Function to make API calls
	var apiCall = function (url, method, data) {
		return $http({
			method: method,
			url: url,
			data: data,
			headers: { 'Content-Type': 'application/json' }
		});
	};


	// Function to create cards from response
	$scope.createCard = function (response) {
		$("#content").html('');
		var items = response.data[0];

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

		// console.log()
		$("#content").html(
			'<div class="row" style="margin-bottom: 150px;">' +
			'<div class="col-sm-12"><p class="place-name">' + items["name"] + '</p></div>' +
			'<div class="col-sm-12"><img src="' + transformDriveUrl(items["imgfeatured"]) + '" alt="" style="width:100%;margin-bottom: 20px;"></div>' +

			'<div class="col-sm-12">' +
			videoBlock + 
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

			photoPreviewHtml +

			'</div>' +
			'</div>');
		$(document).ready(function () {
			$('.js-example-basic-multiple').select2();
		});

		if (items["facilities"] !== null) {
			var facilitiesList = items["facilities"].split(",");
			for (var i = 0; i < facilitiesList.length; i++) {
				$('#facilities_selects option[value="' + facilitiesList[i] + '"]').attr("selected", "selected").trigger('change');
			}
		}

	};

	// Function to fetch the place list
	$scope.fetchPlaceList = function () {
		// Access the placeId from $stateParams
		var pid = $stateParams.placeId;
		// Make the API call
		apiCall('/get-detail', 'POST', { pid: pid }).then(
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

}
