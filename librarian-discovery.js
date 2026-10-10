(function(){
const root=document.querySelector('#librarianApp');if(!root)return;
const btn=root.querySelector('#libAskBtn'),input=root.querySelector('#libAskQuery'),card=root.querySelector('#libDemoResult');
if(!btn||!input||!card)return;
const box=document.createElement('div');box.style.cssText='display:none;background:#102a23;border:1px solid #927e5266;border-radius:12px;padding:20px;color:#e6d7b4';
box.innerHTML='<div class="lib-eyebrow">CHATGPT BOOK RESEARCH</div><p>Copy your request, research it in ChatGPT, then paste the JSON response here to populate the book card.</p><button type="button" class="lib-secondary" id="discoveryCopy">Copy Request</button> <button type="button" class="lib-secondary" id="discoveryOpen">Open ChatGPT ↗</button><textarea id="discoveryJSON" rows="6" placeholder="Paste the JSON from ChatGPT…" style="display:block;width:100%;box-sizing:border-box;margin:14px 0;background:#0d241e;color:#eadcb8;border:1px solid #927e5266;border-radius:8px;padding:12px"></textarea><button type="button" class="lib-primary" id="discoveryImport">Show Book Details</button><p id="discoveryError" role="status"></p>';
card.parentElement.insertBefore(box,card);
let request='',found=null;
function start(){const q=input.value.trim();if(!q){input.focus();return}card.classList.remove('show');card.style.display='none';found=null;request='Research this book or question: '+q+'. Return ONLY a JSON object, no markdown, with keys title, author, genre, series, bookNumber, contentRating, synopsis, themes, tropes, publicationDate, publisher, coverUrl. For coverUrl, supply a verified direct HTTPS cover image URL for the correct edition or null; never invent links. Use null for unknown values. Themes and tropes must be arrays of strings. Synopsis must be spoiler-free. Do not guess when ambiguous.';box.style.display='block';box.scrollIntoView({behavior:'smooth',block:'nearest'})}
btn.replaceWith(btn.cloneNode(true));const active=root.querySelector('#libAskBtn');active.onclick=start;input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();e.stopImmediatePropagation();start()}},true);
box.querySelector('#discoveryCopy').onclick=async()=>{try{await navigator.clipboard.writeText(request);alert('Research request copied.')}catch(e){prompt('Copy this request:',request)}};
box.querySelector('#discoveryOpen').onclick=()=>window.open('https://chatgpt.com/','_blank','noopener');
box.querySelector('#discoveryImport').onclick=()=>{
const error=box.querySelector('#discoveryError');error.textContent='';let data;
try{data=JSON.parse(box.querySelector('#discoveryJSON').value.trim().replace(/^\x60\x60\x60(?:json)?\s*/i,'').replace(/\s*\x60\x60\x60$/,''))}catch(e){error.textContent='Please paste valid JSON from ChatGPT.';return}
if(!data||typeof data!=='object'||Array.isArray(data)||!data.title||!data.author){error.textContent='The result needs a title and author. Please verify the research.';return}
let validCover='';if(typeof data.coverUrl==='string'){try{const url=new URL(data.coverUrl);if(url.protocol==='https:'&&!url.username&&!url.password&&data.coverUrl.length<=2000)validCover=url.href}catch(e){}}
found=data;found.coverUrl=validCover;
const coverSlot=card.querySelector('.result-cover')||card.querySelector('.lib-book-cover');
if(coverSlot){let image=coverSlot.querySelector('img[data-librarian-cover]');if(image)image.remove();if(validCover){image=document.createElement('img');image.dataset.librarianCover='1';image.src=validCover;image.alt='Suggested cover for '+data.title;image.referrerPolicy='no-referrer';image.style.cssText='width:100%;height:100%;object-fit:contain';image.onerror=()=>{image.remove();found.coverUrl=''};coverSlot.appendChild(image)}}
card.querySelectorAll('.demo-action').forEach(button=>button.disabled=false);const oldNotice=card.querySelector('.result-actions p');if(oldNotice)oldNotice.remove();
const put=(selector,value)=>{const el=card.querySelector(selector);if(el)el.textContent=value||''};
put('.result-title',data.title);put('.result-author','by '+data.author);put('.result-overview',data.synopsis||'No synopsis available.');
const chips=card.querySelector('.result-chips');chips.replaceChildren();[data.genre,data.series?[data.series,data.bookNumber?'Book '+data.bookNumber:''].filter(Boolean).join(' · '):'',data.contentRating].filter(Boolean).forEach(value=>{const span=document.createElement('span');span.className='result-chip';span.textContent=value;chips.appendChild(span)});
const sections=card.querySelectorAll('.result-section .result-overview');if(sections[0])sections[0].textContent=[...(data.themes||[]),...(data.tropes||[])].join(' · ');if(sections[1])sections[1].textContent=data.series?data.series+(data.bookNumber?' · Book '+data.bookNumber:''):'Standalone or series unknown';
put('.result-kicker','THE LIBRARIAN RESEARCHED');card.classList.add('show');card.style.display='block';card.scrollIntoView({behavior:'smooth',block:'nearest'});
};

