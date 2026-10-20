/* Decorative photo rows. ES5; CSS handles motion without a JavaScript frame loop. */
(function () {
  'use strict';
  var photos = [{"src":"assets/menu/makanan/indomie-goreng-jumbo.png","width":192,"height":163},{"src":"assets/menu/makanan/indomie-soto.png","width":192,"height":163},{"src":"assets/menu/makanan/mix-platter-jadoel.png","width":192,"height":89},{"src":"assets/menu/makanan/mix-platter-kekinian.png","width":192,"height":93},{"src":"assets/menu/makanan/mix-platter-nextlevel.png","width":192,"height":100},{"src":"assets/menu/makanan/samyang-2x-spicy-buldak.png","width":192,"height":163},{"src":"assets/menu/makanan/samyang-cheese-buldak.png","width":192,"height":163},{"src":"assets/menu/makanan/samyang-hotter-than-my-ex.png","width":192,"height":163},{"src":"assets/menu/makanan/samyang-rose-buldak.png","width":192,"height":163},{"src":"assets/menu/makanan/telur-ceplok.png","width":192,"height":172},{"src":"assets/menu/minuman/choco-fams.png","width":189,"height":192},{"src":"assets/menu/minuman/crystallin.png","width":55,"height":192},{"src":"assets/menu/minuman/es-cokelat.png","width":109,"height":192},{"src":"assets/menu/minuman/es-cookies-cream.png","width":108,"height":192},{"src":"assets/menu/minuman/es-creamy.png","width":109,"height":192},{"src":"assets/menu/minuman/es-melon.png","width":109,"height":192},{"src":"assets/menu/minuman/es-teh.png","width":109,"height":192},{"src":"assets/menu/minuman/es-vanilla-blue.png","width":109,"height":192},{"src":"assets/menu/minuman/golda-coffee.png","width":112,"height":192},{"src":"assets/menu/minuman/good-day-kemasan.png","width":192,"height":134},{"src":"assets/menu/minuman/le-minerale.png","width":74,"height":192},{"src":"assets/menu/minuman/nescafe-kemasan.png","width":192,"height":131},{"src":"assets/menu/minuman/pop-ice-kemasan.png","width":192,"height":170},{"src":"assets/menu/minuman/soda.png","width":192,"height":125},{"src":"assets/menu/minuman/tea-jus-kemasan.png","width":192,"height":108},{"src":"assets/menu/minuman/top-ice-cokelat.png","width":130,"height":192},{"src":"assets/menu/snack/cheesy-bomb.png","width":189,"height":192},{"src":"assets/menu/snack/cireng.png","width":192,"height":192},{"src":"assets/menu/snack/fried-wonton.png","width":192,"height":191},{"src":"assets/menu/snack/kaki-naga.png","width":191,"height":192},{"src":"assets/menu/snack/kentang-goreng-01.png","width":189,"height":192},{"src":"assets/menu/snack/kentang-goreng-02.png","width":189,"height":192},{"src":"assets/menu/snack/maklor-respawn.png","width":190,"height":192},{"src":"assets/menu/snack/mie-tusuk.png","width":192,"height":189},{"src":"assets/menu/snack/nacho-cheese.png","width":183,"height":192},{"src":"assets/menu/snack/nugget-stik.png","width":190,"height":192},{"src":"assets/menu/snack/nugget-tusuk.png","width":192,"height":170},{"src":"assets/menu/snack/shrimp-ball.png","width":189,"height":192},{"src":"assets/menu/snack/sosis-mini.png","width":190,"height":192}];
  var root = document.getElementById('food-background');
  var resizeTimer;
  var lastWidth = 0;
  var lastHeight = 0;
  if (!root || !photos.length) return;

  function shuffled(list) {
    var copy = list.slice(0);
    var i, j, value;
    for (i = copy.length - 1; i > 0; i -= 1) {
      j = Math.floor(Math.random() * (i + 1));
      value = copy[i];
      copy[i] = copy[j];
      copy[j] = value;
    }
    return copy;
  }

  function setPaused() {
    root.className = 'food-background' + (document.hidden ? ' food-background--paused' : '');
  }

  function build() {
    var width = window.innerWidth || document.documentElement.clientWidth || 1280;
    var height = window.innerHeight || document.documentElement.clientHeight || 720;
    var rowCount, rowHeight, slotWidth, deck, fragment;
    var rowIndex, pool, i, row, track, group, count, period, duration, delay, photo, slot, img;
    if (width === lastWidth && height === lastHeight) return;
    lastWidth = width;
    lastHeight = height;
    rowCount = Math.max(4, Math.min(9, Math.ceil(height / 150)));
    rowHeight = height / rowCount;
    slotWidth = Math.max(104, Math.min(186, Math.round(width / 10)));
    deck = shuffled(photos);
    fragment = document.createDocumentFragment();

    for (rowIndex = 0; rowIndex < rowCount; rowIndex += 1) {
      pool = [];
      for (i = rowIndex; i < deck.length; i += rowCount) pool.push(deck[i]);
      pool = shuffled(pool);
      count = Math.max(pool.length, Math.ceil(width / slotWidth) + 1);
      period = count * slotWidth;
      duration = period / (24 + Math.random() * 8);
      delay = -Math.random() * duration;

      row = document.createElement('div');
      row.className = 'food-row food-row--' + (rowIndex % 2 === 0 ? 'right' : 'left');
      row.setAttribute('data-row', String(rowIndex + 1));
      row.setAttribute('data-direction', rowIndex % 2 === 0 ? 'right' : 'left');
      row.style.top = (rowIndex * rowHeight) + 'px';
      row.style.height = rowHeight + 'px';

      track = document.createElement('div');
      track.className = 'food-track';
      track.style.width = (period * 2) + 'px';
      track.style.animationDuration = duration.toFixed(2) + 's';
      track.style.webkitAnimationDuration = duration.toFixed(2) + 's';
      track.style.animationDelay = delay.toFixed(2) + 's';
      track.style.webkitAnimationDelay = delay.toFixed(2) + 's';

      group = document.createElement('div');
      group.className = 'food-group';
      group.style.width = period + 'px';
      for (i = 0; i < count; i += 1) {
        photo = pool[i % pool.length];
        slot = document.createElement('div');
        slot.className = 'food-slot';
        slot.style.width = slotWidth + 'px';
        slot.style.flexBasis = slotWidth + 'px';
        img = document.createElement('img');
        img.src = photo.src;
        img.alt = '';
        img.width = photo.width;
        img.height = photo.height;
        img.setAttribute('draggable', 'false');
        img.setAttribute('decoding', 'async');
        slot.appendChild(img);
        group.appendChild(slot);
      }
      track.appendChild(group);
      track.appendChild(group.cloneNode(true));
      row.appendChild(track);
      fragment.appendChild(row);
    }

    while (root.firstChild) root.removeChild(root.firstChild);
    root.appendChild(fragment);
    root.setAttribute('data-row-count', String(rowCount));
    root.setAttribute('data-photo-count', String(photos.length));
    setPaused();
  }

  build();
  window.addEventListener('resize', function () {
    window.clearTimeout(resizeTimer);
    resizeTimer = window.setTimeout(build, 160);
  }, false);
  document.addEventListener('visibilitychange', setPaused, false);
}());
