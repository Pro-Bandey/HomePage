const openSearchPopupBtn = document.getElementById("showHistory-btn");
const searchPopup = document.getElementById("historyListBox");
const searchOverlay = document.getElementById("historyBox-overlay");

// Event listener to open the 'SearchHistory Box' popup.
openSearchPopupBtn.addEventListener("click", () => {
  searchPopup.style.display = "flex";
  searchOverlay.style.display = "block";
});

// Event listener to close the 'History Box' popup when clicking its overlay.
searchOverlay.addEventListener("click", () => {
  searchPopup.style.display = "none";
  searchOverlay.style.display = "none";
});

// Elements for the 'Calc' popup
const calcBtn = document.getElementById("calc-btn");
const calccloseBtn = document.getElementById("calc-close");
const calcPan = document.getElementById("calc-pan");
const calcOverlay = document.getElementById("calc-overlay");
// Event listener to open the 'Calc' popup.
calcBtn.addEventListener("click", () => {
  calcPan.style.display = "flex";
  calcOverlay.style.display = "block";
});
// Event listener to close the 'Calc Info' popup.
calccloseBtn.addEventListener("click", () => {
  calcPan.style.display = "none";
  calcOverlay.style.display = "none";
});
// Event listener to close the 'Calc' popup when clicking the overlay.
calcOverlay.addEventListener("click", () => {
  calcPan.style.display = "none";
  calcOverlay.style.display = "none";
});

// Elements for the 'ToDo' popup
const todoBtn = document.getElementById("todo-btn");
const todocloseBtn = document.getElementById("todo-close");
const todoPan = document.getElementById("todo-pan");
const todoverlay = document.getElementById("todo-overlay");
// Event listener to open the 'ToDo' popup.
todoBtn.addEventListener("click", () => {
  todoPan.style.display = "flex";
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
const mriBtn = document.getElementById("mri-btn");
const mriCloseBtn = document.getElementById("mri-close");
const mriPopup = document.getElementById("popup");
const overlay = document.getElementById("overlay");
// Event listener to open the 'MRi' popup.
mriBtn.addEventListener("click", () => {
  mriPopup.style.display = "block";
  overlay.style.display = "block";
});
// Event listener to close the 'More Info' popup.
mriCloseBtn.addEventListener("click", () => {
  mriPopup.style.display = "none";
  overlay.style.display = "none";
});
// Event listener to close the 'MRi' popup when clicking the overlay.
overlay.addEventListener("click", () => {
  mriPopup.style.display = "none";
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

// Elements for the 'Info Bar' popup
const openInfoBarBtn = document.getElementById("info-btn");
const closeInfoBtn = document.getElementById("info-close");
const infoBarPopup = document.getElementById("info-bar");
const infoBarOverlay = document.getElementById("info-overlay");
// Event listener to open the 'Info Bar' popup.
openInfoBarBtn.addEventListener("click", () => {
  infoBarOverlay.style.display = "block";
  infoBarPopup.style.display = "flex";
});
// Event listener to close the 'Cal' popup.
closeInfoBtn.addEventListener("click", () => {
  infoBarPopup.style.display = "none";
  infoBarOverlay.style.display = "none";
});
// Event listener to close the 'Info Bar' popup when clicking its overlay.
infoBarOverlay.addEventListener("click", () => {
  infoBarPopup.style.display = "none";
  infoBarOverlay.style.display = "none";
});

