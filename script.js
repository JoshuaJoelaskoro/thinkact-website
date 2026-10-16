// Tell the <head> fallback that the script started, so animated content can stay hidden until it reveals.
window.__ta2 = true;

(function () {
  'use strict';
  var root = document.documentElement;
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var canObserve = 'IntersectionObserver' in window;

  function money(n, currency) {
    return currency === 'USD' ? '$' + n.toLocaleString('en-US') : 'Rp' + n.toLocaleString('id-ID');
  }

  // Counts a number up or down to its new value; fmt turns the number into text.
  function tween(el, to, fmt, ms) {
    var from = typeof el._v === 'number' ? el._v : to;
    el._v = to;
    if (reduce || from === to) { el.textContent = fmt(to); return; }
    var start = null;
    function step(ts) {
      if (start === null) start = ts;
      var k = Math.min(1, (ts - start) / (ms || 500));
      var eased = 1 - Math.pow(1 - k, 3);
      el.textContent = fmt(Math.round(from + (to - from) * eased));
      if (k < 1 && el._v === to) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  /* ---------- Language switch (EN / ID) ----------
     English is the text in index.html; Indonesian comes from copy-id.js. The choice comes
     from ?lang=id, then the visitor's last pick, then the browser language. */
  var ID = window.TA_COPY_ID || {};
  var EN = {};
  var texts = document.querySelectorAll('[data-i18n]');
  var labels = document.querySelectorAll('[data-i18n-aria]');
  var meta = document.querySelector('meta[name="description"]');
  // Each page has its own title and description keys: "meta.*" on the homepage, "<data-meta>.*" elsewhere.
  var metaKey = root.getAttribute('data-meta') || 'meta';
  EN[metaKey + '.title'] = document.title;
  EN[metaKey + '.description'] = meta ? meta.content : '';
  texts.forEach(function (el) { EN[el.getAttribute('data-i18n')] = el.textContent; });
  labels.forEach(function (el) { EN[el.getAttribute('data-i18n-aria')] = el.getAttribute('aria-label'); });
  // WhatsApp links with data-wa="key" open with a ready-made message: English is in the link itself,
  // Indonesian is the copy-id.js text under that key.
  var waLinks = document.querySelectorAll('[data-wa]');
  waLinks.forEach(function (a) { a._enHref = a.getAttribute('href'); });
  window.taLang = 'en';
  function t(key) { return window.taLang === 'id' && ID[key] != null ? ID[key] : EN[key]; }

  var langButtons = document.querySelectorAll('[data-lang]');
  function applyLang(lang) {
    window.taLang = lang;
    texts.forEach(function (el) { el.textContent = t(el.getAttribute('data-i18n')); });
    labels.forEach(function (el) { el.setAttribute('aria-label', t(el.getAttribute('data-i18n-aria'))); });
    waLinks.forEach(function (a) {
      var message = lang === 'id' ? ID[a.getAttribute('data-wa')] : null;
      a.setAttribute('href', message ? a._enHref.split('?')[0] + '?text=' + encodeURIComponent(message) : a._enHref);
    });
    document.title = t(metaKey + '.title');
    if (meta) meta.content = t(metaKey + '.description');
    root.lang = lang;
    langButtons.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-lang') === lang ? 'true' : 'false'); });
    document.dispatchEvent(new Event('ta:lang'));
  }
  function initialLang() {
    var fromUrl = new URLSearchParams(location.search).get('lang');
    if (fromUrl === 'id' || fromUrl === 'en') return fromUrl;
    try {
      var saved = localStorage.getItem('ta-lang');
      if (saved === 'id' || saved === 'en') return saved;
    } catch (e) {}
    var first = (navigator.languages && navigator.languages[0]) || navigator.language || '';
    return /^(id|in)\b/i.test(first) ? 'id' : 'en';
  }
  langButtons.forEach(function (b) {
    b.addEventListener('click', function () {
      var lang = b.getAttribute('data-lang');
      applyLang(lang);
      try { localStorage.setItem('ta-lang', lang); } catch (e) {}
      var url = new URL(location.href);
      if (lang === 'id') { url.searchParams.set('lang', 'id'); } else { url.searchParams.delete('lang'); }
      history.replaceState(null, '', url);
    });
  });
  if (initialLang() !== 'en') applyLang('id');

  /* ---------- Phone menu ---------- */
  var menuBtn = document.querySelector('.menu-btn');
  var menu = document.getElementById('menu');
  if (menuBtn && menu) {
    var setMenu = function (open) {
      menu.hidden = !open;
      menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
    };
    menuBtn.addEventListener('click', function () { setMenu(menu.hidden); });
    menu.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape') setMenu(false); });
  }

  /* ---------- Reveal on scroll, and pause loops that are off-screen ---------- */
  if (reduce || !canObserve) {
    root.classList.remove('js');
  } else {
    var revealer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-in');
        revealer.unobserve(entry.target);
      });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.12 });
    document.querySelectorAll('.reveal').forEach(function (el) { revealer.observe(el); });
  }
  var loops = document.querySelectorAll('[data-anim]');
  if (canObserve && !reduce) {
    var player = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) { entry.target.classList.toggle('anim', entry.isIntersecting); });
    });
    loops.forEach(function (el) { player.observe(el); });
  }

  /* ---------- Endless strips: duplicate their content once so they can loop seamlessly ---------- */
  if (!reduce) {
    document.querySelectorAll('.feed-col').forEach(function (col) {
      Array.prototype.slice.call(col.children).forEach(function (tile) { col.appendChild(tile.cloneNode(true)); });
    });
    var feed = document.querySelector('.feed');
    if (feed) feed.classList.add('ready');
    var track = document.querySelector('.marquee-track');
    if (track) {
      Array.prototype.slice.call(track.children).forEach(function (item) { track.appendChild(item.cloneNode(true)); });
      track.classList.add('ready');
      // The copies carry data-i18n too; include them in language switching.
      texts = document.querySelectorAll('[data-i18n]');
      if (window.taLang === 'id') applyLang('id');
    }
  }

  /* ---------- Hero: example orders pop up and add to "your share this month" ---------- */
  var stage = document.querySelector('.stage');
  var toast = document.querySelector('.toast');
  if (stage && toast) {
    var orders = [
      ['product.planner', 39000],
      ['product.playbook', 79000],
      ['product.hardway', 59000],
      ['product.kitchen', 49000]
    ];
    var itemEl = toast.querySelector('.toast-item');
    var amtEl = toast.querySelector('.toast-amt');
    var monthEl = stage.querySelector('.month-amt');
    var current = orders.length - 1;
    var month = 3136000;
    monthEl._v = month;
    var showOrder = function () {
      itemEl.textContent = t(orders[current][0]);
      amtEl.textContent = '+' + money(orders[current][1], 'IDR');
    };
    showOrder();
    document.addEventListener('ta:lang', showOrder);
    if (!reduce) {
      setInterval(function () {
        if (document.hidden || !stage.classList.contains('anim')) return;
        toast.classList.add('out');
        setTimeout(function () {
          current = (current + 1) % orders.length;
          showOrder();
          toast.classList.remove('out');
          // Example only: 60% of each sale goes to "your share"; start over before it grows unrealistic.
          month += Math.round(orders[current][1] * 0.6);
          if (month > 3900000) { month = 3136000; monthEl._v = undefined; }
          monthEl.classList.add('bump');
          tween(monthEl, month, function (n) { return money(n, 'IDR'); }, 700);
          setTimeout(function () { monthEl.classList.remove('bump'); }, 900);
        }, 420);
      }, 3200);
    }

    // On devices with a mouse, the guide tilts slightly toward the pointer.
    if (!reduce && window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      var tilt = stage.querySelector('.book-tilt');
      stage.addEventListener('pointermove', function (e) {
        var r = stage.getBoundingClientRect();
        var x = (e.clientX - r.left) / r.width - 0.5;
        var y = (e.clientY - r.top) / r.height - 0.5;
        tilt.style.setProperty('--ry', (x * 16).toFixed(2) + 'deg');
        tilt.style.setProperty('--rx', (-y * 12).toFixed(2) + 'deg');
      });
      stage.addEventListener('pointerleave', function () {
        tilt.style.setProperty('--ry', '0deg');
        tilt.style.setProperty('--rx', '0deg');
      });
    }
  }

  /* ---------- Products shelf: hide the "Swipe" hint once someone swipes ---------- */
  var shelf = document.querySelector('.shelf');
  var hint = document.querySelector('.shelf-hint');
  if (shelf && hint) {
    shelf.addEventListener('scroll', function () {
      if (shelf.scrollLeft > 24) hint.classList.add('hide');
    }, { passive: true });
  }

  /* ---------- Scroll progress bar ---------- */
  var bar = document.querySelector('.progress span');
  if (bar) {
    var ticking = false;
    var update = function () {
      var max = root.scrollHeight - window.innerHeight;
      bar.style.transform = 'scaleX(' + (max > 0 ? Math.min(1, window.scrollY / max) : 0) + ')';
      ticking = false;
    };
    window.addEventListener('scroll', function () {
      if (!ticking) { ticking = true; requestAnimationFrame(update); }
    }, { passive: true });
    update();
  }

  /* ---------- Earnings estimator ---------- */
  var followers = document.getElementById('f-followers');
  var conv = document.getElementById('f-conv');
  var price = document.getElementById('f-price');
  var share = document.getElementById('f-share');
  var curButtons = document.querySelectorAll('[data-cur]');
  if (followers && conv && price && share) {
    var state = { currency: 'IDR', followers: 100000, convX10: 10, priceIDR: 49000, priceUSD: 19, share: 50 };
    var out = function (key) { return document.querySelector('[data-out="' + key + '"]'); };
    var fill = function (input) {
      var min = Number(input.min), max = Number(input.max), v = Number(input.value);
      input.style.setProperty('--p', ((v - min) / (max - min) * 100) + '%');
    };
    var render = function () {
      var isIDR = state.currency === 'IDR';
      var isID = window.taLang === 'id';
      var p = isIDR ? state.priceIDR : state.priceUSD;
      price.min = isIDR ? 15000 : 5;
      price.max = isIDR ? 199000 : 49;
      price.step = isIDR ? 1000 : 1;
      price.value = p;
      var buyers = Math.round(state.followers * state.convX10 / 1000);
      var sales = buyers * p;
      var yours = Math.round(sales * state.share / 100);
      // Indonesian uses 'rb' and 'jt' (in Indonesia 'M' means a billion) and a decimal comma.
      var k = Math.round(state.followers / 1000);
      out('followers').textContent = state.followers >= 1000000 ? (isID ? '1 jt' : '1M') : k + (isID ? ' rb' : 'K');
      var c = (state.convX10 / 10).toFixed(1);
      out('conv').textContent = (isID ? c.replace('.', ',') : c) + '%';
      out('price').textContent = money(p, state.currency);
      out('sharePick').textContent = state.share + '%';
      out('share').textContent = state.share + '%';
      tween(out('buyers'), buyers, function (n) { return n.toLocaleString(isID ? 'id-ID' : 'en-US'); }, 400);
      tween(out('sales'), sales, function (n) { return money(n, state.currency); }, 400);
      tween(out('yours'), yours, function (n) { return money(n, state.currency); }, 600);
      [followers, conv, price, share].forEach(fill);
      curButtons.forEach(function (b) { b.setAttribute('aria-pressed', b.getAttribute('data-cur') === state.currency ? 'true' : 'false'); });
    };
    followers.addEventListener('input', function () { state.followers = Number(followers.value); render(); });
    conv.addEventListener('input', function () { state.convX10 = Number(conv.value); render(); });
    share.addEventListener('input', function () { state.share = Number(share.value); render(); });
    price.addEventListener('input', function () {
      if (state.currency === 'IDR') { state.priceIDR = Number(price.value); } else { state.priceUSD = Number(price.value); }
      render();
    });
    curButtons.forEach(function (b) {
      b.addEventListener('click', function () {
        state.currency = b.getAttribute('data-cur');
        // Switching currency changes the scale, so jump instead of counting.
        ['buyers', 'sales', 'yours'].forEach(function (key) { out(key)._v = undefined; });
        render();
      });
    });
    document.addEventListener('ta:lang', function () {
      ['buyers', 'sales', 'yours'].forEach(function (key) { out(key)._v = undefined; });
      render();
    });
    render();
  }

  /* ---------- Partner earnings estimator (partner page) ----------
     partner share = followers × 0.5% buy × price × (1 − 5% platform fee) × 40% ThinkAct share
                     × 25% partner share (find + manage) × creators, spread over 6 months. */
  var pCreators = document.getElementById('p-creators');
  var pFollowers = document.getElementById('p-followers');
  var pPrice = document.getElementById('p-price');
  if (pCreators && pFollowers && pPrice) {
    var BUY_RATE = 0.005, PLATFORM_FEE = 0.05, THINKACT_SHARE = 0.40, PARTNER_SHARE = 0.25;
    var MONTH_CURVE = [0.40, 0.20, 0.10, 0.10, 0.10, 0.10];
    var pOut = function (key) { return document.querySelector('[data-pout="' + key + '"]'); };
    var monthBars = document.querySelectorAll('.mbar');
    // Short amounts above the bars: 931K / 931 rb, 1.2M / 1,2 jt.
    var compact = function (n) {
      var isID = window.taLang === 'id';
      if (n >= 1000000) {
        var m = (n / 1000000).toFixed(n >= 10000000 ? 0 : 1);
        return isID ? m.replace('.', ',') + ' jt' : m + 'M';
      }
      return Math.round(n / 1000) + (isID ? ' rb' : 'K');
    };
    var pFill = function (input) {
      var min = Number(input.min), max = Number(input.max), v = Number(input.value);
      input.style.setProperty('--p', ((v - min) / (max - min) * 100) + '%');
    };
    var pRender = function () {
      var isID = window.taLang === 'id';
      var creators = Number(pCreators.value);
      var followers = Number(pFollowers.value);
      var price = Number(pPrice.value);
      var total = Math.round(followers * BUY_RATE * price * (1 - PLATFORM_FEE) * THINKACT_SHARE * PARTNER_SHARE * creators);
      pOut('creators').textContent = String(creators);
      pOut('followers').textContent = Math.round(followers / 1000) + (isID ? ' rb' : 'K');
      pOut('price').textContent = money(price, 'IDR');
      tween(pOut('total'), total, function (n) { return money(n, 'IDR'); }, 600);
      var first = total * MONTH_CURVE[0];
      monthBars.forEach(function (bar, i) {
        var amount = Math.round(total * MONTH_CURVE[i]);
        bar.querySelector('.mbar-fill').style.height = (first ? amount / first * 100 : 0) + '%';
        bar.querySelector('.mbar-val').textContent = compact(amount);
      });
      [pCreators, pFollowers, pPrice].forEach(pFill);
    };
    [pCreators, pFollowers, pPrice].forEach(function (input) { input.addEventListener('input', pRender); });
    document.addEventListener('ta:lang', pRender);
    pRender();
  }
})();
