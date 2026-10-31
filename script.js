// Logo preloader: spinning logo first, then the site opens
(function(){
 const p=document.getElementById('preloader');if(!p)return;
 const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches,min=reduce?500:(matchMedia('(max-width:768px)').matches?1100:2300),t0=performance.now();let gone=false;
 document.body.style.overflow='hidden';
 function hide(){if(gone)return;gone=true;p.classList.add('hide');document.body.style.overflow='';
  window.heroT0=performance.now()/1000;
  const s=document.querySelector('.hero-slide.active');if(s){s.classList.remove('active');void s.offsetWidth;s.classList.add('active')}
  dispatchEvent(new Event('siteready'));setTimeout(()=>p.remove(),1000)}
 function done(){setTimeout(hide,Math.max(0,min-(performance.now()-t0)))}
 document.readyState==='complete'?done():addEventListener('load',done);
 setTimeout(hide,6000);
})();

// Accuratis Advisors - interactions + 3D hero
const header=document.getElementById('header'),nav=document.getElementById('nav'),btn=document.getElementById('mobileMenuBtn');
addEventListener('scroll',()=>header&&header.classList.toggle('scrolled',scrollY>50),{passive:true});
function setMenu(open){if(!nav||!btn)return;nav.classList.toggle('active',open);btn.setAttribute('aria-expanded',open);btn.setAttribute('aria-label',open?'Close menu':'Open menu');const i=btn.querySelector('i');if(i){i.classList.toggle('fa-bars',!open);i.classList.toggle('fa-times',open)}}
btn&&btn.addEventListener('click',e=>{e.stopPropagation();setMenu(!nav.classList.contains('active'))});
nav&&nav.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
document.addEventListener('click',e=>{if(nav&&nav.classList.contains('active')&&!nav.contains(e.target))setMenu(false)});
addEventListener('keydown',e=>{if(e.key==='Escape')setMenu(false)});
addEventListener('resize',()=>{if(innerWidth>992)setMenu(false)});

// Scroll reveal + 3D tilt on cards
const sel='.service-card,.feature-card,.why-choose-card,.testimonial-card,.contact-form-wrapper,.about-content,.about-image,.step-card,.help-card,.calc-card,.team-card,.promise-card,.docs-card';
const els=document.querySelectorAll(sel);
const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;
const io=new IntersectionObserver(es=>es.forEach(e=>{if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}}),{threshold:.12});
els.forEach((el,i)=>{el.classList.add('rv');el.style.transitionDelay=(i%4)*80+'ms';io.observe(el)});
if(!reduce&&matchMedia('(hover:hover)').matches){
 els.forEach(el=>{
  el.addEventListener('mousemove',e=>{const b=el.getBoundingClientRect(),x=(e.clientX-b.left)/b.width-.5,y=(e.clientY-b.top)/b.height-.5;
   el.classList.add('tilting');el.style.transitionDelay='0ms';
   el.style.transform=`perspective(900px) rotateX(${-y*10}deg) rotateY(${x*12}deg) translateZ(14px)`});
  el.addEventListener('mouseleave',()=>{el.classList.remove('tilting');el.style.transform=''});
 });
}

// Contact form -> inquiry email (via FormSubmit; works once the site is hosted)
const INQUIRY_EMAIL='kumar.jit1504@gmail.com'; // change this to the email that should receive inquiries
const f=document.getElementById('contactForm'),fs=document.getElementById('formStatus');
f&&f.addEventListener('submit',async e=>{e.preventDefault();
 const d=Object.fromEntries(new FormData(f));if(d._honey)return;
 const btn=f.querySelector('button[type=submit]'),lab=btn.querySelector('span'),old=lab.textContent;
 btn.disabled=true;lab.textContent='Sending...';fs.className='form-status';fs.textContent='';
 try{
  const res=await fetch('https://formsubmit.co/ajax/'+INQUIRY_EMAIL,{method:'POST',headers:{'Content-Type':'application/json',Accept:'application/json'},
   body:JSON.stringify({Name:d.name,Email:d.email,Phone:d.phone||'-',Service:({accounting:'Accounting Services',tax:'Tax Planning',advisory:'Financial Advisory',business:'Business Advisory',cloud:'Cloud Accounting',audit:'Audit & Assurance',other:'Other'})[d.service]||d.service,Message:d.message,_replyto:d.email,_subject:'New inquiry - Accuratis Advisors website',_template:'table',_captcha:'false'})});
  const j=await res.json();if(!res.ok||j.success==='false')throw 0;
  fs.className='form-status ok';fs.textContent='Thank you! Your inquiry has been sent. We will contact you shortly.';f.reset();
 }catch(err){fs.className='form-status err';fs.textContent='Sorry, we could not send your message. Please WhatsApp us or email '+INQUIRY_EMAIL+'.'}
 btn.disabled=false;lab.textContent=old});

