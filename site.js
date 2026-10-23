/* Shared: data, header/menu/search/cart, footer, product cards, cut-out shoes */
const NS={};
NS.money=n=>'Rs.'+Math.round(n).toLocaleString('en-US');
NS.img=(f,w=600)=>`https://www.ndure.com/cdn/shop/files/${f}?width=${w}`;
NS.q=new URLSearchParams(location.search);
NS.data=fetch('data/products.json').then(r=>r.json()).then(d=>{NS.all=d;NS.by=Object.fromEntries(d.map(p=>[p.h,p]));return d});
NS.off=p=>p.cmp?Math.round((1-p.p/p.cmp)*100):0;
NS.link=(c,w,k)=>'collection.html?'+[c&&'c='+c,w&&'w='+w,k&&'k='+k].filter(Boolean).join('&');

/* colours */
const CM={BLK:'#141414',BLACK:'#141414',WHT:'#f3f3f3',WHITE:'#f3f3f3',OFFWHT:'#ece6d8','O.WHT':'#ece6d8',OFFWHITE:'#ece6d8',NVY:'#1b2a4a',NAVY:'#1b2a4a',BLU:'#2a62c4',BLUE:'#2a62c4',RED:'#c1121f',BRN:'#6b4226',BROWN:'#6b4226',BEG:'#d8c4a3',BEIGE:'#d8c4a3',TAN:'#b07a3d',CML:'#c68a45',CAMEL:'#c68a45',GRY:'#8b8f95',GREY:'#8b8f95',GRAY:'#8b8f95',DGRY:'#4a4e54',GRN:'#2f7d4f',GREEN:'#2f7d4f',OLV:'#6b7a3a',MRN:'#7a1230',MAROON:'#7a1230',PNK:'#e58ab0',PINK:'#e58ab0',YLW:'#e8c53a',YELLOW:'#e8c53a',ORG:'#e0701d',ORANGE:'#e0701d',PRP:'#6b3fa0',PURPLE:'#6b3fa0',SLV:'#c0c3c8',SILVER:'#c0c3c8',GLD:'#c9a24a',GOLD:'#c9a24a',CRM:'#f1e7d0',CREAM:'#f1e7d0',KHK:'#a89a6a',FWN:'#c7a07a',FAWN:'#c7a07a',TEAL:'#16808f',MNT:'#9ad1c0',MINT:'#9ad1c0',LLC:'#c9a7e0',LILAC:'#c9a7e0',BRZ:'#a8742f',COPPER:'#b8693a'};
NS.sw=code=>{const t=(code||'').split('/').map(x=>CM[x.trim().toUpperCase()]||'#777');return t.length>1?`linear-gradient(135deg,${t[0]} 50%,${t[1]} 50%)`:t[0]};

