// Optional, user-approved Open Library cover lookup. Does not alter shelf layouts.
(function(){
const root=document.querySelector('#librarianApp');if(!root)return;
const css=document.createElement('style');css.textContent=`
.cover-finder{margin:15px 0;padding:16px;border:1px solid #927e5266;border-radius:10px;background:#102a23;color:#e6d7b4}
.cover-finder h3{margin:0 0 8px;font-size:18px;color:#e9d9ae}
.cover-finder p{font-size:13px;line-height:1.5;color:#c7b995}
.cover-finder-actions{display:flex;gap:9px;flex-wrap:wrap;margin:12px 0}
.cover-finder input{background:#1a382e;color:#f0dfb6;border:1px solid #927e5266;border-radius:7px;padding:10px;min-width:130px;flex:1}
.cover-finder button{background:#c7a86b;color:#102a23;border:1px solid #927e5266;border-radius:7px;padding:9px 12px;cursor:pointer;font:inherit}
.cover-finder-results{display:grid;grid-template-columns:repeat(auto-fill,minmax(125px,1fr));gap:12px;margin-top:12px}
.cover-finder-option{background:#18362d;border:1px solid #927e5266;border-radius:8px;padding:10px;text-align:left;min-width:0}
.cover-finder-option img{display:block;width:100%;height:175px;object-fit:contain;margin-bottom:7px}
.cover-finder-option small{display:block;font-size:11px;overflow-wrap:anywhere;color:#e6d7b4}
.cover-finder-option button{margin-top:8px;width:100%;font-size:12px}
`;document.head.appendChild(css);
function createFinder(target,getBook,onSave){
const host=document.createElement('section');host.className='cover-finder';host.hidden=true;
const title=document.createElement('h3');title.textContent='✦ Find Book Cover';const help=document.createElement('p');help.textContent='Browse covers from Open Library. Verify the artwork and edition before saving. Your current cover stays unchanged until you approve one.';
const fields=document.createElement('div');fields.className='cover-finder-actions';
const name=document.createElement('input');name.placeholder='Book title';name.setAttribute('aria-label','Cover search title');
const author=document.createElement('input');author.placeholder='Author';author.setAttribute('aria-label','Cover search author');
const isbn=document.createElement('input');isbn.placeholder='ISBN (optional)';isbn.setAttribute('aria-label','ISBN');
const search=document.createElement('button');search.type='button';search.textContent='Search Covers';
fields.append(name,author,isbn,search);
const status=document.createElement('p');status.setAttribute('role','status');const results=document.createElement('div');results.className='cover-finder-results';
host.append(title,help,fields,status,results);target.appendChild(host);
let generation=0;
function open(){const book=getBook();if(!book)return;host.hidden=false;name.value=book.title||'';author.value=book.author==='Unknown Author'?'':book.author||'';isbn.value='';results.replaceChildren();status.textContent='';host.scrollIntoView({behavior:'smooth',block:'nearest'})}
search.onclick=async()=>{
const book=getBook();if(!book)return;
const q=name.value.trim(),a=author.value.trim(),id=isbn.value.replace(/[^0-9Xx]/g,'').toUpperCase();
if(!q&&!id){status.textContent='Enter a title or ISBN to search.';return}
const current=++generation;results.replaceChildren();status.textContent='Searching Open Library…';search.disabled=true;
try{
const params=new URLSearchParams({limit:'12',fields:'key,title,author_name,cover_i,edition_key,isbn,first_publish_year'});
if(id)params.set('isbn',id);else{params.set('title',q);if(a)params.set('author',a)}
const response=await fetch('https://openlibrary.org/search.json?'+params.toString(),{headers:{Accept:'application/json'}});
if(!response.ok)throw Error('Search unavailable');
const data=await response.json();if(current!==generation)return;
const found=(Array.isArray(data.docs)?data.docs:[]).filter(x=>Number.isSafeInteger(x.cover_i)&&x.cover_i>0).slice(0,12);
if(!found.length){status.textContent='No cover images found. Try a shorter title, a different spelling, or an ISBN. You can still upload your own cover.';return}
status.textContent='Select the artwork that matches your book. Covers may represent different editions.';
for(const item of found){
const option=document.createElement('div');option.className='cover-finder-option';
const image=document.createElement('img');image.src='https://covers.openlibrary.org/b/id/'+item.cover_i+'-M.jpg';image.alt='Cover of '+item.title;image.loading='lazy';
const caption=document.createElement('small');caption.textContent=[item.title,Array.isArray(item.author_name)?item.author_name[0]:'',item.first_publish_year||''].filter(Boolean).join(' · ');
const use=document.createElement('button');use.type='button';use.textContent='Use This Cover';
image.onerror=()=>{option.remove();if(!results.children.length)status.textContent='These cover images could not be loaded.'};
use.onclick=()=>{const chosen=getBook();if(!chosen)return;if(!confirm('Use this cover for “'+(chosen.title||'this book')+'”? Make sure it is the edition you want.'))return;
try{onSave(chosen,'https://covers.openlibrary.org/b/id/'+item.cover_i+'-L.jpg');status.textContent='✓ Cover saved! Reopen the book to see it.';host.hidden=true}catch(e){status.textContent='Unable to save cover. Your existing cover was not changed.'}};
option.append(image,caption,use);results.appendChild(option)
}
}catch(e){if(current===generation)status.textContent='Cover search is unavailable right now. Please try again later.'}finally{if(current===generation)search.disabled=false}
};
return {host,open}
}
const complete=root.querySelector('#completeBookCard');
if(complete){
const button=document.createElement('button');button.type='button';button.className='lib-secondary';button.textContent='▧ Find Book Cover';button.style.margin='10px 0';complete.appendChild(button);
const finder=createFinder(complete,()=>{const id=complete.dataset.bookId;return typeof books!=='undefined'?books.find(b=>String(b.id)===String(id)):null},(book,url)=>{
const all=JSON.parse(localStorage.getItem('bookVisuals')||'{}');all[book.id]={...(all[book.id]||{}),cover:url};localStorage.setItem('bookVisuals',JSON.stringify(all));
});
button.onclick=()=>finder.open();
}
const result=root.querySelector('#libDemoResult');
if(result){
const button=document.createElement('button');button.type='button';button.className='lib-secondary';button.textContent='▧ Find Book Cover';button.style.marginTop='12px';
const actions=result.querySelector('.result-actions');if(actions)actions.before(button);
let chosen='';
const finder=createFinder(result,()=>({title:result.querySelector('.result-title')?.textContent||'',author:(result.querySelector('.result-author')?.textContent||'').replace(/^by\s+/i,'')}),(_book,url)=>{
chosen=url;
const slot=result.querySelector('.result-cover');if(slot){slot.replaceChildren();const img=document.createElement('img');img.src=url;img.alt='Selected book cover';img.style.cssText='width:100%;height:100%;object-fit:contain';slot.appendChild(img)}
const approval=result.querySelector('label input[type=checkbox]');if(approval){approval.checked=true;approval.closest('label').style.display='block'}
});
button.onclick=()=>finder.open();
// The existing discovery save handler reads its internal found.coverUrl.
// Intercept the user's approved selection before the save handler runs.
if(actions){actions.addEventListener('click',e=>{
if(!e.target.closest('.demo-action')||!chosen)return;
const cover=result.querySelector('label input[type=checkbox]');
if(!cover||!cover.checked)return;
const dataField=root.querySelector('#discoveryJSON');
if(!dataField)return;
try{const data=JSON.parse(dataField.value);data.coverUrl=chosen;dataField.value=JSON.stringify(data,null,2);
root.querySelector('#discoveryImport')?.click();const newApproval=result.querySelector('label input[type=checkbox]');if(newApproval){newApproval.checked=true;newApproval.closest('label').style.display='block'} }catch(err){}
},true)}
}
})();