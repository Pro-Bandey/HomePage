/**
 * Universal Search Privacy Shield
 * Role: Browser Security & PETs Content Script
 * 
 * Functions:
 * 1. Decodes nested redirect URLs (e.g., google.com/url?q=...).
 * 2. Strips known tracking parameters (utm_, gclid, etc.).
 * 3. Removes 'ping' attributes.
 * 4. Blocks JS-based click tracking via stopPropagation.
 * 5. Observes DOM for infinite scroll results.
 */

!function(){"use strict";const t=["utm_source","utm_medium","utm_campaign","utm_term","utm_content","gclid","gclsrc","dclid","fbclid","cvid","msclkid","yclid","_openstat","fb_action_ids","fb_action_types"],e=["q","url","u","target","dest"],r=t=>{try{return decodeURIComponent(t)}catch(e){return t}};function a(a){if(!a||"A"!==a.tagName||!a.href)return;a.hasAttribute("ping")&&a.removeAttribute("ping");const n=a.href,c=function(a){if(!a)return null;let n;try{n=new URL(a,window.location.origin)}catch(t){return null}for(const t of e)if(n.searchParams.has(t)){const e=n.searchParams.get(t);if(e&&/^http/i.test(e))try{n=new URL(r(e));break}catch(t){}}let c=!1;return t.forEach((t=>{n.searchParams.has(t)&&(n.searchParams.delete(t),c=!0)})),n.href}(n);c&&n!==c&&(a.href=c,a.setAttribute("data-privacy-shield","active"))}function n(t){const e=t.target.closest("a");e&&(a(e),t.stopPropagation())}window.addEventListener("click",n,{capture:!0}),window.addEventListener("auxclick",n,{capture:!0}),window.addEventListener("mousedown",n,{capture:!0});new MutationObserver((t=>{for(const e of t)"childList"===e.type?e.addedNodes.forEach((t=>{if(t.nodeType===Node.ELEMENT_NODE){"A"===t.tagName&&a(t);t.querySelectorAll("a[href]").forEach(a)}})):"attributes"===e.type&&"href"===e.attributeName&&"A"===e.target.tagName&&a(e.target)})).observe(document.documentElement,{childList:!0,subtree:!0,attributes:!0,attributeFilter:["href","ping"]}),window.addEventListener("DOMContentLoaded",(()=>{document.querySelectorAll("a[href]").forEach(a)}))}();


/**
 * Global Mailto Redirect
 * 
 * What It Does:
 * 1. When a site has
 * 2. <a href="mailto:test@example.com?subject=Hello&body=Hi"> Email me </a>
 * 3. It will open:
 * 4. https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=test@example.com&subject=Hello&body=Hi
 */

!function(){"use strict";document.addEventListener("click",(function(t){const e=t.target.closest('a[href^="mailto:"]');if(!e)return;t.preventDefault(),t.stopPropagation();const n=e.getAttribute("href").replace(/^mailto:/i,"").split("?"),o=n[0],i=n[1]||"";window.open(function(t,e=""){return`https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${encodeURIComponent(t)}`+(e?"&"+e.replace(/^\?/,""):"")}(o,i),"_blank")}),!0)}();
