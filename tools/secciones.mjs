// Dónde empieza y cuánto mide cada sección (en pantallas), en el tamaño pedido
import { chromium } from "playwright-core";
const [w, h] = process.argv.slice(2).map(Number);
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: w, height: h }, isMobile: w < 700, hasTouch: w < 700 });
await page.goto(process.env.SITE || "http://localhost:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);
const out = await page.evaluate(() => [...document.querySelectorAll("main > *")].map((el) => {
  const r = el.getBoundingClientRect();
  return `${(el.id || el.className).toString().slice(0, 22).padEnd(22)} top ${(r.top / innerHeight).toFixed(2).padStart(6)}  alto ${(r.height / innerHeight).toFixed(2).padStart(5)}  span ${el.dataset.scSpan || "-"} act ${el.dataset.scAct || "-"}`;
}).join("\n") + `\ntotal ${(document.documentElement.scrollHeight / innerHeight).toFixed(2)}`);
console.log(out);
await browser.close();
