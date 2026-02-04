
const backgrounds = [
  'url("../src/assets/bg_001.jpg")', 'url("../src/assets/bg_002.jpg")', 'url("../src/assets/bg_003.jpg")',
  'url("../src/assets/bg_004.jpg")', 'url("../src/assets/bg_005.jpg")', 'url("../src/assets/bg_006.jpg")',
  'url("../src/assets/bg_007.jpg")', 'url("../src/assets/bg_008.jpg")', 'url("../src/assets/bg_009.jpg")',
  'url("../src/assets/bg_010.jpg")', 'url("../src/assets/bg_011.jpg")', 'url("../src/assets/bg_012.jpg")',
  'url("../src/assets/bg_013.jpg")'
];

let currentIndex = Math.floor(Math.random() * backgrounds.length);

// =========================================================
//  HELPER FUNCTIONS
// =========================================================

// Fixes paths: CSS uses "../src" but JS running in HTML needs "src"
function getCleanUrl(urlStr) {
    let url = urlStr.replace('url("', '').replace('")', '');
    // If path starts with ../ remove it to make it relative to root HTML
    if (url.startsWith('../')) {
        url = url.substring(3); // Removes the first 3 chars (../)
    }
    return url;
}

function preloadImages(imageUrls) {
    imageUrls.forEach(url => {
        const img = new Image();
        img.src = getCleanUrl(url);
    });
}

// Convert RGB to Hex Helper
function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
}

// Convert RGB to HSL Helper (for generating palettes)
function rgbToHsl(r, g, b) {
    r /= 255; g /= 255; b /= 255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;

    if (max === min) {
        h = s = 0; 
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    return { h: h * 360, s: s * 100, l: l * 100 };
}

// HSL to Hex Helper
function hslToHex(h, s, l) {
    l /= 100;
    const a = s * Math.min(l, 1 - l) / 100;
    const f = n => {
        const k = (n + h / 30) % 12;
        const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
        return Math.round(255 * color).toString(16).padStart(2, '0');
    };
    return `#${f(0)}${f(8)}${f(4)}`;
}

// =========================================================
//  THEME GENERATOR
// =========================================================

function applyTheme(r, g, b) {
    console.log(`🎨 Applying Theme from Color: RGB(${r}, ${g}, ${b})`);
    
    const hsl = rgbToHsl(r, g, b);
    const hue = hsl.h;
    const sat = Math.min(hsl.s, 80); // Cap saturation so it's not neon
    
    // Detect Dark Mode
    const isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;

    const root = document.documentElement;

    if (isDark) {
        // Dark Mode Mappings
        root.style.setProperty('--accent', hslToHex(hue, sat, 80));       // Pastel Accent
        root.style.setProperty('--accent-h', hslToHex(hue, sat, 30));     // Dark Container
        root.style.setProperty('--accent-soft', hslToHex(hue, sat, 80) + '99');
        root.style.setProperty('--bg', hslToHex(hue, 15, 8));             // Very Dark Tinted BG
        root.style.setProperty('--transulent-bg', hslToHex(hue, 15, 12) + 'd9');
        root.style.setProperty('--text', '#ececec');
        root.style.setProperty('--border', hslToHex(hue, 10, 30));
        root.style.setProperty('--border-c', hslToHex(hue, sat, 80) + '4d');
        root.style.setProperty('--gray-mid', '#333333');
        root.style.setProperty('--overlay', '#00000080');
        root.style.setProperty('--alert-bg', '#1a1a1ae6');
        root.style.setProperty('--alert-heading-bg', hslToHex(hue, sat, 30));
        root.style.setProperty('--alert-heading', hslToHex(hue, sat, 90));
        root.style.setProperty('--img-invert', 'invert(1)');
    } else {
        // Light Mode Mappings
        root.style.setProperty('--accent', hslToHex(hue, sat, 45));       // Deep Accent
        root.style.setProperty('--accent-h', hslToHex(hue, sat, 90));     // Light Container
        root.style.setProperty('--accent-soft', hslToHex(hue, sat, 45) + '99');
        root.style.setProperty('--bg', hslToHex(hue, 20, 97));            // Very Light Tinted BG
        root.style.setProperty('--transulent-bg', hslToHex(hue, 20, 98) + 'cc');
        root.style.setProperty('--text', '#1a1a1a');
        root.style.setProperty('--border', hslToHex(hue, 10, 80));
        root.style.setProperty('--border-c', hslToHex(hue, sat, 45) + '4d');
        root.style.setProperty('--gray-mid', '#f0f0f0');
        root.style.setProperty('--overlay', '#00000033');
        root.style.setProperty('--alert-bg', '#ffffffeb');
        root.style.setProperty('--alert-heading-bg', hslToHex(hue, sat, 90));
        root.style.setProperty('--alert-heading', hslToHex(hue, sat, 10));
        root.style.setProperty('--img-invert', 'invert(0)');
    }
}

// =========================================================
//  IMAGE PROCESSING
// =========================================================

function processImageColor(imgSrc) {
    console.log("Processing image:", imgSrc);
    const img = new Image();
    img.crossOrigin = "Anonymous"; // Crucial for CORS
    img.src = imgSrc;

    img.onload = function() {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            const ctx = canvas.getContext('2d');
            
            // Draw 1x1 pixel to average the image
            ctx.drawImage(img, 0, 0, 1, 1);
            
            const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
            applyTheme(r, g, b);
            
        } catch (error) {
            console.warn("⚠️ Security Error: Browser blocked reading image colors (CORS).");
            console.warn("Generating a random color instead...");
            // Generate Random Color Fallback
            const r = Math.floor(Math.random() * 255);
            const g = Math.floor(Math.random() * 255);
            const b = Math.floor(Math.random() * 255);
            applyTheme(r, g, b);
        }
    };

    img.onerror = function() {
        console.error("❌ Failed to load image. Check path:", imgSrc);
        // Fallback to default red
        applyTheme(244, 66, 52); 
    };
}

// =========================================================
//  MAIN FUNCTIONS
// =========================================================

function changeBackground() {
    // 1. Calculate Index
    currentIndex = (currentIndex + 1) % backgrounds.length;
    const cssBg = backgrounds[currentIndex];
    
    // 2. Set Body Background
    document.body.style.backgroundImage = cssBg;
    
    // 3. Process Color (Clean the path first)
    const cleanPath = getCleanUrl(cssBg);
    processImageColor(cleanPath);
}

// Initial Load
const initialCssBg = backgrounds[currentIndex];
document.body.style.backgroundImage = initialCssBg;
processImageColor(getCleanUrl(initialCssBg));

// Preload rest
preloadImages(backgrounds);

// Listener for Dark Mode Toggle (Live update)
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    // Re-process current image to update colors for new mode
    processImageColor(getCleanUrl(backgrounds[currentIndex]));
});

// Timer
setInterval(changeBackground, 300000); // 5 Minutes