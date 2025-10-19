
/*--- Custom Link Management ---*/
document.addEventListener("DOMContentLoaded", function () {
  var e = document.getElementById("more");
  const t = document.getElementById("overlayBar"),
    n = document.getElementById("bar-link-grid"),
    l = document.getElementById("add-link-box"),
    a = document.getElementById("add-link-heading"),
    o = document.getElementById("linkName"),
    c = document.getElementById("linkURL"),
    i = document.getElementById("linkFavicon"),
    s = document.getElementById("linkFaviconFile"),
    d = document.getElementById("popupBar"),
    can = document.getElementById("cancel-link-btn");
  var r = document.getElementById("save-link-btn");
  const m = document.getElementById("delete-box"),
    u = document.getElementById("deleteConfirmBtn"),
    p = document.getElementById("deleteCancelBtn");
  let y = [],
    f = null,
    h = null,
    g = null;

  function k(e) {
    chrome?.storage?.local
      ? chrome.storage.local.set({ customLinks: e })
      : localStorage.setItem("customLinks", JSON.stringify(e));
  }
  function b(e) {
    const t = e.trim().split(" ").filter(Boolean);
    return t.length >= 2
      ? (t[0][0] + t[1][0]).toUpperCase()
      : 1 === t.length
        ? t[0].substring(0, Math.min(3, t[0].length)).toUpperCase()
        : "";
  }
  function v() {
    function e(e) {
      e && e.length > 0
        ? ((y = e.map((e) =>
          !e.fallback && e.name ? { ...e, fallback: b(e.name) } : e
        )),
          E())
        : ((y = [
          { name: "Facebook", url: "https://facebook.com", fallback: "FB" },
          { name: "Pakizle", url: "https://pakizle.com", fallback: "PKL" },
          { name: "Instagram", url: "https://instagram.com", fallback: "Ins" },
          { name: "X Twitter", url: "https://x.com", fallback: "X" },
          { name: "Threads", url: "https://threads.com", fallback: "THd" },
          { name: "LinkedIn", url: "https://linkedin.com", fallback: "Lnk" },
          { name: "WhatsApp Web", url: "https://web.whatsapp.com", fallback: "WAW" },
          { name: "YouTube", url: "https://youtube.com", fallback: "YT" },
          { name: "WhatsApp", url: "https://whatsapp.com", fallback: "WA" },
          { name: "TikTok", url: "https://tiktok.com", fallback: "TkTk" },
          { name: "ChatGpt", url: "https://chatgpt.com", fallback: "CGT" },
          { name: "GitHub", url: "https://github.com", fallback: "Git" },
        ]
      ),
          k(y),
          E());
    }
    if (chrome?.storage?.local)
      chrome.storage.local.get(["customLinks"], (t) => e(t.customLinks));
    else
      try {
        const t = localStorage.getItem("customLinks");
        e(t ? JSON.parse(t) : null);
      } catch {
        e(null);
      }
  }

  function E() {
    n.innerHTML = "";
    y.forEach((e, t) => {
      const card = document.createElement("div"),
        bg = `hsl(${Math.floor(360 * Math.random())}, ${Math.floor(20 * Math.random() + 70)
          }%, ${Math.floor(20 * Math.random() + 40)}%)`,
        textColor = parseInt(bg.match(/(\d+)%\)/)[1], 10) > 55 ? "#000" : "#FFF",
        fallback = e.fallback || b(e.name);

      card.className = "link-card";
      card.title = e.name;

      // ✅ Direct structure, no inner "link-content"
      card.innerHTML = `
        <div class="icon" style="background:${bg};color:${textColor};">${fallback}</div>
        <p class="link-label">${e.name}</p>
        <button class="menu-btn" data-index="${t}">⋮</button>
      `;

      // Left-click: open link
      card.addEventListener("click", (ev) => {
        if (!ev.target.classList.contains("menu-btn")) w(t, false);
      });

      // Right-click: context menu
      card.addEventListener("contextmenu", (ev) => {
        ev.preventDefault();
        L();
        const cm = document.createElement("div");
        cm.className = "context-menu";
        cm.id = "dynamic-menu-" + t;
        cm.innerHTML = `
          <button class="menu-item" data-action="open-link" data-index="${t}">Open</button>
          <button class="menu-item" data-action="open--link-new-tab" data-index="${t}">Open in New Tab</button>
          <button class="menu-item" data-action="edit-link" data-index="${t}">Edit</button>
          <button class="menu-item" data-action="delete-link" data-index="${t}">Delete</button>
        `;
        document.body.appendChild(cm);
        h = cm;
        cm.style.visibility = "hidden";
        cm.style.display = "flex";

        requestAnimationFrame(() => {
          const rect = cm.getBoundingClientRect();
          let left = ev.pageX, top = ev.pageY;
          left + rect.width > window.innerWidth &&
            (left = window.innerWidth - rect.width - 5);
          top + rect.height > window.innerHeight &&
            (top = window.innerHeight - rect.height - 5);
          cm.style.left = left + "px";
          cm.style.top = top + "px";
          cm.style.visibility = "visible";
        });

        cm.querySelectorAll(".menu-item").forEach((btn) => {
          btn.addEventListener("click", (evt) => {
            const action = evt.target.dataset.action,
              idx = parseInt(evt.target.dataset.index);
            if (action === "open-link") w(idx, !1);
            else if (action === "open--link-new-tab") w(idx, !0);
            else if (action === "edit-link") {
              f = idx;
              o.value = y[idx].name;
              c.value = y[idx].url;
              i.value = y[idx].favicon || "";
              s.value = "";
              a.textContent = "Edit Shortcut";
              l.style.display = "flex";
              L();
            } else if (action === "delete-link") {
              g = idx;
              m.style.display = "block";
              L();
            }
          });
        });
      });

      // Menu button click
      card.querySelector(".menu-btn").addEventListener("click", (ev) => {
        ev.stopPropagation();
        L();
        const rect = ev.currentTarget.getBoundingClientRect();
        const menu = document.createElement("div");
        menu.className = "context-menu";
        menu.id = "dynamic-menu-" + t;
        menu.innerHTML = `
          <button class="menu-item" data-action="open-link" data-index="${t}">Open</button>
          <button class="menu-item" data-action="open--link-new-tab" data-index="${t}">Open in New Tab</button>
          <button class="menu-item" data-action="edit-link" data-index="${t}">Edit</button>
          <button class="menu-item" data-action="delete-link" data-index="${t}">Delete</button>
        `;
        document.body.appendChild(menu);
        h = menu;
        menu.style.visibility = "hidden";
        menu.style.display = "flex";
        requestAnimationFrame(() => {
          const mRect = menu.getBoundingClientRect();
          let left = rect.left, top = rect.bottom + 5;
          left + mRect.width > window.innerWidth &&
            (left = window.innerWidth - mRect.width - 5);
          top + mRect.height > window.innerHeight &&
            (top = rect.top - mRect.height - 5);
          menu.style.left = left + "px";
          menu.style.top = top + "px";
          menu.style.visibility = "visible";
        });
        menu.querySelectorAll(".menu-item").forEach((btn) => {
          btn.addEventListener("click", (evt) => {
            const action = evt.target.dataset.action,
              idx = parseInt(evt.target.dataset.index);
            if (action === "open-link") w(idx, !1);
            else if (action === "open--link-new-tab") w(idx, !0);
            else if (action === "edit-link") {
              f = idx;
              o.value = y[idx].name;
              c.value = y[idx].url;
              i.value = y[idx].favicon || "";
              s.value = "";
              a.textContent = "Edit Shortcut";
              l.style.display = "flex";
              L();
            } else if (action === "delete-link") {
              g = idx;
              m.style.display = "block";
              L();
            }
          });
        });
      });

      n.appendChild(card);

      // favicon + fallback handling (unchanged)
      const iconEl = card.querySelector(".icon"),
        labelEl = card.querySelector(".link-label");
      if (iconEl && labelEl)
        if (e.favicon) {
          const B = document.createElement("img");
          B.src = e.favicon;
          B.alt = e.name;
          B.onload = () => {
            iconEl.innerHTML = "";
            iconEl.style.background = "transparent";
            iconEl.appendChild(B);
            labelEl.style.color = "#fff";
          };
          B.onerror = () => {
            iconEl.innerHTML = fallback;
            iconEl.style.backgroundColor = bg;
            iconEl.style.color = textColor;
            labelEl.style.color = textColor;
          };
        } else {
          const host = new URL(e.url).hostname,
            sources = [
              (d) => `https://www.google.com/s2/favicons?sz=64&domain=${d}`,
              (d) => `https://icons.duckduckgo.com/ip2/${d}.ico`,
              (d) => `https://logo.clearbit.com/${d}`,
            ];
          let idx = 0;
          const img = document.createElement("img");
          img.alt = e.name;
          function tryNext() {
            if (idx >= sources.length) {
              iconEl.innerHTML = fallback;
              iconEl.style.backgroundColor = bg;
              iconEl.style.color = textColor;
              labelEl.style.color = textColor;
              return;
            }
            img.src = sources[idx](host);
          }
          img.onload = () => {
            iconEl.innerHTML = "";
            iconEl.style.background = "transparent";
            iconEl.appendChild(img);
            labelEl.style.color = "#fff";
          };
          img.onerror = () => {
            idx++;
            tryNext();
          };
          tryNext();
        }
    });

    const add = document.createElement("div");
    add.className = "link-card add-card";
    add.innerHTML = "<p>＋</p>";
    add.addEventListener("click", B);
    n.appendChild(add);
    k(y);
  }

  function L() {
    if (h && h.parentNode) {
      h.parentNode.removeChild(h);
      h = null;
    }
  }

  function w(e, n = !1) {
    const url = y[e].url;
    if (chrome?.tabs)
      n ? chrome.tabs.create({ url }) : chrome.tabs.update({ url });
    else n ? window.open(url, "_blank") : window.open(url, "_self");
    d.style.display = "none";
    t.style.display = "none";
    L();
  }

  function B() {
    f = null;
    o.value = "";
    c.value = "";
    i.value = "";
    s.value = "";
    a.textContent = "Add Shortcut";
    l.style.display = "flex";
    o.focus();
  }

  function I() {
    l.style.display = "none";
    f = null;
  }

  r.addEventListener("click", function () {
    const name = o.value.trim();
    let url = c.value.trim(),
      fav = i.value.trim();
    if (name && url) {
      /^https?:\/\//i.test(url) || (url = "https://" + url);
      try {
        new URL(url);
      } catch {
        return void showCustomAlert("Invalid URL format.");
      }
      const save = () => {
        const fb = b(name);
        null !== f
          ? (y[f] = { name, url, favicon: fav, fallback: fb })
          : y.push({ name, url, favicon: fav, fallback: fb });
        E();
        I();
      };
      if (s.files.length > 0) {
        const fr = new FileReader();
        fr.onload = (ev) => {
          fav = ev.target.result;
          save();
        };
        fr.readAsDataURL(s.files[0]);
      } else save();
    } else showCustomAlert("Enter a valid name and URL.");
  });

  can.addEventListener("click", () => {
    l.style.display = "none";
    g = null;
  });

  u.addEventListener("click", () => {
    if (g !== null) {
      y.splice(g, 1);
      E();
    }
    m.style.display = "none";
    g = null;
  });

  p.addEventListener("click", () => {
    m.style.display = "none";
    g = null;
  });

  e.addEventListener("click", () => {
    d.style.display = d.style.display === "flex" ? "none" : "flex";
    t.style.display = d.style.display === "flex" ? "block" : "none";
    if (d.style.display === "flex") v();
  });

  t.addEventListener("click", () => {
    d.style.display = "none";
    t.style.display = "none";
    L();
  });

  document.addEventListener("click", (ev) => {
    (ev.target === l && I()),
      ev.target.closest(".context-menu") ||
      ev.target.classList.contains("menu-btn") ||
      L();
  });

  v();
});



