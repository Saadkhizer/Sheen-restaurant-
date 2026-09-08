"use client";
import {MotionConfig} from "framer-motion";
import {CartProvider} from "@/lib/cart";
export default function Providers({children,catalogue,mode}){
 return <MotionConfig reducedMotion="user"><CartProvider catalogue={catalogue} mode={mode}>{children}</CartProvider></MotionConfig>;
}
