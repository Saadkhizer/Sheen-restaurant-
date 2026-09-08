import sharp from "sharp";
import {execFile} from "node:child_process";
import {promisify} from "node:util";
const run=promisify(execFile);
import { readFile, writeFile, mkdir, stat } from "node:fs/promises";
import path from "node:path";
import { FALLBACK_MENU_IMAGES } from "../src/lib/menuImages.js";
const root = path.resolve(import.meta.dirname, "..");
const images = path.join(root, "public/images");
await mkdir(path.join(images, "menu"), {recursive:true});
let originalBytes=0, optimizedBytes=0;
for(const name of ["hero-formal-sheen","menu-af-sheen","menu-beef-sheen","menu-formal-sheen","signature-formal-sheen"]){
 const source=path.join(images,name+".png");
 const output=path.join(images,name+".webp");
 await sharp(source).rotate().resize({width:1400,withoutEnlargement:true}).webp({quality:86,effort:6}).toFile(output);
 originalBytes+=(await stat(source)).size; optimizedBytes+=(await stat(output)).size;
}
console.log("Original photos: "+originalBytes+" bytes; WebP photos: "+optimizedBytes+" bytes.");
const queue=Object.entries(FALLBACK_MENU_IMAGES);
const failures=[];
await Promise.all(Array.from({length:5},async()=>{
 for(let entry;(entry=queue.shift());){
  const [slug,url]=entry, destination=path.join(images,"menu",slug+".webp");
  try{await stat(destination);continue;}catch{}
  try{
   let buffer;
   try {
    const response=await fetch(url,{signal:AbortSignal.timeout(20000)});
    if(!response.ok)throw new Error("HTTP "+response.status);
    buffer=Buffer.from(await response.arrayBuffer());
   } catch {
    // Windows curl uses the system certificate store when Node cannot validate a CDN chain.
    const result=await run(process.platform==="win32"?"curl.exe":"curl",["--fail","--silent","--show-error","--location","--max-time","30",url],{encoding:"buffer",maxBuffer:10000000,windowsHide:true});
    buffer=result.stdout;
   }
   await sharp(buffer).rotate().resize({width:600,height:600,fit:"inside",withoutEnlargement:true}).webp({quality:84,effort:5}).toFile(destination);
   console.log("Saved "+slug);
  }catch(error){failures.push(slug);console.error(slug+": "+error.message);}
 }
}));
const svg=await readFile(path.join(root,"src/app/icon.svg"));
const icon=await sharp(svg).resize(64,64).png().toBuffer();
const header=Buffer.alloc(22);header.writeUInt16LE(1,2);header.writeUInt16LE(1,4);header[6]=64;header[7]=64;header.writeUInt16LE(1,10);header.writeUInt16LE(32,12);header.writeUInt32LE(icon.length,14);header.writeUInt32LE(22,18);
await writeFile(path.join(root,"src/app/favicon.ico"),Buffer.concat([header,icon]));
await sharp(svg).resize(180,180).png().toFile(path.join(root,"src/app/apple-icon.png"));
const photo=await sharp(path.join(images,"hero-formal-sheen.webp")).resize(630,630).toBuffer();
const artwork=Buffer.from('<svg width="1200" height="630"><rect width="1200" height="630" fill="#073f3b"/><text x="65" y="120" font-family="Arial" font-size="42" font-weight="bold" fill="#ff641f">SHEEN</text><text x="60" y="265" font-family="Arial" font-size="78" font-weight="bold" fill="#fff8ef">BIG ON</text><text x="60" y="355" font-family="Arial" font-size="68" font-weight="bold" fill="#fff8ef">SHAWARMA.</text><text x="65" y="525" font-family="Arial" font-size="24" fill="#fff8ef">Your craving. Your Sheen.</text></svg>');
await sharp(artwork).composite([{input:photo,left:570,top:0}]).jpeg({quality:90}).toFile(path.join(images,"sheen-social.jpg"));
if(failures.length){console.error("Retry npm run assets for: "+failures.join(", "));process.exitCode=1;}
