/** Listing-derived demo content; owner confirmation is required before launch. */
export const restaurant = {
 name:"Sheen", fullName:"Sheen Shawarma", locality:"Bahria Enclave", city:"Islamabad",
 address:"Shop 1, Escape Heights, Plaza 61, First Floor, Sector G, Avenue 1, Bahria Enclave, Islamabad",
 shortAddress:"Escape Heights · Bahria Enclave, Islamabad", phone:null, whatsapp:null,
 map:{placeId:null,embedUrl:null,coordinates:null},
 hours:{verified:false,lines:[{days:"Monday–Thursday, Saturday & Sunday",time:"2pm–12am"},{days:"Friday",time:"From 3pm"}],note:"Listing hours shown. Confirm current hours with the restaurant."},
 delivery:{feePaisa:9900,minimumPaisa:50000,verified:false,eta:null},
 reviews:{verified:false,rating:null,count:null,testimonials:[]},
 links:{instagram:"https://www.instagram.com/sheen4shawarma/",foodpanda:"https://www.foodpanda.pk/restaurant/wgrb/sheen-wgrb",facebook:"https://www.facebook.com/p/Sheen-Shawarmas-61560487044592/"},
 source:"Foodpanda listing and existing project brand brief",verified:false,
};
export const ORDER_MODE=process.env.NEXT_PUBLIC_ORDER_MODE==="production"?"production":"demo";
export const IS_DEMO=ORDER_MODE==="demo";
export const directionsUrl="https://www.google.com/maps/search/?api=1&query="+encodeURIComponent(restaurant.address);
export const siteUrl=process.env.NEXT_PUBLIC_SITE_URL||"http://localhost:3000";
export function restaurantSchema(){
 if(!restaurant.verified||IS_DEMO||!process.env.NEXT_PUBLIC_SITE_URL)return null;
 return {"@context":"https://schema.org","@type":"Restaurant",name:restaurant.fullName,url:siteUrl,address:restaurant.address,...(restaurant.phone?{telephone:restaurant.phone}:{}),sameAs:Object.values(restaurant.links).filter(Boolean),hasMenu:new URL("/menu",siteUrl).href};
}
