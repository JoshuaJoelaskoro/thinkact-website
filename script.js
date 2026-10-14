// Tell the <head> fallback that the script started, so content stays hidden for animating.
window.__taReady = true;

/* ---------- Scroll animations ---------- */
(function () {
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var targets = document.querySelectorAll('[data-reveal], [data-stagger]');
  if (reduce || !('IntersectionObserver' in window)) {
    root.classList.remove('js');
    return;
  }
  // Cards in a row appear one after another, 80ms apart.
  document.querySelectorAll('[data-stagger]').forEach(function (row) {
    Array.prototype.forEach.call(row.children, function (child, i) {
      child.style.transitionDelay = (i * 80) + 'ms';
    });
  });
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('is-visible');
      io.unobserve(entry.target);
    });
  }, { rootMargin: '0px 0px -10% 0px', threshold: 0.1 });
  targets.forEach(function (el) { io.observe(el); });
})();

/* ---------- Language switch (EN / ID) ---------- */
// English is the text in index.html; Indonesian comes from copy-id.js (window.TA_COPY_ID).
// The choice comes from ?lang=id, then the visitor's last pick, then the browser language.
window.taLang = 'en';
(function () {
  var ID = window.TA_COPY_ID;
  var buttons = document.querySelectorAll('[data-lang]');
  if (!ID || !buttons.length) return;
  var texts = document.querySelectorAll('[data-i18n]');
  var labels = document.querySelectorAll('[data-i18n-aria]');
  var meta = document.querySelector('meta[name="description"]');
  var EN = { 'meta.title': document.title, 'meta.description': meta ? meta.content : '' };
  texts.forEach(function (el) { EN[el.getAttribute('data-i18n')] = el.textContent; });
  labels.forEach(function (el) { EN[el.getAttribute('data-i18n-aria')] = el.getAttribute('aria-label'); });

  function apply(lang) {
    var copy = lang === 'id' ? ID : EN;
    function pick(key) { return copy[key] != null ? copy[key] : EN[key]; }
    texts.forEach(function (el) { el.textContent = pick(el.getAttribute('data-i18n')); });
    labels.forEach(function (el) { el.setAttribute('aria-label', pick(el.getAttribute('data-i18n-aria'))); });
    document.title = pick('meta.title');
    if (meta) meta.content = pick('meta.description');
    document.documentElement.lang = lang;
    buttons.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false'); });
    window.taLang = lang;
    document.dispatchEvent(new Event('ta:lang'));
  }

  function initial() {
    var fromUrl = new URLSearchParams(location.search).get('lang');
    if (fromUrl === 'id' || fromUrl === 'en') return fromUrl;
    try {
      var saved = localStorage.getItem('ta-lang');
      if (saved === 'id' || saved === 'en') return saved;
    } catch (e) {}
    var langs = navigator.languages || [navigator.language || ''];
    return /^(id|in)\b/i.test(langs[0] || '') ? 'id' : 'en';
  }

  buttons.forEach(function (b) {
    b.addEventListener('click', function () {
      var lang = b.getAttribute('data-lang');
      apply(lang);
      try { localStorage.setItem('ta-lang', lang); } catch (e) {}
      // Keep the address shareable in the chosen language.
      var url = new URL(location.href);
      if (lang === 'id') { url.searchParams.set('lang', 'id'); } else { url.searchParams.delete('lang'); }
      history.replaceState(null, '', url);
    });
  });

  var start = initial();
  if (start !== 'en') apply(start);
})();

/* ---------- Earnings estimator ---------- */
(function () {
  // The creator's share of each sale (percent) is picked with the "Your share" slider;
  // its range (50-70%) is set on #ta-share in index.html.
  var state = { currency: 'IDR', followers: 100000, convX10: 10, priceIDR: 49000, priceUSD: 19, share: 50 };
  var followers = document.getElementById('ta-followers');
  var conv = document.getElementById('ta-conv');
  var price = document.getElementById('ta-price');
  var share = document.getElementById('ta-share');
  var buttons = document.querySelectorAll('[data-cur]');
  if (!followers || !conv || !price || !share) return;
  function out(key) { return document.querySelector('[data-out="' + key + '"]'); }
  function money(n) {
    return state.currency === 'IDR' ? 'Rp' + n.toLocaleString('id-ID') : '$' + n.toLocaleString('en-US');
  }
  function render() {
    var isIDR = state.currency === 'IDR';
    var p = isIDR ? state.priceIDR : state.priceUSD;
    price.min = isIDR ? 15000 : 5;
    price.max = isIDR ? 199000 : 49;
    price.step = isIDR ? 1000 : 1;
    price.value = p;
    var buyers = Math.round(state.followers * state.convX10 / 1000);
    var sales = buyers * p;
    var yours = Math.round(sales * state.share / 100);
    // Indonesian uses 'rb' and 'jt' (in Indonesia 'M' means a billion) and a decimal comma.
    var isID = window.taLang === 'id';
    var k = Math.round(state.followers / 1000);
    out('followers').textContent = state.followers >= 1000000 ? (isID ? '1 jt' : '1M') : k + (isID ? ' rb' : 'K');
    var conversion = (state.convX10 / 10).toFixed(1);
    out('conv').textContent = (isID ? conversion.replace('.', ',') : conversion) + '%';
    out('price').textContent = money(p);
    out('buyers').textContent = buyers.toLocaleString(isID ? 'id-ID' : 'en-US');
    out('sales').textContent = money(sales);
    out('yours').textContent = money(yours);
    out('share').textContent = state.share + '%';
    out('sharePick').textContent = state.share + '%';
    buttons.forEach(function (b) {
      var on = b.getAttribute('data-cur') === state.currency;
      b.setAttribute('aria-pressed', on ? 'true' : 'false');
      b.style.background = on ? '#F5F5F5' : 'transparent';
      b.style.color = on ? '#0A0A0A' : '#A3A3A3';
    });
  }
  followers.addEventListener('input', function () { state.followers = Number(followers.value); render(); });
  conv.addEventListener('input', function () { state.convX10 = Number(conv.value); render(); });
  share.addEventListener('input', function () { state.share = Number(share.value); render(); });
  price.addEventListener('input', function () {
    var v = Number(price.value);
    if (state.currency === 'IDR') { state.priceIDR = v; } else { state.priceUSD = v; }
    render();
  });
  buttons.forEach(function (b) {
    b.addEventListener('click', function () { state.currency = b.getAttribute('data-cur'); render(); });
  });
  document.addEventListener('ta:lang', render);
  render();
})();
