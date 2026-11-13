(() => {
const WA = '22965435681', KEY = 'zakat-app-v3', ACCESS = 'zakat-access', USER = 'zakat-user', SYNC = 'zakat-sync', UNSUB = 'zakat-unsub';
const SHEET_URL = 'https://script.google.com/macros/s/AKfycby5rbrRkfoFAA7ahhQj7yeZIHAv3OR-Q3oO9MVOzNFHjkxjLS4k26YazVK7kpXTEuMl/exec';
const OZ = 31.1034768;
// Valeurs de secours, utilisées tant que les cours en direct n'ont pas été lus.
const SNAP = { t: Date.UTC(2026, 10, 11, 2, 25), xau: 4041.2, xag: 52.239, rates: { USD: 1, EUR: 0.893927, XOF: 586.368084, XAF: 586.368084, CAD: 1.417008, CHF: 0.824189, MAD: 9.77018, DZD: 136.249297, TND: 3.006437, GBP: 0.748164, SAR: 3.75, KWD: 0.310398, MRU: 40.545072, GNF: 8858.817918, KMF: 439.776063, DJF: 177.721, TRY: 50.24194 } };
const TOP_CUR = ['EUR', 'XOF', 'XAF', 'USD', 'CAD', 'CHF', 'GBP', 'MAD', 'DZD', 'TND', 'MRU', 'GNF', 'KMF', 'DJF', 'EGP', 'SAR', 'AED', 'KWD', 'QAR', 'TRY'];
const SYM = { EUR: '€', USD: '$', GBP: '£', XOF: 'FCFA', XAF: 'FCFA', CAD: '$ CA', CHF: 'CHF', MAD: 'DH', DZD: 'DA', TND: 'DT' };
// Indicatif téléphonique → devise du pays.
const PREFIX = { 33: 'EUR', 32: 'EUR', 352: 'EUR', 49: 'EUR', 39: 'EUR', 34: 'EUR', 31: 'EUR', 351: 'EUR', 43: 'EUR', 353: 'EUR', 358: 'EUR', 30: 'EUR', 262: 'EUR', 590: 'EUR', 594: 'EUR', 596: 'EUR', 377: 'EUR',
  41: 'CHF', 44: 'GBP', 1: 'USD', 229: 'XOF', 221: 'XOF', 225: 'XOF', 226: 'XOF', 223: 'XOF', 227: 'XOF', 228: 'XOF', 245: 'XOF', 237: 'XAF', 241: 'XAF', 242: 'XAF', 235: 'XAF', 236: 'XAF', 240: 'XAF',
  212: 'MAD', 213: 'DZD', 216: 'TND', 222: 'MRU', 224: 'GNF', 269: 'KMF', 253: 'DJF', 20: 'EGP', 966: 'SAR', 971: 'AED', 965: 'KWD', 974: 'QAR', 973: 'BHD', 968: 'OMR', 962: 'JOD', 961: 'LBP', 90: 'TRY',
  234: 'NGN', 233: 'GHS', 261: 'MGA', 243: 'CDF', 250: 'RWF', 257: 'BIF', 220: 'GMD', 230: 'MUR', 92: 'PKR', 91: 'INR', 880: 'BDT', 62: 'IDR', 60: 'MYR', 61: 'AUD', 46: 'SEK', 47: 'NOK', 45: 'DKK' };
const WELL_PRICES = ['1 150 $', '1 300 $', '3 500 $', '4 000 $'];

const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
const num = v => { const n = parseFloat(String(v ?? '').replace(/[\s  ]/g, '').replace(',', '.')); return isFinite(n) && n > 0 ? n : 0 };
const YT_HQM = 'https://www.youtube.com/@hifzquranmutun?sub_confirmation=1', HIFZ_URL = 'https://mes-zakats.github.io/mes-zakats/hifz/';
const wa = txt => 'https://wa.me/' + WA + '?text=' + encodeURIComponent(txt);
const ic = n => `<svg viewBox="0 0 24 24" aria-hidden="true"><use href="#${n}"/></svg>`;
const store = (k, v) => { try { localStorage.setItem(k, v) } catch (e) {} };
const read = k => { try { return localStorage.getItem(k) } catch (e) { return null } };
const drop = k => { try { localStorage.removeItem(k) } catch (e) {} };

/* ---------- Données ---------- */
const blank = () => ({ mal: { cash: [{ l: '', a: '' }], invest: [{ l: '', a: '' }], recv: [{ l: '', a: '' }], stock: [{ l: '', a: '' }], debt: [{ l: '', a: '' }], gold: [{ a: '', k: '18' }], silver: [{ a: '', k: '925' }], rate: '0.025' },
  crop: { kg: '', n: '653', p: '', irr: '0.1' }, herd: { cam: '', cow: '', shp: '' }, rikaz: { v: '' }, fitr: { n: '1', kg: '2,5', p: '' }, hawl: '', pays: [], hist: [] });
const guessLang = () => { const l = (navigator.language || 'fr').slice(0, 2).toLowerCase(); return l === 'ar' ? 'ar' : l === 'en' ? 'en' : 'fr' };
let S = null; try { S = JSON.parse(read(KEY)) } catch (e) {}
if (!S || !Array.isArray(S.profiles) || !S.profiles.length) S = { cur: 'EUR', gp: '', sp: '', ref: 'silver', profiles: [{ name: read(ACCESS) || 'Moi', d: blank() }], active: 0 };
S.cur = { '€': 'EUR', 'FCFA': 'XOF', '$': 'USD', 'x': 'EUR' }[S.cur] || S.cur || 'EUR';
S.lang = window.I18N[S.lang] ? S.lang : guessLang();
if (S.auto !== '0') S.auto = '1';
S.look = 'a';
if (S.tips !== '0') S.tips = '1';
S.nd = S.nd || {};
if (!S.profiles[S.active]) S.active = 0;
const P = () => S.profiles[S.active], D = () => P().d;
const save = () => store(KEY, JSON.stringify(S));
const user = () => { try { return JSON.parse(read(USER)) } catch (e) { return null } };
function path(k) { const parts = k.split('.'); let o = S; if (parts[0] === 'd') { o = D(); parts.shift() } return [o, parts] }
function getK(k) { let [o, p] = path(k); for (const x of p) o = o?.[x]; return o ?? '' }
function setK(k, v) { let [o, p] = path(k); for (let i = 0; i < p.length - 1; i++) o = o[p[i]]; o[p[p.length - 1]] = v }

/* ---------- Langue, devise, cours ---------- */
const T = () => window.I18N[S.lang];
const t = (k, v) => { let s = T()[k] ?? window.I18N.fr[k] ?? k; if (v) for (const x in v) s = s.split('{' + x + '}').join(v[x]); return s };
const nloc = () => S.lang === 'fr' ? 'fr-FR' : 'en-US';
function applyLang() { const h = document.documentElement; h.lang = S.lang; h.dir = T().dir; h.dataset.look = S.look }
const live0 = () => S.live && S.live.rates ? S.live : SNAP;
const rate = () => live0().rates[S.cur] || SNAP.rates[S.cur] || 0;
const isAuto = () => S.auto === '1' && rate() > 0;
function prices() {
  if (isAuto()) { const L = live0(), r = rate(); return { gp: L.xau / OZ * r, sp: L.xag / OZ * r } }
  return { gp: num(S.gp), sp: num(S.sp) };
}
const sym = () => SYM[S.cur] || S.cur;
const dec = () => rate() > 40 ? 0 : 2;
const iso = x => S.lang === 'ar' ? '\u2066' + x + '\u2069' : x;
const money = n => iso((n.toLocaleString(nloc(), { minimumFractionDigits: dec(), maximumFractionDigits: dec() }) + ' ' + sym()).trim());
const qty = (n, u) => iso(n.toLocaleString(nloc(), { maximumFractionDigits: 2 }) + ' ' + u);
const pct = x => (x * 100).toLocaleString(nloc(), { maximumFractionDigits: 3 }) + ' %';
const fdate = x => new Date(x).toLocaleDateString(T().loc, { day: 'numeric', month: 'long', year: 'numeric' });
const fstamp = x => new Date(x).toLocaleString(T().loc, { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
function curName(c) { try { const n = new Intl.DisplayNames([T().loc], { type: 'currency' }).of(c); return n && n !== c ? `${n} (${c})` : c } catch (e) { return c } }
function curFromPhone(p) {
  const d = String(p || '').replace(/\D/g, '');
  for (const len of [3, 2, 1]) { const c = PREFIX[d.slice(0, len)]; if (c) { if (c === 'USD') { let tz = ''; try { tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '' } catch (e) {} if (/Toronto|Montreal|Vancouver|Edmonton|Winnipeg|Halifax|Regina|St_Johns|Moncton/.test(tz)) return 'CAD' } return c } }
  return 'EUR';
}
async function refresh(force) {
  if (!force && S.live && Date.now() - S.live.t < 15 * 60e3) return;
  try {
    const get = u => fetch(u, { cache: 'no-store' }).then(r => { if (!r.ok) throw 0; return r.json() });
    const [au, ag, fx] = await Promise.all([get('https://api.gold-api.com/price/XAU'), get('https://api.gold-api.com/price/XAG'), get('https://open.er-api.com/v6/latest/USD')]);
    if (!(au.price > 500 && au.price < 20000 && ag.price > 5 && ag.price < 500 && fx.rates && fx.rates.EUR > 0)) throw 0;
    S.live = { t: Date.now(), xau: au.price, xag: ag.price, rates: fx.rates }; save();
    if (!$('#app').hidden) { const a = document.activeElement; if (a && a.matches && a.matches('#view input, #view select')) live(); else render() }
  } catch (e) {}
}

/* ---------- Formulaire d'accès ---------- */
// Indicatifs reconnus et nombre de chiffres du numéro national (min, max). Sans règle précise : 7 à 12 chiffres.
const CC_LEN = { 1: [10, 10], 7: [10, 10], 20: [10, 10], 27: [9, 9], 30: [10, 10], 31: [9, 9], 32: [8, 9], 33: [9, 9], 34: [9, 9], 39: [9, 11], 41: [9, 9], 44: [10, 10], 47: [8, 8], 49: [10, 11], 55: [10, 11], 61: [9, 9], 90: [10, 10],
  212: [9, 9], 213: [9, 9], 216: [8, 8], 221: [9, 9], 222: [8, 8], 223: [8, 8], 224: [9, 9], 225: [10, 10], 226: [8, 8], 227: [8, 8], 228: [8, 8], 229: [8, 10], 233: [9, 9], 234: [10, 10], 235: [8, 8], 237: [9, 9], 241: [7, 8], 242: [9, 9], 243: [9, 9],
  253: [8, 8], 261: [9, 9], 262: [9, 9], 269: [7, 7], 351: [9, 9], 352: [8, 9], 965: [8, 8], 966: [9, 9], 971: [9, 9], 974: [8, 8] };
const CC_ALL = new Set(('1 7 20 27 30 31 32 33 34 36 39 40 41 43 44 45 46 47 48 49 51 52 53 54 55 56 57 58 60 61 62 63 64 65 66 81 82 84 86 90 91 92 93 94 95 98 ' +
  '211 212 213 216 218 220 221 222 223 224 225 226 227 228 229 230 231 232 233 234 235 236 237 238 239 240 241 242 243 244 245 248 249 250 251 252 253 254 255 256 257 258 260 261 262 263 264 265 266 267 268 269 ' +
  '291 297 298 299 350 351 352 353 354 355 356 357 358 359 370 371 372 373 374 375 376 377 378 380 381 382 383 385 386 387 389 420 421 423 501 502 503 504 505 506 507 508 509 590 591 592 593 594 595 596 597 598 599 ' +
  '670 673 674 675 676 677 678 679 680 685 687 689 852 853 855 856 880 886 960 961 962 963 964 965 966 967 968 970 971 972 973 974 975 976 977 992 993 994 995 996 998').split(' '));
const CC_KEEP0 = new Set(['229', '225', '39', '242']); // pays où le 0 initial fait partie du numéro
// Accepte un numéro avec ou sans « + » ou « 00 », à condition qu'il commence par un indicatif de pays et ait le bon nombre de chiffres.
function phone(v) {
  let d = String(v || '').trim().replace(/^\+/, '').replace(/[\s().\- ]/g, '');
  if (!/^\d+$/.test(d)) return null;
  if (d.startsWith('00')) d = d.slice(2);
  if (d.startsWith('0')) return null;
  for (const len of [3, 2, 1]) {
    const cc = d.slice(0, len); if (!CC_ALL.has(cc)) continue;
    let n = d.slice(len);
    if (!CC_KEEP0.has(cc)) n = n.replace(/^0/, '');
    const r = CC_LEN[cc] || [7, 12];
    if (n.length < r[0] || n.length > r[1]) return null;
    if (cc === '33' && !/^[67]/.test(n)) return null;
    return '+' + cc + n;
  }
  return null;
}
function renderGate() {
  $('#gate').innerHTML = `<div class="wrap">
    <div class="langs" role="group" aria-label="Langue">${Object.keys(window.I18N).map(l => `<button type="button" data-lang="${l}" aria-pressed="${l === S.lang}">${window.I18N[l].name}</button>`).join('')}</div>
    <svg class="art" viewBox="0 0 320 150" aria-hidden="true">
      <g fill="#FFD60A" stroke="#0A2472" stroke-width="3" stroke-linejoin="round"><path d="M44 94v18c0 6 15 11 34 11s34-5 34-11V94z"/><path d="M44 76v18c0 6 15 11 34 11s34-5 34-11V76z"/><path d="M44 58v18c0 6 15 11 34 11s34-5 34-11V58z"/><ellipse cx="78" cy="58" rx="34" ry="11"/></g>
      <path d="M118 44c40-26 78-18 96 14" fill="none" stroke="#D6E2FA" stroke-width="3" stroke-dasharray="4 8" stroke-linecap="round"/>
      <g class="coin"><circle cx="104" cy="40" r="12" fill="#01D758" stroke="#0A2472" stroke-width="2"/><path d="M99 40l4 4 7-8" fill="none" stroke="#0A2472" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/></g>
      <path d="M162 96h14c14 26 80 26 94 0h14" fill="#E3EEFF" stroke="#1D6BF3" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
    </svg>
    <p class="brand"><img src="img/app.png" alt="" width="40" height="40">Mes Zakats</p>
    <h1>${t('g_h1')}</h1><p class="lead">${t('g_lead')}</p>
    <ul class="types">${Object.keys(TYPES).map(k => `<li>${ic(TYPES[k])}${t('t_' + k)}</li>`).join('')}</ul>
    <form class="card" id="lead" novalidate>
      <h2>${t('g_title')}</h2>
      <div class="field" id="f-fn"><label for="fn">${t('f_fn')}</label><div class="inp"><input id="fn" autocomplete="given-name" dir="ltr"></div></div>
      <div class="field" id="f-wa"><label for="wa">${t('f_wa')}</label><div class="inp"><input id="wa" type="tel" inputmode="tel" autocomplete="tel" placeholder="33 6 12 34 56 78" dir="ltr"></div><small>${t('f_wa_h')}</small></div>
      <p class="err" id="lead-err" role="alert" hidden></p>
      <input id="site" name="site" type="text" tabindex="-1" autocomplete="off" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;opacity:0">
      <button class="cta" id="go" type="submit">${t('g_go')}</button>
      <p class="fine">${t('g_fine')}</p>
    </form></div>`;
}
function sendLead() {
  const u = user();
  if (!u || !u.fn || !u.wa || read(SYNC) === '1') return;
  fetch(SHEET_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ prenom: u.fn, numero: u.wa, site: u.site || '' }), keepalive: true })
    .then(r => r.json()).then(j => { if (j && (j.ok || j.erreur === 'prenom' || j.erreur === 'numero')) store(SYNC, '1') }).catch(() => {});
}
// Signale la désinscription à la feuille. En cas d'échec, nouvel essai à la prochaine ouverture ; le numéro en attente est ensuite effacé.
function sendUnsub() {
  const n = read(UNSUB); if (!n) return;
  fetch(SHEET_URL, { method: 'POST', headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body: JSON.stringify({ action: 'desinscription', numero: n }), keepalive: true })
    .then(r => r.json()).then(j => { if (j && j.ok && j.desinscrit) drop(UNSUB) }).catch(() => {});
}
function openApp() { $('#gate').hidden = true; $('#app').hidden = false; render(); refresh() }
$('#gate').addEventListener('click', e => {
  const b = e.target.closest('[data-lang]'); if (!b) return;
  const fn = $('#fn').value, w = $('#wa').value; S.lang = b.dataset.lang; save(); applyLang(); renderGate(); $('#fn').value = fn; $('#wa').value = w;
});
$('#gate').addEventListener('submit', e => {
  e.preventDefault();
  const l = { fn: $('#fn').value.trim(), wa: phone($('#wa').value) };
  const bad = { fn: !/^[A-Za-zÀ-ÖØ-öø-ÿ' \-]{2,40}$/.test(l.fn), wa: !l.wa };
  ['fn', 'wa'].forEach(k => $('#f-' + k).classList.toggle('bad', bad[k]));
  const msg = bad.fn ? t('e_fn') : bad.wa ? t('e_wa') : '';
  $('#lead-err').hidden = !msg; $('#lead-err').textContent = msg;
  if (msg) return;
  if (read(UNSUB) === l.wa) drop(UNSUB);
  store(USER, JSON.stringify({ fn: l.fn, wa: l.wa, site: $('#site').value })); store(ACCESS, l.fn);
  if (S.profiles.length === 1 && S.profiles[0].name === 'Moi') S.profiles[0].name = l.fn;
  if (!S.curSet) S.cur = curFromPhone(l.wa);
  save(); sendLead(); openApp();
});

/* ---------- Calculs ---------- */
const xn = (n, k) => { HK.add(k); return n + ' × ' + t(k); }; const HK = new Set();
const herdKeys = R => { HK.clear(); camels(num(D().herd.cam)); cows(num(D().herd.cow)); sheep(num(D().herd.shp)); return [...HK]; };
const herdHelp = R => { const ks = herdKeys(R); if (!ks.length) return ''; return `<section class="card help"><h4>${t('hh_t')}</h4><dl class="gl">${ks.map(k => `<dt>${t(k)}</dt><dd>${t('hh_' + k)}</dd>`).join('')}</dl><p class="note">${t('hh_rule')}</p><a class="btn" target="_blank" rel="noopener" href="${wa(t('m_herd') + mName())}">${ic('p-wa')}${t('hh_ask')}</a></section>`; };
function camels(n) {
  if (n < 5) return [];
  if (n < 25) return [xn(Math.floor(n / 5), 'a_sheep')];
  if (n <= 35) return [xn(1, 'a_bm')];
  if (n <= 45) return [xn(1, 'a_bl')];
  if (n <= 60) return [xn(1, 'a_hq')];
  if (n <= 75) return [xn(1, 'a_jd')];
  if (n <= 90) return [xn(2, 'a_bl')];
  if (n <= 120) return [xn(2, 'a_hq')];
  const tt = Math.floor(n / 10) * 10, out = [];
  for (let b = Math.floor(tt / 50); b >= 0; b--) if ((tt - 50 * b) % 40 === 0) { const a = (tt - 50 * b) / 40; if (b) out.push(xn(b, 'a_hq')); if (a) out.push(xn(a, 'a_bl')); break }
  return out;
}
function cows(n) {
  if (n < 30) return [];
  if (n < 40) return [xn(1, 'a_tb')];
  if (n < 60) return [xn(1, 'a_ms')];
  const tt = Math.floor(n / 10) * 10, out = [];
  for (let b = Math.floor(tt / 40); b >= 0; b--) if ((tt - 40 * b) % 30 === 0) { const a = (tt - 40 * b) / 30; if (a) out.push(xn(a, 'a_tb')); if (b) out.push(xn(b, 'a_ms')); break }
  return out;
}
const sheep = n => n < 40 ? [] : [xn(n <= 120 ? 1 : n <= 200 ? 2 : n < 400 ? 3 : Math.floor(n / 100), 'a_sheep')];
function compute() {
  const d = D(), m = d.mal, { gp, sp } = prices(), nG = 85 * gp, nS = 595 * sp, nisab = S.ref === 'gold' ? nG : nS;
  const sum = a => a.reduce((s, x) => s + num(x.a), 0);
  const cash = sum(m.cash), invest = sum(m.invest), recv = sum(m.recv), stock = sum(m.stock), debt = sum(m.debt);
  const goldG = m.gold.reduce((s, x) => s + num(x.a) * (+x.k) / 24, 0), silverG = m.silver.reduce((s, x) => s + num(x.a) * (+x.k) / 1000, 0);
  const gold = goldG * gp, silver = silverG * sp, base = Math.max(0, cash + invest + recv + stock + gold + silver - debt), rt = parseFloat(m.rate);
  const malOn = nisab > 0 && base >= nisab, mal = malOn ? base * rt : 0;
  const kg = num(d.crop.kg), cn = num(d.crop.n), cr = parseFloat(d.crop.irr), cp = num(d.crop.p), cropOn = kg > 0 && kg >= cn, cropKg = cropOn ? kg * cr : 0, cropVal = cropKg * cp;
  const herd = [['cam', camels(num(d.herd.cam)), num(d.herd.cam)], ['cow', cows(num(d.herd.cow)), num(d.herd.cow)], ['shp', sheep(num(d.herd.shp)), num(d.herd.shp)]];
  const herdDue = herd.flatMap(h => h[1]);
  const rikV = num(d.rikaz.v), rik = rikV * 0.2;
  const fN = num(d.fitr.n), fKg = fN * num(d.fitr.kg), fp = num(d.fitr.p), fVal = fKg * fp;
  const total = mal + rik + cropVal + fVal, paid = d.pays.reduce((s, x) => s + num(x.a), 0);
  return { gp, sp, nG, nS, nisab, cash, invest, recv, stock, debt, gold, silver, goldG, silverG, base, rt, malOn, mal, kg, cn, cr, cp, cropOn, cropKg, cropVal, herd, herdDue, rikV, rik, fN, fKg, fp, fVal, total, paid, rest: Math.max(0, total - paid) };
}
function hawl() {
  const d = D(); if (!d.hawl) return null;
  const s = new Date(d.hawl + 'T12:00:00'); if (isNaN(s)) return null;
  const L = 354.367 * 864e5, now = Date.now(); let n = s.getTime() + L; while (n < now - 864e5) n += L;
  const date = new Date(n); let hij = '';
  try { hij = new Intl.DateTimeFormat((S.lang === 'ar' ? 'ar' : T().loc) + '-u-ca-islamic-umalqura-nu-latn', { day: 'numeric', month: 'long', year: 'numeric' }).format(date) } catch (e) {}
  return { date, hij, days: Math.max(0, Math.ceil((n - now) / 864e5)) };
}

/* ---------- Éléments d'interface ---------- */
const TYPES = { mal: 'i-mal', crop: 'i-crop', herd: 'i-herd', rikaz: 'i-rikaz', fitr: 'i-fitr' };
function status(k, R) {
  if (k === 'mal') return R.mal > 0 ? [money(R.mal), 1] : [R.base > 0 ? t('st_under') : t('st_todo'), 0];
  if (k === 'crop') return R.cropKg > 0 ? [qty(R.cropKg, 'kg'), 1] : [R.kg > 0 ? t('st_under') : t('st_todo'), 0];
  if (k === 'herd') return R.herdDue.length ? [t('st_cat', { n: R.herdDue.length }), 1] : [t('st_todo'), 0];
  if (k === 'rikaz') return R.rik > 0 ? [money(R.rik), 1] : [t('st_todo'), 0];
  return R.fKg > 0 ? [R.fp ? money(R.fVal) : qty(R.fKg, 'kg'), 1] : [t('st_todo'), 0];
}
const idOf = k => 'i-' + k.replace(/\./g, '-');
const field = (label, k, o = {}) => `<div class="field"><label for="${idOf(k)}">${label}</label><div class="inp"><input id="${idOf(k)}" data-k="${k}" value="${esc(getK(k))}" inputmode="decimal" placeholder="0" dir="ltr">${o.unit ? `<span>${o.unit}</span>` : '<span data-cur>' + esc(sym()) + '</span>'}</div>${o.hint ? `<small>${o.hint}</small>` : ''}</div>`;
const select = (label, k, opts) => `<div class="field"><label for="${idOf(k)}">${label}</label><select id="${idOf(k)}" data-k="${k}">${opts.map(o => `<option value="${o[0]}"${String(getK(k)) === o[0] ? ' selected' : ''}>${o[1]}</option>`).join('')}</select></div>`;
const xbtn = (act, cat, i, label) => `<button class="x" data-act="${act}" data-cat="${cat}" data-i="${i}" aria-label="${label}">${ic('n-x')}</button>`;
function lineList(cat) {
  const arr = D().mal[cat], hint = T()['h_' + cat];
  return `<h3>${t('l_' + cat)}</h3>${hint ? `<p class="note">${hint}</p>` : ''}<div class="lines">${arr.map((x, i) => { const k = `d.mal.${cat}.${i}`;
    return `<div class="line"><input class="lbl" id="${idOf(k + '.l')}" aria-label="${t('lbl')}" data-k="${k}.l" value="${esc(x.l)}" placeholder="${t('p_' + cat)}">
      <div class="inp"><input id="${idOf(k + '.a')}" aria-label="${t('amount')}" data-k="${k}.a" value="${esc(x.a)}" inputmode="decimal" placeholder="0" dir="ltr"><span data-cur>${esc(sym())}</span></div>
      ${arr.length > 1 ? xbtn('del', cat, i, t('del_line')) : '<span></span>'}</div>` }).join('')}</div>
    <button class="add" data-act="add" data-cat="${cat}">${ic('n-plus')}${t('add_line')}</button>`;
}
function metalList(cat, opts) {
  const arr = D().mal[cat], hint = T()['h_' + cat];
  return `<h3>${t('l_' + cat)}</h3>${hint ? `<p class="note">${hint}</p>` : ''}<div class="lines">${arr.map((x, i) => { const k = `d.mal.${cat}.${i}`;
    return `<div class="line"><select id="${idOf(k + '.k')}" aria-label="${t('purity')}" data-k="${k}.k">${opts.map(o => `<option value="${o[0]}"${x.k === o[0] ? ' selected' : ''}>${o[1]}</option>`).join('')}</select>
      <div class="inp"><input id="${idOf(k + '.a')}" aria-label="${t('weight')}" data-k="${k}.a" value="${esc(x.a)}" inputmode="decimal" placeholder="0" dir="ltr"><span>g</span></div>
      ${arr.length > 1 ? xbtn('del', cat, i, t('del_line')) : '<span></span>'}</div>` }).join('')}</div>
    <button class="add" data-act="add" data-cat="${cat}">${ic('n-plus')}${t('add_obj')}</button>`;
}
const rows = l => l.map(r => `<div><dt>${r[0]}</dt><dd${r[2] ? ' class="minus"' : ''}>${r[1]}</dd></div>`).join('');
const meter = (v, lim, a, b) => { const max = Math.max(v, lim) * 1.12 || 1; return `<div class="meter"><div class="barx"><i style="width:${v / max * 100}%"></i><u style="inset-inline-start:calc(${lim / max * 100}% - 3px)"></u></div><p><span>${a}</span><span>${b}</span></p></div>` };
const box = (on, pill, inner) => `<div class="result${on ? ' on' : ''}"><span class="pill">${pill}</span>${inner}</div>`;
const big = (l, v) => `<div class="big"><span>${l}</span><b>${v}</b></div>`;
const det = inner => `<details><summary>${t('detail')}</summary>${inner}</details>`;

/* ---------- Suggestions HQM : au bon moment, masquables ---------- */
const fn = () => (user() || {}).fn || (P().name && P().name !== 'Moi' ? P().name : '');
const nm = s => String(s).replace(/^\s*[,،]\s*/, '').replace(/^./, c => c.toUpperCase());
const mName = () => fn() ? '\n' + t('m_name', { fn: fn() }) : '';
const ndOff = k => S.tips === '0' || (S.nd[k] && Date.now() - S.nd[k] < 7 * 864e5);
function nudge(k, title, body, btn, link) {
  if (ndOff(k)) return '';
  return `<section class="card nudge"><button class="x" data-act="ndhide" data-k="${k}" aria-label="${t('nd_close')}">${ic('n-x')}</button>
    <h4>${title}</h4><p>${body}</p><a class="cta" target="_blank" rel="noopener" href="${link}">${ic('p-wa')}${btn}</a>
    <label class="never"><input type="checkbox" id="nd-${k}" data-never>${t('nd_never')}</label></section>`;
}
const msgZakat = x => t('m_zakat') + (x ? '\n' + t('m_amount', { x }) : '') + mName();
const ndDue = R => nudge('due', nm(t('nd_due_t', { fn: esc(fn()), x: money(R.rest || R.total) })), t('nd_due') + (rate() && R.base / rate() >= 20000 ? ' ' + t('nd_due_big') : ''), t('hq_give'), wa(msgZakat(money(R.rest || R.total))));
const ndUnder = () => nudge('under', t('nd_under_t'), t('nd_under'), t('nd_under_b'), wa(t('m_sadaqa') + mName()));
const ndFitr = R => nudge('fitr', t('nd_fitr_t', { x: R.fp ? money(R.fVal) : qty(R.fKg, 'kg'), n: R.fN }), t('nd_fitr'), t('nd_write'), wa(t('m_fitr', { n: R.fN }) + mName()));
const remindBox = () => `<section class="card remind"><h4>${t('rem_t')}</h4><p class="note">${t('rem_p')}</p><button class="btn" data-act="remind">${ic('p-cal')}${t('rem_b')}</button></section>`;
const followBox = due => `<section class="card follow"><h4>${t('fl_t')}</h4><p>${t(due ? 'fl_p2' : 'fl_p')}</p>
  <a class="cta" target="_blank" rel="noopener" data-act="follow" href="${YT_HQM}">${t('fl_yt')}</a>
  <a class="btn" target="_blank" rel="noopener" data-act="follow" href="${wa(t('m_follow'))}">${ic('p-wa')}${t('fl_wa')}</a></section>`;
const appsBox = () => `<section class="card apps"><h4>${t('apps_t')}</h4><a class="appl" href="${HIFZ_URL}" target="_blank" rel="noopener"><img src="img/hifz.png" alt="" width="44" height="44"><div><b>Hifz Facile</b><small>${t('apps_hifz')}</small></div></a></section>`;
function ndHome(R) {
  const h = hawl();
  if (h && h.days <= 30 && R.total > 0 && !ndOff('hawl')) return nudge('hawl', h.days ? t('nd_hawl_t', { n: h.days }) : t('nd_hawl0_t'), t('nd_hawl'), t('hq_give'), wa(msgZakat(money(R.rest || R.total))));
  if (R.rest > 0) return ndDue(R);
  if (R.base > 0 && !R.malOn && R.total === 0) return followBox();
  return nudge('gen', t('hq_give_t'), t('hq_st2') + ' ' + t('hq_st3'), t('hq_give'), wa(msgZakat('')));
}
function modal(R) {
  const seen = (S.nd.snaps || []).filter(x => Date.now() - x < 7 * 864e5);
  if (S.tips === '0' || seen.length >= 2 || !(R.rest > 0)) return;
  S.nd.snaps = seen.concat(Date.now()); save();
  $('#modal').innerHTML = `<div class="sheet" role="dialog" aria-modal="true" aria-labelledby="mt"><h2 id="mt">${t('nd_snap_t')}</h2><p>${nm(t('nd_snap', { fn: esc(fn()), x: money(R.rest) }))}</p>
    <a class="cta" target="_blank" rel="noopener" data-act="mclose" href="${wa(msgZakat(money(R.rest)))}">${ic('p-wa')}${t('nd_write')}</a>
    <button class="btn" data-act="mclose">${t('nd_later')}</button><label class="never"><input type="checkbox" id="nd-snap" data-never>${t('nd_never')}</label></div>`;
  $('#modal').hidden = false;
}

const LIVE = {
  mal: R => box(R.malOn, !R.nisab ? t('r_need') : R.malOn ? t('r_due') : t('r_nodue'),
    meter(R.base, R.nisab, t('your_assets', { x: money(R.base) }), t('nisab_x', { x: money(R.nisab) })) +
    `<dl class="rows">${rows([[t('row_cash'), money(R.cash)], [t('row_invest'), money(R.invest)], [t('row_recv'), money(R.recv)], [t('row_stock'), money(R.stock)],
      [t('row_gold', { g: qty(R.goldG, 'g') }), money(R.gold)], [t('row_silver', { g: qty(R.silverG, 'g') }), money(R.silver)], [t('row_debt'), '− ' + money(R.debt), 1], [t('row_base'), money(R.base)]])}</dl>` +
    big(t('to_pay'), money(R.mal)) +
    det(`<p dir="ltr">${R.malOn ? `${money(R.base)} × ${pct(R.rt)} = <b>${money(R.mal)}</b>` : ''}</p>${R.malOn ? '' : `<p>${t('detail_under', { b: money(R.base), n: money(R.nisab) })}</p>`}<p class="note">${t(S.ref === 'gold' ? 'detail_gold' : 'detail_silver')}</p>`)) +
    (R.malOn ? ndDue(R) + followBox(true) : R.base > 0 && R.nisab ? followBox() : ''),
  crop: R => box(R.cropOn, R.cropOn ? t('r_due') : R.kg ? t('r_nodue') : t('none_crop'),
    meter(R.kg, R.cn, t('harvest_x', { x: qty(R.kg, 'kg') }), t('nisab_x', { x: qty(R.cn, 'kg') })) + `<dl class="rows">${rows([[t('rate'), pct(R.cr)]].concat(R.cp ? [[t('value'), money(R.cropVal)]] : []))}</dl>` +
    big(t('to_give'), qty(R.cropKg, 'kg')) + det(R.cropOn ? `<p dir="ltr">${qty(R.kg, 'kg')} × ${pct(R.cr)} = <b>${qty(R.cropKg, 'kg')}</b></p>` : `<p>${t('crop_under')}</p>`)),
  herd: R => { const hr = R.herd.filter(h => h[2]).map(h => [`${t(h[0])} (${h[2]})`, h[1].length ? h[1].join(' + ') : t('st_under')]);
    return box(R.herdDue.length > 0, R.herdDue.length ? t('herd_due') : hr.length ? t('r_nodue') : t('none_herd'), (hr.length ? `<dl class="rows">${rows(hr)}</dl>` : '') + `<p class="note">${t('herd_thr')}</p>`) + (R.herdDue.length ? herdHelp(R) : '') },
  rikaz: R => box(R.rik > 0, R.rik ? t('rik_due') : t('none_rik'), big(t('to_pay'), money(R.rik)) + (R.rik ? det(`<p dir="ltr">${money(R.rikV)} × 20 % = <b>${money(R.rik)}</b></p>`) : '')),
  fitr: R => box(R.fN > 0, R.fN ? t('persons', { n: R.fN }) : t('need_persons'), (R.fp ? `<dl class="rows">${rows([[t('value'), money(R.fVal)]])}</dl>` : '') + big(t('food'), qty(R.fKg, 'kg')) +
    det(`<p dir="ltr">${R.fN} × ${qty(num(D().fitr.kg), 'kg')} = <b>${qty(R.fKg, 'kg')}</b></p>`)) + (R.fKg > 0 ? ndFitr(R) : ''),
  nisab: R => `<button class="tile y" data-go="settings"><small>${t('nisab_gold')}</small><b>${R.gp ? money(R.nG) : t('price_need')}</b></button><button class="tile y" data-go="settings"><small>${t('nisab_silver')}</small><b>${R.sp ? money(R.nS) : t('price_need')}</b></button>`,
  stamp: () => isAuto() ? t(S.live ? 'live_at' : 'live_old', { d: fstamp(live0().t) }) : '',
  hawl: () => { const h = hawl(); if (!h) return `<p class="note">${t('hawl_none')}</p>`;
    const ymd = d => d.toISOString().slice(0, 10).replace(/-/g, ''), end = new Date(h.date.getTime() + 864e5);
    return `<div class="result on"><span class="pill">${h.days ? t('in_days', { n: h.days }) : t('today')}</span><dl class="rows">${rows([[t('next_z'), fdate(h.date)]].concat(h.hij ? [[t('hij'), h.hij]] : []))}</dl>
      <a class="btn" target="_blank" rel="noopener" href="https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(t('cal_title'))}&dates=${ymd(h.date)}/${ymd(end)}&details=${encodeURIComponent(t('cal_det'))}">${ic('p-cal')}${t('add_cal')}</a></div>` }
};
const recap = R => { const l = [[t('t_mal'), money(R.mal)], [t('t_crop'), R.cp ? money(R.cropVal) : qty(R.cropKg, 'kg')], [t('t_rikaz'), money(R.rik)], [t('t_fitr'), R.fp ? money(R.fVal) : qty(R.fKg, 'kg')]];
  return t('rc_title') + '\n' + l.map(x => x[0] + ' : ' + x[1]).join('\n') + (R.herdDue.length ? '\n' + t('rc_herd') + ' : ' + R.herdDue.join(' + ') + '\n' + herdKeys(R).map(k => '  – ' + t(k) + ' : ' + t('hh_' + k)).join('\n') : '') + '\n' + t('rc_total') + ' : ' + money(R.total) };

/* ---------- Écrans ---------- */
const STRIP_IC = { mal: ['p-scale', 'p-cal', 'p-pct'], crop: ['p-scale', 'p-cal', 'p-pct'], herd: ['p-scale', 'p-cal', 'p-pct'], rikaz: ['p-what', 'p-cal', 'p-pct'], fitr: ['p-who', 'p-cal', 'p-pct'] };
const BLOCK = { b_what: ['p-what', 'b'], b_who: ['p-who', 'b'], b_cond: ['p-who', 'b'], b_when: ['p-cal', 'b'], b_how: ['p-steps', 'g'], b_do: ['p-steps', 'g'], b_much: ['p-pct', 'g'], b_ex: ['p-ex', 'y'], b_not: ['p-no', 'r'], b_warn: ['p-no', 'r'], b_to: ['p-who', 'g'] };
const course = k => (window.COURSES[S.lang] || window.COURSES.fr)[k];
const back = (to, label) => `<button class="back" data-go="${to}">${ic('n-back')}${label}</button>`;
const V = {
  home(R) {
    const p = R.total > 0 ? Math.min(100, Math.round(R.paid / R.total * 100)) : 0, C = 2 * Math.PI * 34, h = hawl();
    return `<section class="card hero"><div><small>${t('h_due')}</small><b>${money(R.total)}</b><p>${t('h_paid', { x: money(R.paid) })}<br><strong>${t('h_rest', { x: money(R.rest) })}</strong></p></div>
      <svg class="ring" viewBox="0 0 84 84" role="img" aria-label="${t('h_pct', { n: p })}"><circle cx="42" cy="42" r="34" fill="none" stroke="#ffffff" stroke-width="9"/>${p ? `<circle cx="42" cy="42" r="34" fill="none" stroke="#01D758" stroke-width="9" stroke-linecap="round" stroke-dasharray="${C * p / 100} ${C}" transform="rotate(-90 42 42)"/>` : ''}<text x="42" y="47" text-anchor="middle" direction="ltr">${p} %</text></svg></section>
      ${R.herdDue.length ? `<section class="card"><h4>${t('h_kind')}</h4><ul class="due">${R.herdDue.map(x => `<li>${x}</li>`).join('')}</ul></section>` : ''}
      <div class="tiles"><button class="tile y" data-go="settings"><small>${t('h_nisab', { m: t(S.ref === 'gold' ? 'm_gold' : 'm_silver') })}</small><b>${R.nisab ? money(R.nisab) : t('price_need')}</b></button>
        <button class="tile b" data-go="track"><small>${t('h_next')}</small><b>${h ? (h.days ? t('in_days', { n: h.days }) : t('today')) : t('set_date')}</b></button></div>
      <p class="fine" data-live="stamp"></p>
      <h2>${t('h_pick')}</h2>
      <div class="pick">${Object.keys(TYPES).map((k, i) => { const s = status(k, R); return `<button class="tcard${s[1] ? ' on' : ''}${i === 0 ? ' wide' : ''}" data-go="calc-${k}">${ic(TYPES[k])}<div><b>${t('t_' + k)}</b><span>${s[0]}</span></div></button>` }).join('')}</div>
      <div class="actions"><button class="btn pri" data-act="snap">${t('snap')}</button><button class="btn" data-act="copy">${t('copy')}</button></div>
      ${ndHome(R)}<p class="fine">${t('footer')}</p>`;
  },
  calc(R) {
    return `<h2>${t('c_pick')}</h2><p class="lead">${t('c_lead')}</p>
      <div class="pick">${Object.keys(TYPES).map(k => { const s = status(k, R); return `<button class="tcard wide${s[1] ? ' on' : ''}" data-go="calc-${k}">${ic(TYPES[k])}<div><b>${t('t_' + k)}</b><span>${t('d_' + k)}</span><span>${s[0]}</span></div></button>` }).join('')}</div>`;
  },
  calcType(k) {
    const head = `${back('calc', t('back_types'))}<div class="head">${ic(TYPES[k])}<div><h2>${t('t_' + k)}</h2><button class="back" data-go="learn-${k}">${t('read_course')}</button></div></div>`;
    const end = `<div class="live" data-live="${k}"></div><button class="btn pri" data-go="home">${t('see_dash')}</button>`;
    if (k === 'mal') return head + `<div class="tiles" data-live="nisab"></div><p class="info">${t('price_note')} <span data-live="stamp"></span></p>
      <div class="card">${lineList('cash')}${lineList('invest')}${lineList('recv')}${lineList('stock')}</div>
      <div class="card">${metalList('gold', ['24', '22', '21', '18', '14', '9'].map(c => [c, t('carats', { n: c })]))}<p class="info">${t('jewel')}</p>${metalList('silver', [['999', t('s999')], ['925', t('s925')], ['800', t('s800')]])}</div>
      <div class="card">${lineList('debt')}${select(t('l_rate'), 'd.mal.rate', [['0.025', t('rate_l')], ['0.02577', t('rate_s')]])}</div>` + end;
    if (k === 'crop') return head + `<div class="card"><div class="grid">${field(t('crop_kg'), 'd.crop.kg', { unit: 'kg' })}${field(t('crop_n'), 'd.crop.n', { unit: 'kg', hint: t('crop_n_h') })}${field(t('crop_p'), 'd.crop.p', { hint: t('opt_value') })}</div>
      ${select(t('irr'), 'd.crop.irr', [['0.1', t('irr1')], ['0.05', t('irr2')], ['0.075', t('irr3')]])}<p class="info">${t('crop_note')}</p></div>` + end;
    if (k === 'herd') return head + `<div class="card"><div class="grid">${field(t('cam'), 'd.herd.cam', { unit: t('heads') })}${field(t('cow'), 'd.herd.cow', { unit: t('heads') })}${field(t('shp'), 'd.herd.shp', { unit: t('heads') })}</div><p class="info">${t('herd_note')}</p></div>` + end;
    if (k === 'rikaz') return head + `<div class="card">${field(t('rik_v'), 'd.rikaz.v')}</div>` + end;
    return head + `<div class="card"><div class="grid">${field(t('fit_n'), 'd.fitr.n', { unit: t('pers'), hint: t('fit_n_h') })}${field(t('fit_kg'), 'd.fitr.kg', { unit: 'kg', hint: t('fit_kg_h') })}${field(t('fit_p'), 'd.fitr.p', { hint: t('optional') })}</div><p class="info">${t('fit_note')}</p></div>` + end;
  },
  learn() {
    return `<h2>${t('le_title')}</h2><p class="lead">${t('le_lead')}</p>
      <div class="pick">${Object.keys(TYPES).map(k => `<button class="tcard wide" data-go="learn-${k}">${ic(TYPES[k])}<div><b>${t('t_' + k)}</b><span>${course(k).strip.map(s => s[0]).join(' · ')}</span></div></button>`).join('')}
      <button class="tcard wide" data-go="learn-who">${ic('i-who')}<div><b>${t('who_title')}</b><span>${t('who_sub')}</span></div></button>
      <button class="tcard wide" data-go="learn-faq">${ic('i-faq')}<div><b>${t('faq_title')}</b><span>${t('faq_sub')}</span></div></button></div>`;
  },
  learnType(k) {
    const b = back('learn', t('all_courses'));
    if (k === 'who') return b + `<section class="card"><h2>${t('who_title')}</h2><p class="note">${t('who_note')}</p><ol class="chips">${T().who.map(x => `<li>${x}</li>`).join('')}</ol><p class="warn">${t('who_warn')}</p></section>` + nudge('gen', t('hq_give_t'), t('hq_st2') + ' ' + t('hq_st3'), t('hq_give'), wa(msgZakat('')));
    if (k === 'faq') return b + `<h2>${t('faq_title')}</h2>${(window.FAQS[S.lang] || window.FAQS.fr).map(q => `<details><summary>${q[0]}</summary><p>${q[1]}</p></details>`).join('')}<p class="note">${t('faq_note')}</p>`;
    const c = course(k);
    return b + `<div class="card"><h2>${c.title}</h2><p class="note">${t('essentials')}</p><div class="strip">${c.strip.map((s, i) => `<div><span class="bd ${['y', 'b', 'g'][i]}">${ic(STRIP_IC[k][i])}</span><b>${s[0]}</b><small>${s[1]}</small></div>`).join('')}</div></div>
      <div class="card">${c.blocks.map(x => `<div class="lesson"><span class="bd ${BLOCK[x[0]][1]}">${ic(BLOCK[x[0]][0])}</span><div><h4>${t(x[0])}</h4>${x[1]}</div></div>`).join('')}</div>
      <button class="btn pri" data-go="calc-${k}">${t('calc_this')}</button>`;
  },
  track(R) {
    const d = D();
    return `<h2>${t('tr_title')}</h2>
      <section class="card"><h4>${t('my_date')}</h4><div class="field"><label for="i-d-hawl">${t('date_l')}</label><div class="inp"><input id="i-d-hawl" type="date" data-k="d.hawl" value="${esc(d.hawl)}"></div><small>${t('date_h')}</small></div><div data-live="hawl"></div></section>
      <section class="card"><h4>${t('pays')}</h4><dl class="rows">${rows([[t('z_calc'), money(R.total)], [t('paid'), money(R.paid)], [t('rest'), money(R.rest)]])}</dl>
        <div class="grid"><div class="field"><label for="pay-a">${t('pay_a')}</label><div class="inp"><input id="pay-a" inputmode="decimal" placeholder="0" dir="ltr"><span>${esc(sym())}</span></div></div>
        <div class="field"><label for="pay-d">${t('date')}</label><div class="inp"><input id="pay-d" type="date" value="${new Date().toISOString().slice(0, 10)}"></div></div></div>
        <div class="field"><label for="pay-to">${t('pay_to')}</label><input class="lbl" id="pay-to" placeholder="${t('p_pay_to')}"></div>
        <button class="btn pri" data-act="pay">${t('add_pay')}</button>
        ${d.pays.length ? `<ul class="list">${d.pays.map((p, i) => `<li><div><b>${money(num(p.a))}</b><small>${fdate(p.d)}${p.to ? ' · ' + esc(p.to) : ''}</small></div><button class="x" data-act="delpay" data-i="${i}" aria-label="${t('del_pay')}">${ic('n-x')}</button></li>`).join('')}</ul>` : `<p class="note">${t('no_pay')}</p>`}</section>
      <section class="card"><h4>${t('saved')}</h4>${d.hist.length ? `<ul class="list">${d.hist.map((h, i) => `<li><div><b>${esc(h.total)}</b><small>${fdate(h.t)}${h.kind ? ' · ' + esc(h.kind) : ''}</small></div><button class="x" data-act="delhist" data-i="${i}" aria-label="${t('del_saved')}">${ic('n-x')}</button></li>`).join('')}</ul>` : `<p class="note">${t('no_saved')}</p>`}</section>
      <p class="fine">${t('local_note')}</p>`;
  },
  hqm(R) {
    return `<div class="head"><img src="img/logo.jpg" alt="" width="64" height="64" style="border-radius:50%"><div><h2>HQM</h2><p class="note">${t('hq_sub')}</p></div></div>
      <p>${t('hq_intro')}</p>
      <div class="stats"><div><b>37+</b><span>${t('hq_s1')}</span></div><div><b>9</b><span>${t('hq_s2')}</span></div><div><b>13</b><span>${t('hq_s3')}</span></div><div><b>${(3150).toLocaleString(nloc())}</b><span>${t('hq_s4')}</span></div></div>
      <p class="note">${t('hq_s5')}</p><ul class="tags">${T().hq_tags.map(x => `<li>${x}</li>`).join('')}</ul>
      <section class="card hqm"><h2>${t('hq_give_t')}</h2><ol class="steps"><li><b>1.</b> ${t('hq_st1')}</li><li><b>2.</b> ${t('hq_st2')}</li><li><b>3.</b> ${t('hq_st3')}</li></ol>
        <a class="cta" target="_blank" rel="noopener" href="${wa(msgZakat(R.rest > 0 ? money(R.rest) : ''))}">${ic('p-wa')}${t('hq_give')}</a></section>
      <h2>${t('hq_well_t')}</h2><p class="note">${t('hq_well_n')}</p>
      ${[1, 2, 3, 4].map(i => `<article class="well"><img src="img/puits${i}.jpg" alt="${t('w' + i)}" width="520" height="325"><div><b>${t('w' + i)}<span dir="ltr">${WELL_PRICES[i - 1]} US</span></b><p class="note">${t('w' + i + 'd')}</p>
        <a class="btn" target="_blank" rel="noopener" href="${wa(t('m_well', { w: t('w' + i), p: WELL_PRICES[i - 1] }) + mName())}">${ic('p-wa')}${t('fund_well')}</a></div></article>`).join('')}
      <p class="info">${t('hq_hadith')}</p>
      ${appsBox()}
      <section class="card"><h4>${t('hq_contact')}</h4><p>WhatsApp : <a target="_blank" rel="noopener" href="https://wa.me/${WA}" dir="ltr">+229 65 43 56 81</a></p><p>${t('email')} : <span dir="ltr">hifzquranmutun@gmail.com</span></p></section>`;
  },
  settings(R) {
    const u = user(), codes = Object.keys(live0().rates).sort(), all = TOP_CUR.filter(c => codes.includes(c) || SNAP.rates[c]).concat(codes.filter(c => !TOP_CUR.includes(c)));
    const pr = (label, k, v) => `<div class="field"><label for="i-${k}">${label}</label><div class="inp"><input id="i-${k}" ${isAuto() ? `value="${v ? v.toLocaleString('en-US', { maximumFractionDigits: dec() || 2, useGrouping: false }) : ''}" disabled` : `data-k="${k}" value="${esc(S[k])}"`} inputmode="decimal" dir="ltr"><span>${esc(sym())}</span></div></div>`;
    return `<h2>${t('s_title')}</h2>
      <section class="card">${select(t('s_lang'), 'lang', Object.keys(window.I18N).map(l => [l, window.I18N[l].name]))}</section>
      <section class="card"><h4>${t('s_money')}</h4><div class="grid">${select(t('s_cur'), 'cur', all.map(c => [c, curName(c)]))}${select(t('s_mode'), 'auto', [['1', t('auto')], ['0', t('manual')]])}
        ${pr(t('gp'), 'gp', R.gp)}${pr(t('sp'), 'sp', R.sp)}${select(t('ref'), 'ref', [['silver', t('ref_s')], ['gold', t('ref_g')]])}</div>
        <div class="tiles" data-live="nisab"></div><p class="info" data-live="stamp"></p></section>
      <section class="card"><h4>${t('profiles')}</h4><p class="note">${t('profiles_note')}</p>
        <ul class="list">${S.profiles.map((p, i) => `<li><div><b>${esc(p.name)}</b><small>${i === S.active ? t('shown') : ''}</small></div>${i === S.active ? '' : `<button class="btn" data-act="prof" data-i="${i}">${t('show')}</button>`}${S.profiles.length > 1 ? `<button class="x" data-act="delprof" data-i="${i}" aria-label="${t('del_prof')}">${ic('n-x')}</button>` : ''}</li>`).join('')}</ul>
        <div class="field"><label for="newprof">${t('add_person')}</label><input class="lbl" id="newprof" placeholder="${t('f_fn')}"></div><button class="btn" data-act="addprof">${ic('n-plus')}${t('add_prof')}</button></section>
      <section class="card">${select(t('s_tips'), 'tips', [['1', t('tips_on')], ['0', t('tips_off')]])}</section>
      ${u && u.wa ? `<section class="card"><h4>${t('my_sub')}</h4><p><b>${esc(u.fn)}</b> · <span dir="ltr">${esc(u.wa)}</span></p><p class="note">${t('unsub_note')}</p><div id="unsub"><button class="btn danger" data-act="unsub">${t('unsub')}</button></div></section>` : ''}
      <section class="card"><h4>${t('my_data')}</h4><p class="note">${t('data_note')}</p><button class="btn danger" data-act="reset">${t('reset')}</button></section>`;
  }
};

/* ---------- Navigation et événements ---------- */
let route = 'home';
function render() {
  applyLang();
  const R = compute(), [a, b] = route.split('-');
  const html = a === 'calc' && b ? V.calcType(b) : a === 'learn' && b ? V.learnType(b) : (V[a] || V.home)(R);
  $('#view').innerHTML = `<div class="wrap">${html}</div>`;
  $('#who').textContent = P().name; $('.chip').setAttribute('aria-label', t('n_set'));
  $('#nav').innerHTML = [['home', 'n-home'], ['calc', 'n-calc'], ['learn', 'p-what'], ['track', 'n-track'], ['hqm', 'n-heart']].map(x => `<button data-go="${x[0]}"${x[0] === a ? ' aria-current="page"' : ''}>${ic(x[1])}${t('n_' + x[0])}</button>`).join('');
  live(R);
}
function live(R) {
  R = R || compute();
  document.querySelectorAll('[data-live]').forEach(el => { el.innerHTML = LIVE[el.dataset.live](R) });
  document.querySelectorAll('[data-cur]').forEach(s => { s.textContent = sym() });
}
function go(r) { route = r; render(); $('#view').scrollTop = 0 }
let toastT; function toast(x) { const el = $('#toast'); el.textContent = x; el.hidden = false; clearTimeout(toastT); toastT = setTimeout(() => el.hidden = true, 2600) }

document.addEventListener('change', e => {
  if (!e.target.matches('[data-never]')) return;
  S.tips = '0'; save(); $('#modal').hidden = true; toast(t('to_hidden')); render();
});
$('#app').addEventListener('input', e => {
  const k = e.target.dataset.k; if (!k) return;
  setK(k, e.target.value);
  if (k === 'cur') S.curSet = 1;
  if (k === 'auto' && S.auto === '0') { const p = prices(); S.auto = '1'; const q = prices(); S.auto = '0'; S.gp = S.gp || String(+q.gp.toFixed(dec() || 2)); S.sp = S.sp || String(+q.sp.toFixed(dec() || 2)) }
  save();
  if (['lang', 'cur', 'auto', 'look', 'tips', 'ref'].includes(k)) { render(); return }
  live();
});
document.addEventListener('click', e => {
  if ($('#app').hidden) return;
  const g = e.target.closest('[data-go]'); if (g) { go(g.dataset.go); return }
  const b = e.target.closest('[data-act]'); if (!b) return;
  const act = b.dataset.act, d = D(), i = +b.dataset.i;
  if (act === 'mclose') { $('#modal').hidden = true; return }
  if (act === 'ndhide') { S.nd[b.dataset.k] = Date.now() }
  else if (act === 'add') { const c = b.dataset.cat; d.mal[c].push(c === 'gold' ? { a: '', k: '18' } : c === 'silver' ? { a: '', k: '925' } : { l: '', a: '' }) }
  else if (act === 'del') d.mal[b.dataset.cat].splice(i, 1);
  else if (act === 'pay') { const a = num($('#pay-a').value); if (!a) { toast(t('to_amount')); return } d.pays.unshift({ a: String(a), d: $('#pay-d').value || new Date().toISOString().slice(0, 10), to: $('#pay-to').value.trim() }); toast(t('to_paid')) }
  else if (act === 'delpay') d.pays.splice(i, 1);
  else if (act === 'delhist') d.hist.splice(i, 1);
  else if (act === 'remind') { if (!d.hawl) d.hawl = new Date().toISOString().slice(0, 10); save(); toast(t('to_rem')); go('track'); return }
  else if (act === 'snap') { const R = compute(); d.hist.unshift({ t: Date.now(), total: money(R.total), kind: R.herdDue.join(' + ') }); d.hist = d.hist.slice(0, 30); save(); toast(t('to_snap')); modal(R); return }
  else if (act === 'copy') { const txt = recap(compute()); try { navigator.clipboard.writeText(txt).then(() => toast(t('to_copy')), () => toast(t('to_nocopy'))) } catch (x) { toast(t('to_nocopy')) } return }
  else if (act === 'prof') S.active = i;
  else if (act === 'addprof') { const n = $('#newprof').value.trim(); if (!n) { toast(t('to_name')); return } S.profiles.push({ name: n, d: blank() }); S.active = S.profiles.length - 1 }
  else if (act === 'delprof') { if (b.dataset.armed) { S.profiles.splice(i, 1); S.active = 0 } else { b.dataset.armed = 1; toast(t('to_again')); return } }
  else if (act === 'reset') { if (b.dataset.armed) { P().d = blank(); toast(t('to_reset')) } else { b.dataset.armed = 1; b.textContent = t('reset_go'); return } }
  else if (act === 'unsub') {
    if (!b.dataset.armed) { b.dataset.armed = 1; b.textContent = t('unsub_go'); return }
    const u = user(); if (u && u.wa) store(UNSUB, u.wa);
    drop(USER); drop(ACCESS); drop(SYNC); sendUnsub(); $('#app').hidden = true; $('#gate').hidden = false; route = 'home'; renderGate(); window.scrollTo(0, 0); return;
  }
  save(); render();
});
document.addEventListener('visibilitychange', () => { if (!document.hidden && !$('#app').hidden) refresh() });
setInterval(() => { if (!$('#app').hidden) refresh() }, 15 * 60e3);

applyLang(); renderGate(); sendUnsub();
openApp(); if (read(ACCESS)) sendLead();
})();
