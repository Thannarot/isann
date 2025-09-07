

'use strict';

angular.module('core').controller('homeCtrl', function ($scope, $http) {

  let slideIndex = 0;
  let slides = [];
  const dots = document.getElementsByClassName("dot");

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
          <img src="${transformDriveUrl(img.link)}" style="width:100%">
        `;
      slideshowContainer.appendChild(slideDiv);
    });

    slides = document.getElementsByClassName("mySlides");
  }


  function showSlides() {
    if (!slides.length) return;
  
    // Hide all slides
    for (let i = 0; i < slides.length; i++) {
      slides[i].style.display = "none";
    }
  
    // Remove active class from all dots
    for (let i = 0; i < dots.length; i++) {
      dots[i].classList.remove("active");
    }
  
    // Increment slide index
    slideIndex++;
    if (slideIndex > slides.length) slideIndex = 1;
  
    // Show the current slide + activate dot
    slides[slideIndex - 1].style.display = "block";
    slides[slideIndex - 1].classList.add("fade");
    if (dots.length) dots[slideIndex - 1].classList.add("active");
  
    // Call again after 10s
    setTimeout(showSlides, 100);
  }

  fetchImages();
});
