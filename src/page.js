// Background Images
const backgrounds = [
    'url("src/assets/bg_001.jpg")', 'url("src/assets/bg_002.jpg")', 'url("src/assets/bg_003.jpg")',
    'url("src/assets/bg_004.jpg")', 'url("src/assets/bg_005.jpg")', 'url("src/assets/bg_006.jpg")',
    'url("src/assets/bg_007.jpg")', 'url("src/assets/bg_008.jpg")', 'url("src/assets/bg_009.jpg")',
    'url("src/assets/bg_010.jpg")', 'url("src/assets/bg_011.jpg")', 'url("src/assets/bg_012.jpg")',
    'url("src/assets/bg_013.jpg")'
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

    alertBoxOkBtn.onclick = function() {
        overlay.style.display = "none";
        alertBox.style.display = "none";
    };
    overlay.onclick = function(event) {
        if (event.target === overlay) {
            overlay.style.display = "none";
            alertBox.style.display = "none";
        }
    };
};
// Elements for date, time, and uptime display
const currentTimeElement = document.getElementById("time");
const currentDayElement = document.getElementById("day");
const currentDateElement = document.getElementById("date");
const uptimeElement = document.getElementById("uptime");

// Timestamp when the page started.
let startTime = Date.now();
//  Updates the current time, day, and date displayed on the page.
function updateDateTime() {
    const now = new Date();
    const hours = now.getHours();
    const minutes = now.getMinutes();
    const seconds = now.getSeconds();
    const ampm = hours >= 12 ? "PM" : "AM";

    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const dayName = days[now.getDay()];
    const date = now.getDate();
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthName = months[now.getMonth()];
    const year = now.getFullYear();

    const timeString = `${padZero(hours % 12 || 12)}:${padZero(minutes)}:${padZero(seconds)} ${ampm}`;
    const dateString = `${date} ${monthName} ${year}`;

    currentTimeElement.textContent = timeString;
    currentDateElement.textContent = dateString;
    currentDayElement.textContent = dayName;
};
//  Updates the uptime counter displayed on the page.
function updateUptime() {
    let elapsedTime = Date.now() - startTime;
    let milliseconds = Math.floor(elapsedTime / 100) % 100; // Display hundredths of a second
    let seconds = Math.floor(elapsedTime / 1000) % 60;
    let minutes = Math.floor(elapsedTime / 60000) % 60;
    let hours = Math.floor(elapsedTime / 3600000);

    uptimeElement.textContent = `Uptime: ${padZero(hours)}:${padZero(minutes)}:${padZero(seconds)}-${padZero(milliseconds)}`;
};
// Adds a leading zero to numbers less than 10.
function padZero(num) {
    return (num < 10 ? "0" : "") + num;
};
// The main animation loop that updates date, time, and uptime using `requestAnimationFrame`.
function loop() {
    updateDateTime();
    updateUptime();
    requestAnimationFrame(loop);
};
loop();

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
document.getElementById("search").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        // Default search engine on Enter
        google();
    }
});

// To do list  Function
// Loads tasks from local storage and displays them in the to-do list.
function loadTasks() {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    const todoList = document.getElementById("todo-list");
    // Clear existing tasks before loading
    todoList.innerHTML = "";

    tasks.forEach(taskText => {
        const listItemContainer = document.createElement("div");
        listItemContainer.innerHTML = `
            <div class="list-t">
                <li>${taskText}</li>
                <div class="remove-btn">
                    <img src="src/assets/dlt.svg" alt="Delete">
                </div>
            </div>`;
        todoList.appendChild(listItemContainer);

        listItemContainer.querySelector(".remove-btn").addEventListener("click", function() {
            removeTask(taskText);
            listItemContainer.remove();
        });
    });
};
// Saves a new task to local storage.
function saveTask(taskText) {
    const tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks.push(taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
};
//  Removes a task from local storage.
function removeTask(taskText) {
    let tasks = JSON.parse(localStorage.getItem("tasks")) || [];
    tasks = tasks.filter(task => task !== taskText);
    localStorage.setItem("tasks", JSON.stringify(tasks));
};
// Event listener for adding a new task
document.getElementById("add-task-btn").addEventListener("click", function() {
    const newTaskInput = document.getElementById("new-task");
    const taskText = newTaskInput.value.trim();

    if (taskText !== "") {
        const todoList = document.getElementById("todo-list");
        const listItemContainer = document.createElement("div"); // Use a div to wrap li and button
        listItemContainer.innerHTML = `
            <div class="list-t">
                <li>${taskText}</li>
                <div class="remove-btn">
                    <img src="src/assets/dlt.svg" alt="Delete">
                </div>
            </div>`;
        todoList.appendChild(listItemContainer);

        newTaskInput.value = ""; // Clear the input field
        saveTask(taskText);

        listItemContainer.querySelector(".remove-btn").addEventListener("click", function() {
            removeTask(taskText);
            listItemContainer.remove();
        });
    } else {
        showCustomAlert("Please enter a task.");
    }
});
// Load existing tasks when the page loads
loadTasks();


document.addEventListener('DOMContentLoaded', () => {
  const button = document.getElementById('openTab');
  if (!button) return;

  button.addEventListener('click', () => {
    try {
      // Chrome and Edge
      if (typeof chrome !== 'undefined' && chrome.tabs && chrome.tabs.create) {
        chrome.tabs.create({ url: 'chrome://newtab/' });
        window.close();
      } 
      // Firefox
      else if (typeof browser !== 'undefined' && browser.tabs && browser.tabs.create) {
        browser.tabs.create({ url: 'about:newtab' });
        window.close();
      } 
      // Fallback
      else {
        window.open('about:blank', '_blank');
      }
    } catch (e) {
      console.error('Error creating new tab:', e);
    }
  });
});
