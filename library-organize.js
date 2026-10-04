// Library tab organization controls: group cards by Author, Genre, Content Rating, Format, or Tags.
(function(){
  const library=document.querySelector('#library');
  const top=library&&library.querySelector('.top');
  const cards=document.querySelector('#cards');
  if(!library||!top||!cards)return;

  const style=document.createElement('style');
  style.textContent=`
    .library-organize{background:#102a23;border:1px solid #8f7a4d66;color:#eee0bd;border-radius:20px;padding:9px 14px}
    .library-group{margin:10px 0 28px}
    .library-group-title{font-size:18px;font-weight:normal;color:#e7d5aa;border-bottom:1px solid #8e794c55;padding:0 2px 8px;margin:0 0 12px;letter-spacing:.4px}
    .library-group-grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:14px}
    .library-card-tags{display:flex;flex-wrap:wrap;gap:4px;margin-top:8px}.library-card-tag{font-size:10px;border:1px solid #8e794c55;border-radius:999px;padding:3px 7px;color:#bfae86;background:#17352c}
  `;
  document.head.appendChild(style);

  const select=document.createElement('select');
  select.id='libraryOrganize';
  select.className='library-organize';
  select.setAttribute('aria-label','Organize library');
  select.innerHTML=`
    <option value="custom">Custom Order</option>
    <option value="author">Author</option>
    <option value="genre">Genre</option>
    <option value="contentRating">Content Rating</option>
    <option value="format">Format</option>
    <option value="tags">Tags</option>
  `;
  const search=document.querySelector('#libsearch');
  if(search){search.placeholder='Search books, authors, genres, tags…';search.insertAdjacentElement('afterend',select)}else top.appendChild(select);

  function text(v,fallback){v=v==null?'':String(v).trim();return v||fallback;}
  function tagsFor(book){return Array.isArray(book.tags)?book.tags.map(t=>String(t).trim()).filter(Boolean):[]}
  function tagKey(tag){return String(tag||'').trim().toLocaleLowerCase()}
  function displayTag(tag){const s=String(tag||'').trim();return s?s.replace(/\b\w/g,c=>c.toUpperCase()):'Untagged'}
  function authorSortName(author){const a=text(author,'Unknown Author');const parts=a.split(/\s+/);return parts.length>1?parts[parts.length-1]+' '+parts.slice(0,-1).join(' '):a;}
  function formatGroup(v){const f=text(v,'Other');if(/kindle|ebook|e-book|digital/i.test(f))return 'Kindle / eBook';if(/audio/i.test(f))return 'Audiobook';if(/hardcover|paperback|physical|print/i.test(f))return 'Physical';return f;}
  function groupValue(book,mode){if(mode==='author')return [text(book.author,'Unknown Author')];if(mode==='genre')return [text(book.genre,'Uncategorized')];if(mode==='contentRating')return [text(book.contentRating,'Not Rated')];if(mode==='format')return [formatGroup(book.format)];if(mode==='tags')return tagsFor(book).length?tagsFor(book):['Untagged'];return [''];}
  function makeCard(book){const c=document.createElement('div');c.className='card';c.dataset.bookId=book.id;const tagHtml=tagsFor(book).length?`<div class="library-card-tags">${tagsFor(book).map(t=>`<span class="library-card-tag">${t.replace(/&/g,'&amp;').replace(/</g,'&lt;')}</span>`).join('')}</div>`:'';c.innerHTML=`<b>${book.title}</b><br><small>${book.author||''}</small><p>${book.genre||'Uncategorized'} · ${book.format||'Other'}</p>${tagHtml}`;c.onclick=()=>openBook(book);return c;}
  function visibleBooks(){const q=(document.querySelector('#libsearch')?.value||'').trim().toLowerCase();return ordered().filter(b=>{const hay=[b.title,b.author,b.genre,b.format,b.contentRating,...tagsFor(b)].map(v=>String(v||'').toLowerCase()).join(' ');return hay.includes(q)});}
  function renderLibraryOrganized(){
    const mode=select.value,list=visibleBooks();cards.innerHTML='';
    if(mode==='custom'){list.forEach(b=>cards.appendChild(makeCard(b)));return}
    const groups=new Map(),labels=new Map();
    list.forEach(b=>groupValue(b,mode).forEach(raw=>{const key=mode==='tags'?tagKey(raw):raw;if(!groups.has(key)){groups.set(key,[]);labels.set(key,mode==='tags'?displayTag(raw):raw)}if(!groups.get(key).some(x=>String(x.id)===String(b.id)))groups.get(key).push(b)}));
    let names=[...groups.keys()];
    names.sort((a,b)=>{const al=labels.get(a),bl=labels.get(b);if(mode==='contentRating'){if(al==='Not Rated')return 1;if(bl==='Not Rated')return -1}if(mode==='tags'){if(a==='untagged')return 1;if(b==='untagged')return -1}if(mode==='format'){const rank={'Physical':0,'Kindle / eBook':1,'Audiobook':2};const ar=rank[al]??3,br=rank[bl]??3;if(ar!==br)return ar-br}return String(al).localeCompare(String(bl),undefined,{numeric:true,sensitivity:'base'})});
    names.forEach(key=>{const section=document.createElement('section');section.className='library-group';const h=document.createElement('h2');h.className='library-group-title';h.textContent=labels.get(key);section.appendChild(h);const grid=document.createElement('div');grid.className='library-group-grid';let group=groups.get(key).slice();group.sort((a,b)=>mode==='author'?authorSortName(a.author).localeCompare(authorSortName(b.author))||String(a.title||'').localeCompare(String(b.title||'')):String(a.title||'').localeCompare(String(b.title||'')));group.forEach(b=>grid.appendChild(makeCard(b)));section.appendChild(grid);cards.appendChild(section)});
  }

  window.renderCards=renderLibraryOrganized;select.onchange=renderLibraryOrganized;const libSearch=document.querySelector('#libsearch');if(libSearch)libSearch.oninput=renderLibraryOrganized;window.addEventListener('library-tags-updated',renderLibraryOrganized);document.querySelectorAll('.nav button').forEach(btn=>{if(btn.dataset.view==='library')btn.addEventListener('click',()=>setTimeout(renderLibraryOrganized,0))});
})();