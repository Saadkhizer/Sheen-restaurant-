import {getMenu} from "@/lib/menu";
import MenuExplorer from "@/components/menu/MenuExplorer";
export const metadata={title:"The Menu",description:"Explore Sheen shawarmas, deals, sides and drinks. Choose your size, add extras and build your order.",alternates:{canonical:"/menu"}};
export default async function MenuPage(){const {categories,degraded}=await getMenu();return <MenuExplorer categories={categories} degraded={degraded}/>;}
