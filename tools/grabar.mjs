// Graba cómo se ve una sección (su animación) y deja un .mp4 por tamaño de pantalla.
// Uso: node tools/grabar.mjs <id-de-seccion> <ms> <carpeta-salida> [url-base] [tamaños]
//   node tools/grabar.mjs inicio 6500 /tmp/rec "http://localhost:4173/?v=hero-p&" 1440x900,390x844
// Toma los cuadros con el screencast de Chrome (no necesita el ffmpeg de Playwright) y los une con ffmpeg.
import { chromium } from "playwright-core";
import fs from "fs";
import { execFileSync } from "child_process";

const [id, ms, dir, base, sizes] = [process.argv[2], +(process.argv[3] || 6000), process.argv[4], process.argv[5] || "https://grupoimax.mx/?", process.argv[6] || "1440x900,390x844"];
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--autoplay-policy=no-user-gesture-required"] });
for (const [W, H] of sizes.split(",").map((s) => s.split("x").map(Number))) {
  const d = `${dir}/${W}`;
  fs.mkdirSync(d, { recursive: true });
  const page = await browser.newPage({ viewport: { width: W, height: H }, isMobile: W < 700, deviceScaleFactor: W < 700 ? 2 : 1 });
  const cdp = await page.context().newCDPSession(page);
  const frames = [];
  cdp.on("Page.screencastFrame", async (f) => {
    frames.push({ t: f.metadata.timestamp, data: f.data });
    await cdp.send("Page.screencastFrameAck", { sessionId: f.sessionId }).catch(() => {});
  });
  await page.goto(`${base}solo=${id}&nc=${Date.now()}`, { waitUntil: "commit" });
  await cdp.send("Page.startScreencast", { format: "jpeg", quality: 80, everyNthFrame: 1 });
  await page.waitForTimeout(ms);
  await cdp.send("Page.stopScreencast");
  let list = "";
  frames.forEach((f, i) => {
    const name = `f${String(i).padStart(4, "0")}.jpg`;
    fs.writeFileSync(`${d}/${name}`, Buffer.from(f.data, "base64"));
    const dur = i + 1 < frames.length ? frames[i + 1].t - f.t : 0.5;
    list += `file '${name}'\nduration ${dur.toFixed(3)}\n`;
  });
  fs.writeFileSync(`${d}/list.txt`, list);
  execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", `${d}/list.txt`, "-vf", "fps=30,scale=trunc(iw/2)*2:trunc(ih/2)*2,format=yuv420p", "-c:v", "libx264", "-crf", "22", `${dir}/${W}.mp4`]);
  console.log(W, frames.length, "cuadros →", `${dir}/${W}.mp4`);
  await page.close();
}
await browser.close();
