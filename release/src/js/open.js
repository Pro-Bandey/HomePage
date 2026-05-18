document.addEventListener("DOMContentLoaded", () => {
  // 1. Get the 'url' parameter from the Side Panel URL
  // Example: open.html?url=https://example.com
  const params = new URLSearchParams(window.location.search);
  const targetUrl = params.get("url");

  // 2. Select the iframe element
  const iframe = document.getElementById("home-iframe");

  // 3. If a URL is present, load it into the iframe
  if (targetUrl && iframe) {
    iframe.src = targetUrl;
  }
});