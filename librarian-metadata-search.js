(function(){
const root=document.querySelector('#librarianApp'),card=root?.querySelector('#completeBookCard'),btn=root?.querySelector('#findMissingInfo');if(!card||!btn)return;
const panel=document.createElement('div');panel.className='database-metadata-panel';panel.style.cssText='display:none;margin-top:16px;padding:16px;border:1px solid #927e5266;border-radius:10px;background:#17352c;color:#e6d7b4';
panel.innerHTML='<h3 style="color:#f0dfb6">✦ Find Missing Information</h3><p>Search Open Library and Google Books right here. Choose the correct match, then approve updates in your Research Report.</p><button type="button" class="lib-primary" id="searchBookMetadata">Search Book Databases</button> <button type="button" class="lib-secondary" id="metadataFallback">Use ChatGPT Instead</button><p id="metadataStatus" role="status"></p><div id="metadataResults"></div>';
card.insertBefore(panel,card.querySelector('.librarian-bridge'));
const bridge=card.querySelector('.librarian-bridge'),status=panel.querySelector('#metadataStatus'),results=panel.querySelector('#metadataResults');
const clean=s=>String(s||'').toLowerCase().replace(/[^a-z0-9]/g,'');
const first=a=>Array.isArray(a)?a[0]||'':a||'';
const book=()=>typeof books==='undefined'?null:books.find(b=>String(b.id)===String(card.dataset.bookId));
let run=0;
const note=document.createElement('p');note.style.cssText='color:#c7a86b;font-size:13px;line-height:1.5;margin:12px 0';note.hidden=true;note.dataset.databaseSource='yes';bridge.insertBefore(note,bridge.querySelector('#librarianReview'));
const css=document.createElement('style');css.textContent='.librarian-bridge.database-review > .missing-label,.librarian-bridge.database-review > p:not([data-database-source]),.librarian-bridge.database-review > #copyBookPrompt,.librarian-bridge.database-review > #openChatGPT,.librarian-bridge.database-review > #librarianJSON,.librarian-bridge.database-review > #reviewLibrarianJSON{display:none!important}';document.head.appendChild(css);
function resetMode(){bridge.classList.remove('database-review');note.hidden=true}
btn.addEventListener('click',e=>{e.stopImmediatePropagation();e.preventDefault();run++;resetMode();panel.style.display='block';bridge.style.display='none';results.replaceChildren();status.textContent='Click Search Book Databases to look up this title.';panel.scrollIntoView({behavior:'smooth',block:'nearest'})},true);
panel.querySelector('#metadataFallback').onclick=()=>{panel.style.display='none';resetMode();btn.onclick()};
panel.querySelector('#searchBookMetadata').onclick=async()=>{
const b=book();if(!b)return;const token=++run;results.replaceChildren();status.textContent='Searching book databases…';
const g='https://www.googleapis.com/books/v1/volumes?'+new URLSearchParams({q:'intitle:'+b.title+' inauthor:'+b.author,maxResults:'10'});
const o='https://openlibrary.org/search.json?'+new URLSearchParams({title:b.title,author:b.author,limit:'10',fields:'title,author_name,first_publish_year,publisher,subject'});
const fetchData=async url=>{const r=await fetch(url);if(!r.ok)throw Error('Unavailable');return r.json()};
const responses=await Promise.allSettled([fetchData(g),fetchData(o)]);if(token!==run||String(b.id)!==String(card.dataset.bookId))return;
const found=[];
if(responses[0].status==='fulfilled')for(const x of responses[0].value.items||[]){const v=x.volumeInfo||{};found.push({source:'Google Books',title:v.title,author:first(v.authors),genre:first(v.categories),publicationDate:v.publishedDate,publisher:v.publisher,synopsis:(v.description||'').replace(/<[^>]*>/g,' ').slice(0,2500)})}
if(responses[1].status==='fulfilled')for(const v of responses[1].value.docs||[])found.push({source:'Open Library',title:v.title,author:first(v.author_name),genre:first(v.subject),publicationDate:'',originalYear:v.first_publish_year?String(v.first_publish_year):'',publisher:first(v.publisher)});
const matches=found.filter(v=>clean(v.title)===clean(b.title)&&(!b.author||clean(v.author)===clean(b.author))).slice(0,12);
status.textContent=matches.length?'Choose the matching edition. Nothing is saved until you approve the Research Report.':'No exact title-and-author matches found. Try the ChatGPT option.';
for(const v of matches){const box=document.createElement('div');box.style.cssText='border:1px solid #927e5266;border-radius:8px;padding:12px;margin:9px 0;background:#102a23';
const label=document.createElement('p');label.textContent=[v.title,v.author,v.source,v.publisher].filter(Boolean).join(' · ');
const date=document.createElement('p');date.style.cssText='font-size:12px;color:#c7b995';date.textContent=v.originalYear?'First published: '+v.originalYear+' (not an edition date)':v.publicationDate?'Catalog volume date: '+v.publicationDate+' (verify edition)':'Edition publication date unavailable';
const choose=document.createElement('button');choose.className='lib-secondary';choose.textContent='Review Details';choose.type='button';
choose.onclick=()=>{if(String(book()?.id)!==String(b.id))return;const data={title:b.title,author:v.author||null,genre:v.genre||null,series:null,bookNumber:null,publicationDate:v.publicationDate||null,publisher:v.publisher||null,themes:null,tropes:null,synopsis:v.synopsis||null,coverUrl:null};bridge.querySelector('#librarianJSON').value=JSON.stringify(data,null,2);bridge.style.display='block';bridge.querySelector('#reviewLibrarianJSON').click();bridge.classList.add('database-review');note.hidden=false;note.textContent='✦ Source: '+v.source+' · '+(v.originalYear?'First published '+v.originalYear+'; not treated as this edition’s publication date.':v.publicationDate?'Google Books volume date; confirm this edition.':'Edition date unavailable.')+' Only approved fields are saved.';bridge.scrollIntoView({behavior:'smooth',block:'nearest'})};
box.append(label,date,choose);results.appendChild(box)}
};
})();