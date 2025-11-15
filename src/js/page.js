// Background Images
const backgrounds = [
  'url("./src/assets/bg_001.jpg")', 'url("./src/assets/bg_002.jpg")', 'url("./src/assets/bg_003.jpg")',
  'url("./src/assets/bg_004.jpg")', 'url("./src/assets/bg_005.jpg")', 'url("./src/assets/bg_006.jpg")',
  'url("./src/assets/bg_007.jpg")', 'url("./src/assets/bg_008.jpg")', 'url("./src/assets/bg_009.jpg")',
  'url("./src/assets/bg_010.jpg")', 'url("./src/assets/bg_011.jpg")', 'url("./src/assets/bg_012.jpg")',
  'url("./src/assets/bg_013.jpg")'
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

// Displays a custom alert box with a given message.
function showCustomAlert(message) {
  const overlay = document.getElementById("alert-overlay");
  const alertBox = document.getElementById("alert-box");
  const alertBoxMessage = document.getElementById("alert-box-message");
  const alertBoxOkBtn = document.getElementById("alert-box-ok-btn");

  alertBoxMessage.textContent = message;
  overlay.style.display = "block";
  alertBox.style.display = "block";

  alertBoxOkBtn.onclick = function () {
    overlay.style.display = "none";
    alertBox.style.display = "none";
  };
  overlay.onclick = function (event) {
    if (event.target === overlay) {
      overlay.style.display = "none";
      alertBox.style.display = "none";
    }
  };
};

// // Elements for date, time, and uptime display
// const currentTimeElement = document.getElementById("time");
// const currentDayElement = document.getElementById("day");
// const currentDateElement = document.getElementById("date");
// const uptimeElement = document.getElementById("uptime");

// // Timestamp when the page started
// let startTime = Date.now();

// // Adds a leading zero to numbers less than 10
// function padZero(num) {
//   return (num < 10 ? "0" : "") + num;
// }

// // Returns ordinal suffix (st, nd, rd, th)
// function getOrdinalSuffix(day) {
//   if (day > 3 && day < 21) return "th"; // handles 11th–13th
//   switch (day % 10) {
//     case 1: return "st";
//     case 2: return "nd";
//     case 3: return "rd";
//     default: return "th";
//   }
// }

// // Generates a random bright color in hex format
// function getRandomColor() {
//   const hue = Math.floor(Math.random() * 360);
//   return `hsl(${hue}, 90%, 60%)`;
// }

// // Store a unique random color for today's date (so it changes once per day)
// let today = new Date().getDate();
// let randomSuffixColor = getRandomColor();

// // Updates the current time, day, and date displayed on the page
// function updateDateTime() {
//   const now = new Date();
//   const hours = now.getHours();
//   const minutes = now.getMinutes();
//   const seconds = now.getSeconds();
//   const isPM = hours >= 12;
//   const ampm = isPM ? "PM" : "AM";

//   // Generate new suffix color when the day changes
//   if (now.getDate() !== today) {
//     today = now.getDate();
//     randomSuffixColor = getRandomColor();
//   }

//   const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
//   const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

//   const dayName = days[now.getDay()];
//   const date = now.getDate();
//   const suffix = getOrdinalSuffix(date);
//   const monthName = months[now.getMonth()];
//   const year = now.getFullYear();

//   const timeString = `
//     <span class="time-hour-min">${padZero(hours % 12 || 12)}   ${padZero(minutes)}</span>
//     <span class="time-sec-ampm">
//       <sup class="ampm" style="color:${isPM ? "var(--red)" : "var(--teal)"};">${ampm}</sup>
//       <sub class="time-sec">${padZero(seconds)}</sub>
//     </span>
//   `;

//   const dateString = `
//     ${date}<sup style="color:${randomSuffixColor};">${suffix}</sup> ${monthName} ${year}
//   `;

//   currentTimeElement.innerHTML = timeString.trim();
//   currentDateElement.innerHTML = dateString.trim();
//   currentDayElement.textContent = dayName;
// }

// // Updates the uptime counter displayed on the page
// function updateUptime() {
//   let elapsedTime = Date.now() - startTime;
//   let milliseconds = Math.floor(elapsedTime / 10) % 100;
//   let seconds = Math.floor(elapsedTime / 1000) % 60;
//   let minutes = Math.floor(elapsedTime / 60000) % 60;
//   let hours = Math.floor(elapsedTime / 3600000);

//   uptimeElement.textContent = `Uptime: ${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}-${padZero(milliseconds)}`;
// }

// // Initialize and update every second
// updateDateTime();
// updateUptime();
// setInterval(updateDateTime, 1000);
// setInterval(updateUptime, 100);


// // The main animation loop that updates date, time, and uptime using `requestAnimationFrame`.
// function loop() {
//   updateDateTime();
//   updateUptime();
//   requestAnimationFrame(loop);
// };
// loop();

document.addEventListener("DOMContentLoaded", () => {
  // Elements for date, time, and uptime display
  const currentTimeElement = document.getElementById("time");
  const currentDayElement = document.getElementById("day");
  const currentDateElement = document.getElementById("date");
  const uptimeElement = document.getElementById("uptime");

  // Timestamp when the page started
  let startTime = Date.now();

  // Adds a leading zero to numbers less than 10
  function padZero(num) {
    return (num < 10 ? "0" : "") + num;
  }

  // Returns ordinal suffix (st, nd, rd, th)
  function getOrdinalSuffix(day) {
    if (day > 3 && day < 21) return "th";
    switch (day % 10) {
      case 1: return "st";
      case 2: return "nd";
      case 3: return "rd";
      default: return "th";
    }
  }

  // Generates a random bright color
  function getRandomColor() {
    const hue = Math.floor(Math.random() * 360);
    return `hsl(${hue}, 90%, 60%)`;
  }

  // Store a unique random color for today's date
  let today = new Date().getDate();
  let randomSuffixColor = getRandomColor();

  // Updates the current time, day, and date displayed on the page
  function updateDateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const isPM = hours >= 12;
    const ampm = isPM ? "PM" : "AM";

    // Update color daily
    if (now.getDate() !== today) {
      today = now.getDate();
      randomSuffixColor = getRandomColor();
    }

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const dayName = days[now.getDay()];
    const date = now.getDate();
    const suffix = getOrdinalSuffix(date);
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();

    const timeString = `
      <span class="time-hour-min">${padZero(hours % 12 || 12)} ${padZero(minutes)}</span>
      <span class="time-sec-ampm">
        <sup class="ampm" style="color:${isPM ? "var(--red)" : "var(--teal)"};">${ampm}</sup>
        <sub class="time-sec">${padZero(seconds)}</sub>
      </span>
    `;

    const dateString = `
      ${date}<sup style="color:${randomSuffixColor};">${suffix}</sup> ${monthName} ${year}
    `;

    // ✅ Only update if elements exist
    if (currentTimeElement) currentTimeElement.innerHTML = timeString.trim();
    if (currentDateElement) currentDateElement.innerHTML = dateString.trim();
    if (currentDayElement) currentDayElement.textContent = dayName;
  }

  // Updates uptime display
  function updateUptime() {
    const elapsedTime = Date.now() - startTime;
    const milliseconds = Math.floor(elapsedTime / 10) % 100;
    const seconds = Math.floor(elapsedTime / 1000) % 60;
    const minutes = Math.floor(elapsedTime / 60000) % 60;
    const hours = Math.floor(elapsedTime / 3600000);

    if (uptimeElement)
      uptimeElement.textContent = `Uptime: ${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}-${padZero(milliseconds)}`;
  }

  // Initial updates
  updateDateTime();
  updateUptime();

  // Interval updates
  setInterval(updateDateTime, 1000);
  setInterval(updateUptime, 100);

  // Optional animation loop (can be removed if redundant)
  function loop() {
    updateDateTime();
    updateUptime();
    requestAnimationFrame(loop);
  }
  loop();
});