/* remove the grey photo background in the browser; colour the tile from the shoe itself */
NS.cutout=function(img){
  const w=img.naturalWidth,h=img.naturalHeight,c=document.createElement('canvas');c.width=w;c.height=h;
  const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0);
  const id=x.getImageData(0,0,w,h),d=id.data,seen=new Uint8Array(w*h),st=[];let n=0;
  /* the photo background is one flat grey: measure it from the border */
  let bs=0,bc=0;for(let i=0;i<w;i+=7){bs+=(d[i*4]+d[i*4+1]+d[i*4+2])/3;bc++}bs/=bc;
  const grey=i=>Math.max(d[i],d[i+1],d[i+2])-Math.min(d[i],d[i+1],d[i+2])<10;
  const core=i=>grey(i)&&Math.abs((d[i]+d[i+1]+d[i+2])/3-bs)<=8;
  const shade=(i,y)=>y>h*.58&&grey(i)&&(d[i]+d[i+1]+d[i+2])/3>=185;
  const push=(px,py,sh)=>{const q=py*w+px;if(!seen[q]&&(core(q*4)||(sh&&shade(q*4,py)))){seen[q]=1;st.push(q);n++}};
  for(let i=0;i<w;i++){push(i,0);push(i,h-1)}for(let j=0;j<h;j++){push(0,j);push(w-1,j)}
  /* pass 1: flat background only, so white or light shoes stay solid */
  let pass=0;
  const run=sh=>{while(st.length){const q=st.pop(),px=q%w,py=(q/w)|0;
    if(px>0)push(px-1,py,sh);if(px<w-1)push(px+1,py,sh);if(py>0)push(px,py-1,sh);if(py<h-1)push(px,py+1,sh)}};
  run(false);
  /* pass 2: soft floor shadow, only low in the picture */
  for(let q=0;q<w*h;q++)if(seen[q]){const px=q%w,py=(q/w)|0;
    if(py>h*.58){if(px>0&&!seen[q-1])push(px-1,py,true);if(px<w-1&&!seen[q+1])push(px+1,py,true);if(py<h-1&&!seen[q+w])push(px,py+1,true);if(!seen[q-w])push(px,py-1,true)}}
  run(true);
  let R=0,G=0,B=0,m=0;
  for(let q=0;q<w*h;q++){const i=q*4;
    if(seen[q]){const L=(d[i]+d[i+1]+d[i+2])/3,a=L>=bs-8?0:Math.min(.85,(bs-8-L)/bs*1.1);d[i]=d[i+1]=d[i+2]=0;d[i+3]=a*255}
    else{const L=(d[i]+d[i+1]+d[i+2])/3;if(L>25&&L<240&&(q&3)===0){R+=d[i];G+=d[i+1];B+=d[i+2];m++}
      const px=q%w,py=(q/w)|0;
      if((px>0&&seen[q-1]||px<w-1&&seen[q+1]||py>0&&seen[q-w]||py<h-1&&seen[q+w])&&L>215)d[i+3]=110}}
  x.putImageData(id,0,0);x.clearRect(w*.7,0,w*.3,h*.27);
  const ratio=n/(w*h);let tb='#161616',tg='#444';
  if(m>20){const r=R/m/255,g=G/m/255,b=B/m/255,mx=Math.max(r,g,b),mn=Math.min(r,g,b),l=(mx+mn)/2,dl=mx-mn;
    let s=dl?dl/(1-Math.abs(2*l-1)):0,hh=0;if(dl){hh=mx===r?((g-b)/dl)%6:mx===g?(b-r)/dl+2:(r-g)/dl+4;hh=Math.round(hh*60);if(hh<0)hh+=360}
    const cl=(v,a,b)=>Math.min(b,Math.max(a,v));
    if(s<.14||l<.2){tb=l>.7?'#2b2b30':'#161616';tg=l>.7?'#6c6c76':'#444'}
    else{tb=`hsl(${hh} ${Math.round(s*85)}% ${Math.round(cl(l*.45,.14,.26)*100)}%)`;tg=`hsl(${hh} ${Math.round(Math.min(1,s*1.05)*100)}% ${Math.round(cl(l*.95+.08,.38,.58)*100)}%)`}}
  return{el:c,ratio,tb,tg};
};
NS.fill=function(tile,file,alt,w=560){
  return new Promise(res=>{
    const im=new Image();im.crossOrigin='anonymous';
    im.onload=()=>{let el=im;
      try{const o=NS.cutout(im);if(o.ratio>.3){el=o.el;tile.style.setProperty('--tb',o.tb);tile.style.setProperty('--tg',o.tg)}else{el.className='plain'}}catch(e){el.className='cut'}
      if(el===im&&!im.className)im.className='cut';
      el.setAttribute('role','img');el.setAttribute('aria-label',alt||'');tile.appendChild(el);requestAnimationFrame(()=>el.classList.add('in'));res(el)};
    im.onerror=()=>res(null);im.src=NS.img(file,w);
  });
};
NS.io='IntersectionObserver'in window?new IntersectionObserver((s,o)=>s.forEach(x=>{if(x.isIntersecting){o.unobserve(x.target);NS.fill(x.target,x.target.dataset.f,x.target.dataset.alt,+x.target.dataset.w||560)}}),{rootMargin:'250px'}):null;
NS.watch=t=>NS.io?NS.io.observe(t):NS.fill(t,t.dataset.f,t.dataset.alt);
NS.watchAll=root=>(root||document).querySelectorAll('.tile[data-f]:not([data-w0])').forEach(t=>{t.dataset.w0=1;NS.watch(t)});

