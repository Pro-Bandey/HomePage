
const backgrounds = [
  'url("./src/assets/bg_001.jpg")', 'url("./src/assets/bg_002.jpg")', 'url("./src/assets/bg_003.jpg")',
  'url("./src/assets/bg_004.jpg")', 'url("./src/assets/bg_005.jpg")', 'url("./src/assets/bg_006.jpg")',
  'url("./src/assets/bg_007.jpg")', 'url("./src/assets/bg_008.jpg")', 'url("./src/assets/bg_009.jpg")',
  'url("./src/assets/bg_010.jpg")', 'url("./src/assets/bg_011.jpg")', 'url("./src/assets/bg_012.jpg")',
  'url("./src/assets/bg_013.jpg")'
];

let currentIndex = Math.floor(Math.random() * backgrounds.length);

function preloadImages(imageUrls) {
  imageUrls.forEach(url => {
    (new Image()).src = url.replace('url("', '').replace('")', '');
  });
}

function rgbToHsl(r, g, b) {
  r /= 255, g /= 255, b /= 255;
  let max = Math.max(r, g, b), min = Math.min(r, g, b);
  let h, s, l = (max + min) / 2;

  if (max === min) {
    h = s = 0;
  } else {
    let d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }
  return [h * 360, s, l];
}
function extractColorAndApplyTheme(imageUrl) {
  const img = new Image();
  img.crossOrigin = "Anonymous";
  img.src = imageUrl.replace('url("', '').replace('")', '');

  img.onload = function () {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    canvas.width = 100;
    canvas.height = 100 * (img.height / img.width);
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

    let imageData;
    try {
      imageData = ctx.getImageData(0, 0, canvas.width, canvas.height).data;
    } catch (e) {
      console.warn("Cannot extract colors (CORS restriction or local file). Using default fallback.");
      return;
    }

    let r = 0, g = 0, b = 0, count = 0;
    const pixelInterval = 10;

    for (let i = 0; i < imageData.length; i += 4 * pixelInterval) {
      const curR = imageData[i];
      const curG = imageData[i + 1];
      const curB = imageData[i + 2];
      const alpha = imageData[i + 3];

      if (alpha < 128 || (curR > 240 && curG > 240 && curB > 240) || (curR < 20 && curG < 20 && curB < 20)) continue;

      r += curR;
      g += curG;
      b += curB;
      count++;
    }

    if (count === 0) { count = 1; }

    const avgR = Math.round(r / count);
    const avgG = Math.round(g / count);
    const avgB = Math.round(b / count);

    applyMaterialTheme(avgR, avgG, avgB);
  };
}

function applyMaterialTheme(r, g, b) {
  const [h, s, l] = rgbToHsl(r, g, b);
  const root = document.documentElement;
  const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

  const safeS = Math.max(0.2, Math.min(s, 0.9));
  const hue = h;

  if (isDark) {
    root.style.setProperty('--accent', `hsl(${hue}, ${safeS * 100}%, 80%)`);
    root.style.setProperty('--accent-h', `hsl(${hue}, ${safeS * 100}%, 30%)`);
    root.style.setProperty('--accent-soft', `hsla(${hue}, ${safeS * 100}%, 80%, 0.6)`);
    root.style.setProperty('--bg', `hsl(${hue}, 10%, 6%)`);
    root.style.setProperty('--transulent-bg', `hsla(${hue}, 10%, 10%, 0.8)`);
    root.style.setProperty('--alert-bg', `hsla(${hue}, 10%, 12%, 0.95)`);
    root.style.setProperty('--text', `hsl(${hue}, 10%, 95%)`);
    root.style.setProperty('--border', `hsla(${hue}, 10%, 30%, 0.5)`);
    root.style.setProperty('--border-c', `hsla(${hue}, ${safeS * 100}%, 80%, 0.3)`);
    root.style.setProperty('--shadow-o', `0px 4px 12px 4px rgba(0, 0, 0, 0.5)`);

  } else {
    root.style.setProperty('--accent', `hsl(${hue}, ${safeS * 100}%, 45%)`);
    root.style.setProperty('--accent-h', `hsl(${hue}, ${safeS * 100}%, 90%)`);
    root.style.setProperty('--accent-soft', `hsla(${hue}, ${safeS * 100}%, 45%, 0.6)`);
    root.style.setProperty('--bg', `hsl(${hue}, 15%, 98%)`);
    root.style.setProperty('--transulent-bg', `hsla(${hue}, 20%, 98%, 0.8)`);
    root.style.setProperty('--alert-bg', `hsla(${hue}, 15%, 96%, 0.95)`);
    root.style.setProperty('--text', `hsl(${hue}, 15%, 10%)`);
    root.style.setProperty('--border', `hsla(${hue}, 10%, 80%, 1)`);
    root.style.setProperty('--border-c', `hsla(${hue}, ${safeS * 100}%, 45%, 0.3)`);
    root.style.setProperty('--shadow-o', `0px 4px 8px 3px hsla(${hue}, 30%, 50%, 0.15)`);
  }
}
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  extractColorAndApplyTheme(backgrounds[currentIndex]);
});


