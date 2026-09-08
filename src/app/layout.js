import "./globals.css";
import localFont from "next/font/local";
import {getMenu} from "@/lib/menu";
import {IS_DEMO,restaurant,restaurantSchema,siteUrl} from "@/lib/restaurantData";
import Providers from "@/components/site/Providers";
import SiteHeader from "@/components/site/SiteHeader";
import SiteFooter from "@/components/site/SiteFooter";
import CartDrawer from "@/components/site/CartDrawer";
const heading=localFont({src:"../../node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-800-normal.woff2",variable:"--font-heading",weight:"800",display:"swap"});
const body=localFont({src:"../../node_modules/@fontsource-variable/dm-sans/files/dm-sans-latin-wght-normal.woff2",variable:"--font-body",weight:"100 1000",display:"swap"});
export const metadata={
 metadataBase:new URL(siteUrl),
 title:{default:"Sheen — Big on Shawarma",template:"%s · Sheen"},
 description:"Explore Sheen shawarmas, sides and sharing deals in "+restaurant.locality+", "+restaurant.city+". Find your next favourite.",
 openGraph:{type:"website",locale:"en_PK",siteName:restaurant.fullName,title:"Sheen — Big on Shawarma",description:"Your craving. Your Sheen. Explore shawarmas, sides and deals.",images:[{url:"/images/sheen-social.jpg",width:1200,height:630,alt:"Sheen Shawarma"}]},
 twitter:{card:"summary_large_image",title:"Sheen — Big on Shawarma",images:["/images/sheen-social.jpg"]},
 robots:IS_DEMO?{index:false,follow:false}:{index:true,follow:true},
};
export const viewport={width:"device-width",initialScale:1,themeColor:"#073f3b",viewportFit:"cover"};
export default async function RootLayout({children}){
 const {categories,mode}=await getMenu();
 const catalogue=categories.flatMap(category=>category.menu_items);
 const schema=restaurantSchema();
 return <html lang="en" className={heading.variable+" "+body.variable}><body>
  <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-background focus:p-4">Skip to content</a>
  <Providers catalogue={catalogue} mode={mode}><SiteHeader/><main id="main" tabIndex={-1}>{children}</main><SiteFooter/><CartDrawer/></Providers>
  {schema&&<script type="application/ld+json" dangerouslySetInnerHTML={{__html:JSON.stringify(schema).replace(/</g,"\\u003c")}}/>}
 </body></html>;
}
