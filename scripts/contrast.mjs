import {readFileSync} from "node:fs";
import assert from "node:assert/strict";
const css=readFileSync(new URL("../src/app/globals.css",import.meta.url),"utf8");
const tokens=Object.fromEntries([...css.matchAll(/--([\w-]+):\s*(#[\da-f]{6})/gi)].map(m=>[m[1],m[2]]));
function luminance(hex){const c=hex.slice(1).match(/../g).map(v=>parseInt(v,16)/255).map(v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4);return c[0]*.2126+c[1]*.7152+c[2]*.0722;}
const pairs=[["text-primary","surface-cream"],["text-secondary","surface-cream"],["text-secondary","brand-teal-soft"],["on-teal","brand-teal"],["on-teal","brand-teal-dark"],["on-orange","brand-orange"],["brand-orange-ink","surface-cream"],["danger","surface-white"]];
for(const [fg,bg] of pairs){const a=luminance(tokens[fg]),b=luminance(tokens[bg]),ratio=(Math.max(a,b)+.05)/(Math.min(a,b)+.05);console.log(fg+" on "+bg+": "+ratio.toFixed(2)+":1");assert.ok(ratio>=4.5,fg+" / "+bg+" fails normal-text AA");}
