/* Listing page: sale, new in, men, women, kids, Hasan Raheem, accessories, search */
(async()=>{
  const q=NS.q,c=q.get('c')||'',w=q.get('w')||'',k=q.get('k')||'',s=(q.get('q')||'').trim().toLowerCase();
  await NS.data;
  const T={sale:'Special<br><em>prices</em>',new:'New<br><em>in</em>',hasan:'NDURE ×<br><em>Hasan Raheem</em>',acc:'Acces<em>sories</em>',ss26:'SS26<br><em>Collection</em>',kids:'Kids',all:'All<br><em>shoes</em>'};
  const W={men:'Men',women:'Women',boys:'Boys',girls:'Girls'},K={slides:'Slides',sandals:'Sandals',sneakers:'Sneakers',loafers:'Loafers & Moccs',formal:'Formal & Dress',heels:'Pumps & Heels',boots:'Boots',school:'School shoes',accessories:'Accessories'};
  let h1=s?`Results for<br><em>“${s.replace(/</g,'')}”</em>`:(T[c]||'Shoes');
  if(!s&&w){const wl=W[w];h1=(c==='sale'?'Sale<br>':c==='new'?'New in<br>':c==='hasan'?'Hasan Raheem<br>':'')+`<em>${wl}${k?' · '+K[k]:''}</em>`}
  else if(!s&&k)h1=`<em>${K[k]}</em>`;
  document.getElementById('h1').innerHTML=h1;
  document.getElementById('wm').textContent=c==='sale'?'SALE':c==='hasan'?'HR':s?'FIND':(W[w]||'NDURE').toUpperCase();
  document.title=h1.replace(/<br>/g,' ').replace(/<[^>]*>/g,'')+' — NDURE';
  if(c==='hasan')document.getElementById('lead').textContent='Limited-edition sneakers from the NDURE × Hasan Raheem collaboration.';
  if(c==='sale')document.getElementById('lead').textContent='Up to 50% off. Prices shown are NDURE\'s regular and sale prices.';
  const base=NS.all.filter(p=>{
    if(c==='kids'&&!(p.w==='boys'||p.w==='girls'))return false;
    if(c&&c!=='all'&&c!=='kids'&&!p.cl.includes(c))return false;
    if(w&&p.w!==w)return false;if(k&&p.k!==k)return false;
    if(s&&!(p.t+' '+p.c+' '+p.sku+' '+p.k+' '+p.w).toLowerCase().includes(s))return false;return true});
  const kinds=[...new Set(base.map(p=>p.k))].filter(x=>K[x]);
  const sizes=[...new Set(base.flatMap(p=>p.s.filter(z=>z[1]).map(z=>z[0])))].sort((a,b)=>parseFloat(a)-parseFloat(b));
  const prices=base.map(p=>p.p),pmin=Math.min(...prices),pmax=Math.max(...prices);
  const fl=document.getElementById('fl');
  fl.innerHTML=`${kinds.length>1?`<h5>Type</h5>${kinds.map(x=>`<label><input type="checkbox" name="k" value="${x}"> ${K[x]}</label>`).join('')}`:''}
   ${sizes.length?`<h5>Size (EU/UK)</h5><div class="sizes">${sizes.map(x=>`<label><input type="checkbox" name="s" value="${x}">${x}</label>`).join('')}</div>`:''}
   <h5>Price (Rs.)</h5><div class="pr"><input type="number" id="pmin" placeholder="${pmin}" min="0"><input type="number" id="pmax" placeholder="${pmax}" min="0"></div>
   <label style="margin-top:12px"><input type="checkbox" id="onsale"> On sale only</label>
   <button class="clr" id="clr">Clear filters</button>`;
  const grid=document.getElementById('grid'),cnt=document.getElementById('cnt'),sort=document.getElementById('sort'),more=document.getElementById('more');
  let list=[],shown=0;const PAGE=24;
  const apply=()=>{
    const ks=[...fl.querySelectorAll('input[name=k]:checked')].map(i=>i.value),ss=[...fl.querySelectorAll('input[name=s]:checked')].map(i=>i.value);
    const lo=+document.getElementById('pmin').value||0,hi=+document.getElementById('pmax').value||Infinity,os=document.getElementById('onsale').checked;
    list=base.filter(p=>(!ks.length||ks.includes(p.k))&&(!ss.length||p.s.some(z=>z[1]&&ss.includes(z[0])))&&p.p>=lo&&p.p<=hi&&(!os||p.cmp));
    const v=sort.value,cmp={'az':(a,b)=>a.t.localeCompare(b.t),'za':(a,b)=>b.t.localeCompare(a.t),'lo':(a,b)=>a.p-b.p,'hi':(a,b)=>b.p-a.p,'new':(a,b)=>b.pub.localeCompare(a.pub),'old':(a,b)=>a.pub.localeCompare(b.pub)}[v];
    if(cmp)list=list.slice().sort(cmp);
    shown=0;grid.innerHTML='';cnt.textContent=list.length+' product'+(list.length===1?'':'s');
    if(!list.length)grid.innerHTML='<p>No products match these filters.</p>';
    next();
  };
  const next=()=>{const part=list.slice(shown,shown+PAGE);shown+=part.length;grid.insertAdjacentHTML('beforeend',part.map(NS.card).join(''));NS.watchAll(grid);more.style.display=shown<list.length?'block':'none'};
  more.onclick=next;
  if('IntersectionObserver'in window)new IntersectionObserver(e=>{if(e[0].isIntersecting&&shown<list.length)next()},{rootMargin:'400px'}).observe(more);
  fl.addEventListener('input',apply);sort.onchange=apply;
  document.getElementById('clr').onclick=()=>{fl.querySelectorAll('input[type=checkbox]').forEach(i=>i.checked=false);document.getElementById('pmin').value='';document.getElementById('pmax').value='';apply()};
  document.getElementById('fbtn').onclick=()=>fl.classList.toggle('open');
  apply();
})();
