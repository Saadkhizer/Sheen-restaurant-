import {test,expect} from "@playwright/test";
import {DEMO_ITEMS} from "../../src/lib/catalogue.js";
import {buildCartLine} from "../../src/lib/cartModel.js";
const seed=buildCartLine(DEMO_ITEMS.find(i=>i.slug==="formal-sheen"),{qty:2,size:"Regular",extras:[DEMO_ITEMS.find(i=>i.slug==="cheese")]});
async function seedCart(page){await page.addInitScript(line=>{if(!localStorage.getItem("browser-test-seeded")){localStorage.setItem("sheen.cart.v2.demo",JSON.stringify([line]));localStorage.setItem("browser-test-seeded","1");}},seed);}
async function noOverflow(page){expect(await page.evaluate(()=>({width:innerWidth,scroll:document.documentElement.scrollWidth}))).toEqual({width:page.viewportSize().width,scroll:page.viewportSize().width});}
async function fillCustomer(page){await page.getByLabel("Your name",{exact:true}).fill("Demo Guest");await page.getByLabel("Mobile number",{exact:true}).fill("03001234567");await page.getByLabel("Delivery address",{exact:true}).fill("Sample house 10, Sector G");}
async function imagesReady(page){await page.evaluate(async()=>{await document.fonts.ready;await Promise.all([...document.images].filter(i=>i.loading!=="lazy").map(i=>i.decode().catch(()=>{})));});}
for(const width of [320,375,390,430,768,1024,1280,1440,1920]){
 test("responsive customer journey "+width,async({page},testInfo)=>{
  await page.setViewportSize({width,height:width<768?844:1000});
  const errors=[];page.on("pageerror",error=>errors.push(error.message));
  await seedCart(page);await page.goto("/");await expect(page.getByRole("heading",{level:1})).toContainText("SHAWARMA");
  await page.locator("img").evaluateAll(imgs=>imgs.forEach(img=>img.loading="eager"));await expect.poll(()=>page.locator("img").evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0))).toBe(true);await imagesReady(page);await noOverflow(page);await page.screenshot({path:testInfo.outputPath("home.png"),fullPage:true,animations:"disabled"});await page.locator(".hero").screenshot({path:testInfo.outputPath("hero.png"),animations:"disabled"});
  await page.goto("/menu");await expect(page.getByRole("status").filter({hasText:"37 items"})).toBeVisible();await noOverflow(page);await page.screenshot({path:testInfo.outputPath("menu.png"),animations:"disabled"});
  await page.getByRole("button",{name:"View Formal Sheen",exact:true}).click();const sheet=page.getByRole("dialog",{name:"Make it your Sheen"});
  await expect(sheet).toBeVisible();await noOverflow(page);await page.screenshot({path:testInfo.outputPath("product.png"),animations:"disabled"});
  await page.keyboard.press("Escape");await expect(sheet).not.toBeVisible();
  await page.getByRole("button",{name:"Open cart, 2 items",exact:true}).first().click();const bag=page.getByRole("dialog",{name:"Your bag (2)",exact:true});await expect(bag).toBeVisible();await noOverflow(page);await page.screenshot({path:testInfo.outputPath("cart.png"),animations:"disabled"});
  await bag.getByRole("link",{name:"Continue to checkout"}).click();await expect(page).toHaveURL("/checkout");await expect(bag).not.toBeVisible();await noOverflow(page);
  await fillCustomer(page);await page.screenshot({path:testInfo.outputPath("checkout.png"),fullPage:true,animations:"disabled"});
  await page.getByRole("button",{name:"Prepare demo order"}).click();await expect(page).toHaveURL(/\/order\/DEMO-[A-F0-9]{8}$/);
  await expect(page.getByRole("heading",{level:1})).toContainText("PREPARED");await noOverflow(page);
  await page.screenshot({path:testInfo.outputPath("receipt.png"),fullPage:true,animations:"disabled"});expect(errors).toEqual([]);
 });
}
test("search, categories, empty results, keyboard focus, required choices and customization",async({page})=>{
 await page.goto("/menu");await page.getByRole("searchbox",{name:"Search the menu"}).fill("nothing matches");
 await expect(page.getByRole("heading",{name:"No bites found."})).toBeVisible();await page.getByRole("button",{name:"See the whole menu"}).click();
 await page.getByRole("button",{name:"Something to sip",exact:true}).click();await expect(page.getByRole("status").filter({hasText:"3 items"})).toBeVisible();
 await page.getByRole("button",{name:"Everything",exact:true}).click();
 const trigger=page.getByRole("button",{name:"View Formal Sheen",exact:true});await trigger.click();const modal=page.getByRole("dialog",{name:"Make it your Sheen"});
 await expect(modal).toBeVisible();for(let n=0;n<18;n++){await page.keyboard.press("Tab");expect(await modal.evaluate(el=>el.contains(document.activeElement))).toBe(true);}
 await page.keyboard.press("Escape");await expect(modal).not.toBeVisible();await expect(trigger).toBeFocused();
 await trigger.click();await modal.getByRole("checkbox",{name:/Cheese/}).check();await modal.getByRole("button",{name:"Increase quantity of Formal Sheen",exact:true}).click();
 await expect(modal.getByRole("button",{name:/Add to bag/})).toContainText("1,998");await modal.getByRole("button",{name:/Add to bag/}).click();
 const bag=page.getByRole("dialog",{name:"Your bag (2)",exact:true});await expect(bag).toBeVisible();await expect(bag).toContainText("Extra: Cheese");await page.keyboard.press("Escape");await expect(bag).not.toBeVisible();
 await page.getByRole("button",{name:"Deals Sheels",exact:true}).click();
 await page.locator(".deal-card").filter({has:page.getByRole("heading",{name:"Solo Sheen",exact:true})}).getByRole("button").click();
 await expect(modal.getByRole("button",{name:/Choose your shawarma/})).toBeDisabled();await modal.getByRole("radio",{name:"KF Sheen",exact:true}).check();await modal.getByRole("button",{name:/Add to bag/}).click();
 await expect(page.getByRole("dialog",{name:"Your bag (3)",exact:true})).toContainText("KF Sheen");
 await page.reload();await page.getByRole("button",{name:"Open cart, 3 items",exact:true}).first().click();await expect(page.getByRole("dialog",{name:"Your bag (3)",exact:true})).toContainText("Extra: Cheese");
});
test("validation, WhatsApp preview, takeaway, receipt refresh and old receipt cart safety",async({page})=>{
 const writes=[];page.on("request",r=>{if(r.method()==="POST"||r.url().includes("supabase"))writes.push(r.url());});
 await seedCart(page);await page.goto("/checkout");await page.getByRole("button",{name:"Prepare demo order"}).click();
 await expect(page.getByRole("alert").filter({hasText:"highlighted"})).toContainText("highlighted");await expect(page.getByLabel("Your name",{exact:true})).toBeFocused();
 await fillCustomer(page);await page.getByRole("button",{name:"Preview WhatsApp order"}).click();const preview=page.getByRole("dialog",{name:"Your WhatsApp order"});
 await expect(preview).toContainText("2 × Formal Sheen");await expect(preview).toContainText("Extra: Cheese");await expect(preview).toContainText("2,097");await expect(preview.locator('a[href*="wa.me"]')).toHaveCount(0);
 await preview.getByRole("button",{name:"Copy message"}).click();await expect(preview.getByRole("button",{name:"Copied"})).toBeVisible();await page.keyboard.press("Escape");await expect(preview).not.toBeVisible();
 await page.getByRole("radio",{name:"Takeaway",exact:true}).check();await expect(page.getByLabel("Delivery address",{exact:true})).toHaveCount(0);await expect(page.locator(".totals")).toContainText("1,998");
 await page.getByRole("button",{name:"Prepare demo order"}).click();await expect(page).toHaveURL(/\/order\/DEMO-/);const receipt=page.url();
 await expect(page.getByRole("heading",{level:1})).toContainText("PREPARED");await page.reload();await expect(page.getByRole("heading",{level:1})).toContainText("PREPARED");
 await page.getByRole("button",{name:"Preview next status"}).click();await expect(page.locator('[aria-current="step"]')).toHaveText("Preparing");
 await page.getByRole("button",{name:"Preview next status"}).click();await expect(page.locator('[aria-current="step"]')).toHaveText("Ready to collect");
 expect(writes).toEqual([]);await page.goto("/menu#sides");await page.locator(".menu-card").filter({has:page.getByRole("heading",{name:"Plain Fries",exact:true})}).getByRole("button",{name:/Add/}).click();
 await page.goto(receipt);await expect(page.getByRole("button",{name:"Open cart, 1 items",exact:true}).first()).toBeVisible();
 await page.goto("/checkout");await page.getByRole("button",{name:"Remove Plain Fries"}).click();await expect(page.getByRole("heading",{name:"Your bag is still hungry."})).toBeVisible();await expect(page).toHaveURL("/checkout");
});
test("mobile navigation closes, restores focus, and reduced motion is respected",async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.emulateMedia({reducedMotion:"reduce"});await page.goto("/");
 const trigger=page.getByRole("button",{name:"Open navigation"});await trigger.click();const nav=page.getByRole("dialog",{name:"Explore Sheen"});await expect(nav).toBeVisible();
 await page.keyboard.press("Escape");await expect(nav).not.toBeVisible();await expect(trigger).toBeFocused();await trigger.click();
 await nav.getByRole("link",{name:/Deals/}).click();await expect(page).toHaveURL("/menu#deals");await expect(nav).not.toBeVisible();await expect(page.getByRole("button",{name:"Deals Sheels",exact:true})).toHaveAttribute("aria-pressed","true");
 expect(await page.evaluate(()=>getComputedStyle(document.documentElement).scrollBehavior)).toBe("auto");
});
test("malformed storage, missing receipt, 404 and demo SEO",async({page,request})=>{
 await page.addInitScript(()=>localStorage.setItem("sheen.cart.v2.demo","{broken"));await page.goto("/checkout");await expect(page.getByRole("heading",{name:"Your bag is still hungry."})).toBeVisible();
 await page.goto("/order/DEMO-00000000");await expect(page.getByRole("heading",{name:"This demo isn’t in this tab."})).toBeVisible();
 const response=await page.goto("/not-a-route");expect(response.status()).toBe(404);
 await page.goto("/");await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content",/noindex/);await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0);
 expect(await (await request.get("/robots.txt")).text()).toContain("Disallow: /");expect((await request.get("/images/sheen-social.jpg")).ok()).toBe(true);
});
test("all menu images load locally without CDN or application errors",async({page})=>{
 const errors=[],remote=[];page.on("pageerror",e=>errors.push(e.message));page.on("console",m=>{if(m.type()==="error")errors.push(m.text());});page.on("request",r=>{if(/deliveryhero|supabase/.test(r.url()))remote.push(r.url());});
 await page.goto("/menu");await page.locator("img").evaluateAll(imgs=>imgs.forEach(img=>img.loading="eager"));
 await expect.poll(()=>page.locator("img").evaluateAll(imgs=>imgs.every(img=>img.complete&&img.naturalWidth>0)),{timeout:45000}).toBe(true);
 expect(remote).toEqual([]);expect(errors).toEqual([]);
});

test("image failure uses a branded fallback and blocked storage still permits an in-memory demo",async({page})=>{
 await page.route("**/_next/image?**",route=>route.fulfill({status:404,body:"Test image unavailable"}));
 await page.goto("/menu");await expect(page.locator(".menu-card").first().getByText("Image unavailable")).toBeVisible();
 await page.unroute("**/_next/image?**");
 await page.addInitScript(()=>{for(const key of ["localStorage","sessionStorage"])Object.defineProperty(window,key,{configurable:true,get(){throw new DOMException("Storage disabled","SecurityError");}});});
 await page.goto("/menu");await page.getByRole("button",{name:"View Formal Sheen",exact:true}).click();
 await page.getByRole("dialog",{name:"Make it your Sheen"}).getByRole("button",{name:/Add to bag/}).click();
 const bag=page.getByRole("dialog",{name:"Your bag (1)",exact:true});await expect(bag).toBeVisible();await bag.getByRole("link",{name:"Continue to checkout"}).click();await expect(bag).not.toBeVisible();
 await fillCustomer(page);await page.getByRole("button",{name:"Prepare demo order"}).click();await expect(page.getByRole("heading",{level:1})).toContainText("PREPARED");
});
