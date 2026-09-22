// ============================================================================
// ADDED — scroll-world hero  (new file, nothing existing was modified)
// ----------------------------------------------------------------------------
// Mounts the vanilla-JS scrub engine at /public/scrub-engine.js.
// Scroll drives a pre-rendered camera flight; the page only sets
// video.currentTime from scroll position. Clips live in /public/clips/.
//
// To remove a block: delete its <ScrollWorld/> line in src/app/page.js.
// ============================================================================
'use client';

import {useEffect, useMemo, useRef, useState} from "react";
import Script from "next/script";

// ===== ADDED (rev 4): reserve the block's height before the engine mounts ====
// The engine only sizes its spacer once the script has loaded and run, which
// is after hydration. Until then the block occupies no height, so the moment
// it mounts everything below it jumps down by several screens. At the top of
// the page that is invisible; in the middle of the page it throws the whole
// layout around and wrecks the CLS score.
//
// Computing the same number the engine will compute, and reserving it in the
// server-rendered markup, means the space is already there and nothing moves.
function reservedScreens(config){
 const per = config.diveScroll ?? 1.3;
 const conn = config.connScroll ?? 0.9;
 const bands = (config.sections ?? []).reduce((a,s)=>a+(s.scroll ?? per), 0)
   + (config.connectors ?? []).filter(Boolean).length * conn;
 // engine: spacer height = bands * viewport + one trailing viewport
 return bands + 1;
}
// ===== END rev 4 =============================================================

export default function ScrollWorld({config, className}){
 const host = useRef(null);
 const [ready, setReady] = useState(false);
 const screens = useMemo(()=>reservedScreens(config), [config]);

 useEffect(()=>{
  if(!ready || !host.current || !window.mountScrollWorld) return;
  const instance = window.mountScrollWorld(host.current, config);
  // Engine tears its own DOM down and revokes its blob URLs on unmount.
  return ()=>instance?.destroy?.();
 },[ready,config]);

 return <>
  {/* afterInteractive: the engine is not needed for first paint — the poster
      stills render immediately and the video takes over once this loads. */}
  <Script src="/scrub-engine.js" strategy="afterInteractive" onReady={()=>setReady(true)}/>
  <div ref={host} className={className} style={{minHeight:`calc(${screens} * 100svh)`}}/>
 </>;
}
