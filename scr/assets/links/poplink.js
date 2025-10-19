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
    d = document.getElementById("popupBar");
  // document.getElementById("cancel-link-btn"); // Cnncal button
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
            { name: "Facebook", url: "https://pakizle.com", fallback: "PKL" },
            { name: "Instagram", url: "https://instagram.com", fallback: "Ins" },
            { name: "X Twitter", url: "https://X.com", fallback: "X" },
            { name: "Threads", url: "https://threads.com", fallback: "THd" },
            { name: "LinkedIn", url: "https://linkedin.com", fallback: "Lnk" },
            { name: "WhatsApp Web",url: "https://web.whatsapp.com",fallback: "WAW"},
            { name: "YouTube", url: "https://youtube.com", fallback: "YT" },
            { name: "WhatsApp", url: "https://whatsapp.com", fallback: "WA" },
            { name: "TikTok", url: "https://tiktok.com", fallback: "TkTk" },
            { name: "ChatGpt", url: "https://chatgpt.com", fallback: "CGT" },
            { name: "GitHub", url: "https://gihub.com", fallback: "Git" },
          ]),
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
      const d = document.createElement("div"),
        r = `hsl(${Math.floor(360 * Math.random())}, ${
          Math.floor(20 * Math.random() + 70)
        }%, ${Math.floor(20 * Math.random() + 40)}%)`,
        u = parseInt(r.match(/(\d+)%\)/)[1], 10) > 55 ? "#000000" : "#FFFFFF",
        p = e.fallback || b(e.name);
      d.className = "link-card";
      d.innerHTML = `\n
        <div class="link-content" title="${e.name}">\n
        <div class="icon" style="background:${r};color:${u};">${p}</div>\n
          <p class="link-label">${e.name}</p>\n
        </div>\n
        <button class="menu-btn" data-index="${t}">⋮</button>\n
        `;
      d.querySelector(".link-content").addEventListener("click", () => w(t, !1));
      d.querySelector(".menu-btn").addEventListener("click", (e) => {
        !(function (e, t) {
          L();
          const n = e.currentTarget.getBoundingClientRect(),
            d = document.createElement("div");
          d.className = "context-menu";
          d.id = "dynamic-menu-" + t;
          d.innerHTML = `\n
            <button class="menu-item" data-action="open-link" data-index="${t}">Open</button>\n
            <button class="menu-item" data-action="open--link-new-tab" data-index="${t}">Open in New Tab</button>\n
            <button class="menu-item" data-action="edit-link" data-index="${t}">Edit</button>\n
            <button class="menu-item" data-action="delete-link" data-index="${t}">Delete</button>\n
          `;
          document.body.appendChild(d), (h = d);
          d.style.visibility = "hidden";
          d.style.display = "flex";
          requestAnimationFrame(() => {
            const e = d.getBoundingClientRect();
            let t = n.left,
              l = n.bottom + 5;
            t + e.width > window.innerWidth &&
              (t = window.innerWidth - e.width - 5),
              l + e.height > window.innerHeight && (l = n.top - e.height - 5),
              (d.style.left = t + "px"),
              (d.style.top = l + "px"),
              (d.style.visibility = "visible");
          }),
            d.querySelectorAll(".menu-item").forEach((e) => {
              e.addEventListener("click", (e) => {
                const t = e.target.dataset.action,
                  n = parseInt(e.target.dataset.index);
                "open-link" === t
                  ? w(n, !1)
                  : "open--link-new-tab" === t
                  ? w(n, !0)
                  : "edit-link" === t
                  ? ((f = n),
                    (o.value = y[n].name),
                    (c.value = y[n].url),
                    (i.value = y[n].favicon || ""),
                    (s.value = ""),
                    (a.textContent = "Edit Shortcut"),
                    (l.style.display = "flex"),
                    L())
                  : "delete-link" === t && ((g = n), (m.style.display = "block"), L());
              });
            });
        })(e, t),
          e.stopPropagation();
      });

      // ✅ Added: Right-click context menu on .link-content
      d.querySelector(".link-content").addEventListener("contextmenu", (e) => {
        e.preventDefault();
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
          const eRect = cm.getBoundingClientRect();
          let left = e.pageX,
            top = e.pageY;
          left + eRect.width > window.innerWidth &&
            (left = window.innerWidth - eRect.width - 5);
          top + eRect.height > window.innerHeight &&
            (top = window.innerHeight - eRect.height - 5);
          cm.style.left = left + "px";
          cm.style.top = top + "px";
          cm.style.visibility = "visible";
        });

        cm.querySelectorAll(".menu-item").forEach((btn) => {
          btn.addEventListener("click", (ev) => {
            const action = ev.target.dataset.action,
              idx = parseInt(ev.target.dataset.index);
            if (action === "open-link") w(idx, !1);
            else if (action === "open--link-new-tab") w(idx, !0);
            else if (action === "edit-link") {
              (f = idx),
                (o.value = y[idx].name),
                (c.value = y[idx].url),
                (i.value = y[idx].favicon || ""),
                (s.value = "");
              a.textContent = "Edit Shortcut";
              l.style.display = "flex";
              L();
            } else if (action === "delete-link") {
              (g = idx), (m.style.display = "block"), L();
            }
          });
        });
      });

      n.appendChild(d);
      const k = d.querySelector(".icon"),
        v = d.querySelector(".link-label");
      if (k && v)
        if (e.favicon) {
          const B = document.createElement("img");
          (B.src = e.favicon),
            (B.alt = e.name),
            (B.onload = () => {
              (k.innerHTML = ""),
                (k.style.background = "transparent"),
                k.appendChild(B),
                (v.style.color = "#fff");
            }),
            (B.onerror = () => {
              (k.innerHTML = p),
                (k.style.backgroundColor = r),
                (k.style.color = u),
                (v.style.color = u);
            });
        } else {
          const I = new URL(e.url).hostname,
            x = [
              (e) => `https://www.google.com/s2/favicons?sz=64&domain=${e}`,
              (e) => `https://icons.duckduckgo.com/ip2/${e}.ico`,
              (e) => `https://logo.clearbit.com/${e}`,
            ];
          let M = 0;
          const T = document.createElement("img");
          function E() {
            if (M >= x.length)
              return (
                (k.innerHTML = p),
                (k.style.backgroundColor = r),
                (k.style.color = u),
                void (v.style.color = u)
              );
            T.src = x[M](I);
          }
          (T.alt = e.name),
            (T.onload = () => {
              (k.innerHTML = ""),
                (k.style.background = "transparent"),
                k.appendChild(T),
                (v.style.color = "#fff");
            }),
            (T.onerror = () => {
              M++, E();
            }),
            E();
        }
    });
    const e = document.createElement("div");
    (e.className = "link-card add-card"),
      (e.innerHTML = "<p>＋</p>"),
      e.addEventListener("click", B),
      n.appendChild(e),
      k(y);
  }
  function L() {
    h && h.parentNode && (h.parentNode.removeChild(h), (h = null));
  }
  function w(e, n = !1) {
    const l = y[e].url;
    chrome?.tabs
      ? n
        ? chrome.tabs.create({ url: l })
        : chrome.tabs.update({ url: l })
      : n
      ? window.open(l, "_blank")
      : window.open(l, "_self"),
      (d.style.display = "none"),
      (t.style.display = "none"),
      L();
  }
  function B() {
    (f = null),
      (o.value = ""),
      (c.value = ""),
      (i.value = ""),
      (s.value = ""),
      (a.textContent = "Add Shortcut"),
      (l.style.display = "flex"),
      o.focus();
  }
  function I() {
    (l.style.display = "none"), (f = null);
  }
  r.addEventListener("click", function () {
    const e = o.value.trim();
    let t = c.value.trim(),
      n = i.value.trim();
    if (e && t) {
      /^https?:\/\//i.test(t) || (t = "https://" + t);
      try {
        new URL(t);
      } catch {
        return void showCustomAlert("Invalid URL format.");
      }
      const l = () => {
        const l = b(e);
        null !== f
          ? (y[f] = { name: e, url: t, favicon: n, fallback: l })
          : y.push({ name: e, url: t, favicon: n, fallback: l }),
          E(),
          I();
      };
      if (s.files.length > 0) {
        const e = new FileReader();
        (e.onload = (e) => {
          (n = e.target.result), l();
        }),
          e.readAsDataURL(s.files[0]);
      } else l();
    } else showCustomAlert("Enter a valid name and URL.");
  }),
    u.addEventListener("click", () => {
      null !== g && (y.splice(g, 1), E()),
        (m.style.display = "none"),
        (g = null);
    }),
    p.addEventListener("click", () => {
      (m.style.display = "none"), (g = null);
    }),
    e.addEventListener("click", () => {
      (d.style.display = "flex" === d.style.display ? "none" : "flex"),
        (t.style.display = "flex" === d.style.display ? "block" : "none"),
        "flex" === d.style.display && v();
    }),
    t.addEventListener("click", () => {
      (d.style.display = "none"), (t.style.display = "none"), L();
    }),
    document.addEventListener("click", (e) => {
      (e.target === l && I()),
        e.target.closest(".context-menu") ||
          e.target.classList.contains("menu-btn") ||
          L();
    }),
    v();
});



  // --- Block right-click context menu for images ---
    const images = document.querySelectorAll('img');

    images.forEach(img => {
        img.addEventListener('contextmenu', function(e) {
            e.preventDefault(); // Prevent the default right-click context menu
        });
    });