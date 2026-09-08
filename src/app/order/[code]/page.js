import {notFound} from "next/navigation";
import {IS_DEMO} from "@/lib/restaurantData";
import DemoReceipt from "./DemoReceipt";
export const metadata={title:"Demo Order",description:"Your prepared Sheen demonstration order.",robots:{index:false,follow:false}};
export default async function OrderPage({params}){
 const {code}=await params;
 if(!IS_DEMO||!/^DEMO-[A-F0-9]{8}$/.test(code))notFound();
 return <DemoReceipt code={code}/>;
}
// Production receipt access must be added with a strong token and access policy.
// The old short-code service-role lookup is intentionally not exposed.