/* product card */
NS.card=p=>{
  const o=NS.off(p),sibs=(p.sb||[]).filter(s=>NS.by&&NS.by[s.h]&&s.h!==p.h);
  const sw=sibs.length?`<div class="sw">${[{c:p.c,h:p.h}].concat(sibs).slice(0,6).map(s=>`<i class="${s.h===p.h?'cur':''}" style="background:${NS.sw(s.c)}" title="${s.c}"></i>`).join('')}</div>`:'';
  return `<a class="pc" href="product.html?h=${p.h}">${o?`<span class="badge">${o}% OFF</span>`:''}<div class="tile" data-f="${p.i[0]}" data-alt="${p.t.replace(/"/g,'')}${p.c?', '+p.c:''}"></div><div class="m"><span>${p.t}</span><span class="prices">${NS.money(p.p)}${p.cmp?`<s>${NS.money(p.cmp)}</s>`:''}</span></div>${sw}</a>`;
};

/* cart (saved in this browser only) */
NS.cart=(()=>{let items=[];try{items=JSON.parse(localStorage.getItem('ndure_cart')||'[]')}catch(e){}
  const save=()=>{try{localStorage.setItem('ndure_cart',JSON.stringify(items))}catch(e){}};
  return{get:()=>items,count:()=>items.reduce((a,i)=>a+i.q,0),save,
    add(h,size,q=1){const f=items.find(i=>i.h===h&&i.s===size);if(f)f.q+=q;else items.push({h,s:size,q});save()},
    set(h,size,q){const f=items.find(i=>i.h===h&&i.s===size);if(f){f.q=q;if(f.q<=0)items.splice(items.indexOf(f),1)}save()},
    clear(){items=[];save()}}})();

