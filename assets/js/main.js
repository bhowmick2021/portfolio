(function () {
  'use strict';
  document.documentElement.classList.add('js');
  var store = { get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
                set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} } };

  /* mobile nav */
  var tg = document.querySelector('.nav-toggle'), nl = document.getElementById('primary-nav');
  if (tg && nl) {
    tg.addEventListener('click', function () { tg.setAttribute('aria-expanded', nl.classList.toggle('open')); });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nl.classList.contains('open')) { nl.classList.remove('open'); tg.setAttribute('aria-expanded', 'false'); tg.focus(); }
    });
  }

  /* audience: remember last audience page; carry it onto case links as ?for= */
  var aud = document.body.getAttribute('data-aud');
  if (aud) store.set('aud', aud);
  var cur = new URLSearchParams(location.search).get('for') || aud || store.get('aud');
  if (cur) document.querySelectorAll('a[data-case]').forEach(function (a) {
    try {
      var u = new URL(a.getAttribute('href'), location.href);
      if (!u.searchParams.has('for')) { u.searchParams.set('for', cur); a.href = u.href; }
    } catch (e) {}
  });

  /* case page: highlight and open the lens for the current audience */
  if (cur) {
    var lens = document.querySelector('.lens[data-aud="' + cur + '"]');
    if (lens) { lens.classList.add('active'); lens.open = true; }
  }

  /* reveal on scroll */
  var rv = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !matchMedia('(prefers-reduced-motion: reduce)').matches) {
    var io = new IntersectionObserver(function (es) {
      es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
    }, { threshold: .12 });
    rv.forEach(function (n) { io.observe(n); });
  } else { rv.forEach(function (n) { n.classList.add('in'); }); }

  /* project-library cards: the selected card stays in place; its details open as a full-width panel after that card's row (no scrolling, focus stays on the card button) */
  function libInit(grid) {
    var items = [].slice.call(grid.querySelectorAll('.lib-item')), cur = null;
    items.forEach(function (it) {
      it.dataset.s = (it.querySelector('.lib-sum').textContent + ' ' + [].map.call(it.querySelectorAll('.lib-panel p'), function (x) { return x.textContent; }).join(' ')).toLowerCase();
      var panel = it.querySelector('.lib-panel'), sum = it.querySelector('.lib-sum'); panel.hidden = true;
      sum.addEventListener('click', function () { cur === it ? close() : open(it); });
      it.querySelector('.lib-close').addEventListener('click', function () { close(); sum.focus(); });
      panel.addEventListener('keydown', function (e) { if (e.key === 'Escape') { close(); sum.focus(); } });
    });
    function place() {
      if (!cur) return;
      var panel = grid.querySelector('.lib-panel[data-for="' + cur.id + '"]') || cur.querySelector('.lib-panel');
      panel.hidden = true; cur.appendChild(panel);            /* measure rows without the panel splitting them */
      var vis = items.filter(function (i) { return !i.hidden; }), top = cur.offsetTop, last = cur;
      vis.forEach(function (i) { if (Math.abs(i.offsetTop - top) < 3) last = i; });
      grid.insertBefore(panel, last.nextSibling); panel.hidden = false;
    }
    function open(it) {
      if (cur) close();
      cur = it; var panel = it.querySelector('.lib-panel'); panel.dataset.for = it.id = it.id || 'lib-' + items.indexOf(it);
      it.querySelector('.lib-sum').setAttribute('aria-expanded', 'true'); it.classList.add('sel'); panel.hidden = false; place();
    }
    function close() {
      if (!cur) return;
      var panel = grid.querySelector('.lib-panel[data-for="' + cur.id + '"]') || cur.querySelector('.lib-panel');
      panel.hidden = true; cur.appendChild(panel);
      cur.querySelector('.lib-sum').setAttribute('aria-expanded', 'false'); cur.classList.remove('sel'); cur = null;
    }
    function refresh() { if (cur && cur.hidden) close(); else place(); }
    grid.addEventListener('keydown', function (e) { if (e.key === 'Escape' && cur) { var b = cur.querySelector('.lib-sum'); close(); b.focus(); } });
    var gw = grid.clientWidth, onW = function () { if (grid.clientWidth !== gw) { gw = grid.clientWidth; place(); } };   /* re-place only when the column count can change, so opening never re-flows the page */
    if ('ResizeObserver' in window) new ResizeObserver(onW).observe(grid); else addEventListener('resize', onW);
    return { refresh: refresh };
  }
  document.querySelectorAll('.lib').forEach(function (g) { if (g.id !== 'lib') libInit(g); });

  /* library search + filter */
  var lib = document.getElementById('lib');
  if (lib) {
    var libCtl = libInit(lib), items = [].slice.call(lib.querySelectorAll('.lib-item'));
    var q = document.getElementById('lib-q'), count = document.getElementById('lib-count');
    var state = { aud: 'all', tag: 'all' };
    var apply = function () {
      var term = (q.value || '').toLowerCase().trim(), n = 0;
      items.forEach(function (it) {
        var ok = (state.aud === 'all' || it.dataset.aud.split(' ').indexOf(state.aud) > -1) &&
                 (state.tag === 'all' || it.dataset.tags.split(' ').indexOf(state.tag) > -1) &&
                 (!term || it.dataset.s.indexOf(term) > -1);
        it.hidden = !ok; if (ok) n++;
      });
      count.textContent = n + ' of ' + items.length + ' projects shown'; libCtl.refresh();
    };
    document.querySelectorAll('.chips').forEach(function (grp) {
      grp.addEventListener('click', function (e) {
        var b = e.target.closest('button.chip'); if (!b) return;
        grp.querySelectorAll('.chip').forEach(function (c) { c.setAttribute('aria-pressed', c === b); });
        state[grp.dataset.kind] = b.dataset.v; apply();
      });
    });
    q.addEventListener('input', apply);
    var pre = new URLSearchParams(location.search).get('for');
    if (pre) { var pb = document.querySelector('.chips[data-kind="aud"] [data-v="' + pre + '"]'); if (pb) pb.click(); }
    apply();
  }
})();

