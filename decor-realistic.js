// Photorealistic Decor 2.0 overrides.
// This loads before decor-assets.js in the current app, so intercept the
// base asset assignment and swap approved PNGs in immediately.
(function () {
  function applyRealisticDecor(assets) {
    if (!assets) return assets;
    assets.globe = 'globe-realistic.png?v=4';
    assets.pothos = 'pothos-realistic.png?v=3';
    assets.cat = 'cat-realistic.png?v=3';
    assets.armillary = 'armillary-realistic.png?v=1';
    assets.bankerLamp = 'banker-lamp-realistic.png?v=1';
    assets.crescentMoon = 'crescent-moon-realistic.png?v=1';
    return assets;
  }

  if (window.DECOR_ASSETS) {
    applyRealisticDecor(window.DECOR_ASSETS);
    return;
  }

  let storedAssets;
  Object.defineProperty(window, 'DECOR_ASSETS', {
    configurable: true,
    enumerable: true,
    get: function () { return storedAssets; },
    set: function (value) { storedAssets = applyRealisticDecor(value); }
  });
})();
