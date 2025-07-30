

'use strict';

angular.module('core').controller('homeCtrl', function ($scope, $http) {

    let slideIndex = 0;
    let slides = [];
  
    function fetchImages() {
      $http.post('/get-home-imgs', {}).then(function (res) {
        const imageList = res.data;
        renderSlides(imageList);
        showSlides();
      }, function (err) {
        console.error('Error fetching images:', err);
      });
    }
  
    function renderSlides(images) {
      const slideshowContainer = document.getElementById('slideshow');
      slideshowContainer.innerHTML = ''; // Clear existing slides
  
      images.forEach((img, index) => {
        const slideDiv = document.createElement('div');
        slideDiv.className = 'mySlides fade';
        slideDiv.innerHTML = `
          <div class="numbertext">${index + 1} / ${images.length}</div>
          <img src="${img.link}" style="width:100%">
        `;
        slideshowContainer.appendChild(slideDiv);
      });
  
      slides = document.getElementsByClassName("mySlides");
    }
  
    function showSlides() {
      if (!slides.length) return;
      for (let i = 0; i < slides.length; i++) {
        slides[i].style.display = "none";
      }
      slideIndex++;
      if (slideIndex > slides.length) { slideIndex = 1 }
      slides[slideIndex - 1].style.display = "block";
      $timeout(showSlides, 10000); // every 10 seconds
    }
  
    fetchImages();
});
