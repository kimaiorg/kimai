var Gr = Object.defineProperty;
var Vr = (n, t, e) => (t in n ? Gr(n, t, { enumerable: !0, configurable: !0, writable: !0, value: e }) : (n[t] = e));
var N = (n, t, e) => Vr(n, typeof t != "symbol" ? t + "" : t, e);
function Zr(n, t) {
  const e = new Array(t.length).fill(0);
  return new Array(t.length).fill(0).map((r, s) => (i, a) => {
    (e[s] = (i / a) * t[s] * 1e3),
      n(
        e.reduce((o, l) => o + l, 0),
        1e3
      );
  });
}
function Kr(n) {
  var t, e, r, s, i, a, o, l, _;
  if (((n = n ?? globalThis), !n.__playwright_builtins__)) {
    const f = {
      setTimeout: (t = n.setTimeout) == null ? void 0 : t.bind(n),
      clearTimeout: (e = n.clearTimeout) == null ? void 0 : e.bind(n),
      setInterval: (r = n.setInterval) == null ? void 0 : r.bind(n),
      clearInterval: (s = n.clearInterval) == null ? void 0 : s.bind(n),
      requestAnimationFrame: (i = n.requestAnimationFrame) == null ? void 0 : i.bind(n),
      cancelAnimationFrame: (a = n.cancelAnimationFrame) == null ? void 0 : a.bind(n),
      requestIdleCallback: (o = n.requestIdleCallback) == null ? void 0 : o.bind(n),
      cancelIdleCallback: (l = n.cancelIdleCallback) == null ? void 0 : l.bind(n),
      performance: n.performance,
      eval: (_ = n.eval) == null ? void 0 : _.bind(n),
      Intl: n.Intl,
      Date: n.Date,
      Map: n.Map,
      Set: n.Set
    };
    Object.defineProperty(n, "__playwright_builtins__", { value: f, configurable: !1, enumerable: !1, writable: !1 });
  }
  return n.__playwright_builtins__;
}
const J = Kr();
J.setTimeout;
J.clearTimeout;
J.setInterval;
J.clearInterval;
J.requestAnimationFrame;
J.cancelAnimationFrame;
J.requestIdleCallback;
J.cancelIdleCallback;
J.performance;
J.Intl;
J.Date;
const Xr = J.Map;
J.Set;
const Nn = { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" };
function $r(n) {
  return n.replace(/[&<>"']/gu, (t) => Nn[t]);
}
function Jr(n) {
  return n.replace(/[&<]/gu, (t) => Nn[t]);
}
function Lt(n, t, e) {
  return n.find((r, s) => {
    if (s === n.length - 1) return !0;
    const i = n[s + 1];
    return Math.abs(t(r) - e) < Math.abs(t(i) - e);
  });
}
function Ln(n) {
  return Array.isArray(n) && typeof n[0] == "string";
}
function Qr(n) {
  return Array.isArray(n) && Array.isArray(n[0]);
}
class zr {
  constructor(t, e, r, s, i) {
    N(this, "_htmlCache");
    N(this, "_snapshots");
    N(this, "_index");
    N(this, "snapshotName");
    N(this, "_resources");
    N(this, "_snapshot");
    N(this, "_callId");
    N(this, "_screencastFrames");
    (this._htmlCache = t),
      (this._resources = e),
      (this._snapshots = r),
      (this._index = i),
      (this._snapshot = r[i]),
      (this._callId = r[i].callId),
      (this._screencastFrames = s),
      (this.snapshotName = r[i].snapshotName);
  }
  snapshot() {
    return this._snapshots[this._index];
  }
  viewport() {
    return this._snapshots[this._index].viewport;
  }
  closestScreenshot() {
    var s;
    const { wallTime: t, timestamp: e } = this.snapshot(),
      r =
        t && (s = this._screencastFrames[0]) != null && s.frameSwapWallTime
          ? Lt(this._screencastFrames, (i) => i.frameSwapWallTime, t)
          : Lt(this._screencastFrames, (i) => i.timestamp, e);
    return r == null ? void 0 : r.sha1;
  }
  render() {
    const t = [],
      e = (i, a, o, l) => {
        if (typeof i == "string") {
          o === "STYLE" || o === "style" ? t.push(ss(i)) : t.push(Jr(i));
          return;
        }
        if (Qr(i)) {
          const _ = a - i[0][0];
          if (_ >= 0 && _ <= a) {
            const f = ts(this._snapshots[_]),
              b = i[0][1];
            if (b >= 0 && b < f.length) return e(f[b], _, o, l);
          }
        } else if (Ln(i)) {
          const [_, f, ...b] = i,
            h = _ === "NOSCRIPT" ? "X-NOSCRIPT" : _,
            S = Object.entries(f || {});
          t.push("<", h);
          const C = "__playwright_current_src__",
            u = h === "IFRAME" || h === "FRAME",
            c = h === "A",
            d = h === "IMG",
            y = d && S.some((m) => m[0] === C),
            g = h === "SOURCE" && o === "PICTURE" && (l == null ? void 0 : l.some((m) => m[0] === C));
          for (const [m, E] of S) {
            let p = m;
            u && m.toLowerCase() === "src" && (p = "__playwright_src__"),
              d && m === C && (p = "src"),
              ["src", "srcset"].includes(m.toLowerCase()) && (y || g) && (p = "_" + p);
            let R = E;
            c && m.toLowerCase() === "href"
              ? (R = "link://" + E)
              : (m.toLowerCase() === "href" || m.toLowerCase() === "src" || m === C) && (R = it(E)),
              t.push(" ", p, '="', $r(R), '"');
          }
          t.push(">");
          for (const m of b) e(m, a, h, S);
          es.has(h) || t.push("</", h, ">");
          return;
        } else return;
      },
      r = this._snapshot;
    return {
      html: this._htmlCache.getOrCompute(this, () => {
        e(r.html, this._index, void 0, void 0);
        const a =
          (r.doctype ? `<!DOCTYPE ${r.doctype}>` : "") +
          [
            "<style>*,*::before,*::after { visibility: hidden }</style>",
            `<script>${ns(this.viewport(), this._callId, this.snapshotName)}<\/script>`
          ].join("") +
          t.join("");
        return { value: a, size: a.length };
      }),
      pageId: r.pageId,
      frameId: r.frameId,
      index: this._index
    };
  }
  resourceByUrl(t, e) {
    const r = this._snapshot;
    let s, i;
    for (const o of this._resources) {
      if (typeof o._monotonicTime == "number" && o._monotonicTime >= r.timestamp) break;
      o.response.status !== 304 &&
        o.request.url === t &&
        o.request.method === e &&
        (o._frameref === r.frameId ? (s = o) : (i = o));
    }
    let a = s ?? i;
    if (a && e.toUpperCase() === "GET") {
      for (const o of r.resourceOverrides)
        if (t === o.url && o.sha1) {
          a = { ...a, response: { ...a.response, content: { ...a.response.content, _sha1: o.sha1 } } };
          break;
        }
    }
    return a;
  }
}
const es = new Set([
  "AREA",
  "BASE",
  "BR",
  "COL",
  "COMMAND",
  "EMBED",
  "HR",
  "IMG",
  "INPUT",
  "KEYGEN",
  "LINK",
  "MENUITEM",
  "META",
  "PARAM",
  "SOURCE",
  "TRACK",
  "WBR"
]);
function ts(n) {
  if (!n._nodes) {
    const t = [],
      e = (r) => {
        if (typeof r == "string") t.push(r);
        else if (Ln(r)) {
          const [, , ...s] = r;
          for (const i of s) e(i);
          t.push(r);
        }
      };
    e(n.html), (n._nodes = t);
  }
  return n._nodes;
}
function ns(n, ...t) {
  function e(r, s, ...i) {
    const a = new URLSearchParams(location.search),
      o = a.has("shouldPopulateCanvasFromScreenshot"),
      l = a.has("isUnderTest"),
      _ = { viewport: s, frames: new WeakMap() };
    window.__playwright_frame_bounding_rects__ = _;
    const f =
        "Recorded click position in absolute coordinates did not match the center of the clicked element. This is likely due to a difference between the test runner and the trace viewer operating systems.",
      b = [],
      h = [],
      S = [],
      C = [];
    let u = window;
    for (; u !== u.parent && !u.location.pathname.match(/\/page@[a-z0-9]+$/); ) u = u.parent;
    const c = (g) => {
        for (const m of g.querySelectorAll("[__playwright_scroll_top_]")) b.push(m);
        for (const m of g.querySelectorAll("[__playwright_scroll_left_]")) h.push(m);
        for (const m of g.querySelectorAll("[__playwright_value_]")) {
          const E = m;
          E.type !== "file" && (E.value = E.getAttribute("__playwright_value_")),
            m.removeAttribute("__playwright_value_");
        }
        for (const m of g.querySelectorAll("[__playwright_checked_]"))
          (m.checked = m.getAttribute("__playwright_checked_") === "true"), m.removeAttribute("__playwright_checked_");
        for (const m of g.querySelectorAll("[__playwright_selected_]"))
          (m.selected = m.getAttribute("__playwright_selected_") === "true"),
            m.removeAttribute("__playwright_selected_");
        for (const m of g.querySelectorAll("[__playwright_popover_open_]")) {
          try {
            m.showPopover();
          } catch {}
          m.removeAttribute("__playwright_popover_open_");
        }
        for (const m of g.querySelectorAll("[__playwright_dialog_open_]")) {
          try {
            m.getAttribute("__playwright_dialog_open_") === "modal" ? m.showModal() : m.show();
          } catch {}
          m.removeAttribute("__playwright_dialog_open_");
        }
        for (const m of i)
          for (const E of g.querySelectorAll(`[__playwright_target__="${m}"]`)) {
            const p = E.style;
            (p.outline = "2px solid #006ab1"), (p.backgroundColor = "#6fa8dc7f"), S.push(E);
          }
        for (const m of g.querySelectorAll("iframe, frame")) {
          const E = m.getAttribute("__playwright_bounding_rect__");
          m.removeAttribute("__playwright_bounding_rect__");
          const p = E ? JSON.parse(E) : void 0;
          p && _.frames.set(m, { boundingRect: p, scrollLeft: 0, scrollTop: 0 });
          const R = m.getAttribute("__playwright_src__");
          if (!R) m.setAttribute("src", 'data:text/html,<body style="background: #ddd"></body>');
          else {
            const T = new URL(r(window.location.href)),
              A = T.pathname.lastIndexOf("/snapshot/");
            A !== -1 && (T.pathname = T.pathname.substring(0, A + 1)),
              (T.pathname += R.substring(1)),
              m.setAttribute("src", T.toString());
          }
        }
        {
          const m = g.querySelector("body[__playwright_custom_elements__]");
          if (m && window.customElements) {
            const E = (m.getAttribute("__playwright_custom_elements__") || "").split(",");
            for (const p of E) window.customElements.define(p, class extends HTMLElement {});
          }
        }
        for (const m of g.querySelectorAll("template[__playwright_shadow_root_]")) {
          const E = m,
            p = E.parentElement.attachShadow({ mode: "open" });
          p.appendChild(E.content), E.remove(), c(p);
        }
        if ("adoptedStyleSheets" in g) {
          const m = [...g.adoptedStyleSheets];
          for (const E of g.querySelectorAll("template[__playwright_style_sheet_]")) {
            const p = E,
              R = new CSSStyleSheet();
            R.replaceSync(p.getAttribute("__playwright_style_sheet_")), m.push(R);
          }
          g.adoptedStyleSheets = m;
        }
        C.push(...g.querySelectorAll("canvas"));
      },
      d = () => {
        window.removeEventListener("load", d);
        for (const E of b)
          (E.scrollTop = +E.getAttribute("__playwright_scroll_top_")),
            E.removeAttribute("__playwright_scroll_top_"),
            _.frames.has(E) && (_.frames.get(E).scrollTop = E.scrollTop);
        for (const E of h)
          (E.scrollLeft = +E.getAttribute("__playwright_scroll_left_")),
            E.removeAttribute("__playwright_scroll_left_"),
            _.frames.has(E) && (_.frames.get(E).scrollLeft = E.scrollTop);
        document.styleSheets[0].disabled = !0;
        const g = new URL(window.location.href).searchParams,
          m = window === u;
        if (g.get("pointX") && g.get("pointY")) {
          const E = +g.get("pointX"),
            p = +g.get("pointY"),
            R = g.has("hasInputTarget"),
            T = S.length > 0,
            A = document.documentElement ? [document.documentElement] : [];
          for (const x of T ? S : A) {
            const w = document.createElement("x-pw-pointer");
            if (
              ((w.style.position = "fixed"),
              (w.style.backgroundColor = "#f44336"),
              (w.style.width = "20px"),
              (w.style.height = "20px"),
              (w.style.borderRadius = "10px"),
              (w.style.margin = "-10px 0 0 -10px"),
              (w.style.zIndex = "2147483646"),
              (w.style.display = "flex"),
              (w.style.alignItems = "center"),
              (w.style.justifyContent = "center"),
              T)
            ) {
              const O = x.getBoundingClientRect(),
                I = O.left + O.width / 2,
                v = O.top + O.height / 2;
              if (
                ((w.style.left = I + "px"),
                (w.style.top = v + "px"),
                m && (Math.abs(I - E) >= 10 || Math.abs(v - p) >= 10))
              ) {
                const k = document.createElement("x-pw-pointer-warning");
                (k.textContent = "⚠"),
                  (k.style.fontSize = "19px"),
                  (k.style.color = "white"),
                  (k.style.marginTop = "-3.5px"),
                  (k.style.userSelect = "none"),
                  w.appendChild(k),
                  w.setAttribute("title", f);
              }
              document.documentElement.appendChild(w);
            } else
              m && !R && ((w.style.left = E + "px"), (w.style.top = p + "px"), document.documentElement.appendChild(w));
          }
        }
        if (C.length > 0) {
          let E = function (R, T) {
            function A() {
              const x = document.createElement("canvas");
              (x.width = x.width / Math.floor(x.width / 24)), (x.height = x.height / Math.floor(x.height / 24));
              const w = x.getContext("2d");
              return (
                (w.fillStyle = "lightgray"),
                w.fillRect(0, 0, x.width, x.height),
                (w.fillStyle = "white"),
                w.fillRect(0, 0, x.width / 2, x.height / 2),
                w.fillRect(x.width / 2, x.height / 2, x.width, x.height),
                w.createPattern(x, "repeat")
              );
            }
            (R.fillStyle = A()), R.fillRect(0, 0, T.width, T.height);
          };
          const p = new Image();
          (p.onload = () => {
            var R;
            for (const T of C) {
              const A = T.getContext("2d"),
                x = T.getAttribute("__playwright_bounding_rect__");
              if ((T.removeAttribute("__playwright_bounding_rect__"), !x)) continue;
              let w;
              try {
                w = JSON.parse(x);
              } catch {
                continue;
              }
              let O = window;
              for (; O !== u; ) {
                const U = O.frameElement;
                O = O.parent;
                const F = (R = O.__playwright_frame_bounding_rects__) == null ? void 0 : R.frames.get(U);
                if (!(F != null && F.boundingRect)) break;
                const Y = F.boundingRect.left - F.scrollLeft,
                  P = F.boundingRect.top - F.scrollTop;
                (w.left += Y), (w.top += P), (w.right += Y), (w.bottom += P);
              }
              const { width: I, height: v } = u.__playwright_frame_bounding_rects__.viewport;
              (w.left = w.left / I), (w.top = w.top / v), (w.right = w.right / I), (w.bottom = w.bottom / v);
              const k = w.right > 1 || w.bottom > 1;
              if (w.left > 1 || w.top > 1) {
                T.title = "Playwright couldn't capture canvas contents because it's located outside the viewport.";
                continue;
              }
              E(A, T),
                o
                  ? (A.drawImage(
                      p,
                      w.left * p.width,
                      w.top * p.height,
                      (w.right - w.left) * p.width,
                      (w.bottom - w.top) * p.height,
                      0,
                      0,
                      T.width,
                      T.height
                    ),
                    k
                      ? (T.title =
                          "Playwright couldn't capture full canvas contents because it's located partially outside the viewport.")
                      : (T.title =
                          "Canvas contents are displayed on a best-effort basis based on viewport screenshots taken during test execution."))
                  : (T.title = "Canvas content display is disabled."),
                l &&
                  console.log(
                    "canvas drawn:",
                    JSON.stringify([w.left, w.top, w.right - w.left, w.bottom - w.top].map((U) => Math.floor(U * 100)))
                  );
            }
          }),
            (p.onerror = () => {
              for (const R of C) {
                const T = R.getContext("2d");
                E(T, R), (R.title = "Playwright couldn't show canvas contents because the screenshot failed to load.");
              }
            }),
            (p.src = location.href.replace("/snapshot", "/closest-screenshot"));
        }
      },
      y = () => c(document);
    window.addEventListener("load", d), window.addEventListener("DOMContentLoaded", y);
  }
  return `
(${e.toString()})(${at.toString()}, ${JSON.stringify(n)}${t.map((r) => `, "${r}"`).join("")})`;
}
const Mn = ["about:", "blob:", "data:", "file:", "ftp:", "http:", "https:", "mailto:", "sftp:", "ws:", "wss:"],
  Mt = "http://playwright.bloburl/#";
function it(n) {
  n.startsWith(Mt) && (n = n.substring(Mt.length));
  try {
    const t = new URL(n);
    if (t.protocol === "javascript:" || t.protocol === "vbscript:") return "javascript:void(0)";
    const e = t.protocol === "blob:",
      r = t.protocol === "file:";
    if (!e && !r && Mn.includes(t.protocol)) return n;
    const s = "pw-" + t.protocol.slice(0, t.protocol.length - 1);
    return (
      r || (t.protocol = "https:"),
      (t.hostname = t.hostname ? `${s}--${t.hostname}` : s),
      r && (t.protocol = "https:"),
      t.toString()
    );
  } catch {
    return n;
  }
}
const rs = /url\(['"]?([\w-]+:)\/\//gi;
function ss(n) {
  return n.replace(rs, (t, e) =>
    !(e === "blob:") && !(e === "file:") && Mn.includes(e) ? t : t.replace(e + "//", `https://pw-${e.slice(0, -1)}--`)
  );
}
function at(n) {
  const t = new URL(n);
  return t.pathname.endsWith("/snapshot.html") ? t.searchParams.get("r") : n;
}
class is {
  constructor(t, e) {
    N(this, "_snapshotStorage");
    N(this, "_resourceLoader");
    N(this, "_snapshotIds", new Map());
    (this._snapshotStorage = t), (this._resourceLoader = e);
  }
  serveSnapshot(t, e, r) {
    const s = this._snapshot(t, e);
    if (!s) return new Response(null, { status: 404 });
    const i = s.render();
    return (
      this._snapshotIds.set(r, s),
      new Response(i.html, { status: 200, headers: { "Content-Type": "text/html; charset=utf-8" } })
    );
  }
  async serveClosestScreenshot(t, e) {
    const r = this._snapshot(t, e),
      s = r == null ? void 0 : r.closestScreenshot();
    return s ? new Response(await this._resourceLoader(s)) : new Response(null, { status: 404 });
  }
  serveSnapshotInfo(t, e) {
    const r = this._snapshot(t, e);
    return this._respondWithJson(
      r
        ? {
            viewport: r.viewport(),
            url: r.snapshot().frameUrl,
            timestamp: r.snapshot().timestamp,
            wallTime: r.snapshot().wallTime
          }
        : { error: "No snapshot found" }
    );
  }
  _snapshot(t, e) {
    const r = e.get("name");
    return this._snapshotStorage.snapshotByName(t, r);
  }
  _respondWithJson(t) {
    return new Response(JSON.stringify(t), {
      status: 200,
      headers: { "Cache-Control": "public, max-age=31536000", "Content-Type": "application/json" }
    });
  }
  async serveResource(t, e, r) {
    let s;
    const i = this._snapshotIds.get(r);
    for (const S of t) if (((s = i == null ? void 0 : i.resourceByUrl(as(S), e)), s)) break;
    if (!s) return new Response(null, { status: 404 });
    const a = s.response.content._sha1,
      o = a ? (await this._resourceLoader(a)) || new Blob([]) : new Blob([]);
    let l = s.response.content.mimeType;
    /^text\/|^application\/(javascript|json)/.test(l) && !l.includes("charset") && (l = `${l}; charset=utf-8`);
    const f = new Headers();
    l !== "x-unknown" && f.set("Content-Type", l);
    for (const { name: S, value: C } of s.response.headers) f.set(S, C);
    f.delete("Content-Encoding"),
      f.delete("Access-Control-Allow-Origin"),
      f.set("Access-Control-Allow-Origin", "*"),
      f.delete("Content-Length"),
      f.set("Content-Length", String(o.size)),
      f.set("Cache-Control", "public, max-age=31536000");
    const { status: b } = s.response,
      h = b === 101 || b === 204 || b === 205 || b === 304;
    return new Response(h ? null : o, { headers: f, status: s.response.status, statusText: s.response.statusText });
  }
}
function as(n) {
  try {
    const t = new URL(n);
    return (t.hash = ""), t.toString();
  } catch {
    return n;
  }
}
function os(n) {
  const t = new Xr(),
    { files: e, stacks: r } = n;
  for (const s of r) {
    const [i, a] = s;
    t.set(
      `call@${i}`,
      a.map((o) => ({ file: e[o[0]], line: o[1], column: o[2], function: o[3] }))
    );
  }
  return t;
}
class cs {
  constructor(t) {
    N(this, "_maxSize");
    N(this, "_map");
    N(this, "_size");
    (this._maxSize = t), (this._map = new Map()), (this._size = 0);
  }
  getOrCompute(t, e) {
    if (this._map.has(t)) {
      const s = this._map.get(t);
      return this._map.delete(t), this._map.set(t, s), s.value;
    }
    const r = e();
    for (; this._map.size && this._size + r.size > this._maxSize; ) {
      const [s, i] = this._map.entries().next().value;
      (this._size -= i.size), this._map.delete(s);
    }
    return this._map.set(t, r), (this._size += r.size), r.value;
  }
}
class ls {
  constructor() {
    N(this, "_frameSnapshots", new Map());
    N(this, "_cache", new cs(1e8));
    N(this, "_contextToResources", new Map());
  }
  addResource(t, e) {
    (e.request.url = it(e.request.url)), this._ensureResourcesForContext(t).push(e);
  }
  addFrameSnapshot(t, e, r) {
    for (const o of e.resourceOverrides) o.url = it(o.url);
    let s = this._frameSnapshots.get(e.frameId);
    s ||
      ((s = { raw: [], renderers: [] }),
      this._frameSnapshots.set(e.frameId, s),
      e.isMainFrame && this._frameSnapshots.set(e.pageId, s)),
      s.raw.push(e);
    const i = this._ensureResourcesForContext(t),
      a = new zr(this._cache, i, s.raw, r, s.raw.length - 1);
    return s.renderers.push(a), a;
  }
  snapshotByName(t, e) {
    const r = this._frameSnapshots.get(t);
    return r == null ? void 0 : r.renderers.find((s) => s.snapshotName === e);
  }
  snapshotsForTest() {
    return [...this._frameSnapshots.keys()];
  }
  finalize() {
    for (const t of this._contextToResources.values())
      t.sort((e, r) => (e._monotonicTime || 0) - (r._monotonicTime || 0));
  }
  _ensureResourcesForContext(t) {
    let e = this._contextToResources.get(t);
    return e || ((e = []), this._contextToResources.set(t, e)), e;
  }
}
class Un extends Error {
  constructor(t) {
    super(t), (this.name = "TraceVersionError");
  }
}
const Ut = 7;
class fs {
  constructor(t, e) {
    N(this, "_contextEntry");
    N(this, "_snapshotStorage");
    N(this, "_actionMap", new Map());
    N(this, "_version");
    N(this, "_pageEntries", new Map());
    N(this, "_jsHandles", new Map());
    N(this, "_consoleObjects", new Map());
    (this._contextEntry = t), (this._snapshotStorage = e);
  }
  appendTrace(t) {
    for (const e of t.split(`
`))
      this._appendEvent(e);
  }
  actions() {
    return [...this._actionMap.values()];
  }
  _pageEntry(t) {
    let e = this._pageEntries.get(t);
    return (
      e || ((e = { pageId: t, screencastFrames: [] }), this._pageEntries.set(t, e), this._contextEntry.pages.push(e)), e
    );
  }
  _appendEvent(t) {
    if (!t) return;
    const e = this._modernize(JSON.parse(t));
    for (const r of e) this._innerAppendEvent(r);
  }
  _innerAppendEvent(t) {
    const e = this._contextEntry;
    switch (t.type) {
      case "context-options": {
        if (t.version > Ut)
          throw new Un(
            "The trace was created by a newer version of Playwright and is not supported by this version of the viewer. Please use latest Playwright to open the trace."
          );
        (this._version = t.version),
          (e.origin = t.origin),
          (e.browserName = t.browserName),
          (e.channel = t.channel),
          (e.title = t.title),
          (e.platform = t.platform),
          (e.wallTime = t.wallTime),
          (e.startTime = t.monotonicTime),
          (e.sdkLanguage = t.sdkLanguage),
          (e.options = t.options),
          (e.testIdAttributeName = t.testIdAttributeName),
          (e.contextId = t.contextId ?? "");
        break;
      }
      case "screencast-frame": {
        this._pageEntry(t.pageId).screencastFrames.push(t);
        break;
      }
      case "before": {
        this._actionMap.set(t.callId, { ...t, type: "action", endTime: 0, log: [] });
        break;
      }
      case "input": {
        const r = this._actionMap.get(t.callId);
        (r.inputSnapshot = t.inputSnapshot), (r.point = t.point);
        break;
      }
      case "log": {
        const r = this._actionMap.get(t.callId);
        if (!r) return;
        r.log.push({ time: t.time, message: t.message });
        break;
      }
      case "after": {
        const r = this._actionMap.get(t.callId);
        (r.afterSnapshot = t.afterSnapshot),
          (r.endTime = t.endTime),
          (r.result = t.result),
          (r.error = t.error),
          (r.attachments = t.attachments),
          (r.annotations = t.annotations),
          t.point && (r.point = t.point);
        break;
      }
      case "action": {
        this._actionMap.set(t.callId, { ...t, log: [] });
        break;
      }
      case "event": {
        e.events.push(t);
        break;
      }
      case "stdout": {
        e.stdio.push(t);
        break;
      }
      case "stderr": {
        e.stdio.push(t);
        break;
      }
      case "error": {
        e.errors.push(t);
        break;
      }
      case "console": {
        e.events.push(t);
        break;
      }
      case "resource-snapshot":
        this._snapshotStorage.addResource(this._contextEntry.contextId, t.snapshot), e.resources.push(t.snapshot);
        break;
      case "frame-snapshot":
        this._snapshotStorage.addFrameSnapshot(
          this._contextEntry.contextId,
          t.snapshot,
          this._pageEntry(t.snapshot.pageId).screencastFrames
        );
        break;
    }
    "pageId" in t && t.pageId && this._pageEntry(t.pageId),
      (t.type === "action" || t.type === "before") && (e.startTime = Math.min(e.startTime, t.startTime)),
      (t.type === "action" || t.type === "after") && (e.endTime = Math.max(e.endTime, t.endTime)),
      t.type === "event" && ((e.startTime = Math.min(e.startTime, t.time)), (e.endTime = Math.max(e.endTime, t.time))),
      t.type === "screencast-frame" &&
        ((e.startTime = Math.min(e.startTime, t.timestamp)), (e.endTime = Math.max(e.endTime, t.timestamp)));
  }
  _processedContextCreatedEvent() {
    return this._version !== void 0;
  }
  _modernize(t) {
    let e = this._version || t.version;
    if (e === void 0) return [t];
    let r = [t];
    for (; e < Ut; ++e) r = this[`_modernize_${e}_to_${e + 1}`].call(this, r);
    return r;
  }
  _modernize_0_to_1(t) {
    for (const e of t)
      e.type === "action" &&
        typeof e.metadata.error == "string" &&
        (e.metadata.error = { error: { name: "Error", message: e.metadata.error } });
    return t;
  }
  _modernize_1_to_2(t) {
    var e;
    for (const r of t)
      r.type !== "frame-snapshot" ||
        !r.snapshot.isMainFrame ||
        (r.snapshot.viewport = ((e = this._contextEntry.options) == null ? void 0 : e.viewport) || {
          width: 1280,
          height: 720
        });
    return t;
  }
  _modernize_2_to_3(t) {
    for (const e of t) {
      if (e.type !== "resource-snapshot" || e.snapshot.request) continue;
      const r = e.snapshot;
      e.snapshot = {
        _frameref: r.frameId,
        request: {
          url: r.url,
          method: r.method,
          headers: r.requestHeaders,
          postData: r.requestSha1 ? { _sha1: r.requestSha1 } : void 0
        },
        response: {
          status: r.status,
          headers: r.responseHeaders,
          content: { mimeType: r.contentType, _sha1: r.responseSha1 }
        },
        _monotonicTime: r.timestamp
      };
    }
    return t;
  }
  _modernize_3_to_4(t) {
    const e = [];
    for (const r of t) {
      const s = this._modernize_event_3_to_4(r);
      s && e.push(s);
    }
    return e;
  }
  _modernize_event_3_to_4(t) {
    var r, s, i, a;
    if (t.type !== "action" && t.type !== "event") return t;
    const e = t.metadata;
    return e.internal || e.method.startsWith("tracing")
      ? null
      : t.type === "event"
        ? e.method === "__create__" && e.type === "ConsoleMessage"
          ? { type: "object", class: e.type, guid: e.params.guid, initializer: e.params.initializer }
          : { type: "event", time: e.startTime, class: e.type, method: e.method, params: e.params, pageId: e.pageId }
        : {
            type: "action",
            callId: e.id,
            startTime: e.startTime,
            endTime: e.endTime,
            apiName: e.apiName || e.type + "." + e.method,
            class: e.type,
            method: e.method,
            params: e.params,
            wallTime: e.wallTime || Date.now(),
            log: e.log,
            beforeSnapshot: (r = e.snapshots.find((o) => o.title === "before")) == null ? void 0 : r.snapshotName,
            inputSnapshot: (s = e.snapshots.find((o) => o.title === "input")) == null ? void 0 : s.snapshotName,
            afterSnapshot: (i = e.snapshots.find((o) => o.title === "after")) == null ? void 0 : i.snapshotName,
            error: (a = e.error) == null ? void 0 : a.error,
            result: e.result,
            point: e.point,
            pageId: e.pageId
          };
  }
  _modernize_4_to_5(t) {
    const e = [];
    for (const r of t) {
      const s = this._modernize_event_4_to_5(r);
      s && e.push(s);
    }
    return e;
  }
  _modernize_event_4_to_5(t) {
    var e, r;
    if (
      (t.type === "event" &&
        t.method === "__create__" &&
        t.class === "JSHandle" &&
        this._jsHandles.set(t.params.guid, t.params.initializer),
      t.type === "object")
    ) {
      if (t.class !== "ConsoleMessage") return null;
      const s =
        (e = t.initializer.args) == null
          ? void 0
          : e.map((i) => {
              if (i.guid) {
                const a = this._jsHandles.get(i.guid);
                return { preview: (a == null ? void 0 : a.preview) || "", value: "" };
              }
              return { preview: i.preview || "", value: i.value || "" };
            });
      return (
        this._consoleObjects.set(t.guid, {
          type: t.initializer.type,
          text: t.initializer.text,
          location: t.initializer.location,
          args: s
        }),
        null
      );
    }
    if (t.type === "event" && t.method === "console") {
      const s = this._consoleObjects.get(((r = t.params.message) == null ? void 0 : r.guid) || "");
      return s
        ? {
            type: "console",
            time: t.time,
            pageId: t.pageId,
            messageType: s.type,
            text: s.text,
            args: s.args,
            location: s.location
          }
        : null;
    }
    return t;
  }
  _modernize_5_to_6(t) {
    const e = [];
    for (const r of t)
      if ((e.push(r), !(r.type !== "after" || !r.log.length)))
        for (const s of r.log) e.push({ type: "log", callId: r.callId, message: s, time: -1 });
    return e;
  }
  _modernize_6_to_7(t) {
    const e = [];
    if (!this._processedContextCreatedEvent() && t[0].type !== "context-options") {
      const r = {
        type: "context-options",
        origin: "testRunner",
        version: 7,
        browserName: "",
        options: {},
        platform: process.platform,
        wallTime: 0,
        monotonicTime: 0,
        sdkLanguage: "javascript",
        contextId: ""
      };
      e.push(r);
    }
    for (const r of t) {
      if (r.type === "context-options") {
        e.push({ ...r, monotonicTime: 0, origin: "library", contextId: "" });
        continue;
      }
      !this._contextEntry.wallTime && r.type === "before" && (this._contextEntry.wallTime = r.wallTime),
        !this._contextEntry.startTime && r.type === "before" && (this._contextEntry.startTime = r.startTime),
        e.push(r);
    }
    return e;
  }
}
class us {
  constructor() {
    N(this, "contextEntries", []);
    N(this, "_snapshotStorage");
    N(this, "_backend");
    N(this, "_resourceToContentType", new Map());
  }
  async load(t, e) {
    var o, l;
    this._backend = t;
    const r = [];
    let s = !1;
    for (const _ of await this._backend.entryNames()) {
      const f = _.match(/(.+)\.trace$/);
      f && r.push(f[1] || ""), _.includes("src@") && (s = !0);
    }
    if (!r.length) throw new Error("Cannot find .trace file");
    this._snapshotStorage = new ls();
    const i = r.length * 3;
    let a = 0;
    for (const _ of r) {
      const f = ds();
      (f.traceUrl = t.traceURL()), (f.hasSource = s);
      const b = new fs(f, this._snapshotStorage),
        h = (await this._backend.readText(_ + ".trace")) || "";
      b.appendTrace(h), e(++a, i);
      const S = (await this._backend.readText(_ + ".network")) || "";
      if (
        (b.appendTrace(S), e(++a, i), (f.actions = b.actions().sort((u, c) => u.startTime - c.startTime)), !t.isLive())
      ) {
        for (const u of f.actions.slice().reverse())
          if (!u.endTime && !u.error)
            for (const c of f.actions) c.parentId === u.callId && u.endTime < c.endTime && (u.endTime = c.endTime);
      }
      const C = await this._backend.readText(_ + ".stacks");
      if (C) {
        const u = os(JSON.parse(C));
        for (const c of f.actions) c.stack = c.stack || u.get(c.callId);
      }
      e(++a, i);
      for (const u of f.resources)
        (o = u.request.postData) != null &&
          o._sha1 &&
          this._resourceToContentType.set(u.request.postData._sha1, Wt(u.request.postData.mimeType)),
          (l = u.response.content) != null &&
            l._sha1 &&
            this._resourceToContentType.set(u.response.content._sha1, Wt(u.response.content.mimeType));
      this.contextEntries.push(f);
    }
    this._snapshotStorage.finalize();
  }
  async hasEntry(t) {
    return this._backend.hasEntry(t);
  }
  async resourceForSha1(t) {
    const e = await this._backend.readBlob("resources/" + t),
      r = this._resourceToContentType.get(t);
    return !e || r === void 0 || r === "x-unknown" ? e : new Blob([e], { type: r });
  }
  storage() {
    return this._snapshotStorage;
  }
}
function Wt(n) {
  const t = n.match(/^(.*);\s*charset=.*$/);
  return t ? t[1] : n;
}
function ds() {
  return {
    origin: "testRunner",
    traceUrl: "",
    startTime: Number.MAX_SAFE_INTEGER,
    wallTime: Number.MAX_SAFE_INTEGER,
    endTime: 0,
    browserName: "",
    options: { deviceScaleFactor: 1, isMobile: !1, viewport: { width: 1280, height: 800 } },
    pages: [],
    resources: [],
    actions: [],
    events: [],
    errors: [],
    stdio: [],
    hasSource: !1,
    contextId: ""
  };
}
const _s = 15,
  L = 0,
  te = 1,
  hs = 2,
  X = -2,
  H = -3,
  Ht = -4,
  ne = -5,
  $ = [0, 1, 3, 7, 15, 31, 63, 127, 255, 511, 1023, 2047, 4095, 8191, 16383, 32767, 65535],
  Wn = 1440,
  ps = 0,
  ms = 4,
  ws = 9,
  gs = 5,
  bs = [
    96, 7, 256, 0, 8, 80, 0, 8, 16, 84, 8, 115, 82, 7, 31, 0, 8, 112, 0, 8, 48, 0, 9, 192, 80, 7, 10, 0, 8, 96, 0, 8,
    32, 0, 9, 160, 0, 8, 0, 0, 8, 128, 0, 8, 64, 0, 9, 224, 80, 7, 6, 0, 8, 88, 0, 8, 24, 0, 9, 144, 83, 7, 59, 0, 8,
    120, 0, 8, 56, 0, 9, 208, 81, 7, 17, 0, 8, 104, 0, 8, 40, 0, 9, 176, 0, 8, 8, 0, 8, 136, 0, 8, 72, 0, 9, 240, 80, 7,
    4, 0, 8, 84, 0, 8, 20, 85, 8, 227, 83, 7, 43, 0, 8, 116, 0, 8, 52, 0, 9, 200, 81, 7, 13, 0, 8, 100, 0, 8, 36, 0, 9,
    168, 0, 8, 4, 0, 8, 132, 0, 8, 68, 0, 9, 232, 80, 7, 8, 0, 8, 92, 0, 8, 28, 0, 9, 152, 84, 7, 83, 0, 8, 124, 0, 8,
    60, 0, 9, 216, 82, 7, 23, 0, 8, 108, 0, 8, 44, 0, 9, 184, 0, 8, 12, 0, 8, 140, 0, 8, 76, 0, 9, 248, 80, 7, 3, 0, 8,
    82, 0, 8, 18, 85, 8, 163, 83, 7, 35, 0, 8, 114, 0, 8, 50, 0, 9, 196, 81, 7, 11, 0, 8, 98, 0, 8, 34, 0, 9, 164, 0, 8,
    2, 0, 8, 130, 0, 8, 66, 0, 9, 228, 80, 7, 7, 0, 8, 90, 0, 8, 26, 0, 9, 148, 84, 7, 67, 0, 8, 122, 0, 8, 58, 0, 9,
    212, 82, 7, 19, 0, 8, 106, 0, 8, 42, 0, 9, 180, 0, 8, 10, 0, 8, 138, 0, 8, 74, 0, 9, 244, 80, 7, 5, 0, 8, 86, 0, 8,
    22, 192, 8, 0, 83, 7, 51, 0, 8, 118, 0, 8, 54, 0, 9, 204, 81, 7, 15, 0, 8, 102, 0, 8, 38, 0, 9, 172, 0, 8, 6, 0, 8,
    134, 0, 8, 70, 0, 9, 236, 80, 7, 9, 0, 8, 94, 0, 8, 30, 0, 9, 156, 84, 7, 99, 0, 8, 126, 0, 8, 62, 0, 9, 220, 82, 7,
    27, 0, 8, 110, 0, 8, 46, 0, 9, 188, 0, 8, 14, 0, 8, 142, 0, 8, 78, 0, 9, 252, 96, 7, 256, 0, 8, 81, 0, 8, 17, 85, 8,
    131, 82, 7, 31, 0, 8, 113, 0, 8, 49, 0, 9, 194, 80, 7, 10, 0, 8, 97, 0, 8, 33, 0, 9, 162, 0, 8, 1, 0, 8, 129, 0, 8,
    65, 0, 9, 226, 80, 7, 6, 0, 8, 89, 0, 8, 25, 0, 9, 146, 83, 7, 59, 0, 8, 121, 0, 8, 57, 0, 9, 210, 81, 7, 17, 0, 8,
    105, 0, 8, 41, 0, 9, 178, 0, 8, 9, 0, 8, 137, 0, 8, 73, 0, 9, 242, 80, 7, 4, 0, 8, 85, 0, 8, 21, 80, 8, 258, 83, 7,
    43, 0, 8, 117, 0, 8, 53, 0, 9, 202, 81, 7, 13, 0, 8, 101, 0, 8, 37, 0, 9, 170, 0, 8, 5, 0, 8, 133, 0, 8, 69, 0, 9,
    234, 80, 7, 8, 0, 8, 93, 0, 8, 29, 0, 9, 154, 84, 7, 83, 0, 8, 125, 0, 8, 61, 0, 9, 218, 82, 7, 23, 0, 8, 109, 0, 8,
    45, 0, 9, 186, 0, 8, 13, 0, 8, 141, 0, 8, 77, 0, 9, 250, 80, 7, 3, 0, 8, 83, 0, 8, 19, 85, 8, 195, 83, 7, 35, 0, 8,
    115, 0, 8, 51, 0, 9, 198, 81, 7, 11, 0, 8, 99, 0, 8, 35, 0, 9, 166, 0, 8, 3, 0, 8, 131, 0, 8, 67, 0, 9, 230, 80, 7,
    7, 0, 8, 91, 0, 8, 27, 0, 9, 150, 84, 7, 67, 0, 8, 123, 0, 8, 59, 0, 9, 214, 82, 7, 19, 0, 8, 107, 0, 8, 43, 0, 9,
    182, 0, 8, 11, 0, 8, 139, 0, 8, 75, 0, 9, 246, 80, 7, 5, 0, 8, 87, 0, 8, 23, 192, 8, 0, 83, 7, 51, 0, 8, 119, 0, 8,
    55, 0, 9, 206, 81, 7, 15, 0, 8, 103, 0, 8, 39, 0, 9, 174, 0, 8, 7, 0, 8, 135, 0, 8, 71, 0, 9, 238, 80, 7, 9, 0, 8,
    95, 0, 8, 31, 0, 9, 158, 84, 7, 99, 0, 8, 127, 0, 8, 63, 0, 9, 222, 82, 7, 27, 0, 8, 111, 0, 8, 47, 0, 9, 190, 0, 8,
    15, 0, 8, 143, 0, 8, 79, 0, 9, 254, 96, 7, 256, 0, 8, 80, 0, 8, 16, 84, 8, 115, 82, 7, 31, 0, 8, 112, 0, 8, 48, 0,
    9, 193, 80, 7, 10, 0, 8, 96, 0, 8, 32, 0, 9, 161, 0, 8, 0, 0, 8, 128, 0, 8, 64, 0, 9, 225, 80, 7, 6, 0, 8, 88, 0, 8,
    24, 0, 9, 145, 83, 7, 59, 0, 8, 120, 0, 8, 56, 0, 9, 209, 81, 7, 17, 0, 8, 104, 0, 8, 40, 0, 9, 177, 0, 8, 8, 0, 8,
    136, 0, 8, 72, 0, 9, 241, 80, 7, 4, 0, 8, 84, 0, 8, 20, 85, 8, 227, 83, 7, 43, 0, 8, 116, 0, 8, 52, 0, 9, 201, 81,
    7, 13, 0, 8, 100, 0, 8, 36, 0, 9, 169, 0, 8, 4, 0, 8, 132, 0, 8, 68, 0, 9, 233, 80, 7, 8, 0, 8, 92, 0, 8, 28, 0, 9,
    153, 84, 7, 83, 0, 8, 124, 0, 8, 60, 0, 9, 217, 82, 7, 23, 0, 8, 108, 0, 8, 44, 0, 9, 185, 0, 8, 12, 0, 8, 140, 0,
    8, 76, 0, 9, 249, 80, 7, 3, 0, 8, 82, 0, 8, 18, 85, 8, 163, 83, 7, 35, 0, 8, 114, 0, 8, 50, 0, 9, 197, 81, 7, 11, 0,
    8, 98, 0, 8, 34, 0, 9, 165, 0, 8, 2, 0, 8, 130, 0, 8, 66, 0, 9, 229, 80, 7, 7, 0, 8, 90, 0, 8, 26, 0, 9, 149, 84, 7,
    67, 0, 8, 122, 0, 8, 58, 0, 9, 213, 82, 7, 19, 0, 8, 106, 0, 8, 42, 0, 9, 181, 0, 8, 10, 0, 8, 138, 0, 8, 74, 0, 9,
    245, 80, 7, 5, 0, 8, 86, 0, 8, 22, 192, 8, 0, 83, 7, 51, 0, 8, 118, 0, 8, 54, 0, 9, 205, 81, 7, 15, 0, 8, 102, 0, 8,
    38, 0, 9, 173, 0, 8, 6, 0, 8, 134, 0, 8, 70, 0, 9, 237, 80, 7, 9, 0, 8, 94, 0, 8, 30, 0, 9, 157, 84, 7, 99, 0, 8,
    126, 0, 8, 62, 0, 9, 221, 82, 7, 27, 0, 8, 110, 0, 8, 46, 0, 9, 189, 0, 8, 14, 0, 8, 142, 0, 8, 78, 0, 9, 253, 96,
    7, 256, 0, 8, 81, 0, 8, 17, 85, 8, 131, 82, 7, 31, 0, 8, 113, 0, 8, 49, 0, 9, 195, 80, 7, 10, 0, 8, 97, 0, 8, 33, 0,
    9, 163, 0, 8, 1, 0, 8, 129, 0, 8, 65, 0, 9, 227, 80, 7, 6, 0, 8, 89, 0, 8, 25, 0, 9, 147, 83, 7, 59, 0, 8, 121, 0,
    8, 57, 0, 9, 211, 81, 7, 17, 0, 8, 105, 0, 8, 41, 0, 9, 179, 0, 8, 9, 0, 8, 137, 0, 8, 73, 0, 9, 243, 80, 7, 4, 0,
    8, 85, 0, 8, 21, 80, 8, 258, 83, 7, 43, 0, 8, 117, 0, 8, 53, 0, 9, 203, 81, 7, 13, 0, 8, 101, 0, 8, 37, 0, 9, 171,
    0, 8, 5, 0, 8, 133, 0, 8, 69, 0, 9, 235, 80, 7, 8, 0, 8, 93, 0, 8, 29, 0, 9, 155, 84, 7, 83, 0, 8, 125, 0, 8, 61, 0,
    9, 219, 82, 7, 23, 0, 8, 109, 0, 8, 45, 0, 9, 187, 0, 8, 13, 0, 8, 141, 0, 8, 77, 0, 9, 251, 80, 7, 3, 0, 8, 83, 0,
    8, 19, 85, 8, 195, 83, 7, 35, 0, 8, 115, 0, 8, 51, 0, 9, 199, 81, 7, 11, 0, 8, 99, 0, 8, 35, 0, 9, 167, 0, 8, 3, 0,
    8, 131, 0, 8, 67, 0, 9, 231, 80, 7, 7, 0, 8, 91, 0, 8, 27, 0, 9, 151, 84, 7, 67, 0, 8, 123, 0, 8, 59, 0, 9, 215, 82,
    7, 19, 0, 8, 107, 0, 8, 43, 0, 9, 183, 0, 8, 11, 0, 8, 139, 0, 8, 75, 0, 9, 247, 80, 7, 5, 0, 8, 87, 0, 8, 23, 192,
    8, 0, 83, 7, 51, 0, 8, 119, 0, 8, 55, 0, 9, 207, 81, 7, 15, 0, 8, 103, 0, 8, 39, 0, 9, 175, 0, 8, 7, 0, 8, 135, 0,
    8, 71, 0, 9, 239, 80, 7, 9, 0, 8, 95, 0, 8, 31, 0, 9, 159, 84, 7, 99, 0, 8, 127, 0, 8, 63, 0, 9, 223, 82, 7, 27, 0,
    8, 111, 0, 8, 47, 0, 9, 191, 0, 8, 15, 0, 8, 143, 0, 8, 79, 0, 9, 255
  ],
  ys = [
    80, 5, 1, 87, 5, 257, 83, 5, 17, 91, 5, 4097, 81, 5, 5, 89, 5, 1025, 85, 5, 65, 93, 5, 16385, 80, 5, 3, 88, 5, 513,
    84, 5, 33, 92, 5, 8193, 82, 5, 9, 90, 5, 2049, 86, 5, 129, 192, 5, 24577, 80, 5, 2, 87, 5, 385, 83, 5, 25, 91, 5,
    6145, 81, 5, 7, 89, 5, 1537, 85, 5, 97, 93, 5, 24577, 80, 5, 4, 88, 5, 769, 84, 5, 49, 92, 5, 12289, 82, 5, 13, 90,
    5, 3073, 86, 5, 193, 192, 5, 24577
  ],
  xs = [
    3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31, 35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258,
    0, 0
  ],
  Es = [0, 0, 0, 0, 0, 0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 4, 5, 5, 5, 5, 0, 112, 112],
  Ts = [
    1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193, 257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
    8193, 12289, 16385, 24577
  ],
  Ss = [0, 0, 0, 0, 1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8, 9, 9, 10, 10, 11, 11, 12, 12, 13, 13],
  re = 15;
function ot() {
  const n = this;
  let t, e, r, s, i, a;
  function o(_, f, b, h, S, C, u, c, d, y, g) {
    let m, E, p, R, T, A, x, w, O, I, v, k, D, U, F;
    (I = 0), (T = b);
    do r[_[f + I]]++, I++, T--;
    while (T !== 0);
    if (r[0] == b) return (u[0] = -1), (c[0] = 0), L;
    for (w = c[0], A = 1; A <= re && r[A] === 0; A++);
    for (x = A, w < A && (w = A), T = re; T !== 0 && r[T] === 0; T--);
    for (p = T, w > T && (w = T), c[0] = w, U = 1 << A; A < T; A++, U <<= 1) if ((U -= r[A]) < 0) return H;
    if ((U -= r[T]) < 0) return H;
    for (r[T] += U, a[1] = A = 0, I = 1, D = 2; --T !== 0; ) (a[D] = A += r[I]), D++, I++;
    (T = 0), (I = 0);
    do (A = _[f + I]) !== 0 && (g[a[A]++] = T), I++;
    while (++T < b);
    for (b = a[p], a[0] = T = 0, I = 0, R = -1, k = -w, i[0] = 0, v = 0, F = 0; x <= p; x++)
      for (m = r[x]; m-- !== 0; ) {
        for (; x > k + w; ) {
          if (
            (R++,
            (k += w),
            (F = p - k),
            (F = F > w ? w : F),
            (E = 1 << (A = x - k)) > m + 1 && ((E -= m + 1), (D = x), A < F))
          )
            for (; ++A < F && !((E <<= 1) <= r[++D]); ) E -= r[D];
          if (((F = 1 << A), y[0] + F > Wn)) return H;
          (i[R] = v = y[0]),
            (y[0] += F),
            R !== 0
              ? ((a[R] = T),
                (s[0] = A),
                (s[1] = w),
                (A = T >>> (k - w)),
                (s[2] = v - i[R - 1] - A),
                d.set(s, (i[R - 1] + A) * 3))
              : (u[0] = v);
        }
        for (
          s[1] = x - k,
            I >= b
              ? (s[0] = 192)
              : g[I] < h
                ? ((s[0] = g[I] < 256 ? 0 : 96), (s[2] = g[I++]))
                : ((s[0] = C[g[I] - h] + 16 + 64), (s[2] = S[g[I++] - h])),
            E = 1 << (x - k),
            A = T >>> k;
          A < F;
          A += E
        )
          d.set(s, (v + A) * 3);
        for (A = 1 << (x - 1); (T & A) !== 0; A >>>= 1) T ^= A;
        for (T ^= A, O = (1 << k) - 1; (T & O) != a[R]; ) R--, (k -= w), (O = (1 << k) - 1);
      }
    return U !== 0 && p != 1 ? ne : L;
  }
  function l(_) {
    let f;
    for (
      t ||
        ((t = []),
        (e = []),
        (r = new Int32Array(re + 1)),
        (s = []),
        (i = new Int32Array(re)),
        (a = new Int32Array(re + 1))),
        e.length < _ && (e = []),
        f = 0;
      f < _;
      f++
    )
      e[f] = 0;
    for (f = 0; f < re + 1; f++) r[f] = 0;
    for (f = 0; f < 3; f++) s[f] = 0;
    i.set(r.subarray(0, re), 0), a.set(r.subarray(0, re + 1), 0);
  }
  (n.inflate_trees_bits = function (_, f, b, h, S) {
    let C;
    return (
      l(19),
      (t[0] = 0),
      (C = o(_, 0, 19, 19, null, null, b, f, h, t, e)),
      C == H
        ? (S.msg = "oversubscribed dynamic bit lengths tree")
        : (C == ne || f[0] === 0) && ((S.msg = "incomplete dynamic bit lengths tree"), (C = H)),
      C
    );
  }),
    (n.inflate_trees_dynamic = function (_, f, b, h, S, C, u, c, d) {
      let y;
      return (
        l(288),
        (t[0] = 0),
        (y = o(b, 0, _, 257, xs, Es, C, h, c, t, e)),
        y != L || h[0] === 0
          ? (y == H
              ? (d.msg = "oversubscribed literal/length tree")
              : y != Ht && ((d.msg = "incomplete literal/length tree"), (y = H)),
            y)
          : (l(288),
            (y = o(b, _, f, 0, Ts, Ss, u, S, c, t, e)),
            y != L || (S[0] === 0 && _ > 257)
              ? (y == H
                  ? (d.msg = "oversubscribed distance tree")
                  : y == ne
                    ? ((d.msg = "incomplete distance tree"), (y = H))
                    : y != Ht && ((d.msg = "empty distance tree with lengths"), (y = H)),
                y)
              : L)
      );
    });
}
ot.inflate_trees_fixed = function (n, t, e, r) {
  return (n[0] = ws), (t[0] = gs), (e[0] = bs), (r[0] = ys), L;
};
const Fe = 0,
  Bt = 1,
  jt = 2,
  qt = 3,
  Yt = 4,
  Gt = 5,
  Vt = 6,
  $e = 7,
  Zt = 8,
  Ne = 9;
function Rs() {
  const n = this;
  let t,
    e = 0,
    r,
    s = 0,
    i = 0,
    a = 0,
    o = 0,
    l = 0,
    _ = 0,
    f = 0,
    b,
    h = 0,
    S,
    C = 0;
  function u(c, d, y, g, m, E, p, R) {
    let T, A, x, w, O, I, v, k, D, U, F, Y, P, he, M, W;
    (v = R.next_in_index),
      (k = R.avail_in),
      (O = p.bitb),
      (I = p.bitk),
      (D = p.write),
      (U = D < p.read ? p.read - D - 1 : p.end - D),
      (F = $[c]),
      (Y = $[d]);
    do {
      for (; I < 20; ) k--, (O |= (R.read_byte(v++) & 255) << I), (I += 8);
      if (((T = O & F), (A = y), (x = g), (W = (x + T) * 3), (w = A[W]) === 0)) {
        (O >>= A[W + 1]), (I -= A[W + 1]), (p.win[D++] = A[W + 2]), U--;
        continue;
      }
      do {
        if (((O >>= A[W + 1]), (I -= A[W + 1]), (w & 16) !== 0)) {
          for (w &= 15, P = A[W + 2] + (O & $[w]), O >>= w, I -= w; I < 15; )
            k--, (O |= (R.read_byte(v++) & 255) << I), (I += 8);
          (T = O & Y), (A = m), (x = E), (W = (x + T) * 3), (w = A[W]);
          do
            if (((O >>= A[W + 1]), (I -= A[W + 1]), (w & 16) !== 0)) {
              for (w &= 15; I < w; ) k--, (O |= (R.read_byte(v++) & 255) << I), (I += 8);
              if (((he = A[W + 2] + (O & $[w])), (O >>= w), (I -= w), (U -= P), D >= he))
                (M = D - he),
                  D - M > 0 && 2 > D - M
                    ? ((p.win[D++] = p.win[M++]), (p.win[D++] = p.win[M++]), (P -= 2))
                    : (p.win.set(p.win.subarray(M, M + 2), D), (D += 2), (M += 2), (P -= 2));
              else {
                M = D - he;
                do M += p.end;
                while (M < 0);
                if (((w = p.end - M), P > w)) {
                  if (((P -= w), D - M > 0 && w > D - M))
                    do p.win[D++] = p.win[M++];
                    while (--w !== 0);
                  else p.win.set(p.win.subarray(M, M + w), D), (D += w), (M += w), (w = 0);
                  M = 0;
                }
              }
              if (D - M > 0 && P > D - M)
                do p.win[D++] = p.win[M++];
                while (--P !== 0);
              else p.win.set(p.win.subarray(M, M + P), D), (D += P), (M += P), (P = 0);
              break;
            } else if ((w & 64) === 0) (T += A[W + 2]), (T += O & $[w]), (W = (x + T) * 3), (w = A[W]);
            else
              return (
                (R.msg = "invalid distance code"),
                (P = R.avail_in - k),
                (P = I >> 3 < P ? I >> 3 : P),
                (k += P),
                (v -= P),
                (I -= P << 3),
                (p.bitb = O),
                (p.bitk = I),
                (R.avail_in = k),
                (R.total_in += v - R.next_in_index),
                (R.next_in_index = v),
                (p.write = D),
                H
              );
          while (!0);
          break;
        }
        if ((w & 64) === 0) {
          if (((T += A[W + 2]), (T += O & $[w]), (W = (x + T) * 3), (w = A[W]) === 0)) {
            (O >>= A[W + 1]), (I -= A[W + 1]), (p.win[D++] = A[W + 2]), U--;
            break;
          }
        } else
          return (w & 32) !== 0
            ? ((P = R.avail_in - k),
              (P = I >> 3 < P ? I >> 3 : P),
              (k += P),
              (v -= P),
              (I -= P << 3),
              (p.bitb = O),
              (p.bitk = I),
              (R.avail_in = k),
              (R.total_in += v - R.next_in_index),
              (R.next_in_index = v),
              (p.write = D),
              te)
            : ((R.msg = "invalid literal/length code"),
              (P = R.avail_in - k),
              (P = I >> 3 < P ? I >> 3 : P),
              (k += P),
              (v -= P),
              (I -= P << 3),
              (p.bitb = O),
              (p.bitk = I),
              (R.avail_in = k),
              (R.total_in += v - R.next_in_index),
              (R.next_in_index = v),
              (p.write = D),
              H);
      } while (!0);
    } while (U >= 258 && k >= 10);
    return (
      (P = R.avail_in - k),
      (P = I >> 3 < P ? I >> 3 : P),
      (k += P),
      (v -= P),
      (I -= P << 3),
      (p.bitb = O),
      (p.bitk = I),
      (R.avail_in = k),
      (R.total_in += v - R.next_in_index),
      (R.next_in_index = v),
      (p.write = D),
      L
    );
  }
  (n.init = function (c, d, y, g, m, E) {
    (t = Fe), (_ = c), (f = d), (b = y), (h = g), (S = m), (C = E), (r = null);
  }),
    (n.proc = function (c, d, y) {
      let g,
        m,
        E,
        p = 0,
        R = 0,
        T = 0,
        A,
        x,
        w,
        O;
      for (
        T = d.next_in_index,
          A = d.avail_in,
          p = c.bitb,
          R = c.bitk,
          x = c.write,
          w = x < c.read ? c.read - x - 1 : c.end - x;
        ;

      )
        switch (t) {
          case Fe:
            if (
              w >= 258 &&
              A >= 10 &&
              ((c.bitb = p),
              (c.bitk = R),
              (d.avail_in = A),
              (d.total_in += T - d.next_in_index),
              (d.next_in_index = T),
              (c.write = x),
              (y = u(_, f, b, h, S, C, c, d)),
              (T = d.next_in_index),
              (A = d.avail_in),
              (p = c.bitb),
              (R = c.bitk),
              (x = c.write),
              (w = x < c.read ? c.read - x - 1 : c.end - x),
              y != L)
            ) {
              t = y == te ? $e : Ne;
              break;
            }
            (i = _), (r = b), (s = h), (t = Bt);
          case Bt:
            for (g = i; R < g; ) {
              if (A !== 0) y = L;
              else
                return (
                  (c.bitb = p),
                  (c.bitk = R),
                  (d.avail_in = A),
                  (d.total_in += T - d.next_in_index),
                  (d.next_in_index = T),
                  (c.write = x),
                  c.inflate_flush(d, y)
                );
              A--, (p |= (d.read_byte(T++) & 255) << R), (R += 8);
            }
            if (((m = (s + (p & $[g])) * 3), (p >>>= r[m + 1]), (R -= r[m + 1]), (E = r[m]), E === 0)) {
              (a = r[m + 2]), (t = Vt);
              break;
            }
            if ((E & 16) !== 0) {
              (o = E & 15), (e = r[m + 2]), (t = jt);
              break;
            }
            if ((E & 64) === 0) {
              (i = E), (s = m / 3 + r[m + 2]);
              break;
            }
            if ((E & 32) !== 0) {
              t = $e;
              break;
            }
            return (
              (t = Ne),
              (d.msg = "invalid literal/length code"),
              (y = H),
              (c.bitb = p),
              (c.bitk = R),
              (d.avail_in = A),
              (d.total_in += T - d.next_in_index),
              (d.next_in_index = T),
              (c.write = x),
              c.inflate_flush(d, y)
            );
          case jt:
            for (g = o; R < g; ) {
              if (A !== 0) y = L;
              else
                return (
                  (c.bitb = p),
                  (c.bitk = R),
                  (d.avail_in = A),
                  (d.total_in += T - d.next_in_index),
                  (d.next_in_index = T),
                  (c.write = x),
                  c.inflate_flush(d, y)
                );
              A--, (p |= (d.read_byte(T++) & 255) << R), (R += 8);
            }
            (e += p & $[g]), (p >>= g), (R -= g), (i = f), (r = S), (s = C), (t = qt);
          case qt:
            for (g = i; R < g; ) {
              if (A !== 0) y = L;
              else
                return (
                  (c.bitb = p),
                  (c.bitk = R),
                  (d.avail_in = A),
                  (d.total_in += T - d.next_in_index),
                  (d.next_in_index = T),
                  (c.write = x),
                  c.inflate_flush(d, y)
                );
              A--, (p |= (d.read_byte(T++) & 255) << R), (R += 8);
            }
            if (((m = (s + (p & $[g])) * 3), (p >>= r[m + 1]), (R -= r[m + 1]), (E = r[m]), (E & 16) !== 0)) {
              (o = E & 15), (l = r[m + 2]), (t = Yt);
              break;
            }
            if ((E & 64) === 0) {
              (i = E), (s = m / 3 + r[m + 2]);
              break;
            }
            return (
              (t = Ne),
              (d.msg = "invalid distance code"),
              (y = H),
              (c.bitb = p),
              (c.bitk = R),
              (d.avail_in = A),
              (d.total_in += T - d.next_in_index),
              (d.next_in_index = T),
              (c.write = x),
              c.inflate_flush(d, y)
            );
          case Yt:
            for (g = o; R < g; ) {
              if (A !== 0) y = L;
              else
                return (
                  (c.bitb = p),
                  (c.bitk = R),
                  (d.avail_in = A),
                  (d.total_in += T - d.next_in_index),
                  (d.next_in_index = T),
                  (c.write = x),
                  c.inflate_flush(d, y)
                );
              A--, (p |= (d.read_byte(T++) & 255) << R), (R += 8);
            }
            (l += p & $[g]), (p >>= g), (R -= g), (t = Gt);
          case Gt:
            for (O = x - l; O < 0; ) O += c.end;
            for (; e !== 0; ) {
              if (
                w === 0 &&
                (x == c.end && c.read !== 0 && ((x = 0), (w = x < c.read ? c.read - x - 1 : c.end - x)),
                w === 0 &&
                  ((c.write = x),
                  (y = c.inflate_flush(d, y)),
                  (x = c.write),
                  (w = x < c.read ? c.read - x - 1 : c.end - x),
                  x == c.end && c.read !== 0 && ((x = 0), (w = x < c.read ? c.read - x - 1 : c.end - x)),
                  w === 0))
              )
                return (
                  (c.bitb = p),
                  (c.bitk = R),
                  (d.avail_in = A),
                  (d.total_in += T - d.next_in_index),
                  (d.next_in_index = T),
                  (c.write = x),
                  c.inflate_flush(d, y)
                );
              (c.win[x++] = c.win[O++]), w--, O == c.end && (O = 0), e--;
            }
            t = Fe;
            break;
          case Vt:
            if (
              w === 0 &&
              (x == c.end && c.read !== 0 && ((x = 0), (w = x < c.read ? c.read - x - 1 : c.end - x)),
              w === 0 &&
                ((c.write = x),
                (y = c.inflate_flush(d, y)),
                (x = c.write),
                (w = x < c.read ? c.read - x - 1 : c.end - x),
                x == c.end && c.read !== 0 && ((x = 0), (w = x < c.read ? c.read - x - 1 : c.end - x)),
                w === 0))
            )
              return (
                (c.bitb = p),
                (c.bitk = R),
                (d.avail_in = A),
                (d.total_in += T - d.next_in_index),
                (d.next_in_index = T),
                (c.write = x),
                c.inflate_flush(d, y)
              );
            (y = L), (c.win[x++] = a), w--, (t = Fe);
            break;
          case $e:
            if (
              (R > 7 && ((R -= 8), A++, T--),
              (c.write = x),
              (y = c.inflate_flush(d, y)),
              (x = c.write),
              (w = x < c.read ? c.read - x - 1 : c.end - x),
              c.read != c.write)
            )
              return (
                (c.bitb = p),
                (c.bitk = R),
                (d.avail_in = A),
                (d.total_in += T - d.next_in_index),
                (d.next_in_index = T),
                (c.write = x),
                c.inflate_flush(d, y)
              );
            t = Zt;
          case Zt:
            return (
              (y = te),
              (c.bitb = p),
              (c.bitk = R),
              (d.avail_in = A),
              (d.total_in += T - d.next_in_index),
              (d.next_in_index = T),
              (c.write = x),
              c.inflate_flush(d, y)
            );
          case Ne:
            return (
              (y = H),
              (c.bitb = p),
              (c.bitk = R),
              (d.avail_in = A),
              (d.total_in += T - d.next_in_index),
              (d.next_in_index = T),
              (c.write = x),
              c.inflate_flush(d, y)
            );
          default:
            return (
              (y = X),
              (c.bitb = p),
              (c.bitk = R),
              (d.avail_in = A),
              (d.total_in += T - d.next_in_index),
              (d.next_in_index = T),
              (c.write = x),
              c.inflate_flush(d, y)
            );
        }
    }),
    (n.free = function () {});
}
const Kt = [16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15],
  ge = 0,
  Je = 1,
  Xt = 2,
  $t = 3,
  Jt = 4,
  Qt = 5,
  Le = 6,
  Me = 7,
  zt = 8,
  pe = 9;
function As(n, t) {
  const e = this;
  let r = ge,
    s = 0,
    i = 0,
    a = 0,
    o;
  const l = [0],
    _ = [0],
    f = new Rs();
  let b = 0,
    h = new Int32Array(Wn * 3);
  const S = 0,
    C = new ot();
  (e.bitk = 0),
    (e.bitb = 0),
    (e.win = new Uint8Array(t)),
    (e.end = t),
    (e.read = 0),
    (e.write = 0),
    (e.reset = function (u, c) {
      c && (c[0] = S), r == Le && f.free(u), (r = ge), (e.bitk = 0), (e.bitb = 0), (e.read = e.write = 0);
    }),
    e.reset(n, null),
    (e.inflate_flush = function (u, c) {
      let d, y, g;
      return (
        (y = u.next_out_index),
        (g = e.read),
        (d = (g <= e.write ? e.write : e.end) - g),
        d > u.avail_out && (d = u.avail_out),
        d !== 0 && c == ne && (c = L),
        (u.avail_out -= d),
        (u.total_out += d),
        u.next_out.set(e.win.subarray(g, g + d), y),
        (y += d),
        (g += d),
        g == e.end &&
          ((g = 0),
          e.write == e.end && (e.write = 0),
          (d = e.write - g),
          d > u.avail_out && (d = u.avail_out),
          d !== 0 && c == ne && (c = L),
          (u.avail_out -= d),
          (u.total_out += d),
          u.next_out.set(e.win.subarray(g, g + d), y),
          (y += d),
          (g += d)),
        (u.next_out_index = y),
        (e.read = g),
        c
      );
    }),
    (e.proc = function (u, c) {
      let d, y, g, m, E, p, R, T;
      for (
        m = u.next_in_index,
          E = u.avail_in,
          y = e.bitb,
          g = e.bitk,
          p = e.write,
          R = p < e.read ? e.read - p - 1 : e.end - p;
        ;

      ) {
        let A, x, w, O, I, v, k, D;
        switch (r) {
          case ge:
            for (; g < 3; ) {
              if (E !== 0) c = L;
              else
                return (
                  (e.bitb = y),
                  (e.bitk = g),
                  (u.avail_in = E),
                  (u.total_in += m - u.next_in_index),
                  (u.next_in_index = m),
                  (e.write = p),
                  e.inflate_flush(u, c)
                );
              E--, (y |= (u.read_byte(m++) & 255) << g), (g += 8);
            }
            switch (((d = y & 7), (b = d & 1), d >>> 1)) {
              case 0:
                (y >>>= 3), (g -= 3), (d = g & 7), (y >>>= d), (g -= d), (r = Je);
                break;
              case 1:
                (A = []),
                  (x = []),
                  (w = [[]]),
                  (O = [[]]),
                  ot.inflate_trees_fixed(A, x, w, O),
                  f.init(A[0], x[0], w[0], 0, O[0], 0),
                  (y >>>= 3),
                  (g -= 3),
                  (r = Le);
                break;
              case 2:
                (y >>>= 3), (g -= 3), (r = $t);
                break;
              case 3:
                return (
                  (y >>>= 3),
                  (g -= 3),
                  (r = pe),
                  (u.msg = "invalid block type"),
                  (c = H),
                  (e.bitb = y),
                  (e.bitk = g),
                  (u.avail_in = E),
                  (u.total_in += m - u.next_in_index),
                  (u.next_in_index = m),
                  (e.write = p),
                  e.inflate_flush(u, c)
                );
            }
            break;
          case Je:
            for (; g < 32; ) {
              if (E !== 0) c = L;
              else
                return (
                  (e.bitb = y),
                  (e.bitk = g),
                  (u.avail_in = E),
                  (u.total_in += m - u.next_in_index),
                  (u.next_in_index = m),
                  (e.write = p),
                  e.inflate_flush(u, c)
                );
              E--, (y |= (u.read_byte(m++) & 255) << g), (g += 8);
            }
            if (((~y >>> 16) & 65535) != (y & 65535))
              return (
                (r = pe),
                (u.msg = "invalid stored block lengths"),
                (c = H),
                (e.bitb = y),
                (e.bitk = g),
                (u.avail_in = E),
                (u.total_in += m - u.next_in_index),
                (u.next_in_index = m),
                (e.write = p),
                e.inflate_flush(u, c)
              );
            (s = y & 65535), (y = g = 0), (r = s !== 0 ? Xt : b !== 0 ? Me : ge);
            break;
          case Xt:
            if (
              E === 0 ||
              (R === 0 &&
                (p == e.end && e.read !== 0 && ((p = 0), (R = p < e.read ? e.read - p - 1 : e.end - p)),
                R === 0 &&
                  ((e.write = p),
                  (c = e.inflate_flush(u, c)),
                  (p = e.write),
                  (R = p < e.read ? e.read - p - 1 : e.end - p),
                  p == e.end && e.read !== 0 && ((p = 0), (R = p < e.read ? e.read - p - 1 : e.end - p)),
                  R === 0)))
            )
              return (
                (e.bitb = y),
                (e.bitk = g),
                (u.avail_in = E),
                (u.total_in += m - u.next_in_index),
                (u.next_in_index = m),
                (e.write = p),
                e.inflate_flush(u, c)
              );
            if (
              ((c = L),
              (d = s),
              d > E && (d = E),
              d > R && (d = R),
              e.win.set(u.read_buf(m, d), p),
              (m += d),
              (E -= d),
              (p += d),
              (R -= d),
              (s -= d) !== 0)
            )
              break;
            r = b !== 0 ? Me : ge;
            break;
          case $t:
            for (; g < 14; ) {
              if (E !== 0) c = L;
              else
                return (
                  (e.bitb = y),
                  (e.bitk = g),
                  (u.avail_in = E),
                  (u.total_in += m - u.next_in_index),
                  (u.next_in_index = m),
                  (e.write = p),
                  e.inflate_flush(u, c)
                );
              E--, (y |= (u.read_byte(m++) & 255) << g), (g += 8);
            }
            if (((i = d = y & 16383), (d & 31) > 29 || ((d >> 5) & 31) > 29))
              return (
                (r = pe),
                (u.msg = "too many length or distance symbols"),
                (c = H),
                (e.bitb = y),
                (e.bitk = g),
                (u.avail_in = E),
                (u.total_in += m - u.next_in_index),
                (u.next_in_index = m),
                (e.write = p),
                e.inflate_flush(u, c)
              );
            if (((d = 258 + (d & 31) + ((d >> 5) & 31)), !o || o.length < d)) o = [];
            else for (T = 0; T < d; T++) o[T] = 0;
            (y >>>= 14), (g -= 14), (a = 0), (r = Jt);
          case Jt:
            for (; a < 4 + (i >>> 10); ) {
              for (; g < 3; ) {
                if (E !== 0) c = L;
                else
                  return (
                    (e.bitb = y),
                    (e.bitk = g),
                    (u.avail_in = E),
                    (u.total_in += m - u.next_in_index),
                    (u.next_in_index = m),
                    (e.write = p),
                    e.inflate_flush(u, c)
                  );
                E--, (y |= (u.read_byte(m++) & 255) << g), (g += 8);
              }
              (o[Kt[a++]] = y & 7), (y >>>= 3), (g -= 3);
            }
            for (; a < 19; ) o[Kt[a++]] = 0;
            if (((l[0] = 7), (d = C.inflate_trees_bits(o, l, _, h, u)), d != L))
              return (
                (c = d),
                c == H && ((o = null), (r = pe)),
                (e.bitb = y),
                (e.bitk = g),
                (u.avail_in = E),
                (u.total_in += m - u.next_in_index),
                (u.next_in_index = m),
                (e.write = p),
                e.inflate_flush(u, c)
              );
            (a = 0), (r = Qt);
          case Qt:
            for (; (d = i), !(a >= 258 + (d & 31) + ((d >> 5) & 31)); ) {
              let U, F;
              for (d = l[0]; g < d; ) {
                if (E !== 0) c = L;
                else
                  return (
                    (e.bitb = y),
                    (e.bitk = g),
                    (u.avail_in = E),
                    (u.total_in += m - u.next_in_index),
                    (u.next_in_index = m),
                    (e.write = p),
                    e.inflate_flush(u, c)
                  );
                E--, (y |= (u.read_byte(m++) & 255) << g), (g += 8);
              }
              if (((d = h[(_[0] + (y & $[d])) * 3 + 1]), (F = h[(_[0] + (y & $[d])) * 3 + 2]), F < 16))
                (y >>>= d), (g -= d), (o[a++] = F);
              else {
                for (T = F == 18 ? 7 : F - 14, U = F == 18 ? 11 : 3; g < d + T; ) {
                  if (E !== 0) c = L;
                  else
                    return (
                      (e.bitb = y),
                      (e.bitk = g),
                      (u.avail_in = E),
                      (u.total_in += m - u.next_in_index),
                      (u.next_in_index = m),
                      (e.write = p),
                      e.inflate_flush(u, c)
                    );
                  E--, (y |= (u.read_byte(m++) & 255) << g), (g += 8);
                }
                if (
                  ((y >>>= d),
                  (g -= d),
                  (U += y & $[T]),
                  (y >>>= T),
                  (g -= T),
                  (T = a),
                  (d = i),
                  T + U > 258 + (d & 31) + ((d >> 5) & 31) || (F == 16 && T < 1))
                )
                  return (
                    (o = null),
                    (r = pe),
                    (u.msg = "invalid bit length repeat"),
                    (c = H),
                    (e.bitb = y),
                    (e.bitk = g),
                    (u.avail_in = E),
                    (u.total_in += m - u.next_in_index),
                    (u.next_in_index = m),
                    (e.write = p),
                    e.inflate_flush(u, c)
                  );
                F = F == 16 ? o[T - 1] : 0;
                do o[T++] = F;
                while (--U !== 0);
                a = T;
              }
            }
            if (
              ((_[0] = -1),
              (I = []),
              (v = []),
              (k = []),
              (D = []),
              (I[0] = 9),
              (v[0] = 6),
              (d = i),
              (d = C.inflate_trees_dynamic(257 + (d & 31), 1 + ((d >> 5) & 31), o, I, v, k, D, h, u)),
              d != L)
            )
              return (
                d == H && ((o = null), (r = pe)),
                (c = d),
                (e.bitb = y),
                (e.bitk = g),
                (u.avail_in = E),
                (u.total_in += m - u.next_in_index),
                (u.next_in_index = m),
                (e.write = p),
                e.inflate_flush(u, c)
              );
            f.init(I[0], v[0], h, k[0], h, D[0]), (r = Le);
          case Le:
            if (
              ((e.bitb = y),
              (e.bitk = g),
              (u.avail_in = E),
              (u.total_in += m - u.next_in_index),
              (u.next_in_index = m),
              (e.write = p),
              (c = f.proc(e, u, c)) != te)
            )
              return e.inflate_flush(u, c);
            if (
              ((c = L),
              f.free(u),
              (m = u.next_in_index),
              (E = u.avail_in),
              (y = e.bitb),
              (g = e.bitk),
              (p = e.write),
              (R = p < e.read ? e.read - p - 1 : e.end - p),
              b === 0)
            ) {
              r = ge;
              break;
            }
            r = Me;
          case Me:
            if (
              ((e.write = p),
              (c = e.inflate_flush(u, c)),
              (p = e.write),
              (R = p < e.read ? e.read - p - 1 : e.end - p),
              e.read != e.write)
            )
              return (
                (e.bitb = y),
                (e.bitk = g),
                (u.avail_in = E),
                (u.total_in += m - u.next_in_index),
                (u.next_in_index = m),
                (e.write = p),
                e.inflate_flush(u, c)
              );
            r = zt;
          case zt:
            return (
              (c = te),
              (e.bitb = y),
              (e.bitk = g),
              (u.avail_in = E),
              (u.total_in += m - u.next_in_index),
              (u.next_in_index = m),
              (e.write = p),
              e.inflate_flush(u, c)
            );
          case pe:
            return (
              (c = H),
              (e.bitb = y),
              (e.bitk = g),
              (u.avail_in = E),
              (u.total_in += m - u.next_in_index),
              (u.next_in_index = m),
              (e.write = p),
              e.inflate_flush(u, c)
            );
          default:
            return (
              (c = X),
              (e.bitb = y),
              (e.bitk = g),
              (u.avail_in = E),
              (u.total_in += m - u.next_in_index),
              (u.next_in_index = m),
              (e.write = p),
              e.inflate_flush(u, c)
            );
        }
      }
    }),
    (e.free = function (u) {
      e.reset(u, null), (e.win = null), (h = null);
    }),
    (e.set_dictionary = function (u, c, d) {
      e.win.set(u.subarray(c, c + d), 0), (e.read = e.write = d);
    }),
    (e.sync_point = function () {
      return r == Je ? 1 : 0;
    });
}
const Cs = 32,
  Is = 8,
  Os = 0,
  en = 1,
  tn = 2,
  nn = 3,
  rn = 4,
  sn = 5,
  Qe = 6,
  Ee = 7,
  an = 12,
  se = 13,
  ks = [0, 0, 255, 255];
function Ds() {
  const n = this;
  (n.mode = 0), (n.method = 0), (n.was = [0]), (n.need = 0), (n.marker = 0), (n.wbits = 0);
  function t(e) {
    return !e || !e.istate
      ? X
      : ((e.total_in = e.total_out = 0), (e.msg = null), (e.istate.mode = Ee), e.istate.blocks.reset(e, null), L);
  }
  (n.inflateEnd = function (e) {
    return n.blocks && n.blocks.free(e), (n.blocks = null), L;
  }),
    (n.inflateInit = function (e, r) {
      return (
        (e.msg = null),
        (n.blocks = null),
        r < 8 || r > 15 ? (n.inflateEnd(e), X) : ((n.wbits = r), (e.istate.blocks = new As(e, 1 << r)), t(e), L)
      );
    }),
    (n.inflate = function (e, r) {
      let s, i;
      if (!e || !e.istate || !e.next_in) return X;
      const a = e.istate;
      for (r = r == ms ? ne : L, s = ne; ; )
        switch (a.mode) {
          case Os:
            if (e.avail_in === 0) return s;
            if (((s = r), e.avail_in--, e.total_in++, ((a.method = e.read_byte(e.next_in_index++)) & 15) != Is)) {
              (a.mode = se), (e.msg = "unknown compression method"), (a.marker = 5);
              break;
            }
            if ((a.method >> 4) + 8 > a.wbits) {
              (a.mode = se), (e.msg = "invalid win size"), (a.marker = 5);
              break;
            }
            a.mode = en;
          case en:
            if (e.avail_in === 0) return s;
            if (
              ((s = r),
              e.avail_in--,
              e.total_in++,
              (i = e.read_byte(e.next_in_index++) & 255),
              ((a.method << 8) + i) % 31 !== 0)
            ) {
              (a.mode = se), (e.msg = "incorrect header check"), (a.marker = 5);
              break;
            }
            if ((i & Cs) === 0) {
              a.mode = Ee;
              break;
            }
            a.mode = tn;
          case tn:
            if (e.avail_in === 0) return s;
            (s = r),
              e.avail_in--,
              e.total_in++,
              (a.need = ((e.read_byte(e.next_in_index++) & 255) << 24) & 4278190080),
              (a.mode = nn);
          case nn:
            if (e.avail_in === 0) return s;
            (s = r),
              e.avail_in--,
              e.total_in++,
              (a.need += ((e.read_byte(e.next_in_index++) & 255) << 16) & 16711680),
              (a.mode = rn);
          case rn:
            if (e.avail_in === 0) return s;
            (s = r),
              e.avail_in--,
              e.total_in++,
              (a.need += ((e.read_byte(e.next_in_index++) & 255) << 8) & 65280),
              (a.mode = sn);
          case sn:
            return e.avail_in === 0
              ? s
              : ((s = r),
                e.avail_in--,
                e.total_in++,
                (a.need += e.read_byte(e.next_in_index++) & 255),
                (a.mode = Qe),
                hs);
          case Qe:
            return (a.mode = se), (e.msg = "need dictionary"), (a.marker = 0), X;
          case Ee:
            if (((s = a.blocks.proc(e, s)), s == H)) {
              (a.mode = se), (a.marker = 0);
              break;
            }
            if ((s == L && (s = r), s != te)) return s;
            (s = r), a.blocks.reset(e, a.was), (a.mode = an);
          case an:
            return (e.avail_in = 0), te;
          case se:
            return H;
          default:
            return X;
        }
    }),
    (n.inflateSetDictionary = function (e, r, s) {
      let i = 0,
        a = s;
      if (!e || !e.istate || e.istate.mode != Qe) return X;
      const o = e.istate;
      return (
        a >= 1 << o.wbits && ((a = (1 << o.wbits) - 1), (i = s - a)), o.blocks.set_dictionary(r, i, a), (o.mode = Ee), L
      );
    }),
    (n.inflateSync = function (e) {
      let r, s, i, a, o;
      if (!e || !e.istate) return X;
      const l = e.istate;
      if ((l.mode != se && ((l.mode = se), (l.marker = 0)), (r = e.avail_in) === 0)) return ne;
      for (s = e.next_in_index, i = l.marker; r !== 0 && i < 4; )
        e.read_byte(s) == ks[i] ? i++ : e.read_byte(s) !== 0 ? (i = 0) : (i = 4 - i), s++, r--;
      return (
        (e.total_in += s - e.next_in_index),
        (e.next_in_index = s),
        (e.avail_in = r),
        (l.marker = i),
        i != 4 ? H : ((a = e.total_in), (o = e.total_out), t(e), (e.total_in = a), (e.total_out = o), (l.mode = Ee), L)
      );
    }),
    (n.inflateSyncPoint = function (e) {
      return !e || !e.istate || !e.istate.blocks ? X : e.istate.blocks.sync_point();
    });
}
function Hn() {}
Hn.prototype = {
  inflateInit(n) {
    const t = this;
    return (t.istate = new Ds()), n || (n = _s), t.istate.inflateInit(t, n);
  },
  inflate(n) {
    const t = this;
    return t.istate ? t.istate.inflate(t, n) : X;
  },
  inflateEnd() {
    const n = this;
    if (!n.istate) return X;
    const t = n.istate.inflateEnd(n);
    return (n.istate = null), t;
  },
  inflateSync() {
    const n = this;
    return n.istate ? n.istate.inflateSync(n) : X;
  },
  inflateSetDictionary(n, t) {
    const e = this;
    return e.istate ? e.istate.inflateSetDictionary(e, n, t) : X;
  },
  read_byte(n) {
    return this.next_in[n];
  },
  read_buf(n, t) {
    return this.next_in.subarray(n, n + t);
  }
};
function Ps(n) {
  const t = this,
    e = new Hn(),
    r = n && n.chunkSize ? Math.floor(n.chunkSize * 2) : 128 * 1024,
    s = ps,
    i = new Uint8Array(r);
  let a = !1;
  e.inflateInit(),
    (e.next_out = i),
    (t.append = function (o, l) {
      const _ = [];
      let f,
        b,
        h = 0,
        S = 0,
        C = 0;
      if (o.length !== 0) {
        (e.next_in_index = 0), (e.next_in = o), (e.avail_in = o.length);
        do {
          if (
            ((e.next_out_index = 0),
            (e.avail_out = r),
            e.avail_in === 0 && !a && ((e.next_in_index = 0), (a = !0)),
            (f = e.inflate(s)),
            a && f === ne)
          ) {
            if (e.avail_in !== 0) throw new Error("inflating: bad input");
          } else if (f !== L && f !== te) throw new Error("inflating: " + e.msg);
          if ((a || f === te) && e.avail_in === o.length) throw new Error("inflating: bad input");
          e.next_out_index &&
            (e.next_out_index === r ? _.push(new Uint8Array(i)) : _.push(i.subarray(0, e.next_out_index))),
            (C += e.next_out_index),
            l && e.next_in_index > 0 && e.next_in_index != h && (l(e.next_in_index), (h = e.next_in_index));
        } while (e.avail_in > 0 || e.avail_out === 0);
        return (
          _.length > 1
            ? ((b = new Uint8Array(C)),
              _.forEach(function (u) {
                b.set(u, S), (S += u.length);
              }))
            : (b = _[0] ? new Uint8Array(_[0]) : new Uint8Array()),
          b
        );
      }
    }),
    (t.flush = function () {
      e.inflateEnd();
    });
}
const me = 4294967295,
  oe = 65535,
  vs = 8,
  Fs = 0,
  Ns = 99,
  Ls = 67324752,
  Ms = 134695760,
  on = 33639248,
  Us = 101010256,
  cn = 101075792,
  Ws = 117853008,
  ce = 22,
  ze = 20,
  et = 56,
  Hs = 1,
  Bs = 39169,
  js = 10,
  qs = 1,
  Ys = 21589,
  Gs = 28789,
  Vs = 25461,
  Zs = 6534,
  ln = 1,
  Ks = 6,
  fn = 8,
  un = 2048,
  dn = 16,
  _n = 16384,
  hn = 73,
  pn = "/",
  V = void 0,
  de = "undefined",
  ke = "function";
class mn {
  constructor(t) {
    return class extends TransformStream {
      constructor(e, r) {
        const s = new t(r);
        super({
          transform(i, a) {
            a.enqueue(s.append(i));
          },
          flush(i) {
            const a = s.flush();
            a && i.enqueue(a);
          }
        });
      }
    };
  }
}
const Xs = 64;
let Bn = 2;
try {
  typeof navigator != de && navigator.hardwareConcurrency && (Bn = navigator.hardwareConcurrency);
} catch {}
const $s = {
    chunkSize: 512 * 1024,
    maxWorkers: Bn,
    terminateWorkerTimeout: 5e3,
    useWebWorkers: !0,
    useCompressionStream: !0,
    workerScripts: V,
    CompressionStreamNative: typeof CompressionStream != de && CompressionStream,
    DecompressionStreamNative: typeof DecompressionStream != de && DecompressionStream
  },
  le = Object.assign({}, $s);
function jn() {
  return le;
}
function Js(n) {
  return Math.max(n.chunkSize, Xs);
}
function qn(n) {
  const {
    baseURL: t,
    chunkSize: e,
    maxWorkers: r,
    terminateWorkerTimeout: s,
    useCompressionStream: i,
    useWebWorkers: a,
    Deflate: o,
    Inflate: l,
    CompressionStream: _,
    DecompressionStream: f,
    workerScripts: b
  } = n;
  if (
    (ie("baseURL", t),
    ie("chunkSize", e),
    ie("maxWorkers", r),
    ie("terminateWorkerTimeout", s),
    ie("useCompressionStream", i),
    ie("useWebWorkers", a),
    o && (le.CompressionStream = new mn(o)),
    l && (le.DecompressionStream = new mn(l)),
    ie("CompressionStream", _),
    ie("DecompressionStream", f),
    b !== V)
  ) {
    const { deflate: h, inflate: S } = b;
    if (((h || S) && (le.workerScripts || (le.workerScripts = {})), h)) {
      if (!Array.isArray(h)) throw new Error("workerScripts.deflate must be an array");
      le.workerScripts.deflate = h;
    }
    if (S) {
      if (!Array.isArray(S)) throw new Error("workerScripts.inflate must be an array");
      le.workerScripts.inflate = S;
    }
  }
}
function ie(n, t) {
  t !== V && (le[n] = t);
}
function Qs() {
  return "application/octet-stream";
}
const Yn = [];
for (let n = 0; n < 256; n++) {
  let t = n;
  for (let e = 0; e < 8; e++) t & 1 ? (t = (t >>> 1) ^ 3988292384) : (t = t >>> 1);
  Yn[n] = t;
}
class je {
  constructor(t) {
    this.crc = t || -1;
  }
  append(t) {
    let e = this.crc | 0;
    for (let r = 0, s = t.length | 0; r < s; r++) e = (e >>> 8) ^ Yn[(e ^ t[r]) & 255];
    this.crc = e;
  }
  get() {
    return ~this.crc;
  }
}
class Gn extends TransformStream {
  constructor() {
    let t;
    const e = new je();
    super({
      transform(r, s) {
        e.append(r), s.enqueue(r);
      },
      flush() {
        const r = new Uint8Array(4);
        new DataView(r.buffer).setUint32(0, e.get()), (t.value = r);
      }
    }),
      (t = this);
  }
}
function zs(n) {
  if (typeof TextEncoder == de) {
    n = unescape(encodeURIComponent(n));
    const t = new Uint8Array(n.length);
    for (let e = 0; e < t.length; e++) t[e] = n.charCodeAt(e);
    return t;
  } else return new TextEncoder().encode(n);
}
const K = {
    concat(n, t) {
      if (n.length === 0 || t.length === 0) return n.concat(t);
      const e = n[n.length - 1],
        r = K.getPartial(e);
      return r === 32 ? n.concat(t) : K._shiftRight(t, r, e | 0, n.slice(0, n.length - 1));
    },
    bitLength(n) {
      const t = n.length;
      if (t === 0) return 0;
      const e = n[t - 1];
      return (t - 1) * 32 + K.getPartial(e);
    },
    clamp(n, t) {
      if (n.length * 32 < t) return n;
      n = n.slice(0, Math.ceil(t / 32));
      const e = n.length;
      return (t = t & 31), e > 0 && t && (n[e - 1] = K.partial(t, n[e - 1] & (2147483648 >> (t - 1)), 1)), n;
    },
    partial(n, t, e) {
      return n === 32 ? t : (e ? t | 0 : t << (32 - n)) + n * 1099511627776;
    },
    getPartial(n) {
      return Math.round(n / 1099511627776) || 32;
    },
    _shiftRight(n, t, e, r) {
      for (r === void 0 && (r = []); t >= 32; t -= 32) r.push(e), (e = 0);
      if (t === 0) return r.concat(n);
      for (let a = 0; a < n.length; a++) r.push(e | (n[a] >>> t)), (e = n[a] << (32 - t));
      const s = n.length ? n[n.length - 1] : 0,
        i = K.getPartial(s);
      return r.push(K.partial((t + i) & 31, t + i > 32 ? e : r.pop(), 1)), r;
    }
  },
  qe = {
    bytes: {
      fromBits(n) {
        const e = K.bitLength(n) / 8,
          r = new Uint8Array(e);
        let s;
        for (let i = 0; i < e; i++) (i & 3) === 0 && (s = n[i / 4]), (r[i] = s >>> 24), (s <<= 8);
        return r;
      },
      toBits(n) {
        const t = [];
        let e,
          r = 0;
        for (e = 0; e < n.length; e++) (r = (r << 8) | n[e]), (e & 3) === 3 && (t.push(r), (r = 0));
        return e & 3 && t.push(K.partial(8 * (e & 3), r)), t;
      }
    }
  },
  Vn = {};
Vn.sha1 = class {
  constructor(n) {
    const t = this;
    (t.blockSize = 512),
      (t._init = [1732584193, 4023233417, 2562383102, 271733878, 3285377520]),
      (t._key = [1518500249, 1859775393, 2400959708, 3395469782]),
      n ? ((t._h = n._h.slice(0)), (t._buffer = n._buffer.slice(0)), (t._length = n._length)) : t.reset();
  }
  reset() {
    const n = this;
    return (n._h = n._init.slice(0)), (n._buffer = []), (n._length = 0), n;
  }
  update(n) {
    const t = this;
    typeof n == "string" && (n = qe.utf8String.toBits(n));
    const e = (t._buffer = K.concat(t._buffer, n)),
      r = t._length,
      s = (t._length = r + K.bitLength(n));
    if (s > 9007199254740991) throw new Error("Cannot hash more than 2^53 - 1 bits");
    const i = new Uint32Array(e);
    let a = 0;
    for (let o = t.blockSize + r - ((t.blockSize + r) & (t.blockSize - 1)); o <= s; o += t.blockSize)
      t._block(i.subarray(16 * a, 16 * (a + 1))), (a += 1);
    return e.splice(0, 16 * a), t;
  }
  finalize() {
    const n = this;
    let t = n._buffer;
    const e = n._h;
    t = K.concat(t, [K.partial(1, 1)]);
    for (let r = t.length + 2; r & 15; r++) t.push(0);
    for (t.push(Math.floor(n._length / 4294967296)), t.push(n._length | 0); t.length; ) n._block(t.splice(0, 16));
    return n.reset(), e;
  }
  _f(n, t, e, r) {
    if (n <= 19) return (t & e) | (~t & r);
    if (n <= 39) return t ^ e ^ r;
    if (n <= 59) return (t & e) | (t & r) | (e & r);
    if (n <= 79) return t ^ e ^ r;
  }
  _S(n, t) {
    return (t << n) | (t >>> (32 - n));
  }
  _block(n) {
    const t = this,
      e = t._h,
      r = Array(80);
    for (let _ = 0; _ < 16; _++) r[_] = n[_];
    let s = e[0],
      i = e[1],
      a = e[2],
      o = e[3],
      l = e[4];
    for (let _ = 0; _ <= 79; _++) {
      _ >= 16 && (r[_] = t._S(1, r[_ - 3] ^ r[_ - 8] ^ r[_ - 14] ^ r[_ - 16]));
      const f = (t._S(5, s) + t._f(_, i, a, o) + l + r[_] + t._key[Math.floor(_ / 20)]) | 0;
      (l = o), (o = a), (a = t._S(30, i)), (i = s), (s = f);
    }
    (e[0] = (e[0] + s) | 0),
      (e[1] = (e[1] + i) | 0),
      (e[2] = (e[2] + a) | 0),
      (e[3] = (e[3] + o) | 0),
      (e[4] = (e[4] + l) | 0);
  }
};
const Zn = {};
Zn.aes = class {
  constructor(n) {
    const t = this;
    (t._tables = [
      [[], [], [], [], []],
      [[], [], [], [], []]
    ]),
      t._tables[0][0][0] || t._precompute();
    const e = t._tables[0][4],
      r = t._tables[1],
      s = n.length;
    let i,
      a,
      o,
      l = 1;
    if (s !== 4 && s !== 6 && s !== 8) throw new Error("invalid aes key size");
    for (t._key = [(a = n.slice(0)), (o = [])], i = s; i < 4 * s + 28; i++) {
      let _ = a[i - 1];
      (i % s === 0 || (s === 8 && i % s === 4)) &&
        ((_ = (e[_ >>> 24] << 24) ^ (e[(_ >> 16) & 255] << 16) ^ (e[(_ >> 8) & 255] << 8) ^ e[_ & 255]),
        i % s === 0 && ((_ = (_ << 8) ^ (_ >>> 24) ^ (l << 24)), (l = (l << 1) ^ ((l >> 7) * 283)))),
        (a[i] = a[i - s] ^ _);
    }
    for (let _ = 0; i; _++, i--) {
      const f = a[_ & 3 ? i : i - 4];
      i <= 4 || _ < 4
        ? (o[_] = f)
        : (o[_] = r[0][e[f >>> 24]] ^ r[1][e[(f >> 16) & 255]] ^ r[2][e[(f >> 8) & 255]] ^ r[3][e[f & 255]]);
    }
  }
  encrypt(n) {
    return this._crypt(n, 0);
  }
  decrypt(n) {
    return this._crypt(n, 1);
  }
  _precompute() {
    const n = this._tables[0],
      t = this._tables[1],
      e = n[4],
      r = t[4],
      s = [],
      i = [];
    let a, o, l, _;
    for (let f = 0; f < 256; f++) i[(s[f] = (f << 1) ^ ((f >> 7) * 283)) ^ f] = f;
    for (let f = (a = 0); !e[f]; f ^= o || 1, a = i[a] || 1) {
      let b = a ^ (a << 1) ^ (a << 2) ^ (a << 3) ^ (a << 4);
      (b = (b >> 8) ^ (b & 255) ^ 99), (e[f] = b), (r[b] = f), (_ = s[(l = s[(o = s[f])])]);
      let h = (_ * 16843009) ^ (l * 65537) ^ (o * 257) ^ (f * 16843008),
        S = (s[b] * 257) ^ (b * 16843008);
      for (let C = 0; C < 4; C++) (n[C][f] = S = (S << 24) ^ (S >>> 8)), (t[C][b] = h = (h << 24) ^ (h >>> 8));
    }
    for (let f = 0; f < 5; f++) (n[f] = n[f].slice(0)), (t[f] = t[f].slice(0));
  }
  _crypt(n, t) {
    if (n.length !== 4) throw new Error("invalid aes block size");
    const e = this._key[t],
      r = e.length / 4 - 2,
      s = [0, 0, 0, 0],
      i = this._tables[t],
      a = i[0],
      o = i[1],
      l = i[2],
      _ = i[3],
      f = i[4];
    let b = n[0] ^ e[0],
      h = n[t ? 3 : 1] ^ e[1],
      S = n[2] ^ e[2],
      C = n[t ? 1 : 3] ^ e[3],
      u = 4,
      c,
      d,
      y;
    for (let g = 0; g < r; g++)
      (c = a[b >>> 24] ^ o[(h >> 16) & 255] ^ l[(S >> 8) & 255] ^ _[C & 255] ^ e[u]),
        (d = a[h >>> 24] ^ o[(S >> 16) & 255] ^ l[(C >> 8) & 255] ^ _[b & 255] ^ e[u + 1]),
        (y = a[S >>> 24] ^ o[(C >> 16) & 255] ^ l[(b >> 8) & 255] ^ _[h & 255] ^ e[u + 2]),
        (C = a[C >>> 24] ^ o[(b >> 16) & 255] ^ l[(h >> 8) & 255] ^ _[S & 255] ^ e[u + 3]),
        (u += 4),
        (b = c),
        (h = d),
        (S = y);
    for (let g = 0; g < 4; g++)
      (s[t ? 3 & -g : g] =
        (f[b >>> 24] << 24) ^ (f[(h >> 16) & 255] << 16) ^ (f[(S >> 8) & 255] << 8) ^ f[C & 255] ^ e[u++]),
        (c = b),
        (b = h),
        (h = S),
        (S = C),
        (C = c);
    return s;
  }
};
const ei = {
    getRandomValues(n) {
      const t = new Uint32Array(n.buffer),
        e = (r) => {
          let s = 987654321;
          const i = 4294967295;
          return function () {
            return (
              (s = (36969 * (s & 65535) + (s >> 16)) & i),
              (r = (18e3 * (r & 65535) + (r >> 16)) & i),
              ((((s << 16) + r) & i) / 4294967296 + 0.5) * (Math.random() > 0.5 ? 1 : -1)
            );
          };
        };
      for (let r = 0, s; r < n.length; r += 4) {
        const i = e((s || Math.random()) * 4294967296);
        (s = i() * 987654071), (t[r / 4] = (i() * 4294967296) | 0);
      }
      return n;
    }
  },
  Kn = {};
Kn.ctrGladman = class {
  constructor(n, t) {
    (this._prf = n), (this._initIv = t), (this._iv = t);
  }
  reset() {
    this._iv = this._initIv;
  }
  update(n) {
    return this.calculate(this._prf, n, this._iv);
  }
  incWord(n) {
    if (((n >> 24) & 255) === 255) {
      let t = (n >> 16) & 255,
        e = (n >> 8) & 255,
        r = n & 255;
      t === 255 ? ((t = 0), e === 255 ? ((e = 0), r === 255 ? (r = 0) : ++r) : ++e) : ++t,
        (n = 0),
        (n += t << 16),
        (n += e << 8),
        (n += r);
    } else n += 1 << 24;
    return n;
  }
  incCounter(n) {
    (n[0] = this.incWord(n[0])) === 0 && (n[1] = this.incWord(n[1]));
  }
  calculate(n, t, e) {
    let r;
    if (!(r = t.length)) return [];
    const s = K.bitLength(t);
    for (let i = 0; i < r; i += 4) {
      this.incCounter(e);
      const a = n.encrypt(e);
      (t[i] ^= a[0]), (t[i + 1] ^= a[1]), (t[i + 2] ^= a[2]), (t[i + 3] ^= a[3]);
    }
    return K.clamp(t, s);
  }
};
const we = {
  importKey(n) {
    return new we.hmacSha1(qe.bytes.toBits(n));
  },
  pbkdf2(n, t, e, r) {
    if (((e = e || 1e4), r < 0 || e < 0)) throw new Error("invalid params to pbkdf2");
    const s = ((r >> 5) + 1) << 2;
    let i, a, o, l, _;
    const f = new ArrayBuffer(s),
      b = new DataView(f);
    let h = 0;
    const S = K;
    for (t = qe.bytes.toBits(t), _ = 1; h < (s || 1); _++) {
      for (i = a = n.encrypt(S.concat(t, [_])), o = 1; o < e; o++)
        for (a = n.encrypt(a), l = 0; l < a.length; l++) i[l] ^= a[l];
      for (o = 0; h < (s || 1) && o < i.length; o++) b.setInt32(h, i[o]), (h += 4);
    }
    return f.slice(0, r / 8);
  }
};
we.hmacSha1 = class {
  constructor(n) {
    const t = this,
      e = (t._hash = Vn.sha1),
      r = [[], []];
    t._baseHash = [new e(), new e()];
    const s = t._baseHash[0].blockSize / 32;
    n.length > s && (n = new e().update(n).finalize());
    for (let i = 0; i < s; i++) (r[0][i] = n[i] ^ 909522486), (r[1][i] = n[i] ^ 1549556828);
    t._baseHash[0].update(r[0]), t._baseHash[1].update(r[1]), (t._resultHash = new e(t._baseHash[0]));
  }
  reset() {
    const n = this;
    (n._resultHash = new n._hash(n._baseHash[0])), (n._updated = !1);
  }
  update(n) {
    const t = this;
    (t._updated = !0), t._resultHash.update(n);
  }
  digest() {
    const n = this,
      t = n._resultHash.finalize(),
      e = new n._hash(n._baseHash[1]).update(t).finalize();
    return n.reset(), e;
  }
  encrypt(n) {
    if (this._updated) throw new Error("encrypt on already updated hmac called!");
    return this.update(n), this.digest(n);
  }
};
const ti = typeof crypto != de && typeof crypto.getRandomValues == ke,
  wt = "Invalid password",
  gt = "Invalid signature",
  bt = "zipjs-abort-check-password";
function Xn(n) {
  return ti ? crypto.getRandomValues(n) : ei.getRandomValues(n);
}
const be = 16,
  ni = "raw",
  $n = { name: "PBKDF2" },
  ri = { name: "HMAC" },
  si = "SHA-1",
  ii = Object.assign({ hash: ri }, $n),
  ct = Object.assign({ iterations: 1e3, hash: { name: si } }, $n),
  ai = ["deriveBits"],
  Re = [8, 12, 16],
  Te = [16, 24, 32],
  ae = 10,
  oi = [0, 0, 0, 0],
  Ge = typeof crypto != de,
  De = Ge && crypto.subtle,
  Jn = Ge && typeof De != de,
  z = qe.bytes,
  ci = Zn.aes,
  li = Kn.ctrGladman,
  fi = we.hmacSha1;
let wn = Ge && Jn && typeof De.importKey == ke,
  gn = Ge && Jn && typeof De.deriveBits == ke;
class ui extends TransformStream {
  constructor({ password: t, rawPassword: e, signed: r, encryptionStrength: s, checkPasswordOnly: i }) {
    super({
      start() {
        Object.assign(this, {
          ready: new Promise((a) => (this.resolveReady = a)),
          password: er(t, e),
          signed: r,
          strength: s - 1,
          pending: new Uint8Array()
        });
      },
      async transform(a, o) {
        const l = this,
          { password: _, strength: f, resolveReady: b, ready: h } = l;
        _ ? (await _i(l, f, _, Q(a, 0, Re[f] + 2)), (a = Q(a, Re[f] + 2)), i ? o.error(new Error(bt)) : b()) : await h;
        const S = new Uint8Array(a.length - ae - ((a.length - ae) % be));
        o.enqueue(Qn(l, a, S, 0, ae, !0));
      },
      async flush(a) {
        const { signed: o, ctr: l, hmac: _, pending: f, ready: b } = this;
        if (_ && l) {
          await b;
          const h = Q(f, 0, f.length - ae),
            S = Q(f, f.length - ae);
          let C = new Uint8Array();
          if (h.length) {
            const u = Ce(z, h);
            _.update(u);
            const c = l.update(u);
            C = Ae(z, c);
          }
          if (o) {
            const u = Q(Ae(z, _.digest()), 0, ae);
            for (let c = 0; c < ae; c++) if (u[c] != S[c]) throw new Error(gt);
          }
          a.enqueue(C);
        }
      }
    });
  }
}
class di extends TransformStream {
  constructor({ password: t, rawPassword: e, encryptionStrength: r }) {
    let s;
    super({
      start() {
        Object.assign(this, {
          ready: new Promise((i) => (this.resolveReady = i)),
          password: er(t, e),
          strength: r - 1,
          pending: new Uint8Array()
        });
      },
      async transform(i, a) {
        const o = this,
          { password: l, strength: _, resolveReady: f, ready: b } = o;
        let h = new Uint8Array();
        l ? ((h = await hi(o, _, l)), f()) : await b;
        const S = new Uint8Array(h.length + i.length - (i.length % be));
        S.set(h, 0), a.enqueue(Qn(o, i, S, h.length, 0));
      },
      async flush(i) {
        const { ctr: a, hmac: o, pending: l, ready: _ } = this;
        if (o && a) {
          await _;
          let f = new Uint8Array();
          if (l.length) {
            const b = a.update(Ce(z, l));
            o.update(b), (f = Ae(z, b));
          }
          (s.signature = Ae(z, o.digest()).slice(0, ae)), i.enqueue(yt(f, s.signature));
        }
      }
    }),
      (s = this);
  }
}
function Qn(n, t, e, r, s, i) {
  const { ctr: a, hmac: o, pending: l } = n,
    _ = t.length - s;
  l.length && ((t = yt(l, t)), (e = wi(e, _ - (_ % be))));
  let f;
  for (f = 0; f <= _ - be; f += be) {
    const b = Ce(z, Q(t, f, f + be));
    i && o.update(b);
    const h = a.update(b);
    i || o.update(h), e.set(Ae(z, h), f + r);
  }
  return (n.pending = Q(t, f)), e;
}
async function _i(n, t, e, r) {
  const s = await zn(n, t, e, Q(r, 0, Re[t])),
    i = Q(r, Re[t]);
  if (s[0] != i[0] || s[1] != i[1]) throw new Error(wt);
}
async function hi(n, t, e) {
  const r = Xn(new Uint8Array(Re[t])),
    s = await zn(n, t, e, r);
  return yt(r, s);
}
async function zn(n, t, e, r) {
  n.password = null;
  const s = await pi(ni, e, ii, !1, ai),
    i = await mi(Object.assign({ salt: r }, ct), s, 8 * (Te[t] * 2 + 2)),
    a = new Uint8Array(i),
    o = Ce(z, Q(a, 0, Te[t])),
    l = Ce(z, Q(a, Te[t], Te[t] * 2)),
    _ = Q(a, Te[t] * 2);
  return (
    Object.assign(n, {
      keys: { key: o, authentication: l, passwordVerification: _ },
      ctr: new li(new ci(o), Array.from(oi)),
      hmac: new fi(l)
    }),
    _
  );
}
async function pi(n, t, e, r, s) {
  if (wn)
    try {
      return await De.importKey(n, t, e, r, s);
    } catch {
      return (wn = !1), we.importKey(t);
    }
  else return we.importKey(t);
}
async function mi(n, t, e) {
  if (gn)
    try {
      return await De.deriveBits(n, t, e);
    } catch {
      return (gn = !1), we.pbkdf2(t, n.salt, ct.iterations, e);
    }
  else return we.pbkdf2(t, n.salt, ct.iterations, e);
}
function er(n, t) {
  return t === V ? zs(n) : t;
}
function yt(n, t) {
  let e = n;
  return n.length + t.length && ((e = new Uint8Array(n.length + t.length)), e.set(n, 0), e.set(t, n.length)), e;
}
function wi(n, t) {
  if (t && t > n.length) {
    const e = n;
    (n = new Uint8Array(t)), n.set(e, 0);
  }
  return n;
}
function Q(n, t, e) {
  return n.subarray(t, e);
}
function Ae(n, t) {
  return n.fromBits(t);
}
function Ce(n, t) {
  return n.toBits(t);
}
const ye = 12;
class gi extends TransformStream {
  constructor({ password: t, passwordVerification: e, checkPasswordOnly: r }) {
    super({
      start() {
        Object.assign(this, { password: t, passwordVerification: e }), tr(this, t);
      },
      transform(s, i) {
        const a = this;
        if (a.password) {
          const o = bn(a, s.subarray(0, ye));
          if (((a.password = null), o[ye - 1] != a.passwordVerification)) throw new Error(wt);
          s = s.subarray(ye);
        }
        r ? i.error(new Error(bt)) : i.enqueue(bn(a, s));
      }
    });
  }
}
class bi extends TransformStream {
  constructor({ password: t, passwordVerification: e }) {
    super({
      start() {
        Object.assign(this, { password: t, passwordVerification: e }), tr(this, t);
      },
      transform(r, s) {
        const i = this;
        let a, o;
        if (i.password) {
          i.password = null;
          const l = Xn(new Uint8Array(ye));
          (l[ye - 1] = i.passwordVerification), (a = new Uint8Array(r.length + l.length)), a.set(yn(i, l), 0), (o = ye);
        } else (a = new Uint8Array(r.length)), (o = 0);
        a.set(yn(i, r), o), s.enqueue(a);
      }
    });
  }
}
function bn(n, t) {
  const e = new Uint8Array(t.length);
  for (let r = 0; r < t.length; r++) (e[r] = nr(n) ^ t[r]), xt(n, e[r]);
  return e;
}
function yn(n, t) {
  const e = new Uint8Array(t.length);
  for (let r = 0; r < t.length; r++) (e[r] = nr(n) ^ t[r]), xt(n, t[r]);
  return e;
}
function tr(n, t) {
  const e = [305419896, 591751049, 878082192];
  Object.assign(n, { keys: e, crcKey0: new je(e[0]), crcKey2: new je(e[2]) });
  for (let r = 0; r < t.length; r++) xt(n, t.charCodeAt(r));
}
function xt(n, t) {
  let [e, r, s] = n.keys;
  n.crcKey0.append([t]),
    (e = ~n.crcKey0.get()),
    (r = xn(Math.imul(xn(r + rr(e)), 134775813) + 1)),
    n.crcKey2.append([r >>> 24]),
    (s = ~n.crcKey2.get()),
    (n.keys = [e, r, s]);
}
function nr(n) {
  const t = n.keys[2] | 2;
  return rr(Math.imul(t, t ^ 1) >>> 8);
}
function rr(n) {
  return n & 255;
}
function xn(n) {
  return n & 4294967295;
}
const En = "deflate-raw";
class yi extends TransformStream {
  constructor(t, { chunkSize: e, CompressionStream: r, CompressionStreamNative: s }) {
    super({});
    const { compressed: i, encrypted: a, useCompressionStream: o, zipCrypto: l, signed: _, level: f } = t,
      b = this;
    let h,
      S,
      C = sr(super.readable);
    (!a || l) && _ && ((h = new Gn()), (C = ee(C, h))),
      i && (C = ar(C, o, { level: f, chunkSize: e }, s, r)),
      a && (l ? (C = ee(C, new bi(t))) : ((S = new di(t)), (C = ee(C, S)))),
      ir(b, C, () => {
        let u;
        a && !l && (u = S.signature),
          (!a || l) && _ && (u = new DataView(h.value.buffer).getUint32(0)),
          (b.signature = u);
      });
  }
}
class xi extends TransformStream {
  constructor(t, { chunkSize: e, DecompressionStream: r, DecompressionStreamNative: s }) {
    super({});
    const { zipCrypto: i, encrypted: a, signed: o, signature: l, compressed: _, useCompressionStream: f } = t;
    let b,
      h,
      S = sr(super.readable);
    a && (i ? (S = ee(S, new gi(t))) : ((h = new ui(t)), (S = ee(S, h)))),
      _ && (S = ar(S, f, { chunkSize: e }, s, r)),
      (!a || i) && o && ((b = new Gn()), (S = ee(S, b))),
      ir(this, S, () => {
        if ((!a || i) && o) {
          const C = new DataView(b.value.buffer);
          if (l != C.getUint32(0, !1)) throw new Error(gt);
        }
      });
  }
}
function sr(n) {
  return ee(
    n,
    new TransformStream({
      transform(t, e) {
        t && t.length && e.enqueue(t);
      }
    })
  );
}
function ir(n, t, e) {
  (t = ee(t, new TransformStream({ flush: e }))),
    Object.defineProperty(n, "readable", {
      get() {
        return t;
      }
    });
}
function ar(n, t, e, r, s) {
  try {
    const i = t && r ? r : s;
    n = ee(n, new i(En, e));
  } catch {
    if (t)
      try {
        n = ee(n, new s(En, e));
      } catch {
        return n;
      }
    else return n;
  }
  return n;
}
function ee(n, t) {
  return n.pipeThrough(t);
}
const Ei = "message",
  Ti = "start",
  Si = "pull",
  Tn = "data",
  Ri = "ack",
  Sn = "close",
  Ai = "deflate",
  or = "inflate";
class Ci extends TransformStream {
  constructor(t, e) {
    super({});
    const r = this,
      { codecType: s } = t;
    let i;
    s.startsWith(Ai) ? (i = yi) : s.startsWith(or) && (i = xi);
    let a = 0,
      o = 0;
    const l = new i(t, e),
      _ = super.readable,
      f = new TransformStream({
        transform(h, S) {
          h && h.length && ((o += h.length), S.enqueue(h));
        },
        flush() {
          Object.assign(r, { inputSize: o });
        }
      }),
      b = new TransformStream({
        transform(h, S) {
          h && h.length && ((a += h.length), S.enqueue(h));
        },
        flush() {
          const { signature: h } = l;
          Object.assign(r, { signature: h, outputSize: a, inputSize: o });
        }
      });
    Object.defineProperty(r, "readable", {
      get() {
        return _.pipeThrough(f).pipeThrough(l).pipeThrough(b);
      }
    });
  }
}
class Ii extends TransformStream {
  constructor(t) {
    let e;
    super({
      transform: r,
      flush(s) {
        e && e.length && s.enqueue(e);
      }
    });
    function r(s, i) {
      if (e) {
        const a = new Uint8Array(e.length + s.length);
        a.set(e), a.set(s, e.length), (s = a), (e = null);
      }
      s.length > t ? (i.enqueue(s.slice(0, t)), r(s.slice(t), i)) : (e = s);
    }
  }
}
let cr = typeof Worker != de;
class tt {
  constructor(
    t,
    { readable: e, writable: r },
    { options: s, config: i, streamOptions: a, useWebWorkers: o, transferStreams: l, scripts: _ },
    f
  ) {
    const { signal: b } = a;
    return (
      Object.assign(t, {
        busy: !0,
        readable: e.pipeThrough(new Ii(i.chunkSize)).pipeThrough(new Oi(e, a), { signal: b }),
        writable: r,
        options: Object.assign({}, s),
        scripts: _,
        transferStreams: l,
        terminate() {
          return new Promise((h) => {
            const { worker: S, busy: C } = t;
            S ? (C ? (t.resolveTerminated = h) : (S.terminate(), h()), (t.interface = null)) : h();
          });
        },
        onTaskFinished() {
          const { resolveTerminated: h } = t;
          h && ((t.resolveTerminated = null), (t.terminated = !0), t.worker.terminate(), h()), (t.busy = !1), f(t);
        }
      }),
      (o && cr ? ki : lr)(t, i)
    );
  }
}
class Oi extends TransformStream {
  constructor(t, { onstart: e, onprogress: r, size: s, onend: i }) {
    let a = 0;
    super({
      async start() {
        e && (await nt(e, s));
      },
      async transform(o, l) {
        (a += o.length), r && (await nt(r, a, s)), l.enqueue(o);
      },
      async flush() {
        (t.size = a), i && (await nt(i, a));
      }
    });
  }
}
async function nt(n, ...t) {
  try {
    await n(...t);
  } catch {}
}
function lr(n, t) {
  return { run: () => Di(n, t) };
}
function ki(n, t) {
  const { baseURL: e, chunkSize: r } = t;
  if (!n.interface) {
    let s;
    try {
      s = Fi(n.scripts[0], e, n);
    } catch {
      return (cr = !1), lr(n, t);
    }
    Object.assign(n, { worker: s, interface: { run: () => Pi(n, { chunkSize: r }) } });
  }
  return n.interface;
}
async function Di({ options: n, readable: t, writable: e, onTaskFinished: r }, s) {
  try {
    const i = new Ci(n, s);
    await t.pipeThrough(i).pipeTo(e, { preventClose: !0, preventAbort: !0 });
    const { signature: a, inputSize: o, outputSize: l } = i;
    return { signature: a, inputSize: o, outputSize: l };
  } finally {
    r();
  }
}
async function Pi(n, t) {
  let e, r;
  const s = new Promise((h, S) => {
    (e = h), (r = S);
  });
  Object.assign(n, { reader: null, writer: null, resolveResult: e, rejectResult: r, result: s });
  const { readable: i, options: a, scripts: o } = n,
    { writable: l, closed: _ } = vi(n.writable),
    f = Ue({ type: Ti, scripts: o.slice(1), options: a, config: t, readable: i, writable: l }, n);
  f || Object.assign(n, { reader: i.getReader(), writer: l.getWriter() });
  const b = await s;
  return f || (await l.getWriter().close()), await _, b;
}
function vi(n) {
  let t;
  const e = new Promise((s) => (t = s));
  return {
    writable: new WritableStream({
      async write(s) {
        const i = n.getWriter();
        await i.ready, await i.write(s), i.releaseLock();
      },
      close() {
        t();
      },
      abort(s) {
        return n.getWriter().abort(s);
      }
    }),
    closed: e
  };
}
let Rn = !0,
  An = !0;
function Fi(n, t, e) {
  const r = { type: "module" };
  let s, i;
  typeof n == ke && (n = n());
  try {
    s = new URL(n, t);
  } catch {
    s = n;
  }
  if (Rn)
    try {
      i = new Worker(s);
    } catch {
      (Rn = !1), (i = new Worker(s, r));
    }
  else i = new Worker(s, r);
  return i.addEventListener(Ei, (a) => Ni(a, e)), i;
}
function Ue(n, { worker: t, writer: e, onTaskFinished: r, transferStreams: s }) {
  try {
    const { value: i, readable: a, writable: o } = n,
      l = [];
    if (
      (i &&
        (i.byteLength < i.buffer.byteLength ? (n.value = i.buffer.slice(0, i.byteLength)) : (n.value = i.buffer),
        l.push(n.value)),
      s && An ? (a && l.push(a), o && l.push(o)) : (n.readable = n.writable = null),
      l.length)
    )
      try {
        return t.postMessage(n, l), !0;
      } catch {
        (An = !1), (n.readable = n.writable = null), t.postMessage(n);
      }
    else t.postMessage(n);
  } catch (i) {
    throw (e && e.releaseLock(), r(), i);
  }
}
async function Ni({ data: n }, t) {
  const { type: e, value: r, messageId: s, result: i, error: a } = n,
    { reader: o, writer: l, resolveResult: _, rejectResult: f, onTaskFinished: b } = t;
  try {
    if (a) {
      const { message: S, stack: C, code: u, name: c } = a,
        d = new Error(S);
      Object.assign(d, { stack: C, code: u, name: c }), h(d);
    } else {
      if (e == Si) {
        const { value: S, done: C } = await o.read();
        Ue({ type: Tn, value: S, done: C, messageId: s }, t);
      }
      e == Tn && (await l.ready, await l.write(new Uint8Array(r)), Ue({ type: Ri, messageId: s }, t)),
        e == Sn && h(null, i);
    }
  } catch (S) {
    Ue({ type: Sn, messageId: s }, t), h(S);
  }
  function h(S, C) {
    S ? f(S) : _(C), l && l.releaseLock(), b();
  }
}
let fe = [];
const rt = [];
let Cn = 0;
async function Li(n, t) {
  const { options: e, config: r } = t,
    {
      transferStreams: s,
      useWebWorkers: i,
      useCompressionStream: a,
      codecType: o,
      compressed: l,
      signed: _,
      encrypted: f
    } = e,
    { workerScripts: b, maxWorkers: h } = r;
  t.transferStreams = s || s === V;
  const S = !l && !_ && !f && !t.transferStreams;
  return (
    (t.useWebWorkers = !S && (i || (i === V && r.useWebWorkers))),
    (t.scripts = t.useWebWorkers && b ? b[o] : []),
    (e.useCompressionStream = a || (a === V && r.useCompressionStream)),
    (await C()).run()
  );
  async function C() {
    const c = fe.find((d) => !d.busy);
    if (c) return lt(c), new tt(c, n, t, u);
    if (fe.length < h) {
      const d = { indexWorker: Cn };
      return Cn++, fe.push(d), new tt(d, n, t, u);
    } else return new Promise((d) => rt.push({ resolve: d, stream: n, workerOptions: t }));
  }
  function u(c) {
    if (rt.length) {
      const [{ resolve: d, stream: y, workerOptions: g }] = rt.splice(0, 1);
      d(new tt(c, y, g, u));
    } else c.worker ? (lt(c), Mi(c, t)) : (fe = fe.filter((d) => d != c));
  }
}
function Mi(n, t) {
  const { config: e } = t,
    { terminateWorkerTimeout: r } = e;
  Number.isFinite(r) &&
    r >= 0 &&
    (n.terminated
      ? (n.terminated = !1)
      : (n.terminateTimeout = setTimeout(async () => {
          fe = fe.filter((s) => s != n);
          try {
            await n.terminate();
          } catch {}
        }, r)));
}
function lt(n) {
  const { terminateTimeout: t } = n;
  t && (clearTimeout(t), (n.terminateTimeout = null));
}
async function Ui() {
  await Promise.allSettled(fe.map((n) => (lt(n), n.terminate())));
}
const fr = "HTTP error ",
  Pe = "HTTP Range not supported",
  ur = "Writer iterator completed too soon",
  Wi = "text/plain",
  Hi = "Content-Length",
  Bi = "Content-Range",
  ji = "Accept-Ranges",
  qi = "Range",
  Yi = "Content-Type",
  Gi = "HEAD",
  Et = "GET",
  dr = "bytes",
  Vi = 64 * 1024,
  Tt = "writable";
class Ve {
  constructor() {
    this.size = 0;
  }
  init() {
    this.initialized = !0;
  }
}
class _e extends Ve {
  get readable() {
    const t = this,
      { chunkSize: e = Vi } = t,
      r = new ReadableStream({
        start() {
          this.chunkOffset = 0;
        },
        async pull(s) {
          const { offset: i = 0, size: a, diskNumberStart: o } = r,
            { chunkOffset: l } = this;
          s.enqueue(await G(t, i + l, Math.min(e, a - l), o)), l + e > a ? s.close() : (this.chunkOffset += e);
        }
      });
    return r;
  }
}
class St extends Ve {
  constructor() {
    super();
    const t = this,
      e = new WritableStream({
        write(r) {
          return t.writeUint8Array(r);
        }
      });
    Object.defineProperty(t, Tt, {
      get() {
        return e;
      }
    });
  }
  writeUint8Array() {}
}
class Zi extends _e {
  constructor(t) {
    super();
    let e = t.length;
    for (; t.charAt(e - 1) == "="; ) e--;
    const r = t.indexOf(",") + 1;
    Object.assign(this, { dataURI: t, dataStart: r, size: Math.floor((e - r) * 0.75) });
  }
  readUint8Array(t, e) {
    const { dataStart: r, dataURI: s } = this,
      i = new Uint8Array(e),
      a = Math.floor(t / 3) * 4,
      o = atob(s.substring(a + r, Math.ceil((t + e) / 3) * 4 + r)),
      l = t - Math.floor(a / 4) * 3;
    for (let _ = l; _ < l + e; _++) i[_ - l] = o.charCodeAt(_);
    return i;
  }
}
class Ki extends St {
  constructor(t) {
    super(), Object.assign(this, { data: "data:" + (t || "") + ";base64,", pending: [] });
  }
  writeUint8Array(t) {
    const e = this;
    let r = 0,
      s = e.pending;
    const i = e.pending.length;
    for (e.pending = "", r = 0; r < Math.floor((i + t.length) / 3) * 3 - i; r++) s += String.fromCharCode(t[r]);
    for (; r < t.length; r++) e.pending += String.fromCharCode(t[r]);
    s.length > 2 ? (e.data += btoa(s)) : (e.pending = s);
  }
  getData() {
    return this.data + btoa(this.pending);
  }
}
class Rt extends _e {
  constructor(t) {
    super(), Object.assign(this, { blob: t, size: t.size });
  }
  async readUint8Array(t, e) {
    const r = this,
      s = t + e;
    let a = await (t || s < r.size ? r.blob.slice(t, s) : r.blob).arrayBuffer();
    return a.byteLength > e && (a = a.slice(t, s)), new Uint8Array(a);
  }
}
class _r extends Ve {
  constructor(t) {
    super();
    const e = this,
      r = new TransformStream(),
      s = [];
    t && s.push([Yi, t]),
      Object.defineProperty(e, Tt, {
        get() {
          return r.writable;
        }
      }),
      (e.blob = new Response(r.readable, { headers: s }).blob());
  }
  getData() {
    return this.blob;
  }
}
class Xi extends Rt {
  constructor(t) {
    super(new Blob([t], { type: Wi }));
  }
}
class $i extends _r {
  constructor(t) {
    super(t), Object.assign(this, { encoding: t, utf8: !t || t.toLowerCase() == "utf-8" });
  }
  async getData() {
    const { encoding: t, utf8: e } = this,
      r = await super.getData();
    if (r.text && e) return r.text();
    {
      const s = new FileReader();
      return new Promise((i, a) => {
        Object.assign(s, { onload: ({ target: o }) => i(o.result), onerror: () => a(s.error) }), s.readAsText(r, t);
      });
    }
  }
}
class Ji extends _e {
  constructor(t, e) {
    super(), hr(this, t, e);
  }
  async init() {
    await pr(this, ft, In), super.init();
  }
  readUint8Array(t, e) {
    return mr(this, t, e, ft, In);
  }
}
class Qi extends _e {
  constructor(t, e) {
    super(), hr(this, t, e);
  }
  async init() {
    await pr(this, ut, On), super.init();
  }
  readUint8Array(t, e) {
    return mr(this, t, e, ut, On);
  }
}
function hr(n, t, e) {
  const { preventHeadRequest: r, useRangeHeader: s, forceRangeRequests: i, combineSizeEocd: a } = e;
  (e = Object.assign({}, e)),
    delete e.preventHeadRequest,
    delete e.useRangeHeader,
    delete e.forceRangeRequests,
    delete e.combineSizeEocd,
    delete e.useXHR,
    Object.assign(n, {
      url: t,
      options: e,
      preventHeadRequest: r,
      useRangeHeader: s,
      forceRangeRequests: i,
      combineSizeEocd: a
    });
}
async function pr(n, t, e) {
  const { url: r, preventHeadRequest: s, useRangeHeader: i, forceRangeRequests: a, combineSizeEocd: o } = n;
  if (na(r) && (i || a) && (typeof s > "u" || s)) {
    const l = await t(Et, n, wr(n, o ? -22 : void 0));
    if (!a && l.headers.get(ji) != dr) throw new Error(Pe);
    {
      o && (n.eocdCache = new Uint8Array(await l.arrayBuffer()));
      let _;
      const f = l.headers.get(Bi);
      if (f) {
        const b = f.trim().split(/\s*\/\s*/);
        if (b.length) {
          const h = b[1];
          h && h != "*" && (_ = Number(h));
        }
      }
      _ === V ? await kn(n, t, e) : (n.size = _);
    }
  } else await kn(n, t, e);
}
async function mr(n, t, e, r, s) {
  const { useRangeHeader: i, forceRangeRequests: a, eocdCache: o, size: l, options: _ } = n;
  if (i || a) {
    if (o && t == l - ce && e == ce) return o;
    const f = await r(Et, n, wr(n, t, e));
    if (f.status != 206) throw new Error(Pe);
    return new Uint8Array(await f.arrayBuffer());
  } else {
    const { data: f } = n;
    return f || (await s(n, _)), new Uint8Array(n.data.subarray(t, t + e));
  }
}
function wr(n, t = 0, e = 1) {
  return Object.assign({}, At(n), { [qi]: dr + "=" + (t < 0 ? t : t + "-" + (t + e - 1)) });
}
function At({ options: n }) {
  const { headers: t } = n;
  if (t) return Symbol.iterator in t ? Object.fromEntries(t) : t;
}
async function In(n) {
  await gr(n, ft);
}
async function On(n) {
  await gr(n, ut);
}
async function gr(n, t) {
  const e = await t(Et, n, At(n));
  (n.data = new Uint8Array(await e.arrayBuffer())), n.size || (n.size = n.data.length);
}
async function kn(n, t, e) {
  if (n.preventHeadRequest) await e(n, n.options);
  else {
    const s = (await t(Gi, n, At(n))).headers.get(Hi);
    s ? (n.size = Number(s)) : await e(n, n.options);
  }
}
async function ft(n, { options: t, url: e }, r) {
  const s = await fetch(e, Object.assign({}, t, { method: n, headers: r }));
  if (s.status < 400) return s;
  throw s.status == 416 ? new Error(Pe) : new Error(fr + (s.statusText || s.status));
}
function ut(n, { url: t }, e) {
  return new Promise((r, s) => {
    const i = new XMLHttpRequest();
    if (
      (i.addEventListener(
        "load",
        () => {
          if (i.status < 400) {
            const a = [];
            i
              .getAllResponseHeaders()
              .trim()
              .split(/[\r\n]+/)
              .forEach((o) => {
                const l = o.trim().split(/\s*:\s*/);
                (l[0] = l[0].trim().replace(/^[a-z]|-[a-z]/g, (_) => _.toUpperCase())), a.push(l);
              }),
              r({ status: i.status, arrayBuffer: () => i.response, headers: new Map(a) });
          } else s(i.status == 416 ? new Error(Pe) : new Error(fr + (i.statusText || i.status)));
        },
        !1
      ),
      i.addEventListener("error", (a) => s(a.detail ? a.detail.error : new Error("Network error")), !1),
      i.open(n, t),
      e)
    )
      for (const a of Object.entries(e)) i.setRequestHeader(a[0], a[1]);
    (i.responseType = "arraybuffer"), i.send();
  });
}
class br extends _e {
  constructor(t, e = {}) {
    super(), Object.assign(this, { url: t, reader: e.useXHR ? new Qi(t, e) : new Ji(t, e) });
  }
  set size(t) {}
  get size() {
    return this.reader.size;
  }
  async init() {
    await this.reader.init(), super.init();
  }
  readUint8Array(t, e) {
    return this.reader.readUint8Array(t, e);
  }
}
class zi extends br {
  constructor(t, e = {}) {
    (e.useRangeHeader = !0), super(t, e);
  }
}
class ea extends _e {
  constructor(t) {
    super(), Object.assign(this, { array: t, size: t.length });
  }
  readUint8Array(t, e) {
    return this.array.slice(t, t + e);
  }
}
class ta extends St {
  init(t = 0) {
    Object.assign(this, { offset: 0, array: new Uint8Array(t) }), super.init();
  }
  writeUint8Array(t) {
    const e = this;
    if (e.offset + t.length > e.array.length) {
      const r = e.array;
      (e.array = new Uint8Array(r.length + t.length)), e.array.set(r);
    }
    e.array.set(t, e.offset), (e.offset += t.length);
  }
  getData() {
    return this.array;
  }
}
class Ct extends _e {
  constructor(t) {
    super(), (this.readers = t);
  }
  async init() {
    const t = this,
      { readers: e } = t;
    (t.lastDiskNumber = 0),
      (t.lastDiskOffset = 0),
      await Promise.all(
        e.map(async (r, s) => {
          await r.init(), s != e.length - 1 && (t.lastDiskOffset += r.size), (t.size += r.size);
        })
      ),
      super.init();
  }
  async readUint8Array(t, e, r = 0) {
    const s = this,
      { readers: i } = this;
    let a,
      o = r;
    o == -1 && (o = i.length - 1);
    let l = t;
    for (; l >= i[o].size; ) (l -= i[o].size), o++;
    const _ = i[o],
      f = _.size;
    if (l + e <= f) a = await G(_, l, e);
    else {
      const b = f - l;
      (a = new Uint8Array(e)), a.set(await G(_, l, b)), a.set(await s.readUint8Array(t + b, e - b, r), b);
    }
    return (s.lastDiskNumber = Math.max(o, s.lastDiskNumber)), a;
  }
}
class Ye extends Ve {
  constructor(t, e = 4294967295) {
    super();
    const r = this;
    Object.assign(r, { diskNumber: 0, diskOffset: 0, size: 0, maxSize: e, availableSize: e });
    let s, i, a;
    const o = new WritableStream({
      async write(f) {
        const { availableSize: b } = r;
        if (a)
          f.length >= b
            ? (await l(f.slice(0, b)),
              await _(),
              (r.diskOffset += s.size),
              r.diskNumber++,
              (a = null),
              await this.write(f.slice(b)))
            : await l(f);
        else {
          const { value: h, done: S } = await t.next();
          if (S && !h) throw new Error(ur);
          (s = h),
            (s.size = 0),
            s.maxSize && (r.maxSize = s.maxSize),
            (r.availableSize = r.maxSize),
            await Ie(s),
            (i = h.writable),
            (a = i.getWriter()),
            await this.write(f);
        }
      },
      async close() {
        await a.ready, await _();
      }
    });
    Object.defineProperty(r, Tt, {
      get() {
        return o;
      }
    });
    async function l(f) {
      const b = f.length;
      b && (await a.ready, await a.write(f), (s.size += b), (r.size += b), (r.availableSize -= b));
    }
    async function _() {
      (i.size = s.size), await a.close();
    }
  }
}
function na(n) {
  const { baseURL: t } = jn(),
    { protocol: e } = new URL(n, t);
  return e == "http:" || e == "https:";
}
async function Ie(n, t) {
  if (n.init && !n.initialized) await n.init(t);
  else return Promise.resolve();
}
function yr(n) {
  return Array.isArray(n) && (n = new Ct(n)), n instanceof ReadableStream && (n = { readable: n }), n;
}
function xr(n) {
  n.writable === V && typeof n.next == ke && (n = new Ye(n)), n instanceof WritableStream && (n = { writable: n });
  const { writable: t } = n;
  return (
    t.size === V && (t.size = 0),
    n instanceof Ye || Object.assign(n, { diskNumber: 0, diskOffset: 0, availableSize: 1 / 0, maxSize: 1 / 0 }),
    n
  );
}
function G(n, t, e, r) {
  return n.readUint8Array(t, e, r);
}
const ra = Ct,
  sa = Ye,
  Er =
    "\0☺☻♥♦♣♠•◘○◙♂♀♪♫☼►◄↕‼¶§▬↨↑↓→←∟↔▲▼ !\"#$%&'()*+,-./0123456789:;<=>?@ABCDEFGHIJKLMNOPQRSTUVWXYZ[\\]^_`abcdefghijklmnopqrstuvwxyz{|}~⌂ÇüéâäàåçêëèïîìÄÅÉæÆôöòûùÿÖÜ¢£¥₧ƒáíóúñÑªº¿⌐¬½¼¡«»░▒▓│┤╡╢╖╕╣║╗╝╜╛┐└┴┬├─┼╞╟╚╔╩╦╠═╬╧╨╤╥╙╘╒╓╫╪┘┌█▄▌▐▀αßΓπΣσµτΦΘΩδ∞φε∩≡±≥≤⌠⌡÷≈°∙·√ⁿ²■ ".split(
      ""
    ),
  ia = Er.length == 256;
function aa(n) {
  if (ia) {
    let t = "";
    for (let e = 0; e < n.length; e++) t += Er[n[e]];
    return t;
  } else return new TextDecoder().decode(n);
}
function We(n, t) {
  return t && t.trim().toLowerCase() == "cp437" ? aa(n) : new TextDecoder(t).decode(n);
}
const Tr = "filename",
  Sr = "rawFilename",
  Rr = "comment",
  Ar = "rawComment",
  Cr = "uncompressedSize",
  Ir = "compressedSize",
  Or = "offset",
  dt = "diskNumberStart",
  _t = "lastModDate",
  ht = "rawLastModDate",
  kr = "lastAccessDate",
  oa = "rawLastAccessDate",
  Dr = "creationDate",
  ca = "rawCreationDate",
  la = "internalFileAttribute",
  fa = "internalFileAttributes",
  ua = "externalFileAttribute",
  da = "externalFileAttributes",
  _a = "msDosCompatible",
  ha = "zip64",
  pa = "encrypted",
  ma = "version",
  wa = "versionMadeBy",
  ga = "zipCrypto",
  ba = "directory",
  ya = "executable",
  xa = [
    Tr,
    Sr,
    Ir,
    Cr,
    _t,
    ht,
    Rr,
    Ar,
    kr,
    Dr,
    Or,
    dt,
    dt,
    la,
    fa,
    ua,
    da,
    _a,
    ha,
    pa,
    ma,
    wa,
    ga,
    ba,
    ya,
    "bitFlag",
    "signature",
    "filenameUTF8",
    "commentUTF8",
    "compressionMethod",
    "extraField",
    "rawExtraField",
    "extraFieldZip64",
    "extraFieldUnicodePath",
    "extraFieldUnicodeComment",
    "extraFieldAES",
    "extraFieldNTFS",
    "extraFieldExtendedTimestamp"
  ];
class Dn {
  constructor(t) {
    xa.forEach((e) => (this[e] = t[e]));
  }
}
const He = "File format is not recognized",
  Pr = "End of central directory not found",
  vr = "End of Zip64 central directory locator not found",
  Fr = "Central directory header not found",
  Nr = "Local file header not found",
  Lr = "Zip64 extra field not found",
  Mr = "File contains encrypted entry",
  Ur = "Encryption method not supported",
  pt = "Compression method not supported",
  mt = "Split zip file",
  Pn = "utf-8",
  vn = "cp437",
  Ea = [
    [Cr, me],
    [Ir, me],
    [Or, me],
    [dt, oe]
  ],
  Ta = { [oe]: { getValue: B, bytes: 4 }, [me]: { getValue: Be, bytes: 8 } };
class Wr {
  constructor(t, e = {}) {
    Object.assign(this, { reader: yr(t), options: e, config: jn() });
  }
  async *getEntriesGenerator(t = {}) {
    const e = this;
    let { reader: r } = e;
    const { config: s } = e;
    if (
      (await Ie(r),
      (r.size === V || !r.readUint8Array) && ((r = new Rt(await new Response(r.readable).blob())), await Ie(r)),
      r.size < ce)
    )
      throw new Error(He);
    r.chunkSize = Js(s);
    const i = await ka(r, Us, r.size, ce, oe * 16);
    if (!i) {
      const x = await G(r, 0, 4),
        w = q(x);
      throw B(w) == Ms ? new Error(mt) : new Error(Pr);
    }
    const a = q(i);
    let o = B(a, 12),
      l = B(a, 16);
    const _ = i.offset,
      f = j(a, 20),
      b = _ + ce + f;
    let h = j(a, 4);
    const S = r.lastDiskNumber || 0;
    let C = j(a, 6),
      u = j(a, 8),
      c = 0,
      d = 0;
    if (l == me || o == me || u == oe || C == oe) {
      const x = await G(r, i.offset - ze, ze),
        w = q(x);
      if (B(w, 0) == Ws) {
        l = Be(w, 8);
        let O = await G(r, l, et, -1),
          I = q(O);
        const v = i.offset - ze - et;
        if (B(I, 0) != cn && l != v) {
          const k = l;
          (l = v), (c = l - k), (O = await G(r, l, et, -1)), (I = q(O));
        }
        if (B(I, 0) != cn) throw new Error(vr);
        h == oe && (h = B(I, 16)),
          C == oe && (C = B(I, 20)),
          u == oe && (u = Be(I, 32)),
          o == me && (o = Be(I, 40)),
          (l -= o);
      }
    }
    if ((l >= r.size && ((c = r.size - l - o - ce), (l = r.size - o - ce)), S != h)) throw new Error(mt);
    if (l < 0) throw new Error(He);
    let y = 0,
      g = await G(r, l, o, C),
      m = q(g);
    if (o) {
      const x = i.offset - o;
      if (B(m, y) != on && l != x) {
        const w = l;
        (l = x), (c += l - w), (g = await G(r, l, o, C)), (m = q(g));
      }
    }
    const E = i.offset - l - (r.lastDiskOffset || 0);
    if ((o != E && E >= 0 && ((o = E), (g = await G(r, l, o, C)), (m = q(g))), l < 0 || l >= r.size))
      throw new Error(He);
    const p = Z(e, t, "filenameEncoding"),
      R = Z(e, t, "commentEncoding");
    for (let x = 0; x < u; x++) {
      const w = new Ra(r, s, e.options);
      if (B(m, y) != on) throw new Error(Fr);
      Hr(w, m, y + 6);
      const O = !!w.bitFlag.languageEncodingFlag,
        I = y + 46,
        v = I + w.filenameLength,
        k = v + w.extraFieldLength,
        D = j(m, y + 4),
        U = D >> 8 == 0,
        F = D >> 8 == 3,
        Y = g.subarray(I, v),
        P = j(m, y + 32),
        he = k + P,
        M = g.subarray(k, he),
        W = O,
        It = O,
        Ze = B(m, y + 38),
        Ot =
          (U && (xe(m, y + 38) & dn) == dn) ||
          (F && ((Ze >> 16) & _n) == _n) ||
          (Y.length && Y[Y.length - 1] == pn.charCodeAt(0)),
        qr = F && ((Ze >> 16) & hn) == hn,
        kt = B(m, y + 42) + c;
      Object.assign(w, {
        versionMadeBy: D,
        msDosCompatible: U,
        compressedSize: 0,
        uncompressedSize: 0,
        commentLength: P,
        directory: Ot,
        offset: kt,
        diskNumberStart: j(m, y + 34),
        internalFileAttributes: j(m, y + 36),
        externalFileAttributes: Ze,
        rawFilename: Y,
        filenameUTF8: W,
        commentUTF8: It,
        rawExtraField: g.subarray(v, k),
        executable: qr
      }),
        (w.internalFileAttribute = w.internalFileAttributes),
        (w.externalFileAttribute = w.externalFileAttributes);
      const Dt = Z(e, t, "decodeText") || We,
        Pt = W ? Pn : p || vn,
        vt = It ? Pn : R || vn;
      let ve = Dt(Y, Pt);
      ve === V && (ve = We(Y, Pt));
      let Ke = Dt(M, vt);
      Ke === V && (Ke = We(M, vt)),
        Object.assign(w, { rawComment: M, filename: ve, comment: Ke, directory: Ot || ve.endsWith(pn) }),
        (d = Math.max(kt, d)),
        Br(w, w, m, y + 6),
        (w.zipCrypto = w.encrypted && !w.extraFieldAES);
      const Xe = new Dn(w);
      (Xe.getData = (Nt, Yr) => w.getData(Nt, Xe, Yr)), (y = he);
      const { onprogress: Ft } = t;
      if (Ft)
        try {
          await Ft(x + 1, u, new Dn(w));
        } catch {}
      yield Xe;
    }
    const T = Z(e, t, "extractPrependedData"),
      A = Z(e, t, "extractAppendedData");
    return (
      T && (e.prependedData = d > 0 ? await G(r, 0, d) : new Uint8Array()),
      (e.comment = f ? await G(r, _ + ce, f) : new Uint8Array()),
      A && (e.appendedData = b < r.size ? await G(r, b, r.size - b) : new Uint8Array()),
      !0
    );
  }
  async getEntries(t = {}) {
    const e = [];
    for await (const r of this.getEntriesGenerator(t)) e.push(r);
    return e;
  }
  async close() {}
}
class Sa {
  constructor(t = {}) {
    const { readable: e, writable: r } = new TransformStream(),
      s = new Wr(e, t).getEntriesGenerator();
    (this.readable = new ReadableStream({
      async pull(i) {
        const { done: a, value: o } = await s.next();
        if (a) return i.close();
        const l = {
          ...o,
          readable: (function () {
            const { readable: _, writable: f } = new TransformStream();
            if (o.getData) return o.getData(f), _;
          })()
        };
        delete l.getData, i.enqueue(l);
      }
    })),
      (this.writable = r);
  }
}
class Ra {
  constructor(t, e, r) {
    Object.assign(this, { reader: t, config: e, options: r });
  }
  async getData(t, e, r = {}) {
    const s = this,
      {
        reader: i,
        offset: a,
        diskNumberStart: o,
        extraFieldAES: l,
        compressionMethod: _,
        config: f,
        bitFlag: b,
        signature: h,
        rawLastModDate: S,
        uncompressedSize: C,
        compressedSize: u
      } = s,
      c = (e.localDirectory = {}),
      d = await G(i, a, 30, o),
      y = q(d);
    let g = Z(s, r, "password"),
      m = Z(s, r, "rawPassword");
    const E = Z(s, r, "passThrough");
    if (((g = g && g.length && g), (m = m && m.length && m), l && l.originalCompressionMethod != Ns))
      throw new Error(pt);
    if (_ != Fs && _ != vs && !E) throw new Error(pt);
    if (B(y, 0) != Ls) throw new Error(Nr);
    Hr(c, y, 4),
      (c.rawExtraField = c.extraFieldLength
        ? await G(i, a + 30 + c.filenameLength, c.extraFieldLength, o)
        : new Uint8Array()),
      Br(s, c, y, 4, !0),
      Object.assign(e, { lastAccessDate: c.lastAccessDate, creationDate: c.creationDate });
    const p = s.encrypted && c.encrypted && !E,
      R = p && !l;
    if ((E || (e.zipCrypto = R), p)) {
      if (!R && l.strength === V) throw new Error(Ur);
      if (!g && !m) throw new Error(Mr);
    }
    const T = a + 30 + c.filenameLength + c.extraFieldLength,
      A = u,
      x = i.readable;
    Object.assign(x, { diskNumberStart: o, offset: T, size: A });
    const w = Z(s, r, "signal"),
      O = Z(s, r, "checkPasswordOnly");
    O && (t = new WritableStream()), (t = xr(t)), await Ie(t, E ? u : C);
    const { writable: I } = t,
      { onstart: v, onprogress: k, onend: D } = r,
      U = {
        options: {
          codecType: or,
          password: g,
          rawPassword: m,
          zipCrypto: R,
          encryptionStrength: l && l.strength,
          signed: Z(s, r, "checkSignature") && !E,
          passwordVerification: R && (b.dataDescriptor ? (S >>> 8) & 255 : (h >>> 24) & 255),
          signature: h,
          compressed: _ != 0 && !E,
          encrypted: s.encrypted && !E,
          useWebWorkers: Z(s, r, "useWebWorkers"),
          useCompressionStream: Z(s, r, "useCompressionStream"),
          transferStreams: Z(s, r, "transferStreams"),
          checkPasswordOnly: O
        },
        config: f,
        streamOptions: { signal: w, size: A, onstart: v, onprogress: k, onend: D }
      };
    let F = 0;
    try {
      ({ outputSize: F } = await Li({ readable: x, writable: I }, U));
    } catch (Y) {
      if (!O || Y.message != bt) throw Y;
    } finally {
      const Y = Z(s, r, "preventClose");
      (I.size += F), !Y && !I.locked && (await I.getWriter().close());
    }
    return O ? V : t.getData ? t.getData() : I;
  }
}
function Hr(n, t, e) {
  const r = (n.rawBitFlag = j(t, e + 2)),
    s = (r & ln) == ln,
    i = B(t, e + 6);
  Object.assign(n, {
    encrypted: s,
    version: j(t, e),
    bitFlag: { level: (r & Ks) >> 1, dataDescriptor: (r & fn) == fn, languageEncodingFlag: (r & un) == un },
    rawLastModDate: i,
    lastModDate: Da(i),
    filenameLength: j(t, e + 22),
    extraFieldLength: j(t, e + 24)
  });
}
function Br(n, t, e, r, s) {
  const { rawExtraField: i } = t,
    a = (t.extraField = new Map()),
    o = q(new Uint8Array(i));
  let l = 0;
  try {
    for (; l < i.length; ) {
      const d = j(o, l),
        y = j(o, l + 2);
      a.set(d, { type: d, data: i.slice(l + 4, l + 4 + y) }), (l += 4 + y);
    }
  } catch {}
  const _ = j(e, r + 4);
  Object.assign(t, { signature: B(e, r + 10), uncompressedSize: B(e, r + 18), compressedSize: B(e, r + 14) });
  const f = a.get(Hs);
  f && (Aa(f, t), (t.extraFieldZip64 = f));
  const b = a.get(Gs);
  b && (Fn(b, Tr, Sr, t, n), (t.extraFieldUnicodePath = b));
  const h = a.get(Vs);
  h && (Fn(h, Rr, Ar, t, n), (t.extraFieldUnicodeComment = h));
  const S = a.get(Bs);
  S ? (Ca(S, t, _), (t.extraFieldAES = S)) : (t.compressionMethod = _);
  const C = a.get(js);
  C && (Ia(C, t), (t.extraFieldNTFS = C));
  const u = a.get(Ys);
  u && (Oa(u, t, s), (t.extraFieldExtendedTimestamp = u));
  const c = a.get(Zs);
  c && (t.extraFieldUSDZ = c);
}
function Aa(n, t) {
  t.zip64 = !0;
  const e = q(n.data),
    r = Ea.filter(([s, i]) => t[s] == i);
  for (let s = 0, i = 0; s < r.length; s++) {
    const [a, o] = r[s];
    if (t[a] == o) {
      const l = Ta[o];
      (t[a] = n[a] = l.getValue(e, i)), (i += l.bytes);
    } else if (n[a]) throw new Error(Lr);
  }
}
function Fn(n, t, e, r, s) {
  const i = q(n.data),
    a = new je();
  a.append(s[e]);
  const o = q(new Uint8Array(4));
  o.setUint32(0, a.get(), !0);
  const l = B(i, 1);
  Object.assign(n, {
    version: xe(i, 0),
    [t]: We(n.data.subarray(5)),
    valid: !s.bitFlag.languageEncodingFlag && l == B(o, 0)
  }),
    n.valid && ((r[t] = n[t]), (r[t + "UTF8"] = !0));
}
function Ca(n, t, e) {
  const r = q(n.data),
    s = xe(r, 4);
  Object.assign(n, {
    vendorVersion: xe(r, 0),
    vendorId: xe(r, 2),
    strength: s,
    originalCompressionMethod: e,
    compressionMethod: j(r, 5)
  }),
    (t.compressionMethod = n.compressionMethod);
}
function Ia(n, t) {
  const e = q(n.data);
  let r = 4,
    s;
  try {
    for (; r < n.data.length && !s; ) {
      const i = j(e, r),
        a = j(e, r + 2);
      i == qs && (s = n.data.slice(r + 4, r + 4 + a)), (r += 4 + a);
    }
  } catch {}
  try {
    if (s && s.length == 24) {
      const i = q(s),
        a = i.getBigUint64(0, !0),
        o = i.getBigUint64(8, !0),
        l = i.getBigUint64(16, !0);
      Object.assign(n, { rawLastModDate: a, rawLastAccessDate: o, rawCreationDate: l });
      const _ = st(a),
        f = st(o),
        b = st(l),
        h = { lastModDate: _, lastAccessDate: f, creationDate: b };
      Object.assign(n, h), Object.assign(t, h);
    }
  } catch {}
}
function Oa(n, t, e) {
  const r = q(n.data),
    s = xe(r, 0),
    i = [],
    a = [];
  e
    ? ((s & 1) == 1 && (i.push(_t), a.push(ht)),
      (s & 2) == 2 && (i.push(kr), a.push(oa)),
      (s & 4) == 4 && (i.push(Dr), a.push(ca)))
    : n.data.length >= 5 && (i.push(_t), a.push(ht));
  let o = 1;
  i.forEach((l, _) => {
    if (n.data.length >= o + 4) {
      const f = B(r, o);
      t[l] = n[l] = new Date(f * 1e3);
      const b = a[_];
      n[b] = f;
    }
    o += 4;
  });
}
async function ka(n, t, e, r, s) {
  const i = new Uint8Array(4),
    a = q(i);
  Pa(a, 0, t);
  const o = r + s;
  return (await l(r)) || (await l(Math.min(o, e)));
  async function l(_) {
    const f = e - _,
      b = await G(n, f, _);
    for (let h = b.length - r; h >= 0; h--)
      if (b[h] == i[0] && b[h + 1] == i[1] && b[h + 2] == i[2] && b[h + 3] == i[3])
        return { offset: f + h, buffer: b.slice(h, h + r).buffer };
  }
}
function Z(n, t, e) {
  return t[e] === V ? n.options[e] : t[e];
}
function Da(n) {
  const t = (n & 4294901760) >> 16,
    e = n & 65535;
  try {
    return new Date(
      1980 + ((t & 65024) >> 9),
      ((t & 480) >> 5) - 1,
      t & 31,
      (e & 63488) >> 11,
      (e & 2016) >> 5,
      (e & 31) * 2,
      0
    );
  } catch {}
}
function st(n) {
  return new Date(Number(n / BigInt(1e4) - BigInt(116444736e5)));
}
function xe(n, t) {
  return n.getUint8(t);
}
function j(n, t) {
  return n.getUint16(t, !0);
}
function B(n, t) {
  return n.getUint32(t, !0);
}
function Be(n, t) {
  return Number(n.getBigUint64(t, !0));
}
function Pa(n, t, e) {
  n.setUint32(t, e, !0);
}
function q(n) {
  return new DataView(n.buffer);
}
qn({ Inflate: Ps });
const va = Object.freeze(
    Object.defineProperty(
      {
        __proto__: null,
        BlobReader: Rt,
        BlobWriter: _r,
        Data64URIReader: Zi,
        Data64URIWriter: Ki,
        ERR_BAD_FORMAT: He,
        ERR_CENTRAL_DIRECTORY_NOT_FOUND: Fr,
        ERR_ENCRYPTED: Mr,
        ERR_EOCDR_LOCATOR_ZIP64_NOT_FOUND: vr,
        ERR_EOCDR_NOT_FOUND: Pr,
        ERR_EXTRAFIELD_ZIP64_NOT_FOUND: Lr,
        ERR_HTTP_RANGE: Pe,
        ERR_INVALID_PASSWORD: wt,
        ERR_INVALID_SIGNATURE: gt,
        ERR_ITERATOR_COMPLETED_TOO_SOON: ur,
        ERR_LOCAL_FILE_HEADER_NOT_FOUND: Nr,
        ERR_SPLIT_ZIP_FILE: mt,
        ERR_UNSUPPORTED_COMPRESSION: pt,
        ERR_UNSUPPORTED_ENCRYPTION: Ur,
        HttpRangeReader: zi,
        HttpReader: br,
        Reader: _e,
        SplitDataReader: Ct,
        SplitDataWriter: Ye,
        SplitZipReader: ra,
        SplitZipWriter: sa,
        TextReader: Xi,
        TextWriter: $i,
        Uint8ArrayReader: ea,
        Uint8ArrayWriter: ta,
        Writer: St,
        ZipReader: Wr,
        ZipReaderStream: Sa,
        configure: qn,
        getMimeType: Qs,
        initReader: yr,
        initStream: Ie,
        initWriter: xr,
        readUint8Array: G,
        terminateWorkers: Ui
      },
      Symbol.toStringTag,
      { value: "Module" }
    )
  ),
  Se = va;
class Fa {
  constructor(t, e, r) {
    N(this, "_zipReader");
    N(this, "_entriesPromise");
    N(this, "_traceURL");
    (this._traceURL = t),
      Se.configure({ baseURL: self.location.href }),
      (this._zipReader = new Se.ZipReader(new Se.HttpReader(La(t, e), { mode: "cors", preventHeadRequest: !0 }), {
        useWebWorkers: !1
      })),
      (this._entriesPromise = this._zipReader.getEntries({ onprogress: r }).then((s) => {
        const i = new Map();
        for (const a of s) i.set(a.filename, a);
        return i;
      }));
  }
  isLive() {
    return !1;
  }
  traceURL() {
    return this._traceURL;
  }
  async entryNames() {
    return [...(await this._entriesPromise).keys()];
  }
  async hasEntry(t) {
    return (await this._entriesPromise).has(t);
  }
  async readText(t) {
    var i;
    const r = (await this._entriesPromise).get(t);
    if (!r) return;
    const s = new Se.TextWriter();
    return await ((i = r.getData) == null ? void 0 : i.call(r, s)), s.getData();
  }
  async readBlob(t) {
    const r = (await this._entriesPromise).get(t);
    if (!r) return;
    const s = new Se.BlobWriter();
    return await r.getData(s), s.getData();
  }
}
class Na {
  constructor(t, e) {
    N(this, "_entriesPromise");
    N(this, "_path");
    N(this, "_server");
    (this._path = t),
      (this._server = e),
      (this._entriesPromise = e.readFile(t).then(async (r) => {
        if (!r) throw new Error("File not found");
        const s = await r.json(),
          i = new Map();
        for (const a of s.entries) i.set(a.name, a.path);
        return i;
      }));
  }
  isLive() {
    return !0;
  }
  traceURL() {
    return this._path;
  }
  async entryNames() {
    return [...(await this._entriesPromise).keys()];
  }
  async hasEntry(t) {
    return (await this._entriesPromise).has(t);
  }
  async readText(t) {
    const e = await this._readEntry(t);
    return e == null ? void 0 : e.text();
  }
  async readBlob(t) {
    const e = await this._readEntry(t);
    return (e == null ? void 0 : e.status) === 200 ? await (e == null ? void 0 : e.blob()) : void 0;
  }
  async _readEntry(t) {
    const r = (await this._entriesPromise).get(t);
    if (r) return this._server.readFile(r);
  }
}
function La(n, t) {
  let e = n.startsWith("http") || n.startsWith("blob") ? n : t.getFileURL(n).toString();
  return e.startsWith("https://www.dropbox.com/") && (e = "https://dl.dropboxusercontent.com/" + e.substring(24)), e;
}
class Ma {
  constructor(t) {
    this.baseUrl = t;
  }
  getFileURL(t) {
    const e = new URL("trace/file", this.baseUrl);
    return e.searchParams.set("path", t), e;
  }
  async readFile(t) {
    const e = await fetch(this.getFileURL(t));
    if (e.status !== 404) return e;
  }
}
self.addEventListener("install", function (n) {
  self.skipWaiting();
});
self.addEventListener("activate", function (n) {
  n.waitUntil(self.clients.claim());
});
const Ua = new URL(self.registration.scope).pathname,
  ue = new Map(),
  Oe = new Map();
async function Wa(n, t, e, r, s) {
  var _;
  await jr();
  const i = (e == null ? void 0 : e.id) ?? "";
  let a = Oe.get(i);
  if (!a) {
    const f = new URL((e == null ? void 0 : e.url) ?? self.registration.scope),
      b = new URL(f.searchParams.get("server") ?? "../", f);
    (a = { limit: r, traceUrls: new Set(), traceViewerServer: new Ma(b) }), Oe.set(i, a);
  }
  a.traceUrls.add(n);
  const o = new us();
  try {
    const [f, b] = Zr(s, [0.5, 0.4, 0.1]),
      h = n.endsWith("json") ? new Na(n, a.traceViewerServer) : new Fa(n, a.traceViewerServer, f);
    await o.load(h, b);
  } catch (f) {
    throw (
      (console.error(f),
      (_ = f == null ? void 0 : f.message) != null &&
      _.includes("Cannot find .trace file") &&
      (await o.hasEntry("index.html"))
        ? new Error(
            "Could not load trace. Did you upload a Playwright HTML report instead? Make sure to extract the archive first and then double-click the index.html file or put it on a web server."
          )
        : f instanceof Un
          ? new Error(`Could not load trace from ${t || n}. ${f.message}`)
          : t
            ? new Error(`Could not load trace from ${t}. Make sure to upload a valid Playwright trace.`)
            : new Error(
                `Could not load trace from ${n}. Make sure a valid Playwright Trace is accessible over this url.`
              ))
    );
  }
  const l = new is(o.storage(), (f) => o.resourceForSha1(f));
  return ue.set(n, { traceModel: o, snapshotServer: l }), o;
}
async function Ha(n) {
  var l;
  if (n.request.url.startsWith("chrome-extension://")) return fetch(n.request);
  if (n.request.headers.get("x-pw-serviceworker") === "forward") {
    const _ = new Request(n.request);
    return _.headers.delete("x-pw-serviceworker"), fetch(_);
  }
  const t = n.request,
    e = await self.clients.get(n.clientId),
    r = self.registration.scope.startsWith("https://");
  if (t.url.startsWith(self.registration.scope)) {
    const _ = new URL(at(t.url)),
      f = _.pathname.substring(Ua.length - 1);
    if (f === "/ping") return await jr(), new Response(null, { status: 200 });
    const b = _.searchParams.get("trace");
    if (f === "/contexts")
      try {
        const h = _.searchParams.has("limit") ? +_.searchParams.get("limit") : void 0,
          S = await Wa(b, _.searchParams.get("traceFileName"), e, h, (C, u) => {
            e.postMessage({ method: "progress", params: { done: C, total: u } });
          });
        return new Response(JSON.stringify(S.contextEntries), {
          status: 200,
          headers: { "Content-Type": "application/json" }
        });
      } catch (h) {
        return new Response(JSON.stringify({ error: h == null ? void 0 : h.message }), {
          status: 500,
          headers: { "Content-Type": "application/json" }
        });
      }
    if (f.startsWith("/snapshotInfo/")) {
      const { snapshotServer: h } = ue.get(b) || {};
      if (!h) return new Response(null, { status: 404 });
      const S = f.substring(14);
      return h.serveSnapshotInfo(S, _.searchParams);
    }
    if (f.startsWith("/snapshot/")) {
      const { snapshotServer: h } = ue.get(b) || {};
      if (!h) return new Response(null, { status: 404 });
      const S = f.substring(10),
        C = h.serveSnapshot(S, _.searchParams, _.href);
      return r && C.headers.set("Content-Security-Policy", "upgrade-insecure-requests"), C;
    }
    if (f.startsWith("/closest-screenshot/")) {
      const { snapshotServer: h } = ue.get(b) || {};
      if (!h) return new Response(null, { status: 404 });
      const S = f.substring(20);
      return h.serveClosestScreenshot(S, _.searchParams);
    }
    if (f.startsWith("/sha1/")) {
      const h = f.slice(6);
      for (const S of ue.values()) {
        const C = await S.traceModel.resourceForSha1(h);
        if (C) return new Response(C, { status: 200, headers: Ba(_.searchParams) });
      }
      return new Response(null, { status: 404 });
    }
    if (f.startsWith("/file/")) {
      const h = _.searchParams.get("path"),
        S = (l = Oe.get(n.clientId ?? "")) == null ? void 0 : l.traceViewerServer;
      if (!S) throw new Error("client is not initialized");
      const C = await S.readFile(h);
      return C || new Response(null, { status: 404 });
    }
    return fetch(n.request);
  }
  const s = at(e.url),
    i = new URL(s).searchParams.get("trace"),
    { snapshotServer: a } = ue.get(i) || {};
  if (!a) return new Response(null, { status: 404 });
  const o = [t.url];
  return r && t.url.startsWith("https://") && o.push(t.url.replace(/^https/, "http")), a.serveResource(o, t.method, s);
}
function Ba(n) {
  const t = n.get("dn"),
    e = n.get("dct");
  if (!t) return;
  const r = new Headers();
  return (
    r.set("Content-Disposition", `attachment; filename="attachment"; filename*=UTF-8''${encodeURIComponent(t)}`),
    e && r.set("Content-Type", e),
    r
  );
}
async function jr() {
  const n = await self.clients.matchAll(),
    t = new Set();
  for (const [e, r] of Oe) {
    if (!n.find((s) => s.id === e)) {
      Oe.delete(e);
      continue;
    }
    if (r.limit !== void 0) {
      const s = [...r.traceUrls];
      r.traceUrls = new Set(s.slice(s.length - r.limit));
    }
    r.traceUrls.forEach((s) => t.add(s));
  }
  for (const e of ue.keys()) t.has(e) || ue.delete(e);
}
self.addEventListener("fetch", function (n) {
  n.respondWith(Ha(n));
});
