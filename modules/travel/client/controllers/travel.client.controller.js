'use strict';

angular.module('core').controller('travelCtrl', function ($scope, $http, $sce) {

	var apiCall = function (url, method, data) {
		return $http({
			method: method,
			url: url,
			data: data,
			headers: { 'Content-Type': 'application/json' }
		});
	};


	// ---------- Panel + button refs ----------
	const sidenavEl = document.getElementById('menuSidenav');
	const openBtn = document.getElementById('menuOpenBtn');
	const closeBtn = document.getElementById('menu-close-btn');
	const filterBtn = document.getElementById('filter-btn');
	const showAllBtn = document.getElementById('filter-all-btn');

	function openSidenav() { if (sidenavEl) sidenavEl.classList.add('sidenav-open'); }
	function closeSidenav() { if (sidenavEl) sidenavEl.classList.remove('sidenav-open'); }

	// ---------- Marker bookkeeping ----------
	let placeMarkers = [];
	function clearPlaceMarkers() {
		placeMarkers.forEach(m => m.remove());
		placeMarkers = [];
	}

	// ---------- Read filters from DOM ----------
	function getFilterValues() {
		const val = id => (document.getElementById(id) || {}).value || '';
		return {
			name: val('pname').trim(),
			province: val('province_selector'),
			city: val('city_selector'),
			township: val('township_selector'),
			ptype: val('ptype_selector') || '9999',
			lat: val('geo-lat'),
			lng: val('geo-lng')
		};
	}

	// ---------- App state ----------
	let currentLocation = null;
	let currentMarker = null;
	let map;
	let destinationLocations = [];
	$scope.destinations = [];
	$scope.trustedDestinationsHtml = null;

	function updateDestinationListHtml() {
		let html = '<ol>';
		for (let d of $scope.destinations) html += `<li>📍 ${d.name} - ${d.location}</li>`;
		html += '</ol>';
		$scope.trustedDestinationsHtml = $sce.trustAsHtml(html);
	}

	// ---------- Create markers from API response ----------
	$scope.createMarker = function (response) {
		const rows = Array.isArray(response.data) ? response.data : [];
		for (var i = 0; i < rows.length; i++) {
			const placeName = rows[i]["name"];
			const placeLocation = rows[i]["location"];
			const lng = Number(rows[i]["lng"]);
			const lat = Number(rows[i]["lat"]);
			if (!Number.isFinite(lng) || !Number.isFinite(lat)) continue;

			const popup = new mapboxgl.Popup({ offset: 25, closeButton: false, closeOnClick: false })
				.setHTML(`<strong>${placeName || ''}</strong><br>${placeLocation || ''}`);

			const marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
			placeMarkers.push(marker);

			const el = marker.getElement();
			el.addEventListener('mouseenter', () => popup.addTo(map).setLngLat([lng, lat]));
			el.addEventListener('mouseleave', () => popup.remove());
			el.addEventListener('click', () => {
				destinationLocations.push([lng, lat]);
				$scope.$apply(() => {
					$scope.destinations.push({ name: placeName, location: placeLocation, lat, lng });
					updateDestinationListHtml();
				});
			});
		}
	};

	// ---------- Fetch places with filters → rebuild markers ----------
	function fetchPlacesWithFilters(filters) {
		const params = {
			pname: filters.name,
			adm1: filters.province,
			adm2: filters.city,
			adm3: filters.township,
			ptype: filters.ptype,
			geolocate_lat: currentLocation[1],
			geolocate_lng: currentLocation[0],
			distance: "1000"

		};
		return apiCall('/filter-place', 'POST',  params ).then(
			function (response) {
				clearPlaceMarkers();
				$scope.createMarker(response);
				closeSidenav();
			},
			function (error) { console.error('ERROR:', error); }
		);
	}

	// ---------- Initial fetch (no filters) ----------
	$scope.fetchPlaceList = function () {
		apiCall('/get-places', 'POST').then(
			function (response) {
				clearPlaceMarkers();
				$scope.createMarker(response);
			},
			function (error) { console.error('ERROR:', error); }
		);
	};

	// ---------- Mapbox ----------
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

		const latEl = document.getElementById('geo-lat');
		const lngEl = document.getElementById('geo-lng');
		if (latEl) latEl.value = lat;
		if (lngEl) lngEl.value = lng;

		if (currentMarker) currentMarker.remove();
		currentMarker = new mapboxgl.Marker({ color: 'red' })
			.setLngLat(currentLocation)
			.setPopup(new mapboxgl.Popup().setText("ตำแหน่งปัจจุบันของคุณ"))
	
			.addTo(map)
			.togglePopup();

		map.setCenter(currentLocation);
		map.setZoom(6);
		if (planBtn) planBtn.style.display = 'block';
	}, () => { /* ignore */ });

	if (planBtn) {
		planBtn.addEventListener('click', () => {
			if (!currentLocation) return alert("ตำแหน่งปัจจุบันยังไม่พร้อม");
			if (destinationLocations.length === 0) return alert("กรุณาคลิกที่ marker เพื่อเลือกจุดหมายปลายทาง");

			const waypoints = destinationLocations.slice(0, -1).map(loc => `${loc[1]},${loc[0]}`).join('|');
			const finalDest = destinationLocations[destinationLocations.length - 1];
			const originStr = `${currentLocation[1]},${currentLocation[0]}`;
			const destStr = `${finalDest[1]},${finalDest[0]}`;

			let url = `https://www.google.com/maps/dir/?api=1&origin=${originStr}&destination=${destStr}&travelmode=driving`;
			if (waypoints) url += `&waypoints=${encodeURIComponent(waypoints)}`;
			window.open(url, '_blank');
		});
	}

	$scope.fetchPlaceList();

	$scope.clearDestinations = function () {
		destinationLocations = [];
		$scope.destinations = [];
		$scope.trustedDestinationsHtml = null;
	};

	// ---------- Toggle extra GeoJSON layers (kept) ----------
	const visibleLayers = {};
	$('li.pointer').click(function () {
		const layerId = $(this).data('layer-id');
		const filePath = $(this).data('file');
		const color = $(this).data('color');
		const sourceId = layerId + '-source';
		const mapLayerId = layerId + '-layer';
		const isActive = visibleLayers[layerId] === true;

		if (isActive) {
			if (map.getLayer(mapLayerId)) map.removeLayer(mapLayerId);
			if (map.getSource(sourceId)) map.removeSource(sourceId);
			visibleLayers[layerId] = false;
			$(this).removeClass('active');
		} else {
			if (!map.getSource(sourceId)) {
				map.addSource(sourceId, { type: 'geojson', data: filePath });
				map.addLayer({
					id: mapLayerId, type: 'circle', source: sourceId,
					paint: { 'circle-radius': 6, 'circle-color': color }
				});

				map.on('click', mapLayerId, function (e) {
					const f = e.features && e.features[0];
					if (!f) return;
					const coordinates = f.geometry.coordinates.slice();
					const name = f.properties.Name || 'Unnamed';
					const location = f.properties.Location || '';

					destinationLocations.push(coordinates);
					$scope.$apply(() => {
						$scope.destinations.push({
							name, location,
							lat: coordinates[1], lng: coordinates[0]
						});
						updateDestinationListHtml();
					});

					new mapboxgl.Popup()
						.setLngLat(coordinates)
						.setHTML(`<strong>${name}</strong><br>${location}`)
						.addTo(map);
				});

				map.on('mouseenter', mapLayerId, () => map.getCanvas().style.cursor = 'pointer');
				map.on('mouseleave', mapLayerId, () => map.getCanvas().style.cursor = '');
			}
			visibleLayers[layerId] = true;
			$(this).addClass('active');
		}
	});

	// ================================
	//   CASCADING SELECT LOADERS
	// ================================
	const provinceSel = document.getElementById('province_selector');
	const citySel = document.getElementById('city_selector');
	const townshipSel = document.getElementById('township_selector');

	function fillOptions(selectEl, list, firstOption, adm) {
		if (!selectEl) return;
		selectEl.innerHTML = '';
		// prepend default "ทั้งหมด"
		const def = document.createElement('option');
		def.value = (firstOption && firstOption.value !== undefined) ? firstOption.value : '';
		def.textContent = (firstOption && firstOption.label) || 'ทั้งหมด';
		selectEl.appendChild(def);

		(list || []).forEach(it => {
			const opt = document.createElement('option');
			// Allow either {id_1,name_1} style or {value,label} or plain string
			if (typeof it === 'string') {
				opt.value = it; opt.textContent = it;
			} else if ('id_1' in it && adm === 'province') { // province
				opt.value = it.id_1; opt.textContent = it.name_1;
			} else if ('id_2' in it && adm === 'city') { // city
				opt.value = it.id_2; opt.textContent = it.name_2;
			} else if ('id_3' in it && adm === 'township') { // township
				opt.value = it.id_3; opt.textContent = it.name_3;
			} else {
				opt.value = it.value ?? ''; opt.textContent = it.label ?? '';
			}
			selectEl.appendChild(opt);
		});
	}

	// province -> /get-province-list
	function listProvinceOptions() {
		return apiCall('/get-province-list', 'POST').then(
			res => {
				const items = Array.isArray(res.data) ? res.data : [];
				fillOptions(provinceSel, items, { value: '', label: 'ทั้งหมด' }, 'province');
				fillOptions(citySel, [], { value: '', label: 'ทั้งหมด' }, 'province');
				fillOptions(townshipSel, [], { value: '', label: 'ทั้งหมด' }, 'province');
			},
			err => console.error('ERROR:', err)
		);
	}

	// city -> /get-city-list?prov_id=...
	function listCityOptions() {
		const prov_id = provinceSel ? provinceSel.value : '';
		if (!prov_id) {
			fillOptions(citySel, [], { value: '', label: 'ทั้งหมด' }, 'city');
			fillOptions(townshipSel, [], { value: '', label: 'ทั้งหมด' }, 'city');
			return;
		}
		return apiCall('/get-city-list', 'POST', { prov_id: prov_id }).then(
			res => {
				const items = Array.isArray(res.data) ? res.data : [];
				fillOptions(citySel, items, { value: '', label: 'ทั้งหมด' }, 'city');
				fillOptions(townshipSel, [], { value: '', label: 'ทั้งหมด' }, 'city');
			},
			err => console.error('ERROR:', err)
		);
	}

	// township -> /get-township-list?dist_id=...
	function listTownshipOptions() {
		const dist_id = citySel ? citySel.value : '';
		if (!dist_id) {
			fillOptions(townshipSel, [], { value: '', label: 'ทั้งหมด' }, 'township');
			return;
		}
		return apiCall('/get-township-list', 'POST', { dist_id: dist_id }).then(
			res => {
				const items = Array.isArray(res.data) ? res.data : [];
				fillOptions(townshipSel, items, { value: '', label: 'ทั้งหมด' }, 'township');
			},
			err => console.error('ERROR:', err)
		);
	}

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
	$scope.listPlaceTypeOptions();
	// Wire cascading changes
	if (provinceSel) {
		provinceSel.addEventListener('change', () => {
			if (citySel) citySel.value = '';
			if (townshipSel) townshipSel.value = '';
			listCityOptions();
		});
	}
	if (citySel) {
		citySel.addEventListener('change', () => {
			if (townshipSel) townshipSel.value = '';
			listTownshipOptions();
		});
	}

	// Load provinces initially
	listProvinceOptions();

	// ================================
	//   FILTER BUTTONS
	// ================================
	if (openBtn) openBtn.addEventListener('click', openSidenav);
	if (closeBtn) closeBtn.addEventListener('click', closeSidenav);

	if (filterBtn) {
		filterBtn.addEventListener('click', () => {
			const filters = getFilterValues();
			fetchPlacesWithFilters(filters);
		});
	}

	if (showAllBtn) {
		showAllBtn.addEventListener('click', () => {
			['pname', 'province_selector', 'city_selector', 'township_selector', 'ptype_selector']
				.forEach(id => {
					const el = document.getElementById(id);
					if (!el) return;
					if (id === 'ptype_selector') el.value = '9999';
					else el.value = '';
				});
			fetchPlacesWithFilters(getFilterValues());
		});
	}
});