// function to control Current index for the slideshow.
let slideIndex = 0;

// All elements with the class 'slide'.
const slides = document.querySelectorAll(".slide");

// Displays the next slide in the slideshow with a random transition effect.
function showSlides() {
  slides.forEach(slide => {
    slide.style.display = "none";
  });
  slideIndex++;
  if (slideIndex > slides.length) {
    slideIndex = 1;
  }
  slides[slideIndex - 1].style.display = "block";

  const randomEffect = getRandomEffect();

  // Remove all possible transition classes before adding a new one
  slides[slideIndex - 1].classList.remove("fade", "slide-rtl", "slide-ltr", "slide-utd", "slide-dtu", "zoom-i", "zoom-o");
  slides[slideIndex - 1].classList.add(randomEffect);
};
// Returns a random CSS class name for a slide transition effect.
function getRandomEffect() {
  const effects = ["fade", "slide-rtl", "slide-ltr", "slide-utd", "slide-dtu", "zoom-i", "zoom-o"];
  return effects[Math.floor(Math.random() * effects.length)];
};
// Initial call and interval for slideshow
showSlides();
// Change slide every 5 seconds
setInterval(showSlides, 5000);


// Performs a Google search with the text from the search input field. And displays an alert if the search field is empty.
function google() {
  const searchTerm = document.getElementById("search").value.trim();
  if (searchTerm !== "") {
    window.location.href = "https://www.google.com/search?q=" + encodeURIComponent(searchTerm);
  } else {
    showCustomAlert("Please enter first keywords to search.");
  }
};
// Bing
function bing() {
  const searchTerm = document.getElementById("search").value.trim();
  if (searchTerm !== "") {
    window.location.href = "https://www.bing.com/search?q=" + encodeURIComponent(searchTerm);
  } else {
    showCustomAlert("Please enter first keywords to search with Bing.");
  }
};
// DuckDuckGo
function duckduckgo() {
  const searchTerm = document.getElementById("search").value.trim();
  if (searchTerm !== "") {
    window.location.href = "https://duckduckgo.com/?q=" + encodeURIComponent(searchTerm);
  } else {
    showCustomAlert("Please enter first keywords to search with DuckDuckGo.");
  }
};
// Yandex
function yandex() {
  const searchTerm = document.getElementById("search").value.trim();
  if (searchTerm !== "") {
    window.location.href = "https://www.yandex.com/search/?text=" + encodeURIComponent(searchTerm) + "&from=os&clid=1836588&lr=10616";
  } else {
    showCustomAlert("Please enter first keywords to search with Yandex.");
  }
};
// Yahoo
function yahoo() {
  const searchTerm = document.getElementById("search").value.trim();
  if (searchTerm !== "") {
    window.location.href = "https://search.yahoo.com/search?ei=UTF-8&fr=crmas_sfp&p=" + encodeURIComponent(searchTerm);
  } else {
    showCustomAlert("Please enter first keywords to search with Yahoo.");
  }
};
// Event listeners for search buttons
document.getElementById("google-btn").addEventListener("click", google);
document.getElementById("bing-btn").addEventListener("click", bing);
document.getElementById("duckduck-btn").addEventListener("click", duckduckgo);
document.getElementById("yandex-btn").addEventListener("click", yandex);
document.getElementById("yahoo-btn").addEventListener("click", yahoo);

// Event listener for "Enter" key in the search input
document.getElementById("search").addEventListener("keypress", function (event) {
  if (event.key === "Enter") {
    // Default search engine on Enter
    google();
  }
})