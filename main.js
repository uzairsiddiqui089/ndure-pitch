const P=[
{n:"Men's Formal Shoes",c:"tan",p:"Rs.6,499",t:"formal",i:["1_293357c3-ac32-4dbe-85cd-1867144f15c9","3_38375905-f887-4082-b8dc-8e2934ffdeaf"]},
{n:"Women's Mesh Slip-On Sneakers",c:"maroon",p:"Rs.3,499",t:"sneakers",i:["4_312682d2-ab03-41d3-9e05-6d3fc70e5025","5_efbb197b-04d3-4daf-b041-12eb91939d01"]},
{n:"Men's Leather Loafers",c:"dark grey",p:"Rs.6,999",t:"loafers",i:["1_6c0af1c2-015b-4972-a0ee-2c341e605c38","3_671bd3f8-a6db-4019-b09c-105bccd150ac"]},
{n:"Women's Mesh Slip-On Sneakers",c:"teal",p:"Rs.3,499",t:"sneakers",i:["5_9ba86217-02d8-4232-bae9-d2126df79e72","4_71fc7411-9c61-4d54-a4f0-6c9dc89c7654"]},
{n:"Men's Formal Shoes",c:"black",p:"Rs.6,499",t:"formal",i:["1_11187382-a5b8-403d-9a1b-47e69ac4637c","3_c6f132e6-1001-4948-989c-9c4ed0546363"]},
{n:"Women's Casual Loafers",c:"maroon",p:"Rs.4,999",t:"loafers",i:["1_470e62d5-7a0c-423c-9f08-6e1d63378fd8","3_459d45ba-0fa1-49fa-809f-0fa2707398f0"]},
{n:"Men's Leather Loafers",c:"camel",p:"Rs.6,999",t:"loafers",i:["1_b2cfb9fc-b024-4e6b-acb9-311df4c6ad84","3_185e2482-6350-45b2-a81e-ad1f2b8b3237"]},
{n:"Women's Casual Loafers",c:"fawn",p:"Rs.4,999",t:"loafers",i:["3_4df4924f-07a3-439e-ab53-0b5fb470a7f8","2_68907a68-e7d9-4288-94cb-e192162501e7"]}];
const img=(k,w=700)=>`https://www.ndure.com/cdn/shop/files/${k}.jpg?width=${w}`;

document.querySelectorAll('.reveal').forEach(e=>new IntersectionObserver((s,o)=>s.forEach(x=>{if(x.isIntersecting){x.target.classList.add('in');o.unobserve(x.target)}}),{threshold:.15}).observe(e));

const g=document.getElementById('grid');
if(g){
  const draw=f=>{g.innerHTML=P.filter(p=>f==='all'||p.t===f).map(p=>`<a class="card" href="contact.html"><div class="ph"><img src="${img(p.i[0])}" alt="${p.n}, ${p.c}" loading="lazy"><img src="${img(p.i[1])}" alt="" loading="lazy"></div><div class="m"><span>${p.n}<small>${p.c}</small></span><span>${p.p}</span></div></a>`).join('')};
  draw('all');
  document.querySelectorAll('.filters button').forEach(b=>b.onclick=()=>{
    document.querySelectorAll('.filters button').forEach(x=>x.setAttribute('aria-pressed',x===b));
    draw(b.dataset.f);
  });
}

const ch=[...document.querySelectorAll('.chapters section')];
ch.forEach(c=>{const w=document.createElement('div');w.className='in';w.append(...c.childNodes);c.append(w)});
if(ch.length){
  const hero=document.querySelector('.hero'),stage=document.querySelector('.stage'),shoes=[...stage.querySelectorAll('.shoe')],num=stage.querySelector('.num');
  const calm=matchMedia('(prefers-reduced-motion:reduce)').matches;
  const dots=document.createElement('ol');dots.className='dots';dots.innerHTML=ch.map(()=>'<li></li>').join('');stage.appendChild(dots);
  let cur=-1,tick=false;
  const upd=()=>{tick=false;
    const vh=innerHeight,phone=innerWidth<=800;
    const probe=phone?vh*.62:vh*.5;
    let a=-1;
    ch.forEach((c,i)=>{const r=c.getBoundingClientRect();if(r.top<=probe&&r.bottom>probe)a=i});
    if(a!==cur){
      cur=a;
      document.body.dataset.theme=a<0?(ch[0].getBoundingClientRect().top>probe?'tan':ch[ch.length-1].dataset.theme):ch[a].dataset.theme;
      shoes.forEach((e,j)=>e.classList.toggle('on',j===Math.max(a,0)));
      ch.forEach((c,j)=>c.classList.toggle('on',j===a));
      [...dots.children].forEach((d,j)=>d.classList.toggle('on',j===a));
      if(a>=0)num.textContent='0'+(a+1);
    }
    if(!calm){
      hero.style.setProperty('--hp',Math.min(1,Math.max(0,scrollY/(vh*.9))).toFixed(3));
      if(cur>=0){const r=ch[cur].getBoundingClientRect();shoes[cur].style.setProperty('--t',Math.min(1,Math.max(0,(probe-r.top)/r.height)).toFixed(3))}
    }
  };
  addEventListener('scroll',()=>{if(!tick){tick=true;requestAnimationFrame(upd)}},{passive:true});
  addEventListener('resize',upd);upd();
}
