"use client";
export default function CategoryNav({categories,active,onChange}){
 return <nav className="category-nav" aria-label="Menu categories"><div className="category-track">
 {[{slug:"all",name:"Everything"},...categories].map(category=><button key={category.slug} type="button" className={"category-chip"+(active===category.slug?" active":"")} aria-pressed={active===category.slug} onClick={()=>onChange(category.slug)}>{category.name}</button>)}
 </div></nav>;
}