const actions=card.querySelectorAll('.demo-action');
const normalize=value=>String(value||'').trim().toLocaleLowerCase().replace(/[^a-z0-9]+/g,'');
const readArray=key=>{try{const value=JSON.parse(localStorage.getItem(key)||'[]');return Array.isArray(value)?value:[]}catch(e){return []}};
const readObject=key=>{try{const value=JSON.parse(localStorage.getItem(key)||'{}');return value&&typeof value==='object'&&!Array.isArray(value)?value:{}}catch(e){return {}}};
const asText=value=>typeof value==='string'?value.trim():'';
function saveBook(destination){
 if(!found){alert('Research a book and review its details before adding it.');return}
 const title=asText(found.title),author=asText(found.author);
 if(!title||!author){alert('Title and author are required.');return}
 const existingLibrary=typeof books!=='undefined'&&books.some(b=>normalize(b.title)===normalize(title)&&normalize(b.author)===normalize(author));
 const existingWishlist=readArray('libraryWishlistV2').some(b=>normalize(b.title)===normalize(title)&&normalize(b.author)===normalize(author));
 if(existingLibrary||existingWishlist){alert('This book is already in '+(existingLibrary?'your Library':'your Wishlist')+'. No duplicate was added.');return}
 const label=destination==='wishlist'?'Wishlist':'Shelf';
 if(!confirm('Add “'+title+'” by '+author+' to your '+label+'? Please verify that the research describes the correct book.'))return;
 const meta={};
 for(const key of ['publicationDate','publisher','synopsis']){const value=asText(found[key]);if(value)meta[key]=value.slice(0,2500)}
 for(const key of ['themes','tropes']){if(Array.isArray(found[key]))meta[key]=found[key].filter(x=>typeof x==='string').slice(0,30)}
 try{
  if(destination==='wishlist'){
   const list=readArray('libraryWishlistV2');
   const item={id:'wish-'+Date.now()+'-'+Math.random().toString(36).slice(2,7),title,author,section:'wishlist',series:asText(found.series),bookNumber:String(found.bookNumber??'').trim(),genre:asText(found.genre),releaseDate:'',format:'',createdAt:new Date().toISOString(),librarianMetadata:meta,coverUrl:found.coverUrl||''};
   list.push(item);localStorage.setItem('libraryWishlistV2',JSON.stringify(list));window.dispatchEvent(new Event('wishlist-updated'));
  }else{
   if(typeof books==='undefined'||typeof order==='undefined')throw Error('Library is not ready');
   const id='m'+Date.now()+'-'+Math.random().toString(36).slice(2,7);
   const b={id,title,author,genre:asText(found.genre)||'Uncategorized',format:'Paperback',read:false,rating:0,spice:0,series:asText(found.series),bookNumber:String(found.bookNumber??'').trim(),color:'#526146'};
   const manual=readArray('manualBooks'),metadata=readObject('librarianMetadata'),visuals=readObject('bookVisuals');
   manual.push(b);if(Object.keys(meta).length)metadata[id]=meta;if(found.coverUrl)visuals[id]={...(visuals[id]||{}),cover:found.coverUrl};
   localStorage.setItem('manualBooks',JSON.stringify(manual));
   localStorage.setItem('librarianMetadata',JSON.stringify(metadata));if(found.coverUrl)localStorage.setItem('bookVisuals',JSON.stringify(visuals));
   books.push(b);order.push(id);localStorage.setItem('bookOrder',JSON.stringify(order));
   if(typeof window.renderShelves==='function')window.renderShelves();
   if(typeof window.renderCards==='function')window.renderCards();
   const total=document.querySelector('#total');if(total)total.textContent=books.length;
  }
  actions.forEach(button=>button.disabled=true);
  const notice=document.createElement('p');notice.style.cssText='color:#c7a86b;margin-top:12px';notice.textContent='✓ “'+title+'” added to your '+label+'.';card.querySelector('.result-actions').appendChild(notice);
 }catch(error){alert('The book could not be saved. Please export a backup and try again.')}
}
if(actions[0])actions[0].onclick=()=>saveBook('wishlist');
if(actions[1])actions[1].onclick=()=>saveBook('library');

})();