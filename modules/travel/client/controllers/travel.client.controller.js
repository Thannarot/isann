

'use strict';

angular.module('core').controller('travelCtrl', function ($scope, $http) {

	var apiCall = function (url, method) {
		//console.log(method, url);
		return $http({
			method: method,
			url: url,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

	// Helper function to extract photo ID and build display URL
	function transformDriveUrl(url) {
		try {
		const idMatch = url.match(/id=([^&]+)/);
		if (idMatch && idMatch[1]) {
			return `https://lh3.googleusercontent.com/d/${idMatch[1]}=s2580`;
		}
		} catch (e) {
		console.warn('Invalid photo URL:', url);
		}
		return ''; // fallback
	}

	$scope.createCard = function (response) {
		$("#cards").html('');
		for (var i = 0; i < response.data.length; i++) {
			var pid = response.data[i]["pid"];
			var placeName = response.data[i]["name"];
			var placeLocation = response.data[i]["location"];
			var lng = response.data[i]["lng"];
			var lat = response.data[i]["lat"];
			var placetype = response.data[i]["tid"];
			var imgfeatured = transformDriveUrl(response.data[i]["imgfeatured"]);
			var desc = response.data[i]["desc"];
			var travel = response.data[i]["travel"];
			var rating = response.data[i]["rating"];
			// create a HTML element for each feature

			var contentHTML = `<div class="card" data-pid="` + pid + `">
			<img src="`+ imgfeatured + `" alt="" class="card-image">
			<div class="card-body">
			  <h2 class="card-title">`+ placeName + `</h2>
			  <ul class="card-info">
				<li>📍 Location: `+ placeLocation + `</li>
	
				
			  </ul>
			  <a href="/place/`+pid+`" class="card-button">อ่านเพิ่มเติม</a>
			</div>
		  </div>`;

			$("#cards").append(contentHTML);
		}
	}

	$scope.fetchPlaceList = function () {
		var getPleaceURL = '/' + $.param({ action: 'get-tourism' });
		// Make a request
		apiCall(getPleaceURL, 'POST').then(
			function (response) {
				// Success Callback
				$scope.createCard(response);
			},
			function (error) {
				// Error Callback
				console.log('ERROR: ' + error);
			}
		);
	};
	$scope.fetchPlaceList();

});
