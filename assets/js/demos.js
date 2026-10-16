/* Three sample-data demos. All data below is fictional and bundled; no network, no backend. */
(function () {
  'use strict';
  var $ = function (id) { return document.getElementById(id); };
  var esc = function (s) { return String(s).replace(/[&<>"]/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]; }); };

  /* ───────── 1. BigQuery Cost Explorer ───────── */
  var Q = [
    { n: 'daily_orders_rollup', t: 'Finance', runs: 30, tb: 4.2, part: 1, clus: 0, dup: 0 },
    { n: 'exec_revenue_extract', t: 'Leadership BI', runs: 60, tb: 2.8, part: 1, clus: 1, dup: 1 },
    { n: 'events_sessionize', t: 'Growth', runs: 30, tb: 6.5, part: 1, clus: 1, dup: 0 },
    { n: 'customer_360_refresh', t: 'Product', runs: 30, tb: 3.1, part: 0, clus: 1, dup: 1 },
    { n: 'adhoc_select_star_scan', t: 'Analysts', runs: 120, tb: 0.9, part: 1, clus: 0, dup: 0 },
    { n: 'marketing_attribution', t: 'Marketing', runs: 30, tb: 2.2, part: 1, clus: 1, dup: 0 },
    { n: 'finance_close_checks', t: 'Finance', runs: 15, tb: 1.4, part: 0, clus: 0, dup: 1 },
    { n: 'inventory_snapshots', t: 'Operations', runs: 30, tb: 1.1, part: 1, clus: 0, dup: 1 }
  ];
  var cx = {
    rate: $('cx-rate'), pr: $('cx-prune'), cl: $('cx-clus'), du: $('cx-dup'),
    out: $('cx-out'), body: $('cx-body')
  };
  var money = function (n) { return '$' + n.toLocaleString('en-US', { maximumFractionDigits: 0 }); };
  function costRun() {
    var rate = Math.max(0, parseFloat(cx.rate.value) || 0), pr = cx.pr.value / 100, cl = cx.cl.value / 100, du = cx.du.value / 100;
    $('cx-prune-v').textContent = cx.pr.value + '%'; $('cx-clus-v').textContent = cx.cl.value + '%'; $('cx-dup-v').textContent = cx.du.value + '%';
    var tb0 = 0, tb1 = 0, rows = '', max = 0;
    Q.forEach(function (q) { max = Math.max(max, q.runs * q.tb); });
    Q.forEach(function (q) {
      var base = q.runs * q.tb;
      var sc = q.runs * (1 - du * q.dup) * q.tb * (1 - pr * q.part) * (1 - cl * q.clus);
      tb0 += base; tb1 += sc;
      rows += '<tr><td>' + esc(q.n) + '<br><small class="mono" style="color:var(--dim)">' + esc(q.t) + '</small></td><td>' + base.toFixed(1) +
        '</td><td><div class="bar" aria-hidden="true"><i style="width:' + (base / max * 100) + '%"></i></div></td><td>' + sc.toFixed(1) +
        '</td><td><div class="bar" aria-hidden="true"><i class="s" style="width:' + (sc / max * 100) + '%"></i></div></td></tr>';
    });
    var c0 = tb0 * rate, c1 = tb1 * rate, d = c0 ? (1 - c1 / c0) * 100 : 0;
    cx.out.innerHTML = '<div><span>Baseline / month</span><b>' + money(c0) + '</b></div><div><span>Scenario / month</span><b class="good">' + money(c1) +
      '</b></div><div><span>Scenario change</span><b>' + (d ? '−' + d.toFixed(1) + '%' : '0%') + '</b></div>';
    cx.body.innerHTML = rows;
    $('cx-explain').textContent = 'Scenario: ' + tb0.toFixed(1) + ' TB scanned per month falls to ' + tb1.toFixed(1) +
      ' TB. Savings apply only to queries flagged as partition-able, cluster-able or duplicated in the sample table; everything else is unchanged. ' +
      'Change the rate or the three assumptions to see which lever matters most.';
  }
  [cx.rate, cx.pr, cx.cl, cx.du].forEach(function (e) { e.addEventListener('input', costRun); });
  $('cx-reset').addEventListener('click', function () { cx.rate.value = 6.25; cx.pr.value = 60; cx.cl.value = 25; cx.du.value = 50; costRun(); });

  /* ───────── 2. Lineage & Change Impact Explorer ───────── */
  var N = [
    ['crm_export', 'Source', 0, 'Sales Ops'], ['billing_feed', 'Source', 0, 'Finance'], ['web_events', 'Source', 0, 'Growth'],
    ['stg_customers', 'Staging', 1, 'Data Platform'], ['stg_orders', 'Staging', 1, 'Data Platform'], ['stg_events', 'Staging', 1, 'Data Platform'],
    ['mart_revenue', 'Mart', 2, 'Finance'], ['mart_retention', 'Mart', 2, 'Product'],
    ['Exec Revenue dashboard', 'Dashboard', 3, 'Leadership BI'], ['Finance Close pack', 'Dashboard', 3, 'Finance'], ['Growth Weekly', 'Dashboard', 3, 'Growth'], ['Churn alert job', 'Alert', 3, 'Product']
  ];
  var E = [[0, 3], [1, 4], [0, 4], [2, 5], [3, 6], [4, 6], [3, 7], [5, 7], [6, 8], [6, 9], [7, 10], [7, 11], [4, 9]];
  var layerNames = ['Sources', 'Staging', 'Marts', 'Consumers'];
  var gx = { sel: 4, mode: $('lg-mode'), svg: $('lg-svg') };
  var W = 760, H = 330, pos = [];
  (function layout() {
    var cnt = [0, 0, 0, 0], tot = [0, 0, 0, 0];
    N.forEach(function (n) { tot[n[2]]++; });
    N.forEach(function (n, i) {
      var l = n[2]; pos[i] = { x: 20 + l * 190, y: 52 + cnt[l] * (tot[l] > 3 ? 62 : 80) + (tot[l] <= 2 ? 40 : 0) }; cnt[l]++;
    });
  })();
  var down = function (s) { var seen = {}, q = [[s, 0]], out = []; seen[s] = 1; while (q.length) { var c = q.shift(); E.forEach(function (e) { if (e[0] === c[0] && !seen[e[1]]) { seen[e[1]] = 1; q.push([e[1], c[1] + 1]); out.push([e[1], c[1] + 1]); } }); } return out; };
  var up = function (s) { var seen = {}, q = [s], out = []; seen[s] = 1; while (q.length) { var c = q.shift(); E.forEach(function (e) { if (e[1] === c && !seen[e[0]]) { seen[e[0]] = 1; q.push(e[0]); out.push(e[0]); } }); } return out; };
  var MODES = {
    rename: ['Rename a column', 'A renamed column breaks every query that selects it. Anything downstream that references the old name fails until it is updated.'],
    delay: ['Delay the refresh by 6 hours', 'Nothing breaks, but everything downstream is stale for those hours. Consumers need a heads-up, not a fix.'],
    drop: ['Drop or retire this table', 'Every downstream consumer loses its input. Retire only after each listed owner has migrated.']
  };
  function drawGraph() {
    var s = gx.sel, imp = down(s), upn = up(s), impSet = {}, upSet = {}, hot = {};
    imp.forEach(function (i) { impSet[i[0]] = i[1]; }); upn.forEach(function (i) { upSet[i] = 1; });
    var svg = '<g>';
    layerNames.forEach(function (l, i) { svg += '<text class="glayer" x="' + (20 + i * 190) + '" y="22">' + l + '</text>'; });
    E.forEach(function (e) {
      var a = pos[e[0]], b = pos[e[1]], on = (e[0] === s || impSet[e[0]] !== undefined) && impSet[e[1]] !== undefined;
      svg += '<path class="gedge' + (on ? ' hot' : '') + '" d="M' + (a.x + 150) + ' ' + (a.y + 18) + ' C' + (a.x + 175) + ' ' + (a.y + 18) + ' ' + (b.x - 25) + ' ' + (b.y + 18) + ' ' + b.x + ' ' + (b.y + 18) + '"/>';
    });
    N.forEach(function (n, i) {
      var cls = 'gnode' + (i === s ? ' sel' : impSet[i] !== undefined ? ' imp' : upSet[i] ? ' up' : '');
      svg += '<g class="' + cls + '" tabindex="0" role="button" data-i="' + i + '" aria-pressed="' + (i === s) + '" aria-label="' + esc(n[0]) + ', ' + n[1] + ', owner ' + esc(n[3]) + '"><rect x="' + pos[i].x + '" y="' + pos[i].y + '" width="150" height="36" rx="10"/><text x="' + (pos[i].x + 10) + '" y="' + (pos[i].y + 22) + '">' + esc(n[0].length > 22 ? n[0].slice(0, 21) + '…' : n[0]) + '</text></g>';
    });
    gx.svg.innerHTML = svg + '</g>';
    var m = MODES[gx.mode.value], by = {};
    imp.forEach(function (i) { (by[i[1]] = by[i[1]] || []).push(i[0]); });
    var html = '<div class="result" style="grid-template-columns:repeat(3,1fr)"><div><span>Selected</span><b style="font-size:1.05rem">' + esc(N[s][0]) + '</b></div><div><span>Downstream affected</span><b>' + imp.length + '</b></div><div><span>Owners to notify</span><b>' +
      (function () { var o = {}; imp.forEach(function (i) { o[N[i[0]][3]] = 1; }); return Object.keys(o).length; })() + '</b></div></div>';
    if (!imp.length) html += '<p>Nothing depends on this node in the sample graph, so “' + m[0].toLowerCase() + '” has no downstream impact.</p>';
    else {
      html += '<div class="tablewrap"><table><thead><tr><th>Hops</th><th>Affected</th><th>Type</th><th>Owner</th></tr></thead><tbody>';
      Object.keys(by).sort().forEach(function (h) { by[h].forEach(function (i) { html += '<tr><td>' + h + '</td><td>' + esc(N[i][0]) + '</td><td>' + N[i][1] + '</td><td>' + esc(N[i][3]) + '</td></tr>'; }); });
      html += '</tbody></table></div>';
    }
    html += '<p class="explain"><strong>' + m[0] + ':</strong> ' + m[1] + (upn.length ? ' Upstream, ' + upn.length + ' node(s) feed this one and are not affected.' : '') + '</p>';
    $('lg-out').innerHTML = html;
    var sel = $('lg-sel'); if (sel.value != s) sel.value = s;
  }
  var sel = $('lg-sel');
  sel.innerHTML = N.map(function (n, i) { return '<option value="' + i + '">' + esc(n[0]) + '</option>'; }).join('');
  sel.addEventListener('change', function () { gx.sel = +sel.value; drawGraph(); });
  gx.mode.addEventListener('change', drawGraph);
  gx.svg.addEventListener('click', function (e) { var g = e.target.closest('.gnode'); if (g) { gx.sel = +g.dataset.i; drawGraph(); var f = gx.svg.querySelector('[data-i="' + gx.sel + '"]'); if (f) f.focus(); } });
  gx.svg.addEventListener('keydown', function (e) { if ((e.key === 'Enter' || e.key === ' ') && e.target.dataset.i) { e.preventDefault(); gx.sel = +e.target.dataset.i; drawGraph(); gx.svg.querySelector('[data-i="' + gx.sel + '"]').focus(); } });
  $('lg-reset').addEventListener('click', function () { gx.sel = 4; gx.mode.value = 'rename'; drawGraph(); });

  /* ───────── 3. Automation Workflow Playground ───────── */
  var SAMPLE = [
    'id,customer,email,amount,currency,date',
    'R-1001,Asha Verma,asha.verma@example.com,"1,250.00",INR,2026-09-03',
    'R-1002,  Liam Brooks ,liam.brooks@example.com,89.5,usd,04/09/2026',
    'R-1003,Chen Wei,chen.wei@example,410,USD,2026-09-05',
    'R-1004,Priya Nair,priya.nair@example.com,abc,INR,2026-09-06',
    'R-1002,Liam Brooks,liam.brooks@example.com,89.5,USD,2026-09-04',
    'R-1006,Marta Silva,marta.silva@example.com,-40,EUR,2026-09-07',
    'R-1007,,omar.haddad@example.com,230,GBP,2026-09-08',
    'R-1008,Noah Kim,noah.kim@example.com,75,JPY,2026-09-09',
    'R-1009,Sara Lindqvist,sara.l@example.com,310,EUR,2026-13-40',
    'R-1010,Dev Patel,dev.patel@example.com,640,inr,2027-01-15',
    'R-1011,Ines Costa,ines.costa@example.com,52.25,EUR,12/09/2026'
  ].join('\n');
  var wf = { src: $('wf-src'), out: $('wf-out') };
  var REF = new Date('2026-10-01T00:00:00Z'); /* fixed fictional "today" so results are deterministic */
  function parseCSV(t) {
    return t.split(/\r?\n/).filter(function (l) { return l.trim(); }).map(function (l) {
      var o = [], c = '', q = false;
      for (var i = 0; i < l.length; i++) { var ch = l[i]; if (ch === '"') q = !q; else if (ch === ',' && !q) { o.push(c); c = ''; } else c += ch; }
      o.push(c); return o;
    });
  }
  function parseDate(s) {
    s = s.trim(); var m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(s), d, mo, y;
    if (m) { y = +m[1]; mo = +m[2]; d = +m[3]; } else if ((m = /^(\d{2})\/(\d{2})\/(\d{4})$/.exec(s))) { d = +m[1]; mo = +m[2]; y = +m[3]; } else return null;
    var dt = new Date(Date.UTC(y, mo - 1, d)); if (dt.getUTCMonth() !== mo - 1 || dt.getUTCDate() !== d) return null; return dt;
  }
  function wfRun() {
    var rows = parseCSV(wf.src.value); if (rows.length < 2) { wf.out.innerHTML = '<p>Add a header row and at least one record.</p>'; return; }
    var rule = { uniq: $('r-uniq').checked, mail: $('r-mail').checked, amt: $('r-amt').checked, cur: $('r-cur').checked, date: $('r-date').checked, req: $('r-req').checked };
    var seen = {}, good = [], bad = [];
    rows.slice(1).forEach(function (r, i) {
      var id = (r[0] || '').trim(), cust = (r[1] || '').trim().replace(/\s+/g, ' '), mail = (r[2] || '').trim().toLowerCase(), amt = (r[3] || '').trim(),
          cur = (r[4] || '').trim().toUpperCase(), ds = (r[5] || ''), why = [];
      var n = parseFloat(amt.replace(/,/g, '')), dt = parseDate(ds);
      if (rule.req && (!id || !cust)) why.push('missing ' + (!id ? 'id' : 'customer'));
      if (rule.uniq && id && seen[id]) why.push('duplicate id (first seen on row ' + seen[id] + ')');
      if (rule.mail && !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(mail)) why.push('invalid email');
      if (rule.amt && !(n > 0)) why.push(isNaN(n) ? 'amount not numeric' : 'amount must be positive');
      if (rule.cur && ['INR', 'USD', 'EUR', 'GBP'].indexOf(cur) < 0) why.push('currency not allowed: ' + (cur || 'blank'));
      if (rule.date && (!dt ? true : dt > REF)) why.push(!dt ? 'unreadable date' : 'date is in the future');
      if (id && !seen[id]) seen[id] = i + 2;
      var rec = { row: i + 2, id: id, cust: cust, mail: mail, amt: isNaN(n) ? amt : n.toFixed(2), cur: cur, date: dt ? dt.toISOString().slice(0, 10) : ds.trim() };
      if (why.length) bad.push({ rec: rec, why: why }); else good.push(rec);
    });
    var h = '<div class="result"><div><span>Records in</span><b>' + (rows.length - 1) + '</b></div><div><span>Cleaned</span><b class="good">' + good.length + '</b></div><div><span>Exception queue</span><b class="bad">' + bad.length + '</b></div></div>';
    h += '<h3>Cleaned report</h3><div class="tablewrap"><table><thead><tr><th>Row</th><th>ID</th><th>Customer</th><th>Email</th><th>Amount</th><th>Cur</th><th>Date</th></tr></thead><tbody>' +
      (good.map(function (g) { return '<tr><td>' + g.row + '</td><td>' + esc(g.id) + '</td><td>' + esc(g.cust) + '</td><td>' + esc(g.mail) + '</td><td>' + g.amt + '</td><td>' + g.cur + '</td><td>' + g.date + '</td></tr>'; }).join('') || '<tr><td colspan="7">No clean records.</td></tr>') + '</tbody></table></div>';
    h += '<h3 style="margin-top:22px">Exception queue</h3><div class="tablewrap"><table><thead><tr><th>Row</th><th>ID</th><th>Reason(s)</th></tr></thead><tbody>' +
      (bad.map(function (b) { return '<tr><td>' + b.rec.row + '</td><td>' + esc(b.rec.id || '—') + '</td><td class="bad">' + b.why.map(esc).join('; ') + '</td></tr>'; }).join('') || '<tr><td colspan="3">No exceptions.</td></tr>') + '</tbody></table></div>';
    h += '<p class="explain">Cleaning normalises whitespace, case, thousands separators and DD/MM/YYYY dates. Anything that cannot be fixed safely goes to the exception queue with its reason instead of being guessed. The reference date is fixed at 2026-10-01 (fictional) so results are repeatable.</p>';
    h += '<button type="button" class="btn btn-ghost btn-sm" id="wf-dl">Download cleaned CSV</button>';
    wf.out.innerHTML = h;
    $('wf-dl').addEventListener('click', function () {
      var csv = 'id,customer,email,amount,currency,date\n' + good.map(function (g) { return [g.id, g.cust, g.mail, g.amt, g.cur, g.date].map(function (v) { return /[",]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v; }).join(','); }).join('\n');
      var a = document.createElement('a'); a.href = URL.createObjectURL(new Blob([csv], { type: 'text/csv' })); a.download = 'cleaned_sample_records.csv'; a.click();
    });
  }
  $('wf-run').addEventListener('click', wfRun);
  document.querySelectorAll('.wf-rule').forEach(function (c) { c.addEventListener('change', wfRun); });
  $('wf-reset').addEventListener('click', function () { wf.src.value = SAMPLE; document.querySelectorAll('.wf-rule').forEach(function (c) { c.checked = true; }); wfRun(); });

  wf.src.value = SAMPLE; costRun(); drawGraph(); wfRun();
})();
