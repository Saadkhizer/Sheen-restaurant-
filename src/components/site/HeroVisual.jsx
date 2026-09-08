"use client";
import {useRef} from "react";
import {motion,useMotionValue,useSpring,useReducedMotion} from "framer-motion";
import Image from "next/image";
import Icon from "./Icon";
import {rupees} from "@/lib/money";
export default function HeroVisual({item}){
 const stage=useRef(null);const reduced=useReducedMotion();
 const x=useMotionValue(0);const y=useMotionValue(0);
 const rotateX=useSpring(y,{stiffness:100,damping:25});const rotateY=useSpring(x,{stiffness:100,damping:25});
 function move(event){
  if(reduced||event.pointerType!=="mouse"||!window.matchMedia("(min-width: 1024px)").matches)return;
  const rect=stage.current.getBoundingClientRect();
  x.set(((event.clientX-rect.left)/rect.width-.5)*8);
  y.set(-((event.clientY-rect.top)/rect.height-.5)*8);
 }
 return <div className="hero-visual" ref={stage} onPointerMove={move} onPointerLeave={()=>{x.set(0);y.set(0);}}>
  <div className="hero-orbit orbit-one"/><div className="hero-orbit orbit-two"/>
  <span className="hero-side-label" aria-hidden="true">THE SHEEN STATE OF MIND</span>
  <motion.div className="hero-food-stage" style={{rotateX:reduced?0:rotateX,rotateY:reduced?0:rotateY}}>
   <Image src="/images/hero-formal-sheen.webp" alt="Formal Sheen shawarma with grilled chicken, pickles and sauce" fill preload sizes="(max-width: 767px) 95vw, 55vw" className="hero-food"/>
  </motion.div>
   <span className="ingredient-label ingredient-one"><i/>Grilled chicken</span>
   <span className="ingredient-label ingredient-two"><i/>Garlic sauce</span>
  <div className="hero-stamp" aria-hidden="true"><Icon name="spark" size={23}/><span>WRAP.<br/>BITE.<br/>REPEAT.</span></div>
  {item&&<div className="hero-product-caption"><span><small>Meet your first Sheen</small><strong>{item.name}</strong></span><span>{rupees(item.price_paisa)}</span></div>}
 </div>;
}
