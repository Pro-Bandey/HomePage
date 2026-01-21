const openPopup = document.getElementById("mri-btn"),
  drop = document.getElementById("popup-mri"),
  overlay = document.getElementById("overlay-mri");
(openPopup.addEventListener("click", () => {
  ((drop.style.display = "block"), (overlay.style.display = "block"));
}),
  overlay.addEventListener("click", () => {
    ((drop.style.display = "none"), (overlay.style.display = "none"));
  }));
