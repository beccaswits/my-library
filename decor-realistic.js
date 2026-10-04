// Photorealistic Decor 2.0 overrides.
// This file may load before decor-assets.js, so expose an override function
// that shelf-drag.js can call immediately after the base assets are ready.
(function () {
  function applyRealisticDecor() {
    if (!window.DECOR_ASSETS) return false;
    window.DECOR_ASSETS.globe = 'globe-realistic.png?v=2';
    window.DECOR_ASSETS.pothos = 'pothos-realistic.png?v=2';
    window.DECOR_ASSETS.cat = 'cat-realistic.png?v=2';
    return true;
  }

  window.applyRealisticDecor = applyRealisticDecor;
  applyRealisticDecor();
})();
