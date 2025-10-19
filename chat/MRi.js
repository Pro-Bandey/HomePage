const storageKey = 'lastActiveSearchTab';

/**
 * Activates a specified tab and updates UI.
 * @param {string} tabName The ID of the tab to activate (e.g., 'google').
 */
function openTab(tabName) {
    // Deactivate all tab contents
    document.querySelectorAll(".tab-content").forEach(content => {
        content.classList.remove("active");
        content.setAttribute('aria-hidden', 'true');
    });

    // Deactivate all tab buttons
    document.querySelectorAll(".tab-button").forEach(button => {
        button.classList.remove("active");
        button.setAttribute('aria-selected', 'false');
        button.setAttribute('tabindex', '-1'); // Make non-active buttons not directly tabbable
    });

    // Activate the target tab content
    const activeTabContent = document.getElementById(tabName);
    if (activeTabContent) {
        activeTabContent.classList.add("active");
        activeTabContent.setAttribute('aria-hidden', 'false');
    }

    // Activate the corresponding tab button
    const activeTabButton = document.getElementById(`tab-${tabName}`);
    if (activeTabButton) {
        activeTabButton.classList.add("active");
        activeTabButton.setAttribute('aria-selected', 'true');
        activeTabButton.setAttribute('tabindex', '0'); // Make active button tabbable
    }

    // Save the active tab to chrome.storage.local
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.set({ [storageKey]: tabName });
    }
}

// Attach event listeners to all tab buttons
document.addEventListener("DOMContentLoaded", function() {
    const tabButtons = document.querySelectorAll(".tab-button");
    tabButtons.forEach(button => {
        button.addEventListener("click", function() {
            const tabName = this.dataset.tab; // Get tab name from data-tab attribute
            openTab(tabName);
        });
    });

    // Initialize: open the last active tab from chrome.storage.local or the first tab by default
    if (typeof chrome !== 'undefined' && chrome.storage && chrome.storage.local) {
        chrome.storage.local.get(storageKey, function(result) {
            const savedTab = result[storageKey];
            const initialTab = savedTab || 'google'; // Default to 'google'
            openTab(initialTab);
        });
    } else {
        // Fallback for non-extension environments (e.g., direct browser opening)
        // or if chrome API is not available (e.g., in Firefox without specific setup)
        const savedTab = localStorage.getItem(storageKey);
        const initialTab = savedTab || 'google';
        openTab(initialTab);
    }
});
