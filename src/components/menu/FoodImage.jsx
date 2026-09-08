"use client";
import {useState} from "react";
import Image from "next/image";
import Icon from "@/components/site/Icon";
export default function FoodImage({src,fallback,alt,sizes="(max-width: 639px) 100vw, (max-width: 1023px) 50vw, 33vw",className="",preload=false}){
 const [failed,setFailed]=useState(0);
 const image=failed===0?src:failed===1?fallback:null;
 return <div className={"food-image "+className}>
  {image?<Image src={image} alt={alt} fill sizes={sizes} preload={preload} className="object-cover" onError={()=>setFailed(value=>value+1)}/>
   :<div className="image-placeholder"><Icon name="food" size={36}/><span>{alt}</span><small>Image unavailable</small></div>}
 </div>;
}
