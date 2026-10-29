
const CACHE_KEY = "HomePage";

const API_URLS = [
  "google.com/s2/favicons",
  "icons.duckduckgo.com",
  "https://favicon.run/",
];


if (typeof chrome !== "undefined" && chrome.runtime) {
  if (chrome.runtime.setUninstallURL) {
    chrome.runtime.setUninstallURL("https://Pro-Bandey.github.io/HomePage/src/feed.html");
  }

  if (chrome.action && chrome.tabs) {
    chrome.action.onClicked.addListener(() => {
      const url = chrome.runtime.getURL("./index.html");
      chrome.tabs.create({ url });
    });
  }

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


  chrome.runtime.onInstalled.addListener(() => {

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
  function openNewTabPage() {
    chrome.tabs.create({ url: "chrome://newtab" } || {url: "about:home"});
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


self.addEventListener("install", (event) => {
  const urlsToCache = [
    "../../icons/16.png",
    "../../icons/32.png",
    "../../icons/48.png",
    "../../icons/128.png",
    "../../icons/logo.png",
    "../../../index.html",
    "../../../wel.html",
    "../../../calc/calc.html",
    "../../../calc/calc.css",
    "../../../calc/calc.js",
    "../../css/page.css",
    "../../css/panels.css",
    "../../js/page.js",
    "../../js/menu.js",
    "../../js/panels.js",
  ];

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

self.addEventListener("fetch", (event) => {
  const url = event.request.url;
  const isApi = API_URLS.some((api) => url.includes(api));
  if (!url.startsWith("http") && !url.startsWith("./")) {
    return;
  }
  event.respondWith(
    (async () => {
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
      const cachedResponse = await caches.match(event.request);
      if (cachedResponse) return cachedResponse;
      try {
        const networkResponse = await fetch(event.request);
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
