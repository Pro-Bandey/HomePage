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

  // 1. CREATE MENUS (Inside onInstalled to prevent duplicate errors)
  chrome.runtime.onInstalled.addListener(() => {
    // Define where menu appears
    const MENU_1 = ["action", "page", "selection", "link", "image"];
    const MENU_2 = ["page"];
    const MENU_3 = ["action"];

    const menuItems = [
      { id: "newtab", title: "NewTab", contexts: MENU_2 },
      { id: "online", title: "Online", contexts: MENU_1 },
      { id: "info", title: "Info", contexts: MENU_1 },
      { id: "privacy", title: "Privacy", contexts: MENU_3 },
      { id: "terms", title: "Terms", contexts: MENU_3 },
      { id: "license", title: "License", contexts: MENU_1 },
      { id: "moreus", title: "More..", contexts: MENU_1 },
    ];

    menuItems.forEach(item => {
      chrome.contextMenus.create({
        id: item.id,
        title: item.title,
        contexts: item.contexts,
      });
    });

    console.log("Context menus created successfully.");
  });

  // 2. CLICK HANDLER (Must stay at top-level to catch events)
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
  // Menu Functions (Keep these as they are)
  // ----------------------
  function openNewTabPage() {
    chrome.tabs.create({ url: "chrome://newtab" });
  }

  function openOnlinePage() {
    chrome.tabs.create({ url: "https://online-homepage.vercel.app/" });
  }

  function openInfoPage() {
    chrome.tabs.create({ url: chrome.runtime.getURL("src/info.html") });
  }

  function openPrivacyPage() {
    chrome.tabs.create({ url: chrome.runtime.getURL("src/privacy.html") });
  }

  function opentermsPage() {
    chrome.tabs.create({ url: chrome.runtime.getURL("src/terms.html") });
  }

  function openlicensePage() {
    chrome.tabs.create({ url: chrome.runtime.getURL("src/license.html") });
  }

  function openmoreusPage() {
    chrome.tabs.create({ url: "https://mramzanch.blogspot.com/" });
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
    // Icons
    "../../icons/16.png",
    "../../icons/32.png",
    "../../icons/48.png",
    "../../icons/128.png",
    "../../icons/logo.png",
    // Root files
    "../../../index.html",
    "../../../wel.html",
    // Calc
    "../../../calc/calc.html",
    "../../../calc/calc.css",
    "../../../calc/calc.js",
    // Chat
    "../../../chat/MRi.html",
    "../../../chat/MRi.css",
    "../../../chat/MRi.js",
    // CSS
    "../../css/page.css",
    "../../css/panels.css",
    // JS
    "../../js/page.js",
    "../../js/menu.js",
    "../../js/panels.js",
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
