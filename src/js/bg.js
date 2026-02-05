const backgrounds = [
  'url("../src/assets/bg_001.jpg")', 'url("../src/assets/bg_002.jpg")', 'url("../src/assets/bg_003.jpg")',
  'url("../src/assets/bg_004.jpg")', 'url("../src/assets/bg_005.jpg")', 'url("../src/assets/bg_006.jpg")',
  'url("../src/assets/bg_007.jpg")', 'url("../src/assets/bg_008.jpg")', 'url("../src/assets/bg_009.jpg")',
  'url("../src/assets/bg_010.jpg")', 'url("../src/assets/bg_011.jpg")', 'url("../src/assets/bg_012.jpg")',
  'url("../src/assets/bg_013.jpg")'
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
