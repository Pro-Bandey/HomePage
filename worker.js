
// ----------------------
// service-worker.js (2025-safe version)
// ----------------------

const CACHE_KEY = 'HomePage';

// Domains to always fetch fresh
const API_URLS = [
  'google.com/s2/favicons',
  'icons.duckduckgo.com',
  'logo.clearbit.com'
];

// ----------------------
// Chrome Extension logic
// ----------------------
if (typeof chrome !== 'undefined' && chrome.runtime) {
  // Uninstall feedback page (Chromium only)
  if (chrome.runtime.setUninstallURL) {
    chrome.runtime.setUninstallURL('https://Pro-Bandey.github.io/help/');
  }

  // Open homepage when extension icon clicked
  if (chrome.action && chrome.tabs) {
    chrome.action.onClicked.addListener(() => {
      const url = chrome.runtime.getURL('./index.html');
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

  // Reminder alarm handling
  chrome.alarms.onAlarm.addListener((alarm) => {
    chrome.storage.local.get(alarm.name, (result) => {
      const reminder = result[alarm.name];
      if (reminder) {
        const data = { ...reminder, id: alarm.name };
        chrome.storage.sync.get({ missedReminders: [] }, (res) => {
          const updated = [...res.missedReminders, data];
          chrome.storage.sync.set({ missedReminders: updated }, () => {
            chrome.runtime.sendMessage({ action: 'reminderFired', ...data }, () => {
              if (chrome.runtime.lastError) {
                // popup closed
              }
            });
          });
        });
      }
    });
  });

  // Handle messages from popup or background
  // chrome.runtime.onMessage.addListener((msg, sender) => {
  //   if (msg.action === 'openReadingMode' && chrome.sidePanel) {
  //     chrome.sidePanel.open({ windowId: sender.tab.windowId });
  //     chrome.sidePanel.setOptions({
  //       tabId: sender.tab.id,
  //       path: './index.html.html',
  //       enabled: true
  //     });
  //   }

  //   if (msg.action === 'viewSource' && msg.url) {
  //     const viewSourceUrl = 'view-source:' + msg.url;
  //     chrome.tabs.create({ url: viewSourceUrl });
  //   }
  // });
}

// ----------------------
// PWA-style caching logic
// ----------------------

self.addEventListener('install', (event) => {
  const urlsToCache = [
    './index.html',
    './src/info.html',
    './src/assets/icon16.png',
    './src/assets/icon48.png',
    './src/assets/icon64.png',
    './src/assets/icon128.png',
    './src/assets/icon.png'
  ];

  // Filter invalid URLs (avoid chrome-extension://)
  const validUrls = urlsToCache.filter(
    (url) => !url.startsWith('chrome-extension://')
  );

  event.waitUntil(
    caches.open(CACHE_KEY).then((cache) =>
      cache.addAll(validUrls).catch((err) => {
        console.warn('⚠️ Some files were skipped during cache:', err);
      })
    )
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    (async () => {
      const keys = await caches.keys();
      await Promise.all(
        keys.map((key) => {
          if (key !== CACHE_KEY) {
            console.log('🧹 Deleting old cache:', key);
            return caches.delete(key);
          }
        })
      );
    })()
  );
});

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  const isApi = API_URLS.some((api) => url.includes(api));

  // Skip non-HTTP(S) requests (chrome-extension://, data:, etc.)
  if (!url.startsWith('http') && !url.startsWith('./')) {
    return;
  }

  event.respondWith(
    (async () => {
      // Always fetch network for API URLs
      if (isApi) {
        try {
          return await fetch(event.request);
        } catch {
          return new Response('API request failed (offline).', {
            status: 503,
            statusText: 'Service Unavailable'
          });
        }
      }

      // Cache-first for others
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) return cachedResponse;

      try {
        const networkResponse = await fetch(event.request);

        // Skip caching invalid schemes again just to be safe
        if (!url.startsWith('http')) return networkResponse;

        const cache = await caches.open(CACHE_KEY);
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          cache.put(event.request, networkResponse.clone());
        }

        return networkResponse;
      } catch {
        return new Response('Offline and no cached content available', {
          status: 503,
          statusText: 'Service Unavailable'
        });
      }
    })()
  );
});
