document.addEventListener("DOMContentLoaded", () => {
  const params = new URLSearchParams(window.location.search);
  const targetUrl = params.get("url");
  const iframe = document.getElementById("home-iframe");
  if (targetUrl && iframe) {
    iframe.src = targetUrl;
  }
});