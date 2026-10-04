// Photorealistic Decor 2.0 overrides.
(function () {
  function applyRealisticDecor(assets) {
    if (!assets) return assets;
    assets.globe = 'globe-realistic.png?v=4';
    assets.pothos = 'pothos-realistic.png?v=3';
    assets.cat = 'cat-realistic.png?v=3';
    assets.armillary = 'Armillary%20Sphere.png?v=2';
    assets.bankerLamp = 'Vintage%20Green%20Banker%E2%80%99s%20Lamp.png?v=2';
    assets.crescentMoon = 'Ornate%20Brass%20Crescent%20Moon%20Sculpture.png?v=2';
    assets.antiqueBooks = 'Antique%20Gilded%20Leather%20Book%20Collection.png?v=1';
    assets.booksCandles = 'Books%20%26%20Candles.png?v=1';
    assets.booksIvy = 'Books%20%26%20Ivy.png?v=1';
    assets.realisticHourglass = 'hourglass.png?v=1';
    assets.crystalBall = 'crystal_ball.png?v=1';
    return assets;
  }

  function addMetadata() {
    if (window.DECOR_LABELS) {
      window.DECOR_LABELS.armillary = 'Armillary Sphere';
      window.DECOR_LABELS.bankerLamp = 'Green Banker’s Lamp';
      window.DECOR_LABELS.crescentMoon = 'Brass Crescent Moon';
      window.DECOR_LABELS.antiqueBooks = 'Antique Gilded Books';
      window.DECOR_LABELS.booksCandles = 'Books & Candles';
      window.DECOR_LABELS.booksIvy = 'Books & Ivy';
      window.DECOR_LABELS.realisticHourglass = 'Antique Hourglass';
      window.DECOR_LABELS.crystalBall = 'Crystal Ball';
    }
    if (window.DECOR_SIZES) {
      window.DECOR_SIZES.booksCandles = {w:125,h:145};
      window.DECOR_SIZES.booksIvy = {w:135,h:150};
      window.DECOR_SIZES.realisticHourglass = {w:82,h:142};
      window.DECOR_SIZES.crystalBall = {w:112,h:132};
    }
  }

  // shelf-drag.js writes its own inline dimensions after the metadata file loads.
  // Apply the requested final visual sizing to the rendered shelf images instead.
  function fixRenderedSizes(root) {
    var scope = root && root.querySelectorAll ? root : document;
    scope.querySelectorAll('img.decor').forEach(function (img) {
      var src = decodeURIComponent(img.getAttribute('src') || img.src || '');
      var factor = 1;
      if (/pothos-realistic\.png/i.test(src) || /globe-realistic\.png/i.test(src) || /cat-realistic\.png/i.test(src)) factor = 1.18;
      if (/Antique Gilded Leather Book Collection\.png/i.test(src)) factor = 2.185;
      if (factor === 1 || img.dataset.finalSizeFix === '1') return;

      var w = parseFloat(img.style.width) || img.getBoundingClientRect().width;
      var h = parseFloat(img.style.height) || img.getBoundingClientRect().height;
      if (!w || !h) return;
      img.style.width = Math.round(w * factor) + 'px';
      img.style.height = Math.round(h * factor) + 'px';
      img.style.maxHeight = 'none';
      img.dataset.finalSizeFix = '1';

      var wrap = img.closest('.decor-wrap');
      if (wrap) wrap.style.width = Math.round((w * factor) * 0.82) + 'px';
    });
  }

  function installSizeWatcher() {
    var run = function () { fixRenderedSizes(document); };
    setTimeout(run, 100);
    setTimeout(run, 500);
    if (document.body) {
      new MutationObserver(function (mutations) {
        mutations.forEach(function (m) {
          m.addedNodes.forEach(function (node) {
            if (node.nodeType === 1) fixRenderedSizes(node);
          });
        });
      }).observe(document.body, {childList:true, subtree:true});
    } else {
      document.addEventListener('DOMContentLoaded', installSizeWatcher, {once:true});
    }
  }

  if (window.DECOR_ASSETS) {
    applyRealisticDecor(window.DECOR_ASSETS);
    addMetadata();
  } else {
    let storedAssets;
    Object.defineProperty(window, 'DECOR_ASSETS', {
      configurable: true,
      enumerable: true,
      get: function () { return storedAssets; },
      set: function (value) {
        storedAssets = applyRealisticDecor(value);
        setTimeout(addMetadata, 0);
      }
    });
  }

  installSizeWatcher();
})();
