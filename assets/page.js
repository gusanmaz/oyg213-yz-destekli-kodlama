/* ÖYG213 — notlar ve ana sayfa: tema, yazı boyutu, içindekiler. */
(function () {
  var root = document.documentElement;
  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  function current() {
    return root.getAttribute('data-theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
  }
  var themeBtn = document.getElementById('b-theme');
  function paint() { if (themeBtn) themeBtn.textContent = current() === 'dark' ? '☀' : '☾'; }
  if (themeBtn) {
    themeBtn.onclick = function () {
      var t = current() === 'dark' ? 'light' : 'dark';
      root.setAttribute('data-theme', t);
      store.set('oyg-theme', t);
      paint();
    };
  }
  paint();

  // Yazı boyutu: kök font ölçeği. Tarayıcı yakınlaştırması da (rem tabanlı olduğu için) çalışır.
  var fs = parseFloat(store.get('oyg-fs')) || 1;
  function setFs(v) {
    fs = Math.max(0.8, Math.min(1.6, Math.round(v * 10) / 10));
    root.style.setProperty('--fs', fs);
    store.set('oyg-fs', String(fs));
  }
  setFs(fs);
  var minus = document.getElementById('b-minus'), plus = document.getElementById('b-plus');
  if (minus) minus.onclick = function () { setFs(fs - 0.1); };
  if (plus) plus.onclick = function () { setFs(fs + 0.1); };

  // İçindekiler: dar ekranda aç/kapat, okunan başlığı işaretle
  var toc = document.getElementById('toc'), tocBtn = document.getElementById('b-toc');
  if (toc && tocBtn) {
    tocBtn.onclick = function () { toc.classList.toggle('open'); };
    toc.addEventListener('click', function (e) { if (e.target.tagName === 'A') toc.classList.remove('open'); });
  }
  if (toc && 'IntersectionObserver' in window) {
    var links = {};
    toc.querySelectorAll('a').forEach(function (a) { links[decodeURIComponent(a.getAttribute('href').slice(1))] = a; });
    var obs = new IntersectionObserver(function (entries) {
      entries.forEach(function (en) {
        if (!en.isIntersecting) return;
        toc.querySelectorAll('a.on').forEach(function (a) { a.classList.remove('on'); });
        var a = links[en.target.id];
        if (a) { a.classList.add('on'); if (a.scrollIntoView) a.scrollIntoView({ block: 'nearest' }); }
      });
    }, { rootMargin: '-10% 0px -80% 0px' });
    document.querySelectorAll('.doc h2[id], .doc h3[id]').forEach(function (h) { obs.observe(h); });
  }
})();
