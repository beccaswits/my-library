// Editable library name displayed in the bookcase arch.
(function(){
  const KEY='libraryName';
  const DEFAULT='MY CONSERVATORY LIBRARY';
  const arch=document.querySelector('.arch');
  if(!arch)return;

  const style=document.createElement('style');
  style.textContent=`
    .arch:before{content:none!important}
    .library-name-display{letter-spacing:5px;font-size:14px;color:#cbb47e;text-align:center;text-transform:uppercase;padding:0 20px;max-width:88%;line-height:1.5;cursor:pointer;text-shadow:0 2px 8px #0008}
    .library-name-display:hover{color:#ead7a3}
    .library-name-editor{position:absolute;top:12px;left:50%;transform:translateX(-50%);z-index:4;display:flex;gap:7px;align-items:center;background:#102a23e8;border:1px solid #9f875866;border-radius:20px;padding:6px 8px;box-shadow:0 5px 14px #0006}
    .library-name-input{width:210px;max-width:48vw;background:#0b211c;border:1px solid #8f7a4d88;color:#eee0bd;border-radius:15px;padding:6px 10px;font-size:12px;outline:none}
    .library-name-input:focus{border-color:#c7a86b}
    .library-name-save{background:#6a4c2d;border:1px solid #c7a86b77;color:#f0dfb7;border-radius:14px;padding:6px 10px;font-size:11px;cursor:pointer}
    .library-name-edit{position:absolute;right:12px;top:12px;z-index:3;background:#102a23cc;border:1px solid #9f875866;color:#d7c28d;border-radius:50%;width:29px;height:29px;cursor:pointer;font-size:13px;display:flex;align-items:center;justify-content:center}
    .library-name-edit:hover{border-color:#c7a86b;color:#f0dfb7}
    @media(max-width:760px){.library-name-display{font-size:10px;letter-spacing:2px;padding:0 35px}.library-name-editor{top:5px}.library-name-input{width:155px}.library-name-edit{top:6px;right:6px;width:25px;height:25px}}
  `;
  document.head.appendChild(style);

  const display=document.createElement('div');
  display.className='library-name-display';
  const edit=document.createElement('button');
  edit.className='library-name-edit';
  edit.type='button';
  edit.title='Rename library';
  edit.setAttribute('aria-label','Rename library');
  edit.textContent='✎';
  arch.appendChild(display);
  arch.appendChild(edit);

  function currentName(){return localStorage.getItem(KEY)||DEFAULT}
  function render(){display.textContent=currentName()}
  function openEditor(){
    if(arch.querySelector('.library-name-editor'))return;
    const box=document.createElement('div');
    box.className='library-name-editor';
    const input=document.createElement('input');
    input.className='library-name-input';
    input.type='text';
    input.maxLength=45;
    input.placeholder='Name your library…';
    input.value=currentName()===DEFAULT?'':currentName();
    const save=document.createElement('button');
    save.className='library-name-save';
    save.type='button';
    save.textContent='Save';
    const commit=()=>{
      const name=input.value.trim();
      if(name)localStorage.setItem(KEY,name);
      else localStorage.removeItem(KEY);
      render();box.remove();
    };
    save.onclick=commit;
    input.onkeydown=e=>{if(e.key==='Enter')commit();if(e.key==='Escape')box.remove()};
    box.append(input,save);arch.appendChild(box);input.focus();input.select();
  }
  edit.onclick=openEditor;
  display.onclick=openEditor;
  render();
})();