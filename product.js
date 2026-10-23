/* Product page */
(async()=>{
  await NS.data;
  const root=document.getElementById('pdp'),p=NS.by[NS.q.get('h')];
  if(!p){root.innerHTML='<h1>Not in this<br><em>sample</em></h1><p class="lead">This product isn\'t in the demo catalogue.</p><p><a class="btn" href="collection.html?c=all">Browse the shop</a></p>';return}
  document.title=p.t+' — NDURE';
  const off=NS.off(p),inst=Math.round(p.p*1.15/3),wl={men:'Men',women:'Women',boys:'Boys',girls:'Girls',acc:'Accessories'}[p.w]||'Shop';
  const sibs=(p.sb||[]).filter(s=>NS.by[s.h]);
  const guide=p.s.length?`<p>Sizes are shown as EU / UK.</p><table class="sg"><tr><th>EU</th><th>UK</th></tr>${p.s.map(z=>{const [e,u]=z[0].split('/');return `<tr><td>${e}</td><td>${u||'—'}</td></tr>`}).join('')}</table>`:'';
  const pair=NS.all.filter(x=>x.k==='accessories'&&x.h!==p.h).slice(0,2);
  const picks=NS.all.filter(x=>x.h!==p.h&&x.w===p.w&&x.k===p.k).slice(0,4);
  if(picks.length<4)NS.all.filter(x=>x.h!==p.h&&x.w===p.w&&!picks.includes(x)).slice(0,4-picks.length).forEach(x=>picks.push(x));
  root.innerHTML=`<div class="crumbs"><a href="index.html">Home</a> / <a href="${NS.link('all',p.w==='acc'?'':p.w)}">${wl}</a> / ${p.t}</div>
  <div class="pdp"><div class="gal"><div class="tile" id="main" style="position:relative">${off?`<span class="badge">${off}% OFF</span>`:''}</div><div class="thumbs" id="thumbs">${p.i.map((f,i)=>`<button class="${i?'':'on'}" data-i="${i}" aria-label="Photo ${i+1}"><img src="${NS.img(f,160)}" alt=""></button>`).join('')}</div></div>
  <div><h1>${p.t}</h1><div class="sku">SKU ${p.sku}${p.c?' · '+p.c:''}</div>
   <div class="price">${NS.money(p.p)}${p.cmp?`<s>${NS.money(p.cmp)}</s><span class="off">${off}% OFF</span>`:''}</div>
   ${sibs.length?`<div class="sw" style="margin-bottom:8px">${[{c:p.c,h:p.h}].concat(sibs).map(s=>`<a href="product.html?h=${s.h}" aria-label="${s.c}"><i class="${s.h===p.h?'cur':''}" style="background:${NS.sw(s.c)};width:22px;height:22px" title="${s.c}"></i></a>`).join('')}</div>`:''}
   ${p.s.length?`<div style="display:flex;justify-content:space-between;align-items:baseline"><b>Size</b><button class="link" id="g-open">Size guide</button></div><div class="sizes2" id="sizes">${p.s.map(z=>`<button data-s="${z[0]}" ${z[1]?'':'disabled'}>${z[0]}</button>`).join('')}</div>`:''}
   <div class="err" id="err"></div>
   <button class="btn full" id="add">${p.s.length&&p.s.every(z=>!z[1])?'Sold out':'Add to bag'}</button>
   <div class="box2">Pay in 3 installments of <b>${NS.money(inst).replace('Rs.','Rs. ')}</b> with BaadMay — select BaadMay at checkout, verify your account details and pay only your first installment now.</div>
   <div class="box2"><b>Get 40% off when paying with Yeylo by Jazz Cash.</b> Free delivery on all prepaid orders.</div>
   <h3 style="margin-top:22px;font-style:italic;text-transform:uppercase">Product description</h3>
   <p style="margin:8px 0">${p.d||''}</p>${p.b.length?`<ul class="spec">${p.b.map(b=>`<li>${b}</li>`).join('')}</ul>`:''}
   <p class="note2" style="margin-top:14px">Demo page — prices, sizes and stock are a snapshot and the bag is not connected to a real checkout.</p>
  </div></div>
  ${pair.length?`<section class="sec"><h2>Pair it right</h2><div class="mini">${pair.map(NS.card).join('')}</div></section>`:''}
  ${picks.length?`<section class="sec"><h2>Our picks for you</h2><div class="mini">${picks.map(NS.card).join('')}</div></section>`:''}`;
  const main=document.getElementById('main'),th=[...document.querySelectorAll('#thumbs button')];let cur=-1;
  const show=async i=>{if(i===cur)return;cur=i;th.forEach((b,j)=>b.classList.toggle('on',j===i));main.querySelectorAll('canvas,img').forEach(e=>e.remove());await NS.fill(main,p.i[i],p.t,1000)};
  th.forEach(b=>b.onclick=()=>show(+b.dataset.i));show(0);NS.watchAll(root);
  let size='';const sz=document.getElementById('sizes');
  if(sz)sz.addEventListener('click',e=>{const b=e.target.closest('button:not(:disabled)');if(!b)return;size=b.dataset.s;sz.querySelectorAll('button').forEach(x=>x.classList.toggle('on',x===b));document.getElementById('err').textContent=''});
  const g=document.getElementById('g-open');if(g)g.onclick=()=>NS.openGuide(guide);
  document.getElementById('add').onclick=()=>{
    if(p.s.length&&p.s.every(z=>!z[1])){document.getElementById('err').textContent='This colour is sold out.';return}
    if(p.s.length&&!size){document.getElementById('err').textContent='Please select a size.';return}
    NS.cart.add(p.h,size,1);NS.openCart()};
})();
