"use client";
import {useId,useState} from "react";
import {whatsappUrl} from "@/lib/orders/demo";
import Dialog from "./Dialog";
import Icon from "./Icon";
export default function WhatsAppPreview({open,onClose,message}){
 const id=useId();const [copied,setCopied]=useState(false);const [copyError,setCopyError]=useState("");
 const url=whatsappUrl(message);
 async function copy(){
  try{await navigator.clipboard.writeText(message);setCopied(true);setCopyError("");}
  catch{setCopyError("Copy is unavailable here. Select and copy the message below.");}
 }
 return <Dialog open={open} onClose={onClose} title="Your WhatsApp order" id={id}>
  <div className="whatsapp-content"><p>{url?"Review your message, then choose Open WhatsApp. You decide when to send it.":"This is a preview. Sheen’s WhatsApp number hasn’t been confirmed, so this message won’t be sent."}</p>
   <div className="preview-message" tabIndex={0} aria-label="WhatsApp message preview">{message}</div>
   <div className="whatsapp-actions">{url&&<a className="button button-teal" href={url} target="_blank" rel="noreferrer"><Icon name="chat"/>Open WhatsApp</a>}<button className="button button-outline" onClick={copy}>{copied?"Copied":"Copy message"}<Icon name={copied?"check":"chat"}/></button></div>
   <p role="status" className="field-hint">{copyError||(copied?"Message copied. Nothing has been sent.":"")}</p>
  </div>
 </Dialog>;
}
