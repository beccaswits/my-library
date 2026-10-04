// Move whole shelves up/down while keeping their books and decor together.
(function(){
  if(window.__shelfReorderInitialized)return; window.__shelfReorderInitialized=true;
  const LAYOUT_KEY='bookShelfLayout', COUNT_KEY='libraryShelfCount', DECOR_KEY='libraryDecor';
  const style=document.createElement('style');
  style.textContent=`
    #shelves .shelf{overflow:visible!important}
    .shelf-move-controls{position:absolute;right:8px;top:8px;z-index:12;display:flex;gap:5px;opacity:.38;transition:.18s}
    .shelf:hover .shelf-move-controls{opacity:1}
    .shelf-move-btn{width:28px;height:28px;padding:0;border-radius:50%;border:1px solid #a88c5666;background:#102a23dd;color:#e7d6aa;cursor:pointer;box-shadow:0 2px 6px #0007;font-size:14px;line-height:1}
    .shelf-move-btn:hover{background:#6a4c2d;border-color:#c7a86b;color:#fff0c8}
    .shelf-move-btn:disabled{opacity:.2;cursor:default;background:#102a23dd}
    .shelf-number{position:absolute;left:8px;top:10px;z-index:11;color:#a9977277;font-size:10px;letter-spacing:1px;pointer-events:none}
    @media(max-width:760px){.shelf-move-controls{opacity:.8}.shelf-move-btn{width:25px;height:25px}}
  `;
  document.head.appendChild(style);

  function swapShelves(a,b){
    if(a===b||a<0||b<0)return;
    const count=Number(localStorage.getItem(COUNT_KEY)||0);
    if(a>=count||b>=count)return;
    const layout=JSON.parse(localStorage.getItem(LAYOUT_KEY)||'{}');
    Object.keys(layout).forEach(id=>{
      const s=Number(layout[id]?.shelf);
      if(s===a)layout[id].shelf=b;
      else if(s===b)layout[id].shelf=a;
    });
    localStorage.setItem(LAYOUT_KEY,JSON.stringify(layout));
    let decor=JSON.parse(localStorage.getItem(DECOR_KEY)||'[]');
    if(Array.isArray(decor)){
      decor.forEach(d=>{const s=Number(d.shelf);if(s===a)d.shelf=b;else if(s===b)d.shelf=a});
      localStorage.setItem(DECOR_KEY,JSON.stringify(decor));
    }
    if(typeof window.renderShelves==='function')window.renderShelves();
  }

  function addControls(){
    const shelves=[...document.querySelectorAll('#shelves .shelf[data-shelf]')];
    shelves.forEach((sh,index)=>{
      if(sh.querySelector('.shelf-move-controls'))return;
      const s=Number(sh.dataset.shelf);
      const label=document.createElement('span');label.className='shelf-number';label.textContent='SHELF '+(s+1);sh.appendChild(label);
      const controls=document.createElement('div');controls.className='shelf-move-controls';
      const up=document.createElement('button');up.type='button';up.className='shelf-move-btn';up.textContent='↑';up.title='Move this entire shelf up';up.disabled=s===0;up.onclick=e=>{e.stopPropagation();swapShelves(s,s-1)};
      const down=document.createElement('button');down.type='button';down.className='shelf-move-btn';down.textContent='↓';down.title='Move this entire shelf down';down.disabled=s===shelves.length-1;down.onclick=e=>{e.stopPropagation();swapShelves(s,s+1)};
      controls.append(up,down);sh.appendChild(controls);
    });
  }

  const original=window.renderShelves;
  if(typeof original==='function'){
    window.renderShelves=function(){const result=original.apply(this,arguments);addControls();return result};
  }
  const root=document.querySelector('#shelves');
  if(root)new MutationObserver(()=>addControls()).observe(root,{childList:true,subtree:true});
  addControls();
})();