// // === Custom Windows 11 Style Context Menu for Extension ===
// // Injected into every page by the homepage extension

// (function () {
//     let menu;

//     // --- Utility to create menu ---
//     function createMenu() {
//         if (menu) menu.remove();
//         menu = document.createElement("div");
//         menu.className = "custom-context-menu";
//         menu.style.position = "fixed";
//         menu.style.zIndex = "999999999";
//         menu.style.display = "none";
//         menu.style.minWidth = "220px";
//         menu.style.background = "rgba(40,40,40,0.95)";
//         menu.style.backdropFilter = "blur(10px)";
//         menu.style.border = "1px solid rgba(255,255,255,0.1)";
//         menu.style.borderRadius = "12px";
//         menu.style.padding = "6px 0";
//         menu.style.boxShadow = "0 8px 24px rgba(0,0,0,0.4)";
//         menu.style.fontFamily = "Segoe UI, sans-serif";
//         menu.style.fontSize = "14px";
//         menu.style.color = "#f1f1f1";
//         menu.style.userSelect = "none";
//         document.body.appendChild(menu);
//     }

//     function addItem(icon, text, action, disabled = false) {
//         const item = document.createElement("div");
//         item.className = "context-item";
//         item.style.display = "flex";
//         item.style.alignItems = "center";
//         item.style.padding = "6px 14px";
//         item.style.cursor = disabled ? "not-allowed" : "pointer";
//         item.style.opacity = disabled ? "0.5" : "1";

//         item.innerHTML = `<span style="width:20px; margin-right:8px;">${icon}</span> ${text}`;

//         if (!disabled) {
//             item.onmouseenter = () => (item.style.background = "rgba(255,255,255,0.08)");
//             item.onmouseleave = () => (item.style.background = "transparent");
//             item.onclick = () => {
//                 hideMenu();
//                 action();
//             };
//         }
//         menu.appendChild(item);
//     }

//     function addSeparator() {
//         const sep = document.createElement("div");
//         sep.style.height = "1px";
//         sep.style.background = "rgba(255,255,255,0.1)";
//         sep.style.margin = "4px 0";
//         menu.appendChild(sep);
//     }

//     function hideMenu() {
//         if (menu) menu.style.display = "none";
//     }

//     // --- Context detection ---
//     let targetEl = null;
//     document.addEventListener("contextmenu", (e) => {
//         e.preventDefault();
//         targetEl = e.target;
//         showMenu(e.pageX, e.pageY);
//     });

//     document.addEventListener("click", hideMenu);

//     function showMenu(x, y) {
//         createMenu();

//         if (targetEl.tagName === "IMG") {
//             buildImageMenu();
//         } else if (window.getSelection().toString().length > 0) {
//             buildTextMenu();
//         } else {
//             buildPageMenu();
//         }

//         menu.style.display = "block";
//         const menuRect = menu.getBoundingClientRect();
//         if (x + menuRect.width > window.innerWidth) x -= menuRect.width;
//         if (y + menuRect.height > window.innerHeight) y -= menuRect.height;
//         menu.style.left = x + "px";
//         menu.style.top = y + "px";
//     }

//     // --- Menu Types ---
//     function buildPageMenu() {
//         addItem("🔄", "Reload", () => location.reload());
//         addItem("🏠", "Back", () => history.back(), history.length <= 1);
//         addItem("➡️", "Forward", () => history.forward());
//         addItem("🖨️", "Print", () => window.print());
//         addSeparator();
//         addItem("🔍", "Search with Google Lens", () => {
//             window.open("https://lens.google.com/uploadbyurl?url=" + encodeURIComponent(location.href), "_blank");
//         });
//         addItem("📑", "Open in Reading Mode", () => openReadingMode());
//         addItem("📄", "View Page Source (Tab)", () => openViewSourceTab());
//         addItem("📑", "View Page Source (Side Panel)", () => showSourceSidePanel());
//         if (!location.href.startsWith("file:") && !location.href.startsWith("chrome:")) {
//             addItem("🔗", "Generate QR Code", () => generateQRCode(location.href));
//         }
//     }

//     function buildImageMenu() {
//         addItem("🖼️", "Open Image in New Tab", () => window.open(targetEl.src, "_blank"));
//         addItem("💾", "Save Image As", () => downloadFile(targetEl.src));
//         addItem("📋", "Copy Image", () => copyImage(targetEl));
//         addItem("🔗", "Copy Image Address", () => copyText(targetEl.src));
//     }

//     function buildTextMenu() {
//         const selected = window.getSelection().toString().trim();
//         addItem("📋", "Copy", () => copyText(selected));
//         addItem("🔍", `Search Google for "${selected.substring(0, 20)}..."`, () => {
//             window.open("https://www.google.com/search?q=" + encodeURIComponent(selected), "_blank");
//         });

//         // If selected text looks like a domain or URL
//         if (/^(https?:\/\/)?([\w.-]+\.[a-z]{2,})(\/\S*)?$/i.test(selected)) {
//             let url = selected.startsWith("http") ? selected : "https://" + selected;
//             addItem("🌐", "Open Link in New Tab", () => window.open(url, "_blank"));
//         }
//     }

