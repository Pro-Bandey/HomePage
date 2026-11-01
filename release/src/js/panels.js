const openSearchPopupBtn = document.getElementById("historyListBoxBtn");
const searchPopup = document.getElementById("historyListBox");
const searchOverlay = document.getElementById("historyBox-overlay");
openSearchPopupBtn.addEventListener("click", () => {
  searchPopup.style.display = "flex";
  searchOverlay.style.display = "block";
});
searchOverlay.addEventListener("click", () => {
  searchPopup.style.display = "none";
  searchOverlay.style.display = "none";
});


const calcBtn = document.getElementById("calc-btn");
const calccloseBtn = document.getElementById("calc-close");
const calcPan = document.getElementById("calc-pan");
const calcOverlay = document.getElementById("calc-overlay");
calcBtn.addEventListener("click", () => {
  calcPan.style.display = "flex";
  calcOverlay.style.display = "block";
});
calccloseBtn.addEventListener("click", () => {
  calcPan.style.display = "none";
  calcOverlay.style.display = "none";
});
calcOverlay.addEventListener("click", () => {
  calcPan.style.display = "none";
  calcOverlay.style.display = "none";
});


const todoBtn = document.getElementById("todo-btn");
const todocloseBtn = document.getElementById("todo-close");
const todoPan = document.getElementById("todo-pan");
const todoverlay = document.getElementById("todo-overlay");
todoBtn.addEventListener("click", () => {
  todoPan.style.display = "flex";
  todoverlay.style.display = "block";
});
todocloseBtn.addEventListener("click", () => {
  todoPan.style.display = "none";
  todoverlay.style.display = "none";
});
todoverlay.addEventListener("click", () => {
  todoPan.style.display = "none";
  todoverlay.style.display = "none";
});


const openCalBtn = document.getElementById("cal-btn");
const closeCalBtn = document.getElementById("cal-close");
const calPopup = document.getElementById("cal-popup");
const calOverlay = document.getElementById("cal-overlay");
openCalBtn.addEventListener("click", () => {
  calPopup.style.display = "block";
  calOverlay.style.display = "block";
});
closeCalBtn.addEventListener("click", () => {
  calPopup.style.display = "none";
  calOverlay.style.display = "none";
});
calOverlay.addEventListener("click", () => {
  calPopup.style.display = "none";
  calOverlay.style.display = "none";
});


const openInfoBarBtn = document.getElementById("info-btn");
const closeInfoBtn = document.getElementById("info-close");
const infoBarPopup = document.getElementById("info-bar");
const infoBarOverlay = document.getElementById("info-overlay");
openInfoBarBtn.addEventListener("click", () => {
  infoBarOverlay.style.display = "block";
  infoBarPopup.style.display = "flex";
});
closeInfoBtn.addEventListener("click", () => {
  infoBarPopup.style.display = "none";
  infoBarOverlay.style.display = "none";
});
infoBarOverlay.addEventListener("click", () => {
  infoBarPopup.style.display = "none";
  infoBarOverlay.style.display = "none";
});

