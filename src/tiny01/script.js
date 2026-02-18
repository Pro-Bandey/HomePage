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
    const list = document.getElementById('list');
    list.innerHTML = '';

    data.forEach(item => {
        const row = document.createElement('div');
        row.className = 'row';

        const img = document.createElement('img');
        img.className = 'icon';
        let hostname;

        try {
            const urlObj = new URL(item.url);

            // Only allow http/https
            if (urlObj.protocol === "http:" || urlObj.protocol === "https:") {
                hostname = urlObj.hostname;
            }
        } catch (e) {
            console.warn("Invalid URL:", item.url);
        }

        if (hostname) {
            img.src = `https://s2.googleusercontent.com/s2/favicons?domain=${hostname}&sz=32`;
        } else {
            // fallback icon
            img.src = 'icon.svg';
        }


        const info = document.createElement('div');
        info.className = 'info';
        info.innerHTML = `<div class="title">${esc(item.title)}</div><div class="meta">${smartDate(item.ts)} • ${new URL(item.url).hostname}</div>`;

        const status = document.createElement('span');
        status.className = 'material-icons-round status';

        if (item.type === 'tab') {
            status.textContent = 'check_circle';
            status.classList.add('st-tab');
        } else {
            const isRec = (Date.now() - item.ts) < 14400000; // < 24h
            status.textContent = isRec ? 'error' : 'history';
            status.classList.add(isRec ? 'st-recent' : 'st-old');
        }

        row.append(img, info, status);

        // Context Menu Trigger
        row.oncontextmenu = (e) => {
            e.preventDefault();
            showMenu(e.pageX, e.pageY, item);
        };

        list.appendChild(row);
    });

    setupActions();
}

function setupActions() {
    const hide = () => hideMenu();

    // Auto-hide on scroll
    document.getElementById('list').onscroll = hide;

    // Auto-hide on global click
    window.onclick = hide;

    // Menu Item Logic
    document.getElementById('ctxOpen').onclick = () => {
        if (!contextItem) return;
        if (contextItem.type === 'tab') chrome.tabs.update(contextItem.id, { active: true });
        else chrome.tabs.getCurrent(t => chrome.tabs.update(t.id, { url: contextItem.url }));
    };

    document.getElementById('ctxNew').onclick = () => {
        if (contextItem) chrome.tabs.create({ url: contextItem.url });
    };

    document.getElementById('ctxIncog').onclick = () => {
        if (contextItem && !contextItem.url.startsWith('chrome')) {
            chrome.windows.create({ url: contextItem.url, incognito: true });
        }
    };

    document.getElementById('ctxDel').onclick = () => {
        if (contextItem.type === 'tab') chrome.tabs.remove(contextItem.id, loadData);
        else chrome.history.deleteUrl({ url: contextItem.url }, loadData);
    };
}

function showMenu(x, y, item) {
    contextItem = item;
    const m = document.getElementById('ctx');
    m.style.display = 'block';

    // Position check
    if (x + 180 > window.innerWidth) x -= 180;
    if (y + 150 > window.innerHeight) y -= 150;

    m.style.left = x + 'px';
    m.style.top = y + 'px';

    // Auto-hide after 10 seconds
    clearTimeout(menuTimer);
    menuTimer = setTimeout(hideMenu, 5000);
}

function hideMenu() {
    document.getElementById('ctx').style.display = 'none';
}

function esc(t) { return t.replace(/&/g, "&amp;").replace(/</g, "&lt;"); }

function smartDate(ts) {
    const d = new Date(ts);
    const diff = Date.now() - ts;
    if (diff < 86400000) return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    if (diff < 604800000) return d.toLocaleDateString([], { weekday: 'short' });
    return d.toLocaleDateString([], { day: 'numeric', month: 'short' });
}