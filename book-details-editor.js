// Editable book details in the existing book pop-out.
(function(){
  const OVERRIDE_KEY='bookDetailOverrides';
  let overrides=JSON.parse(localStorage.getItem(OVERRIDE_KEY)||'{}');
  let currentBook=null;
  const save=()=>localStorage.setItem(OVERRIDE_KEY,JSON.stringify(overrides));
  const get=b=>overrides[b.id]||(overrides[b.id]={});
  const applySaved=b=>{const o=overrides[b.id]||{};if(o.genre!==undefined)b.genre=o.genre;if(o.read!==undefined)b.read=o.read;if(o.rating!==undefined)b.rating=o.rating;if(o.spice!==undefined)b.spice=o.spice};
  books.forEach(applySaved);

  const style=document.createElement('style');style.textContent=`
    .detail-editor{margin:16px 0;padding:14px;background:#17352c;border:1px solid #927e5266;border-radius:8px}
    .detail-editor h3{margin:0 0 11px;font-size:14px;font-weight:normal;color:#e9d9ae;letter-spacing:1px}
    .detail-edit-grid{display:grid;grid-template-columns:1fr 1fr;gap:9px}
    .detail-edit-field{display:flex;flex-direction:column;gap:5px;font-size:12px;color:#cfc3a5}.detail-edit-field.full{grid-column:1/-1}
    .detail-edit-field input,.detail-edit-field select{width:100%;background:#0b211c;border:1px solid #8f7a4d77;color:#eee0bd;border-radius:5px;padding:8px}
    .rating-picker{display:flex;gap:3px;align-items:center}.rating-star{background:none;border:0;padding:0 1px;color:#695f49;font-size:25px;cursor:pointer;line-height:1}.rating-star.on{color:#dfbd63}.rating-clear{margin-left:6px;background:none;border:0;color:#a99b7c;font-size:11px;cursor:pointer;text-decoration:underline}
    .detail-saved{height:15px;margin-top:7px;text-align:right;color:#9eb9a7;font-size:11px;opacity:0;transition:.2s}.detail-saved.show{opacity:1}
  `;document.head.appendChild(style);

  const meta=document.querySelector('#meta');if(!meta)return;
  const editor=document.createElement('div');editor.className='detail-editor';editor.innerHTML=`<h3>BOOK DETAILS</h3><div class="detail-edit-grid"><div class="detail-edit-field full"><label>Genre</label><input id="editGenre" type="text"></div><div class="detail-edit-field"><label>Read status</label><select id="editRead"><option value="false">Unread</option><option value="true">Read</option></select></div><div class="detail-edit-field"><label>Spice level</label><select id="editSpice"><option value="0">0 — None</option><option value="1">1 🌶️</option><option value="2">2 🌶️</option><option value="3">3 🌶️</option><option value="4">4 🌶️</option><option value="5">5 🌶️</option></select></div><div class="detail-edit-field full"><label>Star rating</label><div class="rating-picker" id="editRating"><button type="button" class="rating-star" data-rating="1">★</button><button type="button" class="rating-star" data-rating="2">★</button><button type="button" class="rating-star" data-rating="3">★</button><button type="button" class="rating-star" data-rating="4">★</button><button type="button" class="rating-star" data-rating="5">★</button><button type="button" class="rating-clear">Clear</button></div></div></div><div class="detail-saved" id="detailSaved">Saved ✓</div>`;
  meta.parentNode.insertBefore(editor,meta.nextSibling);
  const genre=document.querySelector('#editGenre'),read=document.querySelector('#editRead'),spice=document.querySelector('#editSpice'),stars=[...document.querySelectorAll('.rating-star')],clear=document.querySelector('.rating-clear'),saved=document.querySelector('#detailSaved');
  let timer;
  function flash(){saved.classList.add('show');clearTimeout(timer);timer=setTimeout(()=>saved.classList.remove('show'),900)}
  function paintRating(n){stars.forEach(s=>s.classList.toggle('on',Number(s.dataset.rating)<=n))}
  function paintSummary(b){document.querySelector('#rating').textContent=b.rating?'★'.repeat(b.rating)+'☆'.repeat(5-b.rating):'Not rated yet';document.querySelector('#meta').innerHTML=`<div class="chip">${b.genre}</div><div class="chip">${b.format}</div><div class="chip">${b.read?'✓ Read':'○ Unread'}</div><div class="chip">🌶️ ${b.spice}/5</div>`}
  function persistManualIfNeeded(){if(typeof currentBook?.id==='string'&&currentBook.id.startsWith('m')){const manual=books.filter(b=>String(b.id).startsWith('m'));localStorage.setItem('manualBooks',JSON.stringify(manual))}}
  function update(field,value){if(!currentBook)return;currentBook[field]=value;get(currentBook)[field]=value;save();persistManualIfNeeded();paintSummary(currentBook);if(typeof window.renderCards==='function')window.renderCards();const rc=document.querySelector('#readCount');if(rc)rc.textContent=books.filter(b=>b.read).length;flash()}
  genre.onchange=()=>update('genre',genre.value.trim()||'Uncategorized');
  read.onchange=()=>update('read',read.value==='true');
  spice.onchange=()=>update('spice',Number(spice.value));
  stars.forEach(s=>s.onclick=()=>{const n=Number(s.dataset.rating);paintRating(n);update('rating',n)});clear.onclick=()=>{paintRating(0);update('rating',0)};

  const oldOpen=window.openBook;
  window.openBook=function(b){applySaved(b);currentBook=b;oldOpen(b);genre.value=b.genre||'';read.value=String(!!b.read);spice.value=String(Number(b.spice)||0);paintRating(Number(b.rating)||0)};
})();