const MENU=[
 {l:'Men',w:'men',g:[['Shoes',[['Slides','slides'],['Sandals','sandals'],['Sneakers','sneakers'],['Loafers & Moccs','loafers'],['Formal & Dress Shoes','formal'],['All Shoes','']]],['Explore',[['NDURE × Hasan Raheem',0,'hasan'],['New In',0,'new'],['Accessories',0,'acc'],['Special Prices',0,'sale']]]]},
 {l:'Women',w:'women',g:[['Shoes',[['Slides','slides'],['Sandals','sandals'],['Sneakers','sneakers'],['Pumps & Heels','heels'],['Loafers & Moccs','loafers'],['Boots','boots'],['All Shoes','']]],['Explore',[['NDURE × Hasan Raheem',0,'hasan'],['New In',0,'new'],['Special Prices',0,'sale']]]]},
 {l:'Kids',w:'',g:[['Boys',[['New In','','new','boys'],['Sneakers','sneakers','','boys'],['School Shoes','school','','boys'],['All Boys Shoes','','','boys'],['Special Prices','','sale','boys']]],['Girls',[['New In','','new','girls'],['Sneakers','sneakers','','girls'],['School Shoes','school','','girls'],['All Girls Shoes','','','girls'],['Special Prices','','sale','girls']]]]},
 {l:'New In',c:'new'},{l:'Hasan Raheem Collection',c:'hasan'},{l:'Sale',c:'sale',hot:1}
];
const href=(m,it)=>{let [,k,c,w]=it;if(k===0)k='';w=w||m.w;c=c||(w?'all':'');return NS.link(c,w,k)};
NS.header=()=>{
  const pg=location.pathname.split('/').pop()||'index.html',cc=NS.q.get('c');
  const nav=MENU.map((m,i)=>{
    if(m.c)return `<div><a class="top ${m.hot?'hot':''}" href="${NS.link(m.c)}" ${pg==='collection.html'&&cc===m.c?'aria-current="page"':''}>${m.l}</a></div>`;
    return `<div><a class="top" href="${NS.link(m.w?'all':'kids',m.w)}" data-t="${m.l}">${m.l}</a><div class="mega">${m.g.map(([t,its])=>`<section><h4>${t}</h4>${its.map(it=>`<a href="${href(m,it)}">${it[0]}</a>`).join('')}</section>`).join('')}</div></div>`}).join('');
  return `<div class="ann">Free delivery on all prepaid orders · Get 40% off when paying with Yeylo by Jazz Cash</div>
  <div class="bar"><button class="burger" aria-label="Menu">☰</button><a class="logo" href="index.html">NDURE</a><nav class="main" id="nav">${nav}</nav>
  <div class="tools"><button id="s-open"><span class="lbl">Search</span><span aria-hidden="true" class="lbl2">⌕</span></button><button id="c-open"><span class="lbl">Cart</span><span class="count" id="c-count">0</span></button></div></div>`;
};
NS.footer=()=>`<div class="ft"><div class="cols">
 <div><h4>Join our newsletter</h4><form onsubmit="event.preventDefault();this.querySelector('button').textContent='Demo only';"><input type="email" placeholder="Enter your email address" required aria-label="Email"><button>Join</button></form>
  <p class="note2" style="margin-top:12px">Demo form — nothing is sent or saved.</p>
  <h4 style="margin-top:26px">Customer care</h4><a href="tel:+924235880175">UAN: 042-35880175</a><a href="mailto:help@ndure.com">help@ndure.com</a><a>Jail Road, Main Gulberg, Lahore</a></div>
 <div><h4>Company</h4><a href="story.html">What is NDURE?</a><a href="http://www.sscbrands.com/" target="_blank" rel="noopener">Corporate News</a><a href="https://www.ndure.com/pages/customer-reviews" target="_blank" rel="noopener">Customer Reviews</a><a href="https://www.ndure.com/pages/career" target="_blank" rel="noopener">Careers</a><a href="https://www.ndure.com/blogs/news" target="_blank" rel="noopener">Blogs</a><a href="https://www.ndure.com/pages/find-a-store" target="_blank" rel="noopener">Find a Store</a><a href="https://www.ndure.com/pages/franchise-program" target="_blank" rel="noopener">Franchise Program</a></div>
 <div><h4>Help</h4><a href="https://www.ndure.com/pages/order-status" target="_blank" rel="noopener">Order Status</a><a href="https://www.ndure.com/pages/shipping-delivery" target="_blank" rel="noopener">Shipping &amp; Delivery</a><a href="https://www.ndure.com/pages/return-exchange" target="_blank" rel="noopener">Return &amp; Exchange Policy</a><a href="https://www.ndure.com/pages/faqs" target="_blank" rel="noopener">FAQs</a><a href="https://www.ndure.com/pages/privacy-policy" target="_blank" rel="noopener">Privacy Policy</a><a href="https://www.ndure.com/pages/terms-conditions" target="_blank" rel="noopener">Terms &amp; Conditions</a></div>
 <div><h4>Follow us</h4><a href="https://www.facebook.com/NDUREShoes" target="_blank" rel="noopener">Facebook</a><a href="https://www.instagram.com/ndureshoes/" target="_blank" rel="noopener">Instagram</a><a href="https://www.youtube.com/@NDURE_Shoes" target="_blank" rel="noopener">YouTube</a><a href="https://www.tiktok.com/@ndurepakistan" target="_blank" rel="noopener">TikTok</a><a href="https://www.snapchat.com/add/ndurepakistan" target="_blank" rel="noopener">Snapchat</a><a href="https://open.spotify.com/user/31t47zbyk3pyhglj4jkja6b26nsy" target="_blank" rel="noopener">Spotify</a></div>
 </div><div class="legal"><span>NDURE — concept redesign for pitch. Not the live site. Catalogue shown is a sample of NDURE's range.</span><span>Product images, names &amp; prices © NDURE</span></div></div>`;

