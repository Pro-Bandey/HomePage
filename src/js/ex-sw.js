// ============================================================================
// service-worker.js (2025-safe version)
// Everything preserved including commented code
// ============================================================================

// ============================================================================
// CONSTANTS
// ============================================================================
const CACHE_KEY = "HomePage";

// Domains to always fetch fresh
const API_URLS = [
  "google.com/s2/favicons",
  "icons.duckduckgo.com",
  "logo.clearbit.com",
];

// ============================================================================
// CHROME EXTENSION LOGIC
// ============================================================================
if (typeof chrome !== "undefined" && chrome.runtime) {
  // ----------------------
  // Uninstall feedback page (Chromium only)
  // ----------------------
  if (chrome.runtime.setUninstallURL) {
    chrome.runtime.setUninstallURL("https://Pro-Bandey.github.io/help/");
  }

  // ----------------------
  // Open homepage when extension icon clicked
  // ----------------------
  if (chrome.action && chrome.tabs) {
    chrome.action.onClicked.addListener(() => {
      const url = chrome.runtime.getURL("./index.html");
      chrome.tabs.create({ url });
    });
  }

  /*
    // Open homepage on first install  
    chrome.runtime.onInstalled.addListener((details) => {
      console.log('Homepage Extension with Context Menu Installed');
      if (details.reason === 'install') {
        const url = chrome.runtime.getURL('./wel.html');
        chrome.tabs.create({ url });
      }
    });
  */

  // ----------------------
  // Reminder alarm handling
  // ----------------------
  chrome.alarms.onAlarm.addListener((alarm) => {
    chrome.storage.local.get(alarm.name, (result) => {
      const reminder = result[alarm.name];
      if (reminder) {
        const data = { ...reminder, id: alarm.name };
        chrome.storage.sync.get({ missedReminders: [] }, (res) => {
          const updated = [...res.missedReminders, data];
          chrome.storage.sync.set({ missedReminders: updated }, () => {
            chrome.runtime.sendMessage(
              { action: "reminderFired", ...data },
              () => {
                if (chrome.runtime.lastError) {
                  // popup closed
                }
              }
            );
          });
        });
      }
    });
  });

  // ----------------------
  // Handle messages from popup or background
  // ----------------------
  /*
  chrome.runtime.onMessage.addListener((msg, sender) => {
    if (msg.action === 'openReadingMode' && chrome.sidePanel) {
      chrome.sidePanel.open({ windowId: sender.tab.windowId });
      chrome.sidePanel.setOptions({
        tabId: sender.tab.id,
        path: './index.html.html',
        enabled: true
      });
    }

    if (msg.action === 'viewSource' && msg.url) {
      const viewSourceUrl = 'view-source:' + msg.url;
      chrome.tabs.create({ url: viewSourceUrl });
    }
  });
  */

  // ========================================================================
  // CONTEXT MENU LOGIC
  // ========================================================================

  // ========================================================================
  // CONTEXT MENU LOGIC
  // ========================================================================

  // Define where menu appears (Browser + Extension Icon)
  const MENU_1 = ["action", "page", "selection", "link", "image"];
  const MENU_2 = ["page"];
  const MENU_3 = ["action"];

  // ---- EXISTING ----
  chrome.contextMenus.create({
    id: "newtab",
    title: "NewTab",
    contexts: MENU_2,
  });
  chrome.contextMenus.create({
    id: "online",
    title: "Online",
    contexts: MENU_1,
  });

  chrome.contextMenus.create({
    id: "info",
    title: "Info",
    contexts: MENU_1,
  });

  chrome.contextMenus.create({
    id: "privacy",
    title: "Privacy",
    contexts: MENU_3,
  });

  chrome.contextMenus.create({
    id: "terms",
    title: "Terms",
    contexts: MENU_3,
  });

  chrome.contextMenus.create({
    id: "license",
    title: "License",
    contexts: MENU_1,
  });

  chrome.contextMenus.create({
    id: "moreus",
    title: "More..",
    contexts: MENU_1,
  });

  // ----------------------
  // Menu Click Handler
  // ----------------------
  chrome.contextMenus.onClicked.addListener((info) => {
    switch (info.menuItemId) {
      case "newtab":
        openNewTabPage();
        break;

      case "online":
        openOnlinePage();
        break;

      case "info":
        openInfoPage();
        break;

      case "privacy":
        openPrivacyPage();
        break;

      case "terms":
        opentermsPage();
        break;

      case "license":
        openlicensePage();
        break;

      case "moreus":
        openmoreusPage();
        break;
    }
  });

  // ----------------------
  // Menu Functions
  // ----------------------
  function openNewTabPage() {
    chrome.tabs.create({
      url: "chrome://newtab", // FIXED
    });
  }

  function openOnlinePage() {
    chrome.tabs.create({
      url: "https://online-homepage.vercel.app/", // FIXED
    });
  }

  function openInfoPage() {
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/info.html"), // FIXED
    });
  }

  function openPrivacyPage() {
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/privacy.html"), // FIXED
    });
  }

  function opentermsPage() {
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/terms.html"), // FIXED
    });
  }

  function openlicensePage() {
    chrome.tabs.create({
      url: chrome.runtime.getURL("src/license.html"), // FIXED
    });
  }

  function openmoreusPage() {
    chrome.tabs.create({
      url: "https://mramzanch.blogspot.com/", // FIXED
    });
  }
}