// --- Block right-click context menu for images ---
const images = document.querySelectorAll('img');

images.forEach(img => {
  img.addEventListener('contextmenu', function (e) {
    e.preventDefault(); // Prevent the default right-click context menu
  });
});








(function () {
  // ===== Variables =====
  let launcherLinks = [];
  let currentIndex = null; // editing index
  let editingIndex = null;  // for modal editing
  let deletingIndex = null; // for delete confirmation
  let contextMenuElement = null;

  // Elements (launcher.js IDs)
  const grid = document.getElementById("cal-link-grid");
  const contextMenu = document.getElementById("cal-contextMenu");
  const addBtn = document.getElementById("cal-add-btn");
  const exportBtn = document.getElementById("cal-export-btn");
  const importBtn = document.getElementById("cal-import-btn");
  const importFile = document.getElementById("cal-import-file");
  const popupBox = document.getElementById("cal-popupBox");
  const boxTitle = document.getElementById("cal-box-Tittle");
  const linkTitleInput = document.getElementById("cal-link-Tittle");
  const linkUrlInput = document.getElementById("cal-link-Url");
  const saveBtn = document.getElementById("cal-save-btn");
  const cancelBtn = document.getElementById("cal-cancel-btn");

  // Delete confirmation
  const deleteConfirmBox = document.createElement("div");
  deleteConfirmBox.className = "delete-box";
  deleteConfirmBox.style.display = "none";
  deleteConfirmBox.innerHTML = `
    <h2 class="alert-box-heading">Delete Shortcut</h2>
    <div class="delete-box-content">
        <p>Are you sure you want to remove this shortcut?</p>
        <div class="delete-box-action">
            <button id="deleteConfirmBtn" class="danger">Delete</button>
            <button id="deleteCancelBtn">Cancel</button>
        </div>
    </div>
  `;
  document.body.appendChild(deleteConfirmBox);
  const deleteConfirmBtn = deleteConfirmBox.querySelector("#deleteConfirmBtn");
  const deleteCancelBtn = deleteConfirmBox.querySelector("#deleteCancelBtn");

  // ===== Utilities =====
  function getRandomColor() {
    const h = Math.floor(Math.random() * 360);
    const s = Math.floor(Math.random() * 50 + 50);
    const l = Math.floor(Math.random() * 40 + 30);
    return `hsl(${h},${s}%,${l}%)`;
  }

  function generateFallback(name) {
    const parts = name.trim().split(" ").filter(Boolean);
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return name.substring(0, 3).toUpperCase();
  }

  function saveLauncherLinks() {
    if (chrome?.storage?.local) {
      chrome.storage.local.set({ launcherLinks });
    } else {
      localStorage.setItem("launcherLinks", JSON.stringify(launcherLinks));
    }
  }

  function loadLauncherLinks() {
    if (chrome?.storage?.local) {
      chrome.storage.local.get(["launcherLinks"], res => {
        launcherLinks = res.launcherLinks && res.launcherLinks.length ? res.launcherLinks : getDefaultLinks();
        renderGrid();
      });
    } else {
      const saved = localStorage.getItem("launcherLinks");
      launcherLinks = saved ? JSON.parse(saved) : getDefaultLinks();
      renderGrid();
    }
  }

  function getDefaultLinks() {
    return [
      { "name": "Google Search", "url": "https://www.google.com", "fallback": "GS" },
      { "name": "Gmail", "url": "https://mail.google.com", "fallback": "GMA" },
      { "name": "Google Drive", "url": "https://drive.google.com", "fallback": "GD" },
      { "name": "Google Docs", "url": "https://docs.google.com", "fallback": "GD" },
      { "name": "Google Sheets", "url": "https://sheets.google.com", "fallback": "GS" },
      { "name": "Google Slides", "url": "https://slides.google.com", "fallback": "GS" },
      { "name": "Google Photos", "url": "https://photos.google.com", "fallback": "PHO" },
      { "name": "Google Maps", "url": "https://maps.google.com", "fallback": "GM" },
      { "name": "Google Calendar", "url": "https://calendar.google.com", "fallback": "GC" },
      { "name": "Google Meet", "url": "https://meet.google.com", "fallback": "GM" },
      { "name": "Google Chat", "url": "https://chat.google.com", "fallback": "GC" },
      { "name": "Google Keep", "url": "https://keep.google.com", "fallback": "GK" },
      { "name": "Google Contacts", "url": "https://contacts.google.com", "fallback": "GC" },
      { "name": "Google Translate", "url": "https://translate.google.com", "fallback": "GT" },
      { "name": "YouTube", "url": "https://www.youtube.com", "fallback": "YOU" },
      { "name": "Ai Studio", "url": "https://aistudio.google.com", "fallback": "Ai" },
      { "name": "Google Play Store", "url": "https://play.google.com", "fallback": "GPS" },
      { "name": "Google News", "url": "https://news.google.com", "fallback": "GN" },
      { "name": "Google Assistant", "url": "https://assistant.google.com", "fallback": "GA" },
      { "name": "Google Classroom", "url": "https://classroom.google.com", "fallback": "GC" },
      { "name": "Google Pay", "url": "https://pay.google.com", "fallback": "GP" },
      { "name": "Google Wallet", "url": "https://wallet.google.com", "fallback": "GW" },
      { "name": "Google Fit", "url": "https://www.google.com/fit", "fallback": "GF" },
      { "name": "Google Photos", "url": "https://photos.google.com", "fallback": "PHO" }
    ];
  }
  // ===== Grid Rendering =====
  function renderGrid() {
    grid.innerHTML = "";
    launcherLinks.forEach((link, idx) => {
      const card = document.createElement("div");
      card.className = "card";
      card.title = link.name;
      const fallback = link.fallback || generateFallback(link.name);
      const bg = getRandomColor();
      const color = "#fff";

      card.innerHTML = `
        <div class="icon" style="background:${bg};color:${color};">${fallback}</div>
        <div class="name">${link.name}</div>
        <div class="menu-btn">⋮</div>
      `;

      // Left-click: open link
      card.addEventListener("click", e => {
        if (!e.target.classList.contains("menu-btn")) openLink(idx, false);
      });

      // Right-click: context menu
      card.addEventListener("contextmenu", e => {
        e.preventDefault();
        currentIndex = idx;
        showContextMenu(e.pageX, e.pageY);
      });

      // Menu button click
      card.querySelector(".menu-btn").addEventListener("click", e => {
        e.stopPropagation();
        currentIndex = idx;
        showContextMenu(e.pageX, e.pageY);
      });

      grid.appendChild(card);
      setTimeout(() => loadFavicon(card, link.url, fallback, bg, color), 100);
    });

    saveLauncherLinks();
  }

  function loadFavicon(card, url, fallback, bg, color) {
    const icon = card.querySelector(".icon");
    const hostname = new URL(url).hostname;
    const sources = [
      e => `https://www.google.com/s2/favicons?sz=64&domain=${e}`,
      e => `https://icons.duckduckgo.com/ip2/${e}.ico`,
      e => `https://logo.clearbit.com/${e}`
    ];
    let i = 0;
    function tryNext() {
      if (i >= sources.length) {
        icon.innerHTML = fallback;
        icon.style.background = bg;
        icon.style.color = color;
        return;
      }
      const img = document.createElement("img");
      img.src = sources[i](hostname);
      img.onload = () => { icon.innerHTML = ""; icon.style.background = "transparent"; icon.appendChild(img); };
      img.onerror = () => { i++; tryNext(); };
    }
    tryNext();
  }

  // ===== Context Menu =====
  function showContextMenu(x, y) {
    contextMenu.style.display = "block";
    const menuWidth = contextMenu.offsetWidth;
    const menuHeight = contextMenu.offsetHeight;
    if (x + menuWidth > window.innerWidth) x = window.innerWidth - menuWidth - 5;
    if (y + menuHeight > window.innerHeight) y = window.innerHeight - menuHeight - 5;
    contextMenu.style.left = `${x}px`;
    contextMenu.style.top = `${y}px`;
  }

  document.addEventListener("click", () => { contextMenu.style.display = "none"; });

  contextMenu.addEventListener("click", e => {
    if (currentIndex === null) return;
    const action = e.target.dataset.action;
    if (action === "cal-open") openLink(currentIndex, false);
    else if (action === "cal-Newtab") openLink(currentIndex, true);
    else if (action === "cal-edit") {
      editingIndex = currentIndex;  // store exact item being edited
      openModal(true);
    }
    else if (action === "cal-delete") showDeleteConfirm(currentIndex);
  });

  // ===== Delete Confirmation =====
  function showDeleteConfirm(idx) {
    deletingIndex = idx;
    deleteConfirmBox.style.display = "block";
  }

  deleteConfirmBtn.addEventListener("click", () => {
    if (deletingIndex !== null) {
      launcherLinks.splice(deletingIndex, 1);
      renderGrid();
      deletingIndex = null;
    }
    deleteConfirmBox.style.display = "none";
  });

  deleteCancelBtn.addEventListener("click", () => {
    deletingIndex = null;
    deleteConfirmBox.style.display = "none";
  });

  // ===== Open Link =====
  function openLink(index, newTab = false) {
    if (index < 0 || index >= launcherLinks.length) return;
    const url = launcherLinks[index].url;
    if (chrome.tabs) {
      newTab ? chrome.tabs.create({ url }) : chrome.tabs.query({ active: true, currentWindow: true }, t => { chrome.tabs.update(t[0].id, { url }); });
    } else {
      newTab ? window.open(url, "_blank") : window.open(url, "_self");
    }
    contextMenu.style.display = "none";
  }

  // ===== Modal =====
  function openModal(edit = false) {
    popupBox.style.display = "flex";
    boxTitle.innerText = edit ? "Edit Shortcut" : "Add Shortcut";

    if (edit && editingIndex !== null) {
      linkTitleInput.value = launcherLinks[editingIndex].name;
      linkUrlInput.value = launcherLinks[editingIndex].url.replace(/^https?:\/\//, "");
    } else {
      linkTitleInput.value = "";
      linkUrlInput.value = "";
      editingIndex = null; // reset
    }

    linkTitleInput.focus();
  }



  function closeModal() { popupBox.style.display = "none"; }
  saveBtn.addEventListener("click", () => {
    const name = linkTitleInput.value.trim();
    let url = linkUrlInput.value.trim();
    if (!name || !url) return;

    if (!/^https?:\/\//i.test(url)) url = "https://" + url;
    const fallback = generateFallback(name);

    if (editingIndex !== null) {
      launcherLinks[editingIndex] = { name, url, fallback };
    } else {
      launcherLinks.push({ name, url, fallback });
    }

    editingIndex = null; // reset
    renderGrid();
    closeModal();
  });


  cancelBtn.addEventListener("click", closeModal);

  // ===== Buttons =====
  addBtn.onclick = () => openModal(false);
  exportBtn.onclick = () => {
    const blob = new Blob([JSON.stringify(launcherLinks, null, 2)], { type: "application/json" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = "launcherLinks.json";
    a.click();
  };
  importBtn.onclick = () => importFile.click();
  importFile.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      launcherLinks = JSON.parse(ev.target.result);
      renderGrid();
    };
    reader.readAsText(file);
  };

  // ===== Load Immediately =====
  loadLauncherLinks();

})();
