"use client";
import {createContext,useCallback,useContext,useEffect,useMemo,useReducer,useState} from "react";
import {cartReducer,sanitizeCart,MAX_QUANTITY} from "./cartModel.js";
const CartContext=createContext(null);
export function CartProvider({children,catalogue,mode}){
 const [items,dispatch]=useReducer(cartReducer,[]);
 const [ready,setReady]=useState(false);
 const [isOpen,setIsOpen]=useState(false);
 const [announcement,setAnnouncement]=useState("");
 const storageKey="sheen.cart.v2."+mode;
 useEffect(()=>{
  let stored=[];
  try{stored=sanitizeCart(JSON.parse(localStorage.getItem(storageKey)||"[]"),catalogue);}catch{}
  dispatch({type:"hydrate",items:stored});
  // Browser persistence is intentionally restored after SSR.
  // eslint-disable-next-line react-hooks/set-state-in-effect
  setReady(true);
 },[catalogue,storageKey]);
 useEffect(()=>{if(ready){try{localStorage.setItem(storageKey,JSON.stringify(items));}catch{}}},[items,ready,storageKey]);
 const addLine=useCallback((candidate,showDrawer=true)=>{
  const [line]=sanitizeCart([candidate],catalogue);
  if(!line)return false;
  dispatch({type:"add",line});setAnnouncement(line.name+" added to your order.");
  if(showDrawer)setIsOpen(true);return true;
 },[catalogue]);
 const setQuantity=useCallback((key,qty)=>{
  if(Number.isInteger(qty)&&qty>=0&&qty<=MAX_QUANTITY)dispatch({type:"quantity",key,qty});
 },[]);
 const remove=useCallback(key=>dispatch({type:"remove",key}),[]);
 const complete=useCallback(keys=>dispatch({type:"complete",keys}),[]);
 const clear=useCallback(()=>dispatch({type:"clear"}),[]);
 const open=useCallback(()=>setIsOpen(true),[]);
 const close=useCallback(()=>setIsOpen(false),[]);
 const value=useMemo(()=>({items,ready,isOpen,addLine,setQuantity,remove,complete,clear,open,close,catalogue,mode,
 count:items.reduce((sum,line)=>sum+line.qty,0),subtotal:items.reduce((sum,line)=>sum+line.unitPrice*line.qty,0)
 }),[items,ready,isOpen,addLine,setQuantity,remove,complete,clear,open,close,catalogue,mode]);
 return <CartContext.Provider value={value}>{children}<span className="sr-only" role="status" aria-live="polite">{announcement}</span></CartContext.Provider>;
}
export function useCart(){const value=useContext(CartContext);if(!value)throw new Error("useCart requires CartProvider");return value;}
