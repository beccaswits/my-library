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
 #librarian .complete-box{background:#102a23;border:1px solid #a58b5855;border-radius:14px;padding:22px}.complete-head{display:flex;justify-content:space-between;gap:15px;align-items:center}.complete-title{font-size:20px;color:#eadcb8}.complete-copy{font-size:13px;color:#bfb293;line-height:1.5;margin-top:5px}.complete-list{margin-top:14px;padding:12px;background:#0d241e;border-radius:8px;color:#a99b7b;font-size:12px;line-height:1.6}
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
  <div class="complete-box"><div class="complete-head"><div><div class="lib-eyebrow">Already on your shelves?</div><div class="complete-title">✦ Complete Book Info</div><div class="complete-copy">Let the Librarian fill in missing details for books you already own — without replacing information you've already entered.</div></div><button class="lib-secondary" id="completeLibraryPreview">Preview</button></div><div class="complete-list" id="completePreview" style="display:none">Future scan: missing author · genre · series & book # · book cover · publication details · themes/tropes<br><b style="color:#d9c9a4;font-weight:normal">You review proposed changes before anything is saved.</b></div></div>
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
 const completeBtn=root.querySelector('#completeLibraryPreview'),completePreview=root.querySelector('#completePreview');completeBtn.onclick=()=>{const open=completePreview.style.display!=='none';completePreview.style.display=open?'none':'block';completeBtn.textContent=open?'Preview':'Hide preview'};
 const query=root.querySelector('#libAskQuery'),photo=root.querySelector('#libPhoto'),name=root.querySelector('#libPhotoName'),result=root.querySelector('#libDemoResult');
 function preview(e){if(e){e.preventDefault();e.stopPropagation()}result.style.display='block';result.classList.add('show');setTimeout(()=>result.scrollIntoView({behavior:'smooth',block:'nearest'}),20)}
 const askBtn=root.querySelector('#libAskBtn');askBtn.type='button';askBtn.addEventListener('click',preview);query.addEventListener('keydown',e=>{if(e.key==='Enter')preview(e)});
 photo.onchange=()=>{name.textContent=photo.files&&photo.files[0]?'Selected: '+photo.files[0].name:'';if(photo.files&&photo.files[0])preview()};
 root.querySelectorAll('.demo-action').forEach(b=>b.onclick=()=>alert('Preview only — once the AI is connected, this will automatically add the identified book with its title, author, series and book number.'));
})();