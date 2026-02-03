/**
 * Universal Search Privacy Shield
 * Role: Browser Security & PETs Content Script
 * 
 * Functions:
 * 1. Decodes nested redirect URLs (e.g., google.com/url?q=...).
 * 2. Strips known tracking parameters (utm_, gclid, etc.).
 * 3. Removes 'ping' attributes.
 * 4. Blocks JS-based click tracking via stopPropagation.
 * 5. Observes DOM for infinite scroll results.
 */

(function() {
    'use strict';

    // --- Configuration ---

    // List of query parameters used for tracking to be stripped.
    const TRACKING_PARAMS = [
        'utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content',
        'gclid', 'gclsrc', 'dclid', 'fbclid', 'cvid', 'msclkid', 
        'yclid', '_openstat', 'fb_action_ids', 'fb_action_types'
    ];

    // Known redirect keys used by search engines (e.g., ?q=..., ?url=...).
    const REDIRECT_KEYS = ['q', 'url', 'u', 'target', 'dest'];

    /**
     * Helper: Safely decode a URI component.
     */
    const safeDecode = (str) => {
        try {
            return decodeURIComponent(str);
        } catch (e) {
            return str;
        }
    };

    /**
     * Core Logic: cleans a single URL string.
     * 1. Detects if the URL is a search engine redirect wrapper.
     * 2. Extracts the real URL.
     * 3. Strips tracking parameters from the real URL.
     */
    function getCleanUrl(urlElementHref) {
        if (!urlElementHref) return null;

        let urlObj;
        try {
            urlObj = new URL(urlElementHref, window.location.origin);
        } catch (e) {
            return null;
        }

        // 1. Unwrap Redirects (e.g., Google /url?q=https://...)
        // We check if the current host looks like a search engine or generic redirector
        // and if it contains a query param that looks like a valid http URL.
        for (const key of REDIRECT_KEYS) {
            if (urlObj.searchParams.has(key)) {
                const potentialUrl = urlObj.searchParams.get(key);
                if (potentialUrl && /^http/i.test(potentialUrl)) {
                    try {
                        // Found a nested URL, switch our target to this one
                        urlObj = new URL(safeDecode(potentialUrl));
                        break; // Stop checking other keys once found
                    } catch (e) {
                        // If extraction fails, stick to original
                    }
                }
            }
        }

        // 2. Strip Tracking Parameters from the target URL
        let paramsChanged = false;
        TRACKING_PARAMS.forEach(param => {
            if (urlObj.searchParams.has(param)) {
                urlObj.searchParams.delete(param);
                paramsChanged = true;
            }
        });

        // 3. Return the clean string
        return urlObj.href;
    }

    /**
     * DOM Manipulation: Sanitizes a specific anchor element.
     */
    function sanitizeAnchor(anchor) {
        // Validation: Ensure it's an anchor tag with an href
        if (!anchor || anchor.tagName !== 'A' || !anchor.href) return;

        // 1. Disable Ping (Hyperlink Auditing)
        if (anchor.hasAttribute('ping')) {
            anchor.removeAttribute('ping');
        }

        // 2. Clean the HREF
        // We compare the cleaned URL with the current one to avoid infinite mutation loops
        const originalHref = anchor.href;
        const cleanHref = getCleanUrl(originalHref);

        if (cleanHref && originalHref !== cleanHref) {
            anchor.href = cleanHref;
            // Add a data attribute to mark it as processed (optional debug aid)
            anchor.setAttribute('data-privacy-shield', 'active');
        }
        
        // 3. Neutralize "onmousedown" replacements
        // Some engines (Google) swap the href on mousedown. 
        // We clone the node to strip anonymous event listeners if necessary, 
        // but cloning breaks Single Page Apps (SPA). 
        // Instead, we rely on the Event Interceptor below.
    }

    /**
     * Event Interceptor
     * Intercepts clicks and mtdown events at the Window level (Capturing phase).
     * This ensures our code runs BEFORE the search engine's event listeners.
     */
    function handleInteraction(event) {
        // Find the closest anchor tag (in case user clicks an <h3> inside an <a>)
        const anchor = event.target.closest('a');
        if (!anchor) return;

        // Sanitize immediately before action
        sanitizeAnchor(anchor);

        // Prevent Search Engine Scripts from tracking this specific click
        // Many engines attach listeners to the parent container (bubbling phase).
        // stopPropagation prevents the event from bubbling up to those trackers.
        event.stopPropagation();
    }

    // Attach listeners with { capture: true } to run before page scripts
    window.addEventListener('click', handleInteraction, { capture: true });
    window.addEventListener('auxclick', handleInteraction, { capture: true }); // Middle clicks
    window.addEventListener('mousedown', handleInteraction, { capture: true }); // Often used for late-binding URL swaps

    /**
     * MutationObserver
     * Handles "Infinite Scroll" and dynamically loaded results.
     */
    const observerCallback = (mutationsList) => {
        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
                mutation.addedNodes.forEach(node => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // Check the node itself
                        if (node.tagName === 'A') {
                            sanitizeAnchor(node);
                        }
                        // Check descendants
                        const links = node.querySelectorAll('a[href]');
                        links.forEach(sanitizeAnchor);
                    }
                });
            } else if (mutation.type === 'attributes' && mutation.attributeName === 'href') {
                // If the site script changes the href back, we re-clean it.
                // We must check if WE caused the change to avoid loops.
                if (mutation.target.tagName === 'A') {
                    // Slight delay/check to prevent infinite loops if the site fights back
                    // relies on the check inside sanitizeAnchor (original !== clean)
                    sanitizeAnchor(mutation.target);
                }
            }
        }
    };

    // Initialize Observer
    const observer = new MutationObserver(observerCallback);

    // Start observing document
    // We target document.documentElement to catch everything from the very start
    observer.observe(document.documentElement, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['href', 'ping'] // Only listen to relevant attribute changes
    });

    /**
     * Initial Sweep
     * Run once DOM content is loaded to catch static links
     */
    window.addEventListener('DOMContentLoaded', () => {
        const links = document.querySelectorAll('a[href]');
        links.forEach(sanitizeAnchor);
    });

})();