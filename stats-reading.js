// Stats: customizable overall Read vs Unread donut chart.
(function(){
  if(window.__readingStatsInitialized)return;window.__readingStatsInitialized=true;
  const stats=document.querySelector('#stats');
  if(!stats)return;
  const KEY='statsOverallReadingColors';
  let colors=Object.assign({read:'#c7a86b',unread:'#315443'},JSON.parse(localStorage.getItem(KEY)||'{}'));

  const style=document.createElement('style');
  style.textContent=`
    #stats .stats-reading-grid{display:grid;grid-template-columns:minmax(300px,620px);gap:18px;margin-top:4px}
    #stats .reading-chart-card{background:#122d25;border:1px solid #8e794c44;border-radius:10px;padding:22px}
    #stats .reading-chart-card h2{margin:0 0 5px;font-size:21px;font-weight:normal;color:#eadcb8}
    #stats .reading-chart-sub{color:#a99772;font-size:12px;margin-bottom:18px}
    #stats .reading-chart-layout{display:grid;grid-template-columns:210px 1fr;gap:24px;align-items:center}
    #stats .reading-donut{width:190px;height:190px;border-radius:50%;position:relative;margin:auto;box-shadow:0 8px 22px #0005}
    #stats .reading-donut:after{content:'';position:absolute;inset:38px;border-radius:50%;background:#122d25;box-shadow:inset 0 0 0 1px #8e794c33}
    #stats .reading-donut-center{position:absolute;inset:0;z-index:1;display:flex;flex-direction:column;align-items:center;justify-content:center;pointer-events:none}
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

  const card=document.createElement('section');card.className='reading-chart-card';
  card.innerHTML=`<h2>Overall Reading Progress</h2><div class="reading-chart-sub">Your entire library · Read vs. Unread</div><div class="reading-chart-layout"><div class="reading-donut" id="overallReadingDonut"><div class="reading-donut-center"><div class="reading-donut-total" id="overallBookTotal">0</div><div class="reading-donut-label">TOTAL BOOKS</div></div></div><div><div class="reading-legend"><div><div class="reading-legend-row"><span class="reading-marker" id="readMarker"></span><span class="reading-legend-name">Read</span><span class="reading-legend-count" id="overallReadCount">0</span></div><div class="reading-percent" id="overallReadPercent">0%</div></div><div><div class="reading-legend-row"><span class="reading-marker" id="unreadMarker"></span><span class="reading-legend-name">Unread</span><span class="reading-legend-count" id="overallUnreadCount">0</span></div><div class="reading-percent" id="overallUnreadPercent">0%</div></div></div><div class="reading-color-controls"><label class="reading-color-control">Read <input id="overallReadColor" type="color"></label><label class="reading-color-control">Unread <input id="overallUnreadColor" type="color"></label></div></div></div>`;
  grid.appendChild(card);

  const donut=card.querySelector('#overallReadingDonut'),readColor=card.querySelector('#overallReadColor'),unreadColor=card.querySelector('#overallUnreadColor');
  readColor.value=colors.read;unreadColor.value=colors.unread;
  function render(){
    const total=books.length,read=books.filter(b=>!!b.read).length,unread=Math.max(0,total-read),readPct=total?read/total*100:0,unreadPct=total?unread/total*100:0;
    card.querySelector('#overallBookTotal').textContent=total;
    card.querySelector('#overallReadCount').textContent=read;card.querySelector('#overallUnreadCount').textContent=unread;
    card.querySelector('#overallReadPercent').textContent=Math.round(readPct)+'% of library';card.querySelector('#overallUnreadPercent').textContent=Math.round(unreadPct)+'% of library';
    card.querySelector('#readMarker').style.background=colors.read;card.querySelector('#unreadMarker').style.background=colors.unread;
    donut.style.background=total?`conic-gradient(${colors.read} 0 ${readPct}%, ${colors.unread} ${readPct}% 100%)`:`conic-gradient(${colors.unread} 0 100%)`;
  }
  function saveColors(){localStorage.setItem(KEY,JSON.stringify(colors));render()}
  readColor.oninput=e=>{colors.read=e.target.value;saveColors()};unreadColor.oninput=e=>{colors.unread=e.target.value;saveColors()};
  document.querySelectorAll('.nav button').forEach(btn=>{if(btn.dataset.view==='stats')btn.addEventListener('click',()=>setTimeout(render,0))});
  window.addEventListener('library-stats-updated',render);
  const obs=new MutationObserver(()=>{if(stats.classList.contains('active'))render()});
  obs.observe(stats,{attributes:true,attributeFilter:['class']});
  render();
})();