function changeBackground() {
  currentIndex = (currentIndex + 1) % backgrounds.length;
  const newBg = backgrounds[currentIndex];
  document.body.style.backgroundImage = newBg;
  extractColorAndApplyTheme(newBg);
}
document.body.style.backgroundImage = backgrounds[currentIndex];
extractColorAndApplyTheme(backgrounds[currentIndex]);
preloadImages(backgrounds);

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


  // Store a unique random color for today's date
  let today = new Date().getDate();

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
        <sup class="ampm" style="color:var(--accent);">${ampm}</sup>
        <sub class="time-sec">${padZero(seconds)}</sub>
      </span>
    `;

    const dateString = `
      ${date}<sup style="color:var(--accent-soft);">${suffix}</sup> ${monthName} ${year}
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


const searchInput = document.getElementById("search");
const searchPopup = document.getElementById("search-popup");
const suggestionsBox = document.getElementById("suggestions");
const engineBtns = document.querySelectorAll(".search-btn");

// Configuration
let defaultEngine = localStorage.getItem("defaultEngine") || "google";
let combinedSuggestions = []; // Store combined results
let debounceTimer; // Timer for typing delay

updateEngineUI();

// 1. URL Helper
function getSearchUrl(engine, term) {
  const query = encodeURIComponent(term).replace(/%20/g, "+");
  const engines = {
    google: `https://www.google.com/search?q=${query}&source=homepage`,
    brave: `https://www.search.brave.com/search?q=${query}&source=homepage`,
    startpage: `https://www.startpage.com/sp/search?query=${query}&source=homepage`,
    ecosia: `https://www.ecosia.com/search?q=${query}&source=homepage`,
    bing: `https://www.bing.com/search?q=${query}&source=homepage`,
    qwant: `https://www.qwant.com/?q=${query}&t==homepage`,
    duckduck: `https://duckduckgo.com/?q=${query}&ia=homepage`,
    yahoo: `https://search.yahoo.com/search?p=${query}`,
    yandex: `https://www.yandex.com/search/?text=${query}&lr=13184814691&search_source=homepage`
  };
  return engines[engine] || engines.google;
}

// ---------------------------------------------------------
// 2. Combined Suggestion Logic (Google, YT, DDG, Wiki Only)
// ---------------------------------------------------------

// Helper: Process and Add suggestions
function processSuggestions(items) {
  if (!items || !items.length) return;
  
  items.forEach(item => {
    // Extract text (some APIs return strings, some objects)
    const text = (typeof item === 'object' && item.text) ? item.text : item;
    
    // Deduplicate: Add only if unique
    if (text && !combinedSuggestions.some(existing => existing.toLowerCase() === text.toLowerCase())) {
      combinedSuggestions.push(text);
    }
  });

  displaySuggestions(combinedSuggestions);
}

