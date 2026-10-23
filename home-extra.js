/* Home page sections below the scroll story: shop by group, Hasan Raheem, sale */
(async()=>{
  await NS.data;
  const pick=(f,n)=>NS.all.filter(f).slice(0,n);
  document.getElementById('cats-grid').innerHTML=[['Men','men','men'],['Women','women','women'],['Kids','kids',null]].map(([l,w,k])=>{
    const p=k?NS.all.find(x=>x.w===k&&x.k==='sneakers'):NS.all.find(x=>x.w==='boys'||x.w==='girls');
    const href=w==='kids'?NS.link('kids'):NS.link('all',w);
    return `<a href="${href}"><div class="tile" data-f="${p.i[0]}" data-alt="${p.t}"></div><div class="lab"><span>${l}</span><span>→</span></div></a>`}).join('');
  document.getElementById('hasan-grid').innerHTML=pick(p=>p.cl.includes('hasan'),4).map(NS.card).join('');
  const sale=NS.all.filter(p=>p.cmp).sort((a,b)=>NS.off(b)-NS.off(a)).filter((p,i,a)=>a.findIndex(x=>x.t===p.t)===i).slice(0,4);
  document.getElementById('sale-grid').innerHTML=sale.map(NS.card).join('');
  NS.watchAll(document);
})();
/* solid header once the scroll story is over */
(()=>{const c=document.getElementById('cine'),h=document.getElementById('site-header');
  const f=()=>h.classList.toggle('solid',c.getBoundingClientRect().bottom<innerHeight*.4);
  addEventListener('scroll',f,{passive:true});f()})();
