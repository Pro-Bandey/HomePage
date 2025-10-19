

// Elements for the 'ToDo' popup
const todoBtn = document.getElementById("todo-btn");
const todocloseBtn = document.getElementById("todo-close");
const todoPan = document.getElementById("todo-pan");
const todoverlay = document.getElementById("todo-overlay");
// Event listener to open the 'ToDo' popup.
todoBtn.addEventListener("click", () => {
    todoPan.style.display = (todoPan.style.display === "flex") ? "none" : "flex";
    todoverlay.style.display = "block";
});
// Event listener to close the 'ToDo Info' popup.
todocloseBtn.addEventListener("click", () => {
    todoPan.style.display = "none";
    todoverlay.style.display = "none";
});
// Event listener to close the 'ToDo' popup when clicking the overlay.
todoverlay.addEventListener("click", () => {
    todoPan.style.display = "none";
    todoverlay.style.display = "none";
});

// Elements for the 'MRi' popup
const openPopupBtn = document.getElementById("mri-btn");
const closePopupBtn = document.getElementById("mri-close");
const popup = document.getElementById("popup");
const overlay = document.getElementById("overlay");
// Event listener to open the 'MRi' popup.
openPopupBtn.addEventListener("click", () => {
    popup.style.display = (popup.style.display === "block") ? "none" : "block";
    overlay.style.display = "block";
});
// Event listener to close the 'More Info' popup.
closePopupBtn.addEventListener("click", () => {
    popup.style.display = "none";
    overlay.style.display = "none";
});
// Event listener to close the 'MRi' popup when clicking the overlay.
overlay.addEventListener("click", () => {
    popup.style.display = "none";
    overlay.style.display = "none";
});


// Elements for the 'Cal' popup
const openCalBtn = document.getElementById("cal-btn");
const closeCalBtn = document.getElementById("cal-close");
const calPopup = document.getElementById("cal-popup");
const calOverlay = document.getElementById("cal-overlay");
// Event listener to open the 'Cal' popup.
openCalBtn.addEventListener("click", () => {
    calPopup.style.display = "block";
    calOverlay.style.display = "block";
});
// Event listener to close the 'Cal' popup.
closeCalBtn.addEventListener("click", () => {
    calPopup.style.display = "none";
    calOverlay.style.display = "none";
});
// Event listener to close the 'Cal' popup when clicking its overlay.
calOverlay.addEventListener("click", () => {
    calPopup.style.display = "none";
    calOverlay.style.display = "none";
});

// Elements for the 'Search' popup
const openSearchPopupBtn = document.getElementById("search-btn");
const searchPopup = document.getElementById("search-popup");
const searchOverlay = document.getElementById("search-overlay");
// Event listener to open the 'Search' popup.
openSearchPopupBtn.addEventListener("click", () => {
    searchPopup.style.display = (infoBarOverlay.style.display === "flex") ? "none" : "flex";
    searchOverlay.style.display = "block";
});
// Event listener to close the 'Search' popup when clicking its overlay.
searchOverlay.addEventListener("click", () => {
    searchPopup.style.display = "none";
    searchOverlay.style.display = "none";
});


// Elements for the 'Info Bar' popup
const openInfoBarBtn = document.getElementById("info-btn");
const infoBarPopup = document.getElementById("info-bar");
const infoBarOverlay = document.getElementById("info-overlay");
// Event listener to open the 'Info Bar' popup.
openInfoBarBtn.addEventListener("click", () => {
    infoBarOverlay.style.display = (infoBarOverlay.style.display === "block") ? "none" : "block";
    infoBarPopup.style.display = (infoBarPopup.style.display === "flex") ? "none" : "flex";
});
// Event listener to close the 'Info Bar' popup when clicking its overlay.
infoBarOverlay.addEventListener("click", () => {
    infoBarPopup.style.display = "none";
    infoBarOverlay.style.display = "none";
});
