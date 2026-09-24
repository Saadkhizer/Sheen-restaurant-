"use client";
// ===== ADDED (rev6): ProductCarousel — modern center-focus coverflow of Sheen products =====
// Cards flow continuously; the card nearest the centre grows + gets a highlight
// ring (coverflow). Drag/swipe, prev/next arrows, and pause/play all work on
// mobile + desktop. Pure requestAnimationFrame — NO animation library, nothing
// to install, fully free. Respects prefers-reduced-motion. Styling: globals.css (.pcf-*).
import {useEffect,useRef,useState} from "react";

export default function ProductCarousel({items=[]}){
 const loopItems=[...items,...items]; // doubled for a seamless wrap
 const vpRef=useRef(null), trackRef=useRef(null), cardsRef=useRef([]);
 const [paused,setPaused]=useState(false);
 const S=useRef({off:0,half:0,paused:false,drag:false,startX:0,startOff:0,jump:0,last:0});

 useEffect(()=>{
  const vp=vpRef.current, track=trackRef.current;
  if(!vp||!track) return;
  const reduce=matchMedia("(prefers-reduced-motion: reduce)").matches;
  const cards=cardsRef.current.filter(Boolean);
  const measure=()=>{ S.current.half=track.scrollWidth/2; };
  measure();
  const speed=reduce?0:34; // px per second
  S.current.paused=reduce; if(reduce) setPaused(true);
  let raf;
  const tick=(t)=>{
   const s=S.current;
   const dt=s.last?Math.min(0.05,(t-s.last)/1000):0; s.last=t;
   if(!s.drag && !s.paused) s.off+=speed*dt;
   if(Math.abs(s.jump)>0.4){ const d=s.jump*0.12; s.off+=d; s.jump-=d; } else s.jump=0;
   if(s.half){ s.off%=s.half; if(s.off<0) s.off+=s.half; }
   track.style.transform=`translate3d(${-s.off}px,0,0)`;
   const r=vp.getBoundingClientRect(), vc=r.left+r.width/2, fall=r.width*0.42;
   let best=1e9,bc=null;
   for(const c of cards){
    const cr=c.getBoundingClientRect(), cx=cr.left+cr.width/2, dist=Math.abs(cx-vc);
    const dn=Math.min(1,dist/fall);
    c.style.transform=`scale(${(1-dn*0.24).toFixed(3)})`;
    c.style.opacity=(1-dn*0.5).toFixed(3);
    c.style.zIndex=String(1000-Math.round(dn*1000));
    if(c.classList.contains("pcf-center")) c.classList.remove("pcf-center");
    if(dist<best){best=dist;bc=c;}
   }
   if(bc) bc.classList.add("pcf-center");
   raf=requestAnimationFrame(tick);
  };
  raf=requestAnimationFrame(tick);
  const onResize=()=>measure();
  window.addEventListener("resize",onResize);
  return ()=>{ cancelAnimationFrame(raf); window.removeEventListener("resize",onResize); };
 },[items]);

 const toggle=()=>{ const p=!S.current.paused; S.current.paused=p; setPaused(p); };
 const nudge=(dir)=>{ S.current.paused=true; setPaused(true); S.current.jump+=dir*260; };
 const onDown=e=>{ const s=S.current; s.drag=true; s.startX=e.clientX; s.startOff=s.off; try{e.currentTarget.setPointerCapture(e.pointerId);}catch(_){} };
 const onMove=e=>{ const s=S.current; if(!s.drag) return; s.off=s.startOff-(e.clientX-s.startX); };
 const onUp=()=>{ S.current.drag=false; };

 return (
  <section className="pcf-section" aria-label="Sheen products">
   <div className="container pcf-head"><p className="eyebrow">Fresh off the grill</p><h2>THE <span className="orange-text">SHEEN</span> LINE-UP.</h2></div>
   <div className="pcf-viewport" ref={vpRef} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerCancel={onUp}>
    <div className="pcf-track" ref={trackRef}>
     {loopItems.map((it,i)=>(
      <figure className="pcf-card" key={i} ref={el=>{cardsRef.current[i]=el;}} aria-hidden={i>=items.length?"true":undefined}>
       {/* eslint-disable-next-line @next/next/no-img-element */}
       <img src={it.img} alt={i>=items.length?"":it.name} draggable="false" loading="lazy"/>
       <figcaption className="pcf-meta"><span className="pcf-name">{it.name}</span>{it.price?<span className="pcf-price">{it.price}</span>:null}</figcaption>
      </figure>
     ))}
    </div>
   </div>
   <div className="pcf-ctrls">
    <button className="pcf-btn" onClick={()=>nudge(-1)} aria-label="Previous">&#8592;</button>
    <button className="pcf-btn pcf-play" onClick={toggle} aria-pressed={paused}><span className="pcf-dot"/>{paused?"Play":"Pause"}</button>
    <button className="pcf-btn" onClick={()=>nudge(1)} aria-label="Next">&#8594;</button>
   </div>
  </section>
 );
}