// 3D hero v3: logo coin + env reflections + glow + growth bars + orbiting service plates
(function(){
 const cv=document.getElementById('hero3d');if(!cv||!window.THREE)return;
 let r;try{r=new THREE.WebGLRenderer({canvas:cv,alpha:true,antialias:true})}catch(e){return}
 r.setPixelRatio(Math.min(devicePixelRatio,matchMedia('(max-width:768px)').matches?1.25:2));r.toneMapping=THREE.ACESFilmicToneMapping;r.toneMappingExposure=1.15;
 const sc=new THREE.Scene(),cam=new THREE.PerspectiveCamera(40,1,.1,100);
 const cvs=(w,h,fn)=>{const c=document.createElement('canvas');c.width=w;c.height=h;fn(c.getContext('2d'),w,h);const t=new THREE.CanvasTexture(c);t.anisotropy=4;return t};
 // studio-like environment so metals reflect light
 const env=cvs(512,256,(x,w,h)=>{const g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#ffffff');g.addColorStop(.5,'#bfe3e6');g.addColorStop(1,'#6b5a2e');x.fillStyle=g;x.fillRect(0,0,w,h);
  x.fillStyle='#fff';[60,200,330,450].forEach(a=>x.fillRect(a,30,34,150));x.fillStyle='#3aa6a0';x.fillRect(120,60,26,100);});
 env.mapping=THREE.EquirectangularReflectionMapping;
 const pm=new THREE.PMREMGenerator(r);sc.environment=pm.fromEquirectangular(env).texture;
 sc.add(new THREE.AmbientLight(0xffffff,.35));
 const dl=new THREE.DirectionalLight(0xffffff,1.1);dl.position.set(4,6,8);sc.add(dl);
 const pl=new THREE.PointLight(0x3aa6a0,2,40);pl.position.set(-7,2,6);sc.add(pl);
 // coin: front = brand logo, back = rupee
 const ring=(x)=>{x.strokeStyle='#8f7236';x.lineWidth=14;x.beginPath();x.arc(256,256,240,0,7);x.stroke()};
 const gold=(x,w)=>{const g=x.createRadialGradient(256,200,40,256,256,270);g.addColorStop(0,'#f3e2a9');g.addColorStop(.6,'#c9a962');g.addColorStop(1,'#8f7236');x.fillStyle=g;x.fillRect(0,0,w,w)};
 const front=cvs(512,512,(x,w)=>{gold(x,w);ring(x);x.fillStyle='#fff';x.beginPath();x.arc(256,256,212,0,7);x.fill()});
 if(window.LOGO_DATA){const im=new Image();im.onload=()=>{const x=front.image.getContext('2d');x.save();x.beginPath();x.arc(256,256,212,0,7);x.clip();x.drawImage(im,44,44,424,424);x.restore();front.needsUpdate=true};im.src=window.LOGO_DATA}
 const back=cvs(512,512,(x,w)=>{gold(x,w);ring(x);x.strokeStyle='#8f7236';x.lineWidth=4;x.beginPath();x.arc(256,256,205,0,7);x.stroke();
  x.fillStyle='#6f5622';x.font='bold 300px Arial,sans-serif';x.textAlign='center';x.textBaseline='middle';x.fillText('\u20B9',256,275)});
 back.wrapS=THREE.RepeatWrapping;back.repeat.x=-1;
 const side=new THREE.MeshStandardMaterial({color:0xd9b866,metalness:1,roughness:.22});
 const coin=new THREE.Mesh(new THREE.CylinderGeometry(2.1,2.1,.42,80),[side,new THREE.MeshStandardMaterial({map:front,metalness:.5,roughness:.35}),new THREE.MeshStandardMaterial({map:back,metalness:.8,roughness:.3})]);
 coin.rotation.x=Math.PI/2;const cg=new THREE.Group();cg.add(coin);sc.add(cg);
 // glow behind coin
 const glow=new THREE.Sprite(new THREE.SpriteMaterial({map:cvs(256,256,(x,w)=>{const g=x.createRadialGradient(128,128,0,128,128,128);g.addColorStop(0,'rgba(58,166,160,.65)');g.addColorStop(.5,'rgba(201,169,98,.25)');g.addColorStop(1,'rgba(0,0,0,0)');x.fillStyle=g;x.fillRect(0,0,w,w)}),blending:THREE.AdditiveBlending,depthWrite:false,transparent:true}));
 glow.scale.set(11,11,1);glow.position.z=-2;sc.add(glow);
 // rings
 const mk=(R,t,c,rx,ry)=>{const m=new THREE.Mesh(new THREE.TorusGeometry(R,t,20,140),new THREE.MeshStandardMaterial({color:c,metalness:.7,roughness:.2,emissive:c,emissiveIntensity:.25}));m.rotation.set(rx,ry,0);sc.add(m);return m};
 const r1=mk(3,.09,0x3aa6a0,1.15,.3),r2=mk(3.4,.05,0x3b6ea5,1.9,-.4);
 // growth bars + arrow behind (like the logo)
 const bars=[1.4,2.2,3,4,5.2].map((h,i)=>{const gm=new THREE.BoxGeometry(1,h,1);gm.translate(0,h/2,0);
  const m=new THREE.Mesh(gm,new THREE.MeshStandardMaterial({color:i==4?0x3aa6a0:0x3b6ea5,metalness:.5,roughness:.3,emissive:0x3aa6a0,emissiveIntensity:.12}));
  m.position.set(-4.6+i*2.3,-3.4,-4);sc.add(m);return m});
 const tealM=new THREE.MeshStandardMaterial({color:0x3aa6a0,metalness:.6,roughness:.25,emissive:0x3aa6a0,emissiveIntensity:.4});
 const A=[-5.6,-2.6],B=[5.8,3.2],L=Math.hypot(B[0]-A[0],B[1]-A[1]),ang=Math.atan2(B[1]-A[1],B[0]-A[0])-Math.PI/2;
 const sh=new THREE.Mesh(new THREE.CylinderGeometry(.13,.13,L,16),tealM);sh.position.set((A[0]+B[0])/2,(A[1]+B[1])/2,-3.2);sh.rotation.z=ang;sc.add(sh);
 const hd=new THREE.Mesh(new THREE.ConeGeometry(.45,1,20),tealM);hd.position.set(B[0],B[1],-3.2);hd.rotation.z=ang;sc.add(hd);
 // orbiting service plates
 const plates=[['GST','Returns & Filing'],['Income Tax','ITR & Planning'],['TDS','Returns'],['PF / ESI','Compliance'],['MSME','Udyam Reg.']].map(([a,b])=>{
  const t=cvs(512,200,(x,w,h)=>{const g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,'#1e3a5f');g.addColorStop(1,'#2d5a87');x.fillStyle=g;
   x.beginPath();x.roundRect(6,6,w-12,h-12,34);x.fill();x.strokeStyle='#3aa6a0';x.lineWidth=6;x.stroke();
   x.fillStyle='#fff';x.font='bold 76px Poppins,Arial,sans-serif';x.textAlign='center';x.fillText(a,w/2,100);
   x.fillStyle='#e8d5a3';x.font='38px Poppins,Arial,sans-serif';x.fillText(b,w/2,152)});
  const m=new THREE.Mesh(new THREE.PlaneGeometry(2.7,1.05),new THREE.MeshBasicMaterial({map:t,transparent:true,alphaTest:.05,side:THREE.DoubleSide}));sc.add(m);return m});
 const n=90,pos=new Float32Array(n*3);for(let i=0;i<n*3;i++)pos[i]=(Math.random()-.5)*(i%3==2?10:15);
 const pg=new THREE.BufferGeometry();pg.setAttribute('position',new THREE.BufferAttribute(pos,3));
 const dust=new THREE.Points(pg,new THREE.PointsMaterial({color:0xe8d5a3,size:.08,transparent:true,opacity:.85}));sc.add(dust);
 const shG=[new THREE.OctahedronGeometry(.28),new THREE.BoxGeometry(.4,.4,.4),new THREE.TetrahedronGeometry(.36)],shM=[new THREE.MeshStandardMaterial({color:0xc9a962,metalness:1,roughness:.2}),new THREE.MeshStandardMaterial({color:0x3aa6a0,metalness:.8,roughness:.25})];
 const shards=Array.from({length:18},(_,k)=>{const m=new THREE.Mesh(shG[k%3],shM[k%2]),a=Math.random()*6.28,R=5.5+Math.random()*3.5;m.userData={a,R,y:(Math.random()-.5)*6,z:(Math.random()-.5)*7,s:.15+Math.random()*.3,p:Math.random()*6};sc.add(m);return m});
 let baseZ=14;function fit(){const p=cv.parentElement,w=p.clientWidth,h=p.clientHeight;r.setSize(w,h,false);cam.aspect=w/h;cam.updateProjectionMatrix();baseZ=w<500?19:14}
 fit();addEventListener('resize',fit);
 const ms={x:0,y:0};addEventListener('mousemove',e=>{ms.x=e.clientX/innerWidth-.5;ms.y=e.clientY/innerHeight-.5});
 let boost=0;cv.style.pointerEvents='auto';cv.style.cursor='pointer';cv.addEventListener('click',()=>boost=16);let swoop=0;const cols=[0x3aa6a0,0xc9a962,0x4da3ff,0x5be0a1];
 addEventListener('heroslide',ev=>{const c=cols[ev.detail%4];boost=22;swoop=1;glow.material.color.set(c);r1.material.color.set(c);r1.material.emissive.set(c)});
 const red=matchMedia('(prefers-reduced-motion:reduce)').matches;let last=0,spin=0;
 const ease=k=>{k=Math.max(0,Math.min(1,k));return 1-Math.pow(1-k,3)};
 (function loop(t){t*=.001;const dt=Math.min(t-last,.05);last=t;const e=red?1:ease((t-(window.heroT0||1e9))/2);
  cam.position.set(ms.x*1.6,.6-ms.y*1,baseZ+(1-e)*9+swoop*2.5);swoop*=.94;cam.lookAt(0,0,0);
  boost*=.95;spin+=dt*(.8+boost+Math.min(scrollY,800)*.002);
  cg.rotation.y=spin;cg.rotation.x+=((ms.y*.5)-cg.rotation.x)*.06;cg.position.y=Math.sin(t*1.3)*.15;cg.scale.setScalar(.3+.7*e);
  r1.rotation.z=t*.3;r2.rotation.z=-t*.22;
  bars.forEach((b,i)=>b.scale.y=Math.max(.01,ease((t-(window.heroT0||1e9))/2.4-i*.12))*(1+Math.sin(t*1.5+i)*.05));
  plates.forEach((p,i)=>{const a=t*.45+i*Math.PI*2/plates.length;
   p.position.set(Math.cos(a)*4.8*e,Math.sin(t*.9+i*1.7)*.7+(i%2?.9:-.9),Math.sin(a)*3.4*e);p.lookAt(cam.position);
   const k=1+(p.position.z/3.4)*.22;p.scale.set(k*e,k*e,1)});
  dust.rotation.y=t*.03;shards.forEach(m=>{const u=m.userData,a=u.a+t*.12*(u.s+.1);m.position.set(Math.cos(a)*u.R*.85,u.y+Math.sin(t+u.p)*.4,u.z+Math.sin(a)*1.5);m.rotation.x=t*u.s*3;m.rotation.y=t*u.s*2;m.scale.setScalar(e)});glow.material.opacity=.8+Math.sin(t*2)*.15;r.render(sc,cam);if(!red)requestAnimationFrame(loop)})(0);
})();

