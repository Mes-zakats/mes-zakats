// Mes Zakats — mesure d'usage anonyme (ouvertures, inscription, calculs) vers le tableau de bord de Hifz Facile
(function () {
  var API = 'https://hifz-api.axzertyuiop.workers.dev'; if (!API) return;
  var dev = localStorage.getItem('zk-dev'); if (!dev) { dev = 'zk-' + Math.random().toString(36).slice(2) + Date.now().toString(36); try { localStorage.setItem('zk-dev', dev); } catch (e) {} }
  var q = []; function track(t, d) { q.push({ t: t, at: Date.now(), d: d || {} }); }
  function flush(beacon) { if (!q.length) return; var body = JSON.stringify({ app: 'zakat', device: dev, events: q.splice(0, 50) });
    try { if (beacon && navigator.sendBeacon) navigator.sendBeacon(API + '/events', new Blob([body], { type: 'text/plain' })); else fetch(API + '/events', { method: 'POST', headers: { 'content-type': 'text/plain' }, body: body, keepalive: true }); } catch (e) {} }
  function who() { try { var u = JSON.parse(localStorage.getItem('zakat-user') || 'null'); return u && u.fn ? { name: u.fn, tel: String(u.wa || '').slice(-4) } : null; } catch (e) { return null; } }
  var w = who(); track('open', w ? { reg: 1 } : {});
  if (w && !localStorage.getItem('zk-reg-sent')) { track('register', w); localStorage.setItem('zk-reg-sent', '1'); }
  document.addEventListener('submit', function (e) { if (e.target && e.target.id === 'gate') setTimeout(function () { var u = who(); if (u && !localStorage.getItem('zk-reg-sent')) { track('register', u); localStorage.setItem('zk-reg-sent', '1'); flush(); } }, 300); }, true);
  var lastCalc = 0; document.addEventListener('input', function (e) { if (!e.target.closest || !e.target.closest('#app')) return; var n = Date.now(); if (n - lastCalc > 10 * 60000) { lastCalc = n; track('calc'); } }, true);
  document.addEventListener('click', function (e) { var b = e.target.closest && e.target.closest('[data-act]'); if (!b) return; var a = b.getAttribute('data-act'); if (a === 'snap' || a === 'copy' || a === 'mclose') track(a === 'snap' ? 'save' : a === 'copy' ? 'share' : 'contact'); }, true);
  setTimeout(flush, 2500); setInterval(flush, 30000); document.addEventListener('visibilitychange', function () { if (document.hidden) flush(true); });
})();
