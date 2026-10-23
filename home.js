const U=k=>`https://www.ndure.com/cdn/shop/files/${k}.jpg?width=1000`;
const V=[
  {k:'1_11187382-a5b8-403d-9a1b-47e69ac4637c',n:"Men's Formal Shoes — Black",p:'Rs.6,499'},
  {k:'4_312682d2-ab03-41d3-9e05-6d3fc70e5025',n:"Women's Mesh Slip-On Sneakers — Red",p:'Rs.3,499'},
  {k:'1_b2cfb9fc-b024-4e6b-acb9-311df4c6ad84',n:"Men's Leather Loafers — Camel",p:'Rs.6,999'},
  {k:'5_9ba86217-02d8-4232-bae9-d2126df79e72',n:"Women's Mesh Slip-On Sneakers — Blue",p:'Rs.3,499'},
  {k:'1_470e62d5-7a0c-423c-9f08-6e1d63378fd8',n:"Women's Casual Loafers — Maroon",p:'Rs.4,999'}
];
const cine=document.getElementById('cine'),rig=document.getElementById('rig'),wm=document.getElementById('wm'),hint=document.getElementById('hint'),dotsEl=document.getElementById('dots'),label=document.getElementById('label'),buy=document.getElementById('buy');
const T={t1:document.querySelector('.t1'),t2:document.querySelector('.t2'),t3:document.querySelector('.t3'),t4:document.querySelector('.t4')};
const cos=[...document.querySelectorAll('.co')];
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),sm=t=>t*t*(3-2*t);
const trap=(p,a,b,c,d)=>p<a||p>d?0:p<b?sm((p-a)/(b-a)):p<c?1:sm(1-(p-c)/(d-c));

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
const load=src=>new Promise((res,rej)=>{const i=new Image();i.crossOrigin='anonymous';i.onload=()=>res(i);i.onerror=rej;i.src=src});

const els=[];let ready=false,cur=-1,heroing=true,theme='';
Promise.all(V.map(v=>load(U(v.k)))).then(imgs=>{
  imgs.forEach((im,i)=>{let el;try{el=cutout(im)}catch(e){el=im;document.body.classList.add('fallback')}
    el.className='cut';el.setAttribute('role','img');el.setAttribute('aria-label',V[i].n);rig.appendChild(el);els.push(el)});
  ready=true;cur=-1;place();
}).catch(()=>{document.body.classList.add('fallback');V.forEach(v=>{const im=new Image();im.src=U(v.k);im.className='cut';im.alt=v.n;rig.appendChild(im);els.push(im)});ready=true;cur=-1;place()});

V.forEach((v,i)=>{const b=document.createElement('button');b.setAttribute('aria-label',v.n);b.onclick=()=>{const span=cine.offsetHeight-innerHeight;scrollTo({top:cine.offsetTop+span*(i*.055+.02),behavior:'smooth'})};dotsEl.appendChild(b)});

/* rig keyframes: [progress, x(vw), y(vh), rotate(deg), scale] */
const K={
  desk:[[0,0,5,-8,1.05],[.28,0,5,-8,1.05],[.35,-17,2,-3,.86],[.55,-17,2,-3,.86],[.64,33,5,-11,1.7],[.8,33,5,-11,1.7],[.9,0,-14,0,.78],[1,0,-14,0,.78]],
  phone:[[0,0,10,-8,1],[.28,0,10,-8,1.05],[.35,0,-6,-2,.95],[.55,0,-6,-2,.95],[.64,24,14,-10,1.5],[.8,24,14,-10,1.5],[.9,0,6,0,.95],[1,0,6,0,.95]]
};
const at=(ks,p)=>{for(let i=0;i<ks.length-1;i++){const a=ks[i],b=ks[i+1];if(p<=b[0]){const t=sm(clamp((p-a[0])/((b[0]-a[0])||1)));return a.slice(1).map((v,j)=>v+(b[j+1]-v)*t)}}return ks[ks.length-1].slice(1)};

function place(){
  const phone=innerWidth<=800,r=cine.getBoundingClientRect(),p=clamp(-r.top/(r.height-innerHeight));
  heroing=p<.30;
  const idx=heroing?Math.min(V.length-1,Math.floor(p/.055)):1;
  const t=heroing?'v'+idx:'light';if(t!==theme){theme=t;document.body.dataset.theme=t}
  if(ready&&idx!==cur){cur=idx;els.forEach((e,i)=>{e.classList.toggle('on',i===idx);e.classList.toggle('prev',i<idx)});label.textContent=V[idx].n+' · '+V[idx].p}
  [...dotsEl.children].forEach((d,i)=>d.classList.toggle('on',heroing&&i===idx));
  dotsEl.style.opacity=heroing?1:0;
  const [x,y,rot,s]=at(phone?K.phone:K.desk,p);
  rig.style.transform=`translate(${x}vw,${y}vh) rotate(${rot}deg) scale(${s})`;
  wm.style.transform=`translateX(${(-p*14).toFixed(2)}vw) scale(${(1+p*.25).toFixed(3)})`;
  wm.style.opacity=(.9-trap(p,.6,.66,.84,.92)*.5).toFixed(2);
  const w1=trap(p,-1,-.5,.26,.31),w2=trap(p,.3,.38,.54,.6),w3=trap(p,.58,.66,.82,.88),w4=trap(p,.84,.92,2,3);
  const set=(el,w,dy=26)=>{el.style.opacity=w.toFixed(3);el.style.transform=`translateY(${((1-w)*dy).toFixed(1)}px)`;el.classList.toggle('live',w>.6)};
  set(T.t1,w1);set(T.t2,w2);set(T.t3,w3);set(T.t4,w4);
  buy.style.opacity=w1.toFixed(3);buy.classList.toggle('live',w1>.6);
  cos.forEach((c,i)=>{const w=trap(p,.33+i*.012,.38+i*.012,.54,.6);c.style.opacity=w.toFixed(3);
    if(!phone){c.style.left=c.dataset.x+'vw';c.style.top=c.dataset.y+'vh';c.style.bottom='';c.style.setProperty('--len',c.dataset.len+'vw')}
    else{c.style.left='20px';c.style.top='auto';c.style.bottom=(24+(cos.length-1-i)*26+84)+'px'}});
  hint.style.opacity=p<.03?1:0;
}
let tk=false;
addEventListener('scroll',()=>{if(!tk){tk=true;requestAnimationFrame(()=>{tk=false;place()})}},{passive:true});
addEventListener('resize',place);place();
