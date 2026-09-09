import {test,expect} from "@playwright/test";
const baseURL=process.env.PLAYWRIGHT_BASE_URL||"http://127.0.0.1:3000";

async function ready(page) {
 await page.locator("img").evaluateAll(images=>images.forEach(image=>image.loading="eager"));
 await page.evaluate(()=>document.fonts.ready);
 await expect.poll(()=>page.locator("img").evaluateAll(images=>images.every(image=>image.complete&&image.naturalWidth>0))).toBe(true);
}
for(const [width,height] of [[320,568],[360,800],[375,812],[390,844],[412,915],[430,932],[768,1024],[820,1180],[1024,768]]) {
 test("homepage polish "+width+"x"+height,async({page},info)=>{
  await page.setViewportSize({width,height});
  const errors=[];page.on("pageerror",e=>errors.push(e.message));page.on("console",m=>{if(m.type()==="error")errors.push(m.text());});
  await page.goto("/");await ready(page);
  await expect(page.getByRole("heading",{name:"BIG ON SHAWARMA.",exact:true})).toBeVisible();
  expect(await page.evaluate(()=>document.documentElement.scrollWidth)).toBe(width);
  if(width>=768){
   const photoTops=await page.locator(".deals-section .deal-photo").evaluateAll(nodes=>nodes.map(node=>node.getBoundingClientRect().top));
   expect(Math.max(...photoTops)-Math.min(...photoTops)).toBeLessThan(2);
  }
  const bounds=await page.locator(".hero-product-caption").boundingBox();
  const hero=await page.locator(".hero").boundingBox();
  expect(bounds.x).toBeGreaterThanOrEqual(0);expect(bounds.x+bounds.width).toBeLessThanOrEqual(width);
  expect(bounds.y+bounds.height).toBeLessThan(hero.y+hero.height);
  if(width===1366)expect(bounds.y+bounds.height).toBeLessThan(height);
  const photo=await page.locator(".hero-visual").boundingBox(),actions=await page.locator(".hero-actions").boundingBox();
  expect(actions.x+actions.width<=photo.x||actions.y+actions.height<=photo.y).toBe(true);
  if(width<768){
   const services=await page.locator(".hero-services").boundingBox();
   expect(services.y).toBeGreaterThan(photo.y+photo.height);
   expect(await page.locator(".picks-grid").evaluate(node=>getComputedStyle(node).gridTemplateColumns.split(" ").length)).toBe(1);
   expect(await page.locator(".deals-grid").evaluate(node=>node.scrollWidth>node.clientWidth)).toBe(true);
   for(const selector of [".hero-actions .button",".hero-secondary",".mobile-menu-trigger",".cart-trigger"]){
    const control=await page.locator(selector).first().boundingBox();
    expect(control.height).toBeGreaterThanOrEqual(44);
   }
  }
  await page.screenshot({path:info.outputPath("first-view.png"),animations:"disabled"});
  await page.screenshot({path:info.outputPath("homepage.png"),fullPage:true,animations:"disabled",style:".mobile-action-bar{visibility:hidden!important}"});
  for(const section of ["picks-section","deals-section","signature-section","location-section","site-footer"]) {
   await page.locator("."+section).scrollIntoViewIfNeeded();
   // Let intersection observers start their existing reveal before waiting for rest.
   await page.evaluate(()=>new Promise(resolve=>requestAnimationFrame(()=>requestAnimationFrame(resolve))));
   await expect.poll(()=>page.locator("."+section+" .picks-grid>div, ."+section+" .deals-grid>div").evaluateAll(nodes=>nodes.every(node=>getComputedStyle(node).transform==="none"))).toBe(true);
   await page.locator("."+section).screenshot({path:info.outputPath(section+".png"),animations:"disabled",style:".mobile-action-bar,.site-header{visibility:hidden!important}"});
  }
  expect(errors).toEqual([]);
 });
}
test("every visible homepage internal link keeps its intended destination",async({page})=>{
 test.setTimeout(90000);
 await page.goto("/");
 const links=await page.locator('a[href^="/"],a[href^="#"]').evaluateAll(nodes=>nodes.filter(node=>node.getClientRects().length&&getComputedStyle(node).position!=="absolute").map(node=>({href:node.getAttribute("href"),index:[...document.querySelectorAll('a[href="'+node.getAttribute("href")+'"]')].indexOf(node)})));
 for(const {href,index} of links) {
  await page.goto("/");
  const link=page.locator('a[href="'+href+'"]').nth(index);
  if(!(await link.isVisible()))continue;
  await link.click();
  await expect(page).toHaveURL(new URL(href,baseURL+"/").href);
 }
});
test("homepage product and signature actions still open the correct sheet",async({page})=>{
 await page.goto("/");
 for(const selector of [".picks-grid .card-image-button",".picks-grid .add-button",".deals-grid .deal-bottom button"]) {
  const controls=page.locator(selector),count=await controls.count();
  for(let index=0;index<count;index++){
   await controls.nth(index).click();const dialog=page.getByRole("dialog",{name:"Make it your Sheen"});
   await expect(dialog).toBeVisible();await expect(dialog.locator(".sheet-title")).toContainText("Rs");
   await page.keyboard.press("Escape");await expect(dialog).not.toBeVisible();
  }
 }
 const signature=page.locator(".signature-section");
 await signature.getByRole("button",{name:"02 The filling",exact:true}).click();
 await expect(signature.getByRole("heading",{level:2})).toContainText("CHICKEN.");
 await signature.getByRole("button",{name:"03 The finish",exact:true}).click();
 await expect(signature.getByRole("heading",{level:2})).toContainText("SAUCE ENERGY.");
 await signature.getByRole("button",{name:"Make this your order"}).click();
 await expect(page.getByRole("dialog",{name:"Make it your Sheen"})).toBeVisible();
});
test("Maps Instagram and Foodpanda open isolated tabs and preserve the homepage",async({page,context})=>{
 // Test browser navigation behavior independently of third-party availability.
 await context.route("https://**/*",route=>route.fulfill({status:200,contentType:"text/html",body:"<title>External destination test</title>"}));
 await page.goto("/");
 const links=page.locator('a[target="_blank"][href^="https://"]'),count=await links.count();
 expect(count).toBe(5);
 for(let index=0;index<count;index++){
  const link=links.nth(index),href=await link.getAttribute("href");
  await expect(link).toHaveAttribute("rel","noopener noreferrer");
  const popupPromise=page.waitForEvent("popup");
  await link.click();const popup=await popupPromise;
  await popup.waitForLoadState("domcontentloaded");expect(popup.url()).toBe(href);
  expect(await popup.evaluate(()=>window.opener===null)).toBe(true);
  await expect(page).toHaveURL(baseURL+"/");
  await popup.close();
 }
});
test("hero depth and reduced motion are preserved",async({page})=>{
 await page.goto("/");const visual=page.locator(".hero-visual"),stage=page.locator(".hero-food-stage");
 const box=await visual.boundingBox();await page.mouse.move(box.x+box.width*.85,box.y+box.height*.25);
 await expect.poll(()=>stage.evaluate(el=>getComputedStyle(el).transform)).not.toBe("none");
 await page.emulateMedia({reducedMotion:"reduce"});await page.reload();
 await expect(stage).toHaveCSS("transform","none");await expect(page.locator("html")).toHaveCSS("scroll-behavior","auto");
 await page.locator(".signature-section").getByRole("button",{name:"02 The filling",exact:true}).click();
 await expect(page.locator(".signature-media>div")).toHaveCSS("transform","none");
});
test("mobile navigation, product sheet and cart remain usable",async({page},info)=>{
 await page.setViewportSize({width:390,height:844});
 await page.goto("/");
 const menuTrigger=page.getByRole("button",{name:"Open navigation"});
 await menuTrigger.click();
 const navigation=page.getByRole("dialog",{name:"Explore Sheen"});
 await expect(navigation).toBeVisible();
 await page.screenshot({path:info.outputPath("mobile-navigation.png"),animations:"disabled"});
 await page.keyboard.press("Escape");
 await expect(navigation).not.toBeVisible();
 await expect(menuTrigger).toBeFocused();

 await page.locator(".picks-grid .add-button").first().click();
 const product=page.getByRole("dialog",{name:"Make it your Sheen"});
 await expect(product).toBeVisible();
 const productBounds=await product.locator(".dialog-panel").boundingBox();
 expect(productBounds.width).toBeLessThanOrEqual(390);
 expect(productBounds.height).toBeLessThanOrEqual(844);
 await expect(product.locator(".sheet-bottom")).toBeVisible();
 await page.screenshot({path:info.outputPath("product-sheet.png"),animations:"disabled"});
 await page.keyboard.press("Escape");

 const cartTrigger=page.locator(".site-header .cart-trigger");
 await cartTrigger.click();
 const cart=page.getByRole("dialog",{name:/Your bag/});
 await expect(cart).toBeVisible();
 const cartBounds=await cart.locator(".dialog-panel").boundingBox();
 expect(cartBounds.width).toBeLessThanOrEqual(390);
 expect(cartBounds.height).toBeLessThanOrEqual(844);
 await page.screenshot({path:info.outputPath("cart-drawer.png"),animations:"disabled"});
 await page.keyboard.press("Escape");
 await expect(cartTrigger).toBeFocused();

 await page.locator(".site-footer").scrollIntoViewIfNeeded();
 await page.evaluate(()=>window.scrollTo(0,document.documentElement.scrollHeight));
 const footer=await page.locator(".site-footer").boundingBox();
 const actionBar=await page.locator(".mobile-action-bar").boundingBox();
 expect(footer.y+footer.height).toBeLessThanOrEqual(actionBar.y+.5);
});
