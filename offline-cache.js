/* Whole-site AppCache status. ES5 for the PS4 browser; no payload code. */
(function () {
  'use strict';
  var panel = document.getElementById('offline-panel');
  var status = document.getElementById('offline-status') || document.getElementById('msgs');
  var detail = document.getElementById('offline-detail');
  var progress = document.getElementById('offline-progress');
  var fill = document.getElementById('offline-progress-fill');
  var action = document.getElementById('offline-action');
  var cache;
  var ready = false;
  var reload = false;
  var supported = false;
  var lastRender = '';

  function show(state, message, note, percent, busy) {
    // AppCache can emit many progress events for the same displayed percent.
    // Do not invalidate text, accessibility nodes and layout for identical data.
    var signature = [state, message, note, percent, busy, reload].join('\n');
    if (signature === lastRender) return;
    lastRender = signature;
    var root = document.documentElement;
    var busyPattern = /(^|\s)cache-busy(?=\s|$)/;
    if (busyPattern.test(root.className) !== !!busy) {
      root.className = root.className.replace(/(^|\s)cache-busy(?=\s|$)/g, ' ')
        .replace(/^\s+|\s+$/g, '') + (busy ? ' cache-busy' : '');
    }
    if (panel) {
      panel.setAttribute('data-state', state);
      panel.setAttribute('aria-busy', busy ? 'true' : 'false');
    }
    if (status) status.textContent = message;
    if (detail) detail.textContent = note;
    if (progress) {
      progress.setAttribute('aria-valuetext', message);
      if (percent === null) progress.removeAttribute('aria-valuenow');
      else progress.setAttribute('aria-valuenow', String(percent));
    }
    if (fill) fill.style.width = (percent === null ? 0 : percent) + '%';
    if (action) {
      action.disabled = !!busy;
      action.textContent = reload ? 'Buka versi terbaru' : 'Periksa / coba lagi';
    }
  }

  function installed() {
    ready = true;
    /* The existing 6.72 host checks this flag on load. Never use it as proof
       that this whole-site cache is complete, and never set it on failure. */
    try { window.localStorage.setItem('cached672', 'yes'); } catch (ignore) {}
    show('ready', 'Seluruh web GoldHEN tersimpan. Siap offline.',
      'Tutup lalu buka kembali browser. Matikan internet dan buka bookmark dengan alamat yang sama untuk menguji salinan offline.', 100, false);
  }

  function failed() {
    reload = false;
    if (ready) {
      show('warning', 'Pembaruan gagal; salinan offline yang sudah selesai masih tersedia.',
        'Sambungkan internet dan coba lagi untuk memperbarui. Jangan hapus data situs jika ingin mempertahankan salinan yang tersimpan.', 100, false);
    } else {
      show('error', 'Penyimpanan seluruh web belum selesai.',
        'Sambungkan internet dan coba lagi. Jika terus gagal, periksa kelengkapan unggahan dan ruang penyimpanan browser. Jangan anggap web sudah siap offline.', null, false);
    }
  }

  if (window.location.protocol === 'file:') {
    show('unsupported', 'Pratinjau lokal. Penyimpanan PS4 perlu alamat web.',
      'Unggah isi folder ke hosting, lalu buka alamat web tersebut melalui browser PS4 saat terhubung internet.', null, false);
    if (action) action.disabled = true;
    return;
  }
  try { cache = window.applicationCache; } catch (ignoreCache) {}
  if (!cache || typeof cache.addEventListener !== 'function') {
    show('unsupported', 'Penyimpanan offline PS4 tidak tersedia di browser ini.',
      'Buka alamat web ini di browser PS4. Pratinjau tampilan dan tautan tetap dapat dibuka di komputer.', null, false);
    if (action) action.disabled = true;
    return;
  }
  supported = true;
  cache.addEventListener('checking', function () {
    reload = false;
    show('checking', 'Memeriksa penyimpanan seluruh web GoldHEN...',
      'Tetap di halaman ini selama pemasangan pertama. Semua halaman dan file lokal akan disimpan bersama.', null, true);
  }, false);
  cache.addEventListener('downloading', function () {
    show('downloading', 'Menyimpan seluruh web GoldHEN...',
      'Jangan tutup browser atau putuskan internet sebelum muncul status siap offline.', 0, true);
  }, false);
  cache.addEventListener('progress', function (event) {
    var total = Number(event.total);
    var loaded = Number(event.loaded);
    var percent = total > 0 && isFinite(total) && isFinite(loaded) ?
      Math.min(99, Math.max(0, Math.floor(loaded * 100 / total))) : null;
    show('downloading', percent === null ? 'Menyimpan seluruh web GoldHEN...' :
      'Menyimpan seluruh web GoldHEN: ' + percent + '%',
      'Tunggu verifikasi akhir. Status siap offline hanya muncul setelah semua file selesai disimpan.', percent, true);
  }, false);
  cache.addEventListener('cached', installed, false);
  cache.addEventListener('noupdate', installed, false);
  cache.addEventListener('updateready', function () {
    reload = true;
    show('update', 'Pembaruan seluruh web selesai disimpan.',
      'Pilih Buka versi terbaru sebelum memakai menu GoldHEN, lalu uji kembali dengan internet dimatikan.', 100, false);
  }, false);
  cache.addEventListener('error', function () {
    /* An offline update check can fail while an associated, complete cache
       remains usable. A failed first installation must never report success. */
    if (cache.status === 1) ready = true;
    failed();
  }, false);
  cache.addEventListener('obsolete', function () {
    ready = false;
    reload = false;
    show('error', 'Salinan offline tidak tersedia lagi.',
      'Sambungkan internet dan muat ulang. Pastikan berkas cache utama masih tersedia pada hosting.', null, false);
  }, false);

  if (action) action.onclick = function () {
    if (reload || cache.status === 0 || cache.status === 5) { window.location.reload(); return; }
    show('checking', 'Memeriksa penyimpanan seluruh web GoldHEN...',
      'Tetap terhubung internet selama pemeriksaan atau pemasangan.', null, true);
    try { cache.update(); } catch (updateError) { failed(); }
  };

  /* Keep a first-time visitor on the harmless home page until installation
     finishes. Firmware scripts are not loaded or executed by this installer. */
  if (panel) document.addEventListener('click', function (event) {
    var target = event.target;
    var parent;
    while (target && target !== document && target.tagName !== 'A') target = target.parentNode;
    if (!target || !target.getAttribute) return;
    if (!target.getAttribute('href') || target.getAttribute('href').charAt(0) === '#') return;
    parent = target.parentNode;
    while (parent && parent !== document) {
      if ((' ' + parent.className + ' ').indexOf(' console-menu ') !== -1) break;
      parent = parent.parentNode;
    }
    if (!parent || parent === document || !supported || (ready && !reload)) return;
    event.preventDefault();
    if (status && status.focus) status.focus();
    if (panel.scrollIntoView) panel.scrollIntoView(true);
  }, false);

  if (cache.status === 1) installed();
  else if (cache.status === 4) {
    reload = true;
    show('update', 'Pembaruan seluruh web selesai disimpan.',
      'Pilih Buka versi terbaru untuk memakai salinan terbaru.', 100, false);
  } else if (cache.status === 3) {
    show('downloading', 'Menyimpan seluruh web GoldHEN...',
      'Jangan tutup browser atau putuskan internet sebelum status siap offline.', null, true);
  } else if (cache.status === 5) {
    show('error', 'Salinan offline tidak tersedia lagi.',
      'Sambungkan internet dan muat ulang halaman ini.', null, false);
  } else if (cache.status === 2) {
    show('checking', 'Memeriksa penyimpanan seluruh web GoldHEN...',
      'Tetap di halaman ini sampai pemeriksaan dan pemasangan seluruh paket selesai.', null, true);
  } else {
    show('checking', 'Menunggu penyimpanan seluruh web GoldHEN...',
      'Pemasangan dimulai otomatis saat online. Jika tidak berjalan atau sebelumnya gagal, pilih Periksa / coba lagi untuk memuat ulang.', null, false);
  }
}());
