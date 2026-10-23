const U=(k,w=900)=>`https://www.ndure.com/cdn/shop/files/${k}.jpg?width=${w}`;
/* colour worlds for each colourway: [edge, glow] */
const C={tan:['#6e4a1c','#c8975a'],maroon:['#7a1230','#cf4a6c'],'dark grey':['#2d3036','#6c727c'],teal:['#16608f','#4fb4e6'],black:['#161616','#3d3d3d'],camel:['#c2500c','#ff9d4d'],fawn:['#8a5f33','#d9b184'],red:['#a80f1b','#e8404c']};
const P=[
{n:"Men's Formal Shoes",c:'tan',p:'Rs.6,499',t:'formal',k:'1_293357c3-ac32-4dbe-85cd-1867144f15c9'},
{n:"Women's Mesh Slip-On Sneakers",c:'red',p:'Rs.3,499',t:'sneakers',k:'4_312682d2-ab03-41d3-9e05-6d3fc70e5025'},
{n:"Men's Leather Loafers",c:'dark grey',p:'Rs.6,999',t:'loafers',k:'1_6c0af1c2-015b-4972-a0ee-2c341e605c38'},
{n:"Women's Mesh Slip-On Sneakers",c:'teal',p:'Rs.3,499',t:'sneakers',k:'5_9ba86217-02d8-4232-bae9-d2126df79e72'},
{n:"Men's Formal Shoes",c:'black',p:'Rs.6,499',t:'formal',k:'1_11187382-a5b8-403d-9a1b-47e69ac4637c'},
{n:"Women's Casual Loafers",c:'maroon',p:'Rs.4,999',t:'loafers',k:'1_470e62d5-7a0c-423c-9f08-6e1d63378fd8'},
{n:"Men's Leather Loafers",c:'camel',p:'Rs.6,999',t:'loafers',k:'1_b2cfb9fc-b024-4e6b-acb9-311df4c6ad84'},
{n:"Women's Casual Loafers",c:'fawn',p:'Rs.4,999',t:'loafers',k:'3_4df4924f-07a3-439e-ab53-0b5fb470a7f8'}];

/* remove the grey photo background in the browser (nothing is saved or re-hosted) */
function cutout(img){
  const w=img.naturalWidth,h=img.naturalHeight,c=document.createElement('canvas');c.width=w;c.height=h;
  const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(img,0,0);
  const id=x.getImageData(0,0,w,h),d=id.data,seen=new Uint8Array(w*h),st=[];
  const bg=i=>{const r=d[i],g=d[i+1],b=d[i+2],mx=Math.max(r,g,b),mn=Math.min(r,g,b);return mx-mn<14&&(r+g+b)/3>=205};
  const push=(px,py)=>{const q=py*w+px;if(!seen[q]&&bg(q*4)){seen[q]=1;st.push(q)}};
  for(let i=0;i<w;i++){push(i,0);push(i,h-1)}for(let j=0;j<h;j++){push(0,j);push(w-1,j)}
  while(st.length){const q=st.pop(),px=q%w,py=(q/w)|0;
    if(px>0)push(px-1,py);if(px<w-1)push(px+1,py);if(py>0)push(px,py-1);if(py<h-1)push(px,py+1)}
  for(let q=0;q<w*h;q++){const i=q*4;
    if(seen[q]){const L=(d[i]+d[i+1]+d[i+2])/3,a=L>=238?0:(238-L)/238*.85;d[i]=d[i+1]=d[i+2]=0;d[i+3]=a*255}
    else{let edge=false;const px=q%w,py=(q/w)|0;
      if(px>0&&seen[q-1]||px<w-1&&seen[q+1]||py>0&&seen[q-w]||py<h-1&&seen[q+w])edge=true;
      if(edge&&(d[i]+d[i+1]+d[i+2])/3>215)d[i+3]=110}}
  x.putImageData(id,0,0);x.clearRect(w*.7,0,w*.3,h*.27);return c;
}
/* fill a tile with the cut-out shoe; if processing is blocked, show the plain photo */
function fill(tile,key,alt){
  const im=new Image();im.crossOrigin='anonymous';
  im.onload=()=>{let el;try{el=cutout(im)}catch(e){el=im;el.className='cut'}
    el.setAttribute('role','img');el.setAttribute('aria-label',alt||'');tile.appendChild(el);requestAnimationFrame(()=>el.classList.add('in'))};
  im.src=U(key);
}
const io='IntersectionObserver'in window?new IntersectionObserver((s,o)=>s.forEach(x=>{if(x.isIntersecting){o.unobserve(x.target);fill(x.target,x.target.dataset.k,x.target.dataset.alt)}}),{rootMargin:'200px'}):null;
const watch=t=>io?io.observe(t):fill(t,t.dataset.k,t.dataset.alt);

const g=document.getElementById('grid');
if(g){
  const draw=f=>{g.innerHTML=P.filter(p=>f==='all'||p.t===f).map(p=>`<a class="pc" href="contact.html"><div class="tile" style="--tb:${C[p.c][0]};--tg:${C[p.c][1]}" data-k="${p.k}" data-alt="${p.n}, ${p.c}"></div><div class="m"><span>${p.n}<small>${p.c}</small></span><span class="pr">${p.p}</span></div></a>`).join('');
    g.querySelectorAll('.tile').forEach(watch)};
  draw('all');
  document.querySelectorAll('.filters button').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('.filters button').forEach(x=>x.setAttribute('aria-pressed',x===b));
    draw(b.dataset.f);
  });
}
document.querySelectorAll('.tile[data-k]:not(.pc .tile)').forEach(watch);
