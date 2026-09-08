import {IS_DEMO,siteUrl} from "@/lib/restaurantData";
export default function sitemap(){return IS_DEMO?[]:[{url:new URL("/",siteUrl).href,priority:1},{url:new URL("/menu",siteUrl).href,priority:.9}];}