// WhatsApp button
(function(){
 const a=document.createElement('a');a.className='wa-float';a.href='https://wa.me/918375994050?text=Hi%20Accuratis%20Advisors%2C%20I%20need%20help%20with%20accounting%20%2F%20tax.';
 a.target='_blank';a.rel='noopener';a.setAttribute('aria-label','Chat on WhatsApp');a.innerHTML='<i class="fab fa-whatsapp"></i>';document.body.appendChild(a);
})();

// FAQ: keep one answer open at a time
document.querySelectorAll('.faq-item').forEach(d=>d.addEventListener('toggle',()=>{if(d.open)document.querySelectorAll('.faq-item[open]').forEach(o=>o!==d&&(o.open=false))}));

// GST calculator
(function(){
 const $=id=>document.getElementById(id),fm=n=>'\u20B9'+Math.round(n).toLocaleString('en-IN');
 if(!$('gstAmt'))return;
 function gst(){const a=+$('gstAmt').value||0,r=+$('gstRate').value||0,rm=document.querySelector('[name=gstMode]:checked').value==='remove';
  const net=rm?a/(1+r/100):a,tax=rm?a-net:a*r/100;$('gNet').textContent=fm(net);$('gTax').textContent=fm(tax)+' ('+fm(tax/2)+' + '+fm(tax/2)+')';$('gTot').textContent=fm(net+tax)}
 document.querySelectorAll('.chip').forEach(c=>c.addEventListener('click',()=>{$('gstRate').value=c.dataset.r;document.querySelectorAll('.chip').forEach(x=>x.classList.toggle('active',x===c));gst()}));
 ['gstAmt','gstRate'].forEach(i=>$(i).addEventListener('input',()=>{document.querySelectorAll('.chip').forEach(c=>c.classList.toggle('active',c.dataset.r===$('gstRate').value));gst()}));
 document.querySelectorAll('[name=gstMode]').forEach(r=>r.addEventListener('change',gst));gst();
})();

