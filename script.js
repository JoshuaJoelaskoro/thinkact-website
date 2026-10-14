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
    out('followers').textContent = state.followers >= 1000000 ? '1M' : Math.round(state.followers / 1000) + 'K';
    out('conv').textContent = (state.convX10 / 10).toFixed(1) + '%';
    out('price').textContent = money(p);
    out('buyers').textContent = buyers.toLocaleString('en-US');
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
  render();
})();
