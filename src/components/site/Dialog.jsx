"use client";
import {useEffect,useRef} from "react";
import {AnimatePresence,motion,useReducedMotion} from "framer-motion";
import Icon from "./Icon";
export default function Dialog({open,onClose,title,id,children,variant="sheet"}){
 const dialog=useRef(null);
 const trigger=useRef(null);
 const restoreOverflow=useRef("");
 const reduce=useReducedMotion();
 useEffect(()=>{
  const element=dialog.current;
  if(open&&!element.open){
   trigger.current=document.activeElement;
   restoreOverflow.current=document.body.style.overflow;
   element.showModal();
   document.body.style.overflow="hidden";
  }
 },[open]);
 useEffect(()=>{
  const element=dialog.current;
  return()=>{if(element.open){element.close();if(!document.querySelector("dialog[open]"))document.body.style.overflow=restoreOverflow.current;}};
 },[]);
 function containFocus(event){
  if(event.key!=="Tab")return;
  const element=dialog.current;
  const controls=[...element.querySelectorAll('a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])')].filter(node=>node.getClientRects().length&&getComputedStyle(node).visibility!=="hidden");
  const first=controls[0],last=controls.at(-1);
  if(!first){event.preventDefault();return;}
  if(event.shiftKey&&(document.activeElement===first||!element.contains(document.activeElement))){event.preventDefault();last.focus();}
  else if(!event.shiftKey&&(document.activeElement===last||!element.contains(document.activeElement))){event.preventDefault();first.focus();}
 }
 const finishClose=()=>{
  if(!open&&dialog.current?.open){
   dialog.current.close();
   if(!document.querySelector("dialog[open]")){
    document.body.style.overflow=restoreOverflow.current;
    if(trigger.current?.isConnected)trigger.current.focus({preventScroll:true});
   }
  }
 };
 return <dialog ref={dialog} className={"sheen-dialog "+variant} aria-labelledby={id}
 onKeyDown={containFocus}
 onCancel={event=>{event.preventDefault();onClose();}}
 onClick={event=>{if(event.target===dialog.current)onClose();}}>
  <AnimatePresence onExitComplete={finishClose}>
   {open&&<motion.div key="content" className="dialog-panel"
    initial={reduce?{opacity:0}:{opacity:0,x:variant==="drawer"?40:0,y:variant==="drawer"?0:30}}
    animate={{opacity:1,x:0,y:0}} exit={reduce?{opacity:0}:{opacity:0,x:variant==="drawer"?40:0,y:variant==="drawer"?0:20}}
    transition={{duration:reduce?.01:.24,ease:[.22,1,.36,1]}}>
    <div className="dialog-heading"><h2 id={id}>{title}</h2><button className="icon-button" type="button" onClick={onClose} aria-label={"Close "+title}><Icon name="close"/></button></div>
    {children}
   </motion.div>}
  </AnimatePresence>
 </dialog>;
}
