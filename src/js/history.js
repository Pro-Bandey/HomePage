let contextItem = null;
let menuTimer = null;

document.addEventListener('DOMContentLoaded', loadData);

async function loadData() {
    const [tabs, history] = await Promise.all([
        chrome.tabs.query({}),
        chrome.history.search({ text: '', maxResults: 400, startTime: 0 })
    ]);

    const openUrls = new Set(tabs.map(t => t.url));
    const merged = [];

    // 1. Add Tabs
    tabs.forEach(t => merged.push({ id: t.id, url: t.url, title: t.title, type: 'tab', ts: Date.now() }));

    // 2. Add History until 300 items
    history.forEach(h => {
        if (!openUrls.has(h.url) && merged.length < 300) {
            merged.push({ id: h.id, url: h.url, title: h.title || h.url, type: 'hist', ts: h.lastVisitTime });
        }
    });

    render(merged);
}

function render(data) {
    const historyListBox = document.getElementById('historyListBox');
    historyListBox.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('li');
        row.className = 'historyListItem';

        const img = document.createElement('img');
        img.className = 'historyListItemIcon';
        let hostname;
        let protocol;
        try {
            const urlObj = new URL(item.url);
            protocol = urlObj.protocol;

            if (protocol === "http:" || protocol === "https:") {
                hostname = urlObj.hostname;
            }
        } catch (e) {
            console.warn("Invalid URL:", item.url);
        }
        if (protocol === "chrome:") {

            if (item.url === "chrome://newtab/") {
                img.src = "../assets/icons/48.png";
            } else {
                img.src = "../src/assets/chrome.svg";
            }
        } else if (protocol === "file:") {
            img.src = "../src/assets/file.svg";
        } else if (hostname) {
            img.src = `https://www.google.com/s2/favicons?sz=64&domain=${hostname}`;

        } else {
            img.src = "../src/assets/globe.svg";
        }


        const info = document.createElement('div');
        info.className = 'historyListItemInfo';
        info.innerHTML = `<p class="historyListItemInfoTitle">${esc(item.title)}</p><span class="historyListItemInfoTitleMeta">${smartDate(item.ts)} • ${new URL(item.url).hostname}</span>`;

        const status = document.createElement('span');
        status.className = 'material-icons-round historyListItemInfoStatus';

        if (item.type === 'tab') {
            status.textContent = 'ok';
            status.classList.add('historyListItemInfoStatusOpened');
        } else {
            const isRec = (Date.now() - item.ts) < 14400000; // < 24h
            status.textContent = isRec ? 'Recent' : 'RecentOld';
            status.classList.add(isRec ? 'historyListItemInfoStatusRecent' : 'historyListItemInfoStatusRecentOld');
        }

        row.append(img, info, status);

        row.oncontextmenu = (e) => {
            e.preventDefault();
            showMenu(e.pageX, e.pageY, item);
        };

        historyListBox.appendChild(row);
    });

    setupActions();
}

function setupActions() {
    const hide = () => hideMenu();

    // Auto-hide on scroll
    document.getElementById('historyListBox').onscroll = hide;

    // Auto-hide on global click
    window.onclick = hide;

    // Menu Item Logic
    document.getElementById('historyListItemMenuOpen').onclick = () => {
        if (!contextItem) return;
        if (contextItem.type === 'tab') chrome.tabs.update(contextItem.id, { active: true });
        else chrome.tabs.getCurrent(t => chrome.tabs.update(t.id, { url: contextItem.url }));
    };

    document.getElementById('historyListItemMenuNew').onclick = () => {
        if (contextItem) chrome.tabs.create({ url: contextItem.url });
    };

    document.getElementById('historyListItemMenuIncog').onclick = () => {
        if (contextItem && !contextItem.url.startsWith('chrome')) {
            chrome.windows.create({ url: contextItem.url, incognito: true });
        }
    };

    document.getElementById('historyListItemMenuDel').onclick = () => {
        if (contextItem.type === 'tab') chrome.tabs.remove(contextItem.id, loadData);
        else chrome.history.deleteUrl({ url: contextItem.url }, loadData);
    };
}

function showMenu(x, y, item) {
    contextItem = item;
    const m = document.getElementById('historyListItemMenu');
    m.style.display = 'block';

    if (x + 180 > window.innerWidth) x -= 180;
    if (y + 150 > window.innerHeight) y -= 150;

    m.style.left = x + 'px';
    m.style.top = y + 'px';

    clearTimeout(menuTimer);
    menuTimer = setTimeout(hideMenu, 5000);
}

function hideMenu() {
    document.getElementById('historyListItemMenu').style.display = 'none';
}

function esc(t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

function smartDate(ts) {
    const d = new Date(ts);
    const diff = Date.now() - ts;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diff < 604800000) return d.toLocaleDateString([], { weekday: 'short' });
    return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
}