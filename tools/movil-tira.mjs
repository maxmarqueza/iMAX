// Tira de cuadros en celular: avanza el scroll en pasos cortos (como un dedo) y captura cada tanto
//   node movil-tira.mjs <salida> <desde en pantallas> <hasta> <paso>
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright-core";
const [out, from, to, step] = process.argv.slice(2);
fs.mkdirSync(out, { recursive: true });
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--use-angle=swiftshader", "--enable-unsafe-swiftshader", "--autoplay-policy=no-user-gesture-required"] });
const page = await browser.newPage({ viewport: { width: +(process.env.W || 390), height: +(process.env.H || 844) }, deviceScaleFactor: 1, isMobile: !process.env.W, hasTouch: !process.env.W });
const errors = []; page.on("pageerror", (e) => errors.push(e.message));
await page.goto(process.env.SITE || "http://localhost:4173/", { waitUntil: "networkidle" });
await page.waitForTimeout(2600);
const vh = await page.evaluate(() => innerHeight);
let y = 0, i = 0;
const files = [];
for (let k = +from; k <= +to + 1e-6; k += +step) {
  const target = Math.round(k * vh);
  while (y < target) { y = Math.min(target, y + 60); await page.evaluate((y) => scrollTo({ top: y, behavior: "instant" }), y); await page.waitForTimeout(30); }
  await page.waitForTimeout(700);
  const f = `${out}/${String(i++).padStart(2, "0")}.jpg`;
  await page.screenshot({ path: f, type: "jpeg", quality: 70 });
  files.push(f);
}
await browser.close();
const cols = 9;
const rows = Math.ceil(files.length / cols);
for (let r = 0; r < rows; r++) {
  const part = files.slice(r * cols, r * cols + cols);
  const args = part.flatMap((f) => ["-i", f]);
  if (part.length < 2) { fs.copyFileSync(part[0], `${out}/fila-${r}.jpg`); continue; }
  execFileSync("/Users/max/.local/bin/ffmpeg", ["-nostdin", "-v", "error", "-y", ...args, "-filter_complex", `${part.map((_, j) => `[${j}]`).join("")}hstack=inputs=${part.length}`, "-q:v", "4", `${out}/fila-${r}.jpg`]);
}
console.log(files.length, "cuadros", errors);
