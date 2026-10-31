// Dark mode + Hindi/English toggle
(function(){
 const root=document.documentElement;
 const get=k=>{try{return localStorage.getItem(k)}catch(e){return null}};
 const set=(k,v)=>{try{localStorage.setItem(k,v)}catch(e){}};

 /* ---------- Dark mode ---------- */
 const tBtn=document.getElementById('themeBtn');
 let meta=document.querySelector('meta[name="theme-color"]');
 if(!meta){meta=document.createElement('meta');meta.name='theme-color';document.head.appendChild(meta)}
 function applyTheme(t){
  if(t==='dark')root.setAttribute('data-theme','dark');else root.removeAttribute('data-theme');
  meta.content=t==='dark'?'#0b1424':'#ffffff';
  if(tBtn){const i=tBtn.querySelector('i');if(i)i.className=t==='dark'?'fas fa-sun':'fas fa-moon';tBtn.setAttribute('aria-pressed',String(t==='dark'))}
 }
 const theme=()=>root.getAttribute('data-theme')==='dark'?'dark':'light';
 applyTheme(theme());
 tBtn&&tBtn.addEventListener('click',()=>{const n=theme()==='dark'?'light':'dark';applyTheme(n);set('theme',n)});

 /* ---------- Hindi / English ---------- */
 const HI=window.HI_DICT||{},HIA=window.HI_ATTR||{};
 const REV={};Object.keys(HI).forEach(k=>REV[HI[k]]=k);
 const REVA={};Object.keys(HIA).forEach(k=>REVA[HIA[k]]=k);
 const nodes=new WeakMap(),attrs=new WeakMap();
 const ATTRS=['placeholder','aria-label'];
 const SKIP={SCRIPT:1,STYLE:1,NOSCRIPT:1};
 const patterns=[
  [/^(\d+) of (\d+) ready$/,m=>m[1]+' / '+m[2]+' तैयार'],
  [/^Sorry, we could not send your message\. Please WhatsApp us or email (.+)\.$/,m=>'क्षमा करें, आपका संदेश नहीं भेजा जा सका। कृपया हमें WhatsApp करें या ईमेल भेजें: '+m[1]+'।']
 ];
 const norm=s=>s.replace(/\s+/g,' ').trim();
 let lang='en';

 function translate(en){
  if(HI[en])return HI[en];
  for(const p of patterns){const m=en.match(p[0]);if(m)return p[1](m)}
  return null;
 }
 function doText(n){
  const v=n.nodeValue,rec=nodes.get(n);
  if(rec&&v===rec.hi)return;
  const key=norm(v);if(!key)return;
  const h=translate(key);
  if(!h){nodes.delete(n);return}
  const hi=v.match(/^\s*/)[0]+h+v.match(/\s*$/)[0];
  nodes.set(n,{en:v,hi});n.nodeValue=hi;
 }
 function doAttrs(el){
  ATTRS.forEach(a=>{
   const v=el.getAttribute(a);if(!v)return;
   const rec=attrs.get(el)||{};
   if(rec[a]&&v===rec[a].hi)return;
   const h=HIA[v];
   if(!h){delete rec[a];return}
   rec[a]={en:v,hi:h};attrs.set(el,rec);el.setAttribute(a,h);
  });
 }
 function walk(node,fn){
  if(node.nodeType===3){if(!(node.parentNode&&SKIP[node.parentNode.tagName]))fn.text(node);return}
  if(node.nodeType!==1||SKIP[node.tagName])return;
  fn.el(node);
  node.childNodes.forEach(c=>walk(c,fn));
 }
 const toHindi={text:doText,el:doAttrs};
 const toEnglish={
  text(n){
   const rec=nodes.get(n);
   if(rec&&n.nodeValue===rec.hi){n.nodeValue=rec.en;nodes.delete(n);return}
   const k=norm(n.nodeValue);if(REV[k]){n.nodeValue=n.nodeValue.replace(k,REV[k])}
  },
  el(el){
   ATTRS.forEach(a=>{
    const v=el.getAttribute(a);if(!v)return;
    const rec=attrs.get(el),r=rec&&rec[a];
    if(r&&v===r.hi){el.setAttribute(a,r.en);delete rec[a]}else if(REVA[v])el.setAttribute(a,REVA[v]);
   });
  }
 };

 const lBtn=document.getElementById('langBtn');
 function setLang(l,persist){
  lang=l;root.lang=l==='hi'?'hi':'en';
  if(persist)set('lang',l);
  if(l==='hi'){walk(document.body,toHindi);document.title=window.HI_TITLE||document.title}
  else{walk(document.body,toEnglish);document.title='Accuratis Advisors - Accounting & Tax Consultants'}
  if(lBtn){const s=lBtn.querySelector('span');if(s)s.textContent=l==='hi'?'EN':'हिं';
   lBtn.setAttribute('aria-label',l==='hi'?'Switch to English':'हिंदी में बदलें')}
 }
 // keep text translated when other scripts change it (calculator, form status, open/closed badge...)
 new MutationObserver(ms=>{
  if(lang!=='hi')return;
  ms.forEach(m=>{
   if(m.type==='characterData')walk(m.target,toHindi);
   else if(m.type==='childList')m.addedNodes.forEach(n=>walk(n,toHindi));
   else if(m.type==='attributes')doAttrs(m.target);
  });
 }).observe(document.body,{childList:true,subtree:true,characterData:true,attributes:true,attributeFilter:ATTRS});

 lBtn&&lBtn.addEventListener('click',()=>setLang(lang==='hi'?'en':'hi',true));
 if(get('lang')==='hi')setLang('hi',false);
})();
