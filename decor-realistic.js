// Photorealistic Decor 2.0 overrides.
(function () {
  function applyRealisticDecor(assets) {
    if (!assets) return assets;
    assets.globe = 'globe-realistic.png?v=4';
    assets.pothos = 'pothos-realistic.png?v=3';
    assets.cat = 'cat-realistic.png?v=3';

    // These filenames match the PNGs uploaded to the repository exactly.
    assets.armillary = 'Armillary%20Sphere.png?v=2';
    assets.bankerLamp = 'Vintage%20Green%20Banker%E2%80%99s%20Lamp.png?v=2';
    assets.crescentMoon = 'Ornate%20Brass%20Crescent%20Moon%20Sculpture.png?v=2';
    assets.antiqueBooks = 'Antique%20Gilded%20Leather%20Book%20Collection.png?v=1';
    return assets;
  }

  function addMetadata() {
    if (window.DECOR_LABELS) {
      window.DECOR_LABELS.armillary = 'Armillary Sphere';
      window.DECOR_LABELS.bankerLamp = 'Green Banker’s Lamp';
      window.DECOR_LABELS.crescentMoon = 'Brass Crescent Moon';
      window.DECOR_LABELS.antiqueBooks = 'Antique Gilded Books';
    }
    if (window.DECOR_SIZES) {
      window.DECOR_SIZES.armillary = {w:104,h:142};
      window.DECOR_SIZES.bankerLamp = {w:110,h:126};
      window.DECOR_SIZES.crescentMoon = {w:82,h:126};
      window.DECOR_SIZES.antiqueBooks = {w:160,h:150};
    }
  }

  if (window.DECOR_ASSETS) {
    applyRealisticDecor(window.DECOR_ASSETS);
    addMetadata();
    return;
  }

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
})();
