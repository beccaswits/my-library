// Enhanced shelf drag-and-drop: allow dropping onto books or empty shelf space.
(function(){
  const originalRender = window.renderShelves;
  if (typeof originalRender !== 'function') return;

  window.renderShelves = function(){
    let q=document.querySelector('#search').value.toLowerCase();
    let mode=document.querySelector('#sort').value;
    let list=ordered().filter(b=>(b.title+' '+b.author+' '+b.genre).toLowerCase().includes(q));
    if(mode!=='custom') list.sort((a,b)=>(a[mode]||'').localeCompare(b[mode]||''));
    let root=document.querySelector('#shelves'); root.innerHTML='';
    for(let s=0;s<3;s++){
      let sh=document.createElement('div'); sh.className='shelf'; sh.dataset.shelf=s;
      const shelfBooks=list.slice(s*6,s*6+6);
      sh.ondragover=e=>{e.preventDefault(); sh.style.boxShadow='0 10px 10px #120a07,inset 0 0 24px #c7a86b55'};
      sh.ondragleave=()=>{sh.style.boxShadow=''};
      sh.ondrop=e=>{
        e.preventDefault(); e.stopPropagation(); sh.style.boxShadow='';
        if(!dragged || mode!=='custom' || q) return;
        let from=order.indexOf(dragged); if(from<0) return;
        order.splice(from,1);
        let target=Math.min(s*6+6,order.length);
        order.splice(target,0,dragged);
        localStorage.setItem('bookOrder',JSON.stringify(order)); renderShelves();
      };
      shelfBooks.forEach(b=>{
        let el=document.createElement('button'); el.className='book'; el.draggable=true; el.dataset.id=b.id; el.textContent=b.title; el.style.background=b.color; el.style.height=(135+(b.id*13)%50)+'px'; el.style.width=(28+(b.id*7)%16)+'px';
        el.onclick=()=>openBook(b); el.ondragstart=e=>{dragged=b.id;e.dataTransfer.effectAllowed='move'}; el.ondragover=e=>e.preventDefault();
        el.ondrop=e=>{e.preventDefault();e.stopPropagation();if(dragged&&dragged!==b.id&&mode==='custom'&&!q){let a=order.indexOf(dragged),z=order.indexOf(b.id);order.splice(a,1);z=order.indexOf(b.id);order.splice(z,0,dragged);localStorage.setItem('bookOrder',JSON.stringify(order));renderShelves()}};
        sh.appendChild(el);
      });
      if(s===0){let d=document.createElement('span');d.className='decor';d.textContent='🪴';sh.appendChild(d)}
      if(s===1){let d=document.createElement('span');d.className='decor';d.textContent='🕯️';sh.appendChild(d)}
      if(s===2){let d=document.createElement('span');d.className='decor';d.textContent='🌿';sh.appendChild(d)}
      root.appendChild(sh);
    }
  };
  renderShelves();
})();