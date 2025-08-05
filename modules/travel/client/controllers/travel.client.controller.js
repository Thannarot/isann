'use strict';

angular.module('core').controller('travelCtrl', function ($scope, $http) {

	var apiCall = function (url, method) {
		return $http({
			method: method,
			url: url,
			headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
		});
	};

	let currentLocation = null;
	let currentMarker = null;
	let destinationLocation = null; // <== new: store selected destination
	let map;

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
				destinationLocation = [lng, lat];
				console.log("Destination set to:", destinationLocation);
				alert(`ตั้งปลายทางเป็น ${placeName}`);
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
		if (!destinationLocation) {
			alert("กรุณาคลิกที่ marker เพื่อเลือกปลายทาง");
			return;
		}
		const originStr = `${currentLocation[1]},${currentLocation[0]}`;
		const destinationStr = `${destinationLocation[1]},${destinationLocation[0]}`;
		const googleMapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${destinationStr}&travelmode=driving`;
		window.open(googleMapsUrl, '_blank');
	});

	$scope.fetchPlaceList();
});
