// Per-book visual customization: spine color/height + cover upload.
(function(){
  // Safety guard: this feature should initialize only once, even if the script
  // is accidentally loaded twice. Also clean up any duplicate UI left behind.
  const existingCustomizers=document.querySelectorAll('.book-customizer');
  existingCustomizers.forEach((el,i)=>{if(i>0)el.remove()});
  if(window.__bookCustomizeInitialized)return;
  window.__bookCustomizeInitialized=true;

  const KEY='bookVisuals';
  let visuals=JSON.parse(localStorage.getItem(KEY)||'{}');
  let currentBook=null;
  const save=()=>localStorage.setItem(KEY,JSON.stringify(visuals));
  const get=b=>visuals[b.id]||(visuals[b.id]={});
  const applyBookStyles=()=>document.querySelectorAll('.book[data-id]').forEach(el=>{
    const b=books.find(x=>String(x.id)===String(el.dataset.id)); if(!b)return;
    const v=visuals[b.id]||{};
    el.style.background=v.color||b.color;
    el.style.height=(v.height||135+(b.id*13)%50)+'px';
  });

  function wrapCurrentRenderer(){
    const renderer=window.renderShelves;
    if(typeof renderer!=='function'||renderer.__appearanceWrapped)return;
    function wrapped(){
      const result=renderer.apply(this,arguments);
      applyBookStyles();
      return result;
    }
    wrapped.__appearanceWrapped=true;
    window.renderShelves=wrapped;
  }
  wrapCurrentRenderer();
  setTimeout(()=>{wrapCurrentRenderer();applyBookStyles()},0);
  window.addEventListener('load',()=>{wrapCurrentRenderer();applyBookStyles()});

  const style=document.createElement('style');style.textContent=`
    .cover.has-image{padding:0;overflow:hidden;background:#171b18;border-color:#a88f5d}.cover.has-image img{width:100%;height:100%;object-fit:cover;display:block}
    .book-customizer{margin:18px 0;padding:14px;background:#17352c;border:1px solid #927e5266;border-radius:8px}.book-customizer h3{margin:0 0 12px;font-size:14px;font-weight:normal;color:#e9d9ae;letter-spacing:1px}.custom-row{display:grid;grid-template-columns:95px 1fr;gap:10px;align-items:center;margin:10px 0;font-size:13px}.custom-row input[type=color]{width:100%;height:36px;background:#102a23;border:1px solid #8f7a4d66;border-radius:5px;padding:2px}.custom-row input[type=range]{width:100%}.cover-upload{display:block;width:100%;padding:9px;background:#203c32;border:1px solid #927e5266;color:#e8dfc8;border-radius:5px}.cover-actions{display:flex;gap:8px;margin-top:8px}.small-btn{flex:1;padding:7px;border:1px solid #927e5266;background:#102a23;color:#d9caa5;border-radius:5px;cursor:pointer}.height-value{color:#bca978;font-size:12px;margin-left:4px}
  `;document.head.appendChild(style);
  const notes=document.querySelector('#notes');
  // Remove any stale duplicate before creating the one working appearance panel.
  document.querySelectorAll('.book-customizer').forEach(el=>el.remove());
  const custom=document.createElement('div');custom.className='book-customizer';custom.innerHTML=`<h3>BOOK APPEARANCE</h3><div class="custom-row"><label>Spine color</label><input id="spineColor" type="color"></div><div class="custom-row"><label>Spine height</label><div><input id="spineHeight" type="range" min="120" max="190" step="1"><span id="heightValue" class="height-value"></span></div></div><div class="custom-row"><label>Book cover</label><input id="coverUpload" class="cover-upload" type="file" accept="image/*"></div><div class="cover-actions"><button id="resetSpine" class="small-btn">Reset spine</button><button id="removeCover" class="small-btn">Remove cover</button></div>`;
  notes.parentNode.insertBefore(custom,notes);
  const color=document.querySelector('#spineColor'),height=document.querySelector('#spineHeight'),heightValue=document.querySelector('#heightValue'),upload=document.querySelector('#coverUpload'),remove=document.querySelector('#removeCover'),reset=document.querySelector('#resetSpine');
  function paintCover(b){const c=document.querySelector('#cover'),v=visuals[b.id]||{};c.innerHTML='';if(v.cover){c.classList.add('has-image');const img=document.createElement('img');img.src=v.cover;img.alt=b.title+' cover';c.appendChild(img)}else{c.classList.remove('has-image');c.textContent=b.title}}
  const oldOpen=window.openBook;
  window.openBook=function(b){currentBook=b;oldOpen(b);const v=get(b);color.value=v.color||b.color;height.value=v.height||135+(b.id*13)%50;heightValue.textContent=height.value+'px';paintCover(b)};
  color.oninput=()=>{if(!currentBook)return;get(currentBook).color=color.value;save();applyBookStyles()};
  height.oninput=()=>{if(!currentBook)return;get(currentBook).height=Number(height.value);heightValue.textContent=height.value+'px';save();applyBookStyles()};
  reset.onclick=()=>{if(!currentBook)return;const v=get(currentBook);delete v.color;delete v.height;save();color.value=currentBook.color;height.value=135+(currentBook.id*13)%50;heightValue.textContent=height.value+'px';applyBookStyles()};
  remove.onclick=()=>{if(!currentBook)return;delete get(currentBook).cover;save();paintCover(currentBook);upload.value=''};
  upload.onchange=()=>{if(!currentBook||!upload.files[0])return;const file=upload.files[0];if(!file.type.startsWith('image/'))return;const reader=new FileReader();reader.onload=()=>{const img=new Image();img.onload=()=>{const maxW=420,maxH=650,scale=Math.min(1,maxW/img.width,maxH/img.height);const canvas=document.createElement('canvas');canvas.width=Math.max(1,Math.round(img.width*scale));canvas.height=Math.max(1,Math.round(img.height*scale));canvas.getContext('2d').drawImage(img,0,0,canvas.width,canvas.height);get(currentBook).cover=canvas.toDataURL('image/jpeg',.82);try{save();paintCover(currentBook)}catch(e){alert('That image is too large to save in this browser. Try a smaller image.')}};img.src=reader.result};reader.readAsDataURL(file)};
  applyBookStyles();
})();