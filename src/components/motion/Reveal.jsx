"use client";
import {motion,useReducedMotion} from "framer-motion";
export default function Reveal({children,delay=0,className=""}){
 const reduce=useReducedMotion();
 return <motion.div className={className} initial={false} whileInView={reduce?{}:{y:[14,0]}} viewport={{once:true,amount:.12}} transition={{duration:.55,delay:reduce?0:delay,ease:[.22,1,.36,1]}}>{children}</motion.div>;
}
