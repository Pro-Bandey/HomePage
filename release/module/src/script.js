function _0x4325() {
  const e = [
    "toLowerCase",
    "2164565qdVoYf",
    ".svg",
    "outerHTML",
    "stroke-color-picker",
    "trim",
    "search-input",
    "121448ybbdeK",
    "stroke",
    "popup",
    ".alert",
    "execCommand",
    "2172FhyMaY",
    "copy",
    "1127460fqwxgd",
    "value",
    ".cards",
    "size-input",
    "colorname",
    "querySelector",
    "none",
    "13195HsXhit",
    "innerHTML",
    "target",
    ".close-icon",
    "style",
    "createElementNS",
    "input",
    "block",
    "406426ImrDxi",
    "getElementById",
    "16579899uFXiTb",
    "createElement",
    "querySelectorAll",
    "getAttribute",
    "nothing-alert",
    "textContent",
    "50px",
    "image/svg+xml",
    "display",
    "1024098TGPcGE",
    "disabled",
    "svg-icon",
    "checked",
    "addEventListener",
    "appendChild",
    "error",
    "DOMContentLoaded",
    "copy-button",
    "div",
    "serializeToString",
    "createRange",
    "innerText",
    "click",
    "addRange",
    "includes",
    "svg",
    "height",
    "2gUktGd",
    "stroke-width",
    "width",
    "removeAllRanges",
    "setAttribute",
    "href",
    "fill",
    "download",
    "createObjectURL",
    "forEach",
    "Code Copied!",
    "#000000",
    "getSelection",
    "svg-name",
  ];
  return (_0x4325 = function () {
    return e;
  })();
}
const _0x3eaf11 = _0x1bdd;
function _0x1bdd(e, t) {
  const n = _0x4325();
  return (_0x1bdd = function (e, t) {
    return ((e -= 457), n[e]);
  })(e, t);
}
((function () {
  for (var e = _0x1bdd, t = _0x4325(); ; )
    try {
      if (
        395184 ==
        +parseInt(e(511)) * (-parseInt(e(468)) / 2) +
          parseInt(e(522)) / 3 +
          -parseInt(e(496)) / 4 +
          -parseInt(e(483)) / 5 +
          (-parseInt(e(494)) / 6) * (parseInt(e(503)) / 7) +
          parseInt(e(489)) / 8 +
          parseInt(e(513)) / 9
      )
        break;
      t.push(t.shift());
    } catch (e) {
      t.push(t.shift());
    }
})(),
  document.addEventListener(_0x3eaf11(457), function () {
    const d = _0x3eaf11,
      t = document[d(515)](d(498)),
      r = document[d(512)](d(491)),
      i = document[d(512)]("size-slider"),
      u = document[d(512)](d(499)),
      a = document.getElementById("currentColorCheckbox"),
      s = document[d(512)]("fill-color-picker"),
      c = document.getElementById(d(524)),
      l = document[d(512)](d(481)),
      m = document[d(512)]("svg-code"),
      e = document[d(501)](d(506)),
      n = document.getElementById(d(458)),
      o = document[d(512)]("download-button"),
      f = document[d(512)](d(500)),
      p = document[d(512)](d(488)),
      v = document[d(512)]("stroke-width-slider"),
      g = document.getElementById("width-input"),
      x = document[d(512)](d(486));
    let h = 0,
      b = 50;
    function w(e, t) {
      var n = d,
        o =
          ((l[n(518)] = e),
          (m[n(518)] = t),
          (c[n(504)] = ""),
          (e = t),
          (t = d),
          ((o = document[t(514)](t(459)))[t(504)] = e),
          (e = o[t(501)](t(466))) ||
            (console[t(528)]("Invalid SVG code provided."),
            document[t(508)]("http://www.w3.org/2000/svg", t(466))));
      (o.setAttribute(n(470), b),
        o.setAttribute(n(467), b),
        o[n(472)]("stroke", x[n(497)]),
        o[n(472)](n(469), h),
        c[n(527)](o),
        (r[n(507)][n(521)] = n(510)));
    }
    function y() {
      var e = d;
      ((r[e(507)].display = "none"),
        (e = d),
        (u[e(497)] = 50),
        (i[e(497)] = 50),
        (u[e(462)] = e(519)),
        (g[e(462)] = "0%"),
        (b = 50),
        (a.checked = !1),
        (s[e(497)] = e(479)),
        (x[e(497)] = e(479)),
        (f[e(518)] = s[e(497)]),
        (s[e(523)] = !1),
        (v[e(497)] = 0),
        (h = 0));
    }
    (t[d(477)](function (r) {
      const c = d;
      r[c(526)](c(463), function () {
        var e,
          t,
          n = c,
          o = r[n(501)](n(466));
        o &&
          ((e = r[n(501)]("h2")[n(518)]),
          (t = o[n(516)](n(474))),
          w(e, new XMLSerializer()[n(460)](o)),
          (i[n(497)] = 50),
          (u[n(462)] = "50px"),
          (g.innerText = "0%"),
          (b = 50),
          (a.checked = !1),
          (s[n(497)] = t),
          (x.value = "#000000"),
          (f[n(518)] = s[n(497)]),
          (s.disabled = !1),
          (v.value = 0),
          (h = 0));
      });
    }),
      e.addEventListener("click", y),
      i[d(526)](d(509), function () {
        var e,
          t = d;
        ((b = i[t(497)]),
          (t = d),
          (e = c[t(501)](t(466))) &&
            (e.setAttribute(t(470), b),
            e[t(472)](t(467), b),
            (i[t(497)] = b),
            (u[t(462)] = b + "px"),
            (m[t(518)] = e.outerHTML)));
      }),
      v.addEventListener(d(509), function () {
        var e,
          t = d;
        ((h = v[t(497)]),
          (t = d),
          (e = c[t(501)](t(466))) &&
            (e.setAttribute(t(469), h),
            e[t(472)](t(490), x[t(497)]),
            (v.value = h),
            (g[t(462)] = 10 * h + "%"),
            (m.textContent = e[t(485)])));
      }),
      p[d(526)](d(509), function () {
        var e = d,
          e = p[e(497)][e(487)]();
        {
          var o = e;
          const r = d,
            c = document[r(512)](r(517));
          let n = 0;
          (t[r(477)](function (e) {
            var t = r;
            e[t(501)]("h2")[t(518)][t(482)]()[t(465)](o[t(482)]())
              ? ((c[t(507)].display = t(502)),
                (e[t(507)][t(521)] = "flex"),
                n++)
              : (e[t(507)][t(521)] = t(502));
          }),
            0 == n && (c[r(507)][r(521)] = r(510)));
        }
      }),
      a[d(526)]("change", function () {
        var e,
          t = d,
          n = c[t(501)](t(466));
        (n &&
          (a[t(525)]
            ? (n[t(472)](t(474), "currentColor"),
              (s.disabled = !0),
              (f.textContent = s[t(497)]))
            : (n[t(472)](t(474), s[t(497)]),
              (s[t(523)] = !1),
              (e = n.getAttribute(t(474))) && (s[t(497)] = e))),
          (m[t(518)] = n[t(485)]));
      }),
      x[d(526)](d(509), function () {
        var e = d,
          t = c[e(501)](e(466));
        (t && t[e(472)](e(490), x[e(497)]), (m.textContent = t[e(485)]));
      }),
      s[d(526)](d(509), function () {
        var e = d,
          t = c[e(501)](e(466));
        (t &&
          !a[e(525)] &&
          (t[e(472)](e(474), s[e(497)]), (f[e(518)] = s.value)),
          (m[e(518)] = t[e(485)]));
      }),
      n[d(526)](d(463), function () {
        const t = d,
          n = document[t(501)](t(492)),
          e = document[t(461)]();
        (e.selectNode(m),
          window[t(480)]().removeAllRanges(),
          window[t(480)]()[t(464)](e),
          document[t(493)](t(495)),
          window[t(480)]()[t(471)](),
          (n.innerText = t(478)),
          setTimeout(function () {
            var e = t;
            n[e(462)] = "";
          }, 2e3));
      }),
      o[d(526)](d(463), function () {
        var e,
          t = d,
          n = c[t(501)](t(466));
        n &&
          ((n = new Blob([n[t(485)]], { type: t(520) })),
          ((e = document[t(514)]("a"))[t(473)] = URL[t(476)](n)),
          (e[t(475)] = l[t(518)] + t(484)),
          e[t(463)]());
      }),
      r.addEventListener(d(463), function (e) {
        e[d(505)] === r && y();
      }));
  }));
let ref = 1,
  type = "iconspage";
