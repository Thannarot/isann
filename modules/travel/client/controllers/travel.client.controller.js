'use strict';

angular.module('core').controller('travelCtrl', function ($scope, $http, $sce) {

	var apiCall = function (url, method) {
		return $http({
			method: method,
			url: url,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

	let currentLocation = null;
	let currentMarker = null;
	let destinationLocation = null;
	let map;
	let destinationLocations = [];
	$scope.destinations = [];
	$scope.trustedDestinationsHtml = null;

	function updateDestinationListHtml() {
		let html = '<h3>จุดหมายที่เลือก:</h3><ol>';
		for (let d of $scope.destinations) {
			html += `<li>📍 ${d.name} - ${d.location}</li>`;
		}
		html += '</ol>';
		$scope.trustedDestinationsHtml = $sce.trustAsHtml(html);
	}

	$scope.createMarker = function (response) {
		for (var i = 0; i < response.data.length; i++) {
			const pid = response.data[i]["pid"];
			const placeName = response.data[i]["name"];
			const placeLocation = response.data[i]["location"];
			const lng = response.data[i]["lng"];
			const lat = response.data[i]["lat"];

			// Add marker with click handler
			const marker = new mapboxgl.Marker()
				.setLngLat([lng, lat])
				.setPopup(new mapboxgl.Popup().setHTML(`<strong>${placeName}</strong><br>${placeLocation}`))
				.addTo(map);

			marker.getElement().addEventListener('click', () => {
				destinationLocations.push([lng, lat]);
				$scope.$apply(() => {
					$scope.destinations.push({
						name: placeName,
						location: placeLocation,
						lat: lat,
						lng: lng
					});
					updateDestinationListHtml(); // update HTML
				});
			});

		}
	};

	$scope.fetchPlaceList = function () {
		const getPlaceURL = '/get-places';
		apiCall(getPlaceURL, 'POST').then(
			function (response) {
				$scope.createMarker(response);
			},
			function (error) {
				console.error('ERROR:', error);
			}
		);
	};

	// Mapbox setup
	mapboxgl.accessToken = 'pk.eyJ1Ijoic2FzaWthcm4iLCJhIjoiY21ka2RpeW90MHdmZzJrcTQ2cGppZTNxeSJ9.dK9GWigSYjAulbGr-eDxsg';

	map = new mapboxgl.Map({
		container: 'map',
		style: 'mapbox://styles/mapbox/streets-v12',
		center: [101.5, 15.0],
		zoom: 2
	});

	const planBtn = document.getElementById('planTripBtn');

	navigator.geolocation.getCurrentPosition(pos => {
		const lat = pos.coords.latitude;
		const lng = pos.coords.longitude;
		currentLocation = [lng, lat];

		if (currentMarker) currentMarker.remove();

		currentMarker = new mapboxgl.Marker({ color: 'red' })
			.setLngLat(currentLocation)
			.setPopup(new mapboxgl.Popup().setText("ตำแหน่งปัจจุบันของคุณ"))
			.addTo(map)
			.togglePopup();

		map.setCenter(currentLocation);
		map.setZoom(6);
		planBtn.style.display = 'block';
	}, err => {
		alert("ไม่สามารถเข้าถึงตำแหน่งของคุณได้");
	});

	planBtn.addEventListener('click', () => {
		if (!currentLocation) {
			alert("ตำแหน่งปัจจุบันยังไม่พร้อม");
			return;
		}
		if (destinationLocations.length === 0) {
			alert("กรุณาคลิกที่ marker เพื่อเลือกจุดหมายปลายทาง");
			return;
		}

		// Split: first n-1 are waypoints, last is final destination
		const waypoints = destinationLocations.slice(0, -1)
			.map(loc => `${loc[1]},${loc[0]}`).join('|');
		const finalDest = destinationLocations[destinationLocations.length - 1];
		const finalDestStr = `${finalDest[1]},${finalDest[0]}`;
		const originStr = `${currentLocation[1]},${currentLocation[0]}`;

		let googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${finalDestStr}&travelmode=driving`;
		if (waypoints) {
			googleMapsUrl += `&waypoints=${encodeURIComponent(waypoints)}`;
		}

		window.open(googleMapsUrl, '_blank');
	});


	$scope.fetchPlaceList();

	$scope.clearDestinations = function () {
		destinationLocations = [];
		$scope.destinations = [];
		$scope.trustedDestinationsHtml = null;
	  };
});
