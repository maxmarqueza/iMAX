import { chromium } from "playwright-core";
const browser = await chromium.launch({ executablePath: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome", headless: true, args: ["--autoplay-policy=no-user-gesture-required"] });
for (const [w, h, dpr, m] of [[1440, 900, 2, false], [1440, 900, 1, false], [390, 844, 3, true]]) {
  const p = await browser.newPage({ viewport: { width: w, height: h }, deviceScaleFactor: dpr, isMobile: m });
  await p.goto("http://localhost:4173/#anatomia", { waitUntil: "load" });
  await p.waitForTimeout(3000);
  console.log(w, "dpr", dpr, await p.evaluate(() => [...document.querySelectorAll("video")].map((v) => (v.currentSrc || v.src || "-").split("/").pop()).join(" ")));
  await p.close();
}
await browser.close();
