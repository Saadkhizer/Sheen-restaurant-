import Link from "next/link";
import {restaurant,IS_DEMO} from "@/lib/restaurantData";
import Logo from "./Logo";
import Icon from "./Icon";
export default function SiteFooter(){
 return <footer className="site-footer"><div className="container"><div className="footer-top">
  <div><Link href="/" aria-label="Sheen home"><Logo className="footer-logo"/></Link><p>Shawarma. Sides. Your kind of Sheen.</p><span className="footer-location"><Icon name="pin" size={16}/>{restaurant.shortAddress}</span></div>
  <div className="footer-links"><h3>Come hungry.</h3><Link href="/menu">Explore menu</Link><Link href="/menu#deals">Deals Sheels</Link><Link href="/#find">Find us</Link><Link href="/checkout">Your order</Link></div>
  <div className="footer-links"><h3>Stay in the loop.</h3><a href={restaurant.links.instagram} target="_blank" rel="noopener noreferrer">Instagram ↗</a><a href={restaurant.links.foodpanda} target="_blank" rel="noopener noreferrer">Foodpanda ↗</a>{restaurant.phone&&<a href={"tel:"+restaurant.phone}>Call Sheen</a>}<Link className="button button-orange" href="/menu">Let’s order <Icon name="arrow"/></Link></div>
 </div><div className="footer-bottom"><span>© {new Date().getFullYear()} {restaurant.fullName}</span><span>{IS_DEMO?"A website concept for Sheen · Demo orders are not sent.":"Shawarma in "+restaurant.locality}</span></div></div></footer>;
}
