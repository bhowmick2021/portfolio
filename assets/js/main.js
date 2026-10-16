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
    if (a.href.indexOf('for=') < 0) a.href += (a.href.indexOf('?') < 0 ? '?' : '&') + 'for=' + cur;
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

  /* library search + filter */
  var lib = document.getElementById('lib');
  if (lib) {
    var items = [].slice.call(lib.querySelectorAll('.lib-item'));
    var q = document.getElementById('lib-q'), count = document.getElementById('lib-count');
    var state = { aud: 'all', tag: 'all' };
    var apply = function () {
      var term = (q.value || '').toLowerCase().trim(), n = 0;
      items.forEach(function (it) {
        var ok = (state.aud === 'all' || it.dataset.aud.split(' ').indexOf(state.aud) > -1) &&
                 (state.tag === 'all' || it.dataset.tags.split(' ').indexOf(state.tag) > -1) &&
                 (!term || it.textContent.toLowerCase().indexOf(term) > -1);
        it.hidden = !ok; if (ok) n++;
      });
      count.textContent = n + ' of ' + items.length + ' projects shown';
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
