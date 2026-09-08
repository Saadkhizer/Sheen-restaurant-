import {IS_DEMO,siteUrl} from "@/lib/restaurantData";
export default function robots(){return {rules:IS_DEMO?{userAgent:"*",disallow:"/"}:{userAgent:"*",allow:"/",disallow:["/checkout","/order/","/admin","/login"]},...(!IS_DEMO?{sitemap:new URL("/sitemap.xml",siteUrl).href}:{})};}