// Documents checklist
(function(){
 const tabs=document.querySelectorAll('.doc-tab'),wa=document.getElementById('docWa');if(!tabs.length)return;
 function upd(){const p=document.querySelector('.doc-pane.active'),all=p.querySelectorAll('input'),n=p.querySelectorAll('input:checked').length;
  document.getElementById('docBar').style.width=(n/all.length*100)+'%';document.getElementById('docCount').textContent=n+' of '+all.length+' ready';
  wa.href='https://wa.me/918375994050?text='+encodeURIComponent('Hi Accuratis Advisors, I need help with '+p.dataset.name+'. I have '+n+' of '+all.length+' documents ready.')}
 tabs.forEach(t=>t.addEventListener('click',()=>{document.querySelectorAll('.doc-tab,.doc-pane').forEach(e=>e.classList.remove('active'));t.classList.add('active');document.getElementById('doc-'+t.dataset.d).classList.add('active');upd()}));
 document.querySelectorAll('.doc-item input').forEach(i=>i.addEventListener('change',upd));upd();
})();

// Hero slideshow
(function(){
 const sl=document.querySelector('.hero-slides');if(!sl)return;
 const slides=[...sl.children],dots=[...document.querySelectorAll('.hero-dot')],hero=document.getElementById('home');
 const reduce=matchMedia('(prefers-reduced-motion:reduce)').matches;let i=0,timer,paused=false;
 function restart(){clearTimeout(timer);if(!reduce&&!paused)timer=setTimeout(()=>go(i+1),6000)}
 function go(n){n=(n+slides.length)%slides.length;if(n===i){restart();return}
  const old=slides[i];old.classList.remove('active');old.classList.add('leaving');old.setAttribute('aria-hidden','true');setTimeout(()=>old.classList.remove('leaving'),950);
  i=n;slides[i].classList.add('active');slides[i].removeAttribute('aria-hidden');
  dots.forEach((d,k)=>{d.classList.remove('active');if(k===i){void d.offsetWidth;d.classList.add('active')}});
  dispatchEvent(new CustomEvent('heroslide',{detail:i}));restart()}
 dots.forEach((d,k)=>d.addEventListener('click',()=>go(k)));
 document.getElementById('heroPrev').addEventListener('click',()=>go(i-1));
 document.getElementById('heroNext').addEventListener('click',()=>go(i+1));
 addEventListener('siteready',()=>{if(i===0)restart()});
 hero.addEventListener('mouseenter',()=>{paused=true;clearTimeout(timer);hero.classList.add('hero-slider-paused')});
 hero.addEventListener('mouseleave',()=>{paused=false;hero.classList.remove('hero-slider-paused');restart()});
 let x0=null;sl.addEventListener('touchstart',e=>x0=e.touches[0].clientX,{passive:true});
 sl.addEventListener('touchend',e=>{if(x0===null)return;const dx=e.changedTouches[0].clientX-x0;if(Math.abs(dx)>50)go(i+(dx<0?1:-1));x0=null});
 restart();
})();

// Open / closed badge (Mon-Fri 9:00-18:00 IST)
(function(){
 const b=document.getElementById('openBadge');if(!b)return;
 const d=new Date(new Date().toLocaleString('en-US',{timeZone:'Asia/Kolkata'})),day=d.getDay(),m=d.getHours()*60+d.getMinutes();
 const open=day>=1&&day<=5&&m>=540&&m<1080;
 b.className='open-badge '+(open?'open':'closed');
 b.textContent=open?'Open now \u00B7 until 6:00 PM':(day>=1&&day<=5&&m<540?'Closed now \u00B7 opens at 9:00 AM':'Closed now \u00B7 Sat-Sun by appointment');
})();
