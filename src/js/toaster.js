/**
* Universal Toaster
* A lightweight, zero-dependency tooltip script.
* 
* Features:
* - Replaces native browser tooltips
* - Smart positioning (viewport awareness)
* - Auto-color adaptation (Dark/Light mode)
* - Single-line display
*/

window.UniversalToasterConfig = {
    // COLORS
    // Set to null to allow Auto-Contrast (Recommended)
    backgroundColor: "var(--bg)",   // e.g. "#333" or null
    textColor: "var(--text)",   // e.g. "#fff" or null

    // TYPOGRAPHY
    fontFamily: "inherit", // Uses page font
    fontSize: "13px",
    fontWeight: "500",
    fontTransform: "capitalize",  // e.g. "uppercase", "lowercase", "capitalize"  or null

    // SHAPE
    borderRadius: "var(--radius-sm)",
    padding: "8px 12px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
};


(function () {
    // 1. Load User Configuration (or use empty defaults)
    const config = window.UniversalToasterConfig || {};

    // 2. CSS Variables & Injection
    const style = document.createElement('style');

    // Default values if config is missing
    const borderRadius = config.borderRadius || '6px';
    const fontSize = config.fontSize || '13px';
    const fontTransform = config.fontTransform || 'capitalize';
    const fontWeight = config.fontWeight || 'normal';
    const padding = config.padding || '8px 12px';
    const fontFamily = config.fontFamily || 'inherit'; // Inherit uses the page's font

    style.innerHTML = `
        .universal-toaster-popup {
            position: fixed;
            z-index: 2147483647; /* Max Safe Integer */
            pointer-events: none;
            opacity: 0;
            transition: opacity 0.15s ease-out;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            border: 1px solid rgba(255,255,255,0.05);
            
            /* User Configured Styles */
            border-radius: ${borderRadius};
            font-size: ${fontSize};
            font-weight: ${fontWeight};
            padding: ${padding};
            font-family: ${fontFamily};
            text-transform: ${fontTransform};
            
            /* Force Single Line Logic */
            white-space: nowrap; 
            overflow: hidden;
            text-overflow: ellipsis;
            max-width: 90vw; /* Prevent screen overflow on mobile */
        }
        .universal-toaster-popup.visible {
            opacity: 1;
        }
    `;
    document.head.appendChild(style);

    // 3. Create the Toaster Element
    const toaster = document.createElement('div');
    toaster.className = 'universal-toaster-popup';
    document.body.appendChild(toaster);

    // 4. State Management
    let activeElement = null;
    const offset = 15; // Distance from cursor

    // --- Helper: Auto-Contrast Logic ---
    function getTheme() {
        // A. User Override: If defined in config, use it.
        if (config.backgroundColor && config.textColor) {
            return { bg: config.backgroundColor, text: config.textColor };
        }

        // B. Auto-Detect: Check underlying page background
        let computedStyle = window.getComputedStyle(document.body);
        let bgColor = computedStyle.backgroundColor;

        // Handle transparent backgrounds (assume white page)
        if (bgColor === 'rgba(0, 0, 0, 0)' || bgColor === 'transparent') {
            bgColor = 'rgb(255, 255, 255)';
        }

        // Calculate YIQ Brightness
        const rgb = bgColor.match(/\d+/g);
        let isLight = true;
        if (rgb) {
            const brightness = Math.round(((parseInt(rgb[0]) * 299) + (parseInt(rgb[1]) * 587) + (parseInt(rgb[2]) * 114)) / 1000);
            if (brightness < 128) isLight = false; // Page is dark
        }

        // Return High Contrast Opposites
        return {
            bg: config.backgroundColor ? config.backgroundColor : (isLight ? '#222222' : '#ffffff'),
            text: config.textColor ? config.textColor : (isLight ? '#ffffff' : '#000000')
        };
    }

    // 5. Event: Mouse Enter
    document.addEventListener('mouseover', function (e) {
        // Find closest element with title or already converted title
        const target = e.target.closest('[title], [data-toaster-title]');

        if (target) {
            // Swap native 'title' to 'data-toaster-title' to suppress browser default
            if (target.hasAttribute('title')) {
                const text = target.getAttribute('title');
                if (text && text.trim() !== "") {
                    target.setAttribute('data-toaster-title', text);
                    target.removeAttribute('title');
                }
            }

            const text = target.getAttribute('data-toaster-title');

            if (text) {
                activeElement = target;
                toaster.textContent = text;

                // Apply Dynamic Colors
                const theme = getTheme();
                toaster.style.backgroundColor = theme.bg;
                toaster.style.color = theme.text;

                toaster.classList.add('visible');
            }
        }
    });

    // 6. Event: Mouse Move (Smart Positioning)
    document.addEventListener('mousemove', function (e) {
        if (!toaster.classList.contains('visible')) return;

        const rect = toaster.getBoundingClientRect();
        const winW = window.innerWidth;
        const winH = window.innerHeight;

        let x = e.clientX + offset;
        let y = e.clientY + offset;

        // Collision Detection: Right Edge
        // If tooltip hits right side, flip to left of cursor
        if (x + rect.width > winW) {
            x = e.clientX - rect.width - offset;
        }

        // Collision Detection: Bottom Edge
        // If tooltip hits bottom, flip to above cursor
        if (y + rect.height > winH) {
            y = e.clientY - rect.height - offset;
        }

        toaster.style.left = x + 'px';
        toaster.style.top = y + 'px';
    });

    // 7. Event: Mouse Leave
    document.addEventListener('mouseout', function (e) {
        const target = e.target.closest('[data-toaster-title]');
        if (target && target === activeElement) {
            toaster.classList.remove('visible');
            activeElement = null;
        }
    });

})();
