const cine=document.getElementById('cine'),rig=document.getElementById('rig'),wm=document.getElementById('wm'),hint=document.getElementById('hint');
const imgs=[...rig.querySelectorAll('img')],btns=[...document.querySelectorAll('.dots2 button')];
const T={t1:document.querySelector('.t1'),t2:document.querySelector('.t2'),t3:document.querySelector('.t3'),t4:document.querySelector('.t4')};
const cos=[...document.querySelectorAll('.co')];
const clamp=(v,a=0,b=1)=>Math.min(b,Math.max(a,v)),sm=t=>t*t*(3-2*t);
const trap=(p,a,b,c,d)=>p<a||p>d?0:p<b?sm((p-a)/(b-a)):p<c?1:sm(1-(p-c)/(d-c));
/* shoe keyframes: [progress, x(vw), y(vh), rotate(deg), scale] */
const K={
  desk:[[0,0,6,-9,1],[.2,0,6,-9,1.05],[.32,-17,2,-3,.86],[.5,-17,2,-3,.86],[.64,33,5,-11,1.7],[.8,33,5,-11,1.7],[.92,0,-14,0,.78],[1,0,-14,0,.78]],
  phone:[[0,0,10,-9,1],[.2,0,10,-9,1.05],[.32,0,-6,-2,.95],[.5,0,-6,-2,.95],[.64,24,14,-10,1.5],[.8,24,14,-10,1.5],[.92,0,6,0,.95],[1,0,6,0,.95]]
};
const at=(ks,p)=>{for(let i=0;i<ks.length-1;i++){const a=ks[i],b=ks[i+1];if(p<=b[0]){const t=sm(clamp((p-a[0])/((b[0]-a[0])||1)));return a.slice(1).map((v,j)=>v+(b[j+1]-v)*t)}}return ks[ks.length-1].slice(1)};
const colour=p=>p<.13?'red':p<.56?'blue':p<.83?'red':'blue';
let cur='';
function setColour(c){if(c===cur)return;cur=c;document.body.dataset.theme=c;imgs.forEach(i=>i.classList.toggle('on',i.dataset.c===c));btns.forEach(b=>b.classList.toggle('on',b.dataset.c===c))}
function place(){
  const phone=innerWidth<=800,r=cine.getBoundingClientRect(),p=clamp(-r.top/(r.height-innerHeight));
  const [x,y,rot,s]=at(phone?K.phone:K.desk,p);
  rig.style.transform=`translate(${x}vw,${y}vh) rotate(${rot}deg) scale(${s})`;
  wm.style.transform=`translateX(${(-p*14).toFixed(2)}vw) scale(${(1+p*.25).toFixed(3)})`;
  wm.style.opacity=(.9-trap(p,.55,.62,.82,.9)*.55).toFixed(2);
  const w1=trap(p,-1,-.5,.17,.26),w2=trap(p,.2,.29,.5,.58),w3=trap(p,.52,.62,.8,.88),w4=trap(p,.82,.92,2,3);
  const set=(el,w,dy=26)=>{el.style.opacity=w.toFixed(3);el.style.transform=`translateY(${((1-w)*dy).toFixed(1)}px)`;el.classList.toggle('live',w>.6)};
  set(T.t1,w1);set(T.t2,w2);set(T.t3,w3);set(T.t4,w4);
  cos.forEach((c,i)=>{const w=trap(p,.26+i*.012,.31+i*.012,.5,.57);c.style.opacity=w.toFixed(3);
    if(!phone){c.style.left=c.dataset.x+'vw';c.style.top=c.dataset.y+'vh';c.style.bottom='';c.style.setProperty('--len',c.dataset.len+'vw')}
    else{c.style.left='20px';c.style.top='auto';c.style.bottom=(24+(cos.length-1-i)*26+84)+'px';}});
  hint.style.opacity=p<.04?1:0;
  setColour(colour(p));
}
let tk=false;const loop=()=>{tk=false;place()};
addEventListener('scroll',()=>{if(!tk){tk=true;requestAnimationFrame(loop)}},{passive:true});addEventListener('resize',place);place();
btns.forEach(b=>b.onclick=()=>{const span=cine.offsetHeight-innerHeight,top=cine.offsetTop+span*(b.dataset.c==='red'?.04:.4);scrollTo({top,behavior:'smooth'})});
