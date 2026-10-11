import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--autoplay-policy=no-user-gesture-required"] });
for (const [W, H] of [[1440, 900], [390, 844]]) {
  const page = await browser.newPage({ viewport: { width: W, height: H }, isMobile: W < 700 });
  const errs = []; page.on("pageerror", (e) => errs.push(e.message));
  await page.goto("http://localhost:4173/opciones/secciones/polvo/", { waitUntil: "load" });
  for (const [i, y] of [[0, 0], [1, 1], [2, 2]]) {
    await page.evaluate((i) => document.querySelectorAll(".op")[i].scrollIntoView(), i);
    await page.waitForTimeout(5500);
    await page.screenshot({ path: `lab/solo-${W}-${i}.jpg`, type: "jpeg", quality: 65 });
  }
  console.log(W, errs.length ? errs : "sin errores");
  await page.close();
}
await browser.close();
