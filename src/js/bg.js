// Background Images
const backgrounds = [
  'url("../src/assets/bg_001.jpg")', 'url("../src/assets/bg_002.jpg")', 'url("../src/assets/bg_003.jpg")',
  'url("../src/assets/bg_004.jpg")', 'url("../src/assets/bg_005.jpg")', 'url("../src/assets/bg_006.jpg")',
  'url("../src/assets/bg_007.jpg")', 'url("../src/assets/bg_008.jpg")', 'url("../src/assets/bg_009.jpg")',
  'url("../src/assets/bg_010.jpg")', 'url("../src/assets/bg_011.jpg")', 'url("../src/assets/bg_012.jpg")',
  'url("../src/assets/bg_013.jpg")'
];

//  Current index for the background images. Initialized randomly.
let currentIndex = Math.floor(Math.random() * backgrounds.length);

//  Preloads all images specified in the array to improve user experience.
// imageUrls - An array of image URLs to preload.

function preloadImages(imageUrls) {
  imageUrls.forEach(url => {
    (new Image()).src = url.replace('url("', '').replace('")', '');
  });
}
// Changes the background image of the body to the next image in the `backgrounds` array.
// It loops back to the beginning after reaching the last image.
function changeBackground() {
  currentIndex = (currentIndex + 1) % backgrounds.length;
  document.body.style.backgroundImage = backgrounds[currentIndex];
}
// Initial background setting and preloading
document.body.style.backgroundImage = backgrounds[currentIndex];
preloadImages(backgrounds);

// Set interval to change background every 5 minutes (5=300,000 2=120,000 1=60,000 10sec=10,000))
setInterval(changeBackground, 300000);
