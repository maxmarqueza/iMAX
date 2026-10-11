// Recorre la vista previa sin scroll: en cada sección espera y captura varios momentos de su animación
//   node vista-shots.mjs <salida> <ancho> <alto>
import fs from "node:fs";
import { execFileSync } from "node:child_process";
import { chromium } from "playwright-core";
const [out, W, H] = [process.argv[2], +process.argv[3], +process.argv[4]];
fs.mkdirSync(out, { recursive: true });
const mobile = W < 700;
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--autoplay-policy=no-user-gesture-required", "--use-angle=swiftshader", "--enable-unsafe-swiftshader"] });
const page = await browser.newPage({ viewport: { width: W, height: H }, isMobile: mobile, hasTouch: mobile });
const errors = []; page.on("pageerror", (e) => errors.push(e.message));
await page.goto(process.env.SITE || "http://localhost:4173/", { waitUntil: "networkidle" });
const files = [];
const shot = async (name) => { const f = `${out}/${String(files.length).padStart(2, "0")}-${name}.jpg`; await page.screenshot({ path: f, type: "jpeg", quality: 65 }); files.push(f); };
for (const t of [300, 1600, 2900, 3500, 4600]) { await page.waitForTimeout(t - (files.length ? [300, 1600, 2900, 3500, 4600][files.length - 1] : 0)); await shot("portada"); }
const go = async (sel, offset = 0) => {
  const y = await page.evaluate(([s, o]) => document.querySelector(s).getBoundingClientRect().top + scrollY + o, [sel, offset]);
  let cur = await page.evaluate(() => scrollY);
  while (Math.abs(cur - y) > 2) { cur += Math.sign(y - cur) * Math.min(120, Math.abs(y - cur)); await page.evaluate((v) => scrollTo(0, v), cur); await page.waitForTimeout(16); }
};
await go("#servicios"); await page.waitForTimeout(900); await shot("servicios");
await go("#anatomia"); for (const t of [1200, 2600, 2600, 2600]) { await page.waitForTimeout(t); await shot("polvo"); }
await go("#parque"); for (const t of [1200, 2500, 2500]) { await page.waitForTimeout(t); await shot("parque"); }
await go("#proceso"); for (const t of [1500, 2500, 2500, 2800]) { await page.waitForTimeout(t); await shot("proceso"); }
await go(".foot__scene"); for (const t of [700, 1400, 2200]) { await page.waitForTimeout(t); await shot("pie"); }
await browser.close();
const cols = 6;
for (let r = 0; r * cols < files.length; r++) {
  const part = files.slice(r * cols, r * cols + cols);
  if (part.length < 2) { fs.copyFileSync(part[0], `${out}/hoja-${r}.jpg`); continue; }
  execFileSync("/Users/max/.local/bin/ffmpeg", ["-nostdin", "-v", "error", "-y", ...part.flatMap((f) => ["-i", f]), "-filter_complex", `${part.map((_, j) => `[${j}]scale=${mobile ? 360 : 720}:-1[s${j}]`).join(";")};${part.map((_, j) => `[s${j}]`).join("")}hstack=inputs=${part.length}`, "-q:v", "4", `${out}/hoja-${r}.jpg`]);
}
console.log(files.length, "capturas", errors.length ? errors : "sin errores");
