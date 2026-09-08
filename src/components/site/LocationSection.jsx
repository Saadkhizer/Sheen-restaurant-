import {restaurant,directionsUrl} from "@/lib/restaurantData";
import Icon from "./Icon";
export default function LocationSection(){
 return <section id="find" className="location-section section-pad"><div className="container location-grid">
  <div className="location-copy"><p className="eyebrow">Come find your Sheen</p><h2>YOUR NEXT STOP.<br/><span className="orange-text">BAHRIA ENCLAVE.</span></h2><p className="location-address">{restaurant.address}</p><a className="button button-teal" href={directionsUrl} target="_blank" rel="noreferrer">Find the address <Icon name="arrow"/></a><div className="location-socials"><a href={restaurant.links.instagram} target="_blank" rel="noreferrer">Instagram ↗</a><a href={restaurant.links.foodpanda} target="_blank" rel="noreferrer">Foodpanda ↗</a>{restaurant.phone&&<a href={"tel:"+restaurant.phone}>Call Sheen</a>}</div></div>
  <div className="visit-card"><div className="visit-card-top"><span className="eyebrow">Dine in · Take away</span><Icon name="pin" size={35}/></div><div className="visit-place"><span>ISLAMABAD</span><strong>ESCAPE<br/>HEIGHTS.</strong><p>Bahria Enclave</p></div><div className="hours-list"><h3><Icon name="clock" size={18}/> Listing hours</h3>{restaurant.hours.lines.map(line=><div key={line.days}><span>{line.days}</span><strong>{line.time}</strong></div>)}<p>{restaurant.hours.note}</p></div>
  {restaurant.map.embedUrl&&<iframe src={restaurant.map.embedUrl} title="Sheen location" loading="lazy" className="verified-map"/>}
  </div>
 </div></section>;
}
