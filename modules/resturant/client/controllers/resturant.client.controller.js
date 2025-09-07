'use strict';

angular.module('core').controller('resturantCtrl', function ($scope, $http) {

  var apiCall = function (url, method) {
    return $http({
      method: method,
      url: url,
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
  };

  // Helper: convert Google Drive viewer link -> displayable image
  function transformDriveUrl(url) {
    try {
      const idMatch = url && url.match(/id=([^&]+)/);
      if (idMatch && idMatch[1]) {
        return 'https://lh3.googleusercontent.com/d/' + idMatch[1] + '=s2580';
      }
    } catch (e) { console.warn('Invalid photo URL:', url); }
    return '';
  }

  // ---------- Pagination state ----------
  $scope.items = [];            // full list from API
  $scope.pageSize = 10;         // cards per page
  $scope.currentPage = 1;       // 1-based
  $scope.totalPages = 1;

  function paginate(arr, page, pageSize) {
    const start = (page - 1) * pageSize;
    return arr.slice(start, start + pageSize);
  }

  function buildPager() {
    const pager = $('#pager');
    pager.html('');
    if ($scope.totalPages <= 1) return;

    const createBtn = (label, disabled, page) => {
      const btn = $('<button class="pager-btn">').text(label);
      if (disabled) btn.attr('disabled', true);
      else btn.on('click', function () { $scope.$apply(() => $scope.goToPage(page)); });
      return btn;
    };

    // Prev
    pager.append(createBtn('« Prev', $scope.currentPage === 1, $scope.currentPage - 1));

    // Page numbers (compact: window around current)
    const windowSize = 5; // show up to 5 numbers around current
    let start = Math.max(1, $scope.currentPage - 2);
    let end = Math.min($scope.totalPages, start + windowSize - 1);
    // adjust start if near the end
    start = Math.max(1, Math.min(start, end - windowSize + 1));

    if (start > 1) {
      pager.append(createBtn('1', false, 1));
      if (start > 2) pager.append($('<span class="pager-ellipsis">...</span>'));
    }

    for (let p = start; p <= end; p++) {
      const btn = createBtn(String(p), false, p);
      if (p === $scope.currentPage) btn.addClass('active');
      pager.append(btn);
    }

    if (end < $scope.totalPages) {
      if (end < $scope.totalPages - 1) pager.append($('<span class="pager-ellipsis">...</span>'));
      pager.append(createBtn(String($scope.totalPages), false, $scope.totalPages));
    }

    // Next
    pager.append(createBtn('Next »', $scope.currentPage === $scope.totalPages, $scope.currentPage + 1));
  }

  $scope.goToPage = function (page) {
    if (page < 1 || page > $scope.totalPages) return;
    $scope.currentPage = page;
    const pageItems = paginate($scope.items, $scope.currentPage, $scope.pageSize);
    $scope.createCard({ data: pageItems });
    buildPager();
  };

  // ---------- Rendering ----------
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

      var contentHTML = `
        <div class="card" data-pid="${pid}">
          <img src="${imgfeatured}" class="card-image" loading="lazy" />
          <div class="card-body">
            <h2 class="card-title">${placeName}</h2>
            <ul class="card-info">
              <li>📍 Location: ${placeLocation}</li>
            </ul>
            <a href="/place/${pid}" class="card-button">อ่านเพิ่มเติม</a>
          </div>
        </div>`;
      $("#cards").append(contentHTML);
    }
  };

  // ---------- Fetch & init ----------
  $scope.fetchPlaceList = function () {
    var getPleaceURL = '/' + $.param({ action: 'get-resturant' });
    apiCall(getPleaceURL, 'POST').then(
      function (response) {
        // store all items
        $scope.items = Array.isArray(response.data) ? response.data : [];
        $scope.totalPages = Math.max(1, Math.ceil($scope.items.length / $scope.pageSize));
        $scope.currentPage = 1;
        $scope.goToPage(1);
      },
      function (error) {
        console.log('ERROR: ' + error);
      }
    );
  };

  $scope.fetchPlaceList();
});
