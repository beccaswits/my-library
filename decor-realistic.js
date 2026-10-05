// Photorealistic Decor 2.0 overrides.
(function () {
  const CLEAN_LABELS = {
    pothos:'Trailing Pothos', globe:'Vintage Globe', cat:'Library Cat',
    armillary:'Armillary', bankerLamp:'Banker Lamp', crescentMoon:'Crescent Moon',
    antiqueBooks:'Antique Books', booksCandles:'Books & Candles', booksIvy:'Books & Ivy',
    realisticHourglass:'Hourglass', crystalBall:'Crystal Ball',
    hangingPottedPlant:'Hanging Potted Plant', vintageCamera:'Vintage Camera',
    mushroomCloche:'Mushroom Cloche'
  };

  function applyRealisticDecor(assets) {
    if (!assets) return assets;
    ['fern','candle','candlestick','lamp','lantern','bust','hourglass','crystal','bookstack','bookend','botanical','vase','driedflowers','teacup','jar','cloche'].forEach(function (key) { delete assets[key]; });
    assets.globe='globe-realistic.png?v=4'; assets.pothos='pothos-realistic.png?v=3'; assets.cat='cat-realistic.png?v=3';
    assets.armillary='armillary_sphere.png?v=3'; assets.bankerLamp='green_bankers_lamp.png?v=3'; assets.crescentMoon='crescent_moon.png?v=3';
    assets.antiqueBooks='Antique%20Gilded%20Leather%20Book%20Collection.png?v=1'; assets.booksCandles='Books%20%26%20Candles.png?v=1'; assets.booksIvy='Books%20%26%20Ivy.png?v=1';
    assets.realisticHourglass='hourglass.png?v=1'; assets.crystalBall='crystal_ball.png?v=1'; assets.hangingPottedPlant='hanging_potted_plant.png?v=1';
    assets.vintageCamera='vintage_camera.png?v=1'; assets.mushroomCloche='mushroom_cloche.png?v=1';
    return assets;
  }

  function addMetadata() {
    if (window.DECOR_LABELS) Object.keys(CLEAN_LABELS).forEach(function(k){ window.DECOR_LABELS[k]=CLEAN_LABELS[k]; });
    if (window.DECOR_SIZES) {
      window.DECOR_SIZES.booksCandles={w:125,h:145}; window.DECOR_SIZES.booksIvy={w:135,h:150};
      window.DECOR_SIZES.realisticHourglass={w:82,h:142}; window.DECOR_SIZES.crystalBall={w:112,h:132};
      window.DECOR_SIZES.hangingPottedPlant={w:120,h:145}; window.DECOR_SIZES.vintageCamera={w:105,h:125}; window.DECOR_SIZES.mushroomCloche={w:112,h:130};
    }
  }

  function decorKey(img){
    var src=decodeURIComponent(img.getAttribute('src')||img.src||'');
    if(/pothos-realistic/i.test(src))return'pothos'; if(/globe-realistic/i.test(src))return'globe'; if(/cat-realistic/i.test(src))return'cat';
    if(/armillary_sphere/i.test(src))return'armillary'; if(/green_bankers_lamp/i.test(src))return'bankerLamp'; if(/crescent_moon/i.test(src))return'crescentMoon';
    if(/Antique Gilded Leather Book Collection/i.test(src))return'antiqueBooks'; if(/Books & Candles/i.test(src))return'booksCandles'; if(/Books & Ivy/i.test(src))return'booksIvy';
    if(/hourglass\.png/i.test(src))return'realisticHourglass'; if(/crystal_ball/i.test(src))return'crystalBall'; if(/hanging_potted_plant/i.test(src))return'hangingPottedPlant';
    if(/vintage_camera/i.test(src))return'vintageCamera'; if(/mushroom_cloche/i.test(src))return'mushroomCloche'; return null;
  }

  function fixDrawerLabels() {
    addMetadata();
    document.querySelectorAll('.decor-choice').forEach(function(choice){
      var img=choice.querySelector('img'),label=choice.querySelector('small'); if(!img||!label)return;
      var key=decorKey(img); if(key&&CLEAN_LABELS[key])label.textContent=CLEAN_LABELS[key];
    });
  }

  // Only the three legacy realistic pieces need a post-render enlargement.
  // Books & Ivy, Books & Candles and Crystal Ball already have their preferred
  // dimensions in DECOR_SIZES, so shelf-drag.js can render them consistently.
  function fixRenderedSizes(root) {
    var scope=root&&root.querySelectorAll?root:document;
    scope.querySelectorAll('img.decor').forEach(function(img){
      var key=decorKey(img),factor=1;
      if(key==='pothos'||key==='globe'||key==='cat')factor=1.18;
      if(key==='antiqueBooks')factor=2.185;
      if(factor===1||img.dataset.finalSizeFix==='1')return;
      var w=parseFloat(img.style.width)||img.getBoundingClientRect().width,h=parseFloat(img.style.height)||img.getBoundingClientRect().height;
      if(!w||!h)return;
      img.style.width=Math.round(w*factor)+'px'; img.style.height=Math.round(h*factor)+'px'; img.style.maxHeight='none'; img.dataset.finalSizeFix='1';
      var wrap=img.closest('.decor-wrap'); if(wrap)wrap.style.width=Math.round((w*factor)*.82)+'px';
    });
  }

  function removeLegacyLeaf(){document.querySelectorAll('.vine').forEach(function(el){el.remove();});}
  function runFixes(){removeLegacyLeaf();fixRenderedSizes(document);fixDrawerLabels();}
  let renderFixQueued=false;
  function queueRenderFix(){if(renderFixQueued)return;renderFixQueued=true;requestAnimationFrame(function(){renderFixQueued=false;runFixes();});}
  function watchShelfRenders(){var root=document.querySelector('#shelves');if(!root)return;new MutationObserver(function(m){if(m.some(function(x){return x.addedNodes&&x.addedNodes.length;}))queueRenderFix();}).observe(root,{childList:true,subtree:true});}
  function installFixes(){removeLegacyLeaf();watchShelfRenders();setTimeout(runFixes,100);setTimeout(runFixes,500);setTimeout(runFixes,1200);setTimeout(runFixes,2500);}

  if(window.DECOR_ASSETS){applyRealisticDecor(window.DECOR_ASSETS);addMetadata();}
  else {let storedAssets;Object.defineProperty(window,'DECOR_ASSETS',{configurable:true,enumerable:true,get:function(){return storedAssets;},set:function(value){storedAssets=applyRealisticDecor(value);setTimeout(addMetadata,0);}});}
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',installFixes,{once:true});else installFixes();
})();
