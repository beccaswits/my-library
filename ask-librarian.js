// Ask the Librarian — Phase 1 interface prototype. AI connection comes later.
(function(){
 const root=document.querySelector('#librarianApp');if(!root||window.__askLibrarianUI)return;window.__askLibrarianUI=true;
 const style=document.createElement('style');style.textContent=`
 #librarian .librarian-shell{max-width:980px;margin:0 auto;display:grid;gap:20px}
 #librarian .librarian-hero{position:relative;overflow:hidden;background:linear-gradient(135deg,#102a23,#173a30);border:1px solid #9b845344;border-radius:14px;padding:30px;box-shadow:0 14px 35px #0005}
 #librarian .librarian-hero:after{content:'❦';position:absolute;right:25px;top:8px;font-size:110px;color:#c7a86b12;transform:rotate(-12deg)}
 #librarian .lib-eyebrow{font-size:10px;letter-spacing:3px;color:#c7a86b;text-transform:uppercase;margin-bottom:8px}.lib-intro{font-size:18px;line-height:1.6;color:#ded2b5;max-width:690px;margin:0}
 #librarian .lib-searchbox{background:#0d241e;border:1px solid #a58b5855;border-radius:12px;padding:18px;display:grid;gap:13px}
 #librarian .lib-searchrow{display:flex;gap:9px}.lib-query{flex:1;background:#17352c;border:1px solid #927e5266;color:#f0e3c2;border-radius:9px;padding:13px 15px;min-width:0}
 #librarian .lib-primary,#librarian .lib-secondary{border-radius:9px;padding:11px 16px;cursor:pointer}.lib-primary{background:#c7a86b;color:#102a23;border:1px solid #c7a86b;font-weight:bold}.lib-secondary{background:#17352c;color:#e6d7b4;border:1px solid #927e5266}
 #librarian .photo-drop{border:1px dashed #a58b5877;border-radius:9px;padding:18px;text-align:center;color:#bbaa83;cursor:pointer;background:#102a2388}.photo-drop:hover{background:#17352c}.photo-drop b{color:#e6d5ad;font-weight:normal}
 #librarian .photo-name{font-size:11px;color:#c7a86b;margin-top:6px}.lib-or{text-align:center;font-size:10px;letter-spacing:2px;color:#776a50}
 #librarian .lib-result{display:none;background:#102a23;border:1px solid #a58b5855;border-radius:14px;padding:22px}.lib-result.show{display:block}.lib-result-grid{display:grid;grid-template-columns:150px 1fr;gap:24px}
 #librarian .result-cover{height:220px;border:4px solid #b99d64;background:linear-gradient(145deg,#4f3429,#19382e);box-shadow:0 9px 20px #0008;display:flex;align-items:center;justify-content:center;text-align:center;padding:14px;color:#f0ddb0;font-size:18px}
 #librarian .result-kicker{font-size:10px;letter-spacing:2px;color:#a99772}.result-title{font-size:27px;color:#f0e1bb;margin:4px 0}.result-author{color:#cabb98;margin-bottom:12px}.result-overview{line-height:1.55;color:#d7ccb1;font-size:14px}
 #librarian .result-chips{display:flex;gap:7px;flex-wrap:wrap;margin:14px 0}.result-chip{border:1px solid #927e5266;background:#17352c;border-radius:999px;padding:5px 9px;color:#d7c79f;font-size:11px}
 #librarian .result-section{border-top:1px solid #927e5233;padding-top:13px;margin-top:13px}.result-section b{color:#e7d6ad;font-weight:normal}.result-actions{display:flex;gap:9px;flex-wrap:wrap;margin-top:18px}
 #librarian .lib-note{font-size:11px;color:#887a5c;text-align:center;line-height:1.5}
 #librarian .complete-box{background:#102a23;border:1px solid #a58b5855;border-radius:14px;padding:22px}.complete-head{display:flex;justify-content:space-between;gap:15px;align-items:center}.complete-title{font-size:20px;color:#eadcb8}.complete-copy{font-size:13px;color:#bfb293;line-height:1.5;margin-top:5px}.complete-list{margin-top:14px;padding:12px;background:#0d241e;border-radius:8px;color:#a99b7b;font-size:12px;line-height:1.6}.complete-book-card{display:none;margin-top:14px;padding:16px;background:#0d241e;border:1px solid #927e5244;border-radius:9px}.complete-book-card.show{display:block}.complete-book-title{font-size:19px;color:#eadcb8}.complete-book-author{color:#b9aa88;margin:3px 0 12px}.missing-label{font-size:10px;letter-spacing:2px;color:#a99772}.missing-items{margin:7px 0 14px;color:#d3c5a4;line-height:1.6}
 #librarian .lib-coming{display:inline-block;border:1px solid #927e5244;border-radius:999px;padding:4px 8px;color:#a99772;font-size:10px;margin-left:8px}
 @media(max-width:650px){#librarian .lib-searchrow{display:grid}#librarian .lib-result-grid{grid-template-columns:1fr}.result-cover{width:145px;margin:auto}}
 `;document.head.appendChild(style);
 root.innerHTML=`
 <div class="librarian-shell">
  <div class="librarian-hero"><div class="lib-eyebrow">Your personal book concierge</div><p class="lib-intro">Curious about a book? Ask by title or show me the cover. I'll identify it, give you the spoiler-free details, and eventually learn your library well enough to tell you whether it belongs on your shelf.</p></div>
  <div class="lib-searchbox">
   <div class="lib-searchrow"><input class="lib-query" id="libAskQuery" placeholder="Search a title, author, series, or ask about a book…"><button class="lib-primary" id="libAskBtn">Ask the Librarian</button></div>
   <div class="lib-or">OR SHOW ME THE BOOK</div>
   <label class="photo-drop" for="libPhoto"><b>▧ Upload a photo of the cover</b><br><small>Take a photo in a bookstore or choose one from your device</small><div class="photo-name" id="libPhotoName"></div></label><input id="libPhoto" type="file" accept="image/*" capture="environment" hidden>
  </div>
  <div class="complete-box"><div class="complete-head"><div><div class="lib-eyebrow">Already on your shelves?</div><div class="complete-title">✦ Complete Book Info</div><div class="complete-copy">Let the Librarian fill in missing details for books you already own — without replacing information you've already entered.</div></div><button class="lib-secondary" id="completeLibraryPreview">Preview</button></div><div class="complete-list" id="completePreview" style="display:none">Future scan: missing author · genre · series & book # · book cover · publication details · themes/tropes<br><b style="color:#d9c9a4;font-weight:normal">You review proposed changes before anything is saved.</b></div><div class="complete-book-card" id="completeBookCard"><div class="missing-label">SELECTED FROM YOUR LIBRARY</div><div class="complete-book-title" id="completeBookTitle"></div><div class="complete-book-author" id="completeBookAuthor"></div><div class="missing-label">CURRENTLY MISSING</div><div class="missing-items" id="completeMissing"></div><button type="button" class="lib-primary" id="findMissingInfo">✦ Find Missing Information</button></div></div>
  <div class="lib-result" id="libDemoResult">
   <div class="lib-result-grid"><div class="result-cover">THE<br>BOOK<br>COVER</div><div>
    <div class="result-kicker">THE LIBRARIAN FOUND</div><div class="result-title">A Sample Book</div><div class="result-author">by Sample Author</div>
    <div class="result-chips"><span class="result-chip">Fantasy</span><span class="result-chip">Sample Series · Book 1</span><span class="result-chip">Adult</span></div>
    <div class="result-overview">This is where your spoiler-free book overview will appear. The Librarian will identify the book, summarize what it is about, and surface the details you care about without making you leave your library to Google them.</div>
    <div class="result-section"><b>Themes & tropes</b><div class="result-overview">Found family · mystery · magical setting · slow-burn romance</div></div>
    <div class="result-section"><b>Series information</b><div class="result-overview">Series name, book number, and reading-order context will appear here when applicable.</div></div>
    <div class="result-actions"><button class="lib-primary demo-action">♡ Add to Wishlist</button><button class="lib-secondary demo-action">▥ Add to Shelf</button></div>
   </div></div>
  </div>
  <div class="lib-note">Interface preview <span class="lib-coming">AI coming next</span><br>This phase does not send photos or searches anywhere yet, and the preview buttons will not modify your real library.</div>
 </div>`;
 window.openLibrarianCompleteBook=function(book){if(!book)return;const card=root.querySelector('#completeBookCard');root.querySelector('#completeBookTitle').textContent=book.title||'Untitled';root.querySelector('#completeBookAuthor').textContent=book.author||'Unknown Author';const missing=[];if(!book.author||book.author==='Unknown Author')missing.push('Author');if(!book.genre||book.genre==='Uncategorized')missing.push('Genre');if(!book.series)missing.push('Series');if(!book.bookNumber)missing.push('Book #');let vis={};try{vis=JSON.parse(localStorage.getItem('bookVisuals')||'{}')}catch(e){}if(!(vis[book.id]&&vis[book.id].cover))missing.push('Book cover');missing.push('Publication details','Themes & tropes');root.querySelector('#completeMissing').textContent=missing.join(' · ');card.dataset.bookId=book.id;const oldBridge=card.querySelector('.librarian-bridge');if(oldBridge){oldBridge.style.display='none';oldBridge.querySelector('#librarianJSON').value='';oldBridge.querySelector('#librarianReview').replaceChildren()}card.classList.add('show');root.querySelector('#completePreview').style.display='none';setTimeout(()=>card.scrollIntoView({behavior:'smooth',block:'center'}),20)};
 
 const card=root.querySelector('#completeBookCard');
 const bridge=document.createElement('div');bridge.className='librarian-bridge';bridge.style.cssText='display:none;margin-top:16px;padding:16px;border:1px solid #927e5266;border-radius:10px;background:#17352c;color:#e6d7b4';
 bridge.innerHTML='<div class="missing-label">CHATGPT RESEARCH BRIDGE</div><p style="font-size:13px;line-height:1.5">Copy the prepared request into ChatGPT, then paste its JSON answer below. Review each change before saving.</p><button type="button" class="lib-secondary" id="copyBookPrompt">Copy Research Request</button> <button type="button" class="lib-secondary" id="openChatGPT">Open ChatGPT ↗</button><textarea id="librarianJSON" rows="7" placeholder="Paste ChatGPT’s JSON response here…" style="display:block;box-sizing:border-box;width:100%;margin:14px 0;background:#0d241e;color:#eadcb8;border:1px solid #927e5266;border-radius:8px;padding:12px"></textarea><button type="button" class="lib-primary" id="reviewLibrarianJSON">Review Proposed Updates</button><div id="librarianReview" style="margin-top:12px"></div>';
 card.appendChild(bridge);
 let researchPrompt='';
 root.querySelector('#findMissingInfo').onclick=()=>{
   const id=card.dataset.bookId;const b=(typeof books!=='undefined'&&books.find(x=>String(x.id)===String(id)));if(!b){alert('Book not found. Please reopen it from your shelf.');return}
   const allowed=['title','author','genre','series','bookNumber','publicationDate','publisher','themes','tropes','synopsis'];
   researchPrompt='Research this existing book for my personal library. Do not invent facts. Confirm the correct book and author; if ambiguous, explain rather than guess. Return ONLY a valid JSON object (no markdown fences) with keys: title, author, genre, series, bookNumber, publicationDate, publisher, themes, tropes, synopsis. Use strings for scalar fields, arrays of strings for themes and tropes, and null for unknowns or not-applicable values. Synopsis must be spoiler-free. Never include unsupported guesses. Existing book record: '+JSON.stringify({id:b.id,title:b.title,author:b.author,genre:b.genre,series:b.series,bookNumber:b.bookNumber})+'. Prioritize filling these missing fields: '+root.querySelector('#completeMissing').textContent+'. This is research, not a request to edit my library.';
   bridge.style.display='block';bridge.scrollIntoView({behavior:'smooth',block:'nearest'});
 };
 bridge.querySelector('#copyBookPrompt').onclick=async()=>{try{await navigator.clipboard.writeText(researchPrompt);alert('Research request copied! Paste it into ChatGPT.')}catch(e){prompt('Copy this request:',researchPrompt)}};
 bridge.querySelector('#openChatGPT').onclick=()=>window.open('https://chatgpt.com/','_blank','noopener');
 const review=bridge.querySelector('#librarianReview');
 const supported=['author','genre','series','bookNumber','publicationDate','publisher','themes','tropes','synopsis'];
 let pending=null;
 bridge.querySelector('#reviewLibrarianJSON').onclick=()=>{
   pending=null;review.replaceChildren();
   let data;try{let raw=bridge.querySelector('#librarianJSON').value.trim().replace(/^\x60\x60\x60(?:json)?\\s*/i,'').replace(/\\s*\x60\x60\x60$/,'');data=JSON.parse(raw)}catch(e){review.textContent='Please paste a valid JSON result from ChatGPT.';return}
   if(!data||typeof data!=='object'||Array.isArray(data)){review.textContent='Expected a JSON object.';return}
   const b=books.find(x=>String(x.id)===String(card.dataset.bookId));if(!b){review.textContent='Book no longer found.';return}
   if(data.title&&String(data.title).trim().toLowerCase()!==String(b.title).trim().toLowerCase()){const notice=document.createElement('div');notice.style.cssText='border:1px solid #c7a86b;padding:12px;border-radius:8px;margin:10px 0;line-height:1.5';const heading=document.createElement('strong');heading.textContent='Please confirm the book identity';const a=document.createElement('p');a.textContent='Your library: '+b.title+' — '+(b.author||'Unknown Author');const z=document.createElement('p');z.textContent='ChatGPT returned: '+data.title+' — '+(data.author||'Unknown Author');const button=document.createElement('button');button.type='button';button.className='lib-secondary';button.textContent='These refer to the same book — continue review';notice.append(heading,a,z,button);review.appendChild(notice);button.onclick=()=>{if(!confirm('Only continue if you have verified these are the same book. Your existing title will not be changed.'))return;const parsed=Object.assign({},data,{title:b.title});bridge.querySelector('#librarianJSON').value=JSON.stringify(parsed,null,2);bridge.querySelector('#reviewLibrarianJSON').click()};return}
   
   const updates={};for(const key of ['title',...supported]){const v=data[key];if(v==null||v==='')continue;if(Array.isArray(v)){if(!['themes','tropes'].includes(key)||!v.every(x=>typeof x==='string'))continue;updates[key]=v.slice(0,30)}else if(typeof v==='string'){updates[key]=v.slice(0,2500)}}
   const detail=JSON.parse(localStorage.getItem('bookDetailOverrides')||'{}')[b.id]||{};
   const metadata=JSON.parse(localStorage.getItem('librarianMetadata')||'{}')[b.id]||{};
   const existing=k=>['publicationDate','publisher','themes','tropes','synopsis'].includes(k)?metadata[k]:(detail[k]!==undefined?detail[k]:b[k]);
   const candidates=Object.entries(updates).filter(([k,v])=>{const old=existing(k);return old==null||old===''||old==='Uncategorized'||old==='Unknown Author'||(Array.isArray(old)&&!old.length)||JSON.stringify(old)!==JSON.stringify(v)});
   if(!candidates.length){review.textContent='No missing fields were found in this response. Your existing details were left unchanged.';return}
   pending={id:String(b.id),candidates};
   const names={title:'Book Title',author:'Author',genre:'Genre',series:'Series',bookNumber:'Book #',publicationDate:'Publication Date',publisher:'Publisher',themes:'Themes',tropes:'Tropes',synopsis:'Spoiler-Free Synopsis'};
   const missingValue=v=>v==null||v===''||v==='Uncategorized'||v==='Unknown Author'||(Array.isArray(v)&&!v.length);
   const formatValue=v=>Array.isArray(v)?v.join(' · '):String(v??'');
   const styleId='librarian-review-styles';if(!document.getElementById(styleId)){const css=document.createElement('style');css.id=styleId;css.textContent=`
   .lib-review-heading{margin:18px 0 5px;font-size:19px;color:#f0dfb6}
   .lib-review-caption{margin:0 0 16px;color:#bcae8b;font-size:13px;line-height:1.5}
   .lib-review-group{margin:15px 0 19px}
   .lib-review-group h4{font-size:11px;letter-spacing:2px;color:#c7a86b;margin:0 0 10px;text-transform:uppercase;font-weight:normal}
   .lib-review-card{display:flex;gap:12px;align-items:flex-start;padding:14px;margin:8px 0;border:1px solid #927e5266;background:#102a23;border-radius:9px;cursor:pointer}
   .lib-review-card:has(input:checked){border-color:#c7a86b88;background:#1a382e}
   .lib-review-card input{margin-top:4px;accent-color:#c7a86b;width:17px;height:17px;flex-shrink:0}
   .lib-review-copy{min-width:0;flex:1}
   .lib-review-label{font-size:15px;color:#f0dfb6;margin-bottom:5px}
   .lib-review-before{font-size:12px;color:#b9a887;margin-bottom:6px;overflow-wrap:anywhere}
   .lib-review-after{font-size:13px;line-height:1.55;color:#e6d7b4;overflow-wrap:anywhere;white-space:pre-wrap}
   .lib-review-status{font-size:10px;letter-spacing:1px;color:#bcae8b;text-transform:uppercase;margin-left:7px}
   .lib-review-actions{display:flex;gap:10px;flex-wrap:wrap;align-items:center;margin-top:18px}
   .lib-review-count{font-size:12px;color:#c7a86b}
   `;document.head.appendChild(css)}
   const heading=document.createElement('h3');heading.className='lib-review-heading';heading.textContent='✦ Librarian’s Research Report';review.appendChild(heading);
   const intro=document.createElement('p');intro.className='lib-review-caption';intro.textContent='Review the research below. Missing details are preselected; your existing information stays unchanged unless you choose to replace it.';review.appendChild(intro);
   const missingGroup=document.createElement('section'),existingGroup=document.createElement('section');
   for(const [group,title] of [[missingGroup,'Fill in missing details'],[existingGroup,'Review existing information']]){group.className='lib-review-group';const h=document.createElement('h4');h.textContent=title;group.appendChild(h);review.appendChild(group)}
   candidates.forEach(([k,v])=>{const old=existing(k),missing=missingValue(old),group=missing?missingGroup:existingGroup;
     const label=document.createElement('label');label.className='lib-review-card';const cb=document.createElement('input');cb.type='checkbox';cb.checked=missing;cb.dataset.field=k;
     const copy=document.createElement('div');copy.className='lib-review-copy';const title=document.createElement('div');title.className='lib-review-label';title.textContent=names[k]||k;
     const status=document.createElement('span');status.className='lib-review-status';status.textContent=missing?'Missing':'Suggested change';title.appendChild(status);copy.appendChild(title);
     if(!missing){const before=document.createElement('div');before.className='lib-review-before';before.textContent='Currently: '+formatValue(old);copy.appendChild(before)}
     const after=document.createElement('div');after.className='lib-review-after';after.textContent=(missing?'Add: ':'Suggested: ')+formatValue(v);copy.appendChild(after);
     label.append(cb,copy);group.appendChild(label);
   });
   if(missingGroup.querySelectorAll('input').length===0)missingGroup.remove();
   if(existingGroup.querySelectorAll('input').length===0)existingGroup.remove();
   const actions=document.createElement('div');actions.className='lib-review-actions';review.appendChild(actions);
   const apply=document.createElement('button');apply.className='lib-primary';apply.type='button';actions.appendChild(apply);
   const counter=document.createElement('span');counter.className='lib-review-count';actions.appendChild(counter);
   const updateCount=()=>{const count=review.querySelectorAll('input:checked').length;apply.textContent='Apply '+count+' Selected Update'+(count===1?'':'s');apply.disabled=count===0;counter.textContent=count+' of '+candidates.length+' selected'};
   review.querySelectorAll('input[type=checkbox]').forEach(cb=>cb.addEventListener('change',updateCount));updateCount();
   apply.onclick=()=>{
     if(!pending||pending.id!==card.dataset.bookId)return;
     const selected=[...review.querySelectorAll('input:checked')].map(x=>x.dataset.field);if(!selected.length)return;
     if(!confirm('Save '+selected.length+' selected fields to this book?'))return;
     const allDetails=JSON.parse(localStorage.getItem('bookDetailOverrides')||'{}'),allMeta=JSON.parse(localStorage.getItem('librarianMetadata')||'{}');
     allDetails[b.id]=allDetails[b.id]||{};allMeta[b.id]=allMeta[b.id]||{};
     for(const [k,v] of pending.candidates){if(!selected.includes(k))continue;if(['publicationDate','publisher','themes','tropes','synopsis'].includes(k))allMeta[b.id][k]=v;else{allDetails[b.id][k]=v;b[k]=v}}
     try{localStorage.setItem('bookDetailOverrides',JSON.stringify(allDetails));localStorage.setItem('librarianMetadata',JSON.stringify(allMeta));review.textContent='✓ Selected updates saved. Reopen this book to see its updated details.';pending=null}catch(e){alert('Unable to save updates in browser storage.')}
   };
 };

 const completeBtn=root.querySelector('#completeLibraryPreview'),completePreview=root.querySelector('#completePreview');completeBtn.onclick=()=>{const open=completePreview.style.display!=='none';completePreview.style.display=open?'none':'block';completeBtn.textContent=open?'Preview':'Hide preview'};
 const query=root.querySelector('#libAskQuery'),photo=root.querySelector('#libPhoto'),name=root.querySelector('#libPhotoName'),result=root.querySelector('#libDemoResult');
 function preview(e){if(e){e.preventDefault();e.stopPropagation()}result.style.display='block';result.classList.add('show');setTimeout(()=>result.scrollIntoView({behavior:'smooth',block:'nearest'}),20)}
 const askBtn=root.querySelector('#libAskBtn');askBtn.type='button';askBtn.addEventListener('click',preview);query.addEventListener('keydown',e=>{if(e.key==='Enter')preview(e)});
 photo.onchange=()=>{name.textContent=photo.files&&photo.files[0]?'Selected: '+photo.files[0].name:'';if(photo.files&&photo.files[0])preview()};
 root.querySelectorAll('.demo-action').forEach(b=>b.onclick=()=>alert('Preview only — once the AI is connected, this will automatically add the identified book with its title, author, series and book number.'));
})();