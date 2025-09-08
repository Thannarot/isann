

'use strict';

angular.module('core').controller('homeCtrl', function ($scope, $http) {

  let slideIndex = 0;
  let slides = [];
  const dots = document.getElementsByClassName("dot");
  const intervalMs = 10000;

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
  function setActive(index) {
    for (let i = 0; i < slides.length; i++) {
      slides[i].classList.toggle("is-active", i === index);
    }
    for (let i = 0; i < dots.length; i++) {
      dots[i].classList.toggle("active", i === index);
    }
  }
  
  function showSlides() {
    if (!slides.length) return;
  
    // Next index (wrap around)
    slideIndex = (slideIndex + 1) % slides.length;
  
    // Cross-fade instead of hide/show
    setActive(slideIndex);
  
    setTimeout(showSlides, intervalMs);
  }
  
  // Optional: start once first images are cached to avoid initial flash
  (function preloadAndStart() {
    if (!slides.length) return;
    // Make the first slide visible immediately
    setActive(0);
  
    // Preload remaining images, then start rotation
    const imgs = Array.from(slides)
      .map(s => s.querySelector("img"))
      .filter(Boolean);
  
    let loaded = 0;
    const total = imgs.length;
    imgs.forEach(img => {
      if (img.complete) {
        if (++loaded === total) setTimeout(showSlides, intervalMs);
      } else {
        img.addEventListener("load", () => {
          if (++loaded === total) setTimeout(showSlides, intervalMs);
        }, { once: true });
        img.addEventListener("error", () => {
          if (++loaded === total) setTimeout(showSlides, intervalMs);
        }, { once: true });
      }
    });
  })();
  

  fetchImages();
});