document.addEventListener('DOMContentLoaded',()=>{
  const h=document.getElementById('site-header');if(h){h.className='sh';h.innerHTML=NS.header()}
  const f=document.getElementById('site-footer');if(f)f.innerHTML=NS.footer();
  document.body.insertAdjacentHTML('beforeend',`<div class="panel" id="p-s"><div class="box srch"><button class="x" aria-label="Close">×</button><h3>Search</h3><input id="s-in" placeholder="Search shoes, colours, SKU…" aria-label="Search"><div class="res" id="s-res"></div></div></div>
   <div class="panel" id="p-c"><div class="box"><button class="x" aria-label="Close">×</button><h3>Your bag</h3><div id="c-list"></div><div class="tot"><span>Total</span><span id="c-tot">Rs.0</span></div><a class="btn" href="#" id="c-go" style="text-align:center;background:#fff;color:#111">Checkout</a><p class="note2" id="c-note">Demo only — no orders are taken.</p></div></div>
   <div class="panel" id="p-g"><div class="box"><button class="x" aria-label="Close">×</button><h3>Size guide</h3><div id="g-body"></div></div></div>`);
  const $=id=>document.getElementById(id),open=id=>$(id).classList.add('open'),close=()=>document.querySelectorAll('.panel').forEach(p=>p.classList.remove('open'));
  document.querySelectorAll('.panel .x').forEach(b=>b.onclick=close);document.querySelectorAll('.panel').forEach(p=>p.addEventListener('click',e=>{if(e.target===p)close()}));
  addEventListener('keydown',e=>{if(e.key==='Escape')close()});
  const count=()=>{const el=$('c-count');if(el)el.textContent=NS.cart.count()};count();
  const renderCart=async()=>{await NS.data;const it=NS.cart.get();let tot=0;
    $('c-list').innerHTML=it.length?it.map(i=>{const p=NS.by[i.h];if(!p)return'';tot+=p.p*i.q;return `<div class="line"><img src="${NS.img(p.i[0],140)}" alt=""><div><a href="product.html?h=${p.h}" style="color:#fff">${p.t}</a><div class="note2">${p.c||''}${i.s?' · Size '+i.s:''}</div><div>${NS.money(p.p)}</div><div class="q"><button data-a="-" data-h="${i.h}" data-s="${i.s||''}">−</button><span>${i.q}</span><button data-a="+" data-h="${i.h}" data-s="${i.s||''}">+</button></div></div><button class="rm" data-a="x" data-h="${i.h}" data-s="${i.s||''}">Remove</button></div>`}).join(''):'<p>Your bag is empty.</p>';
    $('c-tot').textContent=NS.money(tot);count()};
  NS.openCart=()=>{renderCart();open('p-c')};NS.renderCart=renderCart;
  $('c-list').addEventListener('click',e=>{const b=e.target.closest('button[data-a]');if(!b)return;const it=NS.cart.get().find(i=>i.h===b.dataset.h&&(i.s||'')===b.dataset.s);if(!it)return;NS.cart.set(it.h,it.s,b.dataset.a==='+'?it.q+1:b.dataset.a==='-'?it.q-1:0);renderCart()});
  $('c-go').onclick=e=>{e.preventDefault();$('c-note').textContent='This is a concept demo — checkout is not connected.'};
  const co=$('c-open');if(co)co.onclick=NS.openCart;
  const so=$('s-open');if(so)so.onclick=()=>{open('p-s');setTimeout(()=>$('s-in').focus(),50)};
  $('s-in').addEventListener('input',async e=>{await NS.data;const q=e.target.value.trim().toLowerCase();if(!q){$('s-res').innerHTML='';return}
    const r=NS.all.filter(p=>(p.t+' '+p.c+' '+p.sku+' '+p.k).toLowerCase().includes(q));
    $('s-res').innerHTML=r.slice(0,8).map(p=>`<a href="product.html?h=${p.h}"><img src="${NS.img(p.i[0],120)}" alt=""><span>${p.t}<small>${p.c||''} · ${NS.money(p.p)}</small></span></a>`).join('')+(r.length?`<a href="collection.html?q=${encodeURIComponent(q)}"><b>See all ${r.length} results →</b></a>`:'<p>No results.</p>')});
  $('s-in').addEventListener('keydown',e=>{if(e.key==='Enter'&&e.target.value.trim())location.href='collection.html?q='+encodeURIComponent(e.target.value.trim())});
  const nav=$('nav'),bg=document.querySelector('.sh .burger');
  if(bg)bg.onclick=()=>nav.classList.toggle('open');
  document.querySelectorAll('#nav a.top[data-t]').forEach(a=>a.addEventListener('click',e=>{if(innerWidth<=900){e.preventDefault();a.parentElement.classList.toggle('exp')}}));
  NS.closeAll=close;NS.openGuide=html=>{$('g-body').innerHTML=html;open('p-g')};
});