// Main Fetch Function
async function fetchSuggestions(term) {
  if (term.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }

  // Reset list
  combinedSuggestions = [];
  
  // Fire requests (Google, YouTube, DDG, Wiki)
  fetchGoogle(term);
  fetchYouTube(term);
  fetchDuckDuckGo(term);
  fetchWikipedia(term);
}

// --- Specific Engine Fetchers ---

// Google
async function fetchGoogle(q) {
  try {
    const res = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&q=${encodeURIComponent(q)}`);
    const data = await res.json();
    if (data && data[1]) processSuggestions(data[1]);
  } catch (e) { console.error("Google Fetch Error", e); }
}

// YouTube (Uses same Google endpoint with ds=yt)
async function fetchYouTube(q) {
  try {
    const res = await fetch(`https://suggestqueries.google.com/complete/search?client=firefox&ds=yt&q=${encodeURIComponent(q)}`);
    const data = await res.json();
    if (data && data[1]) processSuggestions(data[1]);
  } catch (e) { console.error("YouTube Fetch Error", e); }
}

// DuckDuckGo
async function fetchDuckDuckGo(q) {
  try {
    const res = await fetch(`https://api.duckduckgo.com/?q=${encodeURIComponent(q)}&format=json&no_redirect=1&skip_disambig=1`);
    const data = await res.json();
    if (data && data.RelatedTopics) {
      processSuggestions(data.RelatedTopics.map(t => t.Text).filter(Boolean));
    }
  } catch (e) { console.error("DDG Fetch Error", e); }
}

// Wikipedia
async function fetchWikipedia(q) {
  try {
    const res = await fetch(`https://en.wikipedia.org/w/api.php?origin=*&action=opensearch&limit=8&search=${encodeURIComponent(q)}`);
    const data = await res.json();
    if (data && data[1]) processSuggestions(data[1]);
  } catch (e) { console.error("Wiki Fetch Error", e); }
}

// ---------------------------------------------------------
// 3. Render Logic
// ---------------------------------------------------------

function displaySuggestions(list) {
  if (!list || list.length === 0) {
    suggestionsBox.style.display = "none";
    return;
  }
  
  // Limit to 10 items
  suggestionsBox.innerHTML = list
    .slice(0, 10) 
    .map(item => `<div class="suggestion-item">${item}</div>`)
    .join("");
    
  suggestionsBox.style.display = "flex";
}

// ---------------------------------------------------------
// 4. Click & Input Logic
// ---------------------------------------------------------

engineBtns.forEach(btn => {
  const engine = btn.getAttribute("data-engine");
  // Left Click
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    defaultEngine = engine;
    localStorage.setItem("defaultEngine", engine);
    updateEngineUI();
  });
  // Right Click
  btn.addEventListener("contextmenu", (e) => {
    e.preventDefault();
    const term = searchInput.value.trim();
    if (term) window.location.href = getSearchUrl(engine, term);
  });
});

function updateEngineUI() {
  engineBtns.forEach(btn => {
    btn.classList.toggle("active-engine", btn.dataset.engine === defaultEngine);
  });
}

searchInput.addEventListener("input", function() {
  const val = this.value.trim();
  searchPopup.style.display = val !== "" ? "flex" : "none";
  clearTimeout(debounceTimer);
  
  if (val === "") {
    suggestionsBox.style.display = "none";
    return;
  }

  // Debounce 300ms
  debounceTimer = setTimeout(() => {
    fetchSuggestions(val);
  }, 300);
});

suggestionsBox.addEventListener("click", (e) => {
  if (e.target.classList.contains("suggestion-item")) {
    searchInput.value = e.target.innerText;
    window.location.href = getSearchUrl(defaultEngine, searchInput.value);
  }
});

searchInput.addEventListener("keypress", (e) => {
  if (e.key === "Enter") {
    const term = searchInput.value.trim();
    if (term) window.location.href = getSearchUrl(defaultEngine, term);
  }
});

document.addEventListener("click", (e) => {
  if (!e.target.closest(".search-box")) {
    suggestionsBox.style.display = "none";
  }
});