//     // --- Features ---
//     function copyText(text) {
//         navigator.clipboard.writeText(text).catch(() => {
//             const ta = document.createElement("textarea");
//             ta.value = text;
//             document.body.appendChild(ta);
//             ta.select();
//             document.execCommand("copy");
//             ta.remove();
//         });
//     }

//     function copyImage(img) {
//         fetch(img.src)
//             .then((res) => res.blob())
//             .then((blob) => {
//                 const item = new ClipboardItem({ [blob.type]: blob });
//                 navigator.clipboard.write([item]);
//             })
//             .catch(() => alert("Copy image not supported here"));
//     }

//     function downloadFile(url) {
//         const a = document.createElement("a");
//         a.href = url;
//         a.download = "";
//         document.body.appendChild(a);
//         a.click();
//         a.remove();
//     }

//     function generateQRCode(url) {
//         const qr = window.open("", "_blank", "width=300,height=300");
//         qr.document.write(`<img src="https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(url)}">`);
//     }

//     function openReadingMode() {
//         const readerWin = window.open("", "_blank", "width=800,height=600,scrollbars=yes");
//         readerWin.document.write("<h1>Reading Mode</h1><hr>");
//         readerWin.document.write("<article style='font-family:Segoe UI, sans-serif; line-height:1.6; padding:20px; max-width:700px; margin:auto;'>");
//         readerWin.document.write(document.body.innerText);
//         readerWin.document.write("</article>");
//     }

//     function openViewSourceTab() {
//         try {
//             window.open("view-source:" + location.href, "_blank");
//         } catch (e) {
//             showSourceSidePanel();
//         }
//     }

//     function showSourceSidePanel() {
//         const existing = document.querySelector(".source-side-panel");
//         if (existing) {
//             existing.remove();
//             return;
//         }

//         const panel = document.createElement("div");
//         panel.className = "source-side-panel";
//         panel.style.position = "fixed";
//         panel.style.top = "0";
//         panel.style.right = "0";
//         panel.style.width = "40%";
//         panel.style.height = "100%";
//         panel.style.background = "#1e1e1e";
//         panel.style.color = "#dcdcdc";
//         panel.style.borderLeft = "2px solid #444";
//         panel.style.zIndex = "9999999";
//         panel.style.display = "flex";
//         panel.style.flexDirection = "column";
//         panel.style.fontFamily = "Consolas, monospace";
//         panel.style.fontSize = "13px";
//         panel.style.boxShadow = "-4px 0 10px rgba(0,0,0,0.4)";
//         panel.style.animation = "slideIn 0.25s ease-out";

//         const header = document.createElement("div");
//         header.style.padding = "8px 12px";
//         header.style.background = "#2d2d2d";
//         header.style.borderBottom = "1px solid #444";
//         header.style.display = "flex";
//         header.style.justifyContent = "space-between";
//         header.style.alignItems = "center";
//         header.innerHTML = `
//             <span style="font-weight:bold; color:#fff;">Page Source</span>
//             <button id="closeSidePanel" style="padding:2px 8px; border:none; background:#d9534f; color:#fff; border-radius:4px; cursor:pointer;">✖</button>
//         `;

//         const content = document.createElement("pre");
//         content.style.flex = "1";
//         content.style.margin = "0";
//         content.style.padding = "10px";
//         content.style.overflow = "auto";
//         content.style.whiteSpace = "pre-wrap";
//         content.style.wordBreak = "break-word";
//         content.innerHTML = highlightHTML(document.documentElement.outerHTML);

//         panel.appendChild(header);
//         panel.appendChild(content);
//         document.body.appendChild(panel);

//         document.getElementById("closeSidePanel").onclick = () => panel.remove();

//         const style = document.createElement("style");
//         style.textContent = `
//           @keyframes slideIn {
//             from { transform: translateX(100%); }
//             to { transform: translateX(0); }
//           }
//           .hl-tag { color:#569cd6; }
//           .hl-attr { color:#dcdcaa; }
//           .hl-value { color:#ce9178; }
//           .hl-comment { color:#6a9955; font-style:italic; }
//         `;
//         document.head.appendChild(style);
//     }

//     // --- Syntax Highlighter ---
//     function highlightHTML(html) {
//         return html
//             .replace(/&/g, "&amp;")
//             .replace(/</g, "&lt;")
//             .replace(/>/g, "&gt;")
//             // Comments
//             .replace(/(&lt;!--[\s\S]*?--&gt;)/g, '<span class="hl-comment">$1</span>')
//             // Tags
//             .replace(/(&lt;\/?)(\w+)/g, '$1<span class="hl-tag">$2</span>')
//             // Attributes
//             .replace(/(\w+)(=)/g, '<span class="hl-attr">$1</span>$2')
//             // Values
//             .replace(/=&quot;(.*?)&quot;/g, '=<span class="hl-value">&quot;$1&quot;</span>');
//     }
// })();