// ============================================================================
// PWA-STYLE CACHING LOGIC
// ============================================================================

// ----------------------
// INSTALL
// ----------------------
self.addEventListener("install", (event) => {
  const urlsToCache = [
    "./src/assets/icon16.png",
    "./src/assets/icon48.png",
    "./src/assets/icon64.png",
    "./src/assets/icon128.png",
    "./src/assets/icon.png",
    "./index.html",
    "./wel.html",

    "./calc/calc.html",
    "./calc/calc.css",
    "./calc/calc.js",

    "./chat/MRi.html",
    "./chat/MRi.css",
    "./chat/MRi.js",

    "/src/css/page.css",
    "/src/css/panels.css",
    "/src/js/page.js",
    "/src/js/menu.js",
    "/src/js/panels.js",
  ];

  // Filter invalid URLs (avoid chrome-extension://)
  const validUrls = urlsToCache.filter(
    (url) => !url.startsWith("chrome-extension://")
  );

  event.waitUntil(
    caches.open(CACHE_KEY).then((cache) =>
      cache.addAll(validUrls).catch((err) => {
        console.warn("⚠️ Some files were skipped during cache:", err);
      })
    )
  );
});

// ----------------------
// ACTIVATE
// ----------------------
self.addEventListener("activate", (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_KEY) {
            console.log("🧹 Deleting old cache:", key);
            return caches.delete(key);
          }
        })
      );
    })()
  );
});

// ----------------------
// FETCH
// ----------------------
self.addEventListener("fetch", (event) => {
  const url = event.request.url;
  const isApi = API_URLS.some((api) => url.includes(api));

  // Skip non-HTTP(S) requests (chrome-extension://, data:, etc.)
  if (!url.startsWith("http") && !url.startsWith("./")) {
    return;
  }

  event.respondWith(
    (async () => {
      // Always fetch network for API URLs
      if (isApi) {
        try {
          return await fetch(event.request);
        } catch {
          return new Response("API request failed (offline).", {
            status: 503,
            statusText: "Service Unavailable",
          });
        }
      }

      // Cache-first strategy for all other requests
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) return cachedResponse;

      try {
        const networkResponse = await fetch(event.request);

        // Skip caching invalid schemes
        if (!url.startsWith("http")) return networkResponse;

        const cache = await caches.open(CACHE_KEY);
        if (
          networkResponse &&
          networkResponse.status === 200 &&
          networkResponse.type === "basic"
        ) {
          cache.put(event.request, networkResponse.clone());
        }

        return networkResponse;
      } catch {
        return new Response("Offline and no cached content available", {
          status: 503,
          statusText: "Service Unavailable",
        });
      }
    })()
  );
});
