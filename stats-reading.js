// Stats: customizable reading progress charts.
(function(){
  if(window.__readingStatsInitialized)return;window.__readingStatsInitialized=true;
  const stats=document.querySelector('#stats');
  if(!stats)return;
  const OVERALL_KEY='statsOverallReadingColors',PHYSICAL_KEY='statsPhysicalReadingColors';
  let colors=Object.assign({read:'#c7a86b',unread:'#315443'},JSON.parse(localStorage.getItem(OVERALL_KEY)||'{}'));
  let physicalColors=Object.assign({read:'#b98b63',unread:'#405b4b'},JSON.parse(localStorage.getItem(PHYSICAL_KEY)||'{}'));

  const style=document.createElement('style');
  style.textContent=`
    #stats .stats-reading-grid{display:grid;grid-template-columns:repeat(auto-fit,minmax(430px,620px));gap:18px;margin-top:4px;align-items:start}
    #stats .reading-chart-card{background:#122d25;border:1px solid #8e794c44;border-radius:10px;padding:22px}
    #stats .reading-chart-card h2{margin:0 0 5px;font-size:21px;font-weight:normal;color:#eadcb8}
    #stats .reading-chart-sub{color:#a99772;font-size:12px;margin-bottom:18px}
    #stats .reading-chart-layout{display:grid;grid-template-columns:210px 1fr;gap:24px;align-items:center}
    #stats .reading-donut{width:190px;height:190px;border-radius:50%;position:relative;margin:auto;box-shadow:0 8px 22px #0005}
    #stats .reading-donut:after{content:'';position:absolute;inset:38px;border-radius:50%;background:#122d25;box-shadow:inset 0 0 0 1px #8e794c33}
    #stats .reading-donut-center{position:absolute;inset:0;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none;text-align:center}
    #stats .reading-donut-total{font-size:38px;color:#eadcb8;line-height:1}
    #stats .reading-donut-label{font-size:11px;letter-spacing:1.5px;color:#a99772;margin-top:5px}
    #stats .reading-legend{display:grid;gap:12px}
    #stats .reading-legend-row{display:grid;grid-template-columns:15px 1fr auto;gap:9px;align-items:center;padding:9px 0;border-bottom:1px solid #8e794c22}
    #stats .reading-marker{width:12px;height:12px;border-radius:50%}
    #stats .reading-legend-name{color:#dfd2b3}.reading-legend-count{color:#eadcb8;font-size:18px}
    #stats .reading-percent{font-size:12px;color:#a99772;margin-top:-7px;padding-left:24px}
    #stats .reading-color-controls{display:flex;gap:14px;flex-wrap:wrap;margin-top:18px;padding-top:15px;border-top:1px solid #8e794c33}
    #stats .reading-color-control{display:flex;align-items:center;gap:7px;color:#bca978;font-size:11px}
    #stats .reading-color-control input{width:28px;height:28px;border:0;background:transparent;padding:0;cursor:pointer}
    @media(max-width:700px){#stats .reading-chart-layout{grid-template-columns:1fr}#stats .stats-reading-grid{grid-template-columns:1fr}}
  `;
  document.head.appendChild(style);

  const oldCards=stats.querySelector('.cards');
  const grid=document.createElement('div');grid.className='stats-reading-grid';grid.id='statsReadingGrid';
  if(oldCards)oldCards.replaceWith(grid);else stats.appendChild(grid);

  function chartMarkup(prefix,title,subtitle,totalLabel){return `<h2>${title}</h2><div class="reading-chart-sub">${subtitle}</div><div class="reading-chart-layout"><div class="reading-donut" id="${prefix}Donut"><div class="reading-donut-center"><div class="reading-donut-total" id="${prefix}Total">0</div><div class="reading-donut-label">${totalLabel}</div></div></div><div><div class="reading-legend"><div><div class="reading-legend-row"><span class="reading-marker" id="${prefix}ReadMarker"></span><span class="reading-legend-name">Read</span><span class="reading-legend-count" id="${prefix}ReadCount">0</span></div><div class="reading-percent" id="${prefix}ReadPercent">0%</div></div><div><div class="reading-legend-row"><span class="reading-marker" id="${prefix}UnreadMarker"></span><span class="reading-legend-name">Unread</span><span class="reading-legend-count" id="${prefix}UnreadCount">0</span></div><div class="reading-percent" id="${prefix}UnreadPercent">0%</div></div></div><div class="reading-color-controls"><label class="reading-color-control">Read <input id="${prefix}ReadColor" type="color"></label><label class="reading-color-control">Unread <input id="${prefix}UnreadColor" type="color"></label></div></div></div>`}

  const overall=document.createElement('section');overall.className='reading-chart-card';overall.innerHTML=chartMarkup('overallReading','Overall Reading Progress','Your entire library · Read vs. Unread','TOTAL BOOKS');grid.appendChild(overall);
  const physical=document.createElement('section');physical.className='reading-chart-card';physical.innerHTML=chartMarkup('physicalReading','Physical Library Progress','Hardcover, paperback & other physical books · Read vs. Unread','PHYSICAL BOOKS');grid.appendChild(physical);

  function isPhysical(b){const f=String(b.format||'').trim().toLowerCase();return /hardcover|paperback|physical|print|softcover|mass market|trade paperback|hardback/.test(f) && !/ebook|e-book|kindle|digital|audio/.test(f)}
  function renderChart(card,prefix,list,palette,label){const total=list.length,read=list.filter(b=>!!b.read).length,unread=Math.max(0,total-read),rp=total?read/total*100:0,up=total?unread/total*100:0;card.querySelector('#'+prefix+'Total').textContent=total;card.querySelector('#'+prefix+'ReadCount').textContent=read;card.querySelector('#'+prefix+'UnreadCount').textContent=unread;card.querySelector('#'+prefix+'ReadPercent').textContent=Math.round(rp)+'% of '+label;card.querySelector('#'+prefix+'UnreadPercent').textContent=Math.round(up)+'% of '+label;card.querySelector('#'+prefix+'ReadMarker').style.background=palette.read;card.querySelector('#'+prefix+'UnreadMarker').style.background=palette.unread;card.querySelector('#'+prefix+'Donut').style.background=total?`conic-gradient(${palette.read} 0 ${rp}%, ${palette.unread} ${rp}% 100%)`:`conic-gradient(${palette.unread} 0 100%)`}
  function render(){renderChart(overall,'overallReading',books,colors,'library');renderChart(physical,'physicalReading',books.filter(isPhysical),physicalColors,'physical books')}

  const orc=overall.querySelector('#overallReadingReadColor'),ouc=overall.querySelector('#overallReadingUnreadColor'),prc=physical.querySelector('#physicalReadingReadColor'),puc=physical.querySelector('#physicalReadingUnreadColor');
  orc.value=colors.read;ouc.value=colors.unread;prc.value=physicalColors.read;puc.value=physicalColors.unread;
  orc.oninput=e=>{colors.read=e.target.value;localStorage.setItem(OVERALL_KEY,JSON.stringify(colors));render()};ouc.oninput=e=>{colors.unread=e.target.value;localStorage.setItem(OVERALL_KEY,JSON.stringify(colors));render()};prc.oninput=e=>{physicalColors.read=e.target.value;localStorage.setItem(PHYSICAL_KEY,JSON.stringify(physicalColors));render()};puc.oninput=e=>{physicalColors.unread=e.target.value;localStorage.setItem(PHYSICAL_KEY,JSON.stringify(physicalColors));render()};
  document.querySelectorAll('.nav button').forEach(btn=>{if(btn.dataset.view==='stats')btn.addEventListener('click',()=>setTimeout(render,0))});
  window.addEventListener('library-stats-updated',render);
  const obs=new MutationObserver(()=>{if(stats.classList.contains('active'))render()});obs.observe(stats,{attributes:true,attributeFilter:['class']});
  render();
})();