(function(){
const root=document.querySelector('#librarianApp');if(!root)return;
const btn=root.querySelector('#libAskBtn'),input=root.querySelector('#libAskQuery'),card=root.querySelector('#libDemoResult');
if(!btn||!input||!card)return;
const box=document.createElement('div');box.style.cssText='display:none;background:#102a23;border:1px solid #927e5266;border-radius:12px;padding:20px;color:#e6d7b4';
box.innerHTML='<div class="lib-eyebrow">CHATGPT BOOK RESEARCH</div><p>Copy your request, research it in ChatGPT, then paste the JSON response here to populate the book card.</p><button type="button" class="lib-secondary" id="discoveryCopy">Copy Request</button> <button type="button" class="lib-secondary" id="discoveryOpen">Open ChatGPT ↗</button><textarea id="discoveryJSON" rows="6" placeholder="Paste the JSON from ChatGPT…" style="display:block;width:100%;box-sizing:border-box;margin:14px 0;background:#0d241e;color:#eadcb8;border:1px solid #927e5266;border-radius:8px;padding:12px"></textarea><button type="button" class="lib-primary" id="discoveryImport">Show Book Details</button><p id="discoveryError" role="status"></p>';
card.parentElement.insertBefore(box,card);
let request='',found=null;
function start(){const q=input.value.trim();if(!q){input.focus();return}card.classList.remove('show');card.style.display='none';found=null;request='Research this book or question: '+q+'. Return ONLY a JSON object, no markdown, with keys title, author, genre, series, bookNumber, contentRating, synopsis, themes, tropes, publicationDate, publisher. Use null for unknown values. Themes and tropes must be arrays of strings. Synopsis must be spoiler-free. Do not guess when ambiguous.';box.style.display='block';box.scrollIntoView({behavior:'smooth',block:'nearest'})}
btn.replaceWith(btn.cloneNode(true));const active=root.querySelector('#libAskBtn');active.onclick=start;input.addEventListener('keydown',e=>{if(e.key==='Enter'){e.preventDefault();e.stopImmediatePropagation();start()}},true);
box.querySelector('#discoveryCopy').onclick=async()=>{try{await navigator.clipboard.writeText(request);alert('Research request copied.')}catch(e){prompt('Copy this request:',request)}};
box.querySelector('#discoveryOpen').onclick=()=>window.open('https://chatgpt.com/','_blank','noopener');
box.querySelector('#discoveryImport').onclick=()=>{
const error=box.querySelector('#discoveryError');error.textContent='';let data;
try{data=JSON.parse(box.querySelector('#discoveryJSON').value.trim().replace(/^\x60\x60\x60(?:json)?\s*/i,'').replace(/\s*\x60\x60\x60$/,''))}catch(e){error.textContent='Please paste valid JSON from ChatGPT.';return}
if(!data||typeof data!=='object'||Array.isArray(data)||!data.title||!data.author){error.textContent='The result needs a title and author. Please verify the research.';return}
found=data;
const put=(selector,value)=>{const el=card.querySelector(selector);if(el)el.textContent=value||''};
put('.result-title',data.title);put('.result-author','by '+data.author);put('.result-overview',data.synopsis||'No synopsis available.');
const chips=card.querySelector('.result-chips');chips.replaceChildren();[data.genre,data.series?[data.series,data.bookNumber?'Book '+data.bookNumber:''].filter(Boolean).join(' · '):'',data.contentRating].filter(Boolean).forEach(value=>{const span=document.createElement('span');span.className='result-chip';span.textContent=value;chips.appendChild(span)});
const sections=card.querySelectorAll('.result-section .result-overview');if(sections[0])sections[0].textContent=[...(data.themes||[]),...(data.tropes||[])].join(' · ');if(sections[1])sections[1].textContent=data.series?data.series+(data.bookNumber?' · Book '+data.bookNumber:''):'Standalone or series unknown';
put('.result-kicker','THE LIBRARIAN RESEARCHED');card.classList.add('show');card.style.display='block';card.scrollIntoView({behavior:'smooth',block:'nearest'});
};
card.querySelectorAll('.demo-action').forEach(button=>button.onclick=()=>alert('Book research is ready. Adding to your Shelf or Wishlist will be enabled after we connect this result to the existing book-saving workflow.'));
})();