/* skills capability map: SVG connectors, one-at-a-time light, tooltips (cards never move) */
(function () {
  'use strict';
  var m = document.querySelector('[data-map]'); if (!m) return;
  var NS = 'http://www.w3.org/2000/svg', svg = m.querySelector('.uni-links');
  var core = m.querySelector('[data-node="core"]'), groups = [].slice.call(m.querySelectorAll('.gcard'));
  var btn = document.querySelector('.uni-pp'), reduce = matchMedia('(prefers-reduced-motion: reduce)');
  var TRAVEL = 1500, HOLD = 2800, TRAIL = 6, links = [], light, trail = [], activeIdx = -1, activeGroupOn = false;
  var st = { user: false, hold: false, visible: true, elapsed: 0, last: 0, raf: 0 };

  function rel(el) { var r = el.getBoundingClientRect(), b = m.getBoundingClientRect();
    return { l: r.left - b.left, t: r.top - b.top, w: r.width, h: r.height, r: r.right - b.left, b: r.bottom - b.top, cx: r.left - b.left + r.width / 2 }; }
  function gcls(n) { return (n.className.match(/\bg[1-5]\b/) || [''])[0]; }
  function mk(tag, cls) { var e = document.createElementNS(NS, tag); if (cls) e.setAttribute('class', cls); svg.appendChild(e); return e; }

  function build() {
    while (svg.firstChild) svg.removeChild(svg.firstChild);
    links = []; trail = []; activeIdx = -1; activeGroupOn = false;
    var W = m.clientWidth, H = m.clientHeight, C = rel(core), stacked = C.w > W * 0.9;
    svg.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    if (stacked) {
      var seq = [core].concat(groups);
      for (var i = 1; i < seq.length; i++) { var a = rel(seq[i - 1]), b = rel(seq[i]);
        links.push({ node: seq[i], d: 'M' + a.cx + ' ' + a.b + ' L' + b.cx + ' ' + b.t, cls: gcls(seq[i]) }); }
    } else {
      groups.forEach(function (g) { var G = rel(g), d;
        if (G.b <= C.t + 2) { var sx = C.l + C.w * (0.5 + Math.max(-0.3, Math.min(0.3, (G.cx - C.cx) / W * 1.4))), my = (C.t + G.b) / 2;
          d = 'M' + sx + ' ' + C.t + ' C' + sx + ' ' + my + ',' + G.cx + ' ' + my + ',' + G.cx + ' ' + G.b; }
        else { var left = G.r <= C.l + 2, sx2 = left ? C.l : C.r, ex = left ? G.r : G.l, sy = C.t + C.h / 2, ey = G.t + G.h / 2, mx = (sx2 + ex) / 2;
          d = 'M' + sx2 + ' ' + sy + ' C' + mx + ' ' + sy + ',' + mx + ' ' + ey + ',' + ex + ' ' + ey; }
        links.push({ node: g, d: d, cls: gcls(g) }); });
    }
    links.forEach(function (l) { l.path = mk('path', 'lk ' + l.cls); l.path.setAttribute('d', l.d); l.len = l.path.getTotalLength(); });
    for (var k = 0; k < TRAIL; k++) { var t = mk('circle', 'trail'); t.setAttribute('r', 3.6 - k * 0.4); trail.push(t); }
    light = mk('circle', 'light'); light.setAttribute('r', 4);
    m.classList.toggle('static', reduce.matches);
  }

  function setActive(idx, groupOn) {
    if (idx === activeIdx && groupOn === activeGroupOn) return;
    links.forEach(function (l, i) { l.path.classList.toggle('on', i === idx); l.node.classList.toggle('on', i === idx && groupOn); });
    activeIdx = idx; activeGroupOn = groupOn;
  }
  function drawLight(l, p) {
    var fade = Math.max(0, Math.min(1, p / 0.08, (1 - p) / 0.08)), pt = l.path.getPointAtLength(l.len * p);
    light.setAttribute('class', 'light ' + l.cls); light.setAttribute('cx', pt.x); light.setAttribute('cy', pt.y); light.style.opacity = fade;
    trail.forEach(function (t, k) { var q = l.path.getPointAtLength(l.len * Math.max(0, p - (k + 1) * 0.035));
      t.setAttribute('class', 'trail ' + l.cls); t.setAttribute('cx', q.x); t.setAttribute('cy', q.y); t.style.opacity = fade * (0.55 - k * 0.08); });
  }
  function hideLight() { if (light) light.style.opacity = 0; trail.forEach(function (t) { t.style.opacity = 0; }); }
  function canRun() { return links.length && !reduce.matches && !st.user && !st.hold && st.visible && !document.hidden; }

  function frame(now) {
    st.raf = 0; if (!canRun()) { st.last = 0; return; }
    if (st.last) st.elapsed += Math.min(now - st.last, 100); st.last = now;
    var cyc = TRAVEL + HOLD, idx = Math.floor(st.elapsed / cyc) % links.length, loc = st.elapsed % cyc;
    if (loc < TRAVEL) { var p = loc / TRAVEL; p = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2; drawLight(links[idx], p); setActive(idx, p > 0.92); }
    else { hideLight(); setActive(idx, true); }
    st.raf = requestAnimationFrame(frame);
  }
  function kick() { if (!st.raf && canRun()) { st.last = 0; st.raf = requestAnimationFrame(frame); } }

  function linkOf(n) { for (var i = 0; i < links.length; i++) if (links[i].node === n) return i; return -1; }
  [core].concat(groups).forEach(function (n) {
    function enter() { st.hold = true; hideLight(); setActive(linkOf(n), true); }
    function leave() { st.hold = false; setActive(-1, false); kick(); }
    n.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') enter(); });
    n.addEventListener('pointerleave', function (e) { if (e.pointerType !== 'touch') leave(); });
    n.addEventListener('focusin', enter);
    n.addEventListener('focusout', function (e) { if (!n.contains(e.relatedTarget)) leave(); });
  });

  /* tooltip on hover and keyboard focus (touch uses the "What do these mean?" disclosure) */
  var tip = document.createElement('div'); tip.className = 'uni-tip'; tip.id = 'uni-tip'; tip.setAttribute('role', 'tooltip'); document.body.appendChild(tip);
  var cur = null;
  function showTip(a) { cur = a; tip.textContent = a.getAttribute('data-tip'); a.setAttribute('aria-describedby', 'uni-tip');
    var r = a.getBoundingClientRect(), w = tip.offsetWidth, h = tip.offsetHeight, x = Math.max(8, Math.min(innerWidth - w - 8, r.left + r.width / 2 - w / 2)), y = r.top - h - 8 < 8 ? r.bottom + 8 : r.top - h - 8;
    tip.style.left = x + 'px'; tip.style.top = y + 'px'; tip.classList.add('show'); }
  function hideTip() { if (cur) cur.removeAttribute('aria-describedby'); cur = null; tip.classList.remove('show'); }
  m.querySelectorAll('.uchip').forEach(function (a) {
    a.addEventListener('pointerenter', function (e) { if (e.pointerType !== 'touch') showTip(a); });
    a.addEventListener('pointerleave', hideTip); a.addEventListener('focus', function () { showTip(a); }); a.addEventListener('blur', hideTip);
  });
  document.addEventListener('keydown', function (e) { if (e.key === 'Escape') hideTip(); });
  /* scrolling dismisses a pointer tooltip; a keyboard-focused chip keeps its tooltip (focus itself can scroll the page), repositioned */
  addEventListener('scroll', function () { if (cur && document.activeElement === cur) showTip(cur); else hideTip(); }, { passive: true });

  /* pause / resume, offscreen and hidden-tab pausing, reduced motion */
  function label() { btn.textContent = st.user ? 'Play animation' : 'Pause animation'; btn.setAttribute('aria-pressed', st.user); }
  if (btn) { btn.hidden = reduce.matches; btn.addEventListener('click', function () { st.user = !st.user; label(); if (st.user) hideLight(); else kick(); }); }
  if ('IntersectionObserver' in window) new IntersectionObserver(function (es) { st.visible = es[0].isIntersecting; if (!st.visible) hideLight(); kick(); }).observe(m);
  document.addEventListener('visibilitychange', kick);
  var rt; function rebuild() { clearTimeout(rt); rt = setTimeout(function () { build(); kick(); }, 80); }
  if ('ResizeObserver' in window) new ResizeObserver(rebuild).observe(m); else addEventListener('resize', rebuild);
  var onRM = function () { if (btn) btn.hidden = reduce.matches; m.classList.toggle('static', reduce.matches); hideLight(); setActive(-1, false); kick(); };
  if (reduce.addEventListener) reduce.addEventListener('change', onRM); else reduce.addListener(onRM);
  build(); if (document.fonts && document.fonts.ready) document.fonts.ready.then(rebuild); kick();